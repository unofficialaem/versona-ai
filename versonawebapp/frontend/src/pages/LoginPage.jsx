// import React, { useMemo, useRef, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import ParticleBackground from "../components/ParticleBackground";

// function EyeIcon({ open }) {
//   return open ? (
//     <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-90">
//       <path
//         fill="currentColor"
//         d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
//       />
//     </svg>
//   ) : (
//     <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-90">
//       <path
//         fill="currentColor"
//         d="M2.1 3.51 3.51 2.1 21.9 20.49 20.49 21.9l-3.2-3.2A11.55 11.55 0 0 1 12 20C5 20 2 13 2 13a18.31 18.31 0 0 1 4.2-5.76L2.1 3.51Zm6.01 6.01A4.96 4.96 0 0 0 7 12a5 5 0 0 0 7.73 4.18l-1.5-1.5A2.5 2.5 0 0 1 9.32 10.8l-1.21-1.28ZM12 6c1.46 0 2.8.31 4 .78l-1.72 1.72A5 5 0 0 0 8.5 9.05L7.2 7.75A11.57 11.57 0 0 1 12 6Zm10 7s-.77 1.79-2.5 3.62l-3.02-3.02A4.93 4.96 0 0 0 17 12c0-.42-.05-.82-.15-1.2l1.66 1.66c.82-1.02 1.25-1.86 1.25-1.86S17 6 12 6h-.15l1.72 1.72C17.8 8.69 22 13 22 13Z"
//       />
//     </svg>
//   );
// }

// function BangIcon() {
//   return (
//     <span
//       className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500/15 text-red-300 text-[12px] font-extrabold leading-none"
//       aria-hidden="true"
//       title="Fix this field"
//     >
//       !
//     </span>
//   );
// }

// const inputBase =
//   "w-full rounded-2xl bg-white/5 px-4 py-[9px] text-[14px] text-white placeholder:text-white/35 " +
//   "border border-white/10 outline-none transition " +
//   "focus:bg-white/5 focus:border-iris-500/60 focus:ring-2 focus:ring-iris-500/15";

// const helperAnim = {
//   initial: { opacity: 0, y: -4 },
//   animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
//   exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
// };

// export default function LoginPage() {
//   const [form, setForm] = useState({ Email: "", password: "" });
//   const [submittedOnce, setSubmittedOnce] = useState(false);
//   const [authError, setAuthError] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [showReset, setShowReset] = useState(false);


//   const btnRef = useRef(null);
//   const [btnXY, setBtnXY] = useState({ x: 50, y: 50 });
//   const navigate = useNavigate();

//   const onMouseMoveButton = (e) => {
//     const r = btnRef.current?.getBoundingClientRect();
//     if (!r) return;
//     const x = ((e.clientX - r.left) / r.width) * 100;
//     const y = ((e.clientY - r.top) / r.height) * 100;
//     setBtnXY({ x, y });
//   };

//   const onChange = (e) => {
//     setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
//     if (authError) setAuthError("");
//   };

//   const errors = useMemo(() => {
//     const e = {};
//     if (!form.Email.trim()) e.Email = "Email is required";
//     else if (!/^\S+@\S+\.\S+$/.test(form.Email)) e.Email = "Email format is invalid";

//     if (!form.password) e.password = "Password is required";

//     return e;
//   }, [form]);

//   const canSubmit = Object.keys(errors).length === 0;
//   const showErrors = submittedOnce;

//   const inputWithError = (hasErr) =>
//     [inputBase, hasErr ? "border-red-400/60 ring-2 ring-red-400/15 pr-12" : ""].join(" ");

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setSubmittedOnce(true);
//     setAuthError("");

//     if (!canSubmit) return;

//     try {
//       setSubmitting(true);

//       // API call to your backend
//       const response = await fetch('http://127.0.0.1:8000/api/login/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(form),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         // Handle errors from backend
//         throw new Error(data.error || 'Login failed');
//       }

