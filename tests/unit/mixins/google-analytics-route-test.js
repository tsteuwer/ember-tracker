import Ember from 'ember';
import GoogleAnalyticsRouteMixin from 'ember-tracker/mixins/google-analytics-route';
import { module, test } from 'qunit';

module('Unit | Mixin | google analytics route');

// Replace this with your real tests.
test('it works', function(assert) {
  let GoogleAnalyticsRouteObject = Ember.Object.extend(GoogleAnalyticsRouteMixin);
  let subject = GoogleAnalyticsRouteObject.create();
  assert.ok(subject);
});
