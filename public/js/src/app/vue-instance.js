/** MAIN **/

var app = {
	el: '#app',
	data: {},
	created: function () {
		console.log('Vue is running');
	},
	methods: {},
	components: {
		Info
	}
};

Vue.prototype.$t = function (data) {
	var message;
	var dataProperties = data.split('.');
	if (dataProperties.length === 1) message = messages[dataProperties[0]];
	if (dataProperties.length === 2) message = messages[dataProperties[0]][dataProperties[1]];
	if (dataProperties.length === 3) message = messages[dataProperties[0]][dataProperties[1]][dataProperties[2]];
	if (dataProperties.length === 4) message = messages[dataProperties[0]][dataProperties[1]][dataProperties[2]][dataProperties[3]];
	return message;
}

// VueJS Main
const appVue = new Vue(app);