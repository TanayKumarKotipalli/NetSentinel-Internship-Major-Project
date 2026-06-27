import pandas as pd
import json

df = pd.read_csv("../dataset/processed_train.csv")

normal_count = (df["41"] == "normal").sum()
attack_count = (df["41"] == "attack").sum()

dashboard_data = {
    "total_records": int(len(df)),
    "normal_traffic": int(normal_count),
    "threat_traffic": int(attack_count),
    "threat_percentage": float(
        round(
            attack_count / len(df) * 100,
            2
        )
    )
}

with open(
    "../backend/dashboard_data.json",
    "w"
) as file:
    json.dump(
        dashboard_data,
        file,
        indent=4
    )

print("dashboard_data.json created successfully")