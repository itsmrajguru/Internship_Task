import { useState, useEffect, useContext } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);

    const { user } = useContext(AuthContext);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data.data);
        } catch (err) {
            console.debug('[Tasks] Sync failed', err);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tasks', { title, description });
            setTitle('');
            setDescription('');
            fetchTasks();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create task');
        }
    };

    const handleDeleteTask = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await api.delete(`/tasks/${id}`);
                fetchTasks();
            } catch (err) {
                console.debug('[Tasks] Deletion failed', err);
            }
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await api.put(`/tasks/${id}`, { status });
            fetchTasks();
        } catch (err) {
            console.debug('[Tasks] Status update failed', err);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container dashboard">
                <header className="dashboard-header">
                    <h2>Task Dashboard</h2>
                    {user?.role === 'admin' && <span className="badge">Admin View</span>}
                </header>

                <div className="task-form-card">
                    <h3>Create New Task</h3>
                    {error && <div className="error-msg">{error}</div>}
                    <form onSubmit={handleCreateTask} className="task-form">
                        <input
                            type="text"
                            placeholder="Task Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Task Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn-primary">Add Task</button>
                    </form>
                </div>

                <div className="tasks-list">
                    <h3>Your Tasks</h3>
                    {tasks.length === 0 ? (
                        <p>No tasks found. Create one above!</p>
                    ) : (
                        <div className="grid">
                            {tasks.map((task) => (
                                <div key={task._id} className="task-card">
                                    <div className="task-header">
                                        <h4>{task.title}</h4>
                                        <span className={`status-badge ${task.status}`}>{task.status}</span>
                                    </div>
                                    <p>{task.description}</p>
                                    <div className="task-actions">
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                        <button
                                            onClick={() => handleDeleteTask(task._id)}
                                            className="btn btn-danger btn-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
