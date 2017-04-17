/*eslint no-console: ["error", { allow: ["warn", "log"] }] */
/*eslint no-unused-vars: 0 */
import Ember from 'ember';

const {
	assert,
	computed: {
		alias,
		bool,
	},
	get,
	getOwner,
	testing,
} = Ember;

const EVENTS = ['event', 'network', 'timing'];

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
	 * @private
	 * @computed
	 * @memberOf {GoogleAnalytics}
	 * @type {Object}
	 */
	_ga: null,

	/**
	 * Grabs the GA object and sets our settings.
	 * @public
	 * @overrides
	 * @memberOf {GoogleAnalytics}
	 * @return {undefined}
	 */
	init() {
		this._super(...arguments);
		let ga = window && window.ga;

		if (!ga) {
			console.warn('`window.ga` has not been set');
			ga = () => {};
		}

		const config = getOwner(this).resolveRegistration('config:environment');

		this.setProperties({
			_logAnalyticsPageViews: get(config, 'emberTracker.LOG_PAGEVIEW'),
			_logAnalyticsEvents: get(config, 'emberTracker.LOG_EVENTS'),
			_ga: ga
		});
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
		this._send('event', ...arguments); 
	},

	/**
	 * Sends a social `event` to Analytics.
	 * @public
	 * @memberOf {GoogleAnalytics}
	 * @param {String} network (e.g. Facebook, G+, Twitter)
	 * @param {String} action (e.g. share, tweet)
	 * @param {String} target Typically the url they are going to or are using.
	 * @param {Object} fields
	 * @return {undefined}
	 */
	social(network, action, target, fields) {
		this._send('network', ...arguments); 
	},

	/**
	 * Sends a timing `event` to Analytics to allow you to track performance of items.
	 * @public
	 * @memberOf {GoogleAnalytics}
	 * @param {String} category
	 * @param {String} timingVar (e.g. "Ajax Response Time")
	 * @param {Number} timingVal The number of milliseconds 
	 * @param {String} label The label if needed
	 * @param {Object} fields
	 * @return {undefined}
	 */
	timing(category, timingVar, timingVal, label, fields) {
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

		assert(page, 'page should be a valid string');
		assert(title, 'page title should be a valid string');

		ga('set', 'page', page);
		ga('send', 'pageview', {
			page,
			title,
		});

		this.log('pageview', page, title);
	},

	/**
	 * Checks if we should log to the console or not..
	 * @private
	 * @memberOf {GoogleAnalytics}
	 * @param {String} type
	 * @rest {Mixed} args
	 * @return {undefined}
	 */
	log(type, ...args) {
		if (testing) {
			return;
		}

		if (type === 'pageview' && this.get('_logAnalyticsPageViews')) {
			this._log(type, args);
		} else if (EVENTS.indexOf(type) > -1 && this.get('_logAnalyticsEvents')) {
			this._log(type, args);
		}
	},

	/**
	 * Logs to the console.
	 * @private
	 * @memberOf {GoogleAnalytics}
	 * @param {String} type
	 * @param {Mixed} args
	 * @return {undefined}
	 */
	_log(type, args) {
		console.log(`[EmberTracker] Google Analytics ${type} sent:`, args);
	},

	/**
	 * Hooks into the send command with the GA object.
	 * @private
	 * @memberOf {GoogleAnalytics}
	 * @param {String} type The type of event being sent. E.g. 'event', 'timing', 'network'.
	 * @param {Mixed} The rest of the params must match the API for googles 'send' in order.
	 * @usage
	 *		this._send('event', 'My Category', 'click', 'Cats', null, { nonInteractive: true });	
	 *		...which will translate into...
	 *		ga('send', 'event', 'My Category', 'click', 'Cats', null, { nonInteractive: true});
	 * @return {undefined}
	 */
	_send(...args) {
		const ga = this.get('_ga');
		ga.apply(ga, ['send'].concat(args));

		this.log.apply(this, args);
	}
});
