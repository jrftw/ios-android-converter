from flask import Flask
from routes.conversion import conversion_bp

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello from Flask!"

app.register_blueprint(conversion_bp, url_prefix='/api')

if __name__ == "__main__":
    app.run(debug=True, port=5000)
