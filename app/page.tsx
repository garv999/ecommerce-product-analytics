"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  LayoutDashboard,
  Menu,
  Moon,
  Search,
  ShoppingCart,
  Sparkles,
  Sun,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type RetailRow = {
  Invoice?: string;
  InvoiceDate?: string;
  YearMonth?: string;
  Description?: string;
  Country?: string;
  Revenue?: number | string;
  "Customer ID"?: string;
};

type AnalyticsPayload = {
  rawData: RetailRow[];
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  revenueChartData: { month: string; revenue: number }[];
  topCountries: { country: string; revenue: number }[];
  topProducts: { product: string; revenue: number }[];
  aiInsights: string[];
  recentOrders: {
    customer: string;
    product: string;
    amount: string;
    country: string;
  }[];
};

const sidebarItems = [
  { title: "Dashboard", icon: LayoutDashboard },
  { title: "Products", icon: ShoppingCart },
  { title: "Customers", icon: Users },
  { title: "Revenue", icon: TrendingUp },
];

const notifications = [
  { title: "Revenue increased by 12%", time: "2 min ago" },
  { title: "New customer registered", time: "10 min ago" },
  { title: "Top product sales spiked", time: "25 min ago" },
];

const compactCurrency = (value: number) =>
  `₹${(value / 10000000).toFixed(2)} Cr`;

const tooltipStyle = {
  background: "#0d1117",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  borderRadius: 8,
  color: "#f8fafc",
};

