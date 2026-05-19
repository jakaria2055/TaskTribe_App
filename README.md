# TaskTribe - Project Management Application

````md
#  TaskTribe - Project Management Application

TaskTribe is a modern full-stack project management web application built with the PERN stack and Clerk authentication.
It helps teams manage workspaces, projects, tasks, and team collaboration efficiently.

## 🌐 Live Demo

### Frontend
🔗 https://tasktribeapp.vercel.app
---

#  Features

## 🔐 Authentication & Authorization
- Clerk Authentication
- Secure Login & Signup
- Organization-based Workspace System
- Role-based Access (Admin / Member)

## 👥 Team Management
- Invite members via email
- Workspace member management
- Organization sync with Clerk
- Team collaboration

## 📁 Workspace Management
- Create workspaces
- Update workspace details
- Delete workspaces
- Multiple project support

## 📌 Project Management
- Create projects
- Project overview dashboard
- Analytics & statistics
- Project calendar
- Project settings

## ✅ Task Management
- Create tasks
- Assign members
- Track task progress
- Task details page
- My tasks sidebar

## 📊 Dashboard & Analytics
- Task summaries
- Recent activity
- Project analytics
- Team statistics

## 🌙 Modern UI
- Responsive design
- Dark / Light mode
- Beautiful TailwindCSS UI
- Mobile-friendly layout

---

# 🛠️ Tech Stack

## Frontend
- React 19
- Vite
- Tailwind CSS
- Redux Toolkit
- React Router DOM
- Axios
- Recharts
- Lucide React
- React Hot Toast

## Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- Inngest
- Clerk Authentication

## Deployment
- Frontend: Vercel
- Backend: Vercel
- Database: Neon PostgreSQL

---

# 📂 Project Structure

## Frontend Structure

```bash
src/
│
├── app/
├── assets/
├── components/
├── configs/
├── features/
├── pages/
│
├── App.jsx
├── main.jsx
└── index.css
````

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/tasktribe_app.git
cd tasktribe_app
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Setup Environment Variables

Create a `.env` file:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_BASEURL=your_backend_url
```

---

## 4️⃣ Run Development Server

```bash
npm run dev
```

---

# 🔄 Inngest Integration

TaskTribe uses Inngest for background event handling and synchronization.

### Used For:

* User sync from Clerk
* Workspace sync
* Member synchronization
* Organization event handling

---

# 📸 Main Pages

* Dashboard
* Projects
* Project Details
* Team Management
* Task Details

---

# 🚀 Deployment

## Frontend Deployment

Deployed on Vercel.

## Backend Deployment

Express server deployed on Vercel.

## Database

Hosted on Neon PostgreSQL.

---

# 📦 Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

---

# 👨‍💻 Author

### Jakaria Ahmed

Aspiring Full Stack MERN/PERN Developer passionate about building modern scalable web applications.

---

# ⭐ Future Improvements

* Real-time notifications
* Drag & drop Kanban board
* File attachments
* Activity timeline
* Chat system
* AI productivity assistant

```
```
