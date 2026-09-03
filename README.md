# Cooking Start

Mobile inventory-management application built with Expo, Node.js, Express, and MySQL.

## Files for setup

- `ip_std6730202602.sql` - database structure and sample product data. It intentionally contains no user account or password.
- `backend/` - Node.js API for login and product management.
- `backend/.env.example` - backend configuration template.
- `.env.example` - optional frontend API URL template.

## Run on another computer

1. Import `ip_std6730202602.sql` into a MySQL database using phpMyAdmin.
2. In `backend/`, copy `.env.example` to `.env` and fill in the database details. Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` to the demo login you want to use.
3. Run `npm install` and then `npm start` inside `backend/`.
4. In the project root, copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_BASE_URL` to the backend address, for example `http://localhost:3056/api`.
5. Run `npm install` and `npx expo start` in the project root.
6. Log in using the username and password configured in `backend/.env`.

Do not commit either `.env` file because they contain local credentials and server addresses.
