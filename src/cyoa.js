var nowGame;
var gameGraph;
var page = { // stuff on document.body
	display: document.getElementById('display'),
	options: document.getElementById('options')
};
var globalRecency = 0; // recency (is this even a word?) is how you count what scene has been last reached. the larger the number, the more recent. STILL UNDER CONSTRUCTION!!!
//what r we gonna do w/ this recency?

const startOver = loadXML('src/startOver.xml');

function elt(type,props,...children){let dom=document.createElement(type);if(props)Object.assign(dom,props);for(let child of children){if(typeof child!="string")dom.appendChild(child);else dom.appendChild(document.createTextNode(child));}return(dom);}

function loadXML(url) {
	let r = new XMLHttpRequest();
	let p = new DOMParser();
	r.open('GET', url, false);
	r.send(null);
	return p.parseFromString(r.responseText, 'text/xml').children[0];
}

//Display: the actual thing you see on the screen

function Display(dom, where, id) {
	this.dom = dom;
	this.where = where; // "where" is the element the Display will be displayed on
	this.id = id;
	this.init();
}

Display.prototype.init = function() {
	this.elts = [];
	let children = this.dom.children;
	if(children.length)
		for(let z = 0; z < children.length; z++){
			switch(children[z].tagName) {
				case 'img':
					this.elts.push(elt('div', {className: 'display-img'}, elt('img', {src: 'assets/'+children[z].firstChild.nodeValue, id: `${this.id}-${z}`, style: children[z].getAttribute('style')})));
					break;
				case 'text':
					this.elts.push(elt('p', {className: 'display-text', id: `${this.id}-${z}`}, children[z].firstChild.nodeValue));
					break;
				default:
					console.log(children[z+1].innerText);
					throw new Error(`unidentified display tag ${children[z].tagName}`);
			}
		}
	else this.elts.push(elt('p', {className: 'display-text', id: `${this.id}-0`}, this.dom.firstChild.nodeValue));
};

Display.prototype.show = function() {
	this.where.innerHTML = '';
	for(let z = 0; z < this.elts.length; z++) {
		this.where.appendChild(this.elts[z]);
	};
};

//Option

function Option(dom, scene, id) {
	this.dom = dom;
	this.scene = scene;
	this.id = `${this.scene.id}-${id}`;
	this.button = elt('button', {className: 'choice-button', id: this.id});
	this.display = new Display(this.dom.children[0], this.button, `${this.id}-display`);
	this.display.show();
	this.button.addEventListener('click', () => {
		this.outcome.play();
	});
}

Option.prototype.click = function() {
	this.outcome.play();
};

// Game. a class with only one instance. do we keep it?

function Game(dom) {
	this.dom = dom;
	this.addScenes();
}

Game.prototype.initialize = function() {
	for(let z = 0; z < this.scenes.length; z++) {
		let ops = this.scenes[z].options;
		for(let x = 0; x < ops.length; x++) {
			ops[x].outcome = this.find(ops[x].dom.getAttribute('scene'));
		};
		this.scenes[z].addPointing();
	};
};

Game.prototype.addScenes = function() {
	this.scenes = [];
	let ch = this.dom.children;
	for(let z = 0; z < ch.length; z++) {
		this.scenes.push(new Scene(ch[z], ch[z].getAttribute('id')));
	};
};

Game.prototype.find = function(id) {
	for(let z = 0; z < this.scenes.length; z++) {
		if(this.scenes[z].id == id) return this.scenes[z];
	};
	throw new Error(`scene with the id ${id} is not found`);
};

// Scene: its what u see on the screen

function Scene(dom, id) {
	this.dom = dom;
	this.id = id;
	this.pointing = []; // the scenes its pointing to
	this.pointed = []; // the scenes that point to this
	this.recency = 0;
	this.display = new Display(this.dom.children[0], page.display, this.id);
	this.addOptions();
}

Scene.prototype.isDead = function() {
	return this.pointing.length = 0;
};

Scene.prototype.addOptions = function() {
	this.options = [];
	let ch = this.dom.children[1].children;
	for(let z = 0; z < ch.length; z++) {
		this.options.push(new Option(ch[z], this, z.toString()));
	};
	if(this.id !="game") this.options.push(new Option(startOver, this, ch.length));
};

Scene.prototype.addPointing = function() {
	for(let z = 0; z < this.options.length; z++) {
		this.pointing.push(this.options[z].outcome);
		this.options[z].outcome.pointed.push(this); // while this is recorded as pointing to that, that is also recorded as being pointed to by this
	};
};

Scene.prototype.showOptions = function() {
	page.options.innerHTML = '';
	for(let z = 0; z < this.options.length; z++) {
		page.options.appendChild(this.options[z].button);
	};
};

Scene.prototype.play = function() {
	nowGame = this;
	this.display.show();
	this.showOptions();
};

gameGraph = new Game(loadXML('assets/game.xml'));
gameGraph.initialize();
gameGraph.find('game').play();
