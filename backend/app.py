from flask import Flask, jsonify, request
from flask_cors import CORS
import bcrypt
import json
import os
import random
import re
from copy import deepcopy
from datetime import datetime

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FLAVORS_FILE = os.path.join(BASE_DIR, "flavors.json")
REVIEWS_FILE = os.path.join(BASE_DIR, "reviews.json")

# In-memory backend user store.
# New users created through /signup will be stored here while the server is running.
users = []

next_user_id = 1


def load_json_file(file_path):
    """Load and return JSON data from a file."""
    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)


def load_flavors():
    """Load flavor data from flavors.json."""
    return load_json_file(FLAVORS_FILE)


def load_reviews():
    """Load review data from reviews.json."""
    return load_json_file(REVIEWS_FILE)


def find_user_by_id(user_id):
    """Return a user dict by id, or None if not found."""
    for user in users:
        if user["id"] == user_id:
            return user
    return None


def find_user_by_username(username):
    """Return a user dict by username, or None if not found."""
    for user in users:
        if user["username"].lower() == username.lower():
            return user
    return None


def find_user_by_email(email):
    """Return a user dict by email, or None if not found."""
    for user in users:
        if user["email"].lower() == email.lower():
            return user
    return None


def find_flavor_by_id(flavor_id):
    """Return a flavor dict by id, or None if not found."""
    flavors = load_flavors()
    for flavor in flavors:
        if flavor["id"] == flavor_id:
            return flavor
    return None


def parse_price(price_value):
    """
    Convert a price like '$4.99' or 4.99 into a float.
    Returns None if parsing fails.
    """
    if isinstance(price_value, (int, float)):
        return float(price_value)

    if isinstance(price_value, str):
        cleaned = price_value.replace("$", "").strip()
        try:
            return float(cleaned)
        except ValueError:
            return None

    return None


def validate_username(username):
    """
    Username rules:
    - 3 to 20 characters
    - starts with a letter
    - letters, numbers, underscores, hyphens only
    """
    if not isinstance(username, str):
        return False

    pattern = r"^[A-Za-z][A-Za-z0-9_-]{2,19}$"
    return re.fullmatch(pattern, username) is not None


def validate_email(email):
    """Basic email format validation."""
    if not isinstance(email, str):
        return False

    pattern = r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
    return re.fullmatch(pattern, email) is not None


def validate_password(password):
    """
    Password rules:
    - minimum 8 characters
    - at least one uppercase letter
    - at least one lowercase letter
    - at least one number
    - at least one special character
    """
    if not isinstance(password, str):
        return False

    if len(password) < 8:
        return False

    has_upper = re.search(r"[A-Z]", password) is not None
    has_lower = re.search(r"[a-z]", password) is not None
    has_digit = re.search(r"\d", password) is not None
    has_special = re.search(r"[^A-Za-z0-9]", password) is not None

    return has_upper and has_lower and has_digit and has_special


def get_next_user_id():
    """Return the next user id and increment the counter."""
    global next_user_id
    current_id = next_user_id
    next_user_id += 1
    return current_id


def get_next_order_id(user):
    """Return the next order id for a user."""
    if not user["orders"]:
        return 1

    highest_order_id = max(order["orderId"] for order in user["orders"])
    return highest_order_id + 1


def build_cart_item_from_flavor(flavor):
    """Create a cart item from a flavor."""
    price = parse_price(flavor["price"])
    return {
        "flavorId": flavor["id"],
        "name": flavor["name"],
        "price": price,
        "quantity": 1,
    }


def calculate_order_total(items):
    """Calculate the total cost for a list of cart/order items."""
    total = 0.0
    for item in items:
        total += float(item["price"]) * int(item["quantity"])
    return round(total, 2)


@app.route("/", methods=["GET"])
def home():
    return jsonify({"success": True, "message": "Sweet Scoop backend is running."}), 200


