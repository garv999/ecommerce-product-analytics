import streamlit as st
import pandas as pd
import os
import datetime


st.set_page_config(
    page_title="Ecommerce Analytics Dashboard",
    layout="wide"
)

# Last updated timestamp
current_time = datetime.datetime.now().strftime("%d %b %Y, %H:%M")

st.caption(f"📅 Last Updated: {current_time}")

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

data_path = os.path.join(
    BASE_DIR,
    "..",
    "data",
    "processed",
    "cleaned_online_retail.csv"
)
st.markdown(
    """
    <style>

    .stApp {
        background-color: #0E1117;
    }

    section[data-testid="stSidebar"] {
        background-color: #111827;
    }

    div[data-testid="stMetric"] {
        background-color: #1F2937;
        padding: 15px;
        border-radius: 10px;
    }

    </style>
    """,
    unsafe_allow_html=True
)
# df = pd.read_csv(data_path)

# df["InvoiceDate"] = pd.to_datetime(df["InvoiceDate"])
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

# --------------------
# Dataset Overview
# --------------------

st.markdown("## Dataset Overview")

colA, colB = st.columns(2)
colA.metric("Rows", df.shape[0])
colB.metric("Columns", df.shape[1])

st.dataframe(df.head())

# --------------------
# Revenue column
# --------------------

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

# --------------------
# KPIs
# --------------------

total_revenue = df_filtered["Revenue"].sum()
total_orders = df_filtered["Invoice"].nunique()
total_customers = df_filtered["Customer ID"].nunique()

st.markdown("## Key Metrics")

k1, k2, k3 = st.columns(3)

k1.metric(
    label="Total Revenue",
    value=format_currency(total_revenue)
)

k2.metric(
    label="Total Orders",
    value=f"{total_orders:,}"
)

k3.metric(
    label="Total Customers",
    value=f"{total_customers:,}"
)

st.divider()

tab1, tab2, tab3 = st.tabs([
    "📈 Revenue Analysis",
    "🌍 Geography",
    "📦 Product Insights"
])
st.caption("All revenue values shown in INR (₹)")
# --------------------
# Monthly + Country side by side
# --------------------

df_filtered["YearMonth"] = df_filtered["InvoiceDate"].dt.to_period("M")

monthly_revenue = (
    df_filtered.groupby("YearMonth")["Revenue"]
    .sum()
    .reset_index()
)

monthly_revenue["YearMonth"] = monthly_revenue["YearMonth"].astype(str)

country_revenue = (
    df_filtered.groupby("Country")["Revenue"]
    .sum()
    .sort_values(ascending=False)
    .head(10)
)

import matplotlib.pyplot as plt
# --------------------
# Tabs Layout
# --------------------

with tab1:

    st.subheader("Monthly Revenue Trend")

    fig, ax = plt.subplots(figsize=(8, 4))

    ax.plot(
        monthly_revenue["YearMonth"],
        monthly_revenue["Revenue"]
    )

    plt.xticks(rotation=45)

    st.pyplot(fig)


with tab2:

    st.subheader("Top Countries by Revenue")

    fig2, ax2 = plt.subplots(figsize=(8, 4))

    ax2.bar(
        country_revenue.index,
        country_revenue.values
    )

    plt.xticks(rotation=45)

    st.pyplot(fig2)


with tab3:

    st.subheader("Top Products by Revenue")

    top_products = (
        df_filtered.groupby("Description")["Revenue"]
        .sum()
        .sort_values(ascending=False)
        .head(10)
    )

    fig3, ax3 = plt.subplots(figsize=(8, 4))

    ax3.bar(
        top_products.index,
        top_products.values
    )

    plt.xticks(rotation=75)

    st.pyplot(fig3)