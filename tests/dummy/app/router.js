import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import GoogleAnalyticsRoute from 'ember-tracker/mixins/google-analytics-route';
import TealiumRoute from 'ember-tracker/mixins/tealium-route';

const Router = EmberRouter.extend(
    GoogleAnalyticsRoute,
    TealiumRoute, {
        location: config.locationType,
        rootURL: config.rootURL
    }
);

Router.map(function() {
  this.route('google-analytics', function() {
    this.route('test-nested-route');
    this.route('test-with-slug', {
			path: 'test-with-id/:some_slug',
		});
    this.route('test-with-id', {
			path: 'test-with-id/:some_id',
		});
  });
  this.route('tealium');
});

export default Router;
