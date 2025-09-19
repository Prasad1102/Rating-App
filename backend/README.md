# Rating App Backend

## Features

- Express.js REST API with JWT authentication
- Sequelize ORM with migrations and seeders
- PostgreSQL database
- Role-based access: ADMIN, USER, OWNER
- Secure password hashing (bcrypt)
- Input validation (express-validator)
- CORS restricted to frontend origin
- Pagination, filtering, sorting on list endpoints

## Setup Instructions

1. **Create PostgreSQL database**  
   Example:  
   `createdb rating_app_db`

2. **Copy `.env.example` to `.env` and fill in values**

3. **Install dependencies**  
   `npm install`

4. **Run migrations**  
   `npm run migrate`

5. **Run seeders**  
   `npm run seed`

6. **Start the server**  
   `npm run dev`

- Server runs on [http://localhost:4000](http://localhost:4000)
- See [curl-commands.txt](./curl-commands.txt) for API testing
