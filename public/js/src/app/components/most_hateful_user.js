Vue.component('most-hateful-user', {

	template: `
		<div id="most_hateful_user" class="most_hated_user most_hateful_user">
			<h3 class="username"><a target="_blank" :href="'https://twitter.com/' + username">@{{ username }}</a></h3>
			<span v-html='$t("hateful_user")'></span>
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