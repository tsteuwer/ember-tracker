import Ember from 'ember';
import GoogleAnalyticsRouteMixin from 'ember-tracker/mixins/google-analytics-route';
import { module, test } from 'qunit';

const {
	Evented,
	run,
} = Ember;

module('Unit | Mixin | google analytics route');

test('didTransition should call the GoogleAnalytics services pageview', function(assert) {
	assert.expect(2);

	run(() => {
		let GoogleAnalyticsRouteObject = Ember.Object.extend(Evented, GoogleAnalyticsRouteMixin);
		let subject = GoogleAnalyticsRouteObject.create({
			currentRouteName: 'index',
			url: '/',
			_etGetCurrentRoute() {
				return Ember.Object.create({
					title: 'my page',
				});
			},
		});

		subject.set('_ga', {
			pageview(page, title) {
				assert.equal(page, '/', 'should set the correct page');
				assert.equal(title, 'my page', 'should set the correct title');
			},
		});

		subject.trigger('didTransition');
	});
});

test('didTransition should call the beforeAnalyticsPageview on the route if it exists to override page and title', function(assert) {
	assert.expect(3);

	run(() => {
		let GoogleAnalyticsRouteObject = Ember.Object.extend(Evented, GoogleAnalyticsRouteMixin);
		let subject = GoogleAnalyticsRouteObject.create({
			currentRouteName: 'catz.special-kitty-name',
			url: '/catz/special-kitty-name',
			_etGetCurrentRoute() {
				return Ember.Object.create({
					title: 'Catz',
					beforeAnalyticsPageview(ga) {
						assert.equal(typeof ga, 'object', 'it should pass the GA object for us');

						return {
							page: '/who/dat',
							title: 'Lets Use This',
						};
					},
				});
			},
		});

		subject.set('_ga', {
			pageview(page, title) {
				assert.equal(page, '/who/dat', 'should override the page');
				assert.equal(title, 'Lets Use This', 'should override the title');
			},
		});

		subject.trigger('didTransition');
	});
});

test('didTransition should call the beforeAnalyticsPageview on the route if it exists to override page and NOT the title', function(assert) {
	assert.expect(2);

	run(() => {
		let GoogleAnalyticsRouteObject = Ember.Object.extend(Evented, GoogleAnalyticsRouteMixin);
		let subject = GoogleAnalyticsRouteObject.create({
			currentRouteName: 'catz.special-kitty-name',
			url: '/catz/special-kitty-name',
			_etGetCurrentRoute() {
				return Ember.Object.create({
					title: 'Catz',
					beforeAnalyticsPageview() {
						return {
							page: '/who/dat',
						};
					},
				});
			},
		});

		subject.set('_ga', {
			pageview(page, title) {
				assert.equal(page, '/who/dat', 'should override the page');
				assert.equal(title, 'Catz', 'should NOT override the title');
			},
		});

		subject.trigger('didTransition');
	});
});

test('didTransition should call the beforeAnalyticsPageview on the route if it exists to override page, title and add options', function(assert) {
	assert.expect(3);

	run(() => {
		let GoogleAnalyticsRouteObject = Ember.Object.extend(Evented, GoogleAnalyticsRouteMixin);
		let subject = GoogleAnalyticsRouteObject.create({
			currentRouteName: 'catz.special-kitty-name',
			url: '/catz/special-kitty-name',
			_etGetCurrentRoute() {
				return Ember.Object.create({
					title: 'Catz',
					beforeAnalyticsPageview() {
						return {
							page: '/who/dat',
							title: 'Catz R Craycray',
							options: {
								myOptions: 'are here',
								one: 'is two',
							},
						};
					},
				});
			},
		});

		subject.set('_ga', {
			pageview(page, title, options) {
				assert.equal(page, '/who/dat', 'should override the page');
				assert.equal(title, 'Catz R Craycray', 'should override the title');
				assert.deepEqual(options, {
					myOptions: 'are here',
					one: 'is two',
				}, 'should send options');
			},
		});

		subject.trigger('didTransition');
	});
});
