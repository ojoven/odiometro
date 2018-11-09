const Info = Vue.component('info', {

	template: `
		<div id="info">
			<h3>{{ $t("about[0]") }}</h3>
			<p v-html='$t("about[1]")'></p>
			<p v-html='$t("about[2]")'></p>
			<p v-html='$t("about[3]")'></p>
			<p v-html='$t("about[4]")'></p>
		</div>
  `

});