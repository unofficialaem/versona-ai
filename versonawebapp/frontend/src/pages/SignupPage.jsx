import React, { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import ParticleBackground from "../components/ParticleBackground";
import { AUTH_API } from "../config/api";

/** Clean, visual eye icon (inline SVG) */
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
        d="M2.1 3.51 3.51 2.1 21.9 20.49 20.49 21.9l-3.2-3.2A11.55 11.55 0 0 1 12 20C5 20 2 13 2 13a18.31 18.31 0 0 1 4.2-5.76L2.1 3.51Zm6.01 6.01A4.96 4.96 0 0 0 7 12a5 5 0 0 0 7.73 4.18l-1.5-1.5A2.5 2.5 0 0 1 9.32 10.8l-1.21-1.28ZM12 6c1.46 0 2.8.31 4 .78l-1.72 1.72A5 5 0 0 0 8.5 9.05L7.2 7.75A11.57 11.57 0 0 1 12 6Zm10 7s-.77 1.79-2.5 3.62l-3.02-3.02A4.93 4.93 0 0 0 17 12c0-.42-.05-.82-.15-1.2l1.66 1.66c.82-1.02 1.25-1.86 1.25-1.86S17 6 12 6h-.15l1.72 1.72C17.8 8.69 22 13 22 13Z"
      />
    </svg>
  );
}

/** Minimal "!" indicator (no emoji / no triangle) */
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

const inputBase =
  "w-full rounded-2xl bg-white/5 px-4 py-[9px] text-[14px] text-white placeholder:text-white/35 " +
  "border border-white/10 outline-none transition " +
  "focus:bg-white/5 focus:border-iris-500/60 focus:ring-2 focus:ring-iris-500/15";

