/** STORE **/
// We're storing here the shared states
var store = {};

// Shared states between views and menu-options components
// We're using this store just for the first impression
store.showDashboard = true;
store.showUser = false;
store.showInfo = false;
store.showHistoric = false;

// Words
store.words = [];
socket.emit('retrieve_words');
socket.on('store_words', function (words) {
	console.log('hello words!', words);
	store.words = words;
}.bind(this));