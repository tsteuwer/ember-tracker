import Ember from 'ember';
import { IN_BROWSER } from 'ember-tracker/-privates/utils';

const {
	on,
	testing,
} = Ember;

export default Ember.Route.extend({
	title: 'Ember Tracker: Easily add tracking to your Ember JS application.',
	description: 'ember-tracker is a simple Ember JS addon which implements Google Analytics, Tealium, and other tracking software for your Ember application.',
	keywords: ['ember-tracker', 'ember', 'addon', 'javascript', 'es6', 'google-analytics', 'tealium', 'tracking', 'tracker'],

	/**
	 * On activation, update the meta info.
	 * @public
	 * @observer
	 * @return {undefined}
	 */
	_onRouteActivated: on('activate', _updateMetaInfo),
});

/**
 * Updates the meta information in the DOM.
 * @private
 * @return {undefined}
 */
function _updateMetaInfo() {
	if (testing || !IN_BROWSER) {
		return;
	}

	const head = document.head;
	const {
		title,
		description,
		keywords,
	} = this.getProperties('title', 'description', 'keywords');

	document.title = title;
	head.querySelector('meta[name="keywords"]').setAttribute('content', keywords.join());	
	head.querySelector('meta[name="description"]').setAttribute('content', description);	
}
