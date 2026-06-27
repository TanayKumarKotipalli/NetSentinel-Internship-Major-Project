from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
from ml_service import model
from pydantic import BaseModel
import numpy as np
import threading
from packet_sniffer import start_sniffer
from replay_engine import start_replay
import os
from traffic_store import (
    get_packets,
    get_stats,
    get_top_ips,
    get_protocol_stats,
    get_top_threats,
    get_threat_feed,
    get_attack_distribution
)
from datetime import datetime
import requests
from reportlab.lib.units import inch
from fastapi.responses import FileResponse
import os
import uuid
from reportlab.pdfgen import canvas

from reportlab.lib.colors import HexColor, white

from reportlab.lib.utils import ImageReader

from reportlab.lib.pagesizes import A4
print("========== LOADED MY MAIN.PY ==========")
class PredictionInput(BaseModel):
    features: list
app = FastAPI(
    title="NetSentinel API"
)
# Run Replay Engine on Render, Scapy locally
if os.getenv("DEMO_MODE") == "true":

    print("Running Replay Engine...")

    threading.Thread(
        target=start_replay,
        daemon=True
    ).start()

else:

    print("Running Live Packet Sniffer...")

    threading.Thread(
        target=start_sniffer,
        daemon=True
    ).start()
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://net-sentinel-internship-major-proje.vercel.app/"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def home():
    return {
        "message": "NetSentinel API Running"
    }

@app.get("/api/dashboard")
def dashboard():

    with open(
        "dashboard_data.json",
        "r"
    ) as file:

        data = json.load(file)

    return data
@app.get("/api/threats")
def threats():

    with open(
        "threats.json",
        "r"
    ) as file:

        data = json.load(file)

    return data
@app.post("/api/predict")
def predict(data: PredictionInput):

    features = np.array(
        data.features
    ).reshape(1, -1)

    prediction = model.predict(features)

    result = (
        "attack"
        if prediction[0] == -1
        else "normal"
    )

    return {
        "prediction": result
    }
@app.get("/api/analytics")
def analytics():

    return {
        "critical": 14,
        "high": 21,
        "medium": 15,

        "attack_types": [
            {
                "name": "Neptune",
                "count": 12
            },
            {
                "name": "Smurf",
                "count": 10
            },
            {
                "name": "Satan",
                "count": 9
            },
            {
                "name": "Probe",
                "count": 11
            },
            {
                "name": "DoS",
                "count": 8
            }
        ]
    }
@app.get("/api/predictions")
def predictions():
    return [
        {
            "time": "10:42 AM",
            "prediction": "Attack",
            "confidence": "92%"
        },
        {
            "time": "10:43 AM",
            "prediction": "Normal",
            "confidence": "87%"
        },
        {
            "time": "10:44 AM",
            "prediction": "Attack",
            "confidence": "95%"
        }
    ]
@app.get("/api/live-traffic")
def live_traffic():

    return get_packets()

@app.get("/api/live-stats")
def live_stats():

    return get_stats()

@app.get("/api/live-threat-stats")
def live_threat_stats():
    return get_stats()

@app.get("/api/top-ips")
def top_ips():

    return get_top_ips()

@app.get("/api/protocol-stats")
def protocol_statistics():
    return get_protocol_stats()

@app.get("/api/top-threats")
def top_threats():
    return get_top_threats()

@app.get("/api/threat-feed")
def threat_feed():
    return get_threat_feed()
@app.get("/api/ai-verdict")
def ai_verdict():

    stats = get_stats()

    if stats["high"] >= 50:
        verdict = "CRITICAL"

    elif stats["high"] >= 25 or stats["medium"] >= 500:
        verdict = "SUSPICIOUS"

    else:
        verdict = "NORMAL"

    return {
        "verdict": verdict
    }
@app.get("/api/threat-history")
def threat_history():

    return get_threat_feed()
@app.get("/api/attack-distribution")
def attack_distribution():

    return get_attack_distribution()
@app.get("/api/ip-lookup/{ip}")
def get_ip_info(ip: str):

    try:

        response = requests.get(
            f"http://ip-api.com/json/{ip}"
        )

        data = response.json()

        return {
            "ip": ip,
            "country": data.get("country", "Unknown"),
            "city": data.get("city", "Unknown"),
            "isp": data.get("isp", "Unknown")
        }

    except Exception as e:

        return {
            "error": str(e)
        }
