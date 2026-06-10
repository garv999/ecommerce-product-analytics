export interface RetailTransaction {
  Invoice: string;
  StockCode: string;
  Description: string;
  Quantity: string;
  InvoiceDate: string;
  Price: string;
  "Customer ID": string;
  Country: string;
  Revenue: string;
  YearMonth: string;
}

export interface RevenueChartData {
  month: string;
  revenue: number;
}

export interface TopCountry {
  country: string;
  revenue: number;
}

export interface TopProduct {
  product: string;
  revenue: number;
}

export interface RecentOrder {
  customer: string;
  product: string;
  amount: string;
  country: string;
}

export interface AnalyticsPayload {
  rawData: RetailTransaction[];
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  revenueChartData: RevenueChartData[];
  topCountries: TopCountry[];
  topProducts: TopProduct[];
  aiInsights: string[];
  recentOrders: RecentOrder[];
}
