"use client";
import { useEffect, useState, useMemo } from "react";
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
  ChevronDown,
  Download,
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
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
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
  const savedTheme =
    localStorage.getItem("theme");
  if (savedTheme) {
    setDarkMode(
      savedTheme === "dark"
    );
  }
}, []);
  useEffect(() => {
  localStorage.setItem(
    "theme",
    darkMode ? "dark" : "light"
  );
}, [darkMode]);
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

  const recentOrders =
  (analytics?.recentOrders || []).filter(
    (order: any) => {
      const matchesSearch =
        order.product
          ?.toLowerCase()
          .includes(
            searchQuery.toLowerCase()
          );
      const matchesCountry =
        selectedCountry === "All" ||
        order.country === selectedCountry;
      return (
        matchesSearch &&
        matchesCountry
      );
    }
  );
const rawData =
  analytics?.rawData || [];
const filteredData = useMemo(() => {
  let data = [...rawData];
  data = data.filter(
    (row: any) =>
      row.Description
        ?.toLowerCase()
        .includes(
          searchQuery.toLowerCase()
        )
  );
  if (selectedCountry !== "All") {
    data = data.filter(
      (row: any) =>
        row.Country ===
        selectedCountry
    );
  }
  if (dateRange === "Recent") {
    data = data.slice(-500);
  }
  return data;
}, [
  rawData,
  searchQuery,
  selectedCountry,
  dateRange,
]);
const exportCSV = () => {
  const headers = [
    "Invoice",
    "Customer ID",
    "Description",
    "Country",
    "Revenue",
    "YearMonth",
  ];
  const rows = filteredData.map(
    (row: any) => [
      row.Invoice,
      row["Customer ID"],
      row.Description,
      row.Country,
      row.Revenue,
      row.YearMonth,
    ]
  );
  const csvContent = [
    headers.join(","),
    ...rows.map(
      (e: (string | number)[]) =>
        e.join(",")
    ),
  ].join("\n");
  const blob = new Blob(
    [csvContent],
    {
      type: "text/csv;charset=utf-8;",
    }
  );
  const url =
    URL.createObjectURL(blob);
  const link =
    document.createElement("a");
  link.href = url;
  link.download =
    "analytics_export.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const filteredRevenue =
  filteredData.reduce(
    (sum: number, row: any) =>
      sum + Number(row.Revenue || 0),
    0
  );
const filteredOrders =
  new Set(
    filteredData.map(
      (row: any) => row.Invoice
    )
  ).size;
const filteredCustomers =
  new Set(
    filteredData.map(
      (row: any) => row["Customer ID"]
    )
  ).size;
const filteredRevenueData =
  useMemo(() => {
    const revenueMap: Record<
      string,
      number
    > = {};
    filteredData.forEach(
      (row: any) => {
        const month =
          row.YearMonth;
        if (!month) return;
        if (!revenueMap[month]) {
          revenueMap[
            month
          ] = 0;
        }
        revenueMap[
          month
        ] += Number(
          row.Revenue || 0
        );
      }
    );
    return Object.entries(
      revenueMap
    ).map(
      ([month, revenue]) => ({
        month,
        revenue,
      })
    );
  }, [filteredData]);

const topFilteredProducts =
  useMemo(() => {
    return Object.entries(
      filteredData.reduce(
        (
          acc: Record<
            string,
            number
          >,
          row: any
        ) => {
          const product =
            row.Description ||
            "Unknown";

          if (!acc[product]) {
            acc[product] = 0;
          }
          acc[product] += Number(
            row.Revenue || 0
          );

          return acc;
        },
        {}
      )
    )
      .map(
        ([product, revenue]) => ({
          product:
            product.length > 28
              ? product.slice(
                  0,
                  28
                ) + "..."
              : product,
          revenue,
        })
      )
      .sort(
        (
          a: any,
          b: any
        ) =>
          b.revenue -
          a.revenue
      )
      .slice(0, 10);
  }, [filteredData]);
const topCustomers = useMemo(() => {
  return Object.entries(
    filteredData.reduce(
      (
        acc: Record<string, number>,
        row: any
      ) => {
        const customer =
          row["Customer ID"] || "Unknown";
        if (!acc[customer]) {
          acc[customer] = 0;
        }
        acc[customer] += Number(
          row.Revenue || 0
        );
        return acc;
      },
      {}
    )
  )
    .map(([customer, revenue]) => ({
      customer,
      revenue,
    }))
    .sort(
      (a: any, b: any) =>
        b.revenue - a.revenue
    )
    .slice(0, 10);
}, [filteredData]);
const monthlyRevenueStats =
  filteredRevenueData.map(
    (item: any) => ({
      month: item.month,
      revenue: item.revenue,
    })
  );
const currentMonthRevenue =
  filteredRevenueData.length > 0
    ? Number(
        filteredRevenueData[
          filteredRevenueData.length - 1
        ].revenue
      )
    : 0;
const previousMonthRevenue =
  filteredRevenueData.length > 1
    ? Number(
        filteredRevenueData[
          filteredRevenueData.length - 2
        ].revenue
      )
    : 0;
const revenueGrowth =
  previousMonthRevenue > 0
    ? (
        ((currentMonthRevenue -
          previousMonthRevenue) /
          previousMonthRevenue) *
        100
      ).toFixed(1)
    : "0.0";
const activeUsers =
  filteredCustomers;
const conversionRate =
  filteredCustomers > 0
    ? (
        (filteredOrders /
          filteredCustomers) *
        100
      ).toFixed(1)
    : "0.0";
  let chartData = filteredRevenueData;
if (selectedPeriod === "7D") {
  chartData =
    filteredRevenueData.slice(-7);
}
if (selectedPeriod === "30D") {
  chartData =
    filteredRevenueData.slice(-12);
}
if (selectedPeriod === "6M") {
  chartData =
    filteredRevenueData;
}
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
        <div className="flex flex-col items-center gap-4">
          <div className="
            w-12 h-12
            border-4
            border-white
            border-t-transparent
            rounded-full
            animate-spin
          " />
          <p className="text-gray-300">
            Loading Analytics...
          </p>
        </div>
      </div>
    );
  }
  const cardStyles = darkMode
    ? `
        bg-white/[0.04]
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
      bg-white/[0.04]
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
      {/* MOBILE SIDEBAR */}
{mobileMenuOpen && (
  <div
    className="
      fixed
      inset-0
      z-50
      md:hidden
    "
  >
    {/* BACKDROP */}
    <div
      className="
        absolute
        inset-0
        bg-black/60
        backdrop-blur-sm
      "
      onClick={() =>
        setMobileMenuOpen(false)
      }
    />
    {/* DRAWER */}
    <div
      className={`
        absolute
        left-0
        top-0
        h-full
        w-72
        p-6
        transition-all
        duration-300
        ${
          darkMode
            ? "bg-[#050505]"
            : "bg-white"
        }
      `}
    >
      <div className="
        flex
        items-center
        justify-between
        mb-10
      ">
        <h2 className="
          text-xl
          font-bold
          text-emerald-400
        ">
          EcommerceAI
        </h2>
        <button
          onClick={() =>
            setMobileMenuOpen(false)
          }
        >
          <X size={20} />
        </button>
      </div>
      <nav className="space-y-3">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              onClick={() => {
                setActiveSidebar(
                  item.title
                );
                setMobileMenuOpen(
                  false
                );
              }}
              className={`
                flex items-center
                gap-3
                px-4 py-3
                rounded-2xl
                cursor-pointer
                transition-all
                ${
                  activeSidebar === item.title
                    ? `
                      bg-emerald-500/10
                      text-emerald-400
                    `
                    : `
                      text-gray-400
                    `
                }
              `}
            >
              <Icon size={20} />
              <span>
                {item.title}
              </span>
            </div>
          );
        })}
      </nav>
    </div>
  </div>
)}
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
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
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
            bg-white/[0.04]
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
                        ? "bg-white/[0.04] hover:bg-white/[0.06]"
                        : "bg-black/[0.04] hover:bg-black/[0.06]"
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
    </div>

    {/* PROFILE */}
<div className="relative">
  <div
    onClick={() =>
      setShowProfileMenu(
        !showProfileMenu
      )
    }
    className={`
      flex items-center gap-3
      rounded-2xl
      px-3 py-2
      border
      cursor-pointer
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
      <div className="flex items-center gap-1">
        <p className="text-sm font-medium">
          Garv Agarwal
        </p>
        <ChevronDown size={14} />
      </div>
      <p className="text-xs text-gray-400">
        AI & Data Engineer
      </p>
    </div>
  </div>
  {showProfileMenu && (
    <div
      className={`
        absolute
        right-0
        mt-3
        w-60
        rounded-3xl
        border
        overflow-hidden
        z-50
        backdrop-blur-2xl
        shadow-[0_0_40px_rgba(0,0,0,0.3)]
        ${
          darkMode
            ? "bg-black/90 border-white/10"
            : "bg-white border-black/5"
        }
      `}
    >
      <button
        className="
          w-full
          text-left
          px-5 py-4
          hover:bg-emerald-500/10
          transition
        "
      >
        My Profile
      </button>
      <button
        className="
          w-full
          text-left
          px-5 py-4
          hover:bg-emerald-500/10
          transition
        "
      >
        Settings
      </button>
      <button
        onClick={() =>
          setDarkMode(!darkMode)
        }
        className="
          w-full
          text-left
          px-5 py-4
          hover:bg-emerald-500/10
          transition
        "
      >
        Toggle Theme
      </button>
      <button
        className="
          w-full
          text-left
          px-5 py-4
          text-red-400
          hover:bg-red-500/10
          transition
        "
      >
        Logout
      </button>
    </div>
  )}
