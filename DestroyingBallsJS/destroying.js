var CANVAS_HEIGHT = 500;
var CANVAS_WIDTH = 500;

var MARGIN_X = 0;
var MARGIN_Y = 0;

var EVector = function(x,y){
	this.x = x;
	this.y = y;
	this.dist = function(v){
		return Math.sqrt((this.x -v.x)**2 + (this.y - v.y)**2);
	};
	this.mag = function(){
		return Math.sqrt(this.x**2 + this.y**2);
	};
	this.normalize = function(){
		var d = Math.sqrt(this.x**2 + this.y**2);
		this.x /= d;
		this.y /= d;	
	};
	this.add = function(v){
		this.x += v.x;
		this.y += v.y;
	};
	this.diff = function(v){
		this.x -= v.x;
		this.y -= v.y;	
	};
	this.dot = function(v){
		return this.x*v.x + this.y*v.y;
	};
	this.timesScalar = function(s){
		this.x *= s;
		this.y *= s;
	};
	this.rotate = function(angle){
		return new EVector(Math.cos(angle)*this.x - Math.sin(angle)*this.y, Math.sin(angle)*this.x + Math.cos(angle)*this.y);
	};
	this.set = function(x,y){
		this.x = x;
		this.y = y;
	};
	this.clone = function(){
		return new EVector(this.x,this.y);
	};
	EVector.add = function(v1,v2){
		return new EVector(v1.x + v2.x, v1.y + v2.y);
	};
	EVector.diff = function(v1,v2){
		return new EVector(v1.x - v2.x, v1.y - v2.y);
	};
	EVector.timesScalar = function(v,s){
		return new EVector(s*v.x,s*v.y);
	};	
};

var EBall = function(m,p,r,c){
	this.mass = m;
	this.pos = p;
	this.radius = r;
	this.color = c;
	this.vel = new EVector(0,0);
	this.acc = new EVector(0,0);

	this.setVelocity = function(vx,vy){
		this.vel.set(vx,vy);
	};
	this.update = function(){
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		if(this.pos.x - this.radius <= MARGIN_X){
			this.vel.x = -this.vel.x;
			this.pos.x = this.radius + MARGIN_X;
		}
		if(this.pos.x + this.radius >= CANVAS_WIDTH - MARGIN_X){
			this.vel.x = -this.vel.x;
			this.pos.x = CANVAS_WIDTH - MARGIN_X - this.radius;
		}
		if(this.pos.y - this.radius <= MARGIN_Y){
			this.vel.y = -this.vel.y;
			this.pos.y = MARGIN_Y + this.radius;
		}
		if(this.pos.y + this.radius >= CANVAS_HEIGHT - MARGIN_Y){
			this.vel.y = -this.vel.y;
			this.pos.y = CANVAS_HEIGHT - MARGIN_Y - this.radius;
		}
	};
	this.hitRoof = function(){	
		return this.pos.y - this.radius== MARGIN_Y;
	}
	this.applyForce = function(force){
		this.acc.set(force.x/this.mass,force.y/this.mass);
	};
	this.applyAcc = function(acc){
		this.acc.set(acc.x,acc.y);
	};
	this.draw = function(ctx){
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.pos.x,this.pos.y,this.radius,0,2*Math.PI);
		ctx.lineWidth = 3;
		ctx.stroke();
		ctx.fill();
	};
	this.drawType = function(ctx){
		ctx.save();
		ctx.beginPath();
		ctx.font = this.radius/1.5 + "px Arial";
		ctx.fillStyle = "#000000";
		ctx.fillText(""+this.radius,this.pos.x-this.radius/3,this.pos.y+this.radius/5);
		ctx.restore();
	};
	this.destroy = function(){
		if(this.radius <= 20)
			return true;
		return false;
	};
	this.split = function(){
		var b1 = new EBall(this.mass,EVector.add(this.pos,new EVector(-this.radius,0)),this.radius/2,this.color);
		var b2 = new EBall(this.mass,EVector.add(this.pos,new EVector(this.radius,0)),this.radius/2,this.color);
		b1.setVelocity(2*Math.random()-1,this.vel.y);
		b2.setVelocity(2*Math.random()-1,this.vel.y);
		return [b1,b2];
	};
};

var MAX_ACC = 2;
var MAX_SPEED = 10;
var DAMP = 2;
var BULLET_RADIUS = 5;
var EBlock = function(m,p,w,h,c){
	this.mass = m;
	this.pos = p;
	this.width = w;
	this.height = h;
	this.color = c;
	this.vel = new EVector(0,0);
	this.acc = new EVector(0,0);
	this.damp = null;

	this.update = function(){
		this.damp = EVector.timesScalar(this.vel,-0.2);
		this.vel.add(this.acc);
		this.vel.add(this.damp);
		if(this.vel.mag() >= MAX_SPEED){
			this.vel.normalize();
			this.vel.timesScalar(MAX_SPEED);
		}
		this.pos.add(this.vel);
		if(this.pos.x <= MARGIN_X){
			this.pos.x = MARGIN_X ;
		}
		if(this.pos.x + this.width >= CANVAS_WIDTH - MARGIN_X ){
			this.pos.x = CANVAS_WIDTH - MARGIN_X - this.width;
		}
		if(this.pos.y <= MARGIN_Y){
			this.pos.y = MARGIN_Y ;
		}
		if(this.pos.y + this.height >= CANVAS_HEIGHT - MARGIN_Y ){
			this.pos.y = CANVAS_HEIGHT - MARGIN_Y - this.height;
		}
	};
	this.setVelocity = function(vx,vy){
		this.vel.set(vx,vy);
	};
	this.setAcc = function(accx,accy){
		this.acc.set(accx,accy);
	};
	this.applyAcc = function(acc){
		this.acc.set(acc.x,acc.y);
	};
	this.applyForce = function(force){
		this.acc.set(force.x,force.y);
	};
	this.draw = function(ctx){
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.lineWidth = 3;
		ctx.rect(this.pos.x,this.pos.y,this.width,this.height);
		ctx.rect(this.pos.x+this.width/3,this.pos.y - this.height/1.2,this.width/3,this.height/1.2);
		ctx.stroke();
		ctx.fill();
		ctx.restore();
	};
	this.shoot = function(){
		var b = new EBall(1,new EVector(this.pos.x + this.width/2,this.pos.y - this.height),BULLET_RADIUS,"#000000");
		b.setVelocity(0,-5);
		return b;
	}
}

var isColliding = function(bullet,ball){
	if(bullet.pos.dist(ball.pos) <= (bullet.radius + ball.radius))
		return true;
	return false;
}

var setSize = function(w,h){
	CANVAS_WIDTH = w;
	CANVAS_HEIGHT = h;
};
var setMargin = function(mx,my){
	MARGIN_X = mx;
	MARGIN_Y = my;
};
var clearScreen = function(ctx){
	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
	ctx.restore();
};

var initGame = function(n){
	var balls = [];
	var x,y;
	for(var i = 0;i<n;i++){
		x = MARGIN_X + Math.round(500*Math.random());
		y = MARGIN_Y + Math.round(50*Math.random());
		r = 1+Math.round(2*Math.random());
		var b = new EBall(1,new EVector(x,y),10*(2**r),"#AA5500");
		b.setVelocity(2*Math.random()-1,2*Math.random()-1);
		balls.push(b);
	}	
	return balls;
}