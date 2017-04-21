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
