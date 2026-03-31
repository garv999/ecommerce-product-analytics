import streamlit as st
import pandas as pd
import streamlit as st
import pandas as pd
import os

st.set_page_config(
    page_title="Ecommerce Analytics Dashboard",
    layout="wide"
)

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

data_path = os.path.join(
    BASE_DIR,
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
df = pd.read_csv(data_path)

df["InvoiceDate"] = pd.to_datetime(df["InvoiceDate"])

# --------------------
# Sidebar Filters
# --------------------

# --------------------
# Sidebar Filters
# --------------------

st.sidebar.title("Dashboard Filters")
st.sidebar.markdown("---")

df_filtered = df.copy()

countries = df["Country"].unique()

selected_country = st.sidebar.selectbox(
    "Select Country",
    ["All"] + list(countries)
)

min_date = df["InvoiceDate"].min()
max_date = df["InvoiceDate"].max()

start_date, end_date = st.sidebar.date_input(
    "Select Date Range",
    [min_date, max_date]
)

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
st.markdown(
    """
    # 📊 Ecommerce Product Analytics Dashboard
    ### Customer Behavior • Revenue Trends • Product Performance
    """
)
st.divider()

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

# --------------------
# KPIs
# --------------------
df_filtered["Revenue"] = df_filtered["Quantity"] * df_filtered["Price"]

total_revenue = df_filtered["Revenue"].sum()
total_orders = df_filtered["Invoice"].nunique()
total_customers = df_filtered["Customer ID"].nunique()

st.markdown("## Key Metrics")

k1, k2, k3 = st.columns(3)

k1.metric(
    label="Total Revenue",
    value=f"{total_revenue:,.0f}"
)

k2.metric(
    label="Total Orders",
    value=total_orders
)

k3.metric(
    label="Total Customers",
    value=total_customers
)

st.divider()
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

with st.container():

    st.markdown("## Revenue Analysis")

c1, c2 = st.columns(2)

with c1:

    st.subheader("Monthly Revenue")

    fig, ax = plt.subplots(figsize=(6, 3))

    ax.plot(
        monthly_revenue["YearMonth"],
        monthly_revenue["Revenue"]
    )

    plt.xticks(rotation=45)

    st.pyplot(fig)


with c2:

    st.subheader("Top Countries")

    fig2, ax2 = plt.subplots(figsize=(6, 3))

    ax2.bar(
        country_revenue.index,
        country_revenue.values
    )

    plt.xticks(rotation=45)

    st.pyplot(fig2)


# --------------------
# Product chart
# --------------------

st.markdown("## Product Analysis")

top_products = (
    df_filtered.groupby("Description")["Revenue"]
    .sum()
    .sort_values(ascending=False)
    .head(10)
)

fig3, ax3 = plt.subplots(figsize=(6, 3))

ax3.bar(
    top_products.index,
    top_products.values
)

plt.xticks(rotation=75)

st.pyplot(fig3)