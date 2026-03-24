from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import pyield as yd
import pandas as pd

app = FastAPI(title="DI1 Data Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/di1")
def get_di1(date: str = Query(..., description="Reference date YYYY-MM-DD")):
    """Fetch DI1 futures data from B3 via pyield."""
    ref_date = datetime.strptime(date, "%Y-%m-%d").date()
    data = None
    actual_date = ref_date

    for attempt in range(10):
        try:
            check_date = ref_date - timedelta(days=attempt)
            df = yd.futures(contract_code="DI1", reference_date=check_date)
            if df is not None and len(df) > 0:
                data = df
                actual_date = check_date
                break
        except Exception:
            continue

    if data is None:
        return {"error": "No data available", "contracts": [], "actual_date": None}

    # Convert to pandas if polars
    if not isinstance(data, pd.DataFrame):
        data = data.to_pandas()

    contracts = []
    for _, row in data.iterrows():
        contracts.append({
            "ticker": str(row["TickerSymbol"]),
            "expiration": str(row["ExpirationDate"]),
            "bdays": int(row["BDaysToExp"]),
            "rate": float(row["SettlementRate"]),
        })

    return {
        "contracts": contracts,
        "actual_date": str(actual_date),
        "requested_date": date,
    }


@app.get("/bdays")
def count_bdays(
    start: str = Query(..., description="Start date YYYY-MM-DD"),
    end: str = Query(..., description="End date YYYY-MM-DD"),
):
    """Count business days between two dates using Brazilian calendar."""
    start_date = datetime.strptime(start, "%Y-%m-%d").date()
    end_date = datetime.strptime(end, "%Y-%m-%d").date()
    count = yd.count_bdays(start_date, end_date)
    return {"start": start, "end": end, "bdays": int(count)}