//       // Store token and user info in localStorage
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('userInfo', JSON.stringify(data.user_info));

//       // Navigate to dashboard
//       navigate("/dashboard");

//     } catch (error) {
//       setAuthError(error.message || "An error occurred during login");
//       console.error("Login error:", error);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const onGoogleContinue = () => {
//     console.log("Continue with Google");
//   };

//   return (
//     <div className="relative w-screen h-[100dvh] bg-jet-black overflow-hidden">
//       <ParticleBackground />

//       <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-iris-600/14 blur-3xl" />
//       <div className="pointer-events-none absolute -bottom-44 right-[-140px] h-[460px] w-[460px] rounded-full bg-iris-700/10 blur-3xl" />

//       <div className="relative z-10 flex h-full w-full items-center justify-center px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 14, scale: 0.985 }}
//           animate={{ opacity: 1, y: 0, scale: 1 }}
//           transition={{ duration: 0.45, ease: "easeOut" }}
//           className="w-full max-w-[520px]"
//           style={{ maxHeight: "95vh" }}
//         >
//           <div className="relative rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-xl">
//             <div className="pointer-events-none absolute inset-0 rounded-[30px] p-[1px]">
//               <div className="h-full w-full rounded-[29px] bg-gradient-to-br from-iris-500/35 via-white/0 to-iris-300/10" />
//             </div>

//             <div className="relative p-5 sm:p-6">
//               <div className="text-center">
//                 <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
//                   <span className="h-2 w-2 rounded-full bg-iris-500 shadow-[0_0_18px_rgba(139,92,246,.8)]" />
//                   <p className="text-xs text-white/70">Versona</p>
//                 </div>

//                 <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
//                   Sign in
//                 </h1>
//               </div>

//               <motion.button
//                 type="button"
//                 onClick={onGoogleContinue}
//                 whileHover={{ y: -1 }}
//                 whileTap={{ scale: 0.985 }}
//                 className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-[9px] text-sm text-white/85 hover:bg-white/7 transition"
//               >
//                 <span className="flex items-center justify-center gap-2">
//                   <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
//                     <path
//                       fill="#FFC107"
//                       d="M43.611 20.083H42V20H24v8h11.303C33.655 32.659 29.218 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.043 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"
//                     />
//                     <path
//                       fill="#FF3D00"
//                       d="M6.306 14.691l6.571 4.819C14.655 16.108 19.003 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.043 6.053 29.268 4 24 4c-7.682 0-14.344 4.337-17.694 10.691z"
//                     />
//                     <path
//                       fill="#4CAF50"
//                       d="M24 44c5.115 0 9.805-1.963 13.333-5.155l-6.148-5.206C29.218 36 26.715 36.8 24 36c-5.197 0-9.62-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
//                     />
//                     <path
//                       fill="#1976D2"
//                       d="M43.611 20.083H42V20H24v8h11.303c-.792 2.241-2.231 4.149-4.118 5.639l.003-.002 6.148 5.206C36.889 40.205 44 35 44 24c0-1.341-.138-2.651-.389-3.917z"
//                     />
//                   </svg>
//                   Continue with Google
//                 </span>
//               </motion.button>

//               <div className="my-3 flex items-center gap-3">
//                 <div className="h-px flex-1 bg-white/10" />
//                 <span className="text-xs text-white/40">or</span>
//                 <div className="h-px flex-1 bg-white/10" />
//               </div>

