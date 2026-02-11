"""
Email Utility - Send password reset emails
Supports multiple methods:
1. Mailjet API (HTTP-based, works on all hosting platforms)
2. Resend API (HTTP-based, requires domain verification for non-self emails)
3. SMTP fallback (works locally but blocked on Render/Vercel)
"""

import os
import smtplib
import requests
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

# Mailjet API (recommended for production)
MAILJET_API_KEY = os.getenv("MAILJET_API_KEY", "")
MAILJET_SECRET_KEY = os.getenv("MAILJET_SECRET_KEY", "")
MAILJET_FROM_EMAIL = os.getenv("MAILJET_FROM_EMAIL", SMTP_EMAIL or "noreply@versona.ai")
MAILJET_FROM_NAME = os.getenv("MAILJET_FROM_NAME", "Versona AI")

# Resend API (alternative)
RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
RESEND_FROM_EMAIL = os.getenv("RESEND_FROM_EMAIL", "Versona AI <onboarding@resend.dev>")


def _build_html_email(reset_link: str) -> str:
    """Build the HTML email template"""
    return f"""
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
            <p>&copy; 2026 Versona AI - Urdu Voice Generation</p>
        </div>
    </div>
</body>
</html>
    """


def _build_plain_text(reset_link: str) -> str:
    """Build plain text version of the email"""
    return f"""Hello,

You requested to reset your password for Versona AI.

Click this link to reset your password:
{reset_link}

This link will expire in 1 hour.

If you didn't request this, please ignore this email.

- Versona AI Team"""


def _send_via_mailjet(to_email: str, reset_link: str) -> bool:
    """Send email using Mailjet HTTP API (works on Render, Vercel, etc.)"""
    try:
        response = requests.post(
            "https://api.mailjet.com/v3.1/send",
            auth=(MAILJET_API_KEY, MAILJET_SECRET_KEY),
            json={
                "Messages": [
                    {
                        "From": {
                            "Email": MAILJET_FROM_EMAIL,
                            "Name": MAILJET_FROM_NAME
                        },
                        "To": [
                            {
                                "Email": to_email
                            }
                        ],
                        "Subject": "Reset Your Versona AI Password",
                        "TextPart": _build_plain_text(reset_link),
                        "HTMLPart": _build_html_email(reset_link)
                    }
                ]
            },
            timeout=10
        )

        result = response.json()

        if response.status_code == 200:
            status = result.get("Messages", [{}])[0].get("Status", "")
            if status == "success":
                print(f"✅ Password reset email sent via Mailjet to: {to_email}")
                return True
            else:
                print(f"❌ Mailjet status: {status} - {result}")
                return False
        else:
            print(f"❌ Mailjet API error: {response.status_code} - {result}")
            return False

    except Exception as e:
        print(f"❌ Mailjet API failed: {e}")
        return False


def _send_via_resend(to_email: str, reset_link: str) -> bool:
    """Send email using Resend HTTP API"""
    try:
        response = requests.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {RESEND_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "from": RESEND_FROM_EMAIL,
                "to": [to_email],
                "subject": "Reset Your Versona AI Password",
                "html": _build_html_email(reset_link),
                "text": _build_plain_text(reset_link)
            },
            timeout=10
        )

        if response.status_code == 200:
            print(f"✅ Password reset email sent via Resend to: {to_email}")
            return True
        else:
            print(f"❌ Resend API error: {response.status_code} - {response.text}")
            return False

    except Exception as e:
        print(f"❌ Resend API failed: {e}")
        return False


def _send_via_smtp(to_email: str, reset_link: str) -> bool:
    """Send email using SMTP (fallback for local development)"""
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "Reset Your Versona AI Password"
        msg["From"] = f"Versona AI <{SMTP_EMAIL}>"
        msg["To"] = to_email

        msg.attach(MIMEText(_build_plain_text(reset_link), "plain"))
        msg.attach(MIMEText(_build_html_email(reset_link), "html"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(SMTP_EMAIL, to_email, msg.as_string())

        print(f"✅ Password reset email sent via SMTP to: {to_email}")
        return True

    except Exception as e:
        print(f"❌ SMTP failed: {e}")
        return False


def send_password_reset_email(to_email: str, reset_token: str) -> bool:
    """
    Send password reset email.
    Priority: Mailjet → Resend → SMTP → Console fallback
    """
    reset_link = f"{FRONTEND_URL}/reset-password?token={reset_token}"

    # Method 1: Try Mailjet first (works on all platforms, no domain needed)
    if MAILJET_API_KEY and MAILJET_SECRET_KEY:
        success = _send_via_mailjet(to_email, reset_link)
        if success:
            return True
        print("⚠️ Mailjet failed, trying next method...")

    # Method 2: Try Resend (needs domain verification for non-self emails)
    if RESEND_API_KEY:
        success = _send_via_resend(to_email, reset_link)
        if success:
            return True
        print("⚠️ Resend failed, trying SMTP fallback...")

    # Method 3: Try SMTP (works locally, blocked on some hosts)
    if SMTP_EMAIL and SMTP_PASSWORD:
        success = _send_via_smtp(to_email, reset_link)
        if success:
            return True

    # Method 4: Console fallback
    print("⚠️ All email methods failed. Token printed to console.")
    print(f"Reset link: {reset_link}")
    return False
