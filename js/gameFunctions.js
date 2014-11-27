function loadGame(data){
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
}


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
 
$(document).ready(function(){
	$("#csv-file").change(handleFileSelect);
});