@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json(silent=True)

    if not data:
        return (
            jsonify({"success": False, "message": "Invalid or missing JSON body."}),
            400,
        )

    username = str(data.get("username", "")).strip()
    email = str(data.get("email", "")).strip()
    password = data.get("password", "")

    if not validate_username(username):
        return (
            jsonify(
                {
                    "success": False,
                    "message": "Invalid username. It must be 3–20 characters, start with a letter, and contain only letters, numbers, underscores, and hyphens.",
                }
            ),
            400,
        )

    if not validate_email(email):
        return jsonify({"success": False, "message": "Invalid email format."}), 400

    if not validate_password(password):
        return (
            jsonify(
                {
                    "success": False,
                    "message": "Invalid password. It must be at least 8 characters and include uppercase, lowercase, number, and special character.",
                }
            ),
            400,
        )

    if find_user_by_username(username):
        return jsonify({"success": False, "message": "Username is already taken."}), 409

    if find_user_by_email(email):
        return jsonify({"success": False, "message": "Email is already in use."}), 409

    password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode(
        "utf-8"
    )

    new_user = {
        "id": get_next_user_id(),
        "username": username,
        "email": email,
        "password_hash": password_hash,
        "cart": [],
        "orders": [],
    }

    users.append(new_user)

    return jsonify({"success": True, "message": "Registration successful."}), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True)

    if not data:
        return (
            jsonify({"success": False, "message": "Invalid or missing JSON body."}),
            400,
        )

    username = str(data.get("username", "")).strip()
    password = data.get("password", "")

    user = find_user_by_username(username)

    if not user:
        return (
            jsonify({"success": False, "message": "Invalid username or password."}),
            401,
        )

    password_matches = bcrypt.checkpw(
        password.encode("utf-8"), user["password_hash"].encode("utf-8")
    )

    if not password_matches:
        return (
            jsonify({"success": False, "message": "Invalid username or password."}),
            401,
        )

    return (
        jsonify(
            {
                "success": True,
                "message": "Login successful.",
                "userId": user["id"],
                "username": user["username"],
            }
        ),
        200,
    )


@app.route("/reviews", methods=["GET"])
def get_reviews():
    reviews = load_reviews()

    if len(reviews) <= 2:
        selected_reviews = reviews
    else:
        selected_reviews = random.sample(reviews, 2)

    return (
        jsonify(
            {"success": True, "message": "Reviews loaded.", "reviews": selected_reviews}
        ),
        200,
    )


@app.route("/flavors", methods=["GET"])
def get_flavors():
    flavors = load_flavors()

    return (
        jsonify({"success": True, "message": "Flavors loaded.", "flavors": flavors}),
        200,
    )


@app.route("/cart", methods=["GET"])
def get_cart():
    user_id = request.args.get("userId", type=int)

    if user_id is None:
        return (
            jsonify(
                {"success": False, "message": "userId query parameter is required."}
            ),
            400,
        )

    user = find_user_by_id(user_id)

    if not user:
        return jsonify({"success": False, "message": "User not found."}), 404

    return (
        jsonify({"success": True, "message": "Cart loaded.", "cart": user["cart"]}),
        200,
    )


@app.route("/cart", methods=["POST"])
def add_to_cart():
    data = request.get_json(silent=True)

    if not data:
        return (
            jsonify({"success": False, "message": "Invalid or missing JSON body."}),
            400,
        )

    user_id = data.get("userId")
    flavor_id = data.get("flavorId")

    if not isinstance(user_id, int):
        return jsonify({"success": False, "message": "userId must be an integer."}), 400

    if not isinstance(flavor_id, int):
        return (
            jsonify({"success": False, "message": "flavorId must be an integer."}),
            400,
        )

    user = find_user_by_id(user_id)
    if not user:
        return jsonify({"success": False, "message": "User not found."}), 404

    flavor = find_flavor_by_id(flavor_id)
    if not flavor:
        return jsonify({"success": False, "message": "Flavor not found."}), 404

    existing_item = next(
        (item for item in user["cart"] if item["flavorId"] == flavor_id), None
    )

    if existing_item:
        return (
            jsonify(
                {
                    "success": False,
                    "message": "Flavor is already in the cart. Use PUT /cart to update quantity.",
                }
            ),
            409,
        )

    new_item = build_cart_item_from_flavor(flavor)
    user["cart"].append(new_item)

    return (
        jsonify(
            {"success": True, "message": "Flavor added to cart.", "cart": user["cart"]}
        ),
        200,
    )


