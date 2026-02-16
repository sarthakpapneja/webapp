"use client";

import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
    const auth = useContext(AuthContext);

    return (
        <nav className="border-b border-gray-200 sticky top-0 z-50 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                N
                            </div>
                            <span className="text-lg font-bold text-gray-900 tracking-tight font-mono">
                                Nexus Hub
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-6">
                        {auth?.user ? (
                            <>
                                <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                                    Dashboard
                                </Link>
                                <div className="h-4 w-px bg-gray-300"></div>
                                <div className="text-sm font-medium text-gray-700 font-mono">{auth.user.name}</div>
                                <button
                                    onClick={auth.logout}
                                    className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                                >
                                    Log out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                                    Log in
                                </Link>
                                <Link href="/register" className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
