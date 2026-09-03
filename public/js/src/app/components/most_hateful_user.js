Vue.component('most-hateful-user', {

	template: `
		<div id="most_hateful_user" class="most_hated_user most_hateful_user">
			<h3 class="username"><component :is="mockMode ? 'span' : 'a'" class="username-value"
				:target="mockMode ? null : '_blank'"
				:rel="mockMode ? null : 'noopener noreferrer'"
				:href="mockMode ? null : 'https://twitter.com/' + username">@{{ username }}</component></h3>
			<span v-html='$t("hateful_user")'></span>
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
		socket.emit('retrieve_most_hateful_user', true);

		// When we receive it, let's update the user
		socket.on('most_hateful_user', function(user) {
			this.updateMostHatefulUser(user);
		}.bind(this));

	},

	methods: {

		updateMostHatefulUser: function(data) {
			this.username = data;
		}
	}

});
