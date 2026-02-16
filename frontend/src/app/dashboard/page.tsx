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

            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                            Dashboard
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar / Add Task */}
                    <div className="lg:col-span-4 space-y-6">
                        <section aria-labelledby="add-task-title">
                            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 id="add-task-title" className="text-base font-semibold leading-6 text-gray-900">
                                        New Task
                                    </h3>
                                    <div className="mt-2 text-sm text-gray-500">
                                        <p>Create a new task to track your progress.</p>
                                    </div>
                                    <form onSubmit={handleAddTask} className="mt-5 space-y-4">
                                        <div>
                                            <input
                                                type="text"
                                                required
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                placeholder="Task Title"
                                                value={newTaskTitle}
                                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <textarea
                                                rows={3}
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                placeholder="Description (Optional)"
                                                value={newTaskDescription}
                                                onChange={(e) => setNewTaskDescription(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
                                        >
                                            Add Task
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Main Content / Task List */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Controls: Search & Filter */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
                            {/* Search */}
                            <div className="relative w-full sm:w-96">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="Search tasks..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex bg-gray-50 p-0.5 rounded-lg border border-gray-200">
                                {(['all', 'pending', 'completed'] as const).map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${filter === f
                                                ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                                                : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* List */}
                        <ul role="list" className="grid grid-cols-1 gap-4">
                            {filteredTasks.length === 0 ? (
                                <li className="text-center py-12 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
                                    <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No tasks found</h3>
                                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new task or Adjusting your search.</p>
                                </li>
                            ) : (
                                filteredTasks.map((task: Task) => (
                                    <li
                                        key={task._id}
                                        className={`relative flex justify-between gap-x-6 py-5 px-6 hover:bg-gray-50 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl transition-all ${task.status === 'completed' ? 'opacity-75' : ''}`}
                                    >
                                        <div className="flex min-w-0 gap-x-4">
                                            <div className="flex flex-col items-center justify-start pt-1">
                                                <input
                                                    type="checkbox"
                                                    checked={task.status === 'completed'}
                                                    onChange={() => updateTask(task._id, { status: task.status === 'completed' ? 'pending' : 'completed' })}
                                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-auto">
                                                <p className={`text-sm font-semibold leading-6 text-gray-900 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                                                    {task.title}
                                                </p>
                                                <p className="mt-1 flex text-xs leading-5 text-gray-500 truncate">
                                                    {task.description}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-x-4">
                                            <div className={`hidden sm:flex sm:flex-col sm:items-end`}>
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${task.status === 'completed'
                                                        ? 'bg-green-50 text-green-700 ring-green-600/20'
                                                        : 'bg-indigo-50 text-indigo-700 ring-indigo-600/10'
                                                    }`}>
                                                    {task.status === 'completed' ? 'Completed' : 'Pending'}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => deleteTask(task._id)}
                                                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-50 hover:text-red-600 hover:ring-red-300 transition-all"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
