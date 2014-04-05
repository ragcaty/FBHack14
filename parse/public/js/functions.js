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
					callback(data, 's');
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
		var sec = document.getElementById("first");
		var newSec = document.createElement("article");
		sec.parentNode.insertBefore(newSec, sec);
		sec.id = "";
		newSec.id= "first";
		if(sec.className == "container box style1 right") {
			newSec.className="container box style1 left";
		} else {
			newSec.className = "container box style1 right";
		}

		switch(identifier) {
			case 's':
				var head = "Your most liked status: \"" + data[0].message + "\"";
				var para = "By the way, you made " + data.length + " status updates in the past year!";
			    fillSection(newSec, "http://www.google.com", "images/pic01.jpg", head, para);
				break;
			case 'e':
				var head = "You were invited to " + data.length + " events this past year!";
				var para = "Do you remember going to: ";
				if(data.length < 3) {
					for(var i=0; i<data.length; i++) {
						if(i == data.length-1) {
							para += data[i].name;
						}else {
							para += data[i].name + ", ";
						}
					}
				} else {
					var count = 0;
					var i = 0;
					while(count != 3 || i != data.length) {
					
				fillSection(newSec, "http://www.google.com", "images/pic04.jpg", head, para);
				break;
		}
	}
  }
  function fillSection(newSec, link, imgsrc, heading, para) {
  	var a = document.createElement("a");
	a.setAttribute("href", link);
	a.className = "image full";
	var im = document.createElement("img");
	im.setAttribute("src", imgsrc);
	a.appendChild(im);
	newSec.appendChild(a);
	var div = document.createElement("div");
	div.className = "inner";
	newSec.appendChild(div);
	var h = document.createElement("h2");
	h.innerHTML = heading;
	var p = document.createElement("p");
	p.innerHTML = para; 
	div.appendChild(h);
	div.appendChild(p);
  }
