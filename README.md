# 🚀 BidVerse - Real-Time Auction Platform

BidVerse is a premium, full-stack online auction platform built with the MERN stack. It enables users to list products, participate in live bidding, and win items through a competitive, transparent, and real-time auction system.


## ✨ Key Features

-   **⚡ Real-Time Bidding:** Experience live auctions with instantaneous bid updates powered by Socket.io.
-   **🤖 AI-Powered Content:** Generate high-quality auction descriptions automatically using Google Gemini AI.
-   **🛠️ Admin Dashboard:** Comprehensive tools for managing auctions, monitoring users, and overseeing platform activity.
-   **💳 Credit System:** Integrated bidding credits to ensure a controlled and fair auction environment.
-   **📱 Premium UI/UX:** A stunning, responsive interface built with Tailwind CSS and Framer Motion for smooth animations.
-   **🔐 Secure Auth:** Robust authentication system using JWT with refresh tokens and secure cookie handling.
-   **🖼️ Media Management:** Seamless image uploads and optimization integrated with Cloudinary.

## 🛠️ Tech Stack

### Frontend
-   **Framework:** [React 18](https://reactjs.org/) with [Vite](https://vitejs.dev/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **State & Forms:** React Context, React Hook Form, Zod
-   **Real-time:** Socket.io-client

### Backend
-   **Runtime:** [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
-   **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
-   **AI:** [Google Gemini AI](https://ai.google.dev/)
-   **Storage:** [Cloudinary](https://cloudinary.com/)
-   **Real-time:** Socket.io
-   **Automation:** Node-cron for auction scheduling

---

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18+ recommended)
-   MongoDB Atlas account or local MongoDB instance
-   Cloudinary account for image hosting
-   Google AI Studio API Key for Gemini features

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd bidverse
    ```

2.  **Install dependencies for both client and server:**
    ```bash
    npm run install:all
    ```

3.  **Setup Environment Variables:**
    Create a `.env` file in the root directory and fill in the required fields based on `.env.example`:
    ```env
    # Server Config
    PORT=5000
    MONGO_URI=your_mongodb_uri

    # JWT Secrets
    JWT_SECRET=your_secret
    JWT_REFRESH_SECRET=your_refresh_secret

    # Integrations
    CLOUDINARY_CLOUD_NAME=your_name
    CLOUDINARY_API_KEY=your_key
    CLOUDINARY_API_SECRET=your_secret
    GEMINI_API_KEY=your_gemini_key

    # Client Config
    VITE_API_URL=http://localhost:5000/api
    VITE_SOCKET_URL=http://localhost:5000
    ```

4.  **Seed the database (Optional but recommended for testing):**
    ```bash
    npm run seed
    ```

### Running the App

Start both the frontend and backend servers simultaneously:

```bash
npm start
```

Your app will be running at `http://localhost:5173` and the server at `http://localhost:5000`.

---

## 📁 Project Structure

```text
bidverse/
├── client/             # React application (Vite)
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # Auth and Socket context
│   │   ├── pages/      # Route-level components
│   │   └── App.jsx     # Main routing config
├── server/             # Express API
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API endpoints
│   ├── socket/        # WebSocket logic
│   ├── jobs/          # Scheduled tasks (Cron)
│   └── server.js      # Entry point
└── .env.example       # Template for environment variables
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
