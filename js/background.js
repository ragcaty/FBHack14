var rule1 = {
	conditions: [
		new chrome.declarativeContent.PageStateMatcher({
			pageUrl: { 
				hostEquals: 'www.facebook.com',
				schemes: ['https']
			}
		})
	],
	actions: [ new chrome.declarativeContent.ShowPageAction()]
};
	
chrome.runtime.onInstalled.addListener(function() {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([rule1]);
	});
});

