const express = require('express');
const bodyParser = require('body-parser');
const { Todo } = require("./models"); // Import Todo model
const path = require('path');
const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Set up the view engine (ejs)
app.set("view engine", "ejs");

// Root route (GET /)
app.get('/', async (request, response) => {
  try {
    // Fetch all todos from the database
    const allTodos = await Todo.getTodos();
    
    if (request.accepts('html')) {
      // If the request is for HTML, render the index.ejs view
      response.render('index', { allTodos });
    } else {
      // Otherwise, respond with JSON
      response.json(allTodos);
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'An error occurred while fetching todos' });
  }
});

// Create a new todo (POST /todos)
app.post('/todos', async (request, response) => {
  console.log("Creating a todo", request.body);
  try {
    // Create a new todo in the database
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      completed: false,
    });
    // Respond with the created todo
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json({ error: 'Unable to create todo' });
  }
});

// Mark a todo as completed (PUT /todos/:id/markAsCompleted)
app.put('/todos/:id/markAsCompleted', async (request, response) => {
  console.log("Marking todo as completed with ID:", request.params.id);
  try {
    // Find the todo by primary key (ID)
    const todo = await Todo.findByPk(request.params.id);

    if (!todo) {
      return response.status(404).json({ error: 'Todo not found' });
    }

    // Mark the todo as completed
    const updatedTodo = await todo.markAsCompleted();
    
    // Respond with the updated todo
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json({ error: 'Unable to mark todo as completed' });
  }
});

// Delete a todo (DELETE /todos/:id)
app.delete('/todos/:id', async (request, response) => {
  console.log("Deleting todo with ID:", request.params.id);
  try {
    // Find the todo by primary key (ID)
    const todo = await Todo.findByPk(request.params.id);

    if (!todo) {
      return response.status(404).json({ error: 'Todo not found' });
    }

    // Delete the todo
    await todo.destroy();

    // Respond with a success message
    return response.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.log(error);
    return response.status(422).json({ error: 'Unable to delete todo' });
  }
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

module.exports = app;
