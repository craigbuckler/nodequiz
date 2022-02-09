// modules
import * as player from './player.js';
import * as question from './question.js';

// DOM
const dom = {
  body: document.body,
  start: document.getElementById('start')
};

// state
const state = {
  current: 'join'
};

dom.body.className = state.current;

// handle WebSocket communication
const ws = new WebSocket( window.cfg.wsDomain );


// connect to server and send game ID and initial player name
ws.addEventListener('open', () => {
  sendMessage( 'gameInit', { gameId: window.cfg.gameId, playerName: window.cfg.playerName } );
});


// send message
function sendMessage(type, data = null) {
  ws.send( `${ type }:${ JSON.stringify( data ) }` );
}

// receive message
ws.addEventListener('message', e => {

  const { type, data } = parseMessage( e.data );
  if (!type || !data) return;

  console.log(type, data);

  switch (type) {

    case 'player':
      player.init( data );
      break;

    case 'playerAdd':
      player.add( data );
      break;

    case 'playerRemove':
      player.remove( data );
      break;

    case 'start':
      state.current = type;
      player.start( data.playerId );
      break;

    case 'questionactive':
      state.current = type;
      question.show( data );
      break;

  }

  dom.body.className = state.current;

});


// close connection
ws.addEventListener('close', () => {
  console.log('connection closed');
});


// start button
dom.start.addEventListener('click', e => {
  if (state.current === 'join') sendMessage('start');
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
