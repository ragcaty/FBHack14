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
			var q2 = 'SELECT name, pic_big from event where eid in (select eid from event_member where uid= ' + response.id + ')';
			var fqlRequest = 'SELECT like_info, link, src_big, created FROM photo WHERE aid IN (SELECT aid FROM album WHERE owner = '+response.id+') and created > '+startUnix+'ORDER BY like_info.like_count DESC';
			FB.api('/fql',{q:fqlRequest}, function(response){
				if(response.length !=0) {
					callback(response, 'p');
				} else {
					callback(null);
				}
			});
			FB.api('/me/checkins?fields=place,tags.fields(name),created_time,from,message&limit=200&since=2013-03-23', function(response) {
				var locations = [];
				var friends =  [];
			  for(var j = 0; j < response.data.length; j++)
			  {
				console.log("Where have you been this past year? Who was with you? And what did you do?");
				response.data[j].place.name.toUpperCase();
				locations.push(response.data[j].place.name);
				for(var k = 0; ('tags' in response.data[j]) && (k < response.data[j].tags.data.length); k++)
				{
				  response.data[j].tags.data[k].name.toUpperCase();
				  friends.push(response.data[j].tags.data[k].name);
				}
			  }
			  var uniqueloc= [];
			  uniqueloc = locations.filter(function(elem, pos) {
				return locations.indexOf(elem) == pos;
			});
			  var uniquefriends = [];
			  uniquefriends = friends.filter(function(elem, pos) {
				return friends.indexOf(elem) == pos;
			})
				if(uniqueloc.length != 0) {
					callback(uniqueloc, 'l');
				} else {
					callback(null);
				}
				if(uniquefriends.length != 0) {
					callback(uniquefriends, 'f');
				} else {
					callback(null);
				}
			});
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
				var count = 0;
				for(var i=0; i<data.length; i++) {
					if(i == 2) {
						para += data[i].name;
					}else {
						para += data[i].name + ", ";		
					}
					count++;
					if(count == 3)
						break;
				}
				i = Math.floor(Math.random()*count)+1;
				fillSection(newSec, "http://www.google.com", data[i].pic_big, head, para);
				break;
			case 'p':
				var head = "Looking Sharp!";
				var para = "Your most liked photo <3";
				var link = data.data[0].link;
				var src = data.data[0].src_big;
				fillSection(newSec, link, src, head, para);
				break;
			case 'l':
				
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
