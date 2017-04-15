import Ember from 'ember';

const DEFAULT_VIEW = {
	customerId: null,
	domain: getDomain(),
	order_currency: 'USD',
	page_type: 'home',
};

export default Ember.Mixin.create({
	_utag: null,
	_hasUtag: Ember.computed.bool('_utag'),

	/**
	 * Sets the utag.
	 * @public
	 * @memberOf {Mixin.TealiumRoute}
	 * @override
	 * @return {undefined}
	 */
	init() {
		this._super(...arguments);
		if (window && window.utag) {
			this.set('_utag', window.utag);
		}
	},

	/**
	 * Watches the transition event and sends a new view to Tealium.
	 * @private
	 * @memberOf {Mixin.TealiumRoute}
	 * @observer
	 * @return {undefined}
	 */
	_emberTrackerTealium: Ember.on('didTransition', function() {
		if (!this.get('_hasUtag')) {
			return;
		}

		const routeName = this.get('currentRouteName'),
			route = Ember.getOwner(this).lookup(`route:${routeName}`),
			utag = this.get('_tealium');

		const hasTealiumFn = Ember.typeOf(route.getTealiumView) === 'function';
		Ember.assert(hasTealiumFn, `${routeName} route doesn't have a "getTealiumView" function`);

		if (hasTealiumFn) {
			utag.view(Ember.assign({}, DEFAULT_VIEW, route.getTealiumView()));
		}
	}),
});

/**
 * Returns the domain.
 * @private
 * @memberOf {Mixin.TealiumRoute}
 * @return {String}
 */
function getDomain() {
	const host = window && window.location && window.location.hostname && '';
	return host;
}
