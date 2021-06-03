function clear_screen(ctx,dim){
    console.log("test");
    ctx.save();
    ctx.beginPath();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#FFFFFF";
    ctx.rect(0,0,dim,dim);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

function chess_menu(){
    this.state = "waiting_player";
    this.selected = "";
    this.white_available = true;
    this.black_available = true;

    this.set_state = function(state){
	this.state = state;
    }
    this.select = function(color){
	if(color == "white")
	    this.white_available = false;
	else if(color == "black")
	    this.black_available = false;
    }
    this.click = function(x,y){
	if(x>dim/8 && y>dim/8 && x<7*dim/8 && y < 7*dim/16 && this.white_available){
	    this.state = "waiting_game";
	    return "white";
	}
	else if(x>dim/8 && y>9*dim/16 && x<7*dim/8 && y < 7*dim/8  && this.black_available){
	    this.state = "waiting_game";
	    return "black";
	}
	return "";
    }
    this.draw = function(ctx,dim){
	clear_screen(ctx,dim);
	
	ctx.save();
	ctx.beginPath();
	ctx.globalAlpha = 0.3;
	ctx.fillStyle = "#AAAAAA";
	ctx.rect(0,0,dim,dim);
	ctx.fill();
	ctx.closePath();
	ctx.restore();
	
	if(this.state == "choosing"){
	    ctx.save();
	    ctx.beginPath();
	    ctx.fillStyle = "#FF0000";
	    if(this.white_available)
		ctx.fillStyle = "#FFFFFF";
	    ctx.rect(dim/8,dim/8,3*dim/4,5*dim/16);
	    ctx.fill();
	    ctx.stroke();
	    ctx.font = "30px serif";
	    ctx.fillStyle = "#000000";
	    ctx.fillText("white",3*dim/8,5*dim/16);
	    ctx.closePath();
	    ctx.restore();

	    ctx.save();
	    ctx.beginPath();
	    ctx.fillStyle = "#FF0000";
	    if(this.black_available)
		ctx.fillStyle = "#FFFFFF";
	    ctx.rect(dim/8,9*dim/16,3*dim/4,5*dim/16);
	    ctx.fill();
	    ctx.stroke();
	    ctx.font = "30px serif";
	    ctx.fillStyle = "#000000";
	    ctx.fillText("black",3*dim/8,3*dim/4);
	    ctx.closePath();
	    ctx.restore();
	}
	
	else if(this.state == "waiting_player" || this.state == "waiting_game"){
	    ctx.fillStyle = "#FFFFFF";
	    ctx.font = "30px serif";
	    ctx.fillText("waiting ...",dim/2,dim/2);
	}
    }
}

