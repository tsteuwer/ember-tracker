import { moduleFor, test } from 'ember-qunit';

let service;
moduleFor('service:google-analytics', 'Unit | Service | google analytics', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
	beforeEach() {
		service = this.subject();
	},
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
	assert.expect(2);

	assert.equal(typeof service.get('api'), 'function', 'it should always be a function so to not break anything');

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
	const calls = [];
	service.set('_ga', function(...args) {
		calls.push(args);
	});

	service.pageview('/cats/hurting-people', 'Catz Are Craycray');

	assert.expect(calls.length, 2, 'it should call the google api twice');
	assert.deepEqual(calls[0], ['set', 'page', '/cats/hurting-people']);
	assert.deepEqual(calls[1], ['send', 'pageview', { page: '/cats/hurting-people', title: 'Catz Are Craycray' }]);
});
