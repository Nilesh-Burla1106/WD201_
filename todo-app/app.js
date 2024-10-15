const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const {Todo} = require('./models');


app.get('/todos', (request, response) => {
    console.log("Todo List");
})

app.post('/todos',async (request, response) => {
    console.log("Creating a todo", request.body);

    try{
        const todo = await Todo.addTodo({title: request.body.title, dueDate:request.body.dueDate, completed: false});
        return response.json(todo);
    }
    catch(error){
        console.log(error);
        return response.status(422).json(error);
    }
})

app.put('/todos/:id/markAsCompleted',async (request, response) => {
    console.log("We have to update a todo with id:", request.params.id);
    const todo = await Todo.findByPk(request.params.id);
    try{
        const updatedTodo = await todo.markAsCompleted();
        return response.json(updatedTodo);
    }
    catch(error){
        console.log(error);
        return response.status(422).json(error);
    }
})

app.delete("/todos/:id", async function (request, response) {
    console.log("We have to delete a Todo with ID: ", request.params.id);
    try {
      const result = await Todo.destroy({ where: { id: request.params.id } });
      console.log(`Deletion result for ID ${request.params.id}:`, result); // Log the deletion result
      response.send(result > 0);
    } catch (error) {
      console.log("Error deleting Todo:", error);
      return response.status(500).json({ error: "Failed to delete todo" });
    }
  });
  

module.exports = app;