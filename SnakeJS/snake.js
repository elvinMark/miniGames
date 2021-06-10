var CANVAS_WIDTH = 500;
var CANVAS_HEIGHT = 500;

var BLOCK_WIDTH = 10;
var BLOCK_HEIGHT = 10;
var BLOCK_COLOR = "#AA22BB";

var FOOD_COLOR = "#FF0000";

var EVector = function(x,y){
	this.x = x;
	this.y = y;
	this.add = function(v){
		this.x = (this.x + v.x );
		this.y = (this.y + v.y );
	};
	this.dist = function(v){
		return Math.sqrt((this.x - v.x)**2 + (this.y - v.y)**2);
	};
	this.set = function(v){
		this.x = v.x;
		this.y = v.y;
	};
	this.equal = function(v){
		return this.x == v.x && this.y==v.y;
	};
	EVector.random = function(){
		var x = (Math.round(CANVAS_WIDTH*Math.random()*0.8/BLOCK_WIDTH + 1)) * BLOCK_WIDTH + BLOCK_WIDTH/2;
		var y = (Math.round(CANVAS_HEIGHT*Math.random()*0.8/BLOCK_HEIGHT + 1)) * BLOCK_HEIGHT + BLOCK_HEIGHT/2;
		return new EVector(x,y); 
	};
};

var left = new EVector(-BLOCK_WIDTH,0);
var right = new EVector(BLOCK_WIDTH,0);
var up = new EVector(0,-BLOCK_HEIGHT);
var down = new EVector(0,BLOCK_HEIGHT);

var EBlock = function(p){
	this.pos = p;
	this.vel = new EVector(0,0);
	this.draw = function(ctx){
		ctx.beginPath();
		ctx.fillStyle = BLOCK_COLOR;
		ctx.rect(this.pos.x - BLOCK_WIDTH/2,this.pos.y - BLOCK_HEIGHT/2,BLOCK_WIDTH,BLOCK_HEIGHT);
		ctx.stroke();
		ctx.fill();
	};
	this.setVelocity = function(v){
		this.vel.set(v);
	};
	this.update = function(){
		this.pos.add(this.vel);
	};
	this.equal = function(b){
		return this.pos.equal(b.pos);
	};
	this.outOfBounds = function(){
		return this.pos.x <= 0 || this.pos.y <= 0 || this.pos.x>=CANVAS_WIDTH || this.pos.y>=CANVAS_HEIGHT;
	};
};

var INIT_SPEED = new EVector(BLOCK_WIDTH,0);

var ESnake = function(p){
	this.blocks = [];
	
	this.pos = p;
	for(var i = 0;i<3;i++){
		this.blocks.push(new EBlock(new EVector(this.pos.x - i*BLOCK_WIDTH,this.pos.y)));	
	}
	this.draw = function(ctx){
		for(var i in this.blocks){
			this.blocks[i].draw(ctx);
		}
	};
	this.init = function(){
		for(var i in this.blocks){
			this.blocks[i].setVelocity(INIT_SPEED);
		}
	}
	this.update = function(){
		for(var i in this.blocks){
			this.blocks[i].update();
		}
		for(var i = this.blocks.length-1;i>0;i--)
			this.blocks[i].setVelocity(this.blocks[i-1].vel);
	};
	this.setVelocity = function(v){
		if(this.blocks[0].vel.x == -v.x || this.blocks[0].vel.y == -v.y)
			return;
		this.blocks[0].vel.set(v);
	};
	this.addBlock = function(){
		var last = this.blocks[this.blocks.length-1];
		var v = last.vel;
		var b = new EBlock(new EVector(last.pos.x - v.x,last.pos.y - v.y));
		b.setVelocity(v);
		this.blocks.push(b);
	};
	this.hit = function(){
		for(var i = 1;i<this.blocks.length;i++){
			if(this.blocks[i].equal(this.blocks[0]))
				return true;
		};
		return this.blocks[0].outOfBounds();
	};
	this.eat = function(food){
		return this.blocks[0].pos.dist(food.pos) < BLOCK_WIDTH/2;
	};
};

var EFood = function(){
	this.pos = EVector.random();
	this.draw = function(ctx){
		ctx.beginPath();
		ctx.fillStyle = FOOD_COLOR;
		ctx.fillRect(this.pos.x - BLOCK_WIDTH/2,this.pos.y - BLOCK_HEIGHT/2,BLOCK_WIDTH,BLOCK_HEIGHT);
	};
};



var max_time = 100;
var state;
var EGame = function(){
	this.s = new ESnake(new EVector(CANVAS_WIDTH/2 + BLOCK_WIDTH/2,CANVAS_HEIGHT/2+BLOCK_HEIGHT/2));
	this.food = new EFood();
	this.draw = function(ctx){
		this.s.draw(ctx);
		this.food.draw(ctx);
	};
	this.init = function(){
		this.s.init();
	};
	this.update = function(){
		this.s.update();
		if(this.s.eat(this.food)){
			this.s.addBlock();
			this.food = new EFood();
		}
	};
	this.loose = function(){
		return this.s.hit();
	};
	this.control = function(v){
		this.s.setVelocity(v);
	};
	this.test = function(nn){
		this.init();
		for(var i = 0;i<max_time;i++){
			if(this.loose())
				break;
			this.control(nn.getControl(state));
			this.update();
		};	
	};
}

var clearScreen = function(ctx){
	ctx.beginPath();
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
}

var drawBackground = function(ctx){
	var N = CANVAS_WIDTH/BLOCK_WIDTH;
	var M = CANVAS_HEIGHT/BLOCK_HEIGHT;
	ctx.beginPath();
	for(var i = 0;i<N;i++){
		ctx.moveTo(i*BLOCK_WIDTH,0);
		ctx.lineTo(i*BLOCK_WIDTH,CANVAS_HEIGHT);
		for(var j = 0;j<M;j++){
			ctx.moveTo(0,j*BLOCK_HEIGHT);
			ctx.lineTo(CANVAS_WIDTH,j*BLOCK_HEIGHT);
		}
	}
	ctx.stroke();
}