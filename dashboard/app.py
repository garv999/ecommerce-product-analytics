import streamlit as st
import pandas as pd
import os
import time
import datetime
import plotly.express as px
import plotly.io as pio
pio.templates.default = "plotly_dark"


st.set_page_config(
    page_title="Ecommerce Analytics Dashboard",
    layout="wide"
)

# Last updated timestamp
current_time = datetime.datetime.now().strftime("%d %b %Y, %H:%M")
st.caption(f"📅 Last Updated: {current_time}")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
def load_css():
    css_path = os.path.join(BASE_DIR, "styles", "style.css")
    with open(css_path) as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

load_css()
data_path = os.path.join(
    BASE_DIR,
    "..",
    "data",
    "processed",
    "cleaned_online_retail.csv"
)


with st.spinner("🔄 Preparing your dashboard..."):

    df = pd.read_csv(data_path)

    df["InvoiceDate"] = pd.to_datetime(df["InvoiceDate"])

    df["Revenue"] = df["Quantity"] * df["Price"]

# Sidebar Filters
if "selected_country" not in st.session_state:
    st.session_state.selected_country = "All"

if "date_range" not in st.session_state:
    st.session_state.date_range = [
        df["InvoiceDate"].min().date(),
        df["InvoiceDate"].max().date()
    ]

st.sidebar.title("Dashboard Filters")
st.sidebar.markdown("---")
df_filtered = df.copy()
countries = df["Country"].unique()



selected_country = st.sidebar.selectbox(
    "Select Country",
    ["All"] + list(countries),
    key="selected_country"
)

min_date = df["InvoiceDate"].min().date()
max_date = df["InvoiceDate"].max().date()

def reset_filters():
    st.session_state.selected_country = "All"
    st.session_state.date_range = [min_date, max_date]

date_range = st.sidebar.date_input(
    "Select Date Range",
    value=st.session_state.date_range,
    min_value=min_date,
    max_value=max_date,
    key="date_range"
)

if len(date_range) == 2:
    start_date, end_date = date_range
else:
    st.warning("⚠️ Please select both start and end date.")
    st.stop()
if start_date < min_date or end_date > max_date:
    st.warning("⚠️ Selected date is outside available data range.")
    st.stop()

# Apply country filter
if selected_country != "All":
    df_filtered = df_filtered[
        df_filtered["Country"] == selected_country
    ]

# Apply date filter
df_filtered = df_filtered[
    (df_filtered["InvoiceDate"] >= pd.to_datetime(start_date)) &
    (df_filtered["InvoiceDate"] <= pd.to_datetime(end_date))
]
if df_filtered.empty:
    st.warning("⚠️ No data available for selected filters. Try adjusting your filters.")
    st.stop()
st.markdown(
    """
    # 📊 Ecommerce Product Analytics Dashboard
    ### Customer Behavior • Revenue Trends • Product Performance
    """
)
st.divider()
st.sidebar.button("🔄 Reset Filters", on_click=reset_filters)

# Dataset Overview
st.markdown("## Dataset Overview")
colA, colB = st.columns(2)
colA.metric("Rows", df.shape[0])
colB.metric("Columns", df.shape[1])
st.dataframe(df.head())

# Revenue column
df_filtered["Revenue"] = (
    df_filtered["Quantity"] *
    df_filtered["Price"]
)

def format_currency(value):
    if value >= 1_00_00_000:
        return f"₹{value/1_00_00_000:.2f} Cr"
    elif value >= 1_00_000:
        return f"₹{value/1_00_000:.2f} L"
    elif value >= 1_000:
        return f"₹{value/1_000:.2f} K"
    else:
        return f"₹{value:.0f}"
    
def convert_to_csv(df):
    return df.to_csv(index=False).encode("utf-8")

def animate_metric(label, value, formatter):
    placeholder = st.empty()
    
    steps = 20
    for i in range(1, steps + 1):
        current_value = value * i / steps
        placeholder.metric(label, formatter(current_value))
        time.sleep(0.02)
    
    placeholder.metric(label, formatter(value))