</div>
</div>
{/* FILTER BAR */}
<div className="flex flex-wrap gap-4 mb-8">

  {/* COUNTRY FILTER */}
  <select
    value={selectedCountry}
    onChange={(e) =>
      setSelectedCountry(e.target.value)
    }
    className={`
      px-4 py-3 rounded-2xl
      border outline-none
      text-sm
      ${inputStyles}
    `}
  >
    <option value="All">
      All Countries
    </option>
    {(analytics?.topCountries || []).map(
      (country: any, index: number) => (
        <option
          key={index}
          value={country.country}
        >
          {country.country}
        </option>
      )
    )}
  </select>

  {/* DATE FILTER */}
  <select
    value={dateRange}
    onChange={(e) =>
      setDateRange(e.target.value)
    }
    className={`
      px-4 py-3 rounded-2xl
      border outline-none
      text-sm
      ${inputStyles}
    `}
  >
    <option value="All">
      Full Timeline
    </option>
    <option value="Recent">
      Recent Months
    </option>
  </select>

  {/* EXPORT CSV BUTTON */}
  <button
    onClick={exportCSV}
    disabled={filteredData.length === 0}
    className="
      flex items-center gap-2
      px-5 py-3
      rounded-2xl
      bg-emerald-500
      text-black
      font-medium
      hover:scale-105
      transition-all
      disabled:opacity-50
      disabled:cursor-not-allowed
    "
  >
    <Download size={18} />
    Export CSV
  </button>
