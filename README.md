# SyntecxHub Tracker 📊

**SyntecxHub Tracker** is a professional, mobile-responsive MERN stack application designed for seamless personal finance management. It features high-fidelity data visualizations, secure authentication, and a premium dark-themed interface.

---

## ✨ Key Features

### 🔐 Secure Authentication & Personalization

* **Advanced Login/Signup**: Features a modern split-screen layout with secure JWT-based authentication.
* **"Remember Me" Logic**: Persistent session management for a smoother user experience.
* **Dynamic Avatar System**: Users can choose from 14 distinct visual styles (e.g., Avataaars, Notionists) with live previews.
* **Real-time Profile Management**: Instantly update user details via a React Portal-based modal.

### 📉 Financial Analysis & Visualization

* **Growth Trend Chart**: A custom-engineered bar chart with overlapping income (dark purple) and expense (light purple) bars for direct comparison.
* **Comprehensive Filtering**: Integrated year-based filters to view historical financial data instantly.
* **Visual Summaries**: Last 60-day income donuts and 30-day expense bar charts for quick insights.
* **Analysis Pages**: Dedicated area charts and transaction histories for both income and expense categories.

### 📱 Premium UX & Performance

* **Mobile Responsive**: A sliding drawer sidebar with background overlays for a native-app feel on smartphones.
* **Excel Reporting**: One-click functionality to download filtered transaction history as `.xlsx` files.
* **Dynamic Sidebar**: A professional dark-indigo (`#0F172A`) navigation pane with active state indicators.

---

## 🛠️ Technical Stack

* **Frontend**: React.js, Vite, Tailwind CSS.
* **Icons & Charts**: Lucide-React, Recharts.
* **Backend**: Node.js, Express.js.
* **Database**: MongoDB Atlas.
* **State & Auth**: Context API, Axios, JWT.

---

## 🚀 Installation & Setup

1. **Clone the repository**:
```bash
git clone https://github.com/yourusername/syntecxhub-tracker.git

```


2. **Install Dependencies**:
```bash
# Root directory
npm install
# Frontend directory
cd frontend && npm install
# Backend directory
cd ../backend && npm install

```


3. **Environment Configuration**:
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

```


4. **Run the Application**:
```bash
# Run Backend (from /backend)
npm run dev
# Run Frontend (from /frontend)
npm run dev

```



---


## 👨‍💻 Developer

Developed by **Ismail Mahmud**, Software Engineering student at East West University.

---

**Would you like me to help you create a "How to Use" section for your README that explains the overlapping chart logic to your evaluators?**