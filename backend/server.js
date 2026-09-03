require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { createHmac, randomBytes, scrypt: scryptCallback, timingSafeEqual } = require('crypto');
const { promisify } = require('util');

const app = express();
const port = process.env.PORT || 3056;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// MySQL Connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+07:00'
});

const PRODUCTS_TABLE = 'products';
const USERS_TABLE = 'users';
const JWT_SECRET = process.env.JWT_SECRET;
const scrypt = promisify(scryptCallback);

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const passwordHash = (await scrypt(password, salt, 64)).toString('hex');
  return `scrypt$${salt}$${passwordHash}`;
}

async function isPasswordValid(password, storedHash) {
  const [algorithm, salt, expectedHash] = String(storedHash).split('$');
  if (algorithm !== 'scrypt' || !salt || !expectedHash) return false;

  const actualHash = await scrypt(password, salt, 64);
  const expectedBuffer = Buffer.from(expectedHash, 'hex');
  return actualHash.length === expectedBuffer.length && timingSafeEqual(actualHash, expectedBuffer);
}

function createAccessToken(user) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      id: user.id,
      username: user.username,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 8 * 60 * 60,
    })
  ).toString('base64url');
  const signature = createHmac('sha256', JWT_SECRET).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${signature}`;
}

function verifyAccessToken(token) {
  const [header, payload, signature] = String(token).split('.');
  if (!header || !payload || !signature) throw new Error('Malformed token');

  const expectedSignature = createHmac('sha256', JWT_SECRET).update(`${header}.${payload}`).digest('base64url');
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) {
    throw new Error('Invalid token signature');
  }

  const decodedHeader = JSON.parse(Buffer.from(header, 'base64url').toString('utf8'));
  const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  if (decodedHeader.alg !== 'HS256' || !decodedPayload.exp || decodedPayload.exp <= Math.floor(Date.now() / 1000)) {
    throw new Error('Expired token');
  }
  return decodedPayload;
}

async function ensureUsersTable() {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS \`${USERS_TABLE}\` (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      passwordHash VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'admin',
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  );

  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) return;

  const [existingUsers] = await pool.query(
    `SELECT id FROM \`${USERS_TABLE}\` WHERE username = ? LIMIT 1`,
    [username]
  );
  if (existingUsers.length > 0) return;

  const passwordHash = await hashPassword(password);
  await pool.query(
    `INSERT INTO \`${USERS_TABLE}\` (username, passwordHash, role) VALUES (?, ?, 'admin')`,
    [username, passwordHash]
  );
  console.log(`Created the initial admin account: ${username}`);
}

function authToken(req, res, next) {
  if (!JWT_SECRET) {
    return res.status(500).json({ error: 'Server authentication is not configured' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    return res.status(403).json({ error: 'Invalid or expired access token' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

async function initialiseDatabase() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Connected to MySQL:', process.env.DB_NAME);
    conn.release();
    await ensureUsersTable();
    console.log('✅ Authentication tables are ready');
  } catch (err) {
    console.error('MySQL Failed:', err.message || err);
    if (err && err.stack) console.error(err.stack);
    throw err;
  }
}

// Root check
app.get('/api', (req, res) => {
  res.send('API is running');
});

// Login returns a JWT used by the app for all protected API requests.
app.post('/api/login', async (req, res) => {
  try {
    if (!JWT_SECRET) {
      return res.status(500).json({ error: 'Server authentication is not configured' });
    }

    const username = String(req.body?.username ?? '').trim();
    const password = String(req.body?.password ?? '');
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const [users] = await pool.query(
      `SELECT id, username, passwordHash, role FROM \`${USERS_TABLE}\` WHERE username = ? LIMIT 1`,
      [username]
    );
    const user = users[0];
    if (!user || !(await isPasswordValid(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Username or password is incorrect' });
    }

    const token = createAccessToken(user);
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    console.error('Login Error:', error.message || error);
    res.status(500).json({ error: 'Unable to sign in' });
  }
});

// GET products (with optional search query ?q=)
app.get('/api/products', authToken, async (req, res) => {
  try {
    const query = String(req.query.q ?? '').trim();
    let sql = `SELECT * FROM \`${PRODUCTS_TABLE}\``;
    const params = [];

    if (query) {
      sql += ` WHERE name LIKE ? OR category LIKE ? OR productCode LIKE ? OR brand LIKE ?`;
      const like = `%${query}%`;
      params.push(like, like, like, like);
    }

    sql += ` ORDER BY lastUpdate DESC`;

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (e) {
    console.error('Get Products Error:', e.message || e);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST add product
app.post('/api/products', authToken, requireAdmin, async (req, res) => {
  try {
    const body = req.body || {};
    const {
      name,
      description = null,
      category = null,
      price = null,
      itemCode = null,
      productCode = null,
      image = null,
      stock = 0,
      location = null,
      status = 'Active',
      brand = null,
      sizes = null,
      orderName = null
    } = body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const code = itemCode || productCode || null;

    const [result] = await pool.query(
      `INSERT INTO \`${PRODUCTS_TABLE}\`
        (name, description, category, price, productCode, image, stock, location, status, brand, sizes, orderName, lastUpdate)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [name, description, category, price, code, image, stock, location, status, brand, sizes, orderName]
    );

    res.status(201).json({ success: true, productId: result.insertId });
  } catch (e) {
    console.error('Create Product Error:', e.message || e);
    res.status(500).json({ error: 'Failed to create product: ' + (e.message || 'Unknown error') });
  }
});

// PUT edit product
app.put('/api/products/:id', authToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const {
      name,
      description = null,
      category = null,
      price = null,
      itemCode = null,
      productCode = null,
      image = null,
      stock = null,
      location = null,
      status = null,
      brand = null,
      sizes = null,
      orderName = null
    } = body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const code = itemCode || productCode || null;

    const [result] = await pool.query(
      `UPDATE \`${PRODUCTS_TABLE}\`
       SET name = ?, description = ?, category = ?, price = ?, productCode = ?, image = ?,
           stock = COALESCE(?, stock), location = COALESCE(?, location), status = COALESCE(?, status),
           brand = COALESCE(?, brand), sizes = COALESCE(?, sizes), orderName = COALESCE(?, orderName),
           lastUpdate = NOW()
       WHERE id = ?`,
      [name, description, category, price, code, image, stock, location, status, brand, sizes, orderName, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ success: true });
  } catch (e) {
    console.error('Update Product Error:', e.message || e);
    res.status(500).json({ error: 'Failed to update product: ' + (e.message || 'Unknown error') });
  }
});

// DELETE product
app.delete('/api/products/:id', authToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      `DELETE FROM \`${PRODUCTS_TABLE}\` WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete Product Error:', err.message || err);
    res.status(500).json({ error: 'Failed to delete product: ' + (err.message || 'Unknown error') });
  }
});

initialiseDatabase()
  .then(() => {
    app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 API running on port ${port}`);
    });
  })
  .catch(() => {
    process.exitCode = 1;
  });
