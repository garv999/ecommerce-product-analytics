# E-Commerce Analytics Dashboard

AI-powered ecommerce analytics dashboard built using **Next.js, TypeScript, Tailwind CSS, Recharts, and CSV-based analytics APIs**.
The platform transforms raw ecommerce transaction data into interactive business insights including:

- Revenue analytics
- Customer intelligence
- Product performance
- Country-wise revenue analysis
- AI-generated business insights
- Interactive filters & visualizations

---

## 🌐 Live Demo

### 🚀 Next.js Dashboard (Vercel)
Coming Soon

### 📊 Previous Streamlit Dashboard
https://ecommerce-analytics-garv999.streamlit.app/

---

## ✨ Features

### 📈 Interactive Analytics Dashboard

- Real-time KPI cards
- Dynamic revenue charts
- Top countries analysis
- Top products analysis
- AI business insights
- Recent orders tracking

### 🎨 Modern SaaS UI

- Fully responsive layout
- Dark / Light mode
- Animated premium UI
- Glassmorphism design
- Sidebar navigation
- Interactive notifications

### 🔍 Smart Filtering

- Search products dynamically
- Filter by country
- Filter by timeline
- 7D / 30D / 6M revenue views

### ⚡ Dynamic Data Processing

- CSV-driven analytics engine
- API-based architecture
- Revenue aggregation
- Customer segmentation
- Product revenue ranking

---

# 🛠️ Tech Stack

## Frontend

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts
- Lucide Icons

## Backend / Data Layer

- Next.js API Routes
- PapaParse
- CSV Processing
- Node.js FS module

## Data Science Stack

- Python
- Pandas
- NumPy
- Matplotlib
- Seaborn
- SQL
- Jupyter Notebook

---

# 📂 Project Structure

```bash
ecommerce-product-analytics/
│
├── app/
│   ├── api/
│   │   └── analytics/
│   │       └── route.ts
│   │
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   └── ui/
│
├── dashboard/
│   ├── app.py
│   ├── pages/
│   └── styles/
│
├── data/
│   └── processed/
│       └── cleaned_online_retail.csv
│
├── lib/
│
├── notebooks/
│   ├── 01_data_inspection.ipynb
│   ├── 02_rfm_segmentation.ipynb
│   ├── 03_cohort_analysis.ipynb
│   ├── 04_CLV.ipynb
│   ├── 05_product_analysis.ipynb
│   └── 06_churn_analysis.ipynb
│
├── outputs/
│   ├── figures/
│   │   ├── churn_status.png
│   │   ├── cohort_retention_heatmap.png
│   │   ├── dashboard.png
│   │   ├── monthly_revenue_trend.png
│   │   ├── repeat_products.png
│   │   ├── rfm_customer_segments.png
│   │   ├── top_countries_revenue.png
│   │   ├── top_products_quantity.png
│   │   └── top_products_revenue.png
│   │
│   └── reports/
│       └── insights.md
│
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── sql/
│   └── analysis_queries.sql
│
├── src/
│   └── utils.py
│
├── .env
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
├── components.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
└── requirements.txt
```

---

# 📊 Dashboard Modules

## 1️⃣ Revenue Analytics

- Revenue trends over time
- Dynamic chart filtering
- KPI tracking
- Revenue growth insights

## 2️⃣ Product Analytics

- Top revenue-generating products
- Product search functionality
- Product performance comparison

## 3️⃣ Customer Analytics

- Total customers
- Customer behavior insights
- Geographic customer distribution

## 4️⃣ AI Insights Engine

Automatically generated insights such as:

- Top-performing countries
- Best-selling products
- Average order value
- Customer growth observations

---

# 📈 Visualizations Included

- Revenue Trend Line Chart
- Top Countries Bar Chart
- Top Products Chart
- KPI Analytics Cards
- Interactive Tables

---

# 📦 Dataset

## Source
Online Retail Dataset — UCI Machine Learning Repository

## Main Fields

- Invoice
- Customer ID
- Description
- Quantity
- Revenue
- Country
- YearMonth

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/garv999/ecommerce-product-analytics.git
```

## Navigate Into Project

```bash
cd ecommerce-product-analytics
```

## Install Dependencies

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

# 📡 API Endpoint

Analytics data is served through:

```bash
/api/analytics
```

The API dynamically processes CSV data and returns:

- Revenue metrics
- Orders
- Customers
- Chart datasets
- AI insights
- Product analytics
- Country analytics

---

# 🌙 UI Features

- Dark / Light mode
- Responsive sidebar
- Interactive charts
- Animated hover effects
- Glassmorphism cards
- Notification dropdowns

---

# 📌 Future Improvements

- Authentication system
- Real-time database integration
- Machine learning forecasting
- Customer churn prediction
- Export reports as PDF
- Advanced cohort analysis
- Role-based dashboards

---

# 👨‍💻 Author

## Garv Agarwal

Final Year B.Tech CSE (Data Science) Student

Passionate about:
- Data Analytics
- AI Products
- SaaS Platforms
- Generative AI
- Full Stack Development

GitHub:
https://github.com/garv999

---

# ⭐ Project Highlights

✅ Premium SaaS Dashboard  
✅ Real CSV-driven analytics  
✅ Next.js + TypeScript architecture  
✅ Responsive UI  
✅ Vercel deployment ready  
✅ AI-powered ecommerce insights