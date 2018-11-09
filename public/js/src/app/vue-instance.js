/** MAIN **/

var app = {
	el:	'#app',
	data: { },
	created: function() {
		console.log('Vue is running');
	},
	methods: { },
	components: {
		Info
	}
};

// Create VueI18n instance with options
app.i18n = new VueI18n({
	locale: 'en', // set locale
	messages // set locale messages
});

Object.defineProperty(Vue.prototype, '$locale', {
	get: function () {
		return app.i18n.locale
	},
	set: function (locale) {
		app.i18n.locale = locale
	}
})

// VueJS Main
const appVue = new Vue(app);