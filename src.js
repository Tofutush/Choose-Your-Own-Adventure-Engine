var fstGame = {}, // the first game, used in the "start over" option
	nowGame = {}, // the game were playing right now (do we even need this?)
	preGame = {}; // the previous game, used in the "back" option
var page = { // stuff on document,body
	display: document.getElementById('display'),
	options: document.getElementById('options')
};
const deadOptions = loadXML('deadOptions.xml'); // do we load it like that? or do we load them as separate options?

function elt(type,props,...children){let dom=document.createElement(type);if(props)Object.assign(dom,props);for(let child of children){if(typeof child!="string")dom.appendChild(child);else dom.appendChild(document.createTextNode(child));}return(dom);}

function loadXML(url, type) {
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

function initGame(game) { // do we need a one-line function like this?
	fstGame.play();
}

//Outcome

function Outcome(dom) {
	this.dom = dom;
	this.type = dom.getAttribute('type');
}

Outcome.prototype.init = function() {
	switch(this.type) {
		case 'game':
			this.display = new Display(this.dom.children[0], page.display);
			this.options = new Options(this.dom.children[1]); // if its a game, load options. do we load deadOptions or not
			break;
		case 'dead':
			this.display = new Display(this.dom.children[0], page.display);
			//this.options = new Options(deadOptions); // if its a dead end, load deadOptions
			this.options = new Options();
			break;
		case 'back': // cheesy way of dealing with this stuff. seems to work tho
			this.type = 'game';
			this.dom = preGame.dom;
			this.display = preGame.display;
			this.options = preGame.options;
			break;
		case 'over':
			this.type = 'game';
			this.dom = fstGame.dom;
			this.display = fstGame.display;
			this.options = fstGame.options;
			break;
		default:
			throw new Error(`unidentified Outcome type ${this.type}`);
	}
};

Outcome.prototype.play = function() {
	this.init();
	preGame = nowGame;
	nowGame = this;
	this.display.show();
	this.options.show();
};

//Display

function Display(dom, parent) {
	this.dom = dom;
	this.parent = parent; // parent is the element the display will be displayed on
	this.init();
}

Display.prototype.parseImg = function(img) { // do we even need these two one-line functions
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
				console.log(children[z+1].innerText);
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
	this.button.addEventListener('click', () => {
		this.outcome.play();
	});
};

//Options

function Options(dom) {
	this.dom = dom || deadOptions;
	this.init();
}

Options.prototype.init = function() {
	this.elts = [];
	let children = this.dom.children;
	for(child of children) {
		this.elts.push(new Option(child));
	};
};

Options.prototype.addOption = function(o) {
	this.elts.push(new Option(o));
};

Options.prototype.show = function() {
	page.options.innerHTML = '';
	for(z = 0; z < this.elts.length; z++) {
		page.options.appendChild(this.elts[z].button);
	};
};
