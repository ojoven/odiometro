(function (root, factory) {
	var mock = factory();

	if (typeof module === 'object' && module.exports) {
		module.exports = mock;
	}

	if (root && root.document) {
		root.ODIOMETRO_STATIC_DEMO = true;
		root.OdiometroMock = mock;
		root.io = function () {
			var socket = mock.createSocket();
			root.addEventListener('pagehide', function () {
				socket.close();
			}, { once: true });
			return socket;
		};
	}
}(typeof window !== 'undefined' ? window : this, function () {
	'use strict';

	var countSequence = [72, 78, 81, 76, 84, 89, 83, 75];
	var historicSequence = [61, 68, 73, 66, 79, 86, 82, 74, 91, 88, 77, 70];
	var averageSequence = [69, 70, 71, 71, 72, 73, 73, 74, 74, 73, 72, 71];
	var words = ['pesado', 'gentuza', 'miserable', 'inútiles', 'caradura', 'payaso'];
	var tweets = [
		{
			id_str: 'demo-001',
			screen_name: 'cuenta_demo_1',
			tweet: '@debate_demo Eres un pesado. Repetirlo no convierte tu opinión en un hecho.',
			words: ['pesado']
		},
		{
			id_str: 'demo-002',
			screen_name: 'perfil_ficticio_2',
			tweet: 'Menuda gentuza. Es imposible hablar cuando todo acaba a gritos.',
			words: ['gentuza']
		},
		{
			id_str: 'demo-003',
			screen_name: 'usuario_de_prueba',
			tweet: '@foro_demo Tu respuesta es miserable. Se puede discrepar sin atacar a nadie.',
			words: ['miserable']
		},
		{
			id_str: 'demo-004',
			screen_name: 'cuenta_demo_3',
			tweet: 'Vaya panda de inútiles. Siempre estropeáis cualquier conversación.',
			words: ['inútiles']
		},
		{
			id_str: 'demo-005',
			screen_name: 'perfil_ficticio_4',
			tweet: '@debate_demo Qué caradura. Cambias de argumento cada vez que te responden.',
			words: ['caradura']
		},
		{
			id_str: 'demo-006',
			screen_name: 'cuenta_demo_5',
			tweet: 'Deja de comportarte como un payaso y escucha antes de contestar.',
			words: ['payaso']
		}
	];
	var mostHatedUser = {
		user: '@debate_demo',
		tweets: [
			{
				id_str: 'demo-hated-001',
				screen_name: 'perfil_ficticio_2',
				text: '@debate_demo Eres un pesado. No escuchas a nadie.',
				words: 'pesado'
			},
			{
				id_str: 'demo-hated-002',
				screen_name: 'cuenta_demo_3',
				text: '@debate_demo Menudo caradura estás hecho.',
				words: 'caradura'
			}
		],
		image: 'img/mock/avatar-hated.svg'
	};
	var mostHatefulUser = {
		user: 'altavoz_ficticio',
		tweet: {
			id_str: 'demo-hateful-001',
			screen_name: 'altavoz_ficticio',
			tweet: '@foro_demo Sois una panda de inútiles. No merece la pena leeros.',
			words: ['inútiles']
		},
		image: 'img/mock/avatar-hateful.svg'
	};
	var resume = {
		hatedUser: {
			user: '@debate_demo',
			tweet: {
				text: '@debate_demo Eres un pesado. No escuchas a nadie.',
				id: 'demo-hated-001',
				user: 'perfil_ficticio_2'
			},
			others: [
				{ user: '@foro_demo', tweet: { id: 'demo-other-001', user: 'cuenta_demo_1' } },
				{ user: '@charla_ficticia', tweet: { id: 'demo-other-002', user: 'cuenta_demo_3' } }
			]
		},
		hatefulUser: {
			user: 'altavoz_ficticio',
			tweet: {
				text: '@foro_demo Sois una panda de inútiles. No merece la pena leeros.',
				id: 'demo-hateful-001',
				user: 'altavoz_ficticio'
			},
			others: [
				{ user: 'cuenta_demo_3', tweet: { id: 'demo-other-003', user: 'cuenta_demo_3' } },
				{ user: 'perfil_ficticio_4', tweet: { id: 'demo-other-004', user: 'perfil_ficticio_4' } }
			]
		}
	};

	function clone(data) {
		if (data === null || typeof data !== 'object') return data;
		return JSON.parse(JSON.stringify(data));
	}

	function getRangeInHours(parameters) {
		var type = parameters && parameters.type === 'day' ? 'day' : 'hour';
		var number = parseInt(parameters && parameters.number, 10);
		if (!number || number < 1) number = 1;
		return type === 'day' ? number * 24 : number;
	}

	function getPointCount(hours) {
		if (hours <= 1) return 12;
		if (hours <= 6) return 18;
		return 24;
	}

	function formatHistoricLabel(timestamp, hours) {
		var options = hours > 24 ? {
			day: '2-digit',
			month: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		} : {
			hour: '2-digit',
			minute: '2-digit'
		};
		return new Intl.DateTimeFormat('es-ES', options).format(new Date(timestamp));
	}

	function createHistoricData(parameters, now) {
		var hours = getRangeInHours(parameters);
		var pointCount = getPointCount(hours);
		var end = typeof now === 'number' ? now : Date.now();
		var step = hours * 60 * 60 * 1000 / (pointCount - 1);
		var labels = [];
		var graphData = [];
		var averageData = [];

		for (var index = 0; index < pointCount; index++) {
			var timestamp = Math.round(end - (pointCount - index - 1) * step);
			var sequenceIndex = (index + hours) % historicSequence.length;
			labels.push(formatHistoricLabel(timestamp, hours));
			graphData.push({
				t: timestamp,
				y: historicSequence[sequenceIndex],
				hu1: mostHatedUser.user,
				hu2: mostHatefulUser.user
			});
			averageData.push({
				t: timestamp,
				y: averageSequence[sequenceIndex]
			});
		}

		return {
			labels: labels,
			graphData: graphData,
			averageData: averageData,
			resume: clone(resume)
		};
	}

	function createSocket(options) {
		options = options || {};
		var listeners = {};
		var countIndex = 0;
		var tweetIndex = 0;
		var countTimer = null;
		var tweetTimer = null;
		var pendingTimeouts = [];
		var closed = false;
		var setTimeoutFunction = options.setTimeout || setTimeout;
		var clearTimeoutFunction = options.clearTimeout || clearTimeout;
		var setIntervalFunction = options.setInterval || setInterval;
		var clearIntervalFunction = options.clearInterval || clearInterval;
		var nowFunction = options.now || Date.now;
		var reducedMotion = options.reducedMotion;

		if (typeof reducedMotion === 'undefined') {
			reducedMotion = typeof window !== 'undefined' && window.matchMedia &&
				window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		}

		function dispatch(event, data) {
			if (closed || !listeners[event]) return;
			listeners[event].slice().forEach(function (listener) {
				listener(clone(data));
			});
		}

		function defer(event, data) {
			var timeout = setTimeoutFunction(function () {
				dispatch(event, data);
			}, 0);
			pendingTimeouts.push(timeout);
		}

		function startCountReplay() {
			if (reducedMotion || countTimer !== null) return;
			countTimer = setIntervalFunction(function () {
				countIndex = (countIndex + 1) % countSequence.length;
				dispatch('number_tweets', { number_tweets: countSequence[countIndex] });
			}, options.countInterval || 2000);
		}

		function startTweetReplay() {
			if (reducedMotion || tweetTimer !== null) return;
			tweetTimer = setIntervalFunction(function () {
				tweetIndex = (tweetIndex + 1) % tweets.length;
				dispatch('tweet', tweets[tweetIndex]);
			}, options.tweetInterval || 5000);
		}

		var socket = {
			on: function (event, listener) {
				if (!listeners[event]) listeners[event] = [];
				listeners[event].push(listener);
				return socket;
			},

			off: function (event, listener) {
				if (!listeners[event]) return socket;
				listeners[event] = listeners[event].filter(function (registeredListener) {
					return registeredListener !== listener;
				});
				return socket;
			},

			emit: function (event, parameters) {
				if (closed) return socket;

				if (event === 'retrieve_words') {
					defer('store_words', words);
				} else if (event === 'retrieve_number_tweets') {
					defer('number_tweets', { number_tweets: countSequence[countIndex] });
					startCountReplay();
				} else if (event === 'retrieve_last_tweet') {
					defer('tweet', tweets[tweetIndex]);
					startTweetReplay();
				} else if (event === 'retrieve_most_hated_user') {
					defer('most_hated_user', { user: mostHatedUser.user });
					defer('most_hated_user_tweets', mostHatedUser.tweets);
					defer('most_hated_user_image', { image_url: mostHatedUser.image });
				} else if (event === 'retrieve_most_hateful_user') {
					defer('most_hateful_user', mostHatefulUser.user);
					defer('most_hateful_user_tweet', mostHatefulUser.tweet);
					defer('most_hateful_user_image', { image_url: mostHatefulUser.image });
				} else if (event === 'retrieve_historic') {
					defer('historic', createHistoricData(parameters, nowFunction()));
				}

				return socket;
			},

			close: function () {
				closed = true;
				pendingTimeouts.forEach(function (timeout) {
					clearTimeoutFunction(timeout);
				});
				if (countTimer !== null) clearIntervalFunction(countTimer);
				if (tweetTimer !== null) clearIntervalFunction(tweetTimer);
				countTimer = null;
				tweetTimer = null;
			}
		};

		return socket;
	}

	return {
		createHistoricData: createHistoricData,
		createSocket: createSocket,
		getFixtures: function () {
			return clone({
				countSequence: countSequence,
				tweets: tweets,
				words: words,
				mostHatedUser: mostHatedUser,
				mostHatefulUser: mostHatefulUser
			});
		}
	};
}));
