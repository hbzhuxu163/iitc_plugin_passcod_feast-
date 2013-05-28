// ==UserScript==
// @id             iitc-plugin-passcod-auto-fetch@xelio
// @name           IITC plugin: passcode auto fetch
// @version        0.1.0.20130527.1
// @namespace      https://github.com/hbzhuxu163/iitc_plugin_passcod_feast-
// @updateURL      https://github.com/hbzhuxu163/iitc_plugin_passcod_feast-/blob/master/release/iitcPasscodeFetchPlugin.js
// @downloadURL    https://github.com/hbzhuxu163/iitc_plugin_passcod_feast-/blob/master/release/iitcPasscodeFetchPlugin.js
// @description    [hbzhuxu163-2013-05-22-175822] Try to fetch passcode whenever it's shown in comm.
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none
// ==/UserScript==

function wrapper() {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};


// PLUGIN START ////////////////////////////////////////////////////////

//----自动刷passcode开始----------------------------------------
window.passcodes = new Array(0);
window.chat.checkPasscode = function(rawData,fraction_data){
	var data = data.result;
	for(var chatDataIndex in data){
		//: "[secure] GressBot: 2605NEW Passcode!\n7vc6fieldv775u (by urbankhan)",
        var chatData =data[chatDataIndex];
		var chatContent = chatData[2].plext.text;
		if(chatContent.indexOf("NEW Passcode")==-1)
			continue;
		var index1=chatContent.indexOf("Passcode")+10;
		if(index1==-1)
			continue;

		var passcode = chatContent.substring(index1); 
		var index2 = passcode.indexOf(" ");
		if(index2==-1)
			continue;
		passcode = passcode.substring(0,index2); 
        console.log("-----get passcode="+passcode);
        
		var isExist = false;
		for (var i = 0; i < window.passcodes.length; i++) {
			if (window.passcodes[i] === obj) {
				isExist=true;
				break;
			}
		}
		if(isExist)
		{
			continue;
		}
        console.log("-----get passcode reward=");
		window.passcodes.push(passcode);	
		window.chat.queryPasscode(passcode);

	}    
}
window.chat.queryPasscode = function(passcode){
    var data = {passcode: passcode};
    window.postAjax('redeemReward', data, window.handleRedeemResponse,
      function(response) {
        var extra = '';
        if(response.status) {
          extra = (window.REDEEM_STATUSES[response.status] || 'The server indicated an error.') + ' (HTTP ' + response.status + ')';
        } else {
          extra = 'No status code was returned.';
        }
        dialog({
          title: '请求失败：' + data.passcode,
          html: '<strong>HTTP请求失败</strong> ' + extra
        });
      });

}
//----自动刷passcode结束----------------------------------------


var setup =  function() {
  window.addHook('factionChatDataAvailable', window.chat.checkPasscode);
}

// PLUGIN END //////////////////////////////////////////////////////////

if(window.iitcLoaded && typeof setup === 'function') {
  setup();
} else {
  if(window.bootPlugins)
    window.bootPlugins.push(setup);
  else
    window.bootPlugins = [setup];
}
} // wrapper end
// inject code into site context
var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ wrapper +')();'));
(document.body || document.head || document.documentElement).appendChild(script);
