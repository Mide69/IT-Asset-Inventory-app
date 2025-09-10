# 🎓 Student Management System

A complete CRUD REST API for student management built with Node.js, Express, SQLite, and React.

## 🚀 Features

- **Complete CRUD Operations**: Create, Read, Update, Delete students
- **RESTful API**: Proper HTTP verbs and status codes
- **API Versioning**: `/api/v1/` endpoint structure
- **Data Validation**: Input validation using Joi
- **Modern Frontend**: React-based user interface
- **Database**: SQLite with migrations
- **Testing**: Unit tests with Jest
- **Health Check**: `/healthcheck` endpoint
- **Logging**: Request logging with Morgan
- **Security**: Helmet.js for security headers

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-crud-api
   ```

2. **Install dependencies and setup**
   ```bash
   make setup
   ```
   Or manually:
   ```bash
   npm install
   npm run install:frontend
   npm run migrate
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file as needed.

## 🏃‍♂️ Running the Application

### Development Mode
```bash
make dev
# or
npm run dev
```

### Production Mode
```bash
make start
# or
npm start
```

### Build Frontend
```bash
make build
# or
npm run build
```

## 🧪 Testing

Run unit tests:
```bash
make test
# or
npm test
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/healthcheck` | Health check |
| POST | `/api/v1/students` | Create student |
| GET | `/api/v1/students` | Get all students |
| GET | `/api/v1/students/:id` | Get student by ID |
| PUT | `/api/v1/students/:id` | Update student |
| DELETE | `/api/v1/students/:id` | Delete student |

### Student Schema
```json
{
  "name": "string (required, 2-100 chars)",
  "email": "string (required, valid email)",
  "age": "number (required, 16-100)",
  "course": "string (required, 2-100 chars)"
}
```

## 📱 Frontend

The React frontend provides:
- Student listing with cards
- Add/Edit student forms
- Delete confirmation
- Responsive design
- Real-time updates

Access at: `http://localhost:3000`

## 🗄️ Database

SQLite database with automatic migrations:
- **Location**: `./database/students.db`
- **Migration**: Run `npm run migrate`
- **Schema**: Students table with id, name, email, age, course, timestamps

## 📮 Postman Collection

Import `postman_collection.json` into Postman for API testing.

## 🏗️ Project Structure

```
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── migrations/      # Database migrations
│   └── server.js        # Main server file
├── frontend/            # React frontend
├── __tests__/           # Unit tests
├── database/            # SQLite database
├── Makefile            # Build commands
└── README.md
```

## 🔧 Available Commands

```bash
make install     # Install all dependencies
make migrate     # Run database migrations
make start       # Start production server
make dev         # Start development server
make test        # Run tests
make build       # Build frontend
make clean       # Clean all dependencies
make setup       # Complete setup (install + migrate)
```

## 🌟 Best Practices Implemented

- ✅ RESTful API design
- ✅ Proper HTTP status codes
- ✅ Input validation
- ✅ Error handling
- ✅ Environment configuration
- ✅ Database migrations
- ✅ Unit testing
- ✅ Security headers
- ✅ Request logging
- ✅ API versioning
- ✅ Responsive frontend

## 🚀 Deployment

The application is ready for deployment on platforms like:
- Heroku
- Railway
- Vercel
- AWS
- DigitalOcean

## 📄 License

MIT License