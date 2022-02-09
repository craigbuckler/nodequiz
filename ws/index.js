// modules
import { WebSocketServer } from 'ws';
import { Player } from './lib/player.js';


const
  // configuration
  cfg = {
    wsPort: process.env.NODE_WSPORT || 8001
  },

  // server
  ws = new WebSocketServer({ port: cfg.wsPort, perMessageDeflate: false });


// client connection
ws.on('connection', (socket, req) => {

  let player = null;

  console.log(`connection from ${ req.socket.remoteAddress }`);

  // received message
  socket.on('message', async (msg) => {

    // parse message
    msg = parseMessage(msg);

    // initialize player and game
    if (!player && msg.type === 'gameInit' && msg.data) {

      player = new Player();
      const pId = await player.create( msg.data.gameId, msg.data.playerName, socket );
      if (!pId) player = null;

    }
    else {

      // pass message to game
      msg.data = msg.data || {};
      msg.data.playerId = player.id;
      await player.game.clientMessage( msg );

    }


  });

  // closed
  socket.on('close', async () => {

    console.log(`disconnection from ${ req.socket.remoteAddress }`);

    // remove player
    if (player) {
      await player.game.playerRemove( player );
    }

  });

});


// parse incoming message in format "type:data"
// e.g. 'myMessage:{"value",123}' returns { type: "myMessage", data: { "value": 123 }}
function parseMessage( msg ) {

  msg = msg.toString().trim();

  let
    s = msg.indexOf(':'),
    type = null,
    data = {};

  if (s > 0) {
    type = msg.slice(0, s);
    data = msg.slice(s + 1);

    try {
      let json = JSON.parse(data);
      data = json;
    }
    catch(e){}

  }
  else {
    type = msg;
  }

  return { type, data };

}
