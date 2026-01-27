// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Lock, Mail, User, ShieldCheck } from "lucide-react";

// /**
//  * Profile — Elite Compact Edition
//  * Same luxury feel, better screen utilization
//  */
// export default function Profile() {
//   const [username, setUsername] = useState("Ahmed Khan");
//   const [showReset, setShowReset] = useState(false);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3, ease: "easeOut" }}
//       className="max-w-4xl space-y-6"
//     >
//       {/* ================= HEADER ================= */}
//       <div>
//         <h1 className="text-xl font-semibold text-white">Profile</h1>
//         <p className="mt-0.5 text-sm text-white/55">
//           Manage your personal details and account security.
//         </p>
//       </div>

//       {/* ================= ACCOUNT SUMMARY ================= */}
//       <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm font-medium text-white">Account status</p>
//             <p className="mt-0.5 text-xs text-white/50">
//               Active • Verified email
//             </p>
//           </div>

//           <div className="flex items-center gap-2 rounded-full bg-iris-500/15 px-3 py-0.5">
//             <ShieldCheck size={13} className="text-iris-400" />
//             <span className="text-xs text-iris-300">Secure</span>
//           </div>
//         </div>

//         <div className="mt-3 h-px bg-white/10" />

//         <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
//           <InfoRow label="Email" value="ahmed.khan@example.com" />
//           <InfoRow label="Member since" value="January 2025" />
//         </div>
//       </section>

//       {/* ================= IDENTITY ================= */}
//       <section className="rounded-2xl border border-iris-500/30 bg-white/[0.03] p-5">
//         <h2 className="mb-2 text-sm font-medium text-iris-300">
//           Identity
//         </h2>

//         <div className="space-y-3">
//           <div className="space-y-1">
//             <label className="flex items-center gap-2 text-xs text-white/60">
//               <User size={13} />
//               Display name
//             </label>

//             <input
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="
//                 w-full rounded-lg
//                 bg-black/40 border border-white/10
//                 px-3 py-2 text-sm text-white
//                 focus:outline-none focus:border-iris-500/60
//               "
//             />
//           </div>

//           <div className="flex justify-end">
//             <button className="
//               rounded-lg bg-iris-600 px-3 py-2
//               text-sm font-medium text-white
//               hover:bg-iris-500 transition
//               shadow shadow-iris-600/25
//             ">
//               Save changes
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* ================= SECURITY ================= */}
//       <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
//         <h2 className="mb-2 text-sm font-medium text-white">
//           Security
//         </h2>

//         <button
//           onClick={() => setShowReset(true)}
//           className="
//             w-full flex items-center justify-between
//             rounded-lg border border-white/10
//             bg-black/30 px-4 py-2.5
//             text-sm text-white/70
//             hover:border-iris-500/50 hover:text-white
//             transition
//           "
//         >
//           <span className="flex items-center gap-2">
//             <Lock size={15} />
//             Change password
//           </span>
//           <span className="text-xs text-white/40">
//             Recommended periodically
//           </span>
//         </button>
//       </section>

//       {/* ================= PASSWORD RESET ================= */}
//       <AnimatePresence>
//         {showReset && (
//           <PasswordResetModal onClose={() => setShowReset(false)} />
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// }

// /* ======================================================
//    SMALL COMPONENTS
// ====================================================== */

// function InfoRow({ label, value }) {
//   return (
//     <div>
//       <p className="text-xs text-white/40">{label}</p>
//       <p className="mt-0.5 text-sm text-white">{value}</p>
//     </div>
//   );
// }

// /* ======================================================
//    PASSWORD RESET MODAL — COMPACT
// ====================================================== */
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
//         initial={{ scale: 0.97, y: 8 }}
//         animate={{ scale: 1, y: 0 }}
//         exit={{ scale: 0.97, y: 8 }}
//         transition={{ duration: 0.2, ease: "easeOut" }}
//         className="w-full max-w-sm rounded-2xl border border-iris-500/30 bg-jet-black p-5"
//       >
//         <h3 className="text-base font-semibold text-white">
//           Reset password
//         </h3>

