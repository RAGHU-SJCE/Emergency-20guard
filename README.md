# EmergencyGuard - Real Emergency Response System

![EmergencyGuard Logo](public/icon-192.png)

**EmergencyGuard** is a production-ready emergency response application that provides real-time emergency calling, GPS location sharing, emergency contact notifications, and comprehensive emergency logging.

## ⚠️ IMPORTANT DISCLAIMER

**THIS IS A REAL EMERGENCY RESPONSE SYSTEM** that makes actual emergency calls and sends real notifications. Use responsibly and only during genuine emergencies.

## 🚀 Features

### Core Emergency Features

- **Real Emergency Calling**: Direct integration with emergency services (911, 112)
- **GPS Location Sharing**: Automatic location sharing with emergency responders
- **Emergency Contact Alerts**: SMS and email notifications to trusted contacts
- **Real-time Tracking**: Continuous location monitoring during emergencies
- **Emergency Logging**: Comprehensive event logging with timestamps and locations

### Technical Features

- **Progressive Web App (PWA)**: Installable on mobile devices
- **Offline Support**: Service worker for offline functionality
- **Push Notifications**: Browser-based emergency alerts
- **Device Integration**: Haptic feedback, battery monitoring, network status
- **Cross-Platform**: Works on iOS, Android, desktop browsers

### Safety & Legal

- **Comprehensive Disclaimers**: Clear legal protections and usage guidelines
- **Fallback Systems**: Direct 911 calling if app fails
- **Permission Management**: Smart handling of location and notification permissions
- **Export Functionality**: Emergency history export for authorities

## 🏗️ Architecture

```
EmergencyGuard/
├── client/                 # Frontend React Application
│   ├── components/        # Reusable UI components
│   ├── pages/            # Route-based page components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # Frontend services
│   └── utils/            # Utility functions
├── server/               # Backend Express Application
│   ├── controllers/      # Route controllers
│   ├── services/         # Business logic services
│   ├── models/           # Data models
│   ├── middleware/       # Express middleware
│   └── utils/            # Server utilities
├── database/             # Database configuration
│   ├── schemas/          # Database schemas
│   ├── migrations/       # Database migrations
│   └── seeds/            # Seed data
├── shared/               # Shared TypeScript types
├── docs/                 # Documentation
└── config/               # Configuration files
```

## 🛠️ Technology Stack

### Frontend

- **Framework**: React 18 + TypeScript
- **Routing**: React Router 6 (SPA mode)
- **Styling**: TailwindCSS 3 + Radix UI
- **Build Tool**: Vite
- **PWA**: Service Worker + Web App Manifest
- **State Management**: React hooks + Context API

### Backend

- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT (ready for implementation)
- **Email/SMS**: SendGrid/Twilio integration ready
- **API Documentation**: OpenAPI 3.0 + Swagger

### DevOps & Deployment

- **Package Manager**: pnpm
- **Testing**: Vitest
- **Linting**: ESLint + Prettier
- **CI/CD**: GitHub Actions ready
- **Deployment**: Netlify/Vercel compatible

## 📦 Installation

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Git

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/emergency-guard.git
   cd emergency-guard
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize database**

   ```bash
   pnpm run db:setup
   pnpm run db:migrate
   ```

5. **Start development server**

   ```bash
   pnpm run dev
   ```

6. **Open application**
   - Navigate to `http://localhost:8080`
   - The app will be running with hot reload

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start development server (client + server)
pnpm dev:client       # Start only client development server
pnpm dev:server       # Start only server development server

# Building
pnpm build            # Build production application
pnpm build:client     # Build only client
pnpm build:server     # Build only server

# Testing
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage

# Database
pnpm db:setup         # Initialize database
pnpm db:migrate       # Run database migrations
pnpm db:seed          # Seed database with test data
pnpm db:reset         # Reset database

# Linting & Formatting
pnpm lint             # Lint code
pnpm lint:fix         # Fix linting issues
pnpm format           # Format code with Prettier

# Type Checking
pnpm typecheck        # Check TypeScript types

