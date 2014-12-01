// Listen for a file being selected by the user
$(document).ready(function() {
	$("#csv-file").change(handleFileSelect);
});

// Load the CVS file, parse it, and store data locally
function loadGame(data) {
	var storage = window.localStorage;
	if (!window.localStorage) return;

	storage.clear();

	console.log(data);

	console.log(data.data);

	for(var i = 0; i < data.data.length; i++) {
		var q = data.data[i][0];
		var a = data.data[i][1];

		storage.setItem('' + q, '' + a);
		console.log(q + " -> " + a);
	}
   showData();
}

function showData() {
    var table = document.getElementById("preview");
    table.innerHTML = "";
    var storage = window.localStorage;
    var row = table.insertRow(0);
    var labelQ = row.insertCell(0);
    var labelA = row.insertCell(1);
    labelQ.innerHTML = "Question";
    labelA.innerHTML = "Answer";
    
    for(var i = 0; i < storage.length; i++) {
        row = table.insertRow(i+1);
        var q = row.insertCell(0);
        var a = row.insertCell(1);
        q.innerHTML = storage.key(i);
        a.innerHTML = storage.getItem(storage.key(i));
    }
}

// Parse a file as soon as it's loaded
function handleFileSelect(evt) {
	var file = evt.target.files[0];

	Papa.parse(file, {
		delimiter: ",",
		//header: true,	//first line in file names variables
		//dynamicTyping: true,	//use types intended instead of all strings
		complete: function(results) {
			data = results;
			loadGame(data);
		}
	});
}

// Start gameplay - display questions and start the game
function play() {
	var storage = window.localStorage;
	if (!window.localStorage) return;
/*
	var sol = "";

	for(var i = 0; i < storage.length; i++) {
		sol = sol + "<br><br>" + (storage.key(i) + " -> " + storage.getItem(storage.key(i)));
	}

	console.log(sol);
	document.getElementById("display").innerHTML = sol;
*/
	start();
}