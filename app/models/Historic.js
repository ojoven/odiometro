/** HISTORIC **/
var Historic = {

	getDatesFromParameters: function(parameters) {

		var now = new Date();
		var hours = 1000*60*60;
		var days = hours*24;
		var dateStartUnix;

		if (parameters.type === 'hour') {
			dateStartUnix = new Date(now.getTime() - (parameters.number * hours));
		} else if (parameters.type === 'day') {
			dateStartUnix = new Date(now.getTime() - (parameters.number * days));
		}

		var date = {};
		date.start = dateStartUnix.toISOString().slice(0, 19).replace('T', ' ');
		date.end = now.toISOString().slice(0, 19).replace('T', ' '); // now

		return date;
	},

	parseHistoricData: function(parameters, historicData, averages) {

		var data = {};
		data.resume = this.getResumeFromData(historicData);
		data.graphData = this.parseHistoricDataForGraph(historicData);
		data.graphData = this.decimate(data.graphData, parameters);
		data.labels = this.getLabels(data.graphData);
		data.averageData = this.getAverageDataset(data.graphData, averages);

		return data;

	},

	getAverageDataset: function(data, averages) {

		var averageDataset = [];

		var that = this;

		data.forEach(function(point) {

			var hours = point.t.getHours();
			var minutes = point.t.getMinutes();
			minutes = that.addPaddingZeroesToMinutes(minutes);
			var index = hours + ':' + minutes;

			var averagePoint = {
				t: point.t,
				y: averages[index]
			};

			averageDataset.push(averagePoint);

		});

		return averageDataset;

	},

	parseHistoricDataForGraph: function(data) {

		var parsedData = [];

		data.forEach(function(point) {

			var parsedPoint = {};
			parsedPoint.t = new Date(point.date);
			parsedPoint.y = point.number_tweets;
			parsedPoint.hu1 = point.hated_user;
			parsedPoint.hu2 = point.hateful_user;
			parsedData.push(parsedPoint);

		});

		return parsedData;

	},

	decimate: function(sample, parameters) {

		var blocksz = this.getDecimateRange(parameters);
		if (blocksz == 1) return sample;

		var chunks = [];

		// Chunk up the sample
		while (sample.length > 0) {
			chunks.push(sample.splice(0, blocksz));
		}

		var new_sample = [];
		// Process each chunk, and downsample
		for (var chunk in chunks) {

			var val = [];
			var hu1 = [];
			var hu2 = [];
			for (var i in chunks[chunk]) {
				val.push(chunks[chunk][i]["y"]);
				hu1.push(chunks[chunk][i]["hu1"]);
				hu2.push(chunks[chunk][i]["hu2"]);
			}

			var average = this.getAverageNumberFromArray(val);
			hu1 = this.sortByFrequency(hu1)[0];
			hu2 = this.sortByFrequency(hu2)[0];

			new_sample.push({
				t: chunks[chunk][0]["t"],
				y: average,
				hu1: hu1,
				hu2: hu2
			});
		}

		return new_sample;
	},

	getDecimateRange: function(parameters) {

		var rangeBetweenPoints;

		// Last hour
		if (parameters.type === 'hour' && parameters.number == 1) {
			rangeBetweenPoints = 1;

			// Last 3 hours
		} else if (parameters.type === 'hour' && parameters.number == 3) {
			rangeBetweenPoints = 3;

			// Last 6 hours
		} else if (parameters.type === 'hour' && parameters.number == 6) {
			rangeBetweenPoints = 5;

			// Last 12 hours
		} else if (parameters.type === 'hour' && parameters.number == 12) {
			rangeBetweenPoints = 10;

			// Last 24 hours
		} else if (parameters.type === 'hour' && parameters.number == 24) {
			rangeBetweenPoints = 20;

			// Last 3 days
		} else if (parameters.type === 'day' && parameters.number == 3) {
			rangeBetweenPoints = 30;

			// Last 7 days
		}  else if (parameters.type === 'day' && parameters.number == 7) {
			rangeBetweenPoints = 60;
		}

		return rangeBetweenPoints;

	},

	getLabels: function(graphData) {

		var labels = [];
		var that = this;

		graphData.forEach(function(point) {

			point.t = new Date(point.t);
			point.t.setHours(point.t.getHours()+1);
			var minutes = point.t.getMinutes();
			minutes = that.addPaddingZeroesToMinutes(minutes);

			labels.push(point.t.getHours() + ':' + minutes);
		});

		return labels;

	},

	addPaddingZeroesToMinutes: function(minutes) {

		var str = "" + minutes;
		var pad = "00";
		minutes = pad.substring(0, pad.length - str.length) + str;

		return minutes;
	},

	getResumeFromData: function(data) {

		// Initialize variables
		var resume = {};

		var hatedUsers = [];
		var hatedUsersWithExamples = [];
		var hatedUsersComplete = [];

		var hatefulUsers = [];
		var hatefulUsersWithExamples = [];
		var hatefulUsersComplete = [];

		// Get array with all hated users
		data.forEach(function(point) {
			hatedUsers.push(point.hated_user);
			hatedUsersWithExamples[point.hated_user] = {text:point.hated_user_example_tweet_text,id:point.hated_user_example_tweet_id,user:point.hated_user_example_tweet_user};
		});

		hatedUsers = this.sortByFrequency(hatedUsers);
		hatedUsers = hatedUsers.slice(0,5);
		hatedUsers.forEach(function(hatedUser) {
			hatedUsersComplete.push({user:hatedUser, tweet:hatedUsersWithExamples[hatedUser]});
		});

		resume.hatedUser = hatedUsersComplete.shift();
		if (resume.hatedUser) {
			resume.hatedUser.others = hatedUsersComplete;
		} else {
			resume.hatedUser = {};
			resume.hatedUser.others = hatedUsersComplete;
		}

		// Get array with all hateful users
		data.forEach(function(point) {
			hatefulUsers.push(point.hateful_user);
			hatefulUsersWithExamples[point.hateful_user] = {text:point.hateful_user_tweet_text,id:point.hateful_user_tweet_id,user:point.hateful_user};
		});

		hatefulUsers = this.sortByFrequency(hatefulUsers);
		hatefulUsers = hatefulUsers.slice(0,5);
		hatefulUsers.forEach(function(hatefulUser) {
			hatefulUsersComplete.push({user:hatefulUser, tweet:hatefulUsersWithExamples[hatefulUser]});
		});

		resume.hatefulUser = hatefulUsersComplete.shift();
		if (resume.hatefulUser) {
			resume.hatefulUser.others = hatefulUsersComplete;
		} else {
			resume.hatefulUser = {};
			resume.hatefulUser.others = hatefulUsersComplete;
		}

		return resume;
	},

	sortByFrequency: function(array) {
		var frequency = {};

		array.forEach(function(value) { frequency[value] = 0; });

		var uniques = array.filter(function(value) {
			return ++frequency[value] == 1;
		});

		return uniques.sort(function(a, b) {
			return frequency[b] - frequency[a];
		});
	},

	getAverageNumberFromArray: function(array) {

		var average = Math.floor(array.reduce(function(p,c,i,a){return p + (c/a.length)},0));
		return average;

	},

	createAveragesFromHistoricNumberTweets: function(results) {

		var averages = [];
		var averagesAux = [];

		if (!results) return averages;

		results.forEach(function(result) {

			var hour = result.date.getHours();
			var minute = result.date.getMinutes();
			minute = Historic.addPaddingZeroesToMinutes(minute);
			var index = hour + ':' + minute;

			if (typeof averagesAux[index] === "undefined") {
				averagesAux[index] = [];
			}

			averagesAux[index].push(result.number_tweets);
		});

		Object.keys(averagesAux).forEach(function(key, index) {
			averages[key] = Historic.getAverageNumberFromArray(averagesAux[key]);
		});

		return averages;
	}
};


module.exports = Historic;

