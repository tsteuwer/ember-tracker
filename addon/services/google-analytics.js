import Ember from 'ember';

const {
	computed: {
		alias,
		bool,
	},
} = Ember;

export default Ember.Service.extend({
	/**
	 * The raw window.ga object.
	 * @public
	 * @computed
	 * @memberOf {GoogleAnalytics}
	 * @type {Boolean}
	 */
	isAvailable: bool('_ga.loaded').readOnly(),

	/**
	 * The raw window.ga object.
	 * @public
	 * @computed
	 * @memberOf {GoogleAnalytics}
	 * @type {Object}
	 */
	api: alias('_ga').readOnly(),

	/**
	 * The raw window.ga object.
	 * @public
	 * @computed
	 * @memberOf {GoogleAnalytics}
	 * @type {Object}
	 */
	_ga: null,

	/**
	 * Grabs the GA object.
	 * @public
	 * @overrides
	 * @memberOf {GoogleAnalytics}
	 * @return {undefined}
	 */
	init() {
		this._super(...arguments);
		const ga = window && window.ga;

		Ember.assert(ga, '`window.ga` has not been set');

		if (ga) {
			this.set('_ga', ga);
		} else {
			this.set('_ga', () => {});
		}
	},

	/**
	 * Sends a user action `event` to Analytics.
	 * @public
	 * @memberOf {GoogleAnalytics}
	 * @param {String} category
	 * @param {String} action (e.g. `click`, `doubleclick`, `load`)
	 * @param {String} label
	 * @param {Number} value
	 * @param {Object} fields The optional fields, such as { nonInteractive: true }, etc.
	 * @return {undefined}
	 */
	event(category, action, label, value, fields) {
		//jshint unused:false
		this._send('event', ...arguments); 
	},

	/**
	 * Sends a social `event` to Analytics.
	 * @public
	 * @memberOf {GoogleAnalytics}
	 * @param {String} network (e.g. Facebook, G+, Twitter)
	 * @param {String} action (e.g. share, tweet)
	 * @param {Number} url The url they are going to or are using.
	 * @return {undefined}
	 */
	social(network, action, url) {
		//jshint unused:false
		this._send('network', ...arguments); 
	},

	/**
	 * Sends a timing `event` to Analytics to allow you to track performance of items.
	 * @public
	 * @memberOf {GoogleAnalytics}
	 * @param {String} category
	 * @param {String} timingVar (e.g. "Ajax Response Time")
	 * @param {Number} timingVal The number of milliseconds 
	 * @return {undefined}
	 */
	timing(category, timingVar, timingVal) {
		//jshint unused:false
		this._send('timing', ...arguments); 
	},

	/**
	 * Sets the new page in GA so all subsequent events get sent under the correct page and sends the pageview event.
	 * @public
	 * @memberOf {GoogleAnalytics}
	 * @param {String} page (e.g. "/", "/my-new-page", "/my-new-page/start"
	 * @param {String} title The page's title
	 * @return {undefined}
	 */
	pageview(page, title) {
		const ga = this.get('_ga');

		ga('set', 'page', page);
		ga('send', 'pageview', {
			page,
			title,
		});
	},

	/**
	 * Hooks into the send command with the GA object.
	 * @private
	 * @param {String} type The type of event being sent. E.g. 'event', 'timing', 'network'.
	 * @param {Mixed} The rest of the params must match the API for googles 'send' in order.
	 * @usage
	 *		this._send('event', 'My Category', 'click', 'Cats', null, { nonInteractive: true });	
	 *		...which will translate into...
	 *		ga('send', 'event', 'My Category', 'click', 'Cats', null, { nonInteractive: true});
	 * @return {undefined}
	 */
	_send() {
		const ga = this.get('_ga');
		ga.apply(ga, ['send', ...arguments]);
	}
});