</div>
{activeSidebar === "Dashboard" && (
  <>
        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-5xl font-bold tracking-tight">
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
              <h3 className="text-3xl font-bold mt-2">₹{analytics? (filteredRevenue / 10000000).toFixed(2): "0.00"} Cr</h3>
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
              <h3 className="text-3xl font-bold mt-2">{filteredOrders?.toLocaleString()}</h3>
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
              <h3 className="text-3xl font-bold mt-2">{filteredCustomers?.toLocaleString()}</h3>
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
            {revenueGrowth}%
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
        Compared to previous month
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
            {activeUsers.toLocaleString()}
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
        Unique active customers
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
            {conversionRate}%
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
        Orders per customer ratio
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
            data={chartData}
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
            data={selectedCountry === "All"? analytics?.topCountries || []: (analytics?.topCountries || []).filter((country: any) =>country.country === selectedCountry)}
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
            data={(analytics?.topProducts || []).filter((product: any) =>product.product?.toLowerCase().includes(searchQuery.toLowerCase()))}
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
        {(analytics?.aiInsights || []).length === 0 ? (
          <div className="
            text-center
            py-8
            text-gray-400
          ">
            No AI insights available.
          </div>
        ) : (
          (analytics?.aiInsights || []).map(
          (insight: string, index: number) => (
            <div
              key={index}
              className="
                bg-white/[0.04]
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
        ))}
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
          {recentOrders.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center py-10 text-gray-400"
              >
                No orders found.
              </TableCell>
            </TableRow>
          ) : (
            recentOrders.map((order: any, index: number) => (
            <TableRow
              key={index}
              className="border-white/5"
            >
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.product}</TableCell>
              <TableCell>{order.amount}</TableCell>
              <TableCell>{order.country}</TableCell>
            </TableRow>
          )))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</div>
  </>
)}

{/* PRODUCTS PAGE */}
{activeSidebar === "Products" && (
  <div className="space-y-8">
    <div>
      <h2 className="text-4xl font-bold">
        Product Analytics
      </h2>
      <p className={`${secondaryText} mt-2`}>
        Revenue insights by products
      </p>
    </div>
    <Card
      className={`
        ${cardStyles}
        backdrop-blur-2xl
        p-6
      `}
    >
      <div className="h-[500px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={topFilteredProducts}
            layout="vertical"
            margin={{
              top: 10,
              right: 20,
              left: 40,
              bottom: 0,
            }}
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
    </Card>
  </div>
)}

{/* CUSTOMERS PAGE */}
{activeSidebar === "Customers" && (
  <div className="space-y-8">
    <div>
      <h2 className="text-4xl font-bold">
        Customer Analytics
      </h2>
      <p className={`${secondaryText} mt-2`}>
        Top customer revenue insights
      </p>
    </div>
    <Card
      className={`
        ${cardStyles}
        backdrop-blur-2xl
        p-6
      `}
    >
      <div className="h-[500px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={topCustomers}
            layout="vertical"
            margin={{
              top: 10,
              right: 20,
              left: 40,
              bottom: 0,
            }}
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
              dataKey="customer"
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
    </Card>
  </div>
)}

{/* REVENUE PAGE */}
{activeSidebar === "Revenue" && (
  <div className="space-y-8">
    <div>
      <h2 className="text-4xl font-bold">
        Revenue Analytics
      </h2>
      <p className={`${secondaryText} mt-2`}>
        Monthly revenue trends
      </p>
    </div>
    <Card
      className={`
        ${cardStyles}
        backdrop-blur-2xl
        p-6
      `}
    >
      <div className="h-[500px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={monthlyRevenueStats}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1f2937"
            />
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
              strokeWidth={4}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  </div>
)}
      </section>
    </main>
  );
}