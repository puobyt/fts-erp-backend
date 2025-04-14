# ERP Backend

## 📌 Overview
This is the **backend API** for an **ERP system**, built using **Node.js + Express.js** following the **Repository Pattern** for a clean and scalable architecture. The backend handles authentication, database interactions, and business logic efficiently.

## 🚀 Tech Stack
- 🟢 **Node.js** – Server-side runtime
- 🚀 **Express.js** – Web framework for handling API requests
- 🍃 **MongoDB Atlas** – Cloud database
- 🔄 **Mongoose** – MongoDB ODM for schema management
- 🔒 **JWT (JSON Web Token)** – Authentication
- ✉️ **Nodemailer** – Email handling
- 🌐 **Vercel** – Deployment platform

## 📁 Project Structure
```
└── CRM-BackEnd-Freelance-Project.git/
    ├── app.js                  # Main entry point
    ├── bin
    │   └── www                # Server initialization
    ├── configs                # Configuration files
    │   ├── adminAuth.js       # Authentication logic
    │   ├── database.js        # MongoDB connection setup
    │   ├── otpGenerator.js    # OTP generation
    │   └── otpMailer.js       # OTP email service
    ├── controllers            # Handles request logic
    │   └── adminController.js # Admin-related API controllers
    ├── models                 # Mongoose schemas
    │   ├── admin.js
    │   ├── billOfMaterials.js
    │   ├── ... (other models)
    ├── public
    │   └── stylesheets        # Public assets
    ├── routes                 # API route definitions
    │   └── admin.js           # Admin routes
    ├── services               # Business logic layer
    │   └── adminServices.js   # Admin-specific service functions
    ├── .env                   # Environment variables
    ├── package.json           # Dependencies
    ├── package-lock.json      # Package lock file
    ├── vercel.json            # Deployment configuration
```

## ⚙️ Installation & Setup

Ensure **Node.js** and **npm** are installed.

```bash
# Clone the repository
git clone https://github.com/jishnuanilDev/CRM-BackEnd-Freelance-Project.git
cd CRM-BackEnd-Freelance-Project.git

# Install dependencies
npm install

# Start the server
npm start
```

## 📜 API Routes
All routes are defined inside the `routes` folder.
- **Admin Routes** → `/routes/admin.js`
- Add more routes as needed.

## 🔗 Database Configuration
- Uses **MongoDB Atlas** for cloud storage.
- Connection settings are in **configs/database.js**.
- Define your database URI in the `.env` file:
  ```env
  MONGO_URI=mongodb://localhost:27017/EnterpriseApplication
  ```

## 🔐 Authentication
- Admin authentication is handled via **JWT**.
- The logic is inside **configs/adminAuth.js**.
- Middleware ensures secure API access.

## ✉️ OTP Handling
- **OTP Generation**: `configs/otpGenerator.js`
- **OTP Email Service**: `configs/otpMailer.js`
- Used for secure user verification.

## 🚀 Deployment on Vercel
This project is deployed on **Vercel** for seamless hosting.

### 🌍 Live API URL
🔗 **[Your API URL](https://fts-gamma.vercel.app/)**

### 📌 Deployment Steps
1. **Connect Repository**: Link your GitHub repo to Vercel.
2. **Configure Build Settings**:
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: Not required for backend projects.
3. **Environment Variables**: Add `.env` variables in Vercel **Project Settings → Environment Variables**.
4. **Automatic Deployment**: Push changes to the `main` branch, and Vercel will deploy the latest version.

### 🔧 Vercel Configuration
The `vercel.json` file:
```json
{
    "version": 2,
    "builds": [
      {
        "src": "app.js",   
        "use": "@vercel/node"
      }
    ],
    "routes": [
      { "src": "/(.*)", "dest": "/app.js" }  
    ]
  }
  

  
```

## 🔗 License
This project is licensed under the **MIT License**.

---
Happy coding! 🚀