//         <p className="mt-1 text-sm text-white/60">
//           {step === 1 && "Enter your email to receive a reset code."}
//           {step === 2 && "Enter the verification code."}
//           {step === 3 && "Set a new secure password."}
//         </p>

//         <div className="mt-4 space-y-3">
//           {step === 1 && <Input placeholder="Email address" />}
//           {step === 2 && <Input placeholder="Verification code" />}
//           {step === 3 && <Input type="password" placeholder="New password" />}
//         </div>

//         <div className="mt-5 flex justify-between">
//           <button
//             onClick={onClose}
//             className="text-sm text-white/50 hover:text-white"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={() => (step < 3 ? setStep(step + 1) : onClose())}
//             className="
//               rounded-lg bg-iris-600 px-4 py-2
//               text-sm font-medium text-white
//               hover:bg-iris-500 transition
//             "
//           >
//             {step < 3 ? "Continue" : "Done"}
//           </button>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }

// function Input(props) {
//   return (
//     <input
//       {...props}
//       className="
//         w-full rounded-lg
//         bg-black/40 border border-white/10
//         px-4 py-2 text-sm text-white
//         focus:outline-none focus:border-iris-500/60
//       "
//     />
//   );
// }


import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, User, ShieldCheck, Loader2 } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';

// API base URL
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// API fetch helper
const apiFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
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

/**
 * Profile — Elite Compact Edition
 * Same luxury feel, better screen utilization
 */
