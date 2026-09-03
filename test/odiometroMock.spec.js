var expect = require('chai').expect;
var mock = require('../public/js/mocks/odiometro');

describe('static Odiómetro replay', function () {
	it('returns deterministic historical points for each range', function () {
		var first = mock.createHistoricData({ type: 'hour', number: 1 }, 1700000000000);
		var second = mock.createHistoricData({ type: 'hour', number: 1 }, 1700000000000);

		expect(first).to.deep.equal(second);
		expect(first.graphData).to.have.length(12);
		expect(first.graphData[0]).to.include({ y: 68, hu1: '@debate_demo', hu2: 'altavoz_ficticio' });
	});

	it('supports the existing event contract without a server', function (done) {
		var socket = mock.createSocket({
			reducedMotion: true,
			setTimeout: function (callback) {
				callback();
				return 0;
			},
			clearTimeout: function () {}
		});

		socket.on('store_words', function (words) {
			expect(words).to.include('gentuza');
			socket.close();
			done();
		});
		socket.emit('retrieve_words');
	});

	it('does not emit replay updates after close', function (done) {
		var intervalCallbacks = [];
		var cleared = [];
		var socket = mock.createSocket({
			countInterval: 10,
			reducedMotion: false,
			setInterval: function (callback) {
				intervalCallbacks.push(callback);
				return intervalCallbacks.length;
			},
			clearInterval: function (timer) {
				cleared.push(timer);
			},
			setTimeout: function (callback) {
				callback();
				return 0;
			},
			clearTimeout: function () {}
		});

		var calls = 0;
		socket.on('number_tweets', function () {
			calls += 1;
		});
		socket.emit('retrieve_number_tweets');
		socket.close();
		intervalCallbacks.forEach(function (callback) { callback(); });

		expect(calls).to.equal(1);
		expect(cleared).to.deep.equal([1]);
		done();
	});
});
