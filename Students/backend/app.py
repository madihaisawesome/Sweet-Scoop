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
# For this lab, allow cross-origin requests from the React dev server.
# This broad setup keeps local development simple and is not standard
# production practice.
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
        return jsonify({"message": "Request body must include id, first_name, and user_group."}), 400

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
        return jsonify({"message": "Request body must include first_name and user_group."}), 400

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


# Exercise2
# - POST /predict_house_price


if __name__ == "__main__":
    app.run(debug=True, port=5050)
