from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from datetime import datetime, timedelta
import json
import pyield as yd


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        query = parse_qs(urlparse(self.path).query)
        date = query.get("date", [None])[0]

        if not date:
            self._json_response({"error": "date parameter required"}, 400)
            return

        try:
            result = fetch_di1(date)
            self._json_response(result)
        except Exception as e:
            self._json_response({"error": str(e)}, 500)

    def _json_response(self, data, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode("utf-8"))


def fetch_di1(date: str):
    ref_date = datetime.strptime(date, "%Y-%m-%d").date()
    data = None
    actual_date = ref_date

    last_error = None
    for attempt in range(10):
        check_date = ref_date - timedelta(days=attempt)
        try:
            df = yd.futuro.historico(check_date, "DI1")
            if df is not None and len(df) > 0:
                data = df
                actual_date = check_date
                break
        except Exception as e:
            last_error = f"{type(e).__name__}: {e}"
            continue

    if data is None:
        return {
            "error": f"Dados indisponíveis para {date}. A B3 disponibiliza apenas dados recentes (~30 dias úteis). Selecione uma data mais próxima do dia atual.",
            "debug": last_error,
            "contracts": [],
            "actual_date": None,
        }

    contracts = []
    for row in data.iter_rows(named=True):
        rate = row.get("taxa_ajuste")
        bdays = row.get("dias_uteis")
        if rate is None or bdays is None:
            continue
        contracts.append({
            "ticker": str(row["codigo_negociacao"]),
            "expiration": str(row["data_vencimento"]),
            "bdays": int(bdays),
            "rate": float(rate),
        })

    return {
        "contracts": contracts,
        "actual_date": str(actual_date),
        "requested_date": date,
    }