//               <AnimatePresence>
//                 {authError && (
//                   <motion.div
//                     variants={helperAnim}
//                     initial="initial"
//                     animate="animate"
//                     exit="exit"
//                     className="mb-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-[13px] text-red-200"
//                     role="alert"
//                   >
//                     {authError}
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//               <form onSubmit={onSubmit} className="space-y-2">
//                 <div>
//                   <label className="sr-only" htmlFor="Email">
//                     Email
//                   </label>
//                   <div className="relative">
//                     <input
//                       id="Email"
//                       className={inputWithError(showErrors && !!errors.Email)}
//                       type="email"
//                       name="Email"
//                       value={form.Email}
//                       onChange={onChange}
//                       placeholder="Email address"
//                       autoComplete="email"
//                     />
//                     {showErrors && errors.Email && (
//                       <span className="absolute right-3 top-1/2 -translate-y-1/2">
//                         <BangIcon />
//                       </span>
//                     )}
//                   </div>
//                   <div className="min-h-[14px]">
//                     {showErrors && errors.Email && (
//                       <p className="mt-1 text-xs text-red-400/90">{errors.Email}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="sr-only" htmlFor="password">
//                     Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       id="password"
//                       className={[
//                         inputWithError(showErrors && !!errors.password),
//                         "pr-12",
//                       ].join(" ")}
//                       type={showPass ? "text" : "password"}
//                       name="password"
//                       value={form.password}
//                       onChange={onChange}
//                       placeholder="Password"
//                       autoComplete="current-password"
//                     />

//                     <button
//                       type="button"
//                       onClick={() => setShowPass((v) => !v)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-white/70 hover:text-white hover:bg-white/5 transition"
//                       aria-label={showPass ? "Hide password" : "Show password"}
//                     >
//                       <EyeIcon open={showPass} />
//                     </button>

//                     {showErrors && errors.password && (
//                       <span className="absolute right-11 top-1/2 -translate-y-1/2">
//                         <BangIcon />
//                       </span>
//                     )}
//                   </div>

//                   <div className="min-h-[14px]">
//                     {showErrors && errors.password && (
//                       <p className="mt-1 text-xs text-red-400/90">{errors.password}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex justify-end pt-0.5">
//                   <button
//                     type="button"
//                     className="text-xs text-iris-400 hover:text-iris-300 hover:underline underline-offset-4 transition"
//                     onClick={() => setShowReset(true)}
//                   >
//                   Forgot password?
//                   </button>

//                 </div>

//                 <motion.button
//                   ref={btnRef}
//                   onMouseMove={onMouseMoveButton}
//                   type="submit"
//                   disabled={!canSubmit || submitting}
//                   whileHover={{ y: -1 }}
//                   whileTap={{ scale: 0.985 }}
//                   className={[
//                     "relative mt-1 w-full overflow-hidden rounded-2xl px-4 py-[10px] font-semibold text-white",
//                     "bg-gradient-to-r from-iris-700 via-iris-600 to-iris-500",
//                     "transition duration-300",
//                     "shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_22px_70px_rgba(139,92,246,0.22)]",
//                     "hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_28px_90px_rgba(34,211,238,0.16)]",
//                     "disabled:opacity-60 disabled:cursor-not-allowed",
//                   ].join(" ")}
//                 >
//                   <span
//                     className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200"
//                     style={{
//                       background: `radial-gradient(600px circle at ${btnXY.x}% ${btnXY.y}%, rgba(34,211,238,0.18), transparent 44%)`,
//                     }}
//                   />
//                   <span className="relative">
//                     {submitting ? "Signing in..." : "Sign in"}
//                   </span>
//                 </motion.button>

//                 <p className="pt-1.5 text-center text-sm text-white/60">
//                   Don't have an account?{" "}
//                   <Link
//                     to="/signup"
//                     className="text-iris-400 hover:text-iris-300 underline-offset-4 hover:underline transition"
//                   >
//                     Create one
//                   </Link>
//                 </p>
//               </form>
//             </div>
//           </div>
//         </motion.div>
//       </div>

//          {/* ✅ PASSWORD RESET MODAL (CORRECT PLACEMENT) */}
//           <AnimatePresence>
//             {showReset && (
//               <PasswordResetModal onClose={() => setShowReset(false)} />
//            )}
//           </AnimatePresence>
//     </div>
//   );

// }

