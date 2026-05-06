import streamlit as st
import pandas as pd
import os
import plotly.express as px
import plotly.io as pio

pio.templates.default = "plotly_dark"

st.title("📦 Product Analysis")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

data_path = os.path.join(
    BASE_DIR,
    "data",
    "processed",
    "cleaned_online_retail.csv"
)

df = pd.read_csv(data_path)

df["Revenue"] = df["Quantity"] * df["Price"]

st.subheader("Top Products by Revenue")

top_products = (
    df.groupby("Description")["Revenue"]
    .sum()
    .sort_values(ascending=False)
    .head(10)
)

top_products_df = top_products.reset_index()
top_products_df.columns = ["Product", "Revenue"]

fig = px.bar(
    top_products_df,
    x="Product",
    y="Revenue",
    title="Top Products by Revenue"
)

fig.update_layout(xaxis_tickangle=-45)

st.plotly_chart(fig, use_container_width=True)

# ------------------------

st.subheader("Most Purchased Products")

top_quantity = (
    df.groupby("Description")["Quantity"]
    .sum()
    .sort_values(ascending=False)
    .head(10)
)
top_quantity_df = top_quantity.reset_index()
top_quantity_df.columns = ["Product", "Quantity"]

fig2 = px.bar(
    top_quantity_df,
    x="Product",
    y="Quantity",
    title="Most Purchased Products"
)

fig2.update_layout(xaxis_tickangle=-45)

st.plotly_chart(fig2, use_container_width=True)