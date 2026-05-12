"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  TrendingUp,
  Bell,
  Search,
  ArrowUpRight,
  Activity,
  DollarSign,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    icon: Users,
  },
  {
    title: "Revenue",
    icon: TrendingUp,
  },
];

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("6M");
  const [activeSidebar, setActiveSidebar] = useState("Dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const notifications = [
    {
      title: "Revenue increased by 12%",
      time: "2 min ago",
    },
    {
      title: "New customer registered",
      time: "10 min ago",
    },
    {
      title: "Top product sales spiked",
      time: "25 min ago",
    },
  ];
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics");
        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error("Analytics Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);
  const fullRevenueData =
    analytics?.revenueChartData || [];
  let revenueData = [];
  if (selectedPeriod === "7D") {
    revenueData = fullRevenueData.slice(-7);
  }
  if (selectedPeriod === "30D") {
    revenueData = fullRevenueData.slice(-12);
  }
  if (selectedPeriod === "6M") {
    revenueData = fullRevenueData;
  }
  const recentOrders =
    analytics?.recentOrders || [];
    if (loading) {
      return (
        <div
        className="
          min-h-screen
          bg-black
          flex
          items-center
          justify-center
          text-white
          text-2xl
        "
      >
        Loading Analytics...
      </div>
    );
  }
  const cardStyles = darkMode
    ? `
        bg-white/[0.03]
        border-white/5
        text-white
      `
    : `
        bg-white/90
        border border-black/5
        text-black
        shadow-[0_4px_30px_rgba(0,0,0,0.06)]
        backdrop-blur-xl
      `;

  const secondaryText = darkMode
    ? "text-gray-400"
    : "text-gray-500";

  const inputStyles = darkMode
    ? `
      bg-white/[0.03]
      border-white/5
      text-white
    `
    : `
      bg-white/80
      border-black/5
      text-black
      backdrop-blur-xl
    `;
  return (
    <main
      className={`
        relative
        min-h-screen
        flex
        overflow-hidden
        transition-all
        duration-500
        ${
          darkMode
            ? "bg-black text-white"
            : "bg-[#EEF2F7] text-black"
        }
      `}
    >
      {/* BACKGROUND ORBS */}

      <div
        className="
          absolute
          top-[-120px]
          left-[-120px]
          w-[350px]
          h-[350px]
          bg-emerald-500/20
          rounded-full
          blur-3xl
          animate-pulse
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          bottom-[-120px]
          right-[-120px]
          w-[350px]
          h-[350px]
          bg-cyan-500/20
          rounded-full
          blur-3xl
          animate-pulse
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          top-[35%]
          left-[45%]
          w-[250px]
          h-[250px]
          bg-purple-500/10
          rounded-full
          blur-3xl
          pointer-events-none
        "
      />

      {/* SIDEBAR */}
      <aside className={`
              ${
                sidebarOpen ? "w-72" : "w-24"
              }
              transition-all duration-500
              border-r
              backdrop-blur-xl
              p-6
              hidden md:flex flex-col
              ${
                darkMode
                  ? "bg-[#050505] border-white/5"
                  : "bg-white border-black/5"
              }
            `}
      >
        <h1 className="text-2xl font-bold text-emerald-400 mb-10 transition-all duration-300">
          {sidebarOpen ? "EcommerceAI" : "EA"}
        </h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="
            absolute top-7 right-5
            text-gray-400 hover:text-white
            transition
          "
        >
          {sidebarOpen ? (
            <ChevronLeft size={18} />
          ) : (
            <ChevronRight size={18} />
          )}
        </button>

        <nav className="space-y-3">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeSidebar === item.title;
            return (
              <div
                key={item.title}
                onClick={() =>
                  setActiveSidebar(item.title)
                }
                className={`
                  flex items-center
                  ${sidebarOpen
                    ? "justify-start"
                    : "justify-center"}
                  gap-3
                  px-4
                  py-3
                  rounded-2xl
                  transition-all
                  duration-300
                  cursor-pointer
                  group
                  ${
                    isActive
                      ? `
                        bg-emerald-500/10
                        border border-emerald-500/20
                        text-emerald-400
                        shadow-[0_0_30px_rgba(16,185,129,0.18)]
                      `
                      : `
                        text-gray-400
                        hover:text-white
                        ${
                          darkMode
                            ? "hover:bg-white/[0.04]"
                            : "hover:bg-black/[0.03]"
                        }
                      `
                  }
                `}
              >
                <Icon
                  size={20}
                  className={`
                    transition-all
                    duration-300
                    ${
                      isActive
                        ? "text-emerald-400"
                        : "group-hover:scale-110"
                    }
                  `}
                />
                {sidebarOpen && (
                  <span className="font-medium">
                    {item.title}
                  </span>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <section className="
        flex-1
        p-8
        backdrop-blur-sm
        relative
        z-10
        overflow-x-hidden
      ">

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden mb-4">

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="
              p-3 rounded-xl
              bg-[#111111]
              border border-white/10
            "
          >

            {mobileMenuOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}

          </button>

        </div>
        {/* TOP NAVBAR */}
        <div className="
        flex
        items-center
        justify-between
        mb-10
        gap-4
        flex-wrap
        ">

          {/* SEARCH BAR */}
          <div
            className={`
              flex items-center gap-3
              rounded-2xl
              px-4 py-3
              w-full md:w-[400px]
              border
              ${inputStyles}
            `}
          >

            <Search size={18} className={secondaryText} />

            <input
              type="text"
              placeholder="Search analytics..."
              className={`
                bg-transparent
                outline-none
                text-sm
                w-full
                ${darkMode ? "text-white" : "text-black"}
                ${darkMode
                  ? "placeholder:text-gray-500"
                  : "placeholder:text-gray-400"}
              `}
            />

          </div>

  {/* RIGHT SECTION */}
  <div className="flex items-center gap-4">

  {/* DARK MODE TOGGLE */}

  <button
    onClick={() => setDarkMode(!darkMode)}
    className={`
      w-12 h-12
      rounded-2xl
      border
      flex items-center justify-center
      transition-all duration-300
      ${
        darkMode
          ? `
            bg-white/[0.03]
            border-white/5
            hover:border-yellow-400/30
            hover:shadow-[0_0_25px_rgba(250,204,21,0.15)]
          `
          : `
            bg-white
            border-black/10
            hover:border-black/20
          `
      }
    `}
  >

    {darkMode ? (
      <Sun size={18} className="text-yellow-300" />
    ) : (
      <Moon size={18} className="text-black" />
    )}

  </button>

    {/* NOTIFICATION */}
    <div className="relative">

      <div
        onClick={() =>
          setShowNotifications(
            !showNotifications
          )
        }
        className={`
          w-12 h-12
          rounded-2xl
          border
          flex items-center justify-center
          transition-all duration-300
          cursor-pointer
          relative
          ${inputStyles}
        `}
      >

        <Bell size={18} />

        {/* DOT */}
        <div className="
          absolute
          top-3 right-3
          w-2 h-2
          rounded-full
          bg-emerald-400
          animate-pulse
        " />

      </div>

      {/* DROPDOWN */}
      {showNotifications && (

        <div
          className={`
            absolute
            right-0
            mt-4
            w-[320px]
            rounded-3xl
            border
            backdrop-blur-2xl
            shadow-[0_0_40px_rgba(0,0,0,0.4)]
            overflow-hidden
            z-50
            animate-in
            fade-in
            slide-in-from-top-2
            duration-300
            ${
              darkMode
                ? "bg-black/80 border-white/10"
                : "bg-white/90 border-black/5"
            }
          `}
        >

          <div className="
            p-5 border-b border-white/5
          ">

            <h3 className="font-semibold text-lg">
              Notifications
            </h3>

          </div>

          <div className="p-3 space-y-2">

            {notifications.map(
              (notification, index) => (

                <div
                  key={index}
                  className={`
                    p-4 rounded-2xl
                    transition-all duration-300
                    cursor-pointer
                    ${
                      darkMode
                        ? "bg-white/[0.03] hover:bg-white/[0.05]"
                        : "bg-black/[0.03] hover:bg-black/[0.05]"
                    }
                  `}
                >

                  <p
                    className={`
                      text-sm
                      ${darkMode ? "text-white" : "text-black"}
                    `}
                  >
                    {notification.title}
                  </p>

                  <p className="
                    text-xs text-gray-400 mt-1
                  ">
                    {notification.time}
                  </p>

                </div>

              )
            )}

          </div>

        </div>

      )}

    </div>

    {/* PROFILE */}
    <div
      className={`
        flex items-center gap-3
        rounded-2xl
        px-3 py-2
        border
        ${inputStyles}
      `}
    >

      <div className="
        w-10 h-10
        rounded-full
        bg-emerald-500
        flex items-center justify-center
        text-black
        font-bold
      ">
        G
      </div>

      <div className="hidden md:block">
        <p className="text-sm font-medium">
          Garv Agarwal
        </p>

        <p className="text-xs text-gray-400">
          Data Analyst
        </p>
      </div>

    </div>

  </div>

</div>
        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold">
            Ecommerce Analytics Dashboard
          </h2>

          <p className="text-gray-400 mt-2">
            Customer behavior • Revenue trends • Product insights
          </p>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card
            className={`
              ${cardStyles}
              backdrop-blur-2xl
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]
              hover:border-emerald-400/20
            `}
          >
            <CardContent className="p-6">
              <p className={secondaryText}>Total Revenue</p>
              <h3 className="text-3xl font-bold mt-2">₹{analytics? (analytics.totalRevenue / 10000000).toFixed(2): "0.00"} Cr</h3>
            </CardContent>
          </Card>

          <Card
            className={`
              ${cardStyles}
              backdrop-blur-2xl
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]
              hover:border-emerald-400/20
            `}
          >
            <CardContent className="p-6">
              <p className={secondaryText}>Total Orders</p>
              <h3 className="text-3xl font-bold mt-2">{analytics?.totalOrders?.toLocaleString()}</h3>
            </CardContent>
          </Card>

          <Card
            className={`
              ${cardStyles}
              backdrop-blur-2xl
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]
              hover:border-emerald-400/20
            `}
          >
            <CardContent className="p-6">
              <p className={secondaryText}>Customers</p>
              <h3 className="text-3xl font-bold mt-2">{analytics?.totalCustomers?.toLocaleString()}</h3>
            </CardContent>
          </Card>

        </div>

        {/* ANALYTICS WIDGETS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

  {/* GROWTH */}
  <Card
    className={`
      ${cardStyles}
      backdrop-blur-2xl
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]
      hover:border-emerald-400/20
    `}
  >
    <CardContent className="p-6">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-gray-400 text-sm">
            Revenue Growth
          </p>

          <h3 className="text-3xl font-bold mt-2">
            +18.4%
          </h3>
        </div>

        <div className="
          w-12 h-12 rounded-2xl
          bg-emerald-500/10
          flex items-center justify-center
        ">
          <ArrowUpRight className="text-emerald-400" />
        </div>

      </div>

      <p className="text-emerald-400 text-sm mt-4">
        +12% compared to last month
      </p>

    </CardContent>
  </Card>

  {/* ACTIVE USERS */}
  <Card
    className={`
      ${cardStyles}
      backdrop-blur-2xl
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]
      hover:border-emerald-400/20
    `}
  >
    <CardContent className="p-6">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-gray-400 text-sm">
            Active Users
          </p>

          <h3 className="text-3xl font-bold mt-2">
            12.8K
          </h3>
        </div>

        <div className="
          w-12 h-12 rounded-2xl
          bg-blue-500/10
          flex items-center justify-center
        ">
          <Activity className="text-blue-400" />
        </div>

      </div>

      <p className="text-blue-400 text-sm mt-4">
        +5.2% weekly growth
      </p>

    </CardContent>
  </Card>

  {/* CONVERSION */}
<Card
  className={`
    ${cardStyles}
    backdrop-blur-2xl
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]
    hover:border-emerald-400/20
  `}
>
    <CardContent className="p-6">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-gray-400 text-sm">
            Conversion Rate
          </p>

          <h3 className="text-3xl font-bold mt-2">
            4.8%
          </h3>
        </div>

        <div className="
          w-12 h-12 rounded-2xl
          bg-purple-500/10
          flex items-center justify-center
        ">
          <DollarSign className="text-purple-400" />
        </div>

      </div>

      <p className="text-purple-400 text-sm mt-4">
        +1.1% increase this quarter
      </p>

    </CardContent>
  </Card>

</div>
        {/* CHART SECTION */}
        <div className="mt-8">
  <Card
    className={`
      ${cardStyles}
      backdrop-blur-2xl
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]
      hover:border-emerald-400/20
    `}
  >
    <CardContent className="p-6">

      <div className="mb-6">
        <h3 className="text-2xl font-bold">
          Revenue Overview
        </h3>

        <p className="text-gray-400 mt-1">
          {selectedPeriod === "7D"
            ? "Last 7 records revenue trend"
            : selectedPeriod === "30D"
            ? "Last 12 records revenue trend"
            : "Full revenue performance"}
        </p>
      </div>
      <div className="flex gap-3 mt-6 mb-8 flex-wrap">

          {["7D", "30D", "6M"].map((period) => (

            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium
                transition-all duration-300
                ${
                  selectedPeriod === period
                    ? "bg-emerald-500 text-black"
                    : "bg-[#111111] text-gray-400 hover:text-white"
                }
              `}
            >
              {period}
            </button>

          ))}

        </div>

      <div className="h-[350px]">
        <ResponsiveContainer width="99%" height="100%">
          <LineChart
            data={revenueData}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis
              dataKey="month"
              stroke="#9ca3af"
            />
            <YAxis
              stroke="#9ca3af"
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={{
                r: 5,
                fill: "#06b6d4",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 8,
                fill: "#10b981",
              }}
              animationDuration={800}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
</div>

{/* TOP COUNTRIES */}
<div className="mt-8">

  <Card
    className={`
      ${cardStyles}
      backdrop-blur-2xl
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]
      hover:border-emerald-400/20
    `}
  >
    <CardContent className="p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold">
          Top Countries
        </h3>
        <p className="text-gray-400 mt-1">
          Revenue contribution by country
        </p>
      </div>
      <div className="h-[350px]">
        <ResponsiveContainer width="99%" height="100%">
          <BarChart
            data={analytics?.topCountries || []}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1f2937"
            />
            <XAxis
              type="number"
              stroke="#9ca3af"
            />
            <YAxis
              type="category"
              dataKey="country"
              stroke="#9ca3af"
              width={120}
            />
            <Tooltip />
            <Bar
              dataKey="revenue"
              fill="#10b981"
              radius={[0, 10, 10, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
</div>

{/* TOP PRODUCTS */}
<div className="mt-8">

  <Card
    className={`
      ${cardStyles}
      backdrop-blur-2xl
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]
      hover:border-emerald-400/20
    `}
  >
    <CardContent className="p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold">
          Top Products
        </h3>
        <p className="text-gray-400 mt-1">
          Highest revenue generating products
        </p>
      </div>
      <div className="h-[420px]">
        <ResponsiveContainer width="99%" height="100%">
          <BarChart
            data={analytics?.topProducts || []}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1f2937"
            />
            <XAxis
              type="number"
              stroke="#9ca3af"
            />
            <YAxis
              type="category"
              dataKey="product"
              stroke="#9ca3af"
              width={220}
            />
            <Tooltip />
            <Bar
              dataKey="revenue"
              fill="#3b82f6"
              radius={[0, 10, 10, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
</div>

{/* AI INSIGHTS */}
<div className="mt-8">
  <Card
    className={`
      ${cardStyles}
      backdrop-blur-2xl
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]
      hover:border-emerald-400/20
    `}
  >
    <CardContent className="p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold">
          AI Business Insights
        </h3>
        <p className="text-gray-400 mt-1">
          Automated ecommerce recommendations
        </p>
      </div>
      <div className="grid gap-4">
        {(analytics?.aiInsights || []).map(
          (insight: string, index: number) => (
            <div
              key={index}
              className="
                bg-white/[0.03]
                border border-white/5
                rounded-2xl
                p-4
                hover:border-purple-400/20
                transition-all
                duration-300
              "
            >
              <p className="text-gray-200">
                ✨ {insight}
              </p>
            </div>
          )
        )}
      </div>
    </CardContent>
  </Card>
</div>

{/* RECENT ORDERS TABLE */}
<div className="mt-8">

  <Card
    className={`
      ${cardStyles}
      backdrop-blur-2xl
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]
      hover:border-emerald-400/20
    `}
  >

    <CardContent className="p-6">

      <div className="mb-6">
        <h3 className="text-2xl font-bold">
          Recent Orders
        </h3>

        <p className="text-gray-400 mt-1">
          Latest ecommerce transactions
        </p>
      </div>

      <Table>

        <TableHeader>
          <TableRow className="border-white/10">

            <TableHead className={darkMode ? "text-gray-200" : "text-gray-700"}>Customer</TableHead>
            <TableHead className={darkMode ? "text-gray-200" : "text-gray-700"}>Product</TableHead>
            <TableHead className={darkMode ? "text-gray-200" : "text-gray-700"}>Amount</TableHead>
            <TableHead className={darkMode ? "text-gray-200" : "text-gray-700"}>Country</TableHead>

          </TableRow>
        </TableHeader>

        <TableBody>

          {recentOrders.map((order: any, index: number) => (

            <TableRow
              key={index}
              className="border-white/5"
            >

              <TableCell>{order.customer}</TableCell>

              <TableCell>{order.product}</TableCell>
              <TableCell>{order.amount}</TableCell>
              <TableCell>{order.country}</TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

    </CardContent>

  </Card>

</div>

      </section>
    </main>
  );
}