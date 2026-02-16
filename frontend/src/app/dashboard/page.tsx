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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!auth?.user) {
        return null;
    }

    return (
        <div className="min-h-screen pb-12">
            <Navbar />

            <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Header Area */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
                            Tasks
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your projects and track progress.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Filter tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex bg-white rounded-md shadow-sm ring-1 ring-gray-200 p-0.5">
                            {(['all', 'pending', 'completed'] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-sm capitalize transition-all ${filter === f
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Add Task Input (Inline) */}
                <div className="mb-8 group">
                    <div className="relative">
                        <form onSubmit={handleAddTask} className="flex gap-4 items-start">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    required
                                    className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white transition-shadow"
                                    placeholder="Add a new task..."
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!newTaskTitle.trim()}
                                className="inline-flex items-center rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                </svg>
                                Add
                            </button>
                        </form>
                    </div>
                </div>

                {/* Technical List View */}
                <div className="bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-lg overflow-hidden">
                    <ul role="list" className="divide-y divide-gray-100">
                        {filteredTasks.length === 0 ? (
                            <li className="p-12 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
                                <p className="mt-1 text-sm text-gray-500">Create a task to get started.</p>
                            </li>
                        ) : (
                            filteredTasks.map((task: Task) => (
                                <li
                                    key={task._id}
                                    className="group flex items-center justify-between gap-x-6 py-4 px-6 hover:bg-gray-50/50 transition-colors"
                                >
                                    <div className="flex min-w-0 gap-x-4 items-center">
                                        <div className="flex-none flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={task.status === 'completed'}
                                                onChange={() => updateTask(task._id, { status: task.status === 'completed' ? 'pending' : 'completed' })}
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-auto">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono text-gray-400">#{task._id.slice(-4)}</span>
                                                <p className={`text-sm font-medium leading-6 text-gray-900 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                                                    {task.title}
                                                </p>
                                                {task.status === 'completed' && (
                                                    <span className="inline-flex items-center rounded-full bg-gray-50 px-1.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                                        Done
                                                    </span>
                                                )}
                                            </div>
                                            {task.description && (
                                                <p className="mt-1 text-xs leading-5 text-gray-500 truncate pl-10">
                                                    {task.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-none items-center gap-x-4">
                                        <button
                                            onClick={() => deleteTask(task._id)}
                                            className="hidden group-hover:block rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all"
                                        >
                                            Delete
                                        </button>
                                        <div className={`h-1.5 w-1.5 rounded-full ${task.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </main>
        </div>
    );
}
