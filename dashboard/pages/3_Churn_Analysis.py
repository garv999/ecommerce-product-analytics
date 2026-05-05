import streamlit as st
import pandas as pd
import os
import plotly.express as px
import plotly.io as pio
import datetime as dt
pio.templates.default = "plotly_dark"

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

churn_df = status_counts.reset_index()
churn_df.columns = ["Status", "Count"]

fig = px.bar(
    churn_df,
    x="Status",
    y="Count",
    title="Customer Churn Distribution",
    color="Status"
)
fig.update_layout(xaxis_title="Customer Status", yaxis_title="Number of Customers")
st.plotly_chart(fig, use_container_width=True)