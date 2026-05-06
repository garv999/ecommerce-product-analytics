"use client";
import { useState } from "react";
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
} from "lucide-react";

const revenueDataMap = {
  "7D": [
    { month: "Mon", revenue: 12000 },
    { month: "Tue", revenue: 18000 },
    { month: "Wed", revenue: 15000 },
    { month: "Thu", revenue: 22000 },
    { month: "Fri", revenue: 25000 },
    { month: "Sat", revenue: 21000 },
    { month: "Sun", revenue: 28000 },
  ],

  "30D": [
    { month: "Week 1", revenue: 40000 },
    { month: "Week 2", revenue: 30000 },
    { month: "Week 3", revenue: 50000 },
    { month: "Week 4", revenue: 65000 },
  ],

  "6M": [
    { month: "Jan", revenue: 40000 },
    { month: "Feb", revenue: 30000 },
    { month: "Mar", revenue: 50000 },
    { month: "Apr", revenue: 45000 },
    { month: "May", revenue: 70000 },
    { month: "Jun", revenue: 65000 },
  ],
};
const recentOrders = [
  {
    customer: "Garv Agarwal",
    product: "Wireless Mouse",
    amount: "₹4,500",
    status: "Completed",
  },
  {
    customer: "Ananya Yadav",
    product: "Gaming Keyboard",
    amount: "₹7,200",
    status: "Pending",
  },
  {
    customer: "Aayush Tripathi",
    product: "Monitor",
    amount: "₹15,000",
    status: "Completed",
  },
  {
    customer: "Rahul Sharma",
    product: "Laptop Stand",
    amount: "₹2,300",
    status: "Cancelled",
  },
];

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("6M");
  const revenueData =
    revenueDataMap[selectedPeriod as keyof typeof revenueDataMap];
  return (
    <main className="
    min-h-screen
    bg-black
    to-black
    text-white
    flex
    overflow-hidden
    relative
    ">
      {/* BACKGROUND ORBS */}

      <div
        className="
          absolute
          top-[-200px]
          left-[-120px]
          w-[500px]
          h-[500px]
          bg-emerald-500/20
          rounded-full
          blur-3xl
          animate-pulse
        "
      />

      <div
        className="
          absolute
          bottom-[-250px]
          right-[-100px]
          w-[500px]
          h-[500px]
          bg-cyan-500/20
          rounded-full
          blur-3xl
          animate-pulse
        "
      />

      <div
        className="
          absolute
          top-[30%]
          left-[40%]
          w-[350px]
          h-[350px]
          bg-purple-500/10
          rounded-full
          blur-3xl
        "
      />

      {/* SIDEBAR */}
      <aside className={`
      ${sidebarOpen ? "w-64" : "w-24"}
      transition-all
      duration-500
      ease-in-out
      bg-black/40
      backdrop-blur-2xl
      border-r
      border-white/10
      p-6
      hidden
      md:flex
      flex-col
      relative
      z-10
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

        <nav className="space-y-4">
          <div
            className={`
              flex items-center
              ${sidebarOpen ? "justify-start" : "justify-center"}
              gap-3
              px-3
              py-3
              rounded-xl
              transition-all
              duration-300
              bg-emerald-500/10
              border border-emerald-500/20
              shadow-[0_0_20px_rgba(16,185,129,0.15)]
              text-emerald-400
              cursor-pointer
            `}
          >
            <LayoutDashboard size={20} />

            {sidebarOpen && (
              <span className="font-medium">
                Dashboard
              </span>
            )}
          </div>
          <div
            className={`
              flex items-center
              ${sidebarOpen ? "justify-start" : "justify-center"}
              gap-3
              px-3
              py-3
              rounded-xl
              transition-all
              duration-300
              text-gray-400
              hover:text-white
              hover:bg-white/5
              hover:translate-x-1
              cursor-pointer
            `}
          >
            <ShoppingCart size={20} />

            {sidebarOpen && <span>Products</span>}
          </div>

          <div
            className={`
              flex items-center
              ${sidebarOpen ? "justify-start" : "justify-center"}
              gap-3
              px-3
              py-3
              rounded-xl
              transition-all
              duration-300
              text-gray-400
              hover:text-white
              hover:bg-white/5
              hover:translate-x-1
              cursor-pointer
            `}
          >
            <Users size={20} />

            {sidebarOpen && <span>Customers</span>}
          </div>

          <div
            className={`
              flex items-center
              ${sidebarOpen ? "justify-start" : "justify-center"}
              gap-3
              px-3
              py-3
              rounded-xl
              transition-all
              duration-300
              text-gray-400
              hover:text-white
              hover:bg-white/5
              hover:translate-x-1
              cursor-pointer
            `}
          >
            <TrendingUp size={20} />

            {sidebarOpen && <span>Revenue</span>}
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <section className="
      flex-1
      p-8
      backdrop-blur-sm
      relative
      z-10
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
          <div className="
            flex items-center gap-3
            bg-white/[0.03]
            border border-white/5
            rounded-2xl
            px-4 py-3
            w-full md:w-[400px]
          ">

            <Search size={18} className="text-gray-400" />

            <input
              type="text"
              placeholder="Search analytics..."
              className="
                bg-transparent
                outline-none
                text-sm
                w-full
                text-white
                placeholder:text-gray-500
              "
            />

          </div>

  {/* RIGHT SECTION */}
  <div className="flex items-center gap-4">

    {/* NOTIFICATION */}
    <div className="
      w-12 h-12
      rounded-2xl
      bg-white/[0.03]
      border border-white/5
      flex items-center justify-center
      hover:border-emerald-400/30
      transition-all duration-300
      cursor-pointer
    ">
      <Bell size={18} />
    </div>

    {/* PROFILE */}
    <div className="
      flex items-center gap-3
      bg-white/[0.03]
      border border-white/5
      rounded-2xl
      px-3 py-2
    ">

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

          <Card className="
          bg-white/[0.03]
          border-white/5
          backdrop-blur-2xl
          text-white
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]
          hover:border-emerald-400/20
          ">
            <CardContent className="p-6">
              <p className="text-gray-400">Total Revenue</p>
              <h3 className="text-3xl font-bold mt-2">₹1.76 Cr</h3>
            </CardContent>
          </Card>

          <Card className="
          bg-white/[0.03]
          border-white/5
          backdrop-blur-2xl
          text-white
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]
          hover:border-emerald-400/20
          ">
            <CardContent className="p-6">
              <p className="text-gray-400">Total Orders</p>
              <h3 className="text-3xl font-bold mt-2">36,934</h3>
            </CardContent>
          </Card>

          <Card className="
          bg-white/[0.03]
          border-white/5
          backdrop-blur-2xl
          text-white
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]
          hover:border-emerald-400/20
          ">
            <CardContent className="p-6">
              <p className="text-gray-400">Customers</p>
              <h3 className="text-3xl font-bold mt-2">5,880</h3>
            </CardContent>
          </Card>

        </div>

        {/* ANALYTICS WIDGETS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

  {/* GROWTH */}
  <Card className="
    bg-white/[0.03]
    border-white/5
    text-white
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-[0_0_35px_rgba(16,185,129,0.25)]
    hover:border-emerald-400/20
  ">
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
  <Card className="
    bg-white/[0.03]
    border-white/5
    text-white
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-[0_0_35px_rgba(59,130,246,0.25)]
    hover:border-blue-400/20
  ">
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
  <Card className="
    bg-white/[0.03]
    border-white/5
    text-white
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-[0_0_35px_rgba(168,85,247,0.25)]
    hover:border-purple-400/20
  ">
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
  <Card className="
  bg-white/[0.03]
  border-white/5
  backdrop-blur-2xl
  text-white
  transition-all
  duration-300
  hover:shadow-[0_0_40px_rgba(6,182,212,0.18)]
  ">
    <CardContent className="p-6">

      <div className="mb-6">
        <h3 className="text-2xl font-bold">
          Revenue Overview
        </h3>

        <p className="text-gray-400 mt-1">
          Monthly revenue performance
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

        <ResponsiveContainer width="100%" height="100%">

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
{/* RECENT ORDERS TABLE */}
<div className="mt-8">

  <Card className="
  bg-white/[0.03]
  border-white/5
  backdrop-blur-2xl
  text-white
  transition-all
  duration-300
  hover:shadow-[0_0_40px_rgba(168,85,247,0.18)]
  ">

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

            <TableHead className="text-gray-200">Customer</TableHead>
            <TableHead className="text-gray-200">Product</TableHead>
            <TableHead className="text-gray-200">Amount</TableHead>
            <TableHead className="text-gray-200">Status</TableHead>

          </TableRow>
        </TableHeader>

        <TableBody>

          {recentOrders.map((order, index) => (

            <TableRow
              key={index}
              className="border-white/5"
            >

              <TableCell>{order.customer}</TableCell>

              <TableCell>{order.product}</TableCell>

              <TableCell>{order.amount}</TableCell>

              <TableCell>

                <span
                  className={`
                    px-3 py-1 rounded-full text-sm
                    ${
                      order.status === "Completed"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : order.status === "Pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }
                  `}
                >
                  {order.status}
                </span>

              </TableCell>

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