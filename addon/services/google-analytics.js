/*eslint no-console: ["error", { allow: ["info", "log"] }] */
/*eslint no-unused-vars: 0 */
import Ember from 'ember';

import { IN_BROWSER, mergeOrAssign } from 'ember-tracker/-privates/utils';

const {
	assert,
	computed: {
		alias,
		bool,
	},
	get,
	getOwner,
	run,
} = Ember;

const LOG_PREFIX = '[EmberTracker]';
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

		const config = this._getConfig();

		this.setProperties({
			/**
			 * Holds events that need to be sent once analytics has loaded.
			 * @private
			 * @type {Array}
			 */
			_awaitingEvents: [],

			/**
			 * Holds pageviews that need to be sent once analytics has loaded.
			 * @private
			 * @type {Array}
			 */
			_awaitingPageViews: [],

			/**
			 * Flag for logging pageviews.
			 * @private
			 * @type {Boolean}
			 */
			_logAnalyticsPageViews: get(config, 'emberTracker.analyticsSettings.LOG_PAGEVIEW'),

			/**
			 * Flag for logging events.
			 * @private
			 * @type {Boolean}
			 */
			_logAnalyticsEvents: get(config, 'emberTracker.analyticsSettings.LOG_EVENTS'),
		});

		if (!Ember.testing && IN_BROWSER) {
			this._etCheckForGA();
		}
	},

	/**
	 * Checks for the ga param on the window and sets it. If there was previous events that need to be send, it sends it.
	 * @private
	 * @memberOf {GoogleAnalytics}
	 * @return {undefined}
	 */
	_etCheckForGA() {
		run(() => this.set('_ga', window && window.ga));
		
		if (this.get('_ga')) {
			this._sendPreviousEvents();
			this._sendPreviousPageViews();
		} else {
			run.later(this, '_etCheckForGA', 500);	
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
	 * @param {Object} options Other options to send with pageview event 
	 * @return {undefined}
	 */
	pageview(page, title, options) {
		assert(page, 'page should be a valid string');
		assert(title, 'page title should be a valid string');

		this._sendPageView(page, title, options);
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
		if (Ember.testing) {
			return;
		}

		if (type === 'pageview' && this.get('_logAnalyticsPageViews')) {
			this._log(type, args);
		} else if (EVENTS.indexOf(type) > -1 && this.get('_logAnalyticsEvents')) {
			this._log(type, args);
		}
	},

	/**
	 * Returns the config object.
	 * @private
	 * @memberOf {GoogleAnalytics}
	 * @return {Object}
	 */
	_getConfig() {
		return getOwner(this).resolveRegistration('config:environment') || {};
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
		console.log(`${LOG_PREFIX} Google Analytics ${type} sent:`, args);
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
		
		if (ga) {
			ga.apply(ga, ['send'].concat(args));

			this.log.apply(this, args);
		} else {
			this.get('_awaitingEvents').push(args);
		}
	},

	/**
	 * Sends off the pageview or pushes it to the awaiting stack.
	 * @private
	 * @memberOf {GoogleAnalytics}
	 * @param {String} page (Url)
	 * @param {String} title
	 * @return {undefined}
	 */
	_sendPageView(page, title, options) {
		const ga = this.get('_ga');
		
		if (ga) {
			ga('set', 'page', page);
			ga('send', 'pageview', mergeOrAssign({
				page,
				title,
			}, options || {}));

			this.log('pageview', page, title, options);
		} else {
			this.get('_awaitingPageViews').push({
				page,
				title,
				options,
			});
		}
	},

	/**
	 * Sends awaiting events to GA.
	 * @private
	 * @memberOf {GoogleAnalytics}
	 * @return {undefined}
	 */
	_sendPreviousEvents() {
		const events = this.get('_awaitingEvents');
		if (!events.length) {
			return;
		}

		console.info(`${LOG_PREFIX} Sending awaiting Analytics events: ${events.length}`);

		while (events.length) {
			let event = events.shift();
			this._send.apply(this, event);
		}
	},

	/**
	 * Sends awaiting pageviews to GA.
	 * @private
	 * @memberOf {GoogleAnalytics}
	 * @return {undefined}
	 */
	_sendPreviousPageViews() {
		const pageviews = this.get('_awaitingPageViews');
		if (!pageviews.length) {
			return;
		}

		console.info(`${LOG_PREFIX} Sending awaiting Analytics pageviews: ${pageviews.length}`);

		while (pageviews.length) {
			let {
				page,
				title,
				options,
			} = pageviews.shift();

			this.pageview(page,title,options); 
		}
	},
});
