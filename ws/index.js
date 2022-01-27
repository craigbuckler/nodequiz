// WebSocket server
import WebSocket, { WebSocketServer } from 'ws';

// configuration
const cfg = {
  wsPort:   process.env.NODE_WSPORT || 8001
};

const ws = new WebSocketServer({ port: cfg.wsPort });

// client connection
ws.on('connection', (socket, req) => {

  console.log(`connection from ${ req.socket.remoteAddress }`);

  // received message
  socket.on('message', (msg, binary) => {

    // broadcast to all clients
    ws.clients.forEach(client => {
      client.readyState === WebSocket.OPEN && client.send(msg, { binary });
    });

  });

  // closed
  socket.on('close', () => {
    console.log(`disconnection from ${ req.socket.remoteAddress }`);
  });

});
