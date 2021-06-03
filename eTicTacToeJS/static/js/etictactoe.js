/***************/
/* Player 1: X */
/* Player 2: O */
/***************/

var SUCCESS = 0;
var MOVE_NOT_ALLOWED = -1;
var NO_WINNER = -2;
var DRAW = -3;

function etictactoe(){
    this.board = new Array(3);
    this.last_move = [-1,-1];
    this.winner_line = [];
    for(var i = 0;i<3;i++)
	this.board[i] = new Array(3);
    this.mark = function(player,x,y,dim){
	var h = dim/3;
	if(this.board[Math.floor(y/h)][Math.floor(x/h)])
	    return MOVE_NOT_ALLOWED;
	this.board[Math.floor(y/h)][Math.floor(x/h)] = player;
	this.last_move[0] = Math.floor(y/h);
	this.last_move[1] = Math.floor(x/h);
	return SUCCESS;
    }
    this.set = function(player,i,j){
	this.board[i][j] = player;
    }
    this.clear = function(){
	for(var i = 0;i<3;i++)
	    for(var j = 0;j<3;j++)
		this.board[i][j] = 0;
    }
    this.winner = function(){
	var player;
	for(var i = 0;i<3;i++){
	    player = this.board[i][0];
	    if(player){
		for(var j = 1;j<3;j++){
		    if(player != this.board[i][j])
			break;
		}
		if(j==3){
		    this.winner_line = [[i,0],[i,2]];
		    return player;
		}
	    }
	    player = this.board[0][i];
	    if(player){
		for(var j = 1;j<3;j++){
		    if(player != this.board[j][i])
			break;
		}
		if(j==3){
		    this.winner_line = [[0,i],[2,i]];
		    return player;
		}
	    }
	}

	player = this.board[0][0];
	if(player){
	    for(var i = 1;i<3;i++)
		if(this.board[i][i]!=player)
		    break;
	    if(i == 3){
		this.winner_line = [[0,0],[2,2]];
		return player;
	    }
	}
	
	player = this.board[0][2];
	if(player){
	    for(var i = 1;i>-1;i--)
		if(this.board[2-i][i]!=player)
		    break;
	    if(i == -1){
		this.winner_line = [[0,2],[2,0]];
		return player;
	    }
	}
	for(var i = 0;i<3;i++)
	    for(var j = 0;j<3;j++)
		if(!this.board[i][j])
		    return NO_WINNER;
	return DRAW;
    }
    this.draw_board = function(ctx,dim){
	var h = dim/3;
	ctx.save();
	ctx.beginPath();
	
	ctx.fillStyle = "#FFFFFF";
	ctx.rect(0,0,dim,dim);
	ctx.fill();

	ctx.moveTo(h,0);
	ctx.lineTo(h,dim);
	ctx.stroke();

	ctx.moveTo(2*h,0);
	ctx.lineTo(2*h,dim);
	ctx.stroke();

	ctx.moveTo(0,h);
	ctx.lineTo(dim,h);
	ctx.stroke();
	
	ctx.moveTo(0,2*h);
	ctx.lineTo(dim,2*h);
	ctx.stroke();
	
	ctx.closePath();
	ctx.restore();
    }
    this.draw_marks = function(ctx,dim){
	var h = dim/3;
	for(var i = 0;i<3;i++){
	    for(var j = 0;j<3;j++)
	    {
		if(this.board[i][j]){
		    ctx.font = dim/3 + "px serif";
		    ctx.fillText(this.board[i][j] == 1?"X":"O",(j+0.1)*h,(i+0.9)*h);
		}
	    }
	}
    }
    this.draw_winner = function(ctx,dim){
	ctx.save();
	ctx.beginPath();
	ctx.strokeStyle = "#FF0000";
	ctx.lineWidth = 20;
	var h = dim/6;
	if(this.winner_line){
	    ctx.moveTo((this.winner_line[0][1]*2 + 1) * h,(this.winner_line[0][0]*2 + 1)*h);
	    ctx.lineTo((this.winner_line[1][1]*2+1)*h,(this.winner_line[1][0]*2 + 1)*h);
	    ctx.stroke();
	}
	ctx.closePath();
	ctx.restore();
    }
}
