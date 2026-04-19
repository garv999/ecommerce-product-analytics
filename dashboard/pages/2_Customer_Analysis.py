import streamlit as st
import pandas as pd
import os
import matplotlib.pyplot as plt

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

fig, ax = plt.subplots(figsize=(8,4))

ax.bar(top_customers.index.astype(str), top_customers.values)
plt.xticks(rotation=45)

st.pyplot(fig)

# ------------------------

st.subheader("Orders per Customer")

orders = (
    df.groupby("Customer ID")["Invoice"]
    .nunique()
)

fig2, ax2 = plt.subplots(figsize=(8,4))

orders.hist(ax=ax2)

st.pyplot(fig2)