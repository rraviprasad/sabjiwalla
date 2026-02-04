# Sabjiwala 🥬

A modern full-stack vegetable shop web application built with React and Node.js.

![Sabjiwala](https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop)

## Features

- 🛒 **Product Catalog** - Browse vegetables, fruits, leafy greens, exotic items, and herbs
- 🔐 **User Authentication** - Register, login, and manage your profile
- 🛍️ **Shopping Cart** - Add products, adjust quantities, and checkout
- 📦 **Order Management** - Track your orders and view order history
- 👨‍💼 **Admin Dashboard** - Manage products and orders (admin only)
- 📱 **Responsive Design** - Works perfectly on all devices
- 🎨 **Modern UI** - Beautiful green theme with smooth animations

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Styling | CSS3 |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Authentication | JWT |
| Image Storage | Cloudinary |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sabjiwala.git
   cd sabjiwala
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```

4. **Seed Sample Products** (optional)
   ```bash
   cd backend
   node seed.js
   ```

### Running the App

1. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```

3. Open http://localhost:3000 in your browser

## Environment Variables

Create a `.env` file in the `backend` folder:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/sabjiwala
JWT_SECRET=your-super-secret-jwt-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
PORT=5000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get single product |
| POST | /api/orders | Create order |
| GET | /api/orders | Get user orders |

## Deployment

### Vercel

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy!

## License

MIT

---

Made with 💚 by Sabjiwala Team
