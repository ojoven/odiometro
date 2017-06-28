/**var canvas = document.getElementById('blood'),
	ctx = canvas.getContext('2d'),
	focused = false,
	clicked = false;
var shadow = document.createElement('canvas'),
	sctx = shadow.getContext('2d');

var items = [];
var mouse = {
	x: 0,
	y: 0,
	dx: 0,
	dy: 0,
	px: 0,
	py: 0
};
var options = {
	scatter: 0,
	gravity: 0.2,
	consistency: 0.04,
	pollock: false,
	burst: true,
	shade: true

}
canvas.width = shadow.width = window.innerWidth;
canvas.height = shadow.height = window.innerHeight;
sctx.fillStyle = ctx.fillStyle = '#8A0707'; // rgba(250,0,0,0.1)'

function drawloop() {

	if (focused) {
		requestAnimationFrame(drawloop);
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	drawsplat(items)

}

function splat(x, y, arr) {

	for (var i = 0; i < 30; i++) {
		var s = Math.random() * Math.PI;
		var dirx = (((Math.random() < .5) ? 3 : -3) * (Math.random() * 3)) * options.scatter;
		var diry = (((Math.random() < .5) ? 3 : -3) * (Math.random() * 3)) * options.scatter;

		arr.push({
			x: x,
			y: y,
			dx: dirx + mouse.dx,
			dy: diry + mouse.dy,
			size: s
		})
	}

}

function drawsplat(arr) {

	var i = arr.length
	while (i--) {
		var t = arr[i];
		var x = t.x,
			y = t.y,
			s = t.size;
		circle(x, y, s, ctx)

		t.dy -= options.gravity
		t.x -= t.dx
		t.y -= t.dy
		t.size -= 0.05;

		if (arr[i].size < 0.3 || Math.random() < options.consistency) {
			circle(x, y, s, sctx)
			arr.splice(i, 1)

		}

	}

	ctx.drawImage(shadow, 0, 0)

}

function circle(x, y, s, c) {

	c.beginPath()
	c.arc(x, y, s * 5, 0, 2 * Math.PI, false);
	c.fill()
	c.closePath()

}

console.log(canvas);

canvas.onmousedown = function (e) {

	console.log('mousedown');

	if (!focused) {
		focused = true;
		drawloop();
	} else {
		clicked = true;

		if (options.burst) {
			setTimeout(function () {
				clicked = false
			}, 100)
		}

		mouse.x = e.pageX
		mouse.y = e.pageY

		var redtone = (options.shade) ? 'rgb(' + (130 + (Math.random() * 105 | 0)) + ',0,0)' : '#aa0707';
		var randomtone = '#' + Math.floor(Math.random() * 16777215).toString(16)
		sctx.fillStyle = ctx.fillStyle = (options.pollock) ? randomtone : redtone;

		splat(mouse.x, mouse.y, items)

	}


}

canvas.onmouseup = function () {

	console.log('mouseup');
	clicked = false;
	mouse.dx = mouse.dy = 0

}

canvas.onmousemove = function (e) {

	if (clicked) {
		var distx = (mouse.px - mouse.x),
			disty = (mouse.py - mouse.y);
		mouse = {
			x: e.pageX,
			y: e.pageY,
			dx: (Math.abs(distx) > 10) ? -1 : distx,
			dy: (Math.abs(disty) > 10) ? -1 : disty,
			px: mouse.x,
			py: mouse.y
		}
		splat(mouse.x, mouse.y, items)

	}

}**/

window.onblur = function () {

	focused = false;

}