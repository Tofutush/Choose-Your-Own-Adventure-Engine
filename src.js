var fstGame, nowGame, preGame;
var page = {
	display: document.getElementById('display'),
	options: document.getElementById('options')
};
const deadOptions = loadXML('deadOptions.xml');
//loadXML('deadOptions.xml', 'options');

function elt(type,props,...children){let dom=document.createElement(type);if(props)Object.assign(dom,props);for(let child of children){if(typeof child!="string")dom.appendChild(child);else dom.appendChild(document.createTextNode(child));}return(dom);}

function loadXML(url, type) {
	let r = new XMLHttpRequest();
	let p = new DOMParser();
	r.open('GET', url, false);
	r.send(null);
	return p.parseFromString(r.responseText, 'text/xml').children[0];
}

function initGame(game) {
	fstGame.play();
}

//Outcome

function Outcome(dom) {
	this.dom = dom;
	this.type = dom.getAttribute('type');
	this.init();
}

Outcome.prototype.init = function() {
	this.display = new Display(this.dom.children[0], page.display);
	this.setOptions();
};

Outcome.prototype.setOptions = function() {
	switch(this.type) {
		case 'game':
			this.options = new Options(this.dom.children[1]);
			break;
		case 'dead':
			this.options = new Options(deadOptions);
			break;
		case 'back':
			console.log('back reached');
			break;
		case 'over':
			console.log('over reached');
			break;
		default:
			throw new Error(`unidentified Outcome type ${this.type}`);
	}
};

Outcome.prototype.play = function() {
	preGame = nowGame;
	nowGame = this;
	nowGame.display.show();
	nowGame.options.show();
};

//Display

function Display(dom, parent) {
	this.dom = dom;
	this.parent = parent;
	this.init();
}

Display.prototype.parseImg = function(img) {
	return elt('img', {src: 'comic/'+img.firstChild.nodeValue});
};

Display.prototype.parseText = function(txt) {
	return elt('p', {className: 'text'}, txt.firstChild.nodeValue);
};
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
};

Display.prototype.show = function() {
	this.parent.innerHTML = '';
	for(z = 0; z < this.elts.length; z++) {
		this.parent.appendChild(this.elts[z]);
	};
};

//Option

function Option(dom) {
	this.dom = dom;
	this.init();
}

Option.prototype.init = function() {
	this.button = elt('button');
	this.display = new Display(this.dom.children[0], this.button);
	this.display.show();
	this.outcome = new Outcome(this.dom.children[1]);
};

//Options

function Options(dom) {
	this.dom = dom;
	this.init();
}

Options.prototype.init = function() {
	this.elts = [];
	let children = this.dom.children;
	for(child of children) {
		this.elts.push(new Option(child));
	}
};

Options.prototype.show = function() {
	page.options.innerHTML = '';
	for(z = 0; z < this.elts.length; z++) {
		page.options.appendChild(this.elts[z].button);
	};
}
