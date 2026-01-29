"""
Email Utility - Send password reset emails via SMTP
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

# Email configuration
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_EMAIL = os.getenv("SMTP_EMAIL", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")


def send_password_reset_email(to_email: str, reset_token: str) -> bool:
    """Send password reset email with token link"""
    
    if not SMTP_EMAIL or not SMTP_PASSWORD:
        print("⚠️ Email not configured. Token printed to console instead.")
        print(f"Reset link: {FRONTEND_URL}/reset-password?token={reset_token}")
        return False
    
    try:
        # Create reset link
        reset_link = f"{FRONTEND_URL}/reset-password?token={reset_token}"
        
        # Create email
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "Reset Your Versona AI Password"
        msg["From"] = f"Versona AI <{SMTP_EMAIL}>"
        msg["To"] = to_email
        
        # Plain text version
        text = f"""
Hello,

You requested to reset your password for Versona AI.

Click this link to reset your password:
{reset_link}

This link will expire in 1 hour.

If you didn't request this, please ignore this email.

- Versona AI Team
        """
        
        # HTML version
        html = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #ffffff; padding: 40px; }}
        .container {{ max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(139, 92, 246, 0.3); }}
        .logo {{ text-align: center; margin-bottom: 30px; }}
        .logo h1 {{ color: #a78bfa; margin: 0; font-size: 28px; }}
        .content {{ text-align: center; }}
        .btn {{ display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); color: white !important; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; margin: 20px 0; }}
        .footer {{ margin-top: 30px; text-align: center; color: rgba(255,255,255,0.5); font-size: 12px; }}
        p {{ color: rgba(255,255,255,0.8); line-height: 1.6; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <h1>● Versona</h1>
        </div>
        <div class="content">
            <h2 style="color: #ffffff; margin-bottom: 10px;">Reset Your Password</h2>
            <p>You requested to reset your password. Click the button below to create a new password.</p>
            <a href="{reset_link}" class="btn">Reset Password</a>
            <p style="font-size: 13px; color: rgba(255,255,255,0.5);">This link expires in 1 hour.</p>
        </div>
        <div class="footer">
            <p>If you didn't request this, please ignore this email.</p>
            <p>© 2026 Versona AI - Urdu Voice Generation</p>
        </div>
    </div>
</body>
</html>
        """
        
        msg.attach(MIMEText(text, "plain"))
        msg.attach(MIMEText(html, "html"))
        
        # Send email
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(SMTP_EMAIL, to_email, msg.as_string())
        
        print(f"✅ Password reset email sent to: {to_email}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to send email: {e}")
        # Fallback: print to console
        print(f"Reset link: {FRONTEND_URL}/reset-password?token={reset_token}")
        return False
