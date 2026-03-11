# NDVI Dashboard | Precision Agriculture

A comprehensive web application for monitoring crop health using **Sentinel Hub NDVI** data. Built as a dissertation project to demonstrate the power of remote sensing in modern farm management.

## 🚀 Features

- **Interactive Satellite Mapping**: Custom field selection using Leaflet.js with area-specific coordinate tracking.
- **NDVI Time Series**: High-resolution vegetation index charts powered by Chart.js.
- **Historical Analysis**: Temporal slider to track crop development across different seasons.
- **Multi-Field Comparison**: Compare vegetation health trends between different parcels side-by-side.
- **Responsive Design**: Modern, glassmorphic UI built with Next.js and Tailwind CSS.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15+, TypeScript, Tailwind CSS
- **Maps**: Leaflet.js, React-Leaflet
- **Charts**: Chart.js 4+, React-Chartjs-2
- **Backend**: Next.js API Routes (Serverless)
- **Data Source**: Sentinel Hub (Copernicus Sentinel-2)

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ndvi-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and add your Sentinel Hub credentials:
   ```env
   SENTINEL_HUB_CLIENT_ID=your_client_id
   SENTINEL_HUB_CLIENT_SECRET=your_client_secret
   ```
   *Note: If no credentials are found, the app will run in "Simulation Mode" with realistic mock data.*

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 🛰️ Sentinel Hub Integration

The backend (`/api/ndvi`) handles OAuth 2.0 authentication with Sentinel Hub. It processes polygon geometries (GeoJSON) and retrieves statistical NDVI values for the requested date ranges.

## 📄 License & Purpose

This project is part of a dissertation on Precision Agriculture. It is designed to be modular and easily expandable for real-world agricultural deployments.
