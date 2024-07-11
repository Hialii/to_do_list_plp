const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const dataPath = path.join(__dirname, 'data', 'tasks.json');

const readTask = () => {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify([]));
  }

  const data = fs.readFileSync(dataPath); 
  return JSON.parse(data);
};

const writeTasks = (tasks) => {
  fs.writeFileSync(dataPath, JSON.stringify(tasks, null, 2)); 
};

app.get('/', (req, res) => {
  const tasks = readTask();
  res.render('index', { items: tasks });
});

app.post('/', (req, res) => {
  const tasks = readTask();
  const newItem = req.body.newItem;
  tasks.push({ id: Date.now().toString(), name: newItem });
  writeTasks(tasks);
  res.redirect('/');
});

app.post('/delete', (req, res) => {
  const tasks = readTask();
  const itemId = req.body.checkbox;
  const updatedTasks = tasks.filter((task) => task.id !== itemId);
  writeTasks(updatedTasks);
  res.redirect('/');
});

app.listen(8000, () => {
  console.log('SERVIDOR RODANDO');
});
