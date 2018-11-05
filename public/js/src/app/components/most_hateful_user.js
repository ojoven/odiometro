Vue.component('most-hateful-user', {

	template: `
		<div id="most_hateful_user" class="most_hated_user most_hateful_user">
			<h3 class="username">{{ username }}</h3>
			<span>es el usuario generando más odio<br>en los últimos 10 minutos</span>
		</div>
  `,

	data() {
		return {
			username: ''
		}
	},

	created: function() {

		// Let's ask immediately for the most hated user
		socket.emit('retrieve_most_hateful_user', true);

		// When we receive it, let's update the user
		socket.on('most_hateful_user', function(data) {
			this.updateMostHatefulUser(data);
		}.bind(this));

	},

	methods: {

		updateMostHatefulUser: function(data) {
			this.username = data.user;
		}
	}

});