// /* ==================Password Reset =======================================*/
// function PasswordResetModal({ onClose }) {
//   const [step, setStep] = useState(1);

//   return (
//     <motion.div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//     >
//       <motion.div
//         initial={{ scale: 0.96, y: 12 }}
//         animate={{ scale: 1, y: 0 }}
//         exit={{ scale: 0.96, y: 12 }}
//         transition={{ duration: 0.25, ease: "easeOut" }}
//         className="w-full max-w-md rounded-2xl border border-iris-500/30 bg-jet-black p-6"
//       >
//         <h3 className="text-lg font-semibold text-white mb-1">
//           Reset password
//         </h3>

//         <p className="text-sm text-white/60 mb-6">
//           {step === 1 && "Enter your email to receive a reset link."}
//           {step === 2 && "Check your email and follow the reset instructions."}
//         </p>

//         {step === 1 && (
//           <input
//             placeholder="Email address"
//             className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-iris-500/60"
//           />
//         )}

//         {step === 2 && (
//           <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/70">
//             If an account exists for this email, a password reset link has been sent.
//           </div>
//         )}

//         <div className="flex justify-between mt-6">
//           <button
//             onClick={onClose}
//             className="text-sm text-white/50 hover:text-white transition"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={() => (step === 1 ? setStep(2) : onClose())}
//             className="rounded-lg bg-iris-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-iris-500 transition"
//           >
//             {step === 1 ? "Send link" : "Done"}
//           </button>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }


import React, { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParticleBackground from "../components/ParticleBackground";
import toast, { Toaster } from 'react-hot-toast';
import { API_BASE_URL, AUTH_API } from '../config/api';

// API base URL imported from config

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
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, defaultOptions);
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

const inputBase =
  "w-full rounded-2xl bg-white/5 px-4 py-[9px] text-[14px] text-white placeholder:text-white/35 " +
  "border border-white/10 outline-none transition " +
  "focus:bg-white/5 focus:border-iris-500/60 focus:ring-2 focus:ring-iris-500/15";

const helperAnim = {
  initial: { opacity: 0, y: -4 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
};

export default function LoginPage() {
  const [form, setForm] = useState({ Email: "", password: "" });
  const [submittedOnce, setSubmittedOnce] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showReset, setShowReset] = useState(false);


  const btnRef = useRef(null);
  const [btnXY, setBtnXY] = useState({ x: 50, y: 50 });
  const navigate = useNavigate();

  const onMouseMoveButton = (e) => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setBtnXY({ x, y });
  };

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (authError) setAuthError("");
  };

  const errors = useMemo(() => {
    const e = {};
    if (!form.Email.trim()) e.Email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.Email)) e.Email = "Email format is invalid";

    if (!form.password) e.password = "Password is required";

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

    try {
      setSubmitting(true);

      // API call to your backend
      const response = await fetch(AUTH_API.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle errors from backend
        throw new Error(data.error || 'Login failed');
      }

      // Store token and user info in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data.user_info));

      // Navigate to dashboard
      navigate("/dashboard");

    } catch (error) {
      setAuthError(error.message || "An error occurred during login");
      console.error("Login error:", error);
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
                  Sign in
                </h1>
              </div>

              <motion.button
                type="button"
                onClick={onGoogleContinue}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.985 }}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-[9px] text-sm text-white/85 hover:bg-white/7 transition"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                    <path
                      fill="#FFC107"
                      d="M43.611 20.083H42V20H24v8h11.303C33.655 32.659 29.218 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.043 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M6.306 14.691l6.571 4.819C14.655 16.108 19.003 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.043 6.053 29.268 4 24 4c-7.682 0-14.344 4.337-17.694 10.691z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24 44c5.115 0 9.805-1.963 13.333-5.155l-6.148-5.206C29.218 36 26.715 36.8 24 36c-5.197 0-9.62-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.241-2.231 4.149-4.118 5.639l.003-.002 6.148 5.206C36.889 40.205 44 35 44 24c0-1.341-.138-2.651-.389-3.917z"
                    />
                  </svg>
                  Continue with Google
                </span>
              </motion.button>

              <div className="my-3 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-white/40">or</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

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
                  <label className="sr-only" htmlFor="Email">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="Email"
                      className={inputWithError(showErrors && !!errors.Email)}
                      type="email"
                      name="Email"
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

                <div>
                  <label className="sr-only" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      className={[
                        inputWithError(showErrors && !!errors.password),
                        "pr-12",
                      ].join(" ")}
                      type={showPass ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={onChange}
                      placeholder="Password"
                      autoComplete="current-password"
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
                </div>

                <div className="flex justify-end pt-0.5">
                  <button
                    type="button"
                    className="text-xs text-iris-400 hover:text-iris-300 hover:underline underline-offset-4 transition"
                    onClick={() => setShowReset(true)}
                  >
                    Forgot password?
                  </button>

                </div>

                <motion.button
                  ref={btnRef}
                  onMouseMove={onMouseMoveButton}
                  type="submit"
                  disabled={!canSubmit || submitting}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.985 }}
                  className={[
                    "relative mt-1 w-full overflow-hidden rounded-2xl px-4 py-[10px] font-semibold text-white",
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
                    {submitting ? "Signing in..." : "Sign in"}
                  </span>
                </motion.button>

                <p className="pt-1.5 text-center text-sm text-white/60">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-iris-400 hover:text-iris-300 underline-offset-4 hover:underline transition"
                  >
                    Create one
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </div>

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

      {/* ✅ PASSWORD RESET MODAL (CORRECT PLACEMENT) */}
      <AnimatePresence>
        {showReset && (
          <PasswordResetModal onClose={() => setShowReset(false)} />
        )}
      </AnimatePresence>
    </div>
  );

}

