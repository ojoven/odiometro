Vue.component('most-hated-user', {
	template: `
		<div id="most_hated_user" class="most_hated_user">
			<h3 class="username">{{ username }}</h3>
			<span>es el usuario recibiendo más odio en los últimos 10 minutos</span>
		</div>
  `,
	data() {
		return {
			username: ''
		}
	},
	created: function() {

		// Update tweet socket
		socket.on('most_hated_user', function(data) {
			console.log(data);
			this.updateMostHatedUser(data);
		}.bind(this));
	},
	methods: {
		updateMostHatedUser: function(data) {
			this.username = data.user;
		}
	}

});