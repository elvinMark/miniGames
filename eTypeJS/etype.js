var mydict = ['hello','name','is','computer','phone','table','home']
var DICT_LENGTH = mydict.length;
var BULLET_VEL = 20;
var BULLET_LEN = 10;

var myword = function(){
    this.word = mydict[Math.floor(DICT_LENGTH*Math.random())];
    this.posX = Math.floor(300*Math.random() + 100);
    this.posY = Math.floor(100*Math.random() - 50);
    this.velX = 0;
    this.velY = 1;
    this.selected = 0;
    this.draw = function(ctx){
	if(this.selected)
	    ctx.fillStyle = "#5555FF";
	ctx.fillText(this.word,this.posX,this.posY);
	if(this.selected)
	    ctx.fillStyle = "#000000";
    };
    this.update = function(){
	this.posX += this.velX;
	this.posY += this.velY;
    };
    this.hit = function(k){
	if(k==this.word[0]){
	    this.word = this.word.slice(1);
	    return true;
	}
	return false;
    };
    this.isDestroyed = function(){
	if(this.word.length == 0)
	    return true;
	return false;
    };
    this.select = function(){
	this.selected = 1;
    }
    this.insideView = function(){
	if(this.posY > 10)
	    return true;
	return false;
    }
    this.surpassLimit = function(ylim){
	if(this.posY > ylim)
	    return true;
	return false;
    }
    this.canHit = function(k){
	if(this.word[0] == k)
	    return true;
	return false;
    }
    this.distance = function(targetX,targetY){
	return Math.sqrt((this.posX - targetX)**2 + (this.posY - targetY)**2);
    }
    this.getDistanceY = function(){
	return this.posY;
    }
}

var bullets = function (x0,y0,target){
    this.posX = x0;
    this.posY = y0;
    this.target = target;
    this.ux = 0;
    this.uy = 0;
    this.velX = 0;
    this.velY = 0;
    this.d = 0;
    this.draw = function(ctx){
	ctx.beginPath();
	ctx.moveTo(this.posX,this.posY);
	ctx.lineTo(this.posX + BULLET_LEN*this.ux,this.posY + BULLET_LEN*this.uy);
	ctx.stroke();
    };
    this.calculateVel = function(){
	var dx = this.target.posX - this.posX;
	var dy = this.target.posY - this.posY;
	this.d  = Math.sqrt(dx**2 + dy**2);
	this.ux = dx/this.d;
	this.uy = dy/this.d;
	this.velX = BULLET_VEL*this.ux;
	this.velY = BULLET_VEL*this.uy;
    };
    this.move = function(){
	this.posX += this.velX;
	this.posY += this.velY;
    };
    this.update = function(){
	this.calculateVel();
	this.move();
    };
    this.reachTarget = function(){
	return this.d<BULLET_LEN;
    };
}

var myship = function(x,y){
    this.posX = x;
    this.posY = y;
    this.points = [];
    this.r = 20;
    this.angle = -Math.PI/2;
    this.generatePoints = function(){
	var dangle = 2*Math.PI/5;
	this.points = [];
	for(var i = 0;i<5;i++)
	    this.points.push([this.posX + this.r*Math.cos(this.angle + i*dangle),this.posY + this.r*Math.sin(this.angle + i*dangle)]);
    }
    this.draw = function(ctx){
	this.generatePoints();
	ctx.beginPath();
	var elem;
	for(elem = 0;elem<this.points.length - 1;elem++){
	    ctx.moveTo(this.points[elem][0],this.points[elem][1]);
	    ctx.lineTo(this.points[elem+1][0],this.points[elem+1][1]);
	}
	ctx.moveTo(this.points[elem][0],this.points[elem][1]);
	ctx.lineTo(this.points[0][0],this.points[0][1]);
	ctx.stroke();
    };
    this.setAngle = function(nangle){
	this.angle = nangle;
    };
    this.pointTarget = function(target){
	var nangle = -Math.atan((target.posY - this.posY)/(target.posX - this.posX));
	this.setAngle(nangle);
    };
}

var mygame = function(w,h){
    this.w = w;
    this.h = h;
    this.ship = new myship(this.w/2,this.h - 20);
    this.words = [];
    this.bullets = [];
    this.selected_word = -1;
    this.add = function(w){
	this.words.push(w);
    };
    this.draw = function(ctx){
	for(var i in this.words){
	    this.words[i].draw(ctx);
	}
	for(var i in this.bullets){
	    this.bullets[i].draw(ctx);
	}
	this.ship.draw(ctx);
    };
    this.update = function(){
	for(var i in this.words){
	    if(this.words[i].surpassLimit(this.h))
		this.words.splice(i,1);
	    else
		this.words[i].update();
	}
	for(var i in this.bullets){
	    this.bullets[i].update();
	    if(this.bullets[i].reachTarget())
		this.bullets.splice(i,1);
	}
    };
    this.keyPressed = function(k){
	if(this.selected_word>=0){
	    if(this.words[this.selected_word].canHit(k)){
		this.words[this.selected_word].hit(k);
		this.ship.pointTarget(this.words[this.selected_word]);
		this.bullets.push(new bullets(this.ship.posX,this.ship.posY,this.words[this.selected_word]));
	    }
	    if(this.words[this.selected_word].isDestroyed()){
		this.words.splice(this.selected_word,1);
		this.selected_word = -1;
	    }
	}
	else{
	    var min_val = this.h;
	    for(var i in this.words){
		if(this.words[i].insideView() && this.words[i].canHit(k) && this.words[i].distance(this.ship.posX,this.ship.posY)<min_val){
		    this.selected_word = i;
		    min_val= this.words[i].distance(this.ship.posX,this.ship.posY);
		}
	    }
	    if(this.selected_word>=0){
		this.words[this.selected_word].select();
		this.words[this.selected_word].hit(k);
		this.ship.pointTarget(this.words[this.selected_word]);
		this.bullets.push(new bullets(this.ship.posX,this.ship.posY,this.words[this.selected_word]));
	    }
	}
    };
}
