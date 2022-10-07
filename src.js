var nowGame;
var preGame;

function elt(type,props,...children){let dom=document.createElement(type);if(props)Object.assign(dom,props);for(let child of children){if(typeof child!="string")dom.appendChild(child);else dom.appendChild(document.createTextNode(child));}return(dom);}

function loadGame(url) {
	let r = new XMLHttpRequest();
	let p = new DOMParser();
	r.open('GET', url, false);
	r.send(null);
	return new Game(p.parseFromString(r.responseText, 'text/xml'));
}

function Game(dom) {
	this.game = dom.children[0];
	this.display = new Display(this.game.children[0]);
	this.options = new Options(this.game.children[1]);
}

function Display(dom) {
	this.dom = dom;
	this.init();
}

Display.prototype.parseImg = function(img) {
	return elt('img', {src: 'comic/'+img.firstChild.nodeValue});
}

Display.prototype.parseText = function(txt) {
	return elt('p', {className: 'text'}, txt.firstChild.nodeValue);
}

Display.prototype.init = function() {
	this.elts = [];
	let children = this.dom.children;
	for(z = 0; z < children.length; z++){
		switch(children[z].tagName) {
			case 'img':
				this.elts.push(this.parseImg(children[z]));
				break;
			case 'text':
				this.elts.push(this.parseText(children[z]));
				break;
			default:
				throw new Error(`unidentified display tag ${children[z].tagName}`);
		}
	}
}

function Options(dom) {
	this.dom = dom;
}
