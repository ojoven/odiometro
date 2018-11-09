Vue.component('blood-canvas', {

	template: `
		<canvas id="blood"></canvas>
  `,

	data() {

		return {
			canvas: false,
			ctx: false,
			focused: false,
			clicked: false,
			shadow: false,
			sctx: false,
			items: [],
			mouse: {},
			options: {}
		}
	},

	mounted: function() {

		this.initialize();
		this.initializeMouseEvents();

		socket.on('tweet', function(tweet) {
			var that = this;
			setTimeout(function() {
				if (that.items.length < 100) {
					that.randomSplatter();
				} else {
					that.items = [];
				}
			}, 200);
		}.bind(this));
	},

	methods: {

		initialize: function() {

			this.canvas = document.getElementById('blood');
			this.ctx = this.canvas.getContext('2d');
			this.shadow = document.createElement('canvas');
			this.sctx = this.shadow.getContext('2d');

			this.mouse = {
				x: 0,
				y: 0,
				dx: 0,
				dy: 0,
				px: 0,
				py: 0
			};

			this.options = {
				scatter: 0.6,
				gravity: 0.7,
				consistency: 0.04,
				pollock: false,
				burst: true,
				shade: false
			};

			this.canvas.width = this.shadow.width = window.innerWidth * 2;
			this.canvas.height = this.shadow.height = window.innerHeight * 2;

			this.canvas.style.width = this.canvas.width/2 + "px";
			this.canvas.style.height = this.canvas.height/2 + "px";
			this.sctx.fillStyle = this.ctx.fillStyle = '#8A0707';
		},

		drawloop: function() {

			if (this.focused) {
				requestAnimationFrame(this.drawloop);
			}
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.drawsplat(this.items)
		},

		splat: function(x, y, arr) {

			for (var i = 0; i < 30; i++) {
				var s = Math.random() * Math.PI;
				var dirx = (((Math.random() < .5) ? 3 : -3) * (Math.random() * 3)) * this.options.scatter;
				var diry = (((Math.random() < .5) ? 3 : -3) * (Math.random() * 3)) * this.options.scatter;

				arr.push({
					x: x,
					y: y,
					dx: dirx + this.mouse.dx,
					dy: diry + this.mouse.dy,
					size: s
				})
			}

		},

		drawsplat: function(arr) {

			var i = arr.length;
			while (i--) {
				var t = arr[i];
				var x = t.x,
					y = t.y,
					s = t.size;
				this.circle(x, y, s, this.ctx);

				t.dy -= this.options.gravity;
				t.x -= t.dx;
				t.y -= t.dy;
				t.size -= 0.05;

				if (arr[i].size < 0.3 || Math.random() < this.options.consistency) {
					this.circle(x, y, s, this.sctx);
					arr.splice(i, 1);
				}
			}

			this.ctx.drawImage(this.shadow, 0, 0);
		},

		circle: function(x, y, s, c) {

			c.beginPath();
			c.arc(x, y, s * 5, 0, 2 * Math.PI, false);
			c.fill();
			c.closePath();

		},

		randomSplatter: function() {

			var min = 0;
			var width = this.canvas.width;
			var height = this.canvas.height;

			var x = Math.random() * (width - min) + min;
			var y = Math.random() * (height - min) + min;
			this.sctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

			this.splat(x, y, this.items);
		},

		fireMouseEvents: function(query, eventNames) {
			var element = document.querySelector(query);
			if(element && eventNames && eventNames.length){
				for(var index in eventNames){
					var eventName = eventNames[index];
					if(element.fireEvent ){
						element.fireEvent( 'on' + eventName );
					} else {
						var eventObject = document.createEvent( 'MouseEvents' );
						eventObject.initEvent( eventName, true, false );
						element.dispatchEvent(eventObject);
					}
				}
			}
		},

		initializeMouseEvents: function() {

			var that = this;

			// Mouse Down
			this.canvas.onmousedown = function (e) {

				if (!that.focused) {
					that.focused = true;
					that.drawloop();
				} else {
					that.clicked = true;

					console.log(that.options);
					if (that.options.burst) {
						setTimeout(function () {
							that.clicked = false;
						}, 100);
					}
				}
			};

			this.canvas.onmouseup = function () {

				that.clicked = false;
				that.mouse.dx = that.mouse.dy = 0

			};

			this.canvas.onmousemove = function (e) {

				if (that.clicked) {
					var distx = (that.mouse.px - that.mouse.x),
						disty = (that.mouse.py - that.mouse.y);
					that.mouse = {
						x: e.pageX,
						y: e.pageY,
						dx: (Math.abs(distx) > 10) ? -1 : distx,
						dy: (Math.abs(disty) > 10) ? -1 : disty,
						px: mouse.x,
						py: mouse.y
					};
					that.splat(that.mouse.x, that.mouse.y, that.items);

				}

			};

			window.onfocus = function () {
				that.items = [];
			};

			var that = this;
			setTimeout(function() {
				that.fireMouseEvents("canvas[id='blood']",['mouseover','mousedown','mouseup','click']);
			}, 100);

		}

	}

});