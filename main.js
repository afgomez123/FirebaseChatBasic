;(function(){



  var config = {
     apiKey: "AIzaSyB579JSge9HE1W6Fk7u8gvZb8Sd87vHwGo",
     authDomain: "taller-facilito-hd-8a85e.firebaseapp.com",
     databaseURL: "https://taller-facilito-hd-8a85e.firebaseio.com",
     projectId: "taller-facilito-hd-8a85e",
     storageBucket: "taller-facilito-hd-8a85e.appspot.com",
     messagingSenderId: "1014361600828"
   };
   firebase.initializeApp(config);





	var database = firebase.database();
	var loginBtn = document.getElementById('start-login');
	var user = null;
	var conectadoKey = "";
	var rooms

	var usuariosConectados = null;

	loginBtn.addEventListener("click", googleLogin);
	window.addEventListener("unload",unlogin);

	function googleLogin(){
		var provider = new firebase.auth.GoogleAuthProvider();

		firebase.auth().signInWithPopup(provider)
				.then(function(result){
					user = result.user;
					console.log(user);
					$("#login").fadeOut();
					initApp();
				});
	}

	function initApp(){
		usuariosConectados = database.ref("/connected");
		rooms = database.ref("/rooms");

		login(user.uid, user.displayName || user.email);

		usuariosConectados.on("child_added",addUser);
		usuariosConectados.on("child_removed",removeUser);

		rooms.on("child_added", newRoom);////////////////////////////////////////////////////////////////////////////////////
	}

	function login(uid, name){
		var conectado = usuariosConectados.push({
			uid: uid,
			name: name
		});

		conectadoKey = conectado.Key;
	}

	function unlogin(){
		database.ref("/connected/"+conectadoKey).remove();
	}

	function addUser(data){
		if(data.val().uid == user.uid) return;
		var friend_id = data.val().uid;
		var $li = $("<li>").addClass("collection-item")
						   .html(data.val().name)
						   .attr("id",data.val().uid)
						   .appendTo("#users");

		$li.on("click",function(){
			var room = rooms.push({
				creator: user.uid,
				friend: friend_id
			});

			//new Chat(room.key, user, "chats", database);

		});
	}

	function removeUser(data){
		$("#"+data.val().uid).slideUp("fast",function(){
			$(this).remove();
		});
	}

	function newRoom(data){
		if(data.val().friend == user.uid ){
			new Chat(data.key, user, "chats", database);
		}

		if(data.val().creator == user.uid ){
			new Chat(data.key, user, "chats", database);
		}
	}

})();
