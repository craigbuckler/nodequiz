// modules
import * as db from '../libshared/quizdb.js';
import { Player } from './player.js';


// active games
const gameActive = new Map();


// create and manage active game objects
export async function GameFactory( gameId ) {

  // game instance not exists?
  if ( !gameActive.has( gameId ) ) {

    // create new game instance
    const game = new Game();
    if ( await game.create( gameId ) ) {
      gameActive.set( gameId, game );
    }

  }

  return gameActive.get( gameId ) || null;

}


// individual game class
export class Game {

  gameId = null;
  player = new Map();
  cfg = null;
  #event = null;
  #state = {};

  // initialize game
  async create( gameId ) {

    // load game configuration
    this.gameId = gameId;
    this.cfg = await db.gameFetch( this.gameId );

    if (!this.cfg) return null;

    // fetch players attached to other servers
    (await db.playersFetch( this.gameId ))
      .forEach( p => this.playerAdd( new Player(p) ));

    // monitor incoming events
    this.#event = db.pubsub;
    this.#event.listen();
    this.#event.on(`event:${ this.gameId }`, e => this.#eventHandler(e));

    return this.gameId;

  }


  // incoming server event
  #eventHandler({ gameId, type, data }) {

    console.log('EVENT', type, data);

    if (gameId !== this.gameId || !type) return;

    // handle event
    switch (type) {

      // add player
      case 'playerAdd':
        if (!this.player.has(data.id)) {
          this.playerAdd( new Player( data ), false );
        }
        break;

      // remove player
      case 'playerRemove':
        this.player.delete( data.id );
        break;

      // start game
      case 'start':
        break;

    }

    // send to clients
    if (type) this.clientSend( type, data );

    // console.dir(this, { depth: null, color: true });
    // console.log(`player count: ${ this.player.size }`)

  }


  // incoming client event
  async clientMessage({ type, data }) {

    console.log('from client', type, data);

    if (type) await db.broadcast( this.gameId, type, data );

  }

  // send message to all connected clients
  clientSend(type, data) {
    this.player.forEach(p => p.send(type, data))
  }


  // return array of player { id, name } objects
  playerAll() {
    return Array.from( this.player, ([i, p]) => { return { id: p.id, name: p.name } } );
  }


  // add player to game
  async playerAdd( player, broadcast = true ) {

    // add player to this server
    this.player.set( player.id, player );

    // broadcast event
    if (broadcast) {

      await db.broadcast(
        this.gameId,
        'playerAdd',
        { id: player.id, game_id: this.gameId, name: player.name }
      );

    }

  }


  // remove player from game
  async playerRemove( player ) {

    await db.broadcast(
      this.gameId,
      'playerRemove',
      { id: player.id }
    );

  }

}
