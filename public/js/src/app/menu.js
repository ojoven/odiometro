Vue.component('menu-options', {
	template: `
		<ul id="menu">
			<li v-bind:class="{ active: showDashboard }"><i class="fa fa-dashboard"></i></li>
			<li v-bind:class="{ active: showUser }"><i class="fa fa-user"></i></li>
			<li v-bind:class="{ active: showInfo }"><i class="fa fa-question"></i></li>
		</ul>
  `,
	data() {
		return {
			showDashboard: true,
			showUser: false,
			showInfo: false
		}
	},
	created: function() {

	},
	methods: {
	}

});