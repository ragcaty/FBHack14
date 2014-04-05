var Anim = angular.module("Anim", ['ngAnimate']);

function disappear() {
	var d = document.getElementsByClassName("events");
	d.setAttribute('display', 'none');
}

window.fbAsyncInit = function() {
  FB.init({
    appId      : 847757078573654,
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });

  FB.Event.subscribe('auth.authResponseChange', function(response) {
    if (response.status === 'connected') {
		getStatus('/me', doneStatus);
    } else if (response.status === 'not_authorized') {
    } else {
    }
  });
  };

  // Load the SDK asynchronously
  (function(d){
   var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement('script'); js.id = id; js.async = true;
   js.src = "//connect.facebook.net/en_US/all.js";
   ref.parentNode.insertBefore(js, ref);
  }(document));

  function getStatus(str, callback) {
    FB.api(str, function(response) {
		if(response.id && !response.error) {
			var end = new Date();
			var start = new Date(end.getFullYear()-1, end.getMonth()+1, end.getDate());
			var endUnix= end.getTime().toString().substr(0,10);
			var startUnix = start.getTime().toString().substr(0,10);
			var q = 'SELECT message, like_info from status where uid=' + response.id + ' and time >= ' + startUnix + ' and time <= ' + endUnix + 'ORDER BY like_info.like_count DESC';
			var q2 = 'SELECT name from event where eid in (select eid from event_member where uid= ' + response.id + ')';
			FB.api( {
				method: 'fql.query',
				query:q },
			function(data) {
				if(data.length !=0) {
					var d = data[0];
					callback(d, 's');
				} else {
					callback(null);
				}
			});
            FB.api( {
				method: 'fql.query',
				query:q2 },
			function(data) {
				if(data.length !=0) {
					callback(data, 'e');
				} else {
					callback(null);
				}
			});

		}
    });
  }

  function doneStatus(data, identifier) {
  	if(data !== null) {
		switch(identifier) {
			case 's':
	  			var div = document.getElementsByClassName('status');
	  			div[0].innerHTML = data.message;
				break;
			case 'e':
				var parent = document.getElementsByClassName('events');
				parent[0].innerHTML = "You were invited to " + data.length + " events this past year!" + parent[0].innerHTML;
				var list = document.getElementsByTagName("ol");
				for(var i=0; i<data.length; i++) {
					var d = document.createElement("li");
					d.className = 'event-details';
					d.appendChild(document.createTextNode(data[i].name));
					list[0].appendChild(d);
				}
				break;
		}
	}
  }

