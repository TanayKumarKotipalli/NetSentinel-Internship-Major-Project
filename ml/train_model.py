import joblib
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.metrics import classification_report

# Load processed dataset
df = pd.read_csv("../dataset/processed_train.csv")

# Convert labels
df["41"] = df["41"].map({
    "normal": 0,
    "attack": 1
})

# Features and target
X = df.drop(columns=["41"])
y = df["41"]

print("Features Shape:", X.shape)
print("Labels Shape:", y.shape)

# Train Isolation Forest
model = IsolationForest(
    contamination=0.1,
    random_state=42
)

print("\nTraining model...")
model.fit(X)
joblib.dump(
    model,
    "saved_models/isolation_forest.pkl"
)

print("Model saved successfully.")
# Predictions
predictions = model.predict(X)

# Convert predictions
predictions = [1 if p == -1 else 0 for p in predictions]

print("\nClassification Report:\n")
print(classification_report(y, predictions))