$(document).ready( play() );

function play(){
	var storage = window.localStorage;
	if (!window.localStorage) return;

	var sol = "";

	for(var i = 0; i < storage.length; i++) {
		sol = sol + "<br><br>" + (storage.key(i) + " -> " + storage.getItem(storage.key(i)));
	}

	console.log(sol);
	document.getElementById("display").innerHTML = sol;

	start();
}