import streamlit as st
import pandas as pd

st.set_page_config(
    page_title="Ecommerce Analytics Dashboard",
    layout="wide"
)

st.title("📊 Ecommerce Product Analytics Dashboard")

import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

data_path = os.path.join(
    BASE_DIR,
    "data",
    "processed",
    "cleaned_online_retail.csv"
)

df = pd.read_csv(data_path)

df["InvoiceDate"] = pd.to_datetime(df["InvoiceDate"])

st.subheader("Dataset Overview")

st.write("Rows:", df.shape[0])
st.write("Columns:", df.shape[1])

st.dataframe(df.head())

# --------------------
# Revenue column
# --------------------

df["Revenue"] = df["Quantity"] * df["Price"]

# --------------------
# KPIs
# --------------------

total_revenue = df["Revenue"].sum()
total_orders = df["Invoice"].nunique()
total_customers = df["Customer ID"].nunique()

st.subheader("Key Metrics")

col1, col2, col3 = st.columns(3)

col1.metric("Total Revenue", f"{total_revenue:,.0f}")
col2.metric("Total Orders", total_orders)
col3.metric("Total Customers", total_customers)

# --------------------
# Monthly Revenue Trend
# --------------------

st.subheader("Monthly Revenue Trend")

df["YearMonth"] = df["InvoiceDate"].dt.to_period("M")

monthly_revenue = (
    df.groupby("YearMonth")["Revenue"]
    .sum()
    .reset_index()
)

monthly_revenue["YearMonth"] = monthly_revenue["YearMonth"].astype(str)

import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(6, 3))

ax.plot(
    monthly_revenue["YearMonth"],
    monthly_revenue["Revenue"]
)

plt.xticks(rotation=90)

st.pyplot(fig, use_container_width=False)