const request = require('supertest');
const db = require('../models/index');
const app = require('../app');

let server, agent;

describe("Todo test suite", () => {
    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
        server = app.listen(3000, () => {});
        agent = request.agent(server);
    });

    afterAll(async () => {
        await db.sequelize.close();
        server.close();
    });

    // Existing tests...

    test("Fetch all todos", async () => {
        // Create a few Todos to test the fetching functionality
        await agent.post('/todos').send({
            title: 'Buy milk',
            dueDate: new Date().toISOString(),
            completed: false,
        });
        await agent.post('/todos').send({
            title: 'Read a book',
            dueDate: new Date().toISOString(),
            completed: false,
        });

        // Fetch all Todos
        const response = await agent.get('/todos');
        console.log("Fetch all Todos response:", response.text); // Log the fetch response

        expect(response.statusCode).toBe(200); // Check if the status code is 200
        const todos = JSON.parse(response.text); // Parse the response text to JSON
        expect(Array.isArray(todos)).toBe(true); // Check if the response is an array
        expect(todos.length).toBeGreaterThan(0); // Ensure at least one Todo is returned
    });

    test("Delete a todo by ID", async () => {
        // Create a Todo to delete
        const createResponse = await agent.post('/todos').send({
            title: 'Buy milk',
            dueDate: new Date().toISOString(),
            completed: false,
        });
        const createdTodo = JSON.parse(createResponse.text);
        const todoID = createdTodo.id;
    
        // Log the created Todo ID
        console.log("Created Todo ID for deletion:", todoID);
    
        // Delete the created Todo
        const deleteResponse = await agent.delete(`/todos/${todoID}`);
        console.log("Delete response:", deleteResponse.text); // Log the delete response
        expect(deleteResponse.statusCode).toBe(200);
        expect(deleteResponse.text).toBe('true'); // Expecting true for successful deletion
    
        // Verify that the Todo is deleted
        const verifyResponse = await agent.get(`/todos/${todoID}`);
        console.log("Verify response for deleted Todo:", verifyResponse.statusCode); // Log the verify response
        expect(verifyResponse.statusCode).toBe(404); // Not found, since it should be deleted
    }, 10000); // Increase the timeout to 10 seconds
    
});
