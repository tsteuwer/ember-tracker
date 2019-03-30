import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
	googleAnalytics: service(),
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
