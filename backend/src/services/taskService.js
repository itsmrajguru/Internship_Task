const taskRepository = require('../repositories/taskRepository');

class TaskService {
    async createTask(userId, taskData) {
        taskData.user = userId;
        return await taskRepository.create(taskData);
    }

    async getTasks(userId, role, options = {}) {
        let query = {};

        if (role !== 'admin') {
            query.user = userId;
        }

        if (options.status) {
            query.status = options.status;
        }

        if (options.search) {
            query.title = { $regex: options.search, $options: 'i' };
        }

        const page = parseInt(options.page, 10) || 1;
        const limit = parseInt(options.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const tasks = await taskRepository.findTasks(query, skip, limit);
        const total = await taskRepository.countTasks(query);

        return {
            tasks,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        };
    }

    async getTaskById(taskId, userId, role) {
        const task = await taskRepository.findById(taskId);

        if (!task) {
            throw new Error('Task not found');
        }

        if (task.user.toString() !== userId && role !== 'admin') {
            throw new Error('Not authorized');
        }

        return task;
    }

    async updateTask(taskId, userId, role, updateData) {
        const task = await this.getTaskById(taskId, userId, role);
        return await taskRepository.update(task._id, updateData);
    }

    async deleteTask(taskId, userId, role) {
        const task = await this.getTaskById(taskId, userId, role);
        await taskRepository.delete(task._id);
        return task;
    }
}

module.exports = new TaskService();
