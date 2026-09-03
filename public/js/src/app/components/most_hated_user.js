Vue.component('most-hated-user', {

	template: `
		<div id="most_hated_user" class="most_hated_user">
			<h3 class="username"><component :is="mockMode ? 'span' : 'a'" class="username-value"
				:target="mockMode ? null : '_blank'"
				:rel="mockMode ? null : 'noopener noreferrer'"
				:href="mockMode ? null : 'https://twitter.com/' + username">{{ username }}</component></h3>
			<span v-html='$t("hated_user")'></span>
		</div>
  `,

	data() {
		return {
			username: '',
			mockMode: store.mockMode
		}
	},

	created: function() {

		// Let's ask immediately for the most hated user
		socket.emit('retrieve_most_hated_user', true);

		// When we receive it, let's update the user
		socket.on('most_hated_user', function(data) {
			this.updateMostHatedUser(data);
		}.bind(this));

	},

	methods: {

		updateMostHatedUser: function(data) {
			this.username = data.user;
		}
	}

});
