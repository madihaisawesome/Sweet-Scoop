from copy import deepcopy
from pathlib import Path

import joblib
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

SEEDED_USERS = {
    "1": {"id": "1", "first_name": "Ava", "user_group": 11},
    "2": {"id": "2", "first_name": "Ben", "user_group": 22},
    "3": {"id": "3", "first_name": "Chloe", "user_group": 33},
    "4": {"id": "4", "first_name": "Diego", "user_group": 44},
    "5": {"id": "5", "first_name": "Ella", "user_group": 55},
}

MODEL_PATH = Path(__file__).resolve().parent / "src" / "random_forest_model.pkl"
PREDICTION_COLUMNS = [
    "city",
    "province",
    "latitude",
    "longitude",
    "lease_term",
    "type",
    "beds",
    "baths",
    "sq_feet",
    "furnishing",
    "smoking",
    "cats",
    "dogs",
]

app = Flask(__name__)
CORS(app)
users = deepcopy(SEEDED_USERS)


@app.route("/users", methods=["GET"])
def get_users():
    return jsonify(list(users.values())), 200


@app.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()

    if not data:
        return jsonify({"message": "Request body must be valid JSON."}), 400

    user_id = data.get("id")
    first_name = data.get("first_name")
    user_group = data.get("user_group")

    if user_id is None or first_name is None or user_group is None:
        return (
            jsonify(
                {"message": "Request body must include id, first_name, and user_group."}
            ),
            400,
        )

    user_id = str(user_id)

    if user_id in users:
        return jsonify({"message": f"User {user_id} already exists."}), 409

    new_user = {
        "id": user_id,
        "first_name": first_name,
        "user_group": user_group,
    }
    users[user_id] = new_user

    return (
        jsonify(
            {
                "id": user_id,
                "first_name": first_name,
                "user_group": user_group,
                "message": f"Created user {user_id}.",
            }
        ),
        201,
    )


@app.route("/users/<user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.get_json()

    if not data:
        return jsonify({"message": "Request body must be valid JSON."}), 400

    first_name = data.get("first_name")
    user_group = data.get("user_group")

    if first_name is None or user_group is None:
        return (
            jsonify(
                {"message": "Request body must include first_name and user_group."}
            ),
            400,
        )

    if user_id not in users:
        return jsonify({"message": f"User {user_id} was not found."}), 404

    users[user_id] = {
        "id": user_id,
        "first_name": first_name,
        "user_group": user_group,
    }

    return (
        jsonify(
            {
                "id": user_id,
                "first_name": first_name,
                "user_group": user_group,
                "message": f"Updated user {user_id}.",
            }
        ),
        200,
    )


@app.route("/users/<user_id>", methods=["DELETE"])
def delete_user(user_id):
    if user_id not in users:
        return jsonify({"message": f"User {user_id} was not found."}), 404

    del users[user_id]
    return jsonify({"message": f"Deleted user {user_id}."}), 200


@app.route("/predict_house_price", methods=["POST"])
def predict_house_price():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"message": "Request body must be valid JSON."}), 400

        required_fields = [
            "city",
            "province",
            "latitude",
            "longitude",
            "lease_term",
            "type",
            "beds",
            "baths",
            "sq_feet",
            "furnishing",
            "smoking",
            "pets",
        ]

        for field in required_fields:
            if field not in data:
                return jsonify({"message": f"{field} is required."}), 400

        try:
            city = str(data["city"])
            province = str(data["province"])
            latitude = float(data["latitude"])
            longitude = float(data["longitude"])
            lease_term = str(data["lease_term"])
            house_type = str(data["type"])
            beds = float(data["beds"])
            baths = float(data["baths"])
            sq_feet = float(data["sq_feet"])
            furnishing = str(data["furnishing"])
            smoking = str(data["smoking"])
        except (TypeError, ValueError):
            return (
                jsonify(
                    {
                        "message": "latitude, longitude, beds, baths, and sq_feet must be numbers."
                    }
                ),
                400,
            )

        pets = bool(data["pets"])
        cats = pets
        dogs = pets

        model = joblib.load(MODEL_PATH)

        sample_data = [
            city,
            province,
            latitude,
            longitude,
            lease_term,
            house_type,
            beds,
            baths,
            sq_feet,
            furnishing,
            smoking,
            cats,
            dogs,
        ]

        sample_df = pd.DataFrame([sample_data], columns=PREDICTION_COLUMNS)

        predicted_price = float(model.predict(sample_df)[0])

        return jsonify({"predicted_price": predicted_price}), 200

    except Exception as error:
        return jsonify({"message": str(error)}), 400


if __name__ == "__main__":
    app.run(debug=True, port=5050)
