import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence here
import ParticleBackground from "../components/ParticleBackground";
import toast, { Toaster } from 'react-hot-toast';

// API base URL
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// API fetch helper for non-auth requests
const apiFetchPublic = async (endpoint, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options
  };

  if (options.body && typeof options.body !== 'string') {
    defaultOptions.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, defaultOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return { 
      success: false, 
      error: error.message || 'Something went wrong' 
    };
  }
};

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-90">
      <path
        fill="currentColor"
        d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
      />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-90">
      <path
        fill="currentColor"
        d="M2.1 3.51 3.51 2.1 21.9 20.49 20.49 21.9l-3.2-3.2A11.55 11.55 0 0 1 12 20C5 20 2 13 2 13a18.31 18.31 0 0 1 4.2-5.76L2.1 3.51Zm6.01 6.01A4.96 4.96 0 0 0 7 12a5 5 0 0 0 7.73 4.18l-1.5-1.5A2.5 2.5 0 0 1 9.32 10.8l-1.21-1.28ZM12 6c1.46 0 2.8.31 4 .78l-1.72 1.72A5 5 0 0 0 8.5 9.05L7.2 7.75A11.57 11.57 0 0 1 12 6Zm10 7s-.77 1.79-2.5 3.62l-3.02-3.02A4.93 4.96 0 0 0 17 12c0-.42-.05-.82-.15-1.2l1.66 1.66c.82-1.02 1.25-1.86 1.25-1.86S17 6 12 6h-.15l1.72 1.72C17.8 8.69 22 13 22 13Z"
      />
    </svg>
  );
}

function BangIcon() {
  return (
    <span
      className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500/15 text-red-300 text-[12px] font-extrabold leading-none"
      aria-hidden="true"
      title="Fix this field"
    >
      !
    </span>
  );
}

function CheckIcon() {
  return (
    <span
      className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-500/15 text-green-300 text-[12px] font-extrabold leading-none"
      aria-hidden="true"
    >
      ✓
    </span>
  );
}

const inputBase =
  "w-full rounded-2xl bg-white/5 px-4 py-[9px] text-[14px] text-white placeholder:text-white/35 " +
  "border border-white/10 outline-none transition " +
  "focus:bg-white/5 focus:border-iris-500/60 focus:ring-2 focus:ring-iris-500/15";

