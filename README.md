# TaskMSR - Production SaaS Task Manager

TaskMSR is a highly secure, robust, structured Task Management System built entirely on the MERN stack using a Clean Architecture design pattern. It features JWT HTTP-Only cookie authentication, AES encryption, status filtering, offset pagination, dynamic search, and an enterprise SaaS dashboard.

## Technical Stack
- **Frontend**: React.js, Vite, Axios, Pure Vanilla CSS (SaaS aesthetic layout).
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT).
- **Security**: Helmet, Express Rate Limiter, Express Mongo Sanitize, Cookie Parser.
- **Tooling**: Git, ESLint.

## Architecture Guidelines (Clean Architecture)
The backend was strictly decoupled from standard MVC to a multi-layer schema for scale:
- `controllers/`: Handles HTTP requests, validations, and mapping data into the structured JSON `{success, message, data, error}` format.
- `services/`: Encapsulates core business constraints (e.g. checking user ownership before deletion, password verification, hashing).
- `repositories/`: The database abstraction layer. Handles Mongoose queries directly.
- `utils/`: Reusable standalone logic (e.g. AES Encryption, standard response formatter, token generators).

## Security Features & Authentication
1. **HTTP-Only Secure Cookies:** JWTs are no longer stored in `localStorage` which is prone to XSS attacks. They are passed entirely through cookies.
2. **Refresh Token Flow:** Access Tokens are short-lived (15 mins), Refresh Tokens are long-lived (7 days). `/auth/refresh` keeps the user logged in silently.
3. **AES Payload Encryption:** An encryption utility securely ciphers payload data when needed before it enters database storage.
4. **Rate Limiting & NoSQL Injection Protection:** Block repetitive DDoS attempts and sanitize mongo constraints automatically.

## API Documentation
The API adheres strictly to REST principles, returning consistent response shapes.

### Auth
- `POST /api/v1/auth/register` - Create account (returns cookies).
- `POST /api/v1/auth/login` - Authenticate account (returns cookies).
- `POST /api/v1/auth/logout` - Clear specific tokens from client cookies.
- `POST /api/v1/auth/refresh` - Swap a valid refresh cookie for a new access cookie.

### Tasks
- `GET /api/v1/tasks` - Retrieve Tasks. Supports query strings:
  - `?page=1` & `?limit=6` (Pagination)
  - `?status=pending` (Database Status Filter)
  - `?search=hello` (Regex Title Search)
- `POST /api/v1/tasks` - Create Task.
- `PUT /api/v1/tasks/:id` - Update Task (Ownership enforced via Service layer).
- `DELETE /api/v1/tasks/:id` - Delete Task (Ownership enforced).

## Deployment Guide

### Backend (Render / Railway)
1. Fork/Clone the repository.
2. Link the web service to the internal GitHub repo.
3. Use Build Command: `npm install` and Start Command: `npm run dev`.
4. Environment Variables Required:
   - `PORT=5000`
   - `NODE_ENV=production`
   - `MONGO_URI=<Your MongoDB Atlas String>`
   - `JWT_SECRET=<Strong Secret>`
   - `JWT_REFRESH_SECRET=<Strong Secret>`
   - `ENCRYPTION_KEY=<32 Byte Hex Key>`

### Frontend (Vercel / Netlify)
1. Link Vercel/Netlify to existing repository.
2. Root Directory: `/frontend`.
3. Set environment variables:
   - `VITE_API_URL=https://<your-backend-render-domain>.com/api/v1`
4. Deploy the main branch.
