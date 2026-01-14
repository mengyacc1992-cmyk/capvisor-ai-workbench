# CapVisor AI Workbench v2.0

<div align="center">
  <h3>AI-Powered Fashion Content Generation Platform</h3>
  <p>Generate fashion content topics and asset streams using Google Gemini AI</p>
</div>

## 🚀 Features

- **AI-Powered Topic Generation**: Generate 8 diverse fashion content topics using Google Gemini
- **Content Asset Stream (CAS)**: Create structured content flows with visual logic, headlines, and scripts
- **Multi-User Support**: Shared data storage for up to 3 users
- **Real-time Image Generation**: Generate fashion editorial images (when API available)
- **Modern UI**: Dark-themed, responsive interface built with React + Vite

## 📋 Prerequisites

- Node.js 20+ 
- npm or yarn
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

## 🛠️ Local Development

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd capvisor-ai-workbench-v2.0
```

### 2. Install dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd services/server
npm install
cd ../..
```

### 3. Configure environment variables

Create `services/server/.env.local`:

```bash
cp services/server/env.local.example services/server/.env.local
```

Edit `services/server/.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your-secret-key-change-in-prod
USERS_JSON=[{"email":"demo@capvisor.ai","password":"capvisor123"}]
DATABASE_PATH=./capvisor.db
CLIENT_ORIGIN=http://localhost:3000
PORT=8787
```

### 4. Build and run backend

```bash
cd services/server
npm run build
npm run dev
```

The backend will run on `http://localhost:8787`

### 5. Run frontend

In a new terminal:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🐳 Docker Deployment

### Using Docker Compose

```bash
cd services
GEMINI_API_KEY=your_key USERS_JSON='[{"email":"demo@capvisor.ai","password":"capvisor123"}]' docker-compose up --build
```

## ☁️ Cloud Deployment

### Option 1: Railway (Recommended)

1. **Create a Railway account** at [railway.app](https://railway.app)

2. **Create a new project** and connect your GitHub repository

3. **Add environment variables** in Railway dashboard:
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `JWT_SECRET`: A secure random string
   - `USERS_JSON`: JSON array of users, e.g., `[{"email":"demo@capvisor.ai","password":"capvisor123"}]`
   - `CLIENT_ORIGIN`: Your frontend URL (e.g., `https://your-app.vercel.app`)
   - `DATABASE_URL`: Railway will auto-provision a PostgreSQL database

4. **Deploy backend**:
   - Set root directory to `services/server`
   - Build command: `npm run build`
   - Start command: `node dist/index.js`

5. **Deploy frontend** (Vercel/Netlify):
   - Set `VITE_API_BASE` to your Railway backend URL
   - Deploy the root directory

### Option 2: Render

1. **Create a Render account** at [render.com](https://render.com)

2. **Create a new Web Service**:
   - Connect your GitHub repository
   - Root directory: `services/server`
   - Build command: `npm run build`
   - Start command: `node dist/index.js`

3. **Add environment variables**:
   - Same as Railway above

4. **Deploy frontend** separately as a Static Site

### Option 3: Vercel (Frontend) + Railway (Backend)

**Backend (Railway):**
- Follow Railway steps above

**Frontend (Vercel):**
1. Import your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_BASE=https://your-railway-backend.railway.app`

## 📁 Project Structure

```
capvisor-ai-workbench-v2.0/
├── services/
│   ├── server/          # Backend API (Node.js + Express)
│   │   ├── src/
│   │   │   ├── index.ts      # Main server file
│   │   │   ├── geminiService.ts  # AI service integration
│   │   │   ├── auth.ts       # Authentication
│   │   │   └── db.ts         # Database
│   │   └── package.json
│   ├── App.tsx          # Main React component
│   ├── apiClient.ts     # API client
│   └── vite.config.ts   # Vite configuration
├── components/          # React components
├── types.ts            # TypeScript types
└── package.json        # Frontend dependencies
```

## 🔐 Authentication

Default demo account:
- **Email**: `demo@capvisor.ai`
- **Password**: `capvisor123`

Add more users via `USERS_JSON` environment variable:

```json
[
  {"email":"demo@capvisor.ai","password":"capvisor123"},
  {"email":"user2@example.com","password":"password2"},
  {"email":"user3@example.com","password":"password3"}
]
```

## 🔧 Configuration

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | Required |
| `JWT_SECRET` | Secret for JWT tokens | `dev-secret-change-me` |
| `USERS_JSON` | JSON array of users | Required |
| `DATABASE_PATH` | SQLite database path | `./capvisor.db` |
| `CLIENT_ORIGIN` | Frontend origin for CORS | `http://localhost:5173` |
| `PORT` | Server port | `8787` |

### Frontend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE` | Backend API URL | `http://localhost:8787` |

## 📝 API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/topics` - Generate content topics
- `POST /api/skeleton` - Generate content asset stream
- `POST /api/translate-prompt` - Translate visual logic to prompt
- `POST /api/image` - Generate image
- `POST /api/score` - Score asset
- `GET /api/logs` - Get generation logs

## 🐛 Troubleshooting

### Cannot generate topics
- Check if `GEMINI_API_KEY` is set correctly
- Verify network connection to Google API
- System will automatically use fallback mock data if API fails

### Cannot login
- Verify `USERS_JSON` is correctly formatted
- Check backend logs for errors
- Ensure database is initialized

### CORS errors
- Set `CLIENT_ORIGIN` to match your frontend URL
- Check that frontend `VITE_API_BASE` points to correct backend

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.
