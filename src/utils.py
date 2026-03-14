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