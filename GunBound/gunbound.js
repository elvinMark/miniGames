var CANVAS_HEIGHT = 500;
var CANVAS_WIDTH = 500;

var MARGIN_X = 0;
var MARGIN_Y = 0;

var GAME_WIDTH = CANVAS_WIDTH - 2*MARGIN_X;
var GAME_HEIGHT = CANVAS_HEIGHT - 2*MARGIN_Y;

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
		var x = this.x;
		var y = this.y;
		this.x = Math.cos(angle)*x - Math.sin(angle)*y;
		this.y = Math.sin(angle)*x + Math.cos(angle)*y;
	};
	this.getAngle = function(){
		var alpha = Math.atan(this.y/this.x);
		if(this.x<0)
			return alpha + Math.PI;
		return alpha;
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
	EVector.rotate = function(v,angle){
		return new EVector( Math.cos(angle)*v.x - Math.sin(angle)*v.y,Math.sin(angle)*v.x + Math.cos(angle)*v.y)
	}
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
	this.applyForce = function(force){
		this.acc.set(force.x/this.mass,force.y/this.mass);
	};
	this.applyAcc = function(acc){
		this.acc.set(acc.x,acc.y);
	};
	this.setAcc = function(accx,accy){
		this.acc.set(accx,accy);
	};
	this.draw = function(ctx){
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.pos.x,this.pos.y,this.radius,0,2*Math.PI);
		ctx.lineWidth = 3;
		ctx.stroke();
		ctx.fill();
	};
};

var BULLET_DIM = 5;

var EBullet = function(p){
	this.pos = p;
	this.vel = new EVector(0,0);
	this.acc = new EVector(0,0);
	this.angle = 0;
	this.dangle = 0;
	this.p1 = new EVector(- BULLET_DIM, BULLET_DIM);
	this.p2 = new EVector(- BULLET_DIM,- BULLET_DIM);
	this.p3 = new EVector(BULLET_DIM,0);
	
	this.draw = function(ctx){
		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = 4;
		ctx.fillStyle = "#AAAAAA";
		ctx.moveTo(this.pos.x + this.p1.x,this.pos.y + this.p1.y);
		ctx.lineTo(this.pos.x + this.p2.x,this.pos.y + this.p2.y);
		ctx.lineTo(this.pos.x + this.p3.x,this.pos.y + this.p3.y);
		ctx.lineTo(this.pos.x + this.p1.x,this.pos.y + this.p1.y);
		ctx.stroke();
		ctx.fill();
		ctx.restore();
	};
	this.setVelocity = function(vx,vy){
		this.vel.set(vx,vy);
		this.angle = this.vel.getAngle();
		this.dangle = this.angle;
		this.p1.rotate(this.angle);
		this.p2.rotate(this.angle);
		this.p3.rotate(this.angle);
	};
	this.setAcc = function(accx,accy){
		this.acc.set(accx,accy);
	};
	this.applyAcc = function(acc){
		this.acc.set(acc.x,acc.y);
	};
	this.update = function(){
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.dangle = this.vel.getAngle() - this.angle;
		this.angle = this.vel.getAngle();
		this.p1.rotate(this.dangle);
		this.p2.rotate(this.dangle);
		this.p3.rotate(this.dangle);
	};
	this.outOfBounds = function(){
		if(this.pos.y >= CANVAS_HEIGHT - MARGIN_Y)
			return true;
		return false;
	};
};

var damping = 0.2;
var MAX_SPEED = 5;
var dangle = 0.1;
var CAR_WIDTH = 50;
var CAR_HEIGHT = 50;
var CANNON_LEN = 50;
var BULLET_SPEED = 15;

