# ember-tracker

The simple way of tracking your app or addon using:

[Google Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/) using `analytics.js`.
- [x] Pageviews - Every transition will be captured and sent as a page view!
- [x] Events - Track what your users are doing by using the `events` events API.
- [x] User Timing - Gague performance with the `timing` API.
- [x] Social - Track shares, tweets, etc with the `social` (network) API.
- [x] Custom page/titles and "before analytics" callback.

[Tealium IQ](http://tealium.com/products/tealium-iq-tag-management-system/) tag manager
- [x] Support for dev, qa and production environments out-of-the-box.

For more information about this addon, please visit the [Ember Tracker website](https://tsteuwer.github.io/ember-tracker).

## Minimum Requirements

* Ember 2.3+
* Ember CLI

For versions lower than 2.3, you'll need to install the [ember-getowner-polyfill](https://github.com/rwjblue/ember-getowner-polyfill) addon.

## Setup

First, install the addon via:

```
ember install ember-tracker
```

## Configuring Google Analytics

After you've installed the addon, open your config file located in `config/environment.js`. Next, add a new object to the `ENV` variable called `emberTracker`. Finally, add an object on it called `analyticsSettings` with your `trackingId`. Your config should look something similar to:

```
[...]
module.exports = function(environment) {
	var ENV = {
		[...]
		APP: {
			// Here you can pass flags/options to your application instance
			// when it is created
		},
		emberTracker: {
			analyticsSettings: {
				trackingId: 'UA-########-#',
			},
		},
	};
[...]
```

Feel free to change your `trackingId` based on the environment you're in.

Now, you can add the GoogleAnalyticsRoute mixin to your Router to start tracking pageviews and inject the service into your controllers/components. [Learn how](https://tsteuwer.github.io/ember-tracker/#/google-analytics)!

### Options

There are two options available for Google Analytics you may want to use in your `environment.js` file. They are:

* `LOG_PAGEVIEWS` (boolean) - Logs all `pageview` events to the console.
* `LOG_EVENTS` (boolean) - Logs all `event`, `timing` and `network` (social) requests to the console.

These options allow you to ensure your events are being fired.

## Configuring Tealium IQ

To allow Tealium, simply open the `config/environment.js` file and add a new object to the `ENV` variable called `emberTracker`. Finally, add an object called `tealiumSettings` with a your `accountName` as an additional property. Your config should look something similar to:

```
[...]
module.exports = function(environment) {
	var ENV = {
		[...]
		APP: {
			// Here you can pass flags/options to your application instance
			// when it is created
		},
		emberTracker: {
			tealiumSettings: {
				accountName: 'myAccName',
			},
		},
	};
[...]
```

That's it! The addon will take care of using the dev, qa or production environments for you. For reference, it determines which environment to use in Tealium based on the following conditions:

You're now ready to add the TealiumRoute mixin to your Router to start updating Tealium on new routes. [Learn how](https://tsteuwer.github.io/ember-tracker/#/tealium)!

Ember Environment | Tealium Environment
----------------- | -------------------
development | dev
production | prod
all others | qa

## Additional Reading 

I've put together more documentation on the [ember-tracker](https://tsteuwer.github.io/ember-tracker) website on how to use both the Google Analytics services as well as updating Tealium during route transitions.

# Addon Maintenance

## Installation

* `git clone <repository-url>` this repository
* `cd ember-tracker`
* `npm install`
* `bower install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
