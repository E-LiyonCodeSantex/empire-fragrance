🌸 Empire Fragrance
A full‑stack e‑commerce platform for luxury fragrance products with powerful admin management capabilities. Built with modern technologies for performance, scalability, and a seamless user experience.

✨ Features
👤 User Features
Product Browsing: Explore perfumes, ouds, sprays, and deals with detailed product information.

Product Filtering: Filter by category, rating, price, and tags.

Shopping Cart: Add/remove products with real‑time updates.

User Accounts: Registration, login, and account management.

Order Management: Checkout with address and payment method selection.

Product Reviews: Submit and view reviews for purchased products.

Contact Support: Customer inquiry form.

🛠️ Admin Features
Dashboard: Business metrics and management overview.

Product Management: Full CRUD with bulk operations.

Order Tracking: Monitor and manage customer orders.

Contact Management: View/respond to customer inquiries.

Review Moderation: Manage product reviews and ratings.

Image Upload: Cloud‑based image hosting via Cloudinary.

🌍 General Features
Responsive Design: Mobile‑first UI with Tailwind CSS.

Authentication: JWT‑based authentication with secure password hashing.

Email Notifications: Nodemailer integration for password resets and notifications.

Search & Discovery: Advanced product search and categorization.

State Management: React Query for efficient data fetching and caching.

🏗️ Project Structure
Code
cartel-empire/
├── client/                 # Next.js frontend
│   ├── components/        # Reusable React components
│   ├── pages/             # Next.js pages (admin, user, reset-password)
│   ├── context/           # React context (Auth, Modal, Cart)
│   ├── services/          # API service functions
│   ├── utils/             # Utilities and HOCs
│   ├── styles/            # Global styles
│   └── public/            # Static assets
│
└── server/                # Express.js backend
    └── src/
        ├── controllers/   # Request handlers (admin, user)
        ├── models/        # Mongoose models
        ├── routes/        # API routes
        ├── middleware/    # Auth & validation
        ├── config/        # Database, Cloudinary
        └── utils/         # Helpers
🛠️ Tech Stack
Frontend
Next.js 16, React 18, TypeScript

Tailwind CSS 3, Framer Motion, Swiper

React Query, Axios, Heroicons

Backend
Node.js, Express.js 5, TypeScript

MongoDB, Mongoose

JWT, bcryptjs

Multer, Cloudinary

Nodemailer, CORS

📋 Prerequisites
Node.js 18+

MongoDB (local or cloud)

Cloudinary account

Email service (e.g., Gmail, SendGrid)

🚀 Installation & Setup
1. Clone the Repository
bash
git clone <repository-url>
cd cartel-empire
2. Backend Setup
bash
cd server
npm install
Create .env in server/:

env
MONGODB_URI=mongodb://localhost:27017/cartel-empire
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
PORT=5000
Start backend:

bash
npm run dev
3. Frontend Setup
bash
cd ../client
npm install
Create .env.local in client/:

env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
Start frontend:

bash
npm run dev
Frontend runs at: http://localhost:3000

📚 API Endpoints
Authentication
POST /api/user/register – Register user

POST /api/user/login – Login user

POST /api/user/forgot-password – Request password reset

POST /api/user/reset-password/:token – Reset password

POST /api/admin/login – Admin login

Products
GET /api/products – Get all products

GET /api/products/:id – Get product details

POST /api/products – Create product (admin)

PUT /api/products/:id – Update product (admin)

DELETE /api/products/:id – Delete product (admin)

Reviews
GET /api/reviews/:productId – Get reviews

POST /api/reviews – Create review

PUT /api/reviews/:id – Update review

DELETE /api/reviews/:id – Delete review

Orders
GET /api/account/orders – Get user orders

POST /api/account/checkout – Create order

Admin
GET /api/admin/dashboard – Dashboard metrics

GET /api/admin/users – Get all users

GET /api/admin/users/:id – Get user by ID

GET /api/admin/orders – Get all orders

Contact
GET /api/contact – Get messages (admin)

POST /api/contact – Submit inquiry

🔐 Authentication & Security
JWT‑based authentication for users and admins

Role‑based access control for admin routes

Secure password hashing with bcrypt

Email‑based password reset with tokens

🎨 UI/UX
Responsive design (mobile‑first)

Smooth animations with Framer Motion

Product carousels with Swiper

Reusable modal system

Dark/light theme support

Loading/error states with React Query

📦 Scripts
Frontend
npm run dev – Development server

npm run build – Production build

npm start – Start production server

npm run lint – Lint code

Backend
npm run dev – Development server with hot reload

npm test – Run tests

📝 Database Models
User – Account info & credentials

Admin – Admin accounts & permissions

Product – Product details & inventory

Review – Product reviews & ratings

Order – Customer orders

Contact – Customer inquiries

Address – Shipping & billing info

PaymentMethod – Payment details

🚀 Deployment
Frontend: Vercel (auto‑deploy from GitHub)

Backend: Heroku, Railway, Render, AWS, DigitalOcean, etc.

Update NEXT_PUBLIC_API_URL for production API

🤝 Contributing
Create a feature branch:

bash
git checkout -b feature/amazing-feature
Commit changes:

bash
git commit -m "Add amazing feature"
Push branch:

bash
git push origin feature/amazing-feature
Open a Pull Request

📄 License
Licensed under the ISC License – see the LICENSE file for details.

🆘 Support
For issues or feature requests, open an issue on GitHub or use the contact form in the app.

👥 Team
Backend: Node.js, Express, MongoDB

Frontend: Next.js, React, Tailwind CSS

Database: MongoDB

Cloud Services: Cloudinary

Last Updated: February 2026 · Version 1.0.0#