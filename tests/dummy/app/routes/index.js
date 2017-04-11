import Ember from 'ember';
import GoogleAnalyticsRoute from 'ember-tracker/mixins/google-analytics-route';

export default Ember.Route.extend(GoogleAnalyticsRoute, {
	title: 'Ember Analytics',
	model() {
		const googleAnalytics = this.get('googleAnalytics');
		return {
			googleAnalytics,
		};
	}
});
