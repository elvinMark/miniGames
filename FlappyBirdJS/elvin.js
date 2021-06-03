var ctx;
var HEIGHT;
var WIDTH;
var QUARTER_PI = Math.PI/4;
var HALF_PI = Math.PI/2;
var PI = Math.PI;
var TWO_PI = 2*Math.PI;

var binary = ["0","1"];
var hex = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
var stroking = true;
var filling = false;
var mouseX;
var mouseY;
var key;


//Useful Functions
function dec2hex(num){
	if(num/16 < 1)
		return hex[num];
	else{
		var d = Math.floor(num/16);
		var r = num%16; 
		return  dec2hex(d)+hex[r];
	}
}
function rgb(r,g,b){
	var cr = dec2hex(r);
	cr = cr.length==1? "0"+cr:cr;
	var cg = dec2hex(g);
	cg = cg.length==1? "0"+cg:cg;
	var cb = dec2hex(b);
	cb = cb.length==1? "0"+cb:cb;
	return "#"+cr+cg+cb;
};

function map(x,a,b,p,q){
	return p + (q-p)*(x-a)/(b-a);
};

function print(s){
	console.log(s);
};

function int(num){
	return Math.floor(num);
};

function random(){
	return Math.random();
};

//Canvas related functions 
function createCanvas(w,h){
	document.body.innerHTML = "<canvas id='mycanvas' style='border: solid 2px;' width='"+500+ "' height='"+500+"'></canvas>";
	WIDTH = w;
	HEIGHT = h;
	ctx = document.getElementById("mycanvas").getContext("2d");
};
function setSize(w,h){
	HEIGHT = h;
	WIDTH = w;
	var c = document.getElementById("mycanvas");
	c.width = w;
	c.height = h;
};

function save(){
	ctx.save();
};

function push(){
	ctx.save();
};

function restore(){
	ctx.restore();
};

function pop(){
	ctx.restore();
}

function translate(x,y){
	ctx.translate(x,y);
};

function rotate(angle){
	ctx.rotate(angle);
};

function noStroke(){
	stroking = false;
};

function stroke(r,g,b){
	if(g==null || b==null)
		ctx.strokeStyle = rgb(r,r,r);
	else
		ctx.strokeStyle = rgb(r,g,b);
	stroking = true;
};

function strokeWeight(w){
	ctx.lineWidth = w;
};

function noFill(){
	filling = false;
}

function fill(color){
	ctx.fillStyle = color;
	filling = true;
};

function line(x1,y1,x2,y2){
	save();
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.stroke();
	restore();
}

function rect(x,y,w,h){
	save();
	ctx.beginPath();
	ctx.rect(x,y,w,h);
	if(stroking)
		ctx.stroke();
	if(filling)
		ctx.fill();
	restore();
};

function ellipse(x,y,w,h){
	save();
	ctx.beginPath();
	ctx.ellipse(x,y,w/2,h/2,0,0,2*Math.PI);
	if(stroking)
		ctx.stroke();
	if(filling)
		ctx.fill();
	restore();
};

function background(r,g,b){
	save();
	if(g==null || b==null)
		fill(rgb(r,r,r));
	else
		fill(rgb(r,g,b));
	noStroke();
	rect(0,0,WIDTH,HEIGHT);
	restore();
};

function getMouseInfo(event){
	mouseX = event.offsetX;
	mouseY = event.offsetY;
};

function getKeyInfo(event){
	key = event.key;
};

var eVector = function(x,y){
	this.x = x;
	this.y = y;
	this.add = function(v){
		this.x += v.x;
		this.y += v.y;
	};
	this.diff = function(v){
		this.x -= v.x;
		this.y -= v.y;
	};
	this.times = function(num){
		this.x *= num;
		this.y *= num;
	};
	this.dot = function(v){
		return this.x*v.x + this.y*v.y;
	};
	this.norm = function(){
		return Math.sqrt(this.x*this.x + this.y*this.y);
	};
	this.normalize = function(){
		var d = this.norm();
		this.x /= d;
		this.y /= d;
	};
	this.rotate = function(angle){
		var x = this.x;
		var y = this.y;
		this.x = x*Math.cos(angle) + y*Math.sin(angle);
		this.y = -x*Math.sin(anlge) + y*Math.cos(angle); 
	};
	this.copy = function(){
		return new eVector(this.x,this.y);
	};
};

var gravity = new eVector(0,3);

document.body.addEventListener("mousemove",getMouseInfo);
document.body.addEventListener("keydown",getKeyInfo);