var ECar = function(p,c){
	this.pos = p;
	this.color = c;
	this.vel = new EVector(0,0);
	this.acc = new EVector(0,0);
	this.damp = new EVector(0,0);
	this.angle = 0;
	this.p1 = new EVector(-CAR_WIDTH/2,-CAR_HEIGHT/2);
	this.p2 = new EVector(CAR_WIDTH/2,-CAR_HEIGHT/2);
	this.p3 = new EVector(CAR_WIDTH/2,CAR_HEIGHT/2);
	this.p4 = new EVector(-CAR_WIDTH/2,CAR_HEIGHT/2);
	this.car_angle = 0;

	this.update = function(){
		this.damp = EVector.timesScalar(this.vel,-damping);
		this.vel.add(this.acc);
		this.vel.add(this.damp);
		if(this.vel.mag()>=MAX_SPEED){
			this.vel.normalize();
			this.vel.timesScalar(MAX_SPEED);
		}
		this.pos.add(this.vel);
	};
	this.applyAcc = function(acc){
		this.acc.set(acc.x,acc.y);
	};
	this.setAcc = function(accx,accy){
		this.acc.set(accx,accy);
	};
	this.increaseAngle = function(){
		this.angle += dangle;
	};
	this.decreaseAngle = function(){
		this.angle -= dangle;
	};
	this.draw = function(ctx){
		ctx.save();
		ctx.translate(this.pos.x,this.pos.y);
		ctx.rotate(this.car_angle);
		
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.fillStyle = this.color;
		//ctx.rect(this.pos.x,this.pos.y,CAR_WIDTH,CAR_HEIGHT);
		ctx.rect(-CAR_WIDTH/2,-CAR_HEIGHT/2, CAR_WIDTH, CAR_HEIGHT );
		//ctx.moveTo(this.pos.x + this.p1.x,this.pos.y + this.p1.y);
		//ctx.lineTo(this.pos.x + this.p2.x,this.pos.y + this.p2.y);
		//ctx.lineTo(this.pos.x + this.p3.x,this.pos.y + this.p3.y);
		//ctx.lineTo(this.pos.x + this.p4.x,this.pos.y + this.p4.y);
		//ctx.lineTo(this.pos.x + this.p1.x,this.pos.y + this.p1.y);

		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.lineWidth = 7;
		ctx.moveTo(0,0);
		ctx.lineTo(CANNON_LEN*Math.cos(this.angle),- CANNON_LEN*Math.sin(this.angle));
		ctx.stroke();
		ctx.restore();
	};
	this.shoot = function(){
		var b = new EBullet(new EVector(this.pos.x + CANNON_LEN*Math.cos(this.angle - this.car_angle),this.pos.y- CANNON_LEN*Math.sin(this.angle - this.car_angle)));
		s = new EVector(BULLET_SPEED,0);
		s.rotate(-this.angle + this.car_angle);
		console.log(s.x,s.y);
		b.setVelocity(s.x,s.y);
		return b;
	};
	this.rotate = function(angle){
		this.p1.rotate(angle - this.car_angle);
		this.p2.rotate(angle - this.car_angle);
		this.p3.rotate(angle - this.car_angle);
		this.p4.rotate(angle - this.car_angle);
		this.car_angle = angle;
	}
};

var IMPACT_RADIUS = 40;

var ETerrain = function(points){
	this.points = points;
	this.num_points = points.length;
	this.h = (CANVAS_WIDTH - 2*MARGIN_X)/(this.num_points-1);
	this.draw = function(ctx){
		var x = this.points[0].x;
		var y = this.points[0].y;
		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = 5;
		ctx.moveTo(x,y);
		for(var i = 1;i<this.num_points;i++){
			x  = this.points[i].x;
			y  = this.points[i].y;
			ctx.lineTo(x,y);
		}
		ctx.stroke();
		ctx.restore();
	};
	this.generateFromFunction = function(fun,res){
		this.points = [];
		this.num_points = res;
		var x = 0;
		this.h = (CANVAS_WIDTH - 2*MARGIN_X)/(res-1);
		for(var i = 0;i<this.num_points;i++){
			this.points.push(new EVector(x,fun(x)));
			x += this.h;
		}
	}
	this.impact = function(pos){
		var index1 = 0;
		var index2 = 0;
		for(var i = 0;i<this.points.length;i++){
			if(this.points[i].x>pos.x- IMPACT_RADIUS && index1==index2){
				index1 = i;
			};
			if(this.points[i].x>pos.x+ IMPACT_RADIUS){
				index2 = i-1;
				break;
			};
		};
		for(var i = index1;i<= index2;i++){
			this.points[i].y = pos.y + Math.sqrt(IMPACT_RADIUS**2 - (pos.x - this.points[i].x)**2);
		};
	};
	this.interact = function(c){
		var index = 0;
		for(var i = 0;i< this.points.length;i++){
			if(c.pos.x<this.points[i].x){
				index = i;
				break;
			}
		}
		var inc = 1;
		if(index == this.points.length-1){
			index--;
		}
		var angle = (EVector.diff(this.points[parseInt(index) + inc],this.points[index])).getAngle();  
		c.pos.set(c.pos.x,this.points[index].y-CAR_HEIGHT/2);
		c.rotate(angle);
	};
	this.collide = function(bullet){
		var index = 0;
		for(var i = 0;i<this.points.length;i++){
			if(bullet.pos.x > this.points[i].x){
				index = i;
			}
		};
		if(this.points[index].y < bullet.pos.y){
			return true;
		};
		return false;
	};
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
