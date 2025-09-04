import React, { useState } from 'react';
import { axiosInstance } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

// UI & Animation
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import { User, Lock, Loader2, AlertCircle } from 'lucide-react';

const Login = () => {
    // --- STATE MANAGEMENT ---
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // --- FORM SUBMISSION HANDLER ---
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(""); // Clear previous errors

        try {
            const res = await axiosInstance.post("auth/login", { username, password });
            const data = res.data;

            if (data.token) {
                localStorage.setItem("token", data.token);
                // No success message needed, navigation is the success indicator
                navigate("/"); // Redirect to the main notes page
            } else {
                // This case might not be hit if the server always returns an error status for failed logins
                setError("Login failed. Please check your credentials.");
            }
        } catch (err) {
            // Handle specific error messages from the server, or provide a generic one
            const errorMessage = err.response?.data?.message || err.response?.data || "Invalid username or password.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // --- RENDER ---
    return (
        <div className="min-h-screen w-screen bg-slate-900 text-slate-200 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-slate-800 rounded-2xl shadow-xl p-8 space-y-6">
                    {/* --- HEADER --- */}
                    <div className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                            Welcome Back
                        </h1>
                        <p className="mt-2 text-slate-400">Sign in to continue to your notes.</p>
                    </div>

                    {/* --- FORM --- */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Username Input */}
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                required
                                className="w-full bg-slate-700 text-slate-100 placeholder-slate-400 p-3 pl-10 rounded-md border-2 border-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                                className="w-full bg-slate-700 text-slate-100 placeholder-slate-400 p-3 pl-10 rounded-md border-2 border-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                            />
                        </div>
                        
                        {/* --- ERROR MESSAGE --- */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex items-center gap-2 bg-red-500/10 text-red-400 text-sm font-semibold p-3 rounded-md"
                                >
                                    <AlertCircle size={18} />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>


                        {/* --- SUBMIT BUTTON --- */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                "Login"
                            )}
                        </motion.button>
                    </form>
                    
                    {/* Optional: Link to Register Page */}
                    <p className="text-center text-sm text-slate-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-teal-400 hover:text-teal-300">
                            Sign up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;