import streamlit as st
import pandas as pd
import os
import plotly.express as px
import plotly.io as pio

pio.templates.default = "plotly_dark"

st.title("👥 Customer Analysis")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

data_path = os.path.join(
    BASE_DIR,
    "data",
    "processed",
    "cleaned_online_retail.csv"
)

df = pd.read_csv(data_path)

df["Revenue"] = df["Quantity"] * df["Price"]

st.subheader("Top Customers by Revenue")

top_customers = (
    df.groupby("Customer ID")["Revenue"]
    .sum()
    .sort_values(ascending=False)
    .head(10)
)

top_customers_df = top_customers.reset_index()
top_customers_df.columns = ["Customer", "Revenue"]

fig = px.bar(
    top_customers_df,
    x="Customer",
    y="Revenue",
    title="Top Customers by Revenue"
)
fig.update_layout(xaxis_tickangle=-45)
st.plotly_chart(fig, use_container_width=True)

# ------------------------

st.subheader("Orders per Customer")

orders = (
    df.groupby("Customer ID")["Invoice"]
    .nunique()
)

orders_df = orders.reset_index()
orders_df.columns = ["Customer", "OrderCount"]

fig2 = px.histogram(
    orders_df,
    x="OrderCount",
    nbins=30,
    title="Orders per Customer Distribution"
)
st.plotly_chart(fig2, use_container_width=True)