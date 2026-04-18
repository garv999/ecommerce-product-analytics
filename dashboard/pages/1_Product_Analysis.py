import streamlit as st
import pandas as pd
import os
import matplotlib.pyplot as plt

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

fig, ax = plt.subplots(figsize=(8,4))

ax.bar(top_products.index, top_products.values)
plt.xticks(rotation=75)

st.pyplot(fig)

# ------------------------

st.subheader("Most Purchased Products")

top_quantity = (
    df.groupby("Description")["Quantity"]
    .sum()
    .sort_values(ascending=False)
    .head(10)
)

fig2, ax2 = plt.subplots(figsize=(8,4))

ax2.bar(top_quantity.index, top_quantity.values)
plt.xticks(rotation=75)

st.pyplot(fig2)