import pandas as pd
import json
import random

df = pd.read_csv("../dataset/processed_train.csv")

# Only attack records
attacks = df[df["41"] == "attack"]

attack_types = [
    "Neptune",
    "Smurf",
    "Satan",
    "Probe",
    "DoS"
]

severity_levels = [
    "Medium",
    "High",
    "Critical"
]

threats = []

for i in range(50):
    threats.append({
        "id": f"TH-{1000+i}",
        "type": random.choice(attack_types),
        "severity": random.choice(severity_levels)
    })

with open(
    "../backend/threats.json",
    "w"
) as file:
    json.dump(threats, file, indent=4)

print("Threat records generated.")