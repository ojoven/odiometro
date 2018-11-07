/** CHART EXTEND **/
Chart.plugins.register({
	afterDatasetsDraw: function(chart) {
		if (chart.tooltip._active && chart.tooltip._active.length) {
			var activePoint = chart.tooltip._active[0],
				ctx = chart.ctx,
				y_axis = chart.scales['y-axis-0'],
				x = activePoint.tooltipPosition().x,
				topY = y_axis.top,
				bottomY = y_axis.bottom;
			// draw line
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(x, topY);
			ctx.lineTo(x, bottomY);
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#8A0707';
			ctx.stroke();
			ctx.restore();
		}
	}
});