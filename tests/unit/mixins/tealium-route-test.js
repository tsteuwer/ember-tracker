import Ember from 'ember';
import TealiumRouteMixin from 'ember-tracker/mixins/tealium-route';
import { module, test } from 'qunit';

module('Unit | Mixin | tealium route');

// Replace this with your real tests.
test('it works', function(assert) {
  let TealiumRouteObject = Ember.Object.extend(TealiumRouteMixin);
  let subject = TealiumRouteObject.create();
  assert.ok(subject);
});
