# 🚀 Task Management System

A full-stack **Task Management System** built using the MERN stack (MongoDB, Express, React, Node.js).
This application allows users to create, manage, and track tasks efficiently with authentication and a modern UI.

---

## 📌 Features

* 🔐 User Authentication (Login / Register)
* 📝 Create, Update, Delete Tasks
* 📊 Task Status Management (Pending / Completed)
* ⚡ Responsive UI
* 🔒 Protected Routes
* 🌐 REST API Integration

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Axios
* Tailwind CSS / CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB (Mongoose)

---

## 📁 Project Structure

```
TaskHub/
│
├── Backend/        # Express server & APIs
├── Frontend/       # React app
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/<your-username>/Task_Management_System.git
cd TaskHub
```

---

### 2️⃣ Setup Backend

```bash
cd Backend
npm install
```

Create a `.env` file in Backend:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Setup Frontend

```bash
cd ../Frontend
npm install
npm start
```

---

## 🌐 API Endpoints (Sample)

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | /api/auth/login    | Login user    |
| POST   | /api/auth/register | Register user |
| GET    | /api/tasks         | Get all tasks |
| POST   | /api/tasks         | Create task   |
| PUT    | /api/tasks/:id     | Update task   |
| DELETE | /api/tasks/:id     | Delete task   |

---

## 🚀 Deployment

* Frontend → Vercel / Netlify
* Backend → Render / Railway
* Database → MongoDB Atlas

---

## 📸 Screenshots

<img width="1917" height="961" alt="Screenshot 2026-03-25 204943" src="https://github.com/user-attachments/assets/4afc211e-f7f7-451d-bd91-343efd2a52f0" />


---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork this repo and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Mohammed Galib Khan**

---

⭐ If you like this project, give it a star!
