import Ember from 'ember';
import { getCurrentRoute, mergeObjects } from 'ember-tracker/-privates/utils';

const {
	getWithDefault,
} = Ember;

export const DEFAULT_VIEW = {
	customerId: null,
	domain: getWithDefault((window || {}), 'location.hostname', ''),
	order_currency: 'USD',
	page_type: 'home',
};

const {
	run,
	typeOf,
} = Ember;

export default Ember.Mixin.create({
	/**
	 * Sets the utag.
	 * @public
	 * @memberOf {Mixin.TealiumRoute}
	 * @override
	 * @return {undefined}
	 */
	init() {
		this.setProperties({
			_etLastView: null,
			_tealium: null,
		});

		this._super(...arguments);
		this._etCheckForUtag();
	},

	/**
	 * Checks for the utag param on the window and sets it. if there was a previous call to transition, send it.
	 * @private
	 * @memberOf {TealiumRoute}
   * @return {undefined}
   */
	_etCheckForUtag() {
		run(() => {
			this.set('_tealium', window && window.utag);
		});

		if (this.get('_tealium')) {
			const lastView = this.get('_etLastView');
			if (lastView) {
				this.get('_tealium').view(lastView);
			}
			return;
		}

		// Run this later if they are using onLoad instead of inserting immediately
		run.later(this, '_etCheckForUtag', 500);
	},

  /**
   * Returns the route required.
   * @private
   * @memberOf {TealiumRoute}
   * @return {Route}
   */
	_etGetCurrentRoute(routeName) {
		return getCurrentRoute(this, routeName);
	},

	/**
	 * Watches the transition event and sends a new view to Tealium.
	 * @private
	 * @memberOf {Mixin.TealiumRoute}
	 * @observer
	 * @return {undefined}
	 */
	_etTealium: Ember.on('didTransition', function() {
		const routeName = this.get('currentRouteName'),
			route = this._etGetCurrentRoute(routeName),
			hasTealiumFn = typeOf(route.getTealiumView) === 'function',
			utag = this.get('_tealium'),
			currView = {};

		Ember.assert(hasTealiumFn, `${routeName} route doesn't have a "getTealiumView" function`);

		mergeObjects(currView, DEFAULT_VIEW);

		if (hasTealiumFn) {
			mergeObjects(currView, route.getTealiumView());
		}

		if (utag) {
			utag.view(currView);
		} else {
			this.set('_etLastView', currView);
		}
	}),
});
