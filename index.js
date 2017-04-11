/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-tracker',
	
	/**
	 * Our content for to set the analytics script tag.
   * @public
   * @param {String} type
   * @param {Object} envConfig
	 * @return {undefined|String}
   */
	contentFor(type, envConfig) {
		if (type === 'body') {
			return this.addGoogleAnalytics(envConfig.analyticsSettings);
		}
	},

	/**
	 * Returns the google analytics script.
	 * @public
	 * @param {Object} settings
	 * @param {String} env
	 * @return {String}
	 */
	addGoogleAnalytics(settings) {
		if (!settings || !settings.trackingId) {
			return '';
		}

		this.ui.writeLine(`Including Google Analytics (${settings.trackingId})`);

		return `<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create','${settings.trackingId}','auto');</script>`;
	}
};
