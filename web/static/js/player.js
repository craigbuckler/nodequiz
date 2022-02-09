// player list
import { clear } from './utils.js';
import { startTimer  } from './timer.js';

const
  pList = document.getElementById('player'),
  pNum = document.getElementById('pnum'),
  player = new Map();

// add new players
export function init(pAll) {
  clear(pList);
  player.clear();
  pAll.forEach(p => add(p));
}


// add a new player
export function add(p) {

  if (!p.id || player.has(p.id)) return;

  const item = document.createElement('tr');
  (item.appendChild(document.createElement('th'))).textContent = p.name;
  item.appendChild(document.createElement('td'));

  const pObj = {
    name: p.name,
    node: pList.appendChild(item)
  };
  pObj.info = pObj.node.getElementsByTagName('td')[0];

  player.set(p.id, pObj);
  pNum.textContent = player.size;

}

// started
export function start(pId) {

  if (!player.has(pId)) return;
  player.get(pId).info.textContent = ' has started the game';
  startTimer();

}


// remove existing player
export function remove(p) {

  if (!p.id || !player.has(p.id)) return;

  pList.removeChild( player.get(p.id).node );
  player.delete(p.id);

}
