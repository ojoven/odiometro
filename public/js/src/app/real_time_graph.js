var options = {maxValueScale:1.28, grid:{fillStyle:'#ffffff',strokeStyle:'#f0f0f0',sharpLines:true},labels:{fillStyle:'#0d0d0d', precision: 0}};
var smoothie = new SmoothieChart(options);
smoothie.streamTo(document.getElementById("canvas"));

// Data
var num_tweets_graph = 0;
var line1 = new TimeSeries();

// Add a random value to each line every second
setInterval(function() {
	line1.append(new Date().getTime(), num_tweets_graph);
}, 1000);

// Add to SmoothieChart
smoothie.addTimeSeries(line1, {lineWidth:2,strokeStyle:'#CD2626'});

socket.on('number_tweets', function(data) {
	num_tweets_graph = data.number_tweets;
}.bind(this));