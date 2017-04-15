import Ember from 'ember';
import config from './config/environment';
import GoogleAnalyticsRoute from 'ember-tracker/mixins/google-analytics-route';
import TealiumRoute from 'ember-tracker/mixins/tealium-route';

const Router = Ember.Router.extend(
	GoogleAnalyticsRoute,
	TealiumRoute, {
		location: config.locationType,
		rootURL: config.rootURL
	}
);

Router.map(function() {
  this.route('google-analytics');
  this.route('tealium');
});

export default Router;
