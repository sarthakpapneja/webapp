"use client";

import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useTasks, Task } from '../../hooks/useTasks'; // Import Task interface
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const auth = useContext(AuthContext);
    const router = useRouter();
    const { tasks, loading, error, addTask, updateTask, deleteTask } = useTasks();
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!auth?.loading && !auth?.user) {
            router.push('/login');
        }
    }, [auth?.user, auth?.loading, router]);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskTitle.trim()) {
            await addTask({ title: newTaskTitle, description: newTaskDescription });
            setNewTaskTitle('');
            setNewTaskDescription('');
        }
    };

    const filteredTasks = tasks.filter((task: Task) => {
        const matchesFilter = filter === 'all' || task.status === filter;
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    if (auth?.loading || (loading && tasks.length === 0)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!auth?.user) {
        return null;
    }

    return (
        <div className="min-h-screen pb-12">
            <Navbar />
            <div className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
                        <p className="mt-1 text-gray-500">Manage your tasks efficiently.</p>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="block w-full md:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm transition-shadow text-gray-900"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Add Task */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </span>
                                Create Task
                            </h3>
                            <form onSubmit={handleAddTask} className="space-y-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        id="title"
                                        type="text"
                                        required
                                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border bg-gray-50/50 text-gray-900 placeholder-gray-400 transition-all"
                                        placeholder="What needs to be done?"
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        id="description"
                                        rows={3}
                                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border bg-gray-50/50 text-gray-900 placeholder-gray-400 transition-all"
                                        placeholder="Add some details..."
                                        value={newTaskDescription}
                                        onChange={(e) => setNewTaskDescription(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!newTaskTitle.trim()}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
                                >
                                    Add Task
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Task List */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Filters */}
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                            {(['all', 'pending', 'completed'] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all ${filter === f
                                            ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-600 ring-offset-2'
                                            : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-indigo-600 border border-gray-200'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        {/* Tasks */}
                        {filteredTasks.length === 0 ? (
                            <div className="text-center py-12 bg-white/50 rounded-3xl border border-dashed border-gray-300">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
                                <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredTasks.map((task: Task) => (
                                    <div
                                        key={task._id}
                                        className={`group bg-white/70 backdrop-blur-sm rounded-2xl p-5 border transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${task.status === 'completed' ? 'border-green-200 bg-green-50/30' : 'border-white/50'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1 pr-4">
                                                <h4 className={`text-lg font-bold text-gray-900 leading-snug ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                                                    {task.title}
                                                </h4>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {task.status === 'completed' ? 'Completed' : 'Pending'}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={task.status === 'completed'}
                                                    onChange={() => updateTask(task._id, { status: task.status === 'completed' ? 'pending' : 'completed' })}
                                                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{task.description}</p>
                                        <div className="flex justify-end pt-3 border-t border-gray-100/50">
                                            <button
                                                onClick={() => deleteTask(task._id)}
                                                className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                                                title="Delete Task"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
