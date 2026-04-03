# DocMeet - Telemedicine Platform

DocMeet is a comprehensive telemedicine platform that connects patients with verified healthcare professionals for seamless online consultations. Built with Next.js, it features a credit-based system for consultations, secure video calls, and a user-friendly interface for both patients and doctors.

## 🚀 Features

### For Patients
- **Easy Registration**: Sign up and create a personalized profile
- **Doctor Discovery**: Browse and search verified doctors by specialty
- **Appointment Booking**: Schedule appointments based on doctor availability
- **Video Consultations**: Secure, high-quality video calls with doctors
- **Credit System**: Purchase consultation credits with flexible packages
- **Medical Records**: Access appointment history and doctor's notes

### For Doctors
- **Profile Management**: Create detailed profiles with specialties and experience
- **Availability Management**: Set and manage consultation slots
- **Video Sessions**: Conduct secure video consultations
- **Earning System**: Earn credits for completed consultations
- **Payout Management**: Request payouts for accumulated earnings

### Platform Features
- **Secure Authentication**: Powered by Clerk for robust user management
- **Real-time Video**: Integrated video calling capabilities
- **Credit Transactions**: Transparent credit purchasing and usage tracking
- **Admin Dashboard**: Administrative controls for user management
- **Responsive Design**: Mobile-first design with dark theme support

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **Lucide React** - Icon library
- **Next Themes** - Dark/light theme support

### Backend & Database
- **Prisma** - Database ORM with PostgreSQL
- **Clerk** - Authentication and user management
- **Next.js API Routes** - Server-side functionality

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Babel** - JavaScript transpilation

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm**, **yarn**, or **pnpm** package manager
- **PostgreSQL** database
- **Git** for version control

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd docmeet
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory with the following variables:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/docmeet"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

   # Video API (if using Vonage/TokBox)
   VONAGE_API_KEY=your_api_key
   VONAGE_API_SECRET=your_api_secret

   # PayPal Integration (for payouts)
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_CLIENT_SECRET=your_paypal_client_secret
   ```

## 🗄️ Database Setup

1. **Install Prisma CLI** (if not already installed)
   ```bash
   npm install -g prisma
   ```

2. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

3. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

4. **Seed the database** (if seed script exists)
   ```bash
   npx prisma db seed
   ```

## 🚀 Running the Application

1. **Development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

2. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Build for production**
   ```bash
   npm run build
   npm run start
   ```

## 📁 Project Structure

```
docmeet/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── sign-in/             # Sign-in page
│   │   └── sign-up/             # Sign-up page
│   ├── globals.css              # Global styles
│   ├── layout.js                # Root layout
│   └── page.js                  # Home page
├── components/                   # Reusable UI components
│   └── ui/                      # shadcn/ui components
├── lib/                         # Utility libraries
│   ├── data.js                  # Static data and constants
│   ├── prisma.js                # Prisma client instance
│   ├── utils.js                 # Helper functions
│   └── generated/               # Generated Prisma client
├── prisma/                      # Database schema and migrations
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
├── public/                      # Static assets
├── middleware.js                # Next.js middleware
├── next.config.mjs             # Next.js configuration
├── tailwind.config.mjs         # Tailwind CSS configuration
├── postcss.config.mjs          # PostCSS configuration
├── eslint.config.mjs           # ESLint configuration
└── package.json                # Dependencies and scripts
```

## 🗃️ Database Schema

### Core Models

- **User**: Patient and doctor profiles with role-based access
- **Appointment**: Scheduled consultations between patients and doctors
- **Availability**: Doctor's available time slots
- **CreditTransaction**: Credit purchases and usage tracking
- **Payout**: Doctor earnings and payout requests

### User Roles
- **UNASSIGNED**: New users before role selection
- **PATIENT**: Users seeking medical consultations
- **DOCTOR**: Healthcare professionals providing services
- **ADMIN**: Platform administrators

## 🔐 Authentication

The application uses Clerk for authentication with the following features:

- Social login (Google, etc.)
- Email/password authentication
- User profile management
- Role-based access control
- Secure session management

## 💳 Credit System

- **Consultation Cost**: 2 credits per appointment
- **Credit Packages**: Flexible purchasing options
- **Doctor Earnings**: 10 credits per completed consultation
- **Payout Rate**: $8 USD per 10 credits (after $2 platform fee)

## 🎥 Video Integration

The platform supports video consultations through integrated APIs (Vonage/TokBox). Each appointment generates a unique session ID for secure, private consultations.

## 🧪 Testing

```bash
# Run linting
npm run lint

# Run tests (if implemented)
npm run test
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Deployment
1. Build the application
   ```bash
   npm run build
   ```
2. Start the production server
   ```bash
   npm run start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Use TypeScript for new components (if migrating)
- Maintain consistent code style
- Add tests for new features
- Update documentation as needed

## 📝 API Documentation

### Authentication Endpoints
- Handled by Clerk middleware
- Automatic user session management

### Database Operations
- All database interactions through Prisma ORM
- Type-safe queries and mutations

### File Uploads
- Profile images and medical documents
- Secure cloud storage integration

## 🔒 Security

- **Authentication**: Clerk-powered secure authentication
- **Authorization**: Role-based access control
- **Data Encryption**: Secure data transmission
- **Input Validation**: Comprehensive input sanitization
- **Session Management**: Secure session handling

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Clerk](https://clerk.com/) - Authentication platform
- [Prisma](https://prisma.io/) - Database ORM
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

Built with ❤️ for accessible healthcare
