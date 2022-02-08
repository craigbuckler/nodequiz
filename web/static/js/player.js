// player list
const
  pList = document.getElementById('player'),
  pNum = document.getElementById('pnum'),
  player = new Map();


// clear element
function clear(node) {
  while (node.lastChild) node.removeChild(node.lastChild);
}


// add new players
export function init(pAll) {
  clear(pList);
  player.clear();
  pAll.forEach(p => add(p));
}


// add a new player
export function add(p) {

  if (!p.id || player.has(p.id)) return;

  const item = document.createElement('li');
  (item.appendChild(document.createElement('strong'))).textContent = p.name;
  item.appendChild(document.createElement('span'));

  const pObj = {
    name: p.name,
    node: pList.appendChild(item)
  }
  pObj.span = pObj.node.getElementsByTagName('span')[0];

  player.set(p.id, pObj);
  pNum.textContent = player.size;

}

// started
export function start(pId) {

  if (!player.has(pId)) return;
  player.get(pId).span.textContent = ' has started the game';

}


// remove existing player
export function remove(p) {

  if (!p.id || !player.has(p.id)) return;

  pList.removeChild( player.get(p.id).node );
  player.delete(p.id);

}