/* ==================Password Reset =======================================*/
function PasswordResetModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendResetLink = async () => {
    // Email validation
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    const result = await apiFetchPublic('/forgot_password/', {
      method: 'POST',
      body: { email: email.trim() }
    });

    if (result.success) {
      // Show success message
      setStep(2);
      toast.success("Password reset email sent! Check your inbox.");
    } else {
      setError(result.error || "Failed to send reset email");
      toast.error(result.error || "Failed to send reset email");
    }

    setLoading(false);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.96, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 12 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-md rounded-2xl border border-iris-500/30 bg-jet-black p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            Reset password
          </h3>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-white/60 mb-6">
          {step === 1 && "Enter your email to receive a reset link."}
          {step === 2 && "Check your email and follow the reset instructions."}
        </p>

        {step === 1 && (
          <div className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Enter your email address"
              className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-iris-500/60"
              disabled={loading}
            />

            {error && (
              <div className="rounded-lg border border-red-400/20 bg-red-500/10 p-2 text-sm text-red-300">
                {error}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="rounded-lg border border-iris-500/20 bg-iris-500/5 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-iris-500/20">
                <svg className="h-4 w-4 text-iris-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-white">Check your email</h4>
                <p className="text-xs text-white/60">We've sent a reset link to:</p>
                <p className="text-sm text-iris-300 font-medium mt-1">{email}</p>
              </div>
            </div>
            <div className="mt-3 text-xs text-white/50">
              <p>• Click the link in the email to reset your password</p>
              <p>• The link will expire in 24 hours</p>
              <p>• Check your spam folder if you don't see it</p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          {step === 1 ? (
            <>
              <button
                onClick={onClose}
                className="text-sm text-white/50 hover:text-white transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSendResetLink}
                disabled={loading}
                className="rounded-lg bg-iris-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-iris-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  "Send reset link"
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setStep(1);
                  setEmail("");
                }}
                className="text-sm text-white/50 hover:text-white transition"
              >
                Use different email
              </button>
              <button
                onClick={onClose}
                className="rounded-lg bg-iris-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-iris-500 transition"
              >
                Done
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}