import pandas as pd
from sklearn.linear_model import LogisticRegression
import joblib

data = pd.read_csv("data.csv")

X = data[["salary", "experience"]]
y = data["success"]

model = LogisticRegression()
model.fit(X, y)

joblib.dump(model, "model.pkl")

print("Model trained successfully!")