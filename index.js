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
			content += this.addTealiumIQ(envConfig.tealiumSettings, env);
			content += this.addGoogleAnalytics(envConfig.emberTracker);
		}

		return content;
	},

	/**
	 * Returns the google analytics script.
	 * @public
	 * @param {Object} settings
	 * @return {String}
	 */
	addGoogleAnalytics(settings) {
		if (!settings || !settings.trackingId) {
			return '';
		}

		this.ui.writeLine(`Including Google Analytics (${settings.trackingId})`);

		return `<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create','${settings.trackingId}','auto');</script>`;
	},

	/**
	 * Returns the tealium script.
	 * @public
	 * @param {Object} settings
	 * @return {String}
	 */
	addTealiumIQ(settings, env) {
		if (!settings || !settings.accountName) {
			return '';
		}

		let tealiumEnv;

		switch (env) {
			case 'development':
				tealiumEnv = 'dev';
				break;
			case 'staging':
				tealiumEnv = 'qa';
				break;
			default:
				tealiumEnv = 'prod';
				break;
		}

		this.ui.writeLine(`Including Tealium IQ (${settings.accountName} for ${tealiumEnv})`);

		return `<script>window.utag_cfg_ovrd={noview:true};(function(a,b,c,d){a='//tags.tiqcdn.com/utag/${settings.accountName}/main/${tealiumEnv}/utag.js';b=document;c='script';d=b.createElement(c);d.src=a;d.type='text/java'+c;d.async=true;a=b.getElementsByTagName(c)[0];a.parentNode.insertBefore(d,a);})();</script>`;
	},

};