const helperAnim = {
  initial: { opacity: 0, y: -4 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
};

export default function SignupPage() {
  const navigate = useNavigate();

  // Note: Changed "name" to "username" to match backend serializer
  const [form, setForm] = useState({
    username: "",
    Email: "", // Capital E to match backend
    password: "",
    confirmPassword: "",
  });

  // ✅ Only show errors after clicking Create
  const [submittedOnce, setSubmittedOnce] = useState(false);
  // ✅ Server error message
  const [serverError, setServerError] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Premium cursor glow hover for primary button
  const btnRef = useRef(null);
  const [btnXY, setBtnXY] = useState({ x: 50, y: 50 });

  const onMouseMoveButton = (e) => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setBtnXY({ x, y });
  };

  const onChange = (e) => {
    setForm((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
    // Clear server error when user starts typing
    if (serverError) setServerError("");
  };

  // ✅ PASSWORD RULES: uppercase + lowercase + number + special + 8+
  const passwordRules = useMemo(() => {
    const p = form.password || "";
    return {
      min: p.length >= 8,
      upper: /[A-Z]/.test(p),
      lower: /[a-z]/.test(p),
      number: /[0-9]/.test(p),
      special: /[^A-Za-z0-9]/.test(p),
    };
  }, [form.password]);

  const passwordStrong = useMemo(() => {
    return (
      passwordRules.min &&
      passwordRules.upper &&
      passwordRules.lower &&
      passwordRules.number &&
      passwordRules.special
    );
  }, [passwordRules]);

  // ✅ One-line hint ONLY when not satisfied
  const passwordHint = useMemo(() => {
    const p = form.password || "";
    if (!p) return "";
    const missing = [];
    if (!passwordRules.min) missing.push("8+ chars");
    if (!passwordRules.upper) missing.push("uppercase");
    if (!passwordRules.lower) missing.push("lowercase");
    if (!passwordRules.number) missing.push("number");
    if (!passwordRules.special) missing.push("special");
    if (missing.length === 0) return "";
    return `Add: ${missing.join(", ")}.`;
  }, [form.password, passwordRules]);

  // ✅ Validation (display only after submit)
  const errors = useMemo(() => {
    const e = {};

    // username required
    if (!form.username.trim()) e.username = "Username is required";

    // email required + format
    if (!form.Email.trim()) e.Email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.Email)) e.Email = "Email format is invalid";

    // password required + strength
    if (!form.password) e.password = "Password is required";
    else if (!passwordStrong) e.password = "Password is too weak";

    // confirm required + match
    if (!form.confirmPassword) e.confirmPassword = "Confirm password is required";
    else if (form.confirmPassword !== form.password) e.confirmPassword = "Passwords do not match";

    return e;
  }, [form, passwordStrong]);

  const canSubmit = Object.keys(errors).length === 0;
  const showErrors = submittedOnce;

  const inputWithError = (hasErr) =>
    [
      inputBase,
      hasErr ? "border-red-400/60 ring-2 ring-red-400/15 pr-12" : "",
    ].join(" ");

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmittedOnce(true);
    setServerError("");

    if (!canSubmit) return;

    try {
      setSubmitting(true);

      // Prepare data for backend (matching serializer fields)
      const signupData = {
        username: form.username,
        Email: form.Email, // Capital E
        password: form.password,
      };

      console.log("Signup payload:", signupData);

      // API call to your backend
      const response = await fetch(AUTH_API.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors from backend
        const errorMessages = [];

        // Check for field-specific errors
        if (data.username) {
          if (Array.isArray(data.username)) {
            errorMessages.push(`Username: ${data.username.join(', ')}`);
          } else {
            errorMessages.push(`Username: ${data.username}`);
          }
        }

        if (data.Email) {
          if (Array.isArray(data.Email)) {
            errorMessages.push(`Email: ${data.Email.join(', ')}`);
          } else {
            errorMessages.push(`Email: ${data.Email}`);
          }
        }

        if (data.password) {
          if (Array.isArray(data.password)) {
            errorMessages.push(`Password: ${data.password.join(', ')}`);
          } else {
            errorMessages.push(`Password: ${data.password}`);
          }
        }

        // If no specific field errors, check for generic error
        if (errorMessages.length === 0 && data.error) {
          errorMessages.push(data.error);
        } else if (errorMessages.length === 0) {
          errorMessages.push('Registration failed. Please try again.');
        }

        throw new Error(errorMessages.join(' '));
      }

      // ✅ Success - go to login page
      navigate("/login", {
        state: {
          successMessage: "Account created successfully! Please sign in."
        }
      });

    } catch (error) {
      setServerError(error.message || "An error occurred during registration");
      console.error("Signup error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const onGoogleContinue = () => {
    console.log("Continue with Google");
  };

  return (
    <div className="relative w-screen h-[100dvh] bg-jet-black overflow-hidden">
      <ParticleBackground />

      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-iris-600/14 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-44 right-[-140px] h-[460px] w-[460px] rounded-full bg-iris-700/10 blur-3xl" />

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
                  <p className="text-xs text-white/70">Versona</p>
                </div>

                <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Create your account
                </h1>
              </div>

              {/* Google */}
              <motion.button
                type="button"
                onClick={onGoogleContinue}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.985 }}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-[9px] text-sm text-white/85 hover:bg-white/7 transition"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.655 32.659 29.218 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.043 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z" />
                    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 16.108 19.003 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.043 6.053 29.268 4 24 4c-7.682 0-14.344 4.337-17.694 10.691z" />
                    <path fill="#4CAF50" d="M24 44c5.115 0 9.805-1.963 13.333-5.155l-6.148-5.206C29.218 36 26.715 36.8 24 36c-5.197 0-9.62-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.241-2.231 4.149-4.118 5.639l.003-.002 6.148 5.206C36.889 40.205 44 35 44 24c0-1.341-.138-2.651-.389-3.917z" />
                  </svg>
                  Continue with Google
                </span>
              </motion.button>

              <div className="my-3 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-white/40">or</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              {/* ✅ Server error banner */}
              <AnimatePresence>
                {serverError && (
                  <motion.div
                    variants={helperAnim}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="mb-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-[13px] text-red-200"
                    role="alert"
                  >
                    {serverError}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* errors only after submit click */}
              <form onSubmit={onSubmit} className="space-y-1.5">
                {/* USERNAME (changed from name) */}
                <div>
                  <label className="sr-only" htmlFor="username">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      id="username"
                      className={inputWithError(showErrors && !!errors.username)}
                      name="username"
                      value={form.username}
                      onChange={onChange}
                      placeholder="Username"
                      autoComplete="username"
                    />
                    {showErrors && errors.username && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        <BangIcon />
                      </span>
                    )}
                  </div>
                  <div className="min-h-[14px]">
                    {showErrors && errors.username && (
                      <p className="mt-1 text-xs text-red-400/90">{errors.username}</p>
                    )}
                  </div>
                </div>

                {/* EMAIL (capital E to match backend) */}
                <div>
                  <label className="sr-only" htmlFor="Email">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="Email"
                      className={inputWithError(showErrors && !!errors.Email)}
                      type="email"
                      name="Email" // Capital E to match backend
                      value={form.Email}
                      onChange={onChange}
                      placeholder="Email address"
                      autoComplete="email"
                    />
                    {showErrors && errors.Email && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        <BangIcon />
                      </span>
                    )}
                  </div>
                  <div className="min-h-[14px]">
                    {showErrors && errors.Email && (
                      <p className="mt-1 text-xs text-red-400/90">{errors.Email}</p>
                    )}
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="sr-only" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      className={[inputWithError(showErrors && !!errors.password), "pr-12"].join(" ")}
                      type={showPass ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={onChange}
                      placeholder="Password"
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-white/70 hover:text-white hover:bg-white/5 transition"
                      aria-label={showPass ? "Hide password" : "Show password"}
                    >
                      <EyeIcon open={showPass} />
                    </button>

                    {showErrors && errors.password && (
                      <span className="absolute right-11 top-1/2 -translate-y-1/2">
                        <BangIcon />
                      </span>
                    )}
                  </div>

                  <div className="min-h-[14px]">
                    {showErrors && errors.password && (
                      <p className="mt-1 text-xs text-red-400/90">{errors.password}</p>
                    )}
                  </div>

                  <AnimatePresence>
                    {/* show hint if user typed password OR after submit click */}
                    {(form.password.length > 0 || submittedOnce) && passwordHint && (
                      <motion.p
                        variants={helperAnim}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="mt-1 text-[12px] text-white/55"
                      >
                        {passwordHint}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label className="sr-only" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      className={[inputWithError(showErrors && !!errors.confirmPassword), "pr-12"].join(" ")}
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={onChange}
                      placeholder="Confirm password"
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-white/70 hover:text-white hover:bg-white/5 transition"
                      aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                    >
                      <EyeIcon open={showConfirm} />
                    </button>

                    {showErrors && errors.confirmPassword && (
                      <span className="absolute right-11 top-1/2 -translate-y-1/2">
                        <BangIcon />
                      </span>
                    )}
                  </div>

                  <div className="min-h-[14px]">
                    {showErrors && errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-400/90">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* CREATE */}
                <motion.button
                  ref={btnRef}
                  onMouseMove={onMouseMoveButton}
                  type="submit"
                  disabled={!canSubmit || submitting}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.985 }}
                  className={[
                    "relative mt-1 w-full overflow-hidden rounded-2xl px-4 py-[11px] font-semibold text-white",
                    "bg-gradient-to-r from-iris-700 via-iris-600 to-iris-500",
                    "transition duration-300",
                    "shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_22px_70px_rgba(139,92,246,0.22)]",
                    "hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_28px_90px_rgba(34,211,238,0.16)]",
                    "disabled:opacity-60 disabled:cursor-not-allowed",
                  ].join(" ")}
                >
                  <span
                    className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200"
                    style={{
                      background: `radial-gradient(600px circle at ${btnXY.x}% ${btnXY.y}%, rgba(34,211,238,0.18), transparent 44%)`,
                    }}
                  />
                  <span className="relative">
                    {submitting ? "Creating account..." : "Create account"}
                  </span>
                </motion.button>

                <p className="pt-1.5 text-center text-sm text-white/60">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-iris-400 hover:text-iris-300 underline-offset-4 hover:underline transition"
                  >
                    Sign in
                  </Link>
                </p>

                <p className="text-center text-[11px] text-white/35">
                  By continuing you agree to Terms & Privacy Policy.
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}