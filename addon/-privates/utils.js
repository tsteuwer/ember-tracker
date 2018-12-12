/*global window document*/

import { assign, merge } from '@ember/polyfills';

import { getOwner } from '@ember/application';

/**
 * Returns the route.
 * @public
 * @type {Function}
 * @return {Route}
 */
export function getCurrentRoute(context, routeName) {
	return getOwner(context).lookup(`route:${routeName}`);
}

/**
 * Supports <= 2.4 with merge otherwise it chooses assign.
 * @public
 * @type {Function}
 */
export const mergeObjects = assign || merge;

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
export const mergeOrAssign = assign || merge;
