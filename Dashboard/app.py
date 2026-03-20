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