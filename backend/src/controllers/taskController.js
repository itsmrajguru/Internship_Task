const taskService = require('../services/taskService');
const { validationResult } = require('express-validator');
const sendResponse = require('../utils/response');

exports.createTask = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendResponse(res, 400, false, 'Validation Error', null, errors.array());
    }

    try {
        const task = await taskService.createTask(req.user.id, req.body);
        return sendResponse(res, 201, true, 'Task created successfully', task);
    } catch (error) {
        next(error);
    }
};

exports.getTasks = async (req, res, next) => {
    try {
        const options = {
            search: req.query.search,
            status: req.query.status,
            page: req.query.page,
            limit: req.query.limit
        };
        const data = await taskService.getTasks(req.user.id, req.user.role, options);
        return sendResponse(res, 200, true, 'Tasks retrieved successfully', data);
    } catch (error) {
        next(error);
    }
};

exports.getTask = async (req, res, next) => {
    try {
        const task = await taskService.getTaskById(req.params.id, req.user.id, req.user.role);
        return sendResponse(res, 200, true, 'Task retrieved successfully', task);
    } catch (error) {
        if (error.message === 'Task not found') return sendResponse(res, 404, false, error.message);
        if (error.message === 'Not authorized') return sendResponse(res, 403, false, error.message);
        next(error);
    }
};

exports.updateTask = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendResponse(res, 400, false, 'Validation Error', null, errors.array());
    }

    try {
        const task = await taskService.updateTask(req.params.id, req.user.id, req.user.role, req.body);
        return sendResponse(res, 200, true, 'Task updated successfully', task);
    } catch (error) {
        if (error.message === 'Task not found') return sendResponse(res, 404, false, error.message);
        if (error.message === 'Not authorized') return sendResponse(res, 403, false, error.message);
        next(error);
    }
};

exports.deleteTask = async (req, res, next) => {
    try {
        await taskService.deleteTask(req.params.id, req.user.id, req.user.role);
        return sendResponse(res, 200, true, 'Task deleted successfully');
    } catch (error) {
        if (error.message === 'Task not found') return sendResponse(res, 404, false, error.message);
        if (error.message === 'Not authorized') return sendResponse(res, 403, false, error.message);
        next(error);
    }
};
