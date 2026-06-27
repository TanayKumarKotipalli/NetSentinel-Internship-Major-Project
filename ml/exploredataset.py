import pandas as pd

train_path = "../dataset/KDDTrain+.txt"

df = pd.read_csv(train_path, header=None)

print("\nRows and Columns:")
print(df.shape)

print("\nFirst 5 Rows:")
print(df.head())

print("\nLast 2 Columns:")
print(df.iloc[:, -2:].head())

print("\nMissing Values:")
print(df.isnull().sum().sum())