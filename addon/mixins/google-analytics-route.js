import Ember from 'ember';

const loc = (window && window.location) || { pathname: '/' };

export default Ember.Mixin.create({
	/**
	 * Add the Google Analytics services to each route so it's available.
	 * @public
	 * @type {Service.GoogleAnalytics}
	 */
	_ga: Ember.inject.service('google-analytics'),
	
	/**
	 * Watches the didTransition event so we can update analytics.
	 * @public
	 * @type {Function}
	 */
	_emberTrackerPageView: Ember.on('didTransition', function() {
		const routeName = this.get('currentRouteName'),
			route = Ember.getOwner(this).lookup(`route:${routeName}`),
			ga = this.get('_ga');

		let page = loc.pathname,
			title = route.get('title') || (document && document.title) || '';

		if (Ember.typeOf(route.beforeAnalyticsPageview) === 'function') {
		 const changes = this.beforeAnalyticsPageview(ga);

			if (changes) {
				page = changes.page || page;
				title = changes.title || title;
			}
		}

		ga.pageview(page, title);
	}),
});
