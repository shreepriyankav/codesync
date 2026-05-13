# CodeSync — Real-Time Collaborative Code Editor

![CodeSync](https://img.shields.io/badge/CodeSync-Real--Time%20Collaborative%20Editor-blue)
![Node.js](https://img.shields.io/badge/Node.js-v16+-green)
![React](https://img.shields.io/badge/React-v18-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-black)

---

## 📌 Project Overview

**CodeSync** is a web-based real-time collaborative coding platform designed for students, developers, and interview candidates to code together simultaneously from different locations.

The application allows multiple users to:
- Join a shared coding room
- Edit code in real time together
- Communicate through an integrated chat system
- Execute code instantly within the browser

The main goal is to provide a seamless collaborative programming environment similar to Google Docs, but specifically designed for coding and technical collaboration.

---

## 🎯 Objectives

1. Build a real-time collaborative coding platform
2. Enable multiple users to edit code simultaneously
3. Implement live cursor and code synchronization
4. Provide integrated chat communication between users
5. Allow instant code execution inside the platform
6. Improve collaboration and productivity during coding sessions

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔄 Real-Time Code Sync | All users see code changes instantly |
| 👥 Multi-User Rooms | Create or join rooms with a unique Room ID |
| 💬 Live Chat | Integrated chat panel inside the editor |
| ▶ Code Execution | Run code and see output instantly |
| 🎨 Syntax Highlighting | Monaco Editor (VS Code style) |
| 🌐 Multi-Language Support | JavaScript, Python, Java, C++, C |
| 💾 Save Code | Save code to database anytime |
| 📋 Copy Room ID | Share Room ID with one click |
| 🚪 Leave Room | Leave session cleanly |
| 📱 Responsive UI | Modern dark theme interface |

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React.js | v18 | UI framework and component management |
| React Router DOM | v6 | Page navigation and routing |
| Monaco Editor | v4 | VS Code style code editor with syntax highlighting |
| Socket.IO Client | v4 | Real-time communication with backend |
| Axios | v1 | HTTP requests to backend APIs |
| React Hot Toast | v2 | Notifications and alerts |
| UUID | v9 | Generate unique Room IDs |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | v16+ | Backend runtime environment |
| Express.js | v4 | REST API and server framework |
| Socket.IO | v4 | Real-time bidirectional communication |
| Mongoose | v8 | MongoDB object modeling |
| Axios | v1 | HTTP requests to Judge0 API |
| dotenv | v16 | Environment variable management |
| CORS | v2 | Cross-origin resource sharing |
| UUID | v9 | Unique ID generation |
| Nodemon | v3 | Auto-restart server during development |

### Database
| Technology | Purpose |
|---|---|
| MongoDB | Stores rooms, chat messages, and saved code |
| MongoDB Compass | GUI desktop app to view and manage database |

### Code Execution
| Technology | Purpose |
|---|---|
| Judge0 CE (Free) | Online code compilation and execution API |

---

## 📁 Project Structure

```
real time/
│
├── client/                         # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── CodeEditor.js       # Monaco editor component
│   │   │   ├── ChatPanel.js        # Live chat component
│   │   │   ├── UserList.js         # Online users list
│   │   │   ├── OutputPanel.js      # Code output display
│   │   │   └── Toolbar.js          # Top toolbar (run, save, language)
│   │   ├── context/
│   │   │   └── SocketContext.js    # Socket.IO context provider
│   │   ├── pages/
│   │   │   ├── Home.js             # Home page (create/join room)
│   │   │   └── EditorPage.js       # Main editor page
│   │   ├── App.js                  # Main app with routing
│   │   ├── App.css                 # All styles (dark theme)
│   │   └── index.js                # React entry point
│   ├── .env                        # Frontend environment variables
│   └── package.json
│
└── server/                         # Node.js Backend
    ├── config/
    │   └── db.js                   # MongoDB connection
    ├── controllers/
    │   ├── executeController.js    # Code execution logic
    │   ├── chatController.js       # Chat history logic
    │   └── roomController.js       # Room management logic
    ├── models/
    │   ├── Room.js                 # Room schema (roomId, code, language)
    │   └── Message.js              # Message schema (roomId, username, message)
    ├── routes/
    │   ├── execute.js              # POST /api/execute
    │   ├── chat.js                 # GET /api/chat/:roomId
    │   └── room.js                 # GET /api/room/:roomId
    ├── socket/
    │   └── socketHandler.js        # All Socket.IO events
    ├── .env                        # Backend environment variables
    ├── index.js                    # Server entry point
    └── package.json
```

---

## 🗄️ Database Schema

### Room Collection
```json
{
  "roomId": "unique-room-id",
  "language": "javascript",
  "code": "// your code here",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Message Collection
```json
{
  "roomId": "unique-room-id",
  "username": "john",
  "message": "Hello!",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## ⚡ Socket.IO Events

### Client → Server
| Event | Data | Description |
|---|---|---|
| `join-room` | `{ roomId, username }` | Join a coding room |
| `code-change` | `{ roomId, code }` | Broadcast code changes |
| `language-change` | `{ roomId, language }` | Change programming language |
| `cursor-move` | `{ roomId, cursor, username }` | Broadcast cursor position |
| `chat-message` | `{ roomId, username, message }` | Send a chat message |
| `save-code` | `{ roomId }` | Save code to database |

### Server → Client
| Event | Data | Description |
|---|---|---|
| `room-state` | `{ code, language }` | Send current room state on join |
| `code-update` | `code` | Receive code changes from others |
| `language-update` | `language` | Receive language change |
| `cursor-update` | `{ socketId, username, cursor }` | Receive cursor positions |
| `users-update` | `[usernames]` | Updated list of online users |
| `chat-message` | `{ username, message, timestamp }` | Receive chat message |
| `user-joined` | `{ username }` | Notification when user joins |
| `user-left` | `{ username }` | Notification when user leaves |
| `code-saved` | — | Confirmation that code was saved |

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/execute` | Execute code using Judge0 |
| GET | `/api/chat/:roomId` | Get chat history for a room |
| GET | `/api/room/:roomId` | Get or create a room |

---

## ✅ Prerequisites

Make sure you have the following installed before running the project:

- **Node.js** v16 or higher → https://nodejs.org
- **MongoDB** (local) → https://www.mongodb.com/try/download/community
- **MongoDB Compass** (optional GUI) → https://www.mongodb.com/products/compass
- **Git** (optional) → https://git-scm.com

---

## 🚀 How to Run the Project

### Step 1 — Clone or Download the Project
If using Git:
```bash
git clone <your-repo-url>
cd "real time"
```
Or just open the project folder directly.

---

### Step 2 — Setup Backend

Navigate to the server folder:
```bash
cd "d:\real time\server"
```

Install dependencies:
```bash
npm install
```

The `.env` file is already configured:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/codesync
CLIENT_URL=http://localhost:3000
JUDGE0_API_KEY=
```

Start the backend server:
```bash
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB connected
```

---

### Step 3 — Setup Frontend

Open a **new terminal** and navigate to the client folder:
```bash
cd "d:\real time\client"
```

Install dependencies:
```bash
npm install
```

Start the frontend:
```bash
npm start
```

Your browser will automatically open at:
```
http://localhost:3000
```

---

### Step 4 — Use the Application

1. Enter your **username**
2. Click **Generate Room ID** to create a new room
3. Click **Join Room**
4. Share the **Room ID** with others
5. Other users go to `http://localhost:3000`, enter the same Room ID and their username
6. Everyone can now **code together in real time**!

---

## 🗃️ View Data in MongoDB Compass

1. Open **MongoDB Compass**
2. Connect using: `mongodb://localhost:27017`
3. Click **Connect**
4. After starting the backend, refresh and find the **`codesync`** database
5. You will see:
   - **`rooms`** — all created rooms with saved code
   - **`messages`** — all chat messages per room

---

## 🌐 Supported Programming Languages

| Language | Judge0 ID |
|---|---|
| JavaScript | 63 |
| Python | 71 |
| Java | 62 |
| C++ | 54 |
| C | 50 |

---

## 🔧 Troubleshooting

| Problem | Solution |
|---|---|
| `npm start` fails in client | Make sure you are inside the `client` folder |
| `npm run dev` fails in server | Make sure you are inside the `server` folder |
| `MongoDB not connected` | Make sure MongoDB is installed and running |
| Code execution not working | The free Judge0 API may be temporarily down, try again |
| Port 3000 already in use | Change `PORT=3001` in `client/.env` |
| Port 5000 already in use | Change `PORT=5001` in `server/.env` |
| `allowedHosts` error | Make sure `client/.env` has `DANGEROUSLY_DISABLE_HOST_CHECK=true` |

---

## 🔮 Future Enhancements

- [ ] Video call integration
- [ ] Voice communication
- [ ] AI code suggestions
- [ ] Screen sharing
- [ ] Version control system
- [ ] Dark / Light theme toggle
- [ ] Code history tracking
- [ ] User authentication (Login / Register)
- [ ] Export code as file

---

## 👨‍💻 System Architecture

```
Browser (React.js)
       ↓
  Socket.IO Client
       ↓
Backend Server (Node.js + Express.js)
       ↓          ↓
  MongoDB      Judge0 API
 (Database)  (Code Execution)
```

---

## 📄 License

This project is built for educational purposes as a final year project.

---

## 🙌 Acknowledgements

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) — VS Code editor in the browser
- [Socket.IO](https://socket.io/) — Real-time communication
- [Judge0](https://judge0.com/) — Free online code execution API
- [MongoDB](https://www.mongodb.com/) — NoSQL database
- [React](https://reactjs.org/) — Frontend framework
