import joblib

model = joblib.load(
    "../ml/saved_models/isolation_forest.pkl"
)

print("Isolation Forest loaded successfully.")