function SidebarPanel({
  sidebarOpen,
  activeSidebar,
  inputSurface,
  mutedText,
  filteredRows,
  onToggleSidebar,
  onSelectItem,
}: {
  sidebarOpen: boolean;
  activeSidebar: string;
  inputSurface: string;
  mutedText: string;
  filteredRows: number;
  onToggleSidebar: () => void;
  onSelectItem: (title: string) => void;
}) {
  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold tracking-tight text-emerald-300">
            {sidebarOpen ? "EcommerceAI" : "EA"}
          </p>
          {sidebarOpen && (
            <p className={`mt-1 text-xs ${mutedText}`}>Growth intelligence</p>
          )}
        </div>
        <button
          type="button"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          onClick={onToggleSidebar}
          className={`hidden size-8 items-center justify-center rounded-lg border transition md:flex ${inputSurface}`}
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      <nav aria-label="Primary" className="space-y-1.5">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSidebar === item.title;

          return (
            <button
              key={item.title}
              type="button"
              onClick={() => onSelectItem(item.title)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                sidebarOpen ? "justify-start" : "justify-center"
              } ${
                isActive
                  ? "bg-emerald-400/12 text-emerald-300 ring-1 ring-emerald-400/25"
                  : `${mutedText} hover:bg-slate-500/10 hover:text-current`
              }`}
              title={item.title}
            >
              <Icon size={18} />
              {sidebarOpen && <span>{item.title}</span>}
            </button>
          );
        })}
      </nav>

      <div className={`mt-auto rounded-lg border p-3 ${inputSurface}`}>
        <p className="text-xs font-medium text-emerald-300">Live data</p>
        {sidebarOpen && (
          <p className={`mt-1 text-xs leading-5 ${mutedText}`}>
            {filteredRows.toLocaleString()} filtered rows synced from retail
            transactions.
          </p>
        )}
      </div>
    </>
  );
}

function MetricCard({
  label,
  value,
  delta,
  accent,
  data,
  cardSurface,
  mutedText,
  growthPositive,
}: {
  label: string;
  value: string;
  delta: string;
  accent: string;
  data: { month: string; revenue: number }[];
  cardSurface: string;
  mutedText: string;
  growthPositive: boolean;
}) {
  const values = data.slice(-16).map((point) => point.revenue);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);
  const points = values
    .map((value, index) => {
      const x = values.length > 1 ? (index / (values.length - 1)) * 100 : 0;
      const y = 42 - ((value - min) / range) * 34;
      return `${x},${y}`;
    })
    .join(" ");
  const fillPoints = `0,48 ${points} 100,48`;

  return (
    <Card className={`${cardSurface} rounded-lg transition hover:-translate-y-0.5`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={`text-xs font-medium uppercase tracking-wide ${mutedText}`}>
              {label}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
          </div>
          <span
            className={`rounded-md px-2 py-1 text-xs font-semibold ${
              growthPositive
                ? "bg-emerald-400/12 text-emerald-300"
                : "bg-rose-400/12 text-rose-300"
            }`}
          >
            {delta}
          </span>
        </div>
        <div className="mt-5 h-14">
          <svg
            aria-hidden="true"
            className="h-full w-full overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 100 48"
          >
            <polygon points={fillPoints} fill={accent} opacity="0.12" />
            <polyline
              points={points}
              fill="none"
              stroke={accent}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
            />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("6M");
  const [activeSidebar, setActiveSidebar] = useState("Dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("theme") !== "light";
  });
  const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null);
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const start = Date.now();
      try {
        const response = await fetch("/api/analytics");
        if (!response.ok) throw new Error("Failed to fetch analytics");
        setAnalytics(await response.json());
      } catch (error) {
        console.error("Analytics Error:", error);
      } finally {
        const elapsed = Date.now() - start;
        setTimeout(() => setLoading(false), Math.max(0, 400 - elapsed));
      }
    };

    fetchAnalytics();
  }, []);

  const rawData = useMemo(() => analytics?.rawData || [], [analytics?.rawData]);

  const filteredData = useMemo(() => {
    let data = [...rawData];
    const query = searchQuery.toLowerCase();

    data = data.filter((row) =>
      row.Description?.toLowerCase().includes(query)
    );

    if (selectedCountry !== "All") {
      data = data.filter((row) => row.Country === selectedCountry);
    }

    if (dateRange === "Recent") {
      data = data.slice(-500);
    }

    return data;
  }, [rawData, searchQuery, selectedCountry, dateRange]);

  const recentOrders = (analytics?.recentOrders || []).filter((order) => {
    const matchesSearch = order.product
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCountry =
      selectedCountry === "All" || order.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const topFilteredProducts = useMemo(() => {
    return Object.entries(
      filteredData.reduce<Record<string, number>>((acc, row) => {
        const product = row.Description || "Unknown";
        acc[product] = (acc[product] || 0) + Number(row.Revenue || 0);
        return acc;
      }, {})
    )
      .map(([product, revenue]) => ({
        product: product.length > 38 ? `${product.slice(0, 38)}...` : product,
        revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [filteredData]);

  const topCustomers = useMemo(() => {
    return Object.entries(
      filteredData.reduce<Record<string, number>>((acc, row) => {
        const customer = row["Customer ID"] || "Unknown";
        acc[customer] = (acc[customer] || 0) + Number(row.Revenue || 0);
        return acc;
      }, {})
    )
      .map(([customer, revenue]) => ({ customer, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [filteredData]);

  const filteredRevenue = filteredData.reduce(
    (sum, row) => sum + Number(row.Revenue || 0),
    0
  );
  const filteredOrders = new Set(filteredData.map((row) => row.Invoice)).size;
  const activeUsers = new Set(filteredData.map((row) => row["Customer ID"])).size;
  const ordersPerCustomer =
    activeUsers > 0 ? (filteredOrders / activeUsers).toFixed(1) : "0.0";

  const filteredRevenueData = useMemo(() => {
    const revenueMap: Record<string, number> = {};

    filteredData.forEach((row) => {
      const date = row.InvoiceDate?.split(" ")[0] || row.YearMonth;
      if (!date) return;
      revenueMap[date] = (revenueMap[date] || 0) + Number(row.Revenue || 0);
    });

    return Object.entries(revenueMap)
      .map(([month, revenue]) => ({ month, revenue: Number(revenue) }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [filteredData]);

  let chartData = filteredRevenueData;
  if (selectedPeriod === "7D") chartData = chartData.slice(-7);
  if (selectedPeriod === "30D") chartData = chartData.slice(-12);

  const currentRevenue = chartData.at(-1)?.revenue || 0;
  const previousRevenue = chartData.at(-2)?.revenue || 0;
  const revenueGrowth =
    previousRevenue > 0
      ? (((currentRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1)
      : "0.0";

  const growthPositive = Number(revenueGrowth) >= 0;
  const countryData =
    selectedCountry === "All"
      ? analytics?.topCountries.slice(0, 10) || []
      : (analytics?.topCountries || []).filter(
          (country) => country.country === selectedCountry
        );

  const appTheme = darkMode
    ? "bg-[#07090d] text-slate-50"
    : "bg-[#f5f7fb] text-slate-950";
  const shellSurface = darkMode
    ? "border-slate-800/80 bg-[#0d1117]/90"
    : "border-slate-200 bg-white/90";
  const cardSurface = darkMode
    ? "border-slate-800/90 bg-[#0d1117] text-slate-50"
    : "border-slate-200 bg-white text-slate-950 shadow-sm";
  const mutedText = darkMode ? "text-slate-400" : "text-slate-500";
  const inputSurface = darkMode
    ? "border-slate-800 bg-[#0d1117] text-slate-100"
    : "border-slate-200 bg-white text-slate-950 shadow-sm";

  const exportCSV = () => {
    const headers = [
      "Invoice",
      "Customer ID",
      "Description",
      "Country",
      "Revenue",
      "YearMonth",
    ];
    const rows = filteredData.map((row) => [
      row.Invoice,
      row["Customer ID"],
      row.Description,
      row.Country,
      row.Revenue,
      row.YearMonth,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((entry) => entry.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "analytics_export.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const selectNavItem = (title: string) => {
    setActiveSidebar(title);
    setMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07090d] text-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="size-11 rounded-full border-2 border-emerald-300 border-t-transparent animate-spin" />
          <p className="text-sm text-slate-400">Loading analytics...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen transition-colors duration-300 ${appTheme}`}>
      <div className="flex min-h-screen">
        <aside
          className={`hidden shrink-0 flex-col border-r p-4 transition-all duration-300 md:flex ${
            sidebarOpen ? "w-64" : "w-20"
          } ${shellSurface}`}
        >
          <SidebarPanel
            sidebarOpen={sidebarOpen}
            activeSidebar={activeSidebar}
            inputSurface={inputSurface}
            mutedText={mutedText}
            filteredRows={filteredData.length}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onSelectItem={selectNavItem}
          />
        </aside>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <button
              type="button"
              aria-label="Close navigation"
              className="absolute inset-0 bg-black/60"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className={`relative flex h-full w-72 flex-col border-r p-4 ${shellSurface}`}>
              <div className="mb-6 flex items-center justify-between">
                <p className="font-semibold text-emerald-300">EcommerceAI</p>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`size-9 rounded-lg border ${inputSurface}`}
                >
                  <X className="mx-auto" size={18} />
                </button>
              </div>
              <SidebarPanel
                sidebarOpen
                activeSidebar={activeSidebar}
                inputSurface={inputSurface}
                mutedText={mutedText}
                filteredRows={filteredData.length}
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                onSelectItem={selectNavItem}
              />
            </aside>
          </div>
        )}

        <section className="min-w-0 flex-1">
          <header
            className={`sticky top-0 z-40 border-b px-4 py-3 backdrop-blur-xl lg:px-8 ${shellSurface}`}
          >
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                aria-label="Open navigation"
                onClick={() => setMobileMenuOpen(true)}
                className={`size-10 rounded-lg border md:hidden ${inputSurface}`}
              >
                <Menu className="mx-auto" size={18} />
              </button>

              <div className={`flex min-w-[190px] flex-1 items-center gap-2 rounded-lg border px-3 py-2 ${inputSurface}`}>
                <Search size={17} className={mutedText} />
                <input
                  type="search"
                  placeholder="Search products, orders, countries..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                />
              </div>

              <select
                aria-label="Country filter"
                value={selectedCountry}
                onChange={(event) => setSelectedCountry(event.target.value)}
                className={`h-10 rounded-lg border px-3 text-sm outline-none ${inputSurface}`}
              >
                <option value="All">All countries</option>
                {(analytics?.topCountries || []).map((country) => (
                  <option key={country.country} value={country.country}>
                    {country.country}
                  </option>
                ))}
              </select>

              <select
                aria-label="Date range"
                value={dateRange}
                onChange={(event) => setDateRange(event.target.value)}
                className={`h-10 rounded-lg border px-3 text-sm outline-none ${inputSurface}`}
              >
                <option value="All">Full timeline</option>
                <option value="Recent">Recent months</option>
              </select>

              <button
                type="button"
                onClick={exportCSV}
                disabled={!analytics}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-300 px-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download size={16} />
                Export
              </button>

              <button
                type="button"
                aria-label="Toggle theme"
                title="Toggle theme"
                onClick={() => setDarkMode(!darkMode)}
                className={`size-10 rounded-lg border transition ${inputSurface}`}
              >
                {darkMode ? (
                  <Sun className="mx-auto text-amber-300" size={17} />
                ) : (
                  <Moon className="mx-auto" size={17} />
                )}
              </button>

              <div className="relative">
                <button
                  type="button"
                  aria-label="Notifications"
                  title="Notifications"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative size-10 rounded-lg border transition ${inputSurface}`}
                >
                  <Bell className="mx-auto" size={17} />
                  <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-emerald-300" />
                </button>

                {showNotifications && (
                  <div className={`absolute right-0 mt-3 w-80 overflow-hidden rounded-lg border shadow-xl ${shellSurface}`}>
                    <div className="border-b border-slate-500/10 p-4">
                      <p className="font-semibold">Notifications</p>
                    </div>
                    <div className="space-y-1 p-2">
                      {notifications.map((notification) => (
                        <button
                          key={notification.title}
                          type="button"
                          className="w-full rounded-md p-3 text-left transition hover:bg-slate-500/10"
                        >
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className={`mt-1 text-xs ${mutedText}`}>{notification.time}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`flex h-10 items-center gap-2 rounded-lg border px-2 ${inputSurface}`}
                >
                  <span className="flex size-7 items-center justify-center rounded-md bg-emerald-300 text-sm font-bold text-slate-950">
                    G
                  </span>
                  <span className="hidden text-left leading-tight 2xl:block">
                    <span className="block text-sm font-semibold">Garv Agarwal</span>
                    <span className={`block text-xs ${mutedText}`}>AI & Data Engineer</span>
                  </span>
                  <ChevronDown size={14} />
                </button>

                {showProfileMenu && (
                  <div className={`absolute right-0 mt-3 w-56 overflow-hidden rounded-lg border shadow-xl ${shellSurface}`}>
                    <a
                      href="https://github.com/garv999"
                      target="_blank"
                      rel="noreferrer"
                      className="block px-4 py-3 text-sm hover:bg-slate-500/10"
                    >
                      GitHub
                    </a>
                    <a
                      href="https://www.linkedin.com/in/garv-agarwal-0273161b9"
                      target="_blank"
                      rel="noreferrer"
                      className="block px-4 py-3 text-sm hover:bg-slate-500/10"
                    >
                      LinkedIn
                    </a>
                    <button
                      type="button"
                      onClick={() => setDarkMode(!darkMode)}
                      className="block w-full px-4 py-3 text-left text-sm hover:bg-slate-500/10"
                    >
                      Toggle theme
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="space-y-6 p-4 lg:p-8">
            {activeSidebar === "Dashboard" && (
              <>
                <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
                  <div>
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-emerald-400/12 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                        AI commerce cockpit
                      </span>
                      <span className={`text-xs ${mutedText}`}>
                        Updated from {filteredData.length.toLocaleString()} transactions
                      </span>
                    </div>
                    <h1 className="max-w-4xl text-3xl font-semibold tracking-tight md:text-4xl">
                      Revenue, product, and customer intelligence in one
                      operator-grade view.
                    </h1>
                    <p className={`mt-3 max-w-2xl text-sm leading-6 ${mutedText}`}>
                      Track growth drivers, monitor top markets, and export
                      filtered retail data without leaving the dashboard.
                    </p>
                  </div>

                  <Card className={`${cardSurface} rounded-lg`}>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2">
                        <Sparkles size={18} className="text-amber-300" />
                        <p className="font-semibold">AI summary</p>
                      </div>
                      <p className={`mt-3 text-sm leading-6 ${mutedText}`}>
                        {analytics?.aiInsights?.[0] ||
                          "Revenue and customer behavior insights will appear here."}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-md bg-cyan-400/10 px-2 py-1 text-xs font-medium text-cyan-300">
                          {ordersPerCustomer} orders/customer
                        </span>
                        <span className="rounded-md bg-violet-400/10 px-2 py-1 text-xs font-medium text-violet-300">
                          {activeUsers.toLocaleString()} customers
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <MetricCard
                    label="Total revenue"
                    value={compactCurrency(filteredRevenue)}
                    delta={`${growthPositive ? "+" : ""}${revenueGrowth}%`}
                    accent="#36d399"
                    data={chartData}
                    cardSurface={cardSurface}
                    mutedText={mutedText}
                    growthPositive={growthPositive}
                  />
                  <MetricCard
                    label="Total orders"
                    value={filteredOrders.toLocaleString()}
                    delta="Live"
                    accent="#38bdf8"
                    data={chartData}
                    cardSurface={cardSurface}
                    mutedText={mutedText}
                    growthPositive={growthPositive}
                  />
                  <MetricCard
                    label="Customers"
                    value={activeUsers.toLocaleString()}
                    delta={`${ordersPerCustomer} avg`}
                    accent="#a78bfa"
                    data={chartData}
                    cardSurface={cardSurface}
                    mutedText={mutedText}
                    growthPositive={growthPositive}
                  />
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.45fr_0.75fr]">
                  <Card className={`${cardSurface} rounded-lg`}>
                    <CardContent className="p-5">
                      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-semibold">Revenue overview</h2>
                          <p className={`mt-1 text-sm ${mutedText}`}>
                            {selectedPeriod === "7D"
                              ? "Last 7 records revenue trend"
                              : selectedPeriod === "30D"
                              ? "Last 12 records revenue trend"
                              : "Full filtered revenue performance"}
                          </p>
                        </div>
                        <div className="flex rounded-lg border border-slate-500/15 p-1">
                          {["7D", "30D", "6M"].map((period) => (
                            <button
                              key={period}
                              type="button"
                              onClick={() => setSelectedPeriod(period)}
                              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                                selectedPeriod === period
                                  ? "bg-emerald-300 text-slate-950"
                                  : `${mutedText} hover:bg-slate-500/10 hover:text-current`
                              }`}
                            >
                              {period}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="h-[360px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                          <LineChart data={chartData} margin={{ top: 10, right: 18, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#202938" : "#dbe3ef"} />
                            <XAxis dataKey="month" stroke={darkMode ? "#94a3b8" : "#64748b"} tick={{ fontSize: 12 }} />
                            <YAxis stroke={darkMode ? "#94a3b8" : "#64748b"} tick={{ fontSize: 12 }} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Line
                              type="monotone"
                              dataKey="revenue"
                              stroke="#38bdf8"
                              strokeWidth={3}
                              dot={false}
                              activeDot={{ r: 6, fill: "#36d399" }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`${cardSurface} rounded-lg`}>
                    <CardContent className="p-5">
                      <h2 className="text-lg font-semibold">Growth drivers</h2>
                      <div className="mt-5 space-y-4">
                        {(analytics?.aiInsights || []).slice(0, 4).map((insight, index) => (
                          <div key={insight} className="rounded-lg border border-slate-500/15 p-4">
                            <p className="text-xs font-semibold text-emerald-300">
                              Insight {index + 1}
                            </p>
                            <p className={`mt-2 text-sm leading-6 ${mutedText}`}>{insight}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  <Card className={`${cardSurface} rounded-lg`}>
                    <CardContent className="p-5">
                      <h2 className="text-lg font-semibold">Top countries</h2>
                      <p className={`mt-1 text-sm ${mutedText}`}>Revenue contribution by market</p>
                      <div className="mt-5 h-[330px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                          <BarChart data={countryData} layout="vertical" margin={{ top: 5, right: 18, left: 18, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#202938" : "#dbe3ef"} />
                            <XAxis type="number" stroke={darkMode ? "#94a3b8" : "#64748b"} tick={{ fontSize: 12 }} />
                            <YAxis type="category" dataKey="country" stroke={darkMode ? "#94a3b8" : "#64748b"} width={110} tick={{ fontSize: 12 }} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Bar dataKey="revenue" fill="#36d399" radius={[0, 6, 6, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`${cardSurface} rounded-lg`}>
                    <CardContent className="p-5">
                      <h2 className="text-lg font-semibold">Top products</h2>
                      <p className={`mt-1 text-sm ${mutedText}`}>Highest revenue generating products</p>
                      <div className="mt-5 h-[330px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                          <BarChart data={topFilteredProducts} layout="vertical" margin={{ top: 5, right: 18, left: 18, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#202938" : "#dbe3ef"} />
                            <XAxis type="number" stroke={darkMode ? "#94a3b8" : "#64748b"} tick={{ fontSize: 12 }} />
                            <YAxis type="category" dataKey="product" stroke={darkMode ? "#94a3b8" : "#64748b"} width={150} tick={{ fontSize: 12 }} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Bar dataKey="revenue" fill="#38bdf8" radius={[0, 6, 6, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className={`${cardSurface} rounded-lg`}>
                  <CardContent className="p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold">Recent orders</h2>
                        <p className={`mt-1 text-sm ${mutedText}`}>Latest matching ecommerce transactions</p>
                      </div>
                      <span className="rounded-md bg-slate-500/10 px-2 py-1 text-xs font-medium">
                        {recentOrders.length} rows
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-slate-500/15">
                            <TableHead>Customer</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Country</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentOrders.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className={`py-10 text-center ${mutedText}`}>
                                No orders found.
                              </TableCell>
                            </TableRow>
                          ) : (
                            recentOrders.map((order, index) => (
                              <TableRow key={`${order.customer}-${index}`} className="border-slate-500/10">
                                <TableCell>{order.customer}</TableCell>
                                <TableCell className="min-w-[260px]">{order.product}</TableCell>
                                <TableCell className="font-semibold text-emerald-300">{order.amount}</TableCell>
                                <TableCell>{order.country}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeSidebar === "Products" && (
              <AnalyticsView
                title="Product analytics"
                description="Revenue concentration and merchandising performance by product."
                cardSurface={cardSurface}
                mutedText={mutedText}
              >
                <ResponsiveContainer width="100%" height={500} minWidth={1} minHeight={1}>
                  <BarChart data={topFilteredProducts} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#202938" : "#dbe3ef"} />
                    <XAxis type="number" stroke={darkMode ? "#94a3b8" : "#64748b"} />
                    <YAxis type="category" dataKey="product" stroke={darkMode ? "#94a3b8" : "#64748b"} width={220} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="revenue" fill="#38bdf8" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </AnalyticsView>
            )}

            {activeSidebar === "Customers" && (
              <AnalyticsView
                title="Customer analytics"
                description="Top customers ranked by filtered revenue contribution."
                cardSurface={cardSurface}
                mutedText={mutedText}
              >
                <ResponsiveContainer width="100%" height={500} minWidth={1} minHeight={1}>
                  <BarChart data={topCustomers} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#202938" : "#dbe3ef"} />
                    <XAxis type="number" stroke={darkMode ? "#94a3b8" : "#64748b"} />
                    <YAxis type="category" dataKey="customer" stroke={darkMode ? "#94a3b8" : "#64748b"} width={120} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="revenue" fill="#a78bfa" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </AnalyticsView>
            )}

            {activeSidebar === "Revenue" && (
              <AnalyticsView
                title="Revenue analytics"
                description="Monthly revenue trend for the active filter set."
                cardSurface={cardSurface}
                mutedText={mutedText}
              >
                <ResponsiveContainer width="100%" height={500} minWidth={1} minHeight={1}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#202938" : "#dbe3ef"} />
                    <XAxis dataKey="month" stroke={darkMode ? "#94a3b8" : "#64748b"} />
                    <YAxis stroke={darkMode ? "#94a3b8" : "#64748b"} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="revenue" stroke="#36d399" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </AnalyticsView>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function AnalyticsView({
  title,
  description,
  cardSurface,
  mutedText,
  children,
}: {
  title: string;
  description: string;
  cardSurface: string;
  mutedText: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className={`mt-2 text-sm ${mutedText}`}>{description}</p>
      </div>
      <Card className={`${cardSurface} rounded-lg`}>
        <CardContent className="h-[560px] p-5">{children}</CardContent>
      </Card>
    </div>
  );
}
