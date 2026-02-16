import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'pending' | 'completed';
}

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const auth = useContext(AuthContext);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

    useEffect(() => {
        if (auth?.user) {
            fetchTasks();
        }
    }, [auth?.user]);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/tasks`, {
                headers: { Authorization: `Bearer ${auth?.user?.token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setTasks(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addTask = async (taskData: { title: string; description: string }) => {
        try {
            const res = await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth?.user?.token}`,
                },
                body: JSON.stringify(taskData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setTasks([...tasks, data]);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const updateTask = async (id: string, updates: Partial<Task>) => {
        try {
            const res = await fetch(`${API_URL}/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth?.user?.token}`,
                },
                body: JSON.stringify(updates),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setTasks(tasks.map((t) => (t._id === id ? data : t)));
        } catch (err: any) {
            setError(err.message);
        }
    };

    const deleteTask = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/tasks/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${auth?.user?.token}` },
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message);
            }
            setTasks(tasks.filter((t) => t._id !== id));
        } catch (err: any) {
            setError(err.message);
        }
    };

    return { tasks, loading, error, addTask, updateTask, deleteTask };
};
