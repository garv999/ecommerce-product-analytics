import streamlit as st
import pandas as pd
import os
import matplotlib.pyplot as plt
import datetime as dt

st.title("📉 Churn Analysis")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

data_path = os.path.join(
    BASE_DIR,
    "data",
    "processed",
    "cleaned_online_retail.csv"
)

df = pd.read_csv(data_path)

df["InvoiceDate"] = pd.to_datetime(df["InvoiceDate"])

# Last purchase per customer
last_purchase = df.groupby("Customer ID")["InvoiceDate"].max().reset_index()

reference_date = df["InvoiceDate"].max() + dt.timedelta(days=1)

last_purchase["DaysSinceLastPurchase"] = (
    reference_date - last_purchase["InvoiceDate"]
).dt.days

def classify(days):
    if days <= 30:
        return "Active"
    elif days <= 90:
        return "At Risk"
    else:
        return "Churned"

last_purchase["Status"] = last_purchase["DaysSinceLastPurchase"].apply(classify)

status_counts = last_purchase["Status"].value_counts()

fig, ax = plt.subplots(figsize=(6,4))

status_counts.plot(kind="bar", ax=ax)

st.pyplot(fig)