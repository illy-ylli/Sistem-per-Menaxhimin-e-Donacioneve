# Sistem për Menaxhimin e Donacioneve (Charity Management System)

## 📌 Përshkrimi i Projektit

Ky sistem mundëson mbledhjen dhe gjurmimin e donacioneve përmes një platforme të plotë web. Projekti përfshin menaxhimin e fushatave bamirëse, regjistrimin e donatorëve, procesimin e pagesave online përmes integrimit me Stripe, si dhe gjurmimin e shpenzimeve dhe përfituesve.

Sistemi ofron CRUD të plota për fushatat, kategoritë, donatorët, donacionet, shpenzimet, përfituesit, vullnetarët dhe raportet. Përdoruesit e thjeshtë mund të regjistrohen, të kyçen, të shohin fushatat aktive dhe të bëjnë donacione online në mënyrë të sigurt. Sistemi gjithashtu ofron një dashboard të plotë me statistika të fondit të mbledhur, shpenzimeve dhe transparencës financiare.

## 👥 Anëtarët e Ekipit

| Emri | Roli | Përgjegjësitë |

| Erion Bajraktari (EB) | Backend & Frontend | Stripe integrimi, Dashboard, Donacionet, Expenses, Beneficiaries, Updates, Autentikimi |
| Ylli Hashani (YH) | Backend & Frontend | Campaigns CRUD, Donors CRUD, Volunteers, CampaignVolunteers, Reports |

## 🛠️ Teknologjitë e Përdorura

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **Sequelize** - ORM
- **JWT** - Autentikim
- **Stripe** - Pagesat online
- **bcryptjs** - Hashimi i fjalëkalimeve
- **express-validator** - Validimi i të dhënave

### Frontend
- **React.js** - Library për UI
- **React Router** - Navigimi
- **Axios** - HTTP requests
- **Bootstrap 5** - Stilizimi
- **Stripe React SDK** - Pagesat
- **React Hot Toast** - Notifikimet

### Mjete të Tjera
- **Git & GitHub** - Version control
- **VS Code** - Editor
- **Postman** - API testing

## 📁 Struktura e Projektit
├── backend/
│ ├── config/ # Database configuration
│ ├── controllers/ # Logic per çdo entitet
│ ├── middleware/ # Auth, validation
│ ├── models/ # Sequelize models
│ ├── routes/ # API routes
│ ├── utils/ # Helper functions
│ └── server.js # Entry point
├── frontend/
│ ├── public/ # Static files
│ ├── src/
│ │ ├── components/ # Reusable components (Header, PrivateRoute, etc.)
│ │ ├── pages/ # Pages (Dashboard, Donations, Campaigns, etc.)
│ │ ├── services/ # API calls
│ │ ├── utils/ # Helper functions (errorHandler)
│ │ ├── App.js # Main component
│ │ └── index.js # Entry point
│ └── package.json
└── database/ # SQL scripts

text

## 🔐 Roli i Përdoruesve

| Roli | Përshkrimi | Qasja |
|------|------------|-------|
| **Admin** | Administrator i sistemit | Qasje e plotë (CRUD për të gjitha entitetet) |
| **Manager** | Menaxher | Qasje e plotë (pa fshirje të disa entiteteve) |
| **User** | Përdorues normal | Mund të shohë fushatat, të bëjë donacione dhe të shohë donacionet e veta |

## 📊 Funksionalitetet Kryesore

### Për Admin/Manager
- ✅ CRUD për fushatat
- ✅ CRUD për kategoritë e fushatave
- ✅ CRUD për donatorët
- ✅ Menaxhimi i donacioneve
- ✅ CRUD për shpenzimet
- ✅ CRUD për përfituesit
- ✅ CRUD për vullnetarët
- ✅ Caktimi i vullnetarëve në fushata
- ✅ Gjenerimi i raporteve

### Për Përdoruesit Normal
- ✅ Regjistrim dhe kyçje
- ✅ Shikimi i fushatave aktive
- ✅ Donacione online me Stripe
- ✅ Shikimi i historikut të donacioneve të veta
- ✅ Shikimi i donatorëve

## 💳 Integrimi me Stripe

Pagesat online realizohen përmes Stripe API. Për testim përdorni kartën:
Numri: 4242 4242 4242 4242
Data e skadimit: çdo datë në të ardhmen
CVC: çdo 3 shifra

text

## 🚀 Instalimi dhe Ekzekutimi

### Kërkesat
- Node.js (v18+)
- MySQL (v8+)
- Stripe account (për pagesa)

### Hapat

1. **Klonimi i repozitorit**
```bash
git clone https://github.com/illy-ylli/Sistem-per-Menaxhimin-e-Donacioneve.git
cd Sistem-per-Menaxhimin-e-Donacioneve
Konfigurimi i Backend-it

bash
cd backend
npm install
cp .env.example .env  # Konfiguro variablat e ambientit
Konfigurimi i .env

env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=charity_db
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_...
Krijimi i Database

sql
CREATE DATABASE charity_db;
USE charity_db;
-- Ekzekuto skriptat SQL nga folderi database/
Fillimi i Backend-it

bash
npm run dev
Konfigurimi i Frontend-it

bash
cd frontend
npm install
cp .env.example .env
Konfigurimi i .env për frontend

env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
Fillimi i Frontend-it

bash
npm start
Hapja e aplikacionit

text
http://localhost:3000
🔗 Rrugët API (Endpoint-et kryesore)
Metoda	Endpoint	Përshkrimi	Autorizimi
POST	/api/auth/register	Regjistrim	Public
POST	/api/auth/login	Kyçje	Public
GET	/api/dashboard/stats	Statistikat	User+
GET	/api/campaigns	Lista e fushatave	User+
POST	/api/campaigns	Krijo fushatë	Admin/Manager
GET	/api/donations	Lista e donacioneve	User+
POST	/api/donations	Krijo donacion	User+
POST	/api/payments/create-payment-intent	Krijo pagesë	User+
👥 Kontributet
Anëtari	Detyrat
Erion Bajraktari	Backend: Auth, Donations, Expenses, Beneficiaries, Dashboard, Stripe integration; Frontend: Dashboard, Donations, Login/Register, Header, Error handling, Lazy loading
Ylli Hashani	Backend: Campaigns CRUD, Donors CRUD, Volunteers, CampaignVolunteers, Reports; Frontend: Campaigns pages, Donors pages, User views
📝 Përfundim
Ky projekt realizon një sistem të plotë për menaxhimin e donacioneve duke përfshirë të gjitha funksionalitetet e kërkuara. Sistemi është i sigurt, i shkallëzuar dhe i lehtë për t'u përdorur.

Data e përfundimit: Qershor 2026
Institucioni: UBT - Universiteti i Biznesit dhe Teknologjis
Lënda: LAB1