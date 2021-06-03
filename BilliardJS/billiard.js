var CANVAS_WIDTH = 500;
var CANVAS_HEIGHT = 500;

var MARGIN_X = 100;
var MARGIN_Y = 100;

var MAX_POWER = 20;
var POWERBAR_X = 50;

var EVector = function(x,y){
	this.x = x;
	this.y = y;
	this.set = function(x,y){
		this.x = x;
		this.y = y;
	};
	this.mag = function(){
		return Math.sqrt(this.x**2 + this.y**2);
	};
	this.add = function(v){
		this.x += v.x;
		this.y += v.y;
	};
	this.diff = function(v){
		this.x -= v.x;
		this.y -= v.y;	
	};
	this.times_scalar = function(s){
		this.x *= s;
		this.y *= s;
	};
	this.dist = function(v){
		return Math.sqrt((this.x - v.x)**2 + (this.y - v.y)**2);
	};
	this.dot = function(v){
		return this.x*v.x + this.y*v.y;
	};
	this.normalize = function(v){
		var d = Math.sqrt(this.x**2 + this.y**2);
		this.x /= d;
		this.y /= d;
	}
	EVector.add = function(v1,v2){
		return new EVector(v1.x + v2.x,v1.y+v2.y);
	};
	EVector.diff = function(v1,v2){
		return new EVector(v1.x - v2.x,v1.y-v2.y);
	};
	EVector.times_scalar = function(v,s){
		return new EVector(v.x *s,v.y*s);
	}
}

var ball = function(m,pos,r,c){
	this.mass = m;
	this.pos = pos;
	this.radius = r;
	this.vel = new EVector(0,0);
	this.color = c;

	this.draw = function(ctx){
		ctx.fillStyle = this.color;
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.arc(this.pos.x,this.pos.y,this.radius,0,2*Math.PI);
		ctx.stroke();
		ctx.fill();
	};

	this.setVelocity = function(vx,vy){
		this.vel.set(vx,vy);
	};

	this.update = function(ctx){
		this.pos.add(this.vel);
		if(this.pos.x - this.radius <= MARGIN_X){
			this.pos.x = this.radius + MARGIN_X;
			this.vel.x = -this.vel.x;
		}
		if(this.pos.x + this.radius >= CANVAS_WIDTH - MARGIN_X){
			this.pos.x = CANVAS_WIDTH - this.radius - MARGIN_X;
			this.vel.x = -this.vel.x;
		}
		if(this.pos.y - this.radius <= MARGIN_Y){
			this.pos.y = this.radius + MARGIN_Y;
			this.vel.y = -this.vel.y;
		}
		if(this.pos.y + this.radius >= CANVAS_HEIGHT - MARGIN_Y){
			this.pos.y = CANVAS_HEIGHT - this.radius - MARGIN_Y;
			this.vel.y = -this.vel.y;
		}	
	};

	this.kinetic_energy = function(){
		return this.mass*(this.vel.mag())**2 / 2;
	};
	this.momentum = function(){
		return EVector.times_scalar(this.vel,this.mass);
	};
}

var setSize = function(w,h){
	CANVAS_WIDTH = w;
	CANVAS_HEIGHT = h;
}

var isColliding = function(b1,b2){
	if(b1.pos.dist(b2.pos)<=b1.radius+b2.radius){
		return true;
	}
	return false;
}

var collide = function(b1,b2){
	if(!isColliding(b1,b2))
		return;
	var d = EVector.diff(b2.pos,b1.pos);
	d.normalize();
	var w1 = EVector.times_scalar(d,b1.vel.dot(d));
	var u1 = EVector.diff(b1.vel,w1);
	var w2 = EVector.times_scalar(d,b2.vel.dot(d));
	var u2 = EVector.diff(b2.vel,w2);
	var v1 = w1.dot(d);
	var v2 = w2.dot(d);
	var m1 = b1.mass;
	var m2 = b2.mass;
	var alpha = m1*v1 + m2*v2;
	var beta = m1*v1*v1 + m2*v2*v2;
	var a = m2**2/m1 + m2;
	var b = 2*m2*alpha/m1;
	var c = alpha**2/m1 - beta; 
	var t2 = (b + Math.sqrt(b**2 - 4*a*c))/(2*a);
	var t1 = (alpha - m2*t2)/m1; 
	u1.add(EVector.times_scalar(d,t1));
	u2.add(EVector.times_scalar(d,t2));
	b1.setVelocity(u1.x,u1.y);
	b2.setVelocity(u2.x,u2.y);
};

var clearScreen = function(ctx){
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT)
}

var drawTable = function(ctx){
	ctx.beginPath();
	ctx.rect(MARGIN_X,MARGIN_Y,CANVAS_WIDTH - 2*MARGIN_X,CANVAS_HEIGHT - 2*MARGIN_Y);
	ctx.fillStyle = "#22AA00";
	ctx.fill();
	ctx.lineWidth = 3;
	ctx.stroke();
}

var createBalls = function(){
	var colors = ["#FF0000","#FF00FF","#00FF00","#00FFFF"];
	var balls = [];
	var r = 12;
	var p = new EVector(CANVAS_WIDTH/2,-3*MARGIN_Y + CANVAS_HEIGHT);
	for(var i = 0;i<5;i++){
		p.x = p.x - 2.2*r*Math.sin(Math.PI/6);
		p.y = p.y + 2.2*r*Math.cos(Math.PI/6);
		for(var j = 0;j<=i;j++){
			var b = new ball(1,new EVector(p.x + 2.3*j*r,p.y),r,colors[Math.round(3*Math.random())]);
			balls.push(b);
		}
	}
	return balls;
}
var barcolors = ["#22FF00","#44FF00","#66FF00","#88FF00","#88FF00","#99EE00","#99CC00","#AAAA00","#EE8800","#FF2200"];
var drawPower = function(ctx,power){
	ctx.beginPath();
	for(var i = 0 ;i<power/2;i++){
		ctx.fillStyle = barcolors[i];
		ctx.fillRect(CANVAS_WIDTH-POWERBAR_X,CANVAS_HEIGHT - (i+1)*20,POWERBAR_X,20);		
	}
}
var drawArrow = function(ctx,initial,final){
	ctx.beginPath();
	ctx.fillStyle = "#000000";
	ctx.moveTo(initial.x,initial.y);
	ctx.lineTo(final.x,final.y);
	ctx.stroke();
}

var hole = function(pos,r){
	this.pos = pos;
	this.radius = r;
	this.draw = function(ctx){
		ctx.beginPath();
		ctx.fillStyle = "#000000";
		ctx.arc(this.pos.x,this.pos.y,this.radius,0,2*Math.PI);
		ctx.fill();
	};
}

var createHoles = function(){
	var holes = [];
	var r = 20;
	holes.push(new hole(new EVector(MARGIN_X,MARGIN_Y),r));
	holes.push(new hole(new EVector(CANVAS_WIDTH - MARGIN_X,MARGIN_Y),r));
	holes.push(new hole(new EVector(MARGIN_X,CANVAS_HEIGHT/2),r));
	holes.push(new hole(new EVector(MARGIN_X,CANVAS_HEIGHT - MARGIN_Y),r));
	holes.push(new hole(new EVector(CANVAS_WIDTH - MARGIN_X,CANVAS_HEIGHT/2),r));
	holes.push(new hole(new EVector(CANVAS_WIDTH - MARGIN_X,CANVAS_HEIGHT - MARGIN_Y),r));
	return holes;
}

var isInHole = function(b,h){
	if(b.pos.dist(h.pos)<h.radius)
		return true;
	return false;
}