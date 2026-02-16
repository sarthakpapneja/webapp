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

    const filteredTasks = tasks.filter((task: Task) => { // Type the task parameter
        if (filter === 'all') return true;
        return task.status === filter;
    });

    if (auth?.loading || (loading && tasks.length === 0)) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!auth?.user) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

                    {/* Add Task Form */}
                    <div className="bg-white overflow-hidden shadow rounded-lg mb-8">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Task</h3>
                            <form onSubmit={handleAddTask} className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        required
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900 placeholder-gray-400"
                                        placeholder="Task Title"
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <textarea
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900 placeholder-gray-400"
                                        placeholder="Task Description (Optional)"
                                        value={newTaskDescription}
                                        onChange={(e) => setNewTaskDescription(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Add Task
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Task Filters */}
                    <div className="mb-4 flex space-x-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${filter === 'pending' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setFilter('completed')}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${filter === 'completed' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            Completed
                        </button>
                    </div>

                    {/* Task List */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {filteredTasks.length === 0 ? (
                                <li className="px-4 py-4 sm:px-6 text-center text-gray-500">No tasks found.</li>
                            ) : (
                                filteredTasks.map((task: Task) => ( // Type the task parameter
                                    <li key={task._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={task.status === 'completed'}
                                                    onChange={() => updateTask(task._id, { status: task.status === 'completed' ? 'pending' : 'completed' })}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                                <div className="ml-3">
                                                    <p className={`text-sm font-medium text-indigo-600 truncate ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
                                                        {task.title}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{task.description}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => deleteTask(task._id)}
                                                className="text-red-600 hover:text-red-900 text-sm font-medium"
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
            </div>
        </div>
    );
}
