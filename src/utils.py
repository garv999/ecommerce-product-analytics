"""
Utility functions for ecommerce analytics project
"""

import pandas as pd


def calculate_revenue(df):
    """
    Adds Revenue column = Quantity * Price
    """
    df = df.copy()
    df["Revenue"] = df["Quantity"] * df["Price"]
    return df


def get_month_column(df):
    """
    Extract Year-Month from InvoiceDate
    """
    df = df.copy()
    df["YearMonth"] = df["InvoiceDate"].dt.to_period("M")
    return df


def get_cohort_month(df):
    """
    Create CohortMonth column (first purchase month per customer)
    """
    df = df.copy()

    df["InvoiceMonth"] = df["InvoiceDate"].dt.to_period("M")

    df["CohortMonth"] = (
        df.groupby("Customer ID")["InvoiceDate"]
        .transform("min")
        .dt.to_period("M")
    )

    return df


def create_rfm(df, reference_date):
    """
    Create RFM table
    """
    rfm = df.groupby("Customer ID").agg({
        "InvoiceDate": lambda x: (reference_date - x.max()).days,
        "Invoice": "nunique",
        "Revenue": "sum"
    })

    rfm.columns = ["Recency", "Frequency", "Monetary"]

    return rfm