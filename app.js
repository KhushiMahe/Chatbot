const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const ejs = require('ejs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

const todoList = [];

app.get('/', (req, res) => {
  res.render('chat');
});

app.get('/todo', (req, res) => {
  res.render('todo', { tasks: todoList });
});

io.on('connection', (socket) => {
  console.log('A user has connected.');

  socket.on('message', (message) => {
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('A user has disconnected.');
  });
});

app.post('/addTask', (req, res) => {
  const { task } = req.body;
  if (task.trim() !== '') {
    todoList.push(task);
  }
  res.redirect('/todo');
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
