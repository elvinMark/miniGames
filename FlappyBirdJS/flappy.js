var rectW  = 50;
var rectColor = rgb(100,200,20);
var maxWalls = 20;

var birdD = 2*20;
var birdColor = rgb(200,20,100);

var camSpeed = new eVector(-10,0);

var FPS = 1000/60;

var impulse = new eVector(0,-20);
var maxSpeed = 50;

var eRect = function(p,h){
	this.p = p;
	this.h = h;
	this.update = function(){
		this.p.add(camSpeed);
	};
	this.draw = function(){
		save();
		fill(rectColor);
		strokeWeight(2);
		rect(this.p.x,this.p.y,rectW,this.h);
		restore();
	};
};

var eBird = function(p){
	this.p = p;
	this.vel = new eVector(0,0);
	this.impulse = function(){
		this.vel.add(impulse);
	};
	this.applyAcc = function(acc){
		this.vel.add(acc);
	};
	this.update = function(){
		if(key==" "){
			this.impulse();
			key = "";
		}
		this.applyAcc(gravity);
		if(this.vel.norm()>maxSpeed){
			this.vel.normalize();
			this.vel.times(maxSpeed);
		}
		this.p.add(this.vel);
	};
	this.draw = function(){
		save();
		fill(birdColor);
		strokeWeight(2);
		ellipse(this.p.x,this.p.y,birdD,birdD);
		restore();
	};
};

var eGame = function(){
	createCanvas(500,500);
	background(200);
	this.bird = new eBird(new eVector(100,HEIGHT/2));
	this.walls = [];
	this.flag = true;
	var x0 = 200;
	for(var i = 0;i<maxWalls;i++){
		var k = int(map(random(),0,1,5,10));
		var x = x0 + k*rectW;
		x0 = x;
		var h = int(map(random(),0,1,50,300));
		if(random()>0.5)
			this.walls.push(new eRect(new eVector(x,0),h));
		else
			this.walls.push(new eRect(new eVector(x,HEIGHT),-h));
	}
	this.collide = function(){
		for(var elem of this.walls){
			if(this.bird.p.x>(elem.p.x - birdD/2) && this.bird.p.x<(elem.p.x+ birdD/2 + rectW)){
				if(elem.p.y == 0){
					if(this.bird.p.y<elem.h)
						return true;
				}
				else{
					if(this.bird.p.y>(elem.p.y + elem.h))
						return true;
				}
			}
		}
		return false;
	}
	this.update = function(){
		this.bird.update();
		for(var elem of this.walls){
			elem.update();
		};
	};
	this.draw = function(){
		this.bird.draw();
		for(var elem of this.walls){
			elem.draw();
		};
	};
	this.blit = function(){
		if(this.flag){
			background(200);
			this.update();
			this.draw();
			if(this.collide()){
				this.flag = false;
			}
		}
	};
	this.run = function(){
		window.setInterval(()=>{this.blit()},100);
	};
};

