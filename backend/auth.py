import bcrypt
from jose import jwt
from datetime import datetime, timedelta
from typing import Optional
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Secret key for JWT encoding/decoding
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Google Client ID
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

# GitHub OAuth credentials
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash."""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt."""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_google_token(token: str):
    import logging
    logger = logging.getLogger(__name__)
    
    try:
        # Try to verify as ID token
        logger.info("Attempting to verify as ID token")
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)
        logger.info(f"ID token verified successfully: {idinfo}")
        return idinfo
    except ValueError as e:
        logger.warning(f"ID token verification failed: {e}")
        # If that fails, try to verify as access token
        try:
            logger.info("Attempting to verify as access token")
            response = requests.get(
                f'https://www.googleapis.com/oauth2/v3/userinfo?access_token={token}'
            )
            logger.info(f"Access token verification response status: {response.status_code}")
            if response.status_code == 200:
                user_info = response.json()
                logger.info(f"Access token verified successfully: {user_info}")
                return user_info
            logger.error(f"Access token verification failed with status {response.status_code}: {response.text}")
            return None
        except Exception as e:
            logger.error(f"Exception during access token verification: {e}")
            return None

def verify_github_code(code: str):
    """Exchange GitHub OAuth code for access token and get user info"""
    import logging
    logger = logging.getLogger(__name__)
    
    try:
        # Exchange code for access token
        logger.info(f"Exchanging GitHub code for access token: {code[:10]}...")
        logger.info(f"Using Client ID: {GITHUB_CLIENT_ID}")
        logger.info(f"Using Client Secret: {GITHUB_CLIENT_SECRET[:5]}...")
        
        token_response = requests.post(
            'https://github.com/login/oauth/access_token',
            headers={'Accept': 'application/json'},
            data={
                'client_id': GITHUB_CLIENT_ID,
                'client_secret': GITHUB_CLIENT_SECRET,
                'code': code
            }
        )
        
        logger.info(f"Token exchange response status: {token_response.status_code}")
        logger.info(f"Token exchange response: {token_response.text}")
        
        if token_response.status_code != 200:
            logger.error(f"Failed to exchange code: {token_response.text}")
            return None
            
        token_data = token_response.json()
        
        # Check for error in response
        if 'error' in token_data:
            logger.error(f"GitHub returned error: {token_data}")
            return None
            
        access_token = token_data.get('access_token')
        
        if not access_token:
            logger.error(f"No access token in response: {token_data}")
            return None
        
        logger.info(f"Successfully got access token: {access_token[:10]}...")
        
        # Get user info
        logger.info("Fetching GitHub user info")
        user_response = requests.get(
            'https://api.github.com/user',
            headers={
                'Authorization': f'Bearer {access_token}',
                'Accept': 'application/json'
            }
        )
        
        logger.info(f"User info response status: {user_response.status_code}")
        
        if user_response.status_code != 200:
            logger.error(f"Failed to get user info: {user_response.text}")
            return None
            
        user_data = user_response.json()
        logger.info(f"Got user data: {user_data.get('login')}")
        
        # Get user email if not public
        if not user_data.get('email'):
            logger.info("Fetching GitHub user emails")
            email_response = requests.get(
                'https://api.github.com/user/emails',
                headers={
                    'Authorization': f'Bearer {access_token}',
                    'Accept': 'application/json'
                }
            )
            if email_response.status_code == 200:
                emails = email_response.json()
                logger.info(f"Got emails: {emails}")
                primary_email = next((e for e in emails if e.get('primary')), None)
                if primary_email:
                    user_data['email'] = primary_email['email']
        
        logger.info(f"GitHub user verified: {user_data.get('login')} with email: {user_data.get('email')}")
        return user_data
        
    except Exception as e:
        logger.error(f"Exception during GitHub verification: {e}", exc_info=True)
        return None
