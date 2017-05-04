import Ember from 'ember';
import { getCurrentRoute } from 'ember-tracker/-privates/utils';

const {
	inject: {
		service,
	},
	on,
	typeOf,
} = Ember;

export default Ember.Mixin.create({
	/**
	 * Add the Google Analytics services to each route so it's available.
	 * @public
	 * @memberOf {GoogleAnalyticsRoute}
	 * @type {Service.GoogleAnalytics}
	 */
	_ga: service('google-analytics'),
	
	/**
	 * Watches the didTransition event so we can update analytics.
	 * @public
	 * @observes {didTransition}
	 * @memberOf {GoogleAnalyticsRoute}
	 * @type {Function}
	 */
	_etPageView: on('didTransition', function() {
		const routeName = this.get('currentRouteName'),
			route = this._etGetCurrentRoute(routeName),
			ga = this.get('_ga');

		const applyArgs = [this.get('url'), getTitle(route)];

		if (typeOf(route.beforeAnalyticsPageview) === 'function') {
			const changes = route.beforeAnalyticsPageview(ga);

			if (changes) {
				if (changes.page) {
					applyArgs[0] = changes.page;
				}
				if (changes.title) {
					applyArgs[1] = changes.title;
				}
				if (changes.options) {
					applyArgs[2] = changes.options;
				}
			}
		}

		ga.pageview.apply(ga, applyArgs);
	}),
	
	/**
	 * Returns the route required.
	 * @private
	 * @memberOf {GoogleAnalyticsRoute}
	 * @return {Route}
	 */
	_etGetCurrentRoute(routeName) {
		return getCurrentRoute(this, routeName);
	},
});

/**
 * Returns the page title either by looking at the route or grabbing it from the dom.
 * @public
 * @memberOf {GoogleAnalyticsRoute}
 * @param {Ember.Route} route
 * @return {String}
 */
function getTitle(route) {
	return route.get('title') || (document && document.title) || '';
}
