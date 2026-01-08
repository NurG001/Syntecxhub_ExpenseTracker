<!-- HERO IMAGE -->
<p align="center">
  <img src="https://github.com/NurG001/mine/blob/main/project%20img/ExpenseTracker/banner.png" alt="SyntecxHub Tracker Dashboard" width="100%" />
</p>

<h1 align="center">ExpenseTracker</h1>
<p align="center">
  <strong>A high-performance MERN stack finance tracker focused on clarity, security, and premium data visualization.</strong>
</p>

<p align="center">
  <a href="https://expensetracker-nurg001.vercel.app/" target="_blank">
    <strong>🌐 Live Demo</strong>
  </a>
</p>

**ExpenseTracker** is a professional, mobile-responsive **personal finance management system** built using the **MERN stack**. It combines **secure JWT-based authentication**, **real-time financial analytics**, and **high-fidelity data visualization** within a **dark-themed, UX-focused interface**. Designed for both **academic evaluation** and **real-world usage**, the application demonstrates strong practices in **frontend architecture**, **API design**, and **data-driven UI engineering**.


---

## 🖼️ Application Preview & Key Features

### 🔐 Authentication & Onboarding

| Login Screen                    | Signup & Avatar Selection                       |
| ------------------------------- | ----------------------------------------------- |
| ![Login](https://github.com/NurG001/mine/blob/main/project%20img/ExpenseTracker/login.png) | ![Signup Avatar](https://github.com/NurG001/mine/blob/main/project%20img/ExpenseTracker/signup.png) |

### 🔐 Secure Authentication & Personalization
- **Advanced Login & Signup** with a modern split-screen layout
- **JWT-based Authentication** with secure session handling
- **“Remember Me” Logic** for persistent login sessions
- **Dynamic Avatar System**  
  Choose from **14 unique avatar styles** (Avataaars, Notionists, etc.) with live previews
- **Real-time Profile Updates** using a React Portal-based modal
---

### 📊 Dashboard Overview

| Dashboard                               |
| --------------------------------------- |
| ![Dashboard](https://github.com/NurG001/mine/blob/main/project%20img/ExpenseTracker/Dashboard.png) |

### 📉 Financial Analysis & Visualization
- **Income vs Expense Growth Chart**  
  Custom overlapping bar chart:
  - Income → Dark Purple  
  - Expense → Light Purple  
- **Year-based Filtering** for instant historical data insights
- **Visual Summaries**
  - Last **60-day income donut chart**
  - Last **30-day expense bar chart**
- **Dedicated Analysis Pages**  
  Area charts and transaction histories for both income and expenses
---

### 📉 Financial Growth Analysis

| Income vs Expense Growth                      | Financial Overview                          |
| --------------------------------------------- | ------------------------------------------- |
| ![Growth Chart](https://github.com/NurG001/mine/blob/main/project%20img/ExpenseTracker/BarChart%20fin%20overview.jpg) | ![Fin Chart](https://github.com/NurG001/mine/blob/main/project%20img/ExpenseTracker/fin%20overview.jpg) |

---

### 📈 Category-wise Analysis

| Income Analysis                                     |
| --------------------------------------------------- |
| ![Income Analysis](https://github.com/NurG001/mine/blob/main/project%20img/ExpenseTracker/Income.png) |

| Expense Analysis                                      |
| ----------------------------------------------------- |
| ![Expense Analysis](https://github.com/NurG001/mine/blob/main/project%20img/ExpenseTracker/Expense.png) |

---

### 📱 Mobile Experience

| Mobile Sidebar                                    | Mobile Dashboard                                      |
| ------------------------------------------------- | ----------------------------------------------------- |
| ![Mobile Sidebar](https://github.com/NurG001/mine/blob/main/project%20img/ExpenseTracker/Mobile%20Sidebar1.jpg) | ![Mobile Dashboard](https://github.com/NurG001/mine/blob/main/project%20img/ExpenseTracker/Mobile%20Dashboard1.jpg) |

### 📱 Premium UX & Performance
- **Fully Mobile Responsive**
  - Slide-in drawer sidebar
  - Background overlays for native-app feel
- **Excel Export**
  - Download filtered transactions as `.xlsx`
- **Dynamic Sidebar**
  - Dark indigo theme `#0F172A`
  - Active state indicators for navigation clarity
---

## 🛠️ Technical Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Lucide-React
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB Atlas

### State & Authentication
- Context API
- Axios
- JWT (JSON Web Tokens)

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/syntecxhub-tracker.git
````

---

### 2️⃣ Install Dependencies

```bash
# Root directory
npm install

# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

---

### 3️⃣ Environment Configuration

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

### 4️⃣ Run the Application

```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

---

## 📁 Project Structure

```txt
syntecxhub-tracker/
│
├── frontend/        # React + Vite client
├── backend/         # Express API & Auth logic
├── screenshots/     # README images
└── README.md
```

---

## 👨‍💻 Developer

**Ismail Mahmud**
Software Engineering Student
East West University, Dhaka

🔹 MERN Stack
🔹 UI/UX-Focused Design
🔹 Data Visualization & Fintech Systems

---

<p align="center">
  If you find this project useful or inspiring, consider giving it a <strong>star ⭐</strong>, as it helps showcase high-quality full-stack engineering work.
</p>
