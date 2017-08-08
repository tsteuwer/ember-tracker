/*global window document*/

import Ember from 'ember';

/**
 * Returns the route.
 * @public
 * @type {Function}
 * @return {Route}
 */
export function getCurrentRoute(context, routeName) {
	return Ember.getOwner(context).lookup(`route:${routeName}`);
}

/**
 * Supports <= 2.4 with merge otherwise it chooses assign.
 * @public
 * @type {Function}
 */
export const mergeObjects = Ember.assign || Ember.merge;

/**
 * Find out if we're in fastboot.
 * @public
 * @type {Boolean}
 */
export const IN_BROWSER = !!window && !!window.document;

/**
 * Merge or assign.
 * @public
 * @type {Function}
 */
export const mergeOrAssign = Ember.assign || Ember.merge;
