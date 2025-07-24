import { defineStore } from 'pinia'
import { API_BASE_URL } from '~/static/appConfig';

export const Apistore = defineStore('Apistore', () => {
  // Get all tasks
 const getTasks = async () => {
    try {
      const response = await $fetch(`${API_BASE_URL}/tasks/get`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      return null;
    }
  };

// Create a task
 const createTask = async (taskData) => {
    try {
      const response = await $fetch(`${API_BASE_URL}/tasks/create`, {
        method: 'POST',
        body: taskData,
      });
      return response;
    } catch (error) {
      console.error('Failed to create task:', error);
      return null;
    }
  };

// Update a task
const updateTask = async (taskData) => {
  try {
    const response = await $fetch(`${API_BASE_URL}/tasks/update`, {
      method: 'POST',
      body: taskData,
    });
    return response;
  } catch (error) {
    console.error('Failed to update task:', error);
    return null;
  }
};

// Delete a task by id
const deleteTask = async (id) => {
  try {
    const response = await $fetch(`${API_BASE_URL}/tasks/delete`, {
      method: 'POST',
      body: { id },
    });
    return response;
  } catch (error) {
    console.error('Failed to delete task:', error);
    return null;
  }
};
  return { getTasks, createTask, updateTask, deleteTask }
})