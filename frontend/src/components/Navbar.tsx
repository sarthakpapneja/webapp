"use client";

import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
    const auth = useContext(AuthContext);

    return (
        <nav className="fixed w-full z-50 top-0 start-0 border-b border-white/20 bg-white/70 backdrop-blur-md shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                                Nexus Hub
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-6">
                        {auth?.user ? (
                            <>
                                <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                                    Dashboard
                                </Link>
                                <span className="text-gray-400">|</span>
                                <div className="text-gray-800 font-medium">Hello, {auth.user.name}</div>
                                <button
                                    onClick={auth.logout}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-600 px-4 py-2 rounded-full text-sm font-medium transition-all"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                                    Login
                                </Link>
                                <Link href="/register" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