const helperAnim = {
  initial: { opacity: 0, y: -4 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
};

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ 
    new_password: "", 
    confirm_password: "" 
  });
  const [submittedOnce, setSubmittedOnce] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  // Check if token is present in URL
  useEffect(() => {
    if (!token) {
      setValidatingToken(false);
      setTokenValid(false);
      toast.error("Invalid reset link");
      return;
    }
    
    // We could validate the token here by making an API call
    // For now, just assume it's valid if it exists
    setValidatingToken(false);
    setTokenValid(true);
  }, [token]);

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (authError) setAuthError("");
  };

  const errors = React.useMemo(() => {
    const e = {};
    
    if (!form.new_password) {
      e.new_password = "New password is required";
    } else if (form.new_password.length < 8) {
      e.new_password = "Password must be at least 8 characters";
    }
    
    if (!form.confirm_password) {
      e.confirm_password = "Please confirm your password";
    } else if (form.new_password !== form.confirm_password) {
      e.confirm_password = "Passwords do not match";
    }

    return e;
  }, [form]);

  const canSubmit = Object.keys(errors).length === 0;
  const showErrors = submittedOnce;

  const inputWithError = (hasErr) =>
    [inputBase, hasErr ? "border-red-400/60 ring-2 ring-red-400/15 pr-12" : ""].join(" ");

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmittedOnce(true);
    setAuthError("");

    if (!canSubmit) return;
    if (!token) {
      toast.error("Invalid reset link");
      return;
    }

    try {
      setSubmitting(true);

      // API call to reset password
      const result = await apiFetchPublic(`/reset_password/${token}/`, {
        method: 'POST',
        body: {
          new_password: form.new_password,
          confirm_password: form.confirm_password
        }
      });

      if (result.success) {
        setSuccess(true);
        toast.success("Password reset successfully!");
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        throw new Error(result.error || 'Password reset failed');
      }
      
    } catch (error) {
      setAuthError(error.message || "An error occurred while resetting password");
      toast.error(error.message || "An error occurred while resetting password");
      console.error("Reset error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const onBackToLogin = () => {
    navigate("/login");
  };

  if (validatingToken) {
    return (
      <div className="relative w-screen h-[100dvh] bg-jet-black overflow-hidden">
        <ParticleBackground />
        <div className="relative z-10 flex h-full w-full items-center justify-center px-4">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-iris-500 border-t-transparent mx-auto mb-4" />
            <p className="text-white/70">Validating reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="relative w-screen h-[100dvh] bg-jet-black overflow-hidden">
        <ParticleBackground />
        <div className="relative z-10 flex h-full w-full items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
              <span className="text-2xl text-red-400">!</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Invalid Reset Link</h2>
            <p className="text-white/60 mb-6">This password reset link is invalid or has expired.</p>
            <button
              onClick={onBackToLogin}
              className="rounded-lg bg-iris-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-iris-500 transition"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="relative w-screen h-[100dvh] bg-jet-black overflow-hidden">
        <ParticleBackground />
        <div className="relative z-10 flex h-full w-full items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20">
              <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Password Reset Successful!</h2>
            <p className="text-white/60 mb-6">Your password has been successfully reset. You will be redirected to the login page shortly.</p>
            <button
              onClick={onBackToLogin}
              className="rounded-lg bg-iris-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-iris-500 transition"
            >
              Go to Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-[100dvh] bg-jet-black overflow-hidden">
      <ParticleBackground />

      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-iris-600/14 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-44 right-[-140px] h-[460px] w-[460px] rounded-full bg-iris-700/10 blur-3xl" />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#8b5cf6',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <div className="relative z-10 flex h-full w-full items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-[520px]"
          style={{ maxHeight: "95vh" }}
        >
          <div className="relative rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 rounded-[30px] p-[1px]">
              <div className="h-full w-full rounded-[29px] bg-gradient-to-br from-iris-500/35 via-white/0 to-iris-300/10" />
            </div>

            <div className="relative p-5 sm:p-6">
              <div className="text-center">
                <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  <span className="h-2 w-2 rounded-full bg-iris-500 shadow-[0_0_18px_rgba(139,92,246,.8)]" />
                  <p className="text-xs text-white/70">Reset Password</p>
                </div>

                <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Create New Password
                </h1>
                <p className="mt-1 text-sm text-white/55">
                  Enter your new password below
                </p>
              </div>

              <motion.div
                variants={helperAnim}
                initial="initial"
                animate="animate"
                className="mt-4 mb-2 rounded-2xl border border-iris-500/20 bg-iris-500/5 px-3 py-2 text-[13px] text-iris-200"
                role="alert"
              >
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Your password must be at least 8 characters long</span>
                </div>
              </motion.div>

              <AnimatePresence>
                {authError && (
                  <motion.div
                    variants={helperAnim}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="mb-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-[13px] text-red-200"
                    role="alert"
                  >
                    {authError}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={onSubmit} className="space-y-2">
                <div>
                  <label className="sr-only" htmlFor="new_password">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="new_password"
                      className={inputWithError(showErrors && !!errors.new_password)}
                      type={showNewPass ? "text" : "password"}
                      name="new_password"
                      value={form.new_password}
                      onChange={onChange}
                      placeholder="New password"
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowNewPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-white/70 hover:text-white hover:bg-white/5 transition"
                      aria-label={showNewPass ? "Hide password" : "Show password"}
                    >
                      <EyeIcon open={showNewPass} />
                    </button>

                    {showErrors && errors.new_password && (
                      <span className="absolute right-11 top-1/2 -translate-y-1/2">
                        <BangIcon />
                      </span>
                    )}
                    
                    {showErrors && !errors.new_password && form.new_password && (
                      <span className="absolute right-11 top-1/2 -translate-y-1/2">
                        <CheckIcon />
                      </span>
                    )}
                  </div>
                  <div className="min-h-[14px]">
                    {showErrors && errors.new_password && (
                      <p className="mt-1 text-xs text-red-400/90">{errors.new_password}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="sr-only" htmlFor="confirm_password">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm_password"
                      className={inputWithError(showErrors && !!errors.confirm_password)}
                      type={showConfirmPass ? "text" : "password"}
                      name="confirm_password"
                      value={form.confirm_password}
                      onChange={onChange}
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-white/70 hover:text-white hover:bg-white/5 transition"
                      aria-label={showConfirmPass ? "Hide password" : "Show password"}
                    >
                      <EyeIcon open={showConfirmPass} />
                    </button>

                    {showErrors && errors.confirm_password && (
                      <span className="absolute right-11 top-1/2 -translate-y-1/2">
                        <BangIcon />
                      </span>
                    )}
                    
                    {showErrors && !errors.confirm_password && form.confirm_password && form.new_password === form.confirm_password && (
                      <span className="absolute right-11 top-1/2 -translate-y-1/2">
                        <CheckIcon />
                      </span>
                    )}
                  </div>
                  <div className="min-h-[14px]">
                    {showErrors && errors.confirm_password && (
                      <p className="mt-1 text-xs text-red-400/90">{errors.confirm_password}</p>
                    )}
                    {showErrors && !errors.confirm_password && form.confirm_password && form.new_password === form.confirm_password && (
                      <p className="mt-1 text-xs text-green-400/90">Passwords match</p>
                    )}
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.985 }}
                  className={[
                    "relative mt-3 w-full overflow-hidden rounded-2xl px-4 py-[10px] font-semibold text-white",
                    "bg-gradient-to-r from-iris-700 via-iris-600 to-iris-500",
                    "transition duration-300",
                    "shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_22px_70px_rgba(139,92,246,0.22)]",
                    "hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_28px_90px_rgba(34,211,238,0.16)]",
                    "disabled:opacity-60 disabled:cursor-not-allowed",
                  ].join(" ")}
                >
                  <span className="relative">
                    {submitting ? "Resetting Password..." : "Reset Password"}
                  </span>
                </motion.button>

                <div className="pt-1.5 text-center text-sm text-white/60">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="text-iris-400 hover:text-iris-300 underline-offset-4 hover:underline transition"
                  >
                    Back to Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}