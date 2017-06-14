import Vue from 'vue';
import TestMe from '../../components/tweets.vue';

describe('tweets.vue', function() {
	it('should pass this test', function() {

		expect(true).toBeFalsy();
		/**
		// Extend the component to get the constructor, which we can then initialize directly.
		const Constructor = Vue.extend(TestMe);

		const comp = new Constructor({
			propsData: {
				// Props are passed in "propsData".
				propValue: 'Test Text'
			}
		}).$mount();

		expect(comp.$el.textContent)
			.to.equal('Test Text');

		 **/
	});
});