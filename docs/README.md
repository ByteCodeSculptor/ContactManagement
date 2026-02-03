# 📁 ContactManager Application

A full-stack PERN (PostgreSQL, Express, React, Node.js) application designed for efficient contact management. It features secure user authentication, real-time contact searching, and a responsive interface powered by Vite.

---

## 🚀 Key Features

- **Secure Authentication**: JWT-based login and registration with built-in password strength and email domain validation.  
- **Contact Management**: Create, Read, Update, and Delete (CRUD) operations for your personal contacts.  
- **Smart Search**: Instantly filter through your contact list via the dashboard.  
- **Favorites System**: Mark important contacts with a single click.  
- **Modern UI**: Clean, red-and-white themed interface with scoped styling to ensure a consistent experience across all pages.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Axios, React Router DOM  
- **Backend**: Node.js, Express.js  
- **Database**: PostgreSQL  
- **Security**: Bcrypt.js (Password hashing), JSON Web Tokens (Authentication)

---

## ⚡ Quick Start

### 1. Database Setup

Ensure you have PostgreSQL installed and running. Create a new database and execute the following schema:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    company VARCHAR(255),
    notes TEXT,
    tags VARCHAR(255),
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


2. Backend Configuration
Navigate to the backend directory:
cd backend
Install dependencies:
npm install
Create a .env file in the backend/ root:
DATABASE_URL=postgres://username:password@localhost:5432/your_db_name
JWT_SECRET=your_super_secret_key
PORT=5000
Start the server:
node src/server.js

3. Frontend Configuration
Open a new terminal and navigate to the frontend directory:
cd frontend
Install dependencies:
npm install
Create a .env file in the frontend/ root:
VITE_API_BASE_URL=http://localhost:5000
Start the development server:
npm run dev
📂 Project Structure
├── backend
│   ├── src
│   │   ├── middleware/      # Auth protection
│   │   ├── routes/          # Auth & Contact API endpoints
│   │   ├── db.js            # Database connection logic
│   │   └── server.js        # Entry point
│   └── .env                 # Backend environment variables
│
├── frontend
│   ├── src
│   │   ├── components/      # UI components
│   │   ├── context/         # Auth state management
│   │   ├── pages/           # Login, Dashboard, Details
│   │   └── index.css        # Global scoped styling
│   └── .env                 # Frontend environment variables



🛡️ Validation Rules
To ensure high security and data integrity, the following rules are enforced during registration:
Authorized Emails: Must end with @gmail.com, @outlook.com, or @yahoo.com.
Password Strength: Minimum 8 characters, must include at least one number and one special character.


📌 Future Improvements
Contact profile pictures
Tag-based filtering system
Pagination for large contact lists
Dark mode support
Deployment automation (CI/CD)

🙌 Acknowledgements
Built as a full-stack learning project using the PERN stack.