export default function Profile() {
  const [profile, setProfile] = useState({
    username: "",
    Email: "",
    member_since: "January 2025" // Default value, you can update this from API if available
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showReset, setShowReset] = useState(false);

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const result = await apiFetch('/profile/');

    if (result.success) {
      // Backend returns: { success, user: { email, username, ... }, account: { ... } }
      const userData = result.data.user || result.data;
      setProfile({
        username: userData.username || "",
        Email: userData.email || "", // Backend returns lowercase 'email'
        member_since: userData.created_at
          ? new Date(userData.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
          : "January 2025"
      });
    } else {
      toast.error(result.error || "Failed to load profile data");
    }
    setLoading(false);
  };

  const handleUpdateProfile = async () => {
    if (!profile.username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    setSaving(true);

    const result = await apiFetch('/updateprofile/', {
      method: 'PUT',
      body: { username: profile.username }
    });

    if (result.success) {
      toast.success("Profile updated successfully!");
      // Backend returns: { success, message, user: { username, ... } }
      const updatedUser = result.data.user || result.data;
      setProfile(prev => ({ ...prev, username: updatedUser.username || profile.username }));
    } else {
      toast.error(result.error || "Failed to update profile");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-iris-500" size={32} />
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
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

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-4xl space-y-6"
      >
        {/* ================= HEADER ================= */}
        <div>
          <h1 className="text-xl font-semibold text-white">Profile</h1>
          <p className="mt-0.5 text-sm text-white/55">
            Manage your personal details and account security.
          </p>
        </div>

        {/* ================= ACCOUNT SUMMARY ================= */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Account status</p>
              <p className="mt-0.5 text-xs text-white/50">
                Active • Verified email
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-iris-500/15 px-3 py-0.5">
              <ShieldCheck size={13} className="text-iris-400" />
              <span className="text-xs text-iris-300">Secure</span>
            </div>
          </div>

          <div className="mt-3 h-px bg-white/10" />

          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoRow label="Email" value={profile.Email} />
            <InfoRow label="Member since" value={profile.member_since} />
          </div>
        </section>

        {/* ================= IDENTITY ================= */}
        <section className="rounded-2xl border border-iris-500/30 bg-white/[0.03] p-5">
          <h2 className="mb-2 text-sm font-medium text-iris-300">
            Identity
          </h2>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-xs text-white/60">
                <User size={13} />
                Display name
              </label>

              <input
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                className="
                  w-full rounded-lg
                  bg-black/40 border border-white/10
                  px-3 py-2 text-sm text-white
                  focus:outline-none focus:border-iris-500/60
                "
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleUpdateProfile}
                disabled={saving}
                className="
                  rounded-lg bg-iris-600 px-3 py-2
                  text-sm font-medium text-white
                  hover:bg-iris-500 transition
                  shadow shadow-iris-600/25
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center gap-2
                "
              >
                {saving && <Loader2 className="animate-spin" size={14} />}
                Save changes
              </button>
            </div>
          </div>
        </section>

        {/* ================= SECURITY ================= */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="mb-2 text-sm font-medium text-white">
            Security
          </h2>

          <button
            onClick={() => setShowReset(true)}
            className="
              w-full flex items-center justify-between
              rounded-lg border border-white/10
              bg-black/30 px-4 py-2.5
              text-sm text-white/70
              hover:border-iris-500/50 hover:text-white
              transition
            "
          >
            <span className="flex items-center gap-2">
              <Lock size={15} />
              Change password
            </span>
            <span className="text-xs text-white/40">
              Recommended periodically
            </span>
          </button>
        </section>

        {/* ================= PASSWORD RESET ================= */}
        <AnimatePresence>
          {showReset && (
            <PasswordResetModal onClose={() => setShowReset(false)} />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

/* ======================================================
   SMALL COMPONENTS
====================================================== */

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-xs text-white/40">{label}</p>
      <p className="mt-0.5 text-sm text-white">{value}</p>
    </div>
  );
}

/* ======================================================
   PASSWORD RESET MODAL — COMPACT
====================================================== */
function PasswordResetModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: ""
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleChangePassword = async () => {
    // Validation
    if (!form.old_password || !form.new_password || !form.confirm_password) {
      toast.error("All fields are required");
      return;
    }

    if (form.new_password !== form.confirm_password) {
      toast.error("New passwords don't match");
      return;
    }

    if (form.new_password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const result = await apiFetch('/change_password/', {
      method: 'POST',
      body: {
        old_password: form.old_password,
        new_password: form.new_password,
        confirm_password: form.confirm_password
      }
    });

    if (result.success) {
      toast.success("Password changed successfully!");
      // Reset form
      setForm({
        old_password: "",
        new_password: "",
        confirm_password: ""
      });
      onClose();
    } else {
      toast.error(result.error || "Failed to change password");
    }

    setLoading(false);
  };

  const getStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Input
              type="password"
              placeholder="Current password"
              value={form.old_password}
              onChange={(e) => handleChange('old_password', e.target.value)}
              disabled={loading}
            />
            <button
              onClick={() => setStep(2)}
              disabled={!form.old_password}
              className="
                w-full rounded-lg bg-iris-600 px-4 py-2
                text-sm font-medium text-white
                hover:bg-iris-500 transition
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
              "
            >
              Continue
            </button>
          </>
        );
      case 2:
        return (
          <>
            <Input
              type="password"
              placeholder="New password"
              value={form.new_password}
              onChange={(e) => handleChange('new_password', e.target.value)}
              disabled={loading}
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={form.confirm_password}
              onChange={(e) => handleChange('confirm_password', e.target.value)}
              disabled={loading}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                disabled={loading}
                className="
                  flex-1 rounded-lg border border-white/10
                  px-4 py-2 text-sm text-white/70
                  hover:bg-white/5 transition
                  disabled:opacity-50
                "
              >
                Back
              </button>
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="
                  flex-1 rounded-lg bg-iris-600 px-4 py-2
                  text-sm font-medium text-white
                  hover:bg-iris-500 transition
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2
                "
              >
                {loading && <Loader2 className="animate-spin" size={16} />}
                Change Password
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.97, y: 8 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.97, y: 8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full max-w-sm rounded-2xl border border-iris-500/30 bg-jet-black p-5"
      >
        <h3 className="text-base font-semibold text-white">
          Change Password
        </h3>

        <p className="mt-1 text-sm text-white/60">
          {step === 1 && "First, enter your current password."}
          {step === 2 && "Now, enter and confirm your new password."}
        </p>

        <div className="mt-4 space-y-3">
          {getStepContent()}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="text-sm text-white/50 hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="
        w-full rounded-lg
        bg-black/40 border border-white/10
        px-4 py-2 text-sm text-white
        focus:outline-none focus:border-iris-500/60
        disabled:opacity-50
      "
    />
  );
}