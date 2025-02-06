# app.py

from flask import Flask
from flask_cors import CORS
from routes.conversion import conversion_bp

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

app.register_blueprint(conversion_bp, url_prefix='/api')

@app.route("/")
def hello():
    return "Hello from Flask!"

if __name__ == "__main__":
    # Run on port 5000 in debug mode
    app.run(debug=True, port=5000)
