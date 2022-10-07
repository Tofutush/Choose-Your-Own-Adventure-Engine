function loadGame() {
	let r = new XMLHttpRequest();
	let p = new DOMParser();
	r.open('GET', 'game.xml', false);
	r.send(null);
	return p.parseFromString(r.responseText, 'text/xml');
}
game = loadGame();