@app.route("/cart", methods=["PUT"])
def update_cart():
    data = request.get_json(silent=True)

    if not data:
        return (
            jsonify({"success": False, "message": "Invalid or missing JSON body."}),
            400,
        )

    user_id = data.get("userId")
    flavor_id = data.get("flavorId")
    quantity = data.get("quantity")

    if not isinstance(user_id, int):
        return jsonify({"success": False, "message": "userId must be an integer."}), 400

    if not isinstance(flavor_id, int):
        return (
            jsonify({"success": False, "message": "flavorId must be an integer."}),
            400,
        )

    if not isinstance(quantity, int) or quantity < 1:
        return (
            jsonify(
                {
                    "success": False,
                    "message": "quantity must be an integer greater than or equal to 1.",
                }
            ),
            400,
        )

    user = find_user_by_id(user_id)
    if not user:
        return jsonify({"success": False, "message": "User not found."}), 404

    item = next(
        (cart_item for cart_item in user["cart"] if cart_item["flavorId"] == flavor_id),
        None,
    )

    if not item:
        return jsonify({"success": False, "message": "Flavor is not in the cart."}), 404

    item["quantity"] = quantity

    return (
        jsonify(
            {
                "success": True,
                "message": "Cart updated successfully.",
                "cart": user["cart"],
            }
        ),
        200,
    )


@app.route("/cart", methods=["DELETE"])
def delete_cart_item():
    data = request.get_json(silent=True)

    if not data:
        return (
            jsonify({"success": False, "message": "Invalid or missing JSON body."}),
            400,
        )

    user_id = data.get("userId")
    flavor_id = data.get("flavorId")

    if not isinstance(user_id, int):
        return jsonify({"success": False, "message": "userId must be an integer."}), 400

    if not isinstance(flavor_id, int):
        return (
            jsonify({"success": False, "message": "flavorId must be an integer."}),
            400,
        )

    user = find_user_by_id(user_id)
    if not user:
        return jsonify({"success": False, "message": "User not found."}), 404

    original_length = len(user["cart"])
    user["cart"] = [item for item in user["cart"] if item["flavorId"] != flavor_id]

    if len(user["cart"]) == original_length:
        return (
            jsonify({"success": False, "message": "Flavor was not found in the cart."}),
            404,
        )

    return (
        jsonify(
            {
                "success": True,
                "message": "Flavor removed from cart.",
                "cart": user["cart"],
            }
        ),
        200,
    )


@app.route("/orders", methods=["POST"])
def place_order():
    data = request.get_json(silent=True)

    if not data:
        return (
            jsonify({"success": False, "message": "Invalid or missing JSON body."}),
            400,
        )

    user_id = data.get("userId")

    if not isinstance(user_id, int):
        return jsonify({"success": False, "message": "userId must be an integer."}), 400

    user = find_user_by_id(user_id)
    if not user:
        return jsonify({"success": False, "message": "User not found."}), 404

    if not user["cart"]:
        return jsonify({"success": False, "message": "Cart is empty."}), 400

    order_items = deepcopy(user["cart"])
    total = calculate_order_total(order_items)
    order_id = get_next_order_id(user)

    new_order = {
        "orderId": order_id,
        "items": order_items,
        "total": total,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }

    user["orders"].append(new_order)
    user["cart"] = []

    return (
        jsonify(
            {
                "success": True,
                "message": "Order placed successfully.",
                "orderId": order_id,
            }
        ),
        200,
    )


@app.route("/orders", methods=["GET"])
def get_orders():
    user_id = request.args.get("userId", type=int)

    if user_id is None:
        return (
            jsonify(
                {"success": False, "message": "userId query parameter is required."}
            ),
            400,
        )

    user = find_user_by_id(user_id)
    if not user:
        return jsonify({"success": False, "message": "User not found."}), 404

    return (
        jsonify(
            {
                "success": True,
                "message": "Order history loaded.",
                "orders": user["orders"],
            }
        ),
        200,
    )


if __name__ == "__main__":
    app.run(debug=True)
