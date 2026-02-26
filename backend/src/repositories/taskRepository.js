const Task = require('../models/Task');

class TaskRepository {
    async create(taskData) {
        return await Task.create(taskData);
    }

    async findById(id) {
        return await Task.findById(id);
    }

    async findTasks(query, skip, limit) {
        return await Task.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
    }

    async countTasks(query) {
        return await Task.countDocuments(query);
    }

    async update(id, updateData) {
        return await Task.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }

    async delete(id) {
        return await Task.findByIdAndDelete(id);
    }
}

module.exports = new TaskRepository();
