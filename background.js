/*var searchUrl = "https://www.google.co.kr/search?q=";

function createLPSTab(code) {
  var args = {
    'url': searchUrl + code,
    'selected': true
  };
  
  try {
    chrome.tabs.create(args);
  } catch (e) {
    alert(e);
  }
}

function lpsOnClick(info, tab) {
  createLPSTab(info.selectionText);
}

// Create one test item for each context type.
var contexts = ["selection","editable"];
for (var i = 0; i < contexts.length; i++) {
  var context = contexts[i];
  var title = "%s 를 구글에 검색";
  var id = chrome.contextMenus.create({"title": title, "contexts":[context], "onclick": lpsOnClick});
}*/

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    insertDictionaryScript(tab);
});

chrome.tabs.onCreated.addListener(function(tabId, changeInfo, tab) {         
   insertDictionaryScript(tab);
});

chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab) {
   insertDictionaryScript(tab);
});

function insertDictionaryScript(ctab){
  chrome.tabs.getSelected(null,function(tab){
	var parser = document.createElement('a');
	parser.href = tab.url;
	
	var keyword='';
	var result = false;
	
	switch(parser.hostname){
		case 'www.google.co.kr':
		case 'www.google.com':
			keyword = getUrlParameter(tab.url, 'q');
			console.log(parser.hostname);
			result = true;
			break;
		case 'search.naver.com':
			keyword = getUrlParameter(tab.url, 'query');
			console.log(parser.hostname);
			result = true;
			break;
	}
	
	if(result){
		console.log(keyword);
	    jQuery.ajax({
	        type: "POST",
	        url: "http://munbbok.kr/api/searchlog.php",
	        data: {engine_url:parser.hostname, keyword:keyword, url:tab.url},
	        success: function(data) {
	            console.log("API : "+data);
	        }
	    });
    }
  });
}

function getUrlParameter(sUrl, sParam){
    var sPageURL = sUrl.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}  

