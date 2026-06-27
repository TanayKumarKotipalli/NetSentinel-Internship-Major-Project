import pandas as pd
from sklearn.preprocessing import LabelEncoder

# Load dataset
df = pd.read_csv("../dataset/KDDTrain+.txt", header=None)

print("Original Shape:", df.shape)

# Column 41 = attack label
# Column 42 = difficulty score

# Drop difficulty score
df = df.drop(columns=[42])

# Convert attack labels
df[41] = df[41].apply(
    lambda x: "normal" if x == "normal" else "attack"
)

print("\nClass Distribution:")
print(df[41].value_counts())

# Encode categorical columns
categorical_columns = [1, 2, 3]

encoders = {}

for col in categorical_columns:
    encoder = LabelEncoder()
    df[col] = encoder.fit_transform(df[col])
    encoders[col] = encoder

print("\nEncoded Successfully")

print("\nSample Data:")
print(df.head())

# Save processed dataset
df.to_csv("../dataset/processed_train.csv", index=False)

print("\nProcessed dataset saved.")