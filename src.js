function loadGame() {
	let r = new XMLHttpRequest();
	let p = new DOMParser();
	r.open('GET', 'game.xml', false);
	r.send(null);
	console.log(r.responseText);
	dom = p.parseFromString(r.responseText, 'text/xml');
	console.log(dom);
	return dom;
}

game = loadGame();
