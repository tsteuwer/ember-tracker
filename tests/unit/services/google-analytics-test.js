import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

let service;

module('Unit | Service | google analytics', function(hooks) {
  setupTest(hooks);

  // Specify the other units that are required for this test.
  // needs: ['service:foo']
  hooks.beforeEach(function() {
      service = this.owner.lookup('service:google-analytics');
  });

  // Replace this with your real tests.
  test('computed@isAvailable', function(assert) {
      assert.expect(3);

    assert.notOk(service.get('isAvailable'), 'in testing it should not be available');
      assert.throws(() => {
          service.set('isAvailable', false);
      }, 'it should throw an error that it is read only and cannot be modified');

      service.set('_ga', {
          loaded: true,
      });

      assert.ok(service.get('isAvailable'), 'it should now be available');
  });

  test('computed@api', function(assert) {
      assert.expect(1);
      assert.throws(() => {
          service.set('api', false);
      }, 'it should throw an error that it is read only and cannot be modified');
  });

  test('init with no emberTracker set in config environment', function(assert) {
      assert.expect(2);

      service._getConfig = function() {
          return {};
      };

      service.init();

      assert.notOk(service.get('_logAnalyticsPageViews'), 'should be false');
      assert.notOk(service.get('_logAnalyticsEvents'), 'should be false');
  });

  test('init with emberTracker but logging turned off', function(assert) {
      assert.expect(2);

      service._getConfig = function() {
          return {
              emberTracker: {
                  analyticsSettings: {
                      LOG_EVENTS: false,
                      LOG_PAGEVIEW: false,
                  },
              },
          };
      };

      service.init();

      assert.notOk(service.get('_logAnalyticsPageViews'), 'should be false');
      assert.notOk(service.get('_logAnalyticsEvents'), 'should be false');
  });

  test('init: with emberTracker and logging turned on', function(assert) {
      assert.expect(2);

      service._getConfig = function() {
          return {
              emberTracker: {
                  analyticsSettings: {
                      LOG_EVENTS: true,
                      LOG_PAGEVIEW: true,
                  },
              },
          };
      };

      service.init();

      assert.ok(service.get('_logAnalyticsPageViews'), 'should be true');
      assert.ok(service.get('_logAnalyticsEvents'), 'should be true');
  });

  test('event', function(assert) {
      assert.expect(6);

      service._send = function(type, cat, evt, label, val, fields) {
          assert.equal(type, 'event', 'first param should be the type of api were using');
          assert.equal(cat, 'My Category', 'should pass the correct category');
          assert.equal(evt, 'click', 'should pass the correct event type');
          assert.equal(label, 'My Label', 'should pass the correct label');
          assert.equal(val, 1, 'should pass the correct value');
          assert.deepEqual(fields, { field: true }, 'should pass the correct fields');
      };
      service.event('My Category', 'click', 'My Label', 1, { field: true });
  });

  test('social', function(assert) {
      service._send = function(type, network, action, target, fields) {
          assert.equal(type, 'network', 'first param should be the type of api were using');
          assert.equal(network, 'Google+', 'should pass the correct category');
          assert.equal(action, 'share', 'should pass the correct event type');
          assert.equal(target, 'https://plus.google.com/', 'should pass the correct label');
          assert.deepEqual(fields, { field: true }, 'should pass the correct fields');
      };
      service.social('Google+', 'share', 'https://plus.google.com/', { field: true });
  });

  test('timing', function(assert) {
      service._send = function(type, cat, timeVar, val, label, fields) {
          assert.equal(type, 'timing', 'first param should be the type of api were using');
          assert.equal(cat, 'My Timez', 'should pass the correct category');
          assert.equal(timeVar, 'My Varz', 'should pass the correct timing var');
          assert.equal(val, 300, 'should pass the correct milliseconds');
          assert.equal(label, 'My Labelz', 'should pass the correct label');
          assert.deepEqual(fields, { field: true }, 'should pass the correct fields');
      };
      service.timing('My Timez', 'My Varz', 300, 'My Labelz', { field: true });
  });

  test('pageview', function(assert) {
      assert.expect(3);
      const calls = [];
      service.set('_ga', function(...args) {
          calls.push(args);
      });

      service.pageview('/cats/hurting-people', 'Catz Are Craycray');

      assert.equal(calls.length, 2, 'it should call the google api twice');
      assert.deepEqual(calls[0], ['set', 'page', '/cats/hurting-people']);
      assert.deepEqual(calls[1], ['send', 'pageview', { page: '/cats/hurting-people', title: 'Catz Are Craycray' }]);
  });

  test('pageview with options', function(assert) {
      assert.expect();
      const calls = [];
      service.set('_ga', function(...args) {
          calls.push(args);
      });

      service.pageview('/cats/hurting-people', 'Catz Are Craycray', { herp: 'derp' });

      assert.equal(calls.length, 2, 'it should call the google api twice');
      assert.deepEqual(calls[0], ['set', 'page', '/cats/hurting-people']);
      assert.deepEqual(calls[1], ['send', 'pageview', { page: '/cats/hurting-people', title: 'Catz Are Craycray', herp: 'derp' }]);
  });

  test('_send should push to the awaiting stack when GA is not available', function(assert) {
      assert.expect(3);
      service._send('yes', 'no', 'maybe', 'so');
      service._send('omg', 'becky', 'look', 'at', 'her', 'butt');

      const awaiting = service.get('_awaitingEvents');
      assert.equal(awaiting.length, 2, 'it should push to the awaiting stack');
      assert.deepEqual(awaiting[0], ['yes', 'no', 'maybe', 'so'], 'it should have our first event');
      assert.deepEqual(awaiting[1], ['omg', 'becky', 'look', 'at', 'her', 'butt'], 'it should have our second event');
  });

  test('_sendPageView should push to the awaiting stack when GA is not available', function(assert) {
      assert.expect(4);
      service._sendPageView('overwatch', 'ftw');
      service._sendPageView('genji', 'is-a-bastard');
      service._sendPageView('genji', 'is-a-bastard', { no: 'yes' });

      const awaiting = service.get('_awaitingPageViews');
      assert.equal(awaiting.length, 3, 'it should push to the awaiting stack');
      assert.deepEqual(awaiting[0], { page: 'overwatch', title: 'ftw', options: undefined}, 'it should have our first pageview');
      assert.deepEqual(awaiting[1], { page: 'genji', title: 'is-a-bastard', options: undefined }, 'it should have our second pageview');
      assert.deepEqual(awaiting[2], { page: 'genji', title: 'is-a-bastard', options: { no: 'yes' }}, 'it should have our second pageview');
  });

  test('_sendPreviousEvents should not send anything if there are none', function(assert) {
      assert.expect(0);

      service._send = function() {
          assert.ok(false, 'this should not be called');
      };

      service._sendPreviousEvents();
  });

  test('_sendPreviousPageViews should not send anything if there are none', function(assert) {
      assert.expect(0);

      service.pageview = function() {
          assert.ok(false, 'this should not be called');
      };

      service._sendPreviousPageViews();
  });

  test('_sendPreviousEvents should send anything if there is anything in the stack', function(assert) {
      let called = 0;
      service._send = function() {
          called++;
      };
      service.set('_awaitingEvents', [{
          something: 'yep',
      }, {
          another: 'something',
      }, {
          oh: 'lookie here',
      }]);

      service._sendPreviousEvents();
      assert.equal(called, 3, 'it should be called three times');
  });

  test('_sendPreviousEvents should send anything if there is anything in the stack', function(assert) {
      let called = 0;
      service.pageview = function() {
          called++;
      };
      service.set('_awaitingPageViews', [{
          something: 'yep',
      }, {
          another: 'something',
      }]);

      service._sendPreviousPageViews();
      assert.equal(called, 2, 'it should be called twice');
  });
});