# KPIs
total_revenue = df_filtered["Revenue"].sum()
total_orders = df_filtered["Invoice"].nunique()
total_customers = df_filtered["Customer ID"].nunique()

st.markdown("## Key Metrics")

k1, k2, k3 = st.columns(3)

with k1:
    animate_metric("Total Revenue", total_revenue, format_currency)

with k2:
    animate_metric("Total Orders", total_orders, lambda x: f"{int(x):,}")

with k3:
    animate_metric("Total Customers", total_customers, lambda x: f"{int(x):,}")

st.divider()
csv = convert_to_csv(df_filtered)
st.download_button(
    label="Download Filtered Data (CSV)⬇",
    data=csv,
    file_name="ecommerce_filtered_data.csv",
    mime="text/csv"
)
st.markdown("## 📌 Key Insights")

@st.cache_data
def compute_insights(df):
    import time
    top_country = (
        df.groupby("Country")["Revenue"]
        .sum()
        .sort_values(ascending=False)
        .idxmax()
    )

    top_product = (
        df.groupby("Description")["Revenue"]
        .sum()
        .sort_values(ascending=False)
        .idxmax()
    )

    df_copy = df.copy()
    df_copy["YearMonth"] = df_copy["InvoiceDate"].dt.to_period("M")

    monthly_revenue = (
    df_copy.groupby("YearMonth")["Revenue"]
        .sum()
        .reset_index()
    )

    if len(monthly_revenue) > 1:
        revenue_trend = (
            "increasing"
            if monthly_revenue["Revenue"].iloc[-1] > monthly_revenue["Revenue"].iloc[0]
            else "declining"
        )
    else:
        revenue_trend = "stable"

    return top_country, top_product, revenue_trend, monthly_revenue

loader = st.empty()

loader.info("🔍 Generating insights... Please wait")

top_country, top_product, revenue_trend, monthly_revenue = compute_insights(df_filtered)

loader.empty()



tab1, tab2, tab3 = st.tabs([
    "📈 Revenue Analysis",
    "🌍 Geography",
    "📦 Product Insights"
])

st.markdown(f"""
<div class="insight-card">

<div class="insight-title">📊 Revenue Insights</div>

<div class="insight-item">
📈 <b>Trend:</b> {revenue_trend.capitalize()} over time
</div>

<div class="insight-item">
🌍 <b>Top Country:</b> {top_country}
</div>

<div class="insight-item">
📦 <b>Best Product:</b> {top_product}
</div>

<div class="insight-note">
💡 Focus on high-performing products and regions to maximize growth
</div>

</div>
""", unsafe_allow_html=True)

monthly_revenue["YearMonth"] = monthly_revenue["YearMonth"].astype(str)

country_revenue = (
    df_filtered.groupby("Country")["Revenue"]
    .sum()
    .sort_values(ascending=False)
    .head(10)
)

# Tabs Layout
with tab1:

    st.subheader("Monthly Revenue Trend")

    fig = px.line(
    monthly_revenue,
    x="YearMonth",
    y="Revenue",
    title="Monthly Revenue Trend",
    markers=True
)
    st.plotly_chart(fig, use_container_width=True)


with tab2:

    st.subheader("Top Countries by Revenue")

    country_df = country_revenue.reset_index()
    country_df.columns = ["Country", "Revenue"]

    fig2 = px.bar(
        country_df,
        x="Country",
        y="Revenue",
        title="Top Countries by Revenue"
    )

    st.plotly_chart(fig2, use_container_width=True)


with tab3:

    st.subheader("Top Products by Revenue")

    top_products = (
        df_filtered.groupby("Description")["Revenue"]
        .sum()
        .sort_values(ascending=False)
        .head(10)
    )

    top_products_df = top_products.reset_index()
    top_products_df.columns = ["Product", "Revenue"]

    fig3 = px.bar(
        top_products_df,
        x="Product",
        y="Revenue",
        title="Top Products by Revenue"
    )

    st.plotly_chart(fig3, use_container_width=True)
st.caption("All revenue values shown in INR (₹)")