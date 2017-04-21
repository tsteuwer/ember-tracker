/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-tracker',
	
	/**
	 * Add our scripts to the page if enabled.
   * @public
   * @param {String} type
   * @param {Object} envConfig
	 * @return {undefined|String}
   */
	contentFor(type, envConfig) {
		const env = envConfig.environment;
		let content = '';

		if (type === 'body') {
			content += this.addTealiumIQ(envConfig, env);
			content += this.addGoogleAnalytics(envConfig, env);
		}

		return content;
	},

	/**
	 * Returns the google analytics script.
	 * @public
	 * @param {Object} settings
	 * @return {String}
	 */
	addGoogleAnalytics(settings, env) {
		const trackingId = get(settings, 'emberTracker.analyticsSettings.trackingId');

		if (env === 'test' || !trackingId) {
			return '';
		}

		this.ui.writeLine(`Including Google Analytics (${trackingId})`);

		return `<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create','${trackingId}','auto');</script>`;
	},

	/**
	 * Returns the tealium script.
	 * @public
	 * @param {Object} settings
	 * @return {String}
	 */
	addTealiumIQ(settings, env) {
		const tealiumSettings = get(settings, 'emberTracker.tealiumSettings');

		if (env === 'test' || !tealiumSettings || !tealiumSettings.accountName) {
			return '';
		}

		const accountName = tealiumSettings.accountName,
			onload = Boolean(tealiumSettings.onload);

		let tealiumEnv;

		switch (env) {
			case 'development':
				tealiumEnv = 'dev';
				break;
			case 'production':
				tealiumEnv = 'prod';
				break;
			default:
				tealiumEnv = 'qa';
				break;
		}

		let text = `Including Tealium IQ (${accountName} for ${tealiumEnv}`;
		text += (onload ? ' on load' : '') + ')';

		this.ui.writeLine(text);

		let script = `window.utag_cfg_ovrd={noview:true};`;
		if (onload) {
			script += 'window.addEventListener("load", function() {console.log("onload");';
		}
		
		script += `(function(a,b,c,d){a='//tags.tiqcdn.com/utag/${accountName}/main/${tealiumEnv}/utag.js';b=document;c='script';d=b.createElement(c);d.src=a;d.type='text/java'+c;d.async=true;a=b.getElementsByTagName(c)[0];a.parentNode.insertBefore(d,a);})();`;

		if (onload) {
			script += "});";
		}

		return `<script>${script}</script>`;
	},
};

function get(obj, keys) {
	if (!obj) {
		return null;
	}

	const parts = keys.split('.');

	if (obj[parts[0]] === 'undefined') {
		return null;
	}

	if (parts.length === 1) {
		return obj[parts[0]];
	}

	return get(obj[parts.shift()], parts.join('.'));
}
