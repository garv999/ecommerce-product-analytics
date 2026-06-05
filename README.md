# Ecommerce SaaS Dashboard


<p align="center">
  <strong>Transform raw ecommerce transactions into actionable business intelligence.</strong>
</p>

<p align="center">
A modern analytics platform built with Next.js, TypeScript, Tailwind CSS and a CSV-powered analytics engine.
</p>

<p align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

</p>

---

## Overview

The Intelligent E-Commerce Analytics Dashboard is a production-style SaaS analytics platform that transforms raw ecommerce transaction data into actionable business intelligence through interactive visualizations and analytics APIs.

Built using modern full-stack technologies, it combines a lightweight analytics API with an elegant dashboard interface to provide real-time insights into:

- Revenue performance
- Product trends
- Customer behavior
- Geographic sales distribution
- Operational KPIs
- AI-generated business recommendations

The repository also includes the complete analytics pipeline used to clean, transform, and analyze the underlying dataset, making it both a production-style SaaS application and a comprehensive data analytics project.

---

## Live Demo

### Next.js Dashboard

### 🚀 Live Dashboard

[Vercel](https://ecommerce-product-analytics.vercel.app)
Experience the fully interactive production deployment built with Next.js and TypeScript.

### Previous Streamlit Prototype

[Streamlit Prototype](https://ecommerce-analytics-garv999.streamlit.app/)

---

## Dashboard Preview

Dashboard screenshots will be added after public deployment.

---

# Features

## Business Analytics

### Revenue Intelligence

* Monthly revenue tracking
* Dynamic trend visualization
* Growth indicators
* KPI monitoring

### Product Analytics

* Top-performing products
* Revenue contribution analysis
* Product search
* Dynamic filtering

### Customer Intelligence

* Customer segmentation
* Total customer metrics
* Geographic distribution
* Recent order tracking

### Country Analytics

* Country-wise revenue
* Sales contribution charts
* Regional business insights

### AI Insights Engine

Automatically generates observations such as:

* Highest revenue markets
* Best-selling products
* Revenue concentration
* Customer growth patterns
* Business recommendations

---

# Modern SaaS Experience

* Responsive layout
* Dark / Light mode
* Glassmorphism UI
* Animated interactions
* Collapsible sidebar
* Mobile navigation drawer
* Notification center
* Profile menu
* CSV export functionality

---

# Smart Filtering

Users can dynamically filter the entire dashboard using:

* Product Search
* Country Filter
* Timeline Filter
* 7D / 30D / Full Revenue Views

All charts and KPIs update automatically.

---

# Architecture

```
                        CSV Dataset
                              │
                              ▼
                  Next.js API Route
                    (/api/analytics)
                              │
               ┌──────────────┼──────────────┐
               ▼              ▼              ▼
        Revenue Logic   Product Logic   Customer Logic
               │              │              │
               └──────────────┼──────────────┘
                              ▼
                   Analytics JSON API
                              │
                              ▼
                  React Dashboard UI
                              │
               ┌──────────────┼──────────────┐
               ▼              ▼              ▼
          Charts         KPI Cards      AI Insights
```

---

# Technology Stack

## Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS
* shadcn/ui
* Recharts
* Lucide React

## Backend

* Next.js API Routes
* Node.js
* PapaParse
* CSV Processing
* File System API

## Data Analytics

* Python
* Pandas
* NumPy
* SQL
* Jupyter Notebook
* Matplotlib
* Seaborn

---

## Project Structure

```text
ecommerce-saas-dashboard/
│
├── app/                           # Next.js App Router
│   ├── api/
│   │   └── analytics/
│   │       └── route.ts           # Analytics API
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                   # Main SaaS Dashboard
│
├── components/
│   └── ui/                        # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── table.tsx
│       └── tabs.tsx
│
├── dashboard/                     # Legacy Streamlit prototype
│   ├── app.py
│   ├── pages/
│   └── styles/
│
├── data/
│   └── processed/
│       └── cleaned_online_retail.csv
│
├── notebooks/                     # Data analysis notebooks
│   ├── 01_data_inspection.ipynb
│   ├── 02_rfm_segmentation.ipynb
│   ├── 03_cohort_analysis.ipynb
│   ├── 04_CLV.ipynb
│   ├── 05_product_analysis.ipynb
│   └── 06_churn_analysis.ipynb
│
├── outputs/
│   ├── figures/                   # Generated visualizations
│   └── reports/
│       └── insights.md
│
├── sql/
│   └── analysis_queries.sql
│
├── src/
│   └── utils.py
│
├── public/
├── package.json
├── next.config.ts
├── eslint.config.mjs
├── tsconfig.json
└── README.md
```

---

## Repository Organization

This repository consists of two connected layers.

### 1. Analytics Engine

Responsible for:

- Data cleaning
- Revenue aggregation
- RFM segmentation
- CLV analysis
- Cohort analysis
- Customer churn exploration
- SQL analytics

Built using:

- Python
- Pandas
- NumPy
- SQL
- Jupyter Notebook

---

### 2. SaaS Dashboard

Provides an interactive analytics experience with:

- KPI monitoring
- Revenue visualization
- Product & customer analytics
- Geographic insights
- AI-generated business recommendations

Built using:

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts

---

## API

### Endpoint

```http
GET /api/analytics
```

The analytics API processes the cleaned ecommerce dataset and dynamically generates dashboard-ready JSON.

### Response

```json
{
  "revenue": "...",
  "orders": "...",
  "customers": "...",
  "topProducts": [],
  "topCountries": [],
  "recentOrders": [],
  "aiInsights": []
}
```

---

# Dataset

**Source:** Online Retail Dataset (UCI Machine Learning Repository)

### Core Fields

| Field       | Description         |
| ----------- | ------------------- |
| Invoice     | Transaction ID      |
| Customer ID | Unique Customer     |
| Description | Product Name        |
| Quantity    | Units Purchased     |
| Revenue     | Transaction Revenue |
| Country     | Customer Country    |
| YearMonth   | Aggregated Month    |

---

# Local Development

## Clone Repository

```bash
git clone https://github.com/garv999/ecommerce-product-analytics.git
```

## Install Dependencies

```bash
npm install
```

## Start Development Server

```bash
npm run dev
```

Visit:

```text
http://localhost:3000
```

---

# Deployment

The application is optimized for deployment on Vercel.

```bash
npm run build
```

Production build is fully optimized and deployment-ready.

---

# Engineering Highlights

* API-first architecture
* CSV-driven analytics pipeline
* Responsive SaaS interface
* Persistent theme management
* Dynamic client-side filtering
* Reusable component system
* Production-ready Next.js structure

---

## Author

**Garv Agarwal**

Computer Science (Data Science) undergraduate passionate about building AI products, analytics platforms, and modern SaaS applications.

- GitHub: https://github.com/garv999
- LinkedIn: https://www.linkedin.com/in/garv-agarwal-0273161b9

---

## License

This project is available under the MIT License.

---

<p align="center">
  <strong>Turning data into business decisions.</strong>
</p>

<p align="center">
Built with Next.js • TypeScript • Tailwind CSS • Recharts • Data Analytics
</p>
