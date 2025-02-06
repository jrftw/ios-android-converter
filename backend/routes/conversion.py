from flask import Blueprint, request, jsonify
from services.converter import convert_code

conversion_bp = Blueprint('conversion_bp', __name__)

@conversion_bp.route('/convert', methods=['POST'])
def convert_route():
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    source_platform = request.form.get('sourcePlatform', 'ios')
    code_content = file.read().decode("utf-8")

    converted = convert_code(code_content, source_platform)
    return jsonify({"convertedCode": converted})