# Production
pnpm start            # Start production server
pnpm preview          # Preview production build
```

### Development Workflow

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**

   ```bash
   pnpm test
   pnpm typecheck
   pnpm lint
   ```

4. **Commit and push**
   ```bash
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

## 🌍 Environment Configuration

### Required Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/emergency_guard
DATABASE_URL_DEV=sqlite://./dev.db

# Emergency Services
EMERGENCY_PHONE_NUMBER=911
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# Email Services
SENDGRID_API_KEY=your_sendgrid_key
FROM_EMAIL=noreply@emergencyguard.com

# Security
JWT_SECRET=your_super_secret_jwt_key
ENCRYPTION_KEY=your_encryption_key

# External APIs
GOOGLE_MAPS_API_KEY=your_google_maps_key
WEATHER_API_KEY=your_weather_key

# App Configuration
NODE_ENV=development
PORT=8080
CLIENT_URL=http://localhost:8080
```

### Optional Environment Variables

```bash
# Monitoring & Analytics
SENTRY_DSN=your_sentry_dsn
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX

# Feature Flags
ENABLE_SMS_ALERTS=true
ENABLE_EMAIL_ALERTS=true
ENABLE_PUSH_NOTIFICATIONS=true

# Development
DEBUG=emergency-guard:*
LOG_LEVEL=info
```

## 📚 API Documentation

### REST API Endpoints

#### Emergency Operations

- `POST /api/emergency/call` - Initiate emergency call
- `POST /api/emergency/alert-contacts` - Alert emergency contacts
- `POST /api/emergency/log-event` - Log emergency event
- `GET /api/emergency/history` - Get emergency history

#### User Management (Future)

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

#### System Status

- `GET /api/health` - System health check
- `GET /api/status` - System status

For detailed API documentation, see [docs/api.md](docs/api.md) or visit `/api/docs` when running the server.

## 🧪 Testing

### Test Structure

```
tests/
├── unit/              # Unit tests
│   ├── client/        # Frontend unit tests
│   └── server/        # Backend unit tests
├── integration/       # Integration tests
├── e2e/              # End-to-end tests
└── fixtures/         # Test data and fixtures
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific test suites
pnpm test:unit
pnpm test:integration
pnpm test:e2e

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch
```

## 🚀 Deployment

### Production Deployment

#### Using Netlify (Recommended)

1. Connect your repository to Netlify
2. Set build command: `pnpm build`
3. Set publish directory: `dist/spa`
4. Add environment variables in Netlify dashboard

#### Using Vercel

1. Connect your repository to Vercel
2. Vercel will auto-detect the build settings
3. Add environment variables in Vercel dashboard

#### Manual Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Docker Deployment

```bash
# Build Docker image
docker build -t emergency-guard .

# Run container
docker run -p 8080:8080 -e NODE_ENV=production emergency-guard
```

## 🔒 Security Considerations

### Emergency System Security

- **Rate Limiting**: Prevents abuse of emergency endpoints
- **Input Validation**: All inputs are validated and sanitized
- **Secure Communications**: HTTPS required in production
- **Data Encryption**: Sensitive data encrypted at rest and in transit

### Development Security

- **Environment Variables**: Secrets stored in environment variables
- **Authentication**: JWT-based authentication ready for implementation
- **Authorization**: Role-based access control ready
- **Audit Logging**: All emergency events are logged with timestamps

## 🤝 Contributing

We welcome contributions to EmergencyGuard! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Update documentation for API changes
- Use conventional commits
- Keep emergency functionality reliable and fast

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚖️ Legal Disclaimer

**IMPORTANT**: EmergencyGuard is provided as-is without warranty. The developers are not responsible for emergency response failures, delayed responses, or any consequences of using this system. This app supplements but does not replace calling emergency services directly. Always call 911 or your local emergency number in life-threatening situations.

## 📞 Support

- **Technical Issues**: Open an issue on GitHub
- **Security Issues**: Email security@emergencyguard.com
- **Emergency Support**: This app is not for support - call 911

## 🙏 Acknowledgments

- Emergency services and first responders worldwide
- Open source community for tools and libraries
- Users who trust us with their safety

---

**Built with ❤️ for emergency preparedness and safety**
