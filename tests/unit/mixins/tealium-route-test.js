import Ember from 'ember';
import TealiumRouteMixin, { DEFAULT_VIEW } from 'ember-tracker/mixins/tealium-route';
import { module, test } from 'qunit';

const {
	Evented,
} = Ember;

const assign = Ember.assign || Ember.merge;

module('Unit | Mixin | tealium route');

test('should initialize variables then look for `utag` on the window', function(assert) {
  const TealiumRouteObject = Ember.Object.extend(TealiumRouteMixin);
  const subject = TealiumRouteObject.create({});
  assert.equal(subject.get('_etLastView'), null, 'should be initialized to null');
  assert.equal(subject.get('_tealium'), null, 'should be initialized to null');
});

test('didTransition should assign `_etLastView` if tealium isnt available yet', function(assert) {
	const route = Ember.Object.create({
		route: 'yep',
	});
  const TealiumRouteObject = Ember.Object.extend(Evented, TealiumRouteMixin);
  const subject = TealiumRouteObject.create({
		_etGetCurrentRoute() {
			return route;
		},
	});

	subject.trigger('didTransition');

	assert.deepEqual(subject.get('_etLastView'), DEFAULT_VIEW, 'it should be saved in the lastview var');
});

test('didTransition should merge DEFAULT_VIEW and object that comes back from getTealiumView', function(assert) {
	const route = Ember.Object.create({
		getTealiumView() {
			return {
				order_currency: 'CAD',
				page_type: 'list',
				new_param: 'yep',
			};
		},
	});
  const TealiumRouteObject = Ember.Object.extend(Evented, TealiumRouteMixin);
  const subject = TealiumRouteObject.create({
		_etGetCurrentRoute() {
			return route;
		},
	});

	subject.trigger('didTransition');

	const view = {};
	assign(view, DEFAULT_VIEW);
	assign(view, {
		order_currency: 'CAD',
		page_type: 'list',
		new_param: 'yep',
	});

	assert.deepEqual(subject.get('_etLastView'), view, 'they should be merged');
});

test('didTransition should send the view to tealium if available', function(assert) {
	const route = Ember.Object.create({
		route: 'yep',
	});
  const TealiumRouteObject = Ember.Object.extend(Evented, TealiumRouteMixin);
  const subject = TealiumRouteObject.create({
		_etGetCurrentRoute() {
			return route;
		},
	});

	subject.set('_tealium', {
		view(data) {
			assert.deepEqual(data, DEFAULT_VIEW, 'it should send the correct data to the view method for tealium');
		},
	});

	subject.trigger('didTransition');
});
