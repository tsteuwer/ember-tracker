import EmberObject from '@ember/object';
import Route from '@ember/routing/route';

export default Route.extend({
	model() {
		return EmberObject.create({
			githubLink: 'https://github.com/tsteuwer/ember-tracker',
			travisBadge: 'https://travis-ci.org/tsteuwer/ember-tracker.svg?branch=master',
			travisLink: 'https://travis-ci.org/tsteuwer/ember-tracker',
			npmBadge: 'https://badge.fury.io/js/ember-tracker.svg',
			npmLink: 'http://badge.fury.io/js/ember-tracker',
		});
	},
});
