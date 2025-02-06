# services/converter.py

# MARK: IMPORTS
import logging
from dotenv import load_dotenv
import openai
import os

# MARK: SETUP LOGGING
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s"
)
logger = logging.getLogger(__name__)

# MARK: LOAD ENVIRONMENT
load_dotenv()  # Reads .env in backend/
actual_key = os.getenv("OPENAI_API_KEY")

# MARK: DEBUG PRINT
logger.info("DEBUG: Attempting to load OPENAI_API_KEY from environment.")
logger.info(f"DEBUG: Received key starts with: {str(actual_key)[:10]}...")

if not actual_key:
    logger.error("OPENAI_API_KEY is not set. Please configure it in .env.")
else:
    openai.api_key = actual_key
    logger.info("OpenAI API key loaded successfully.")

# MARK: RULE-BASED TRANSFORMS
def basic_transform(source_code: str, source_platform: str) -> str:
    logger.debug("Applying basic_transform for %s", source_platform)
    # Simple placeholders to give GPT a hint that iOS -> Android or vice versa
    if source_platform.lower() == "ios":
        source_code = source_code.replace("UIKit", "AndroidXPlaceholder")
        source_code = source_code.replace("let ", "var ")
    else:
        source_code = source_code.replace("fun ", "func ")
        source_code = source_code.replace("val ", "let ")
    return source_code

# MARK: ADVANCED PROMPT BUILDER
def build_prompt(source_platform: str, preprocessed_code: str) -> str:
    """
    Build a more explicit prompt so GPT knows exactly how to convert 
    iOS (Swift) to Android (Kotlin) or vice versa.
    """
    if source_platform.lower() == "ios":
        return (
            "You are an expert mobile developer. Convert the following Swift iOS code "
            "into fully functional Kotlin Android code. Replace any iOS frameworks and APIs "
            "with their Android equivalents (e.g., AndroidX, Jetpack, or standard Android libraries). "
            "Ensure the resulting code can compile and run in an Android environment.\n\n"
            f"{preprocessed_code}"
        )
    else:
        return (
            "You are an expert mobile developer. Convert the following Kotlin Android code "
            "into fully functional Swift iOS code. Replace any Android frameworks and APIs "
            "with their iOS equivalents (UIKit, SwiftUI, etc.). "
            "Ensure the resulting code can compile and run in an iOS environment.\n\n"
            f"{preprocessed_code}"
        )

# MARK: MAIN CONVERSION FUNCTION
def convert_code(source_code: str, source_platform: str) -> str:
    if not openai.api_key:
        logger.error("No OpenAI API key found in code.")
        return "Error: OpenAI API key is missing."

    # Step 1: Rule-based transform
    preprocessed_code = basic_transform(source_code, source_platform)

    # Step 2: Build advanced prompt
    prompt = build_prompt(source_platform, preprocessed_code)

    # Step 3: Call OpenAI
    try:
        logger.info("Sending single-file conversion request to OpenAI.")
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.0
        )
        result = response["choices"][0]["message"]["content"]
        logger.info("Received single-file conversion response from OpenAI.")
        return result
    except Exception as e:
        error_msg = f"Error calling OpenAI: {e}"
        logger.error(error_msg)
        return error_msg
