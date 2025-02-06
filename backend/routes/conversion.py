# routes/conversion.py

from flask import Blueprint, request, jsonify
from services.converter import convert_code

conversion_bp = Blueprint('conversion_bp', __name__)

@conversion_bp.route('/convert', methods=['POST'])
def convert_route():
    """
    Handles both:
      1) JSON payload:
         { "sourceCode": "...", "sourcePlatform": "ios" }
      2) Multipart form-data:
         file=<.swift/.kt file>, sourcePlatform=ios/android
    """
    file = request.files.get('file')
    if file:
        source_code = file.read().decode('utf-8', errors='replace')
        source_platform = request.form.get('sourcePlatform', 'ios')
    else:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON or file upload provided"}), 400

        source_code = data.get("sourceCode")
        if not source_code:
            return jsonify({"error": "No source code provided"}), 400

        source_platform = data.get("sourcePlatform", 'ios')

    converted = convert_code(source_code, source_platform)
    return jsonify({"convertedCode": converted})


@conversion_bp.route('/convertProject', methods=['POST'])
def convert_project_route():
    """
    Placeholder for entire-project .zip upload logic if needed.
    Currently returns a stub response.
    """
    return jsonify({"error": "Entire project conversion not yet implemented"}), 501
