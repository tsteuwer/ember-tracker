import Ember from 'ember';

export default Ember.Controller.extend({
	googleAnalytics: Ember.inject.service(),
	actions: {
		sendEvent() {
			this.get('googleAnalytics').event('Testing Category', 'click', 'Test Label', 1);
		},
		sendTiming() {
			this.get('googleAnalytics').timing('Testing Timing', 'Timing Button', 1, 'Timing Label');
		},
		sendSocial() {
			this.get('googleAnalytics').social('Google+', 'share', 'https://plus.google.com');
		}
	},
});
