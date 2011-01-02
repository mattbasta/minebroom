
var board = [];
var time = 0;
var remainingMines = mines;
var remainingMoves = height * width - remainingMines;
var moved = false;
var died = false;
var timer;

var cache = new Array();
function g(x) {
	if(typeof cache[x] != 'undefined')
		return cache[x];
	else{
		var y = document.getElementById(x);
		cache[x] = y;
		return y;
	}
}

var init = function(){

	board = [];
	var b = $(g('board'));
	b.empty();
	
	var nwidth = (width * 16);
	var nheight = (height * 16);
	
	g('board').style.width = nwidth + 'px';
	g('board').style.height = nheight + 'px';
	
	g('controls').style.width = (nwidth - 6) + 'px';
	g('container').style.width = (nwidth + 4) + 'px';
	
	// Build Grid
	for(var j=0;j<height;j++) {
		for(var i=0;i<width;i++) {
			b.append('<a class="tile" href="#" onclick="grid('+i+', '+j+');return false;" onmousedown="downtile();" onmouseup="uptile();" oncontextmenu="return mark('+i+', '+j+');" style="left:'+(i*16)+'px;top:'+(j*16)+'px;" id="x'+i+'y'+j+'"></a>');
		}
	}
	
	// Build board
	for(var i=0;i<width;i++) {
		board[i] = [];
		for(var j=0;j<height;j++) {
			board[i][j] = 0;
		}
	}
	
};

function setColor(x, y) {
	if(x<0 || y<0 || x >= width || y >= height)
		return false;
	
	if(board[x][y]<0)
		return false;
		
	board[x][y]++;
	
	var nums = [
		'blank',
		'one',
		'two',
		'three',
		'four',
		'five',
		'six',
		'seven',
		'eight'
	];
	var tile = g('x'+x+'y'+y);
	tile.className = tile.className.replace(nums[board[x][y]-1],'');
	tile.className += ' ' + nums[board[x][y]];
	//tile.innerHTML = board[x][y];
}

function setMines(x, y) {
	g('mines').innerHTML = remainingMines;
	while(remainingMines--) {
		var mineX = Math.round(Math.random() * (width - 1));
		var mineY = Math.round(Math.random() * (height - 1));
		
		if(board[mineX][mineY] < 0 || (mineX == x && mineY == y)){
			remainingMines++;
			continue;
		}
		
		board[mineX][mineY] = -1;
		
		var mine = $(g('x'+mineX+'y'+mineY));
		mine.addClass('mine');
		mine.html('');
		
		setColor(mineX-1,mineY-1);
		setColor(mineX-1,mineY);
		setColor(mineX-1,mineY+1);
		
		setColor(mineX,mineY-1);
		setColor(mineX,mineY+1);
		
		setColor(mineX+1,mineY-1);
		setColor(mineX+1,mineY);
		setColor(mineX+1,mineY+1);
		
	}
	remainingMines = mines;
}

function grid(x, y) {
	
	if(!moved) {
		setMines(x, y);
		timer = setInterval(
			function(){
				time++;
				g('timer').innerHTML = time;
			},
			1000
		);
	}
	moved = true;
	
	if(died)
		return false;
		
	if(x<0 || y<0 || x >= width || y >= height)
		return false;
	
	
	var mine = g('x'+x+'y'+y);
	
	if(mine.className.indexOf('active')>-1)
		return false;
	if(mine.className.indexOf('flag')>-1)
		return false;
	if(mine.className.indexOf('unknown')>-1)
		mine.className = mine.className.replace(' unknown','');
	
	mine.className += ' active';
	
	var val = board[x][y];
	
	
	if(val==0){
		grid(x-1,y-1);
		grid(x-1,y);
		grid(x-1,y+1);
		
		grid(x,y-1);
		grid(x,y+1);
		
		grid(x+1,y-1);
		grid(x+1,y);
		grid(x+1,y+1);
	}else if(val==-1){
		if(!died){
			$('#board .tile.mine:not(.flag)').addClass('active');
			$('#board .tile.flag:not(.mine)').addClass('fake');
			died = true;
			clearInterval(timer);
		}
		mine.style.backgroundColor = 'red';
		if(died){
			var guy = g('guy');
			guy.className = 'dead';
		}
		return true;
	}else{
		trygrid(x,y);
	}
	
	remainingMoves--;
	if(remainingMoves==0){
		alert("You Win!");
		died = true;
		clearInterval(timer);
		var guy = g('guy');
		guy.className = 'won';
	}
}

function trygrid(x, y){
	if(x<0 || y<0 || x >= width || y >= height)
		return false;
	
	if(x>0){
		if(y>0 && board[x-1][y-1]==0)			grid(x-1,y-1);
		if(board[x-1][y]==0)					grid(x-1,y);
		if(y<height-1 && board[x-1][y+1]==0)	grid(x-1,y+1);
	}
	
	if(y>0&&board[x][y-1]==0) grid(x,y-1);
	if(y+1<height&&board[x][y+1]==0) grid(x,y+1);
	
	if(x<width-1){
		if(y>0 && board[x+1][y-1]==0)			grid(x+1,y-1);
		if(board[x+1][y]==0)					grid(x+1,y);
		if(y<height-1 && board[x+1][y+1]==0)	grid(x+1,y+1);
	}
}

function mark(x, y) {
	if(died)
		return false;
	
	var mine = g('x'+x+'y'+y);
	if(mine.className.indexOf('active')>-1)
		return false;
		
	if(mine.className.indexOf('flag')>-1){
		mine.className = mine.className.replace('flag','unknown');
		remainingMines++;
	}else if(mine.className.indexOf('unknown')>-1){
		mine.className = mine.className.replace(' unknown','');
	}else{
		mine.className += ' flag';
		remainingMines--;
	}
	g('mines').innerHTML = remainingMines;
	
	return false;
}

function guydown(){
	
	var guy = g('guy');
	guy.className = 'crap';
	
	return false;
}
function guyup(){
	if(died) window.location.reload();
	
	var guy = g('guy');
	guy.className = '';
	
	return false;
}
function downtile(){
	var guy = g('guy');
	
	guy.className = 'craprem';
	return guy;
}
function uptile(){
	var guy = g('guy');
	if(died){
		guy.className = 'dead';
	}else{
		guy.className = '';
	}
}

$(document).ready(function(){
	init();
});