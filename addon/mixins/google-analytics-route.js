import Ember from 'ember';

const loc = (window && window.location) || { pathname: '/' };

/**
 * Turns a route name (e.g. "index" or "categories/category/index") to the actual url ("/" or "categories/category").
 * @public
 * @type {Function}
 * @param {String} route
 * @return {String}
 */
export function routeNameToUrl(route) {
	if (route === 'index') {
		return '/';
	}

	return route
		.split('.')
		.filter(route => route !== 'index')
		.join('/');
};

export default Ember.Mixin.create({
	/**
	 * Add the Google Analytics services to each route so it's available.
	 * @public
	 * @type {Service.GoogleAnalytics}
	 */
	googleAnalytics: Ember.inject.service('google-analytics'),
	
	/**
	 * Allow people to set/change things before the service is called.
	 * @public
	 * @type {Function}
	 */
	beforeAnalyticsPageview: function(){},

	actions: {
		/**
		 * Add our own didTransition to the actions so we can set a new pageview when it changes to this route.
		 * @public
		 * @type {Function}
		 */
		didTransition() {
			this._super(...arguments);

			let page = loc.pathname,
				title = this.get('title') || (document && document.title) || '';

			const changes = this.beforeAnalyticsPageview();

			if (changes) {
				page = changes.page || page;
				title = changes.title || title;
			}
			this.get('googleAnalytics').pageview(page, title);
		},
	},
});
