# 🔍 Product Scanner - AI-Powered Product Safety Analysis

<div align="center">

![Product Scanner](https://img.shields.io/badge/Product-Scanner-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14.2.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)

**Scan. Analyze. Stay Informed.**

A smart product scanning application that helps you make informed decisions about food and consumer products by analyzing ingredients, nutritional content, and potential health risks.

[Demo](#-demo) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Setup](#-api-setup)

</div>

---

## 🌟 Features

### 🎯 Core Functionality
- **📱 Barcode Scanning** - Scan product barcodes using your device camera
- **🧪 Ingredient Analysis** - Detailed breakdown of all ingredients with safety ratings
- **⚠️ Health Warnings** - Instant alerts for harmful substances and allergens
- **📊 Safety Score** - Overall product safety rating (0-10 scale)
- **🎨 Nutri-Score** - Standard nutritional quality indicator (A-E rating)
- **📈 Product Dashboard** - Track your scanned products and history

### 💡 Smart Features
- **🤖 AI-Powered Analysis** - Intelligent product evaluation using OpenAI (optional)
- **🔄 Fallback System** - Rule-based analysis when AI is unavailable
- **🔥 Demo Mode** - Pre-loaded demo products for instant testing
- **📱 Responsive Design** - Works seamlessly on desktop and mobile
- **🎨 Modern UI** - Beautiful dark theme with smooth animations
- **🔐 Firebase Auth** - Optional Google Sign-In (demo works without it)

### 🛡️ Safety Analysis
- Harmful substance detection
- Allergen identification
- Sugar/salt/fat content warnings
- Artificial additive alerts
- Nutritional balance assessment

---

## 🖼️ Demo

### 🏠 Landing Page
Clean, modern interface with feature highlights and call-to-action buttons.

### 📷 Scanner Interface
Real-time barcode scanning with camera integration and demo product options.

### 📊 Product Analysis
Comprehensive breakdown showing:
- Safety score with color-coded indicators
- Nutri-score badge
- Complete ingredient list with risk levels
- Health warnings and recommendations
- Nutritional information

### 📈 Dashboard
Track all your scanned products with quick access to detailed analysis.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14.2.4 with App Router
- **Language:** TypeScript
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **Scanner:** html5-qrcode
- **Authentication:** Firebase Auth (optional)
- **Database:** Firestore (optional)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **AI:** OpenAI GPT (optional)
- **Product Data:** OpenFoodFacts API (optional)
- **Database:** MongoDB (optional)
- **Auth:** Firebase Admin SDK (optional)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- (Optional) Firebase account for authentication
- (Optional) OpenAI API key for AI analysis
- (Optional) MongoDB for data caching

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Mr-spiky/Product-Scanner.git
cd Product-Scanner
```

2. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

3. **Install Backend Dependencies**
```bash
cd ../backend
npm install
```

4. **Configure Environment Variables**

**Frontend** - Create `frontend/.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Backend** - Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/product-scanner
OPENAI_API_KEY=your_openai_api_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
```

5. **Start the Backend Server**
```bash
cd backend
npm start
```

6. **Start the Frontend Development Server**
```bash
cd frontend
npm run dev
```

7. **Open your browser**
```
http://localhost:3000
```

---

## 🎮 Demo Mode

The application works perfectly in **demo mode** without any API keys! It includes:

- ✅ 6 pre-loaded demo products (Coca-Cola, Apple Juice, Cookies, Bread, Energy Drink, Yogurt)
- ✅ Rule-based ingredient analysis
- ✅ Full safety scoring system
- ✅ All UI features functional
- ✅ Barcode scanner interface
- ✅ Dashboard with mock data

**Perfect for testing, presentations, or hackathons!**

---

## 🔑 API Setup

### Firebase (Optional)
1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication → Google Sign-In
3. Enable Firestore Database
4. Download service account credentials
5. Add configuration to `.env` files

### OpenAI (Optional)
1. Sign up at [OpenAI Platform](https://platform.openai.com/)
2. Generate an API key
3. Add `OPENAI_API_KEY` to `backend/.env`

### MongoDB (Optional)
1. Install MongoDB locally or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Update `MONGODB_URI` in `backend/.env`

**Note:** All APIs are optional. The app has intelligent fallbacks and demo mode.

---

## 📁 Project Structure

```
Product-Scanner/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App router pages
│   │   ├── page.tsx        # Landing page
│   │   ├── scan/           # Scanner page
│   │   ├── dashboard/      # Product dashboard
│   │   └── admin/          # Admin panel
│   ├── components/          # React components
│   │   ├── BarcodeScanner.tsx
│   │   ├── AuthContext.tsx
│   │   └── ui/             # UI components
│   └── lib/                # Utilities
│
├── backend/                 # Express backend server
│   ├── server.js           # Entry point
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   │   ├── aiAnalysisService.js
│   │   ├── productService.js
│   │   └── openFoodFactsService.js
│   ├── models/             # Data models
│   └── config/             # Configuration files
│
└── README.md               # You are here!
```

---

## 🎯 Usage

### Scanning a Product

1. Click **"Scan"** in the navigation bar
2. Allow camera permissions
3. Point camera at product barcode
4. View instant analysis results

### Using Demo Products

1. Navigate to the scanner page
2. Click any demo product button
3. See pre-loaded analysis instantly

### Viewing Dashboard

1. Click **"Dashboard"** in navigation
2. Browse your scan history
3. Click any product for detailed view

---

## 🔒 Security Features

- Environment variable protection for sensitive data
- `.env` files excluded from version control
- Firebase security rules for database access
- API rate limiting on backend
- Input sanitization and validation
- Secure authentication flow

---

## 🎨 UI/UX Highlights

- **Dark Theme** - Easy on the eyes, modern aesthetic
- **Responsive Design** - Works on all screen sizes
- **Loading States** - Smooth transitions and feedback
- **Error Handling** - User-friendly error messages
- **Animations** - Subtle motion for better UX
- **Accessibility** - Keyboard navigation support

---

## 🚧 Roadmap

- [ ] Multi-language support
- [ ] Offline mode with service workers
- [ ] Product comparison feature
- [ ] Custom allergen profiles
- [ ] Dietary restriction filters
- [ ] Export scan history
- [ ] Nutrition trends visualization
- [ ] Community reviews and ratings

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Mr-spiky**

- GitHub: [@Mr-spiky](https://github.com/Mr-spiky)
- Repository: [Product-Scanner](https://github.com/Mr-spiky/Product-Scanner)

---

## 🙏 Acknowledgments

- [OpenFoodFacts](https://world.openfoodfacts.org/) - Product database
- [OpenAI](https://openai.com/) - AI analysis capabilities
- [Firebase](https://firebase.google.com/) - Authentication and database
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [html5-qrcode](https://github.com/mebjas/html5-qrcode) - Barcode scanning

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Made with ❤️ for health-conscious consumers**

</div>
