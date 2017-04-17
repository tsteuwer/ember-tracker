import Ember from 'ember';

const {
	getOwner,
	typeOf,
} = Ember;

export default Ember.Mixin.create({
	/**
	 * Add the Google Analytics services to each route so it's available.
	 * @public
	 * @memberOf {GoogleAnalyticsRoute}
	 * @type {Service.GoogleAnalytics}
	 */
	_ga: Ember.inject.service('google-analytics'),
	
	/**
	 * Watches the didTransition event so we can update analytics.
	 * @public
	 * @memberOf {GoogleAnalyticsRoute}
	 * @type {Function}
	 */
	_emberTrackerPageView: Ember.on('didTransition', handlePageView),
});

/**
 * Observes and sends our page view anytime a route transitions.
 * @public
 * @memberOf {GoogleAnalyticsRoute}
 * @return {undefined}
 */
function handlePageView() {
	const owner = getOwner(this),
		routeName = this.get('currentRouteName'),
		route = owner.lookup(`route:${routeName}`),
		ga = this.get('_ga');

	let page = this.get('url'),
		title = getTitle(route);

	if (typeOf(route.beforeAnalyticsPageview) === 'function') {
		const changes = route.beforeAnalyticsPageview(ga);

		if (changes) {
			page = changes.page || page;
			title = changes.title || title;
		}
	}

	ga.pageview(page, title);
}

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
