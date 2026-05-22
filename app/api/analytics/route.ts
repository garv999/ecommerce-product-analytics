import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

export async function GET() {
  try {

    // CSV FILE PATH
    const filePath = path.join(
      process.cwd(),
      "data",
      "processed",
      "cleaned_online_retail.csv"
    );

    // READ CSV
    const csvFile = fs.readFileSync(filePath, "utf8");

    // PARSE CSV
    const parsedData = Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
    });

    const data = parsedData.data as any[];

    // TOTAL REVENUE
    const totalRevenue = data.reduce((sum, row) => {
      return sum + Number(row.Revenue || 0);
    }, 0);

    // TOTAL ORDERS
    const uniqueInvoices = new Set(
      data.map((row) => row.Invoice)
    );

    // TOTAL CUSTOMERS
    const uniqueCustomers = new Set(
      data.map((row) => row["Customer ID"])
    );

    // MONTHLY REVENUE
    const monthlyMap: Record<string, number> = {};

    data.forEach((row) => {

      const month = row.YearMonth;

      if (!month) return;

      if (!monthlyMap[month]) {
        monthlyMap[month] = 0;
      }

      monthlyMap[month] += Number(row.Revenue || 0);
    });

    const revenueChartData = Object.entries(monthlyMap).map(
      ([month, revenue]) => ({
        month,
        revenue: Math.round(revenue),
      })
    );
    // TOP COUNTRIES

    const countryMap: Record<string, number> = {};

    data.forEach((row) => {

    const country = row.Country;

    if (!country) return;

    if (!countryMap[country]) {
        countryMap[country] = 0;
    }

    countryMap[country] += Number(row.Revenue || 0);

    });

    const topCountries = Object.entries(countryMap)
    .map(([country, revenue]) => ({
        country,
        revenue: Math.round(revenue),
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 7);

    // TOP PRODUCTS

    const productMap: Record<string, number> = {};

    data.forEach((row) => {

    const product = row.Description;

    if (!product) return;

    if (!productMap[product]) {
        productMap[product] = 0;
    }

    productMap[product] += Number(row.Revenue || 0);

    });

    const topProducts = Object.entries(productMap)
    .map(([product, revenue]) => ({
        product:
        product.length > 28
            ? product.slice(0, 28) + "..."
            : product,
        revenue: Math.round(revenue),
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

    // AI INSIGHTS

    const aiInsights = [

    `Top market is ${
        topCountries[0]?.country || "Unknown"
    } with highest revenue contribution.`,

    `Best selling product is ${
        topProducts[0]?.product || "Unknown"
    }.`,

    `Average order value is ₹${Math.round(
        totalRevenue / uniqueInvoices.size
    )}.`,

    `Customer base includes ${
        uniqueCustomers.size
    } unique buyers.`,

    ];

    // RECENT ORDERS
    const recentOrders = data
      .slice(0, 8)
      .map((row) => ({
        customer: row["Customer ID"],
        product: row.Description,
        amount: `₹${Number(row.Revenue).toFixed(0)}`,
        country: row.Country,
      }));

    return NextResponse.json({
        totalRevenue,
        totalOrders: uniqueInvoices.size,
        totalCustomers: uniqueCustomers.size,
        revenueChartData,
        topCountries,
        topProducts,
        aiInsights,
        recentOrders,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to process analytics",
      },
      { status: 500 }
    );
  }
}