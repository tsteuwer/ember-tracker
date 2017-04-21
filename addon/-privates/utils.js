import Ember from 'ember';

export function getCurrentRoute(context, routeName) {
	return Ember.getOwner(context).lookup(`route:${routeName}`);
}
