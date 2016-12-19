'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

// create HTTP server
const server = express()
  .use((req, res) => res.sendFile(INDEX))
  .listen(PORT, () => console.log('listening on ${ PORT }'));

const io = socketIO(server);

// Handle connections
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => console.log('Client disconnected'));

  socket.on('command', command => console.log("command: " + command));
});
