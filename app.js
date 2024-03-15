// index.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

let tasks = [];
let users=[];


// Route to register a new user 
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (findUserByUsername(username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const newUser = { username, password };
  users.push(newUser);
  res.status(201).json({ message: 'User registered successfully' });
});

// Route to login 
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = findUserByUsername(username);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username: user.username }, 'secretkey');
  res.json({ token });
});

// Route to create a new task
app.post('/tasks', (req, res) => {
  const { title, description, dueDate, category, priority } = req.body;
  const newTask = { title, description, dueDate, category, priority, completed: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Route to mark a task as completed
app.put('/tasks/:id/complete', (req, res) => {
  const taskId = req.params.id;
  const task = tasks.find(task => task.id === taskId);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  task.completed = true;
  res.json(task);
});

// Route to get tasks based on criteria
app.get('/tasks', (req, res) => {
  const { sortBy } = req.query;
  let sortedTasks = [...tasks];

  if (sortBy === 'dueDate') {
    sortedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  } else if (sortBy === 'category') {
    sortedTasks.sort((a, b) => a.category.localeCompare(b.category));
  } else if (sortBy === 'completed') {
    sortedTasks = sortedTasks.filter(task => task.completed);
  }

  res.json(sortedTasks);
});
// Helper function to validate priority levels
const isValidPriority = (priority) => {
    const validPriorities = ['High', 'Medium', 'Low'];
    return validPriorities.includes(priority);
  };
  
  // Updated POST route for creating tasks with priority
  app.post('/tasks', (req, res) => {
    const { title, description, dueDate, category, priority } = req.body;
  
    if (!isValidPriority(priority)) {
      return res.status(400).json({ message: 'Invalid priority level' });
    }
  
    const newTask = { title, description, dueDate, category, priority, completed: false };
    tasks.push(newTask);
    res.status(201).json(newTask);
  });
  
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
