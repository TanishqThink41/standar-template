# AGENTIX41

This is a full-stack project with separate **frontend** and **backend** directories. It integrates a frontend built with modern JavaScript tools and a backend powered by FastAPI. The backend connects to OpenAI's API using GPT-4o-mini.

---

## 🗂️ Project Structure

```
.
├── backend
│   ├── app
│   ├── requirements.txt
│   └── .env
└── frontend
    ├── src
    └── package.json
```

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/TanishqThink41/standar-template.git
cd standar-template
```

---

## 🔧 Backend Setup

### 📁 Navigate to the `backend` folder

```bash
cd backend
```

### 🧪 Create and activate a virtual environment (optional but recommended)

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 📦 Install dependencies

```bash
pip install -r requirements.txt
```

### ⚙️ Configure Environment Variables

Create a `.env` file in the `backend` directory with the following content:

```
OPENAI_API_KEY="your-gpt-4o-mini-key"
```

### ▶️ Run the backend server

```bash
uvicorn app.main:app --reload
```

- Backend will be available at: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 🌐 Frontend Setup

### 📁 Navigate to the `frontend` folder

```bash
cd frontend
```

### 📦 Install dependencies

```bash
npm install
```

### ▶️ Run the development server

```bash
npm run dev
```

- Frontend will be available at: [http://localhost:8080](http://localhost:8080)

---

## 📌 Notes

- Ensure the backend is running before starting the frontend if they interact.
- Make sure to replace `your-gpt-4o-mini-key` in the `.env` file with a valid OpenAI API key.
