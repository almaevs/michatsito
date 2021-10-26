const express = require('express');
var app = require('express')();
var bodyParser=require('body-parser');
var server = require('http').Server(app);
var io = require('socket.io')(server);

var clientes = [];

var app=express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
port=process.env.PORT||8080
server.listen(port, () => console.log('Servidor iniciado en 8080'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/chat/:username', function (req, res) {
  res.sendFile(__dirname + '/public/chat.html');
});

app.post('/login', function (req, res) {
  let username = req.body.username;
  let id = req.body.id;
  clientes.push({id: id, username: username});
  io.emit('socket_conectado', {id: id, username: username});
  return res.json(clientes);
});

app.post('/send', function (req, res) {
  let username = req.body.username;
  let id = req.body.id;
  let msg = req.body.text;
  io.emit('mensaje', {id: id, msg: msg, username: username});
  return res.json({text: 'Mensaje enviado.'});
});

io.on('connection', socket => {
  console.log('Socket conectado', socket.id);
  socket.on('disconnect', () => {
    clientes = clientes.filter(cliente => cliente.id != socket.id);
    io.emit('socket_desconectado', {texto: 'Socket desconectado.', id: socket.id});
  });
});
