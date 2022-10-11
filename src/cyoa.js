var fstGame = {}, // the first game, used in the "start over" option
	nowGame = {}, // the game were playing right now (do we even need this?)
	preGame = {}; // the previous game, used in the "back" option
var gameGraph;
var page = { // stuff on document.body
	display: document.getElementById('display'),
	options: document.getElementById('options')
};
var globalRecency = 0; // recency (is this even a word?) is how you count what scene has been last reached. the larger the number, the more recent. STILL UNDER CONSTRUCTION!!!

// const deadOptions = loadXML('src/deadOptions.xml'); // do we load it like that? or do we load them as separate options?

function elt(type,props,...children){let dom=document.createElement(type);if(props)Object.assign(dom,props);for(let child of children){if(typeof child!="string")dom.appendChild(child);else dom.appendChild(document.createTextNode(child));}return(dom);}

function loadXML(url) {
	let r = new XMLHttpRequest();
	let p = new DOMParser();
	r.open('GET', url, false);
	r.send(null);
	return p.parseFromString(r.responseText, 'text/xml').children[0];
}

/*DEEP AND SHALLOW COPY PROBLEM!!! presumed solved. i dont dare delete the code yet

// function painstakinglyTransferGameFromLastArgToTheFirst(f, l) {
// 	f.dom = l.dom.cloneNode(true);
// 	f.display.dom = l.display.dom.cloneNode(true);
// 	//f.options = l.options;
// }

// code from https://gist.github.com/GeorgeGkas/36f7a7f9a9641c2115a11d58233ebed2
// function clone(instance) {
// 	return Object.assign(
// 		Object.create(
// 			// Set the prototype of the new object to the prototype of the instance.
// 			// Used to allow new object behave like class instance.
// 			Object.getPrototypeOf(instance),
// 		),
// 		// Prevent shallow copies of nested structures like arrays, etc
// 		JSON.parse(JSON.stringify(instance)),
//  	);
// }

// code from https://stackoverflow.com/questions/16024940/how-do-i-clone-a-javascript-class-instance
// function clone2(obj) {
//   return Object.create(
//     Object.getPrototypeOf(obj),
//     Object.getOwnPropertyDescriptors(obj)
//   );
// }
*/

function initGame() {
}

//Outcome

/*function Outcome(dom, parent) {
	this.dom = dom;
	this.parent = parent; // parent can be the preceding game
	this.type = dom.getAttribute('type');
	//if(this.type == 'back') throw new Error('thrown');
}

Outcome.prototype.init = function() {
	switch(this.type) {
		case 'game':
			this.display = new Display(this.dom.children[0], page.display);
			this.options = new Options(this.dom.children[1], this); // if its a game, load options. do we load deadOptions or not
			//console.log('outcome\'s options\' parent', this.options.parent);
			break;
		case 'dead':
			this.display = new Display(this.dom.children[0], page.display);
			//this.options = new Options(deadOptions); // if its a dead end, load deadOptions
			this.options = new Options(false, this); // and now the Options class automatically loads deadOptions!
			break;
		case 'back': // cheesy way of dealing with this stuff. seems to work tho
			this.type = 'game';
			this.dom = preGame.dom;
			this.display = preGame.display;
			this.options = preGame.options;
			// console.log(this, this.parent);
			// this.dom = this.parent.dom;
			// this.display = this.parent.display;
			// this.options = this.parent.options;
			break;
		case 'over':
			this.type = 'game';
			this.dom = fstGame.dom;
			this.display = fstGame.display;
			this.options = fstGame.options;
			// fstGame.play();
			break;
		default:
			throw new Error(`unidentified Outcome type ${this.type}`);
	}
};

Outcome.prototype.play = function() {
	this.init();
	preGame = nowGame;
	nowGame = this;
	//console.log(this.parent);
	this.display.show();
	this.options.show();
};*/

//Display

function Display(dom, where) {
	this.dom = dom;
	this.where = where; // parent is the element the display will be displayed on
	this.init();
}

Display.prototype.init = function() {
	this.elts = [];
	let children = this.dom.children;
	if(children.length)
		for(let z = 0; z < children.length; z++){
			switch(children[z].tagName) {
				case 'img':
					this.elts.push(elt('img', {src: 'assets/'+children[z].firstChild.nodeValue}));
					break;
				case 'text':
					this.elts.push(elt('p', {className: 'text'}, children[z].firstChild.nodeValue));
					break;
				default:
					console.log(children[z+1].innerText);
					throw new Error(`unidentified display tag ${children[z].tagName}`);
			}
		}
	else this.elts.push(elt('p', {className: 'text'}, this.dom.firstChild.nodeValue));
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
	this.button = elt('button', {id: this.id});
	this.display = new Display(this.dom.children[0], this.button);
	this.button.addEventListener('click', () => {
		this.outcome.play();
	})
}