@app.get("/api/security-report")
def security_report():

    stats = get_stats()
    protocols = get_protocol_stats()
    threats = get_top_threats()
    attack_distribution = get_attack_distribution()

    top_threat_ip = "None"

    if threats:
        top_threat_ip = threats[0]["ip"]

    top_category = "None"

    if attack_distribution:
        top_category = max(
            attack_distribution,
            key=lambda x: x["count"]
        )["type"]

    verdict = "NORMAL"

    if stats["high"] >= 20:
        verdict = "CRITICAL"

    elif stats["medium"] >= 50:
        verdict = "SUSPICIOUS"

    report_name = f"NetSentinel_Report_{uuid.uuid4().hex[:8]}.pdf"
    pdf = canvas.Canvas(
    report_name,
    pagesize=A4
    )
    width, height = A4
    # Header Background

    pdf.setFillColor(
    HexColor("#0F172A")
    )

    pdf.rect(
    0,
    height - 130,
    width,
    130,
    fill=1,
    stroke=0
    )
    logo_path = "assets/netsentinel_logo.png"

    if os.path.exists(logo_path):

        pdf.drawImage(
            ImageReader(logo_path),
            35,
            height - 105,
            width=65,
            height=65,
            mask="auto"
    )
    pdf.setFillColor(white)

    pdf.setFont(
    "Helvetica-Bold",
    22
    )

    pdf.drawString(
    120,
    height - 55,
    "NetSentinel AI"
    )

    pdf.setFont(
    "Helvetica",
    11
    )

    pdf.drawString(
    120,
    height - 75,
    "Traffic. Threats. Intelligence."
    )
    pdf.setFillColor(
    HexColor("#0F172A")
    )

    pdf.setFont(
    "Helvetica-Bold",
    20
    )

    pdf.drawString(
    40,
    height - 170,
    "Security Analysis Report"
    )
    pdf.setFont(
    "Helvetica",
    11
    )

    pdf.drawString(
    40,
    height - 195,
    f"Generated: {datetime.now().strftime('%d-%m-%Y %I:%M %p')}"
    )
    pdf.setFillColor(
    HexColor("#2563EB")
    )

    pdf.rect(
    40,
    height - 300,
    120,
    70,
    fill=1
    )

    pdf.rect(
    180,
    height - 300,
    120,
    70,
    fill=1
    )

    pdf.rect(
    320,
    height - 300,
    120,
    70,
    fill=1
    )

    pdf.rect(
    460,
    height - 300,
    120,
    70,
    fill=1
    )
    pdf.setFillColor(white)

    pdf.setFont(
    "Helvetica-Bold",
    11
    )

    pdf.drawCentredString(
    100,
    height - 245,
    "TOTAL"
    )   

    pdf.drawCentredString(
    240,
    height - 245,
    "SAFE"
    )

    pdf.drawCentredString(
    380,
    height - 245,
    "MEDIUM"
    )

    pdf.drawCentredString(
    520,
    height - 245,
    "HIGH"
    )
    pdf.setFont(
    "Helvetica-Bold",
    18
    )

    pdf.drawCentredString(
    100,
    height - 275,
    str(stats["total_packets"])
    )

    pdf.drawCentredString(
    240,
    height - 275,
    str(stats["safe"])
    )

    pdf.drawCentredString(
    380,
    height - 275,
    str(stats["medium"])
    )

    pdf.drawCentredString(
    520,
    height - 275,
    str(stats["high"])
    )
    pdf.setFillColor(
    HexColor("#0F172A")
    )

    pdf.setFont(
    "Helvetica-Bold",
    18
    )

    pdf.drawString(
    40,
    height - 350,
    "Threat Intelligence"
    )
    pdf.setStrokeColor(
    HexColor("#CBD5E1")
    )

    pdf.setLineWidth(1)

    pdf.roundRect(
    40,
    height - 540,
    515,
    165,
    10,
    stroke=1,
    fill=0
    )
    pdf.setFont(
    "Helvetica-Bold",
    12
    )

    pdf.drawString(
    60,
    height - 395,
    "Top Threat IP"
    )

    pdf.setFont(
    "Helvetica",
    12
    )

    pdf.drawString(
    220,
    height - 395,
    top_threat_ip
    )
    pdf.setFont(
    "Helvetica-Bold",
    12
    )

    pdf.drawString(
    60,
    height - 430,
    "Top Threat Category"
    )

    pdf.setFont(
    "Helvetica",
    12
    )

    pdf.drawString(
    220,
    height - 430,
    top_category
    )
    pdf.setFont(
    "Helvetica-Bold",
    12
    )

    pdf.drawString(
    60,
    height - 465,
    "AI Verdict"
    )
    badge_color = "#22C55E"

    if verdict == "SUSPICIOUS":
        badge_color = "#F59E0B"

    elif verdict == "CRITICAL":
        badge_color = "#EF4444"

    pdf.setFillColor(
    HexColor(badge_color)
    )

    pdf.roundRect(
    220,
    height - 478,
    120,
    24,
    8,
    fill=1,
    stroke=0
    )

    pdf.setFillColor(white)

    pdf.setFont(
    "Helvetica-Bold",
    11
    )

    pdf.drawCentredString(
    280,
    height - 470,
    verdict
    )
    pdf.save()
    return FileResponse(
        report_name,
        media_type="application/pdf",
        filename="NetSentinel_Security_Report.pdf"
    )