// Importar o módulo express
const express = require('express');
const app = express();

// Importar o http e atribuir à constante do express e criar um servidor
const http = require('http').createServer(app);

// Importar o socket.io e passar o servidor http como parâmetro
const io = require('socket.io')(http);

// Rota para a página inicial
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

// Armazenar os usuários conectados em um objeto
const connectedUsers = {};

// Função para notificar os usuários sobre um novo usuário conectado
function notifyNewUser(username) {
  io.emit('chat message', { name: '', message: `${username} conectou-se.`, connectMessage: true });
}

// Função para notificar os usuários sobre um usuário desconectado
function notifyUserDisconnected(username) {
  io.emit('chat message', { name: '', message: `${username} desconectou.`, connectMessage: true });
}

// Evento para o usuário se conectar ao servidor
io.on('connection', (socket) => {
  console.log('Um novo usuário conectou!');

  // Evento para quando o usuário envia uma mensagem via socket.io
  socket.on('chat message', (data) => {
    // Adicionar o nome de usuário e a mensagem aos dados
    data.name = connectedUsers[socket.id];
    io.emit('chat message', data);
  });

  // Evento para quando o usuário se conecta com um nome de usuário
  socket.on('user connected', (username) => {
    connectedUsers[socket.id] = username;
    notifyNewUser(username);
  });

  // Evento para quando o usuário desconectar
  socket.on('disconnect', () => {
    const username = connectedUsers[socket.id];
    delete connectedUsers[socket.id];
    notifyUserDisconnected(username);
    console.log('Usuário desconectou');
  });
});

// Iniciar o servidor na porta 3000
http.listen(3000, () => {
  console.log(`Servidor rodando na porta 3000 - Link http://localhost:3000`);
});