/*Option.prototype.init = function() {
	this.button = elt('button');
	this.display = new Display(this.dom.children[0], this.button);
	this.display.show();
	this.outcome = new Outcome(this.dom.children[1], this.parent.parent.parent);
	//console.log('this', this, 'parent', this.parent, 'double parent', this.parent.parent, 'triple parent', this.parent.parent.parent);
	this.button.addEventListener('click', () => {
		this.outcome.play();
	});
};*/

//Options
/*
function Options(dom, parent) {
	this.dom = dom || deadOptions;
	this.parent = parent; // parent is the Outcome object
	//console.log((this.dom == deadOptions ? 'deadOptions' : 'aliveOptions'), this.parent.parent);
	this.init();
}

Options.prototype.init = function() {
	this.elts = [];
	let children = this.dom.children;
	for(child of children) {
		this.elts.push(new Option(child, this));
	};
};

Options.prototype.addOption = function(o) {
	this.elts.push(new Option(o, this));
};

Options.prototype.show = function() {
	page.options.innerHTML = '';
	for(z = 0; z < this.elts.length; z++) {
		page.options.appendChild(this.elts[z].button);
	};
};*/

/*/ code from https://www.30secondsofcode.org/articles/s/js-data-structures-tree

/* class Scene {
// 	constructor(key, value = key, parent = null) {
// 		this.key = key;
// 		this.value = value;
// 		this.parent = parent;
// 		this.children = [];
// 	}
// 	get isLeaf() {
// 		return this.children.length === 0;
// 	}
// 	get hasChildren() {
// 		return !this.isLeaf;
// 	}
// }
//
// class Tree {
// 	constructor(key, value = key) {
// 		this.root = new TreeNode(key, value);
// 	}
// 	*preOrderTraversal(node = this.root) {
// 		yield node;
// 		if (node.children.length) {
// 			for (let child of node.children) {
// 				yield* this.preOrderTraversal(child);
// 			}
// 		}
// 	}
// 	*postOrderTraversal(node = this.root) {
// 		if (node.children.length) {
// 			for (let child of node.children) {
// 				yield* this.postOrderTraversal(child);
// 			}
// 		}
// 		yield node;
// 	}
// 	insert(parentNodeKey, key, value = key) {
// 		for (let node of this.preOrderTraversal()) {
// 			if (node.key === parentNodeKey) {
// 				return node.children.push(new TreeNode(key, value, node));
// 			}
// 		}
// 		return false;
// 	}
// 	remove(key) {
// 		for (let node of this.preOrderTraversal()) {
// 			const filtered = node.children.filter(c => c.key !== key);
// 			if (filtered.length !== node.children.length) {
// 				node.children = filtered;
// 				return true;
// 			}
// 		}
// 		return false;
// 	}
// 	find(key) {
// 		for (let node of this.preOrderTraversal()) {
// 			if (node.key === key) return node;
// 		}
// 		return undefined;
// 	}
// }*/

// Game: do we even need a class for this theres only gonna be one game oh wait maybe were gonna need a series of games haha more things for me to do great.
// NO WE WILL NOT HAVE A SERIES OF GAMES IF YOU REALLY WANT THAT EITHER MAKE THEM ONE GAME OR DISTRIBUTE THEM AS SEPARATE STUFF NO NO NO

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
}

Game.prototype.addScenes = function() {
	this.scenes = [];
	let ch = this.dom.children;
	for(let z = 0; z < ch.length; z++) {
		console.log(ch[z].getAttribute('id'));
		this.scenes.push(new Scene(ch[z], ch[z].getAttribute('id')));
	};
};

Game.prototype.find = function(id) {
	for(let z = 0; z < this.scenes.length; z++) {
		if(this.scenes[z].id == id) return this.scenes[z];
	};
	throw new Error('scene of id', id, 'not found');
};

// Scene: its what u see on the screen

function Scene(dom, id) {
	this.dom = dom;
	this.id = id;
	this.pointing = []; // the scenes its pointing to
	this.pointed = []; // the scenes that point to this
	this.recency = 0;
	this.display = new Display(this.dom.children[0], page.display);
	this.addOptions();
	//this.addPointing();
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
};

Scene.prototype.addPointing = function() { // add must be another scene.
	for(let z = 0; z < this.options.length; z++) {
		this.pointing.push(this.options[z].outcome);
		this.options[z].outcome.pointed.push(this); // while this is recorded as pointing to that, that is also recorded as being pointed to by this
	};
};

Scene.prototype.play = function() {

};

gameGraph = new Game(loadXML('assets/game.xml'));
gameGraph.initialize();
console.log(gameGraph.find('game'));
