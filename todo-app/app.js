const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const { Todo } = require('./models');

// Fetch all To-Dos from the database
app.get('/todos', async (request, response) => {
    console.log("Fetching all todos");
    try {
        const todos = await Todo.findAll(); // Fetch all To-Dos from the database
        return response.json(todos); // Return the list of To-Dos as JSON
    } catch (error) {
        console.log(error);
        return response.status(500).json({ error: "Failed to fetch todos" });
    }
});

// Create a new To-Do
app.post('/todos', async (request, response) => {
    console.log("Creating a todo", request.body);
    try {
        const todo = await Todo.addTodo({
            title: request.body.title,
            dueDate: request.body.dueDate,
            completed: false,
        });
        return response.json(todo);
    } catch (error) {
        console.log(error);
        return response.status(422).json(error);
    }
});

// Mark a To-Do as completed
app.put('/todos/:id/markAsCompleted', async (request, response) => {
    console.log("We have to update a todo with id:", request.params.id);
    try {
        const todo = await Todo.findByPk(request.params.id);
        const updatedTodo = await todo.markAsCompleted();
        return response.json(updatedTodo);
    } catch (error) {
        console.log(error);
        return response.status(422).json(error);
    }
});

// Delete a To-Do by ID
app.delete("/todos/:id", async function (request, response) {
    console.log("We have to delete a Todo with ID: ", request.params.id);
    try {
        const result = await Todo.destroy({ where: { id: request.params.id } });
        console.log(`Deletion result for ID ${request.params.id}:`, result); // Log the deletion result
        response.send(result > 0); // Send true if a Todo was deleted
    } catch (error) {
        console.log("Error deleting Todo:", error);
        return response.status(500).json({ error: "Failed to delete todo" });
    }
});

module.exports = app;
