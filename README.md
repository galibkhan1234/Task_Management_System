# 🚀 Task Management System
A full-stack **Task Management System** built using the MERN stack (MongoDB, Express, React, Node.js).
This application allows users to create, manage, and track tasks efficiently with authentication and a modern UI.

## 📸 Screenshots
<img width="1917" height="961" alt="Screenshot 2026-03-25 204943" src="https://github.com/user-attachments/assets/d2bce60d-a031-437d-b64b-ba55109b408c" />
<img width="1916" height="959" alt="Screenshot 2026-03-25 204852" src="https://github.com/user-attachments/assets/2d447799-08a3-4541-b71d-ff7f22f9edf4" />
<img width="1918" height="963" alt="Screenshot 2026-03-25 204909" src="https://github.com/user-attachments/assets/659d495c-157b-4526-b494-150f77430c2e" />


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
