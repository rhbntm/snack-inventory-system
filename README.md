# Snack Inventory Management System

Get this AI overview shit outta here. Here's the real context for this repo.

# This is a school project that was given to us on 6/1/2025. I literally just used TempoLabs AI to generate the boilerplate code for an inventory system. Then after that I used ChatGPT to kind of customize the boilerplate that TempoLabs AI that gave us.

### The reason why I utilized full AI is because of the limited time given to us along with other school projects, so I had to make a Faustian pact with the devil and this was the shitty result lmao.

<img width="1599" height="807" alt="image" src="https://github.com/user-attachments/assets/72ff96c3-6c74-448e-a5cd-528eac023a5f" />
<img width="1599" height="794" alt="image" src="https://github.com/user-attachments/assets/1fe1d194-778d-40e5-9b50-c0c100ea5459" />
<img width="1599" height="807" alt="image" src="https://github.com/user-attachments/assets/86626da9-5a35-4ad6-8585-30cfec8a9a71" />
<img width="1599" height="800" alt="image" src="https://github.com/user-attachments/assets/6660859e-9567-44a2-9d8d-94522f738325" />
<img width="1599" height="810" alt="image" src="https://github.com/user-attachments/assets/84870f2c-8bc5-4bce-b3ce-795e0589f5ef" />
<img width="1599" height="805" alt="image" src="https://github.com/user-attachments/assets/2b261dff-533d-4326-9e7b-c3bfe6aa5ee4" />

That's all. You can do simple CRUD and store inventory and have dashboard present to you the stats but that's about it. 

At the very least, I learned how actual CRUD systems work functionally in this project despite it being full on AI vibe coded.

## 📋 Project Overview

This system was developed as a school project to address the operational challenges faced by local snack sellers (sari-sari stores, school canteens, and small snack vendors) in the Philippines. The application helps vendors efficiently manage their inventory, track sales in real-time, monitor stock levels, and make data-driven business decisions.

### Target Users
- **Sari-sari store owners** - Small neighborhood convenience stores
- **School canteen vendors** - Snack sellers in educational institutions  
- **Small snack business owners** - Independent snack retailers
- **Street food vendors** - Mobile snack and food sellers

## ✨ Key Features

### 📦 Inventory Management
- **Add, Edit, and Delete Products** - Manage your complete product catalog
- **Real-time Stock Tracking** - Monitor current inventory levels
- **Product Categorization** - Organize items by category (Snacks, Beverages, etc.)
- **Cost and Price Management** - Track purchase costs and selling prices
- **Low Stock Alerts** - Automatic notifications when items run low
- **Stock Replenishment** - Quick reorder functionality

### 💰 Sales Recording
- **Quick Sale Entry** - Fast transaction recording for busy periods
- **Multi-item Sales** - Record multiple products in a single transaction
- **Real-time Inventory Updates** - Automatic stock deduction on sales
- **Sales History** - Complete transaction records with timestamps

### 📊 Business Analytics Dashboard
- **Revenue Tracking** - Monitor total sales and revenue
- **Profit Margin Analysis** - Calculate and track profitability
- **Sales Trends** - Visualize daily, weekly, and monthly patterns
- **Top Selling Items** - Identify best-performing products
- **Category Performance** - Compare revenue across product categories
- **Peak Hours Analysis** - Understand when sales are highest
- **Inventory Turnover** - Track how quickly products sell
- **Average Order Value** - Monitor transaction sizes

### 🔐 User Authentication
- **Secure Login/Registration** - Protected user accounts
- **Session Management** - Persistent login sessions
- **Private Routes** - Secure access to business data

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling

### UI Components
- **shadcn/ui** - High-quality component library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon set
- **Recharts** - Data visualization library
- **Framer Motion** - Smooth animations

### Backend & Storage
- **Supabase** - Backend-as-a-Service platform
  - Authentication
  - PostgreSQL database
  - Real-time subscriptions
- **Local Storage** - Client-side data persistence

### Form Management
- **React Hook Form** - Efficient form handling
- **Zod** - Schema validation

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Supabase account (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd inventory-snack3
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_PROJECT_ID=your_project_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📖 Usage Guide

### First Time Setup

1. **Register an Account**
   - Navigate to the registration page
   - Enter your business details
   - Create a secure password

2. **Add Your Products**
   - Go to the Inventory tab
   - Click "Add Item"
   - Enter product details (name, category, cost, price, quantity)
   - Upload product image (optional)

3. **Set Low Stock Thresholds**
   - Configure minimum stock levels for alerts
   - Receive notifications when items need reordering

### Daily Operations

1. **Recording Sales**
   - Navigate to "Record Sale" tab
   - Click "New Sale"
   - Select products and quantities
   - Complete the transaction
   - Inventory automatically updates

2. **Restocking Items**
   - Check "Low Stock Alerts" tab
   - Click "Reorder" on items that need restocking
   - Enter quantity purchased
   - Update inventory levels

3. **Monitoring Performance**
   - Visit the Business Overview dashboard
   - Review sales trends and revenue
   - Identify top-selling products
   - Analyze peak business hours
   - Track profit margins

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── analytics/      # Dashboard and charts
│   ├── auth/           # Login and registration
│   ├── inventory/      # Inventory management
│   ├── layout/         # App layout components
│   └── ui/             # Reusable UI components
├── contexts/           # React context providers
│   ├── AuthContext.tsx
│   └── InventoryContext.tsx
├── services/           # Business logic and API calls
│   ├── analyticsService.ts
│   └── inventoryService.ts
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx             # Main application component
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run build-no-errors` | Build without TypeScript errors |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run types:supabase` | Generate Supabase TypeScript types |

## 🎯 Future Enhancements

- [ ] Multi-user support for team management
- [ ] Receipt printing functionality
- [ ] Barcode scanning for faster checkout
- [ ] Supplier management
- [ ] Purchase order tracking
- [ ] Mobile app version
- [ ] Offline mode support
- [ ] Export reports to PDF/Excel
- [ ] SMS notifications for low stock
- [ ] Integration with payment gateways

## 👥 Contributors

This project was developed as a school assignment for our Information Management course.

## 📄 License

This project is developed for educational purposes as part of a school project.

## 🙏 Acknowledgments

- Our instructors for guidance and support
- Local snack vendors who provided valuable feedback
- The open-source community for amazing tools and libraries

---

**Made with ❤️ for Filipino snack sellers**
