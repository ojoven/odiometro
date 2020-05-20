Vue.component('most-hated-user-image', {

	template: `
		<div>
			<div id="most_hateful_user_image" class="image" v-bind:style="{ backgroundImage: 'url(' + imageUrl + ')' }">
			</div>
		</div>
  `,

	data() {
		return {
			imageUrl: 'https://abs.twimg.com/sticky/default_profile_images/default_profile.png',
		}
	},

	created: function () {

		var that = this;

		// When we receive it, let's update the user
		socket.on('most_hated_user_image', function (data) {
			if (data) {
				that.imageUrl = data.image_url;
			}
		}.bind(this));

	},

});