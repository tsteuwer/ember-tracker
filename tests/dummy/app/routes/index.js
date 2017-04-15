import BaseRoute from '../-privates/routes/base';

export default BaseRoute.extend({
	title: 'Ember Tracker: A simpler way to track your Ember JS application.',
	beforeGoogleAnalytics() {
		console.log('yasss');
	},
});
