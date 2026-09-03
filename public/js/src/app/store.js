/** STORE **/
// We're storing here the shared states
var store = {};

// Shared states between views and menu-options components
// We're using this store just for the first impression
store.showDashboard = true;
store.showUser = false;
store.showInfo = false;
store.showHistoric = false;

// Static archive mode is enabled by the mock loaded on the main Odiómetro page.
store.mockMode = typeof window !== 'undefined' && window.ODIOMETRO_STATIC_DEMO === true;
store.reducedMotion = typeof window !== 'undefined' && window.matchMedia &&
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Words
store.words = [];
socket.emit('retrieve_words');
socket.on('store_words', function (words) {
	console.log('hello words!', words);
	store.words = words;
}.bind(this));
