import { useState, useEffect, useContext } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [loadingTasks, setLoadingTasks] = useState(true);

    // Advanced features state
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const { user, logout } = useContext(AuthContext);

    const fetchTasks = async () => {
        setLoadingTasks(true);
        try {
            const query = new URLSearchParams({
                page,
                limit: 6,
                ...(search && { search }),
                ...(statusFilter && { status: statusFilter })
            }).toString();

            const res = await api.get(`/tasks?${query}`);
            setTasks(res.data.data.tasks);
            setTotalPages(res.data.data.pagination.pages);
        } catch (err) {
            console.debug('[Tasks] Sync failed', err);
        } finally {
            setLoadingTasks(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [page, search, statusFilter]);

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
            fetchTasks(); // Refresh to ensure backend constraint success
        } catch (err) {
            console.debug('[Tasks] Status update failed', err);
        }
    };

    // Calculate aggregate stats based on current page view (since typical SaaS grids have top-level stats).
    // In a real app this might come from a backend `/stats` endpoint, but we use what we have to fit the Bento aesthetic.
    const completedCount = tasks.filter(t => t.status === 'completed').length;
    const pendingCount = tasks.filter(t => t.status === 'pending').length;
    const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
                <div className="p-6 border-b border-slate-200">
                    <span className="text-xl font-bold tracking-tight text-[#8EEBEC]">Task</span>
                    <span className="text-xl font-bold tracking-tight text-slate-800">MSR</span>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <div className="px-4 py-2.5 bg-slate-100 text-slate-900 text-sm font-medium rounded-md cursor-pointer">
                        Dashboard
                    </div>
                    <div
                        onClick={logout}
                        className="px-4 py-2.5 text-slate-600 hover:bg-slate-50 text-sm font-medium rounded-md cursor-pointer transition-colors"
                    >
                        Logout
                    </div>
                </nav>
                <div className="p-4 border-t border-slate-200 text-xs text-slate-500 font-medium">
                    {user?.role === 'admin' ? 'Admin Portal' : 'User Portal'}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Mobile Header (Hidden on Desktop) */}
                <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center">
                    <div className="font-bold text-lg"><span className="text-[#8EEBEC]">Task</span>MSR</div>
                    <button onClick={logout} className="text-sm font-medium text-slate-600">Logout</button>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto space-y-6">

                        {/* Page Title */}
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Task Overview</h1>
                            <p className="text-sm text-slate-500 mt-1">Manage your internship tasks and track progress.</p>
                        </div>

                        {/* Bento Grid Container */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                            {/* Top Row: Stats (Col span 12, internal grid 3) */}
                            <div className="col-span-1 md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col justify-center">
                                    <span className="text-sm font-medium text-slate-500">Tasks on Page</span>
                                    <span className="text-3xl font-bold text-slate-900 mt-2">{tasks.length}</span>
                                </div>
                                <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col justify-center">
                                    <span className="text-sm font-medium text-slate-500">Completed (Current View)</span>
                                    <span className="text-3xl font-bold text-green-600 mt-2">{completedCount}</span>
                                </div>
                                <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col justify-center">
                                    <span className="text-sm font-medium text-slate-500">Pending & In Progress</span>
                                    <span className="text-3xl font-bold text-amber-600 mt-2">{pendingCount + inProgressCount}</span>
                                </div>
                            </div>

                            {/* Middle Left: Create Task (Col 7) */}
                            <div className="col-span-1 md:col-span-7 bg-white border border-slate-200 shadow-sm rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">Create New Task</h3>
                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm font-medium">
                                        {error}
                                    </div>
                                )}
                                <form onSubmit={handleCreateTask} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Title</label>
                                        <input
                                            type="text"
                                            placeholder="E.g. Setup UI Architecture"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8EEBEC] focus:border-transparent transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                                        <textarea
                                            placeholder="Brief task details..."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                            rows="2"
                                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8EEBEC] focus:border-transparent transition resize-none"
                                        />
                                    </div>
                                    <button type="submit" className="bg-slate-900 text-white font-medium text-sm rounded-md px-5 py-2 hover:bg-slate-800 transition shadow-sm">
                                        Add Task
                                    </button>
                                </form>
                            </div>

                            {/* Middle Right: Search & Filters (Col 5) */}
                            <div className="col-span-1 md:col-span-5 bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">Filter & Search</h3>
                                <div className="space-y-4 flex-1">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Search Keywords</label>
                                        <input
                                            type="text"
                                            placeholder="Search by title..."
                                            value={search}
                                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8EEBEC] focus:border-transparent transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Task Status</label>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8EEBEC] focus:border-transparent transition bg-white"
                                        >
                                            <option value="">All Statuses</option>
                                            <option value="pending">Pending</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom: Task List (Col 12) */}
                            <div className="col-span-1 md:col-span-12">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-slate-900">Recent Tasks</h3>
                                    {totalPages > 1 && (
                                        <div className="flex items-center space-x-2 text-sm">
                                            <button
                                                disabled={page === 1}
                                                onClick={() => setPage(p => p - 1)}
                                                className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-600 disabled:opacity-50 hover:bg-slate-50"
                                            >
                                                Prev
                                            </button>
                                            <span className="text-slate-500 font-medium px-2">Page {page} of {totalPages}</span>
                                            <button
                                                disabled={page === totalPages}
                                                onClick={() => setPage(p => p + 1)}
                                                className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-600 disabled:opacity-50 hover:bg-slate-50"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {loadingTasks ? (
                                    <div className="bg-white border border-slate-200 border-dashed rounded-xl p-12 text-center">
                                        <p className="text-slate-500 font-medium">Loading tasks...</p>
                                    </div>
                                ) : tasks.length === 0 ? (
                                    <div className="bg-white border border-slate-200 border-dashed rounded-xl p-12 text-center">
                                        <p className="text-slate-500 font-medium">No tasks found in this view.</p>
                                        <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or create a new task above.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {tasks.map((task) => (
                                            <div key={task._id} className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col hover:border-slate-300 transition-colors">
                                                <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-3">
                                                    <h4 className="text-sm font-semibold text-slate-900 line-clamp-2 pr-2 leading-tight">
                                                        {task.title}
                                                    </h4>
                                                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${task.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {task.status.replace('-', ' ')}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 flex-1 mb-4 leading-relaxed line-clamp-3">
                                                    {task.description}
                                                </p>
                                                <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                                                    <select
                                                        value={task.status}
                                                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                                        className="text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#8EEBEC]"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="in-progress">In Progress</option>
                                                        <option value="completed">Completed</option>
                                                    </select>
                                                    <button
                                                        onClick={() => handleDeleteTask(task._id)}
                                                        className="text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded transition"
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

                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
