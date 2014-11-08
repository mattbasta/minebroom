var board = [];
var time = 0;
var remainingMines = mines;
var remainingMoves = height * width - remainingMines;
var moved = false;
var died = false;
var timer;

var cache = {};
function g(x) {
    if (cache[x])
        return cache[x];
    else
        return cache[x] = document.getElementById(x);
}

var boardEl = document.getElementById('board');
var minesEl = document.getElementById('mines');
var timerEl = document.getElementById('timer');

var init = function() {
    board = [];

    while (boardEl.childNodes.length) boardEl.removeChild(boardEl.firstChild);

    boardEl.style.width = width * 16 + 'px';
    boardEl.style.height = height * 16 + 'px';

    document.getElementById('controls').style.width = (width * 16 - 6) + 'px';
    document.getElementById('container').style.width = (width * 16 + 4) + 'px';

    // Build Grid
    for (var j = 0; j < height; j++) {
        for(var i = 0; i < width; i++) {
            var tile = document.createElement('a');
            tile.className = 'tile';
            tile.setAttribute('data-x', i);
            tile.setAttribute('data-y', j);
            tile.addEventListener('click', function() {
                grid(this.getAttribute('data-x'), this.getAttribute('data-y'));
            }.bind(tile));
            tile.addEventListener('mousedown', downtile);
            tile.addEventListener('mouseup', uptile);
            tile.addEventListener('contextmenu', function(e) {
                mark(this.getAttribute('data-x'), this.getAttribute('data-y'));
                e.preventDefault();
            });

            tile.style.left = (i * 16) + 'px';
            tile.style.top = (j * 16) + 'px';
            tile.id = 'x' + i + 'y' + j;

            boardEl.appendChild(tile);
        }
    }

    // Build board
    for (i = 0; i < width; i++) {
        board[i] = [];
        for(j = 0; j < height; j++) {
            board[i][j] = 0;
        }
    }

};

function setColor(x, y) {
    if (x < 0 || y < 0 || x >= width || y >= height) return false;

    if (board[x][y]<0) return false;

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
    var tile = document.getElementById('x'+x+'y'+y);
    tile.classList.remove(nums[board[x][y] - 1]);
    tile.classList.add(nums[board[x][y]]);
}

function setMines(x, y) {
    minesEl.innerHTML = remainingMines;

    while (remainingMines--) {
        var mineX = Math.round(Math.random() * (width - 1));
        var mineY = Math.round(Math.random() * (height - 1));

        if (board[mineX][mineY] < 0 || (mineX == x && mineY == y)){
            remainingMines++;
            continue;
        }

        board[mineX][mineY] = -1;

        var mine = document.getElementById('x' + mineX + 'y' + mineY);
        mine.classList.add('mine');
        mine.innerHTML = '';

        setColor(mineX - 1, mineY - 1);
        setColor(mineX - 1, mineY);
        setColor(mineX - 1, mineY + 1);

        setColor(mineX, mineY - 1);
        setColor(mineX, mineY + 1);

        setColor(mineX + 1, mineY - 1);
        setColor(mineX + 1, mineY);
        setColor(mineX + 1, mineY + 1);

    }
    remainingMines = mines;
}

function grid(x, y) {

    if (!moved) {
        setMines(x, y);
        timer = setInterval(function() {
            time++;
            timerEl.innerHTML = time;
        }, 1000);
    }
    moved = true;

    if (died) return false;
    if (x < 0 || y < 0 || x >= width || y >= height) return false;

    var mine = document.getElementById('x' + x + 'y' + y);

    if (mine.classList.contains('active')) return false;
    if (mine.classList.contains('flag')) return false;

    if (mine.classList.contains('unknown')) mine.classList.remove('unknown');

    mine.classList.add('active');

    var val = board[x][y];

    if (!val) {
        grid(x - 1, y - 1);
        grid(x - 1, y);
        grid(x - 1, y + 1);

        grid(x, y - 1);
        grid(x, y + 1);

        grid(x + 1, y - 1);
        grid(x + 1, y);
        grid(x + 1, y + 1);
    } else if (val === -1) {
        if (!died) {

            Array.prototype.slice.call(document.querySelectorAll('#board .tile.mine:not(.flag)')).forEach(function(el) {
                el.classList.add('active');
            });
            Array.prototype.slice.call(document.querySelectorAll('#board .tile.flag:not(.mine)')).forEach(function(el) {
                el.classList.add('fake');
            });
            died = true;
            clearInterval(timer);
        }
        mine.style.backgroundColor = 'red';
        if (died) document.getElementById('guy').className = 'dead';
        return true;
    } else {
        trygrid(x, y);
    }

    remainingMoves--;
    if (!remainingMoves) {
        alert('You Win!');
        died = true;
        clearInterval(timer);
        if (died) document.getElementById('guy').className = 'won';
    }
}

function trygrid(x, y){
    x = x | 0;
    y = y | 0;
    if (x < 0 || y < 0 || x >= width || y >= height) return false;

    if (x > 0) {
        if (y >0 && !board[x - 1][y - 1]) grid(x - 1, y - 1);
        if (!board[x - 1][y]) grid(x - 1, y);
        if (y < height - 1 && !board[x - 1][y + 1]) grid(x - 1, y + 1);
    }

    if (y > 0 && !board[x][y - 1]) grid(x, y - 1);
    if (y + 1 < height && !board[x][y + 1]) grid(x, y + 1);

    if (x < width - 1) {
        if (y > 0 && !board[x + 1][y - 1]) grid(x + 1, y - 1);
        if (!board[x + 1][y]) grid(x + 1, y);
        if (y < height - 1 && !board[x + 1][y + 1]) grid(x + 1, y + 1);
    }
}

function mark(x, y) {
    if (died) return false;

    var mine = document.getElementById('x' + x + 'y' + y);
    if (mine.classList.contains('active')) return false;

    if (mine.classList.contains('flag')) {
        mine.classList.remove('flag');
        mine.classList.add('unknown');
        remainingMines++;
    } else if (mine.classList.contains('unknown')) {
        mine.classList.remove('unknown');
    } else {
        mine.classList.add('flag');
        remainingMines--;
    }
    minesEl.innerHTML = remainingMines;

    return false;
}

function guydown() {
    document.getElementById('guy').className = 'crap';
    return false;
}
function guyup(){
    if (died) window.location.reload();
    document.getElementById('guy').className = '';
    return false;
}
function downtile() {
    var guy = document.getElementById('guy');
    guy.className = 'craprem';
    return guy;
}
function uptile() {
    document.getElementById('guy').className = died ? 'dead' : '';
}

init();
