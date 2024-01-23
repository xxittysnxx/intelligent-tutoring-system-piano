var currentStep = 0;
var currentPoint = 100;
var result = 0;
var active = [];
var tried = 0;

// Timer length
var timerLength = 5; // in minutes

// Lock 1 variables
var lock1c = [60, 64, 62, 65, 64, 67, 60];
var point1 = 100;

// Lock 2 variables
var lock2c = [48, 55, 53, 52, 53, 55];
var point2 = 200;

// Lock 3 variables
var lock3c = [67, 64, 64, 65, 62, 62, 60, 62, 64, 65, 67, 67, 67];
var point3 = 300;

// Lock 4 variables
var lock4c = [72, 76, 74, 77, 76, 79, 77, 74, 72, 76, 74, 77, 76, 79, 77, 74, 72];
var point4 = 400;

// Lock 5 variables
var lock5c = [53, 50, 53, 52, 50, 48, 50, 55, 48];
var point5 = 500;

// Lock 6 variables
var lock6c = [72, 74, 76, 72, 74, 76, 77, 74, 76, 72, 79, 76, 74, 77, 76, 74, 77, 76, 72, 72, 76, 74, 79, 74, 76, 72, 76, 72];
var point6 = 600;

// Lock 7 variables
var lock7c = [72, 74, 76, 77, 79, 77, 76, 74, 72, 74, 76, 77, 79, 77, 76, 74, 72, 79, 72];
var point7 = 700;

// Lock 8 variables
var lock8c = [48, 52, 55, 48, 53, 57, 47, 53, 55, 48, 52, 55];
var point8 = 800;

// Lock 9 variables
var lock9c = [86, 84, 83, 81, 84, 83, 81, 83, 86, 84, 83, 81, 84, 83, 81, 79, 81, 83, 81, 86, 81, 83, 81, 83, 81, 81, 83, 81, 86, 81, 83, 81, 86, 86, 84, 83, 81, 84, 83, 81, 79, 86, 84, 83, 81, 84, 83, 81, 79, 81, 83, 81, 86, 81, 83, 81, 83, 81, 81, 83, 81, 86, 81, 83, 81, 86, 86, 84, 83, 81, 84, 83, 81, 79, 86, 84, 83, 81, 84, 83, 81, 79];
var point9 = 900;

// Lock 10 variables
var lock10c = [69, 71, 72, 69, 76, 76, 71, 74, 72, 71, 72, 69, 71, 72, 69, 76, 76, 71, 74, 72, 71, 69, 71, 72, 74, 76, 74, 72, 71, 69, 71, 72, 74, 76, 74, 72, 72, 71, 69, 71, 72, 69, 76, 76, 71, 74, 72, 71, 69, 71, 72, 74, 76, 74, 72, 71, 69, 71, 72, 74, 76, 74, 72, 72, 71, 69, 71, 72, 69, 76, 76, 71, 74, 72, 71, 69];
var point10 = 1000;

// LCS
var n1 = 0;
var n2 = 0;
var dp = new Array();

if (navigator.requestMIDIAccess) {
	console.log('This browser supports WebMIDI!');

	navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

} else {
	console.log('WebMIDI is not supported in this browser.');
	document.querySelector('.step0').innerHTML = 'Error: This browser does not support WebMIDI.';
}

function onMIDISuccess(midiAccess) {
	var inputs = midiAccess.inputs;
	var outputs = midiAccess.outputs;

	for (var input of midiAccess.inputs.values()) {
		input.onmidimessage = getMIDIMessage;
	}
}

function onMIDIFailure() {
	document.querySelector('.step0').innerHTML = 'Error: Could not access MIDI devices. Connect a device and refresh to try again.';
}

function getMIDIMessage(message) {
	var command = message.data[0];
	var note = message.data[1];
	var velocity = (message.data.length > 2) ? message.data[2] : 0; // a velocity value might not be included with a noteOff command

	switch (command) {
		case 144: // noteOn
			if (velocity > 0) {
				noteOnListener(note, velocity);
			} else {
				noteOffListener(note);
			}
			break;
		case 128: // noteOff
			noteOffCallback(note);
			break;
		// we could easily expand this switch statement to cover other types of commands such as controllers or sysex
	}
}


function noteOnListener(note, velocity) {

	switch(currentStep) {
		// If the game hasn't started yet.
		// The first noteOn message we get will run the first sequence
		case 0: 
			// Run our start up sequence
			runSequence('gamestart');
			// Increment the currentStep so this is only triggered once
			currentStep++;
			break;

		case 1:
			runSequence('change1');
			currentStep++;
			break;

		// The first lock - playing a correct sequence
		case 2:
			// add the note to the array
			active.push(note);
			// show the requisite number of note placeholders
			for (var i = 0; i < active.length; i++) {
				document.querySelector('.step2 .note:nth-child(' + (i + 1) + ')').classList.add('on');
			}

			// when the array is the same length as the correct sequence, compare the two
			if (active.length == lock1c.length) {
				result++;
				var match = true;
				n1 = active.length;
				n2 = lock1c.length;
				dp = new Array(); //先宣告一維
				for(var i = 0;i <= n1;i++){ //一維長度為i,i為變數，可以根據實際情況改變
					dp[i]=new Array(); //宣告二維，每一個一維陣列裡面的一個元素都是一個陣列；
					for(var j = 0;j <= n2;j++){ //一維陣列裡面每個元素陣列可以包含的數量p，p也是一個變數；
						dp[i][j] = 0; //這裡將變數初始化，我這邊統一初始化為空，後面在用所需的值覆蓋裡面的值
					}
				}
				for (var i = 1;i <= n1;i++){
        			for (var j = 1;j <= n2;j++){
            			if (active[i - 1] != lock1c[j - 1]){
							dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
						}
            			else{
							dp[i][j] = dp[i - 1][j - 1] + 1;
						}
					}
				}
				var score = dp[n1][n2] * 100 / lock1c.length;
				var rate = 1 / (1 + Math.pow(10, (currentPoint - point1) / 400));
				currentPoint = currentPoint + rate * score * 2;
				if (currentPoint >= 200 && tried == 0)
				{
					runSequence('change2');
					currentStep += 3;
					currentPoint = 300;
				}
				else if (currentPoint > 160)
				{
					runSequence('change1');
					currentStep++;
					currentPoint = 200;
					tried = 0;

				}
				else
				{
					point1 = currentPoint;
					currentPoint = 100;
					tried = 1;
					var lockInput = document.querySelector('.step2 .lock-input');
					
					lockInput.classList.add('error');
					window.setTimeout(function(){
						lockInput.classList.remove('error');
						for (var note of lockInput.querySelectorAll('.note')) {
							note.classList.remove('on');
						}
					}, 500);
				}
				active = [];
			}
			break;

		case 3:
			runSequence('change1');
			currentStep++;
			break;

		case 4:
			// add the note to the array
			active.push(note);
			// show the requisite number of note placeholders
			for (var i = 0; i < active.length; i++) {
				document.querySelector('.step4 .note:nth-child(' + (i + 1) + ')').classList.add('on');
			}

			// when the array is the same length as the correct sequence, compare the two
			if (active.length == lock2c.length) {
				result++;
				var match = true;
				n1 = active.length;
				n2 = lock2c.length;
				dp = new Array(); //先宣告一維
				for(var i = 0;i <= n1;i++){ //一維長度為i,i為變數，可以根據實際情況改變
					dp[i]=new Array(); //宣告二維，每一個一維陣列裡面的一個元素都是一個陣列；
					for(var j = 0;j <= n2;j++){ //一維陣列裡面每個元素陣列可以包含的數量p，p也是一個變數；
						dp[i][j] = 0; //這裡將變數初始化，我這邊統一初始化為空，後面在用所需的值覆蓋裡面的值
					}
				}
				for (var i = 1;i <= n1;i++){
        			for (var j = 1;j <= n2;j++){
            			if (active[i - 1] != lock2c[j - 1]){
							dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
						}
            			else{
							dp[i][j] = dp[i - 1][j - 1] + 1;
						}
					}
				}
				var score = dp[n1][n2] * 100 / lock2c.length;
				var rate = 1 / (1 + Math.pow(10, (currentPoint - point2) / 400));
				currentPoint = currentPoint + rate * score * 2;
				if (currentPoint >= 300 && tried == 0)
				{
					runSequence('change2');
					currentStep += 3;
					currentPoint = 400;
				}
				else if (currentPoint > 260)
				{
					runSequence('change1');
					currentStep++;
					currentPoint = 300;
					tried = 0;
				}
				else
				{
					point2 = currentPoint;
					currentPoint = 200;
					tried = 1;
					var lockInput = document.querySelector('.step4 .lock-input');
					
					lockInput.classList.add('error');
					window.setTimeout(function(){
						lockInput.classList.remove('error');
						for (var note of lockInput.querySelectorAll('.note')) {
							note.classList.remove('on');
						}
					}, 500);
				}
				active = [];
			}
			break;

		case 5:
			runSequence('change1');
			currentStep++;
			break;
		
		case 6:
			// add the note to the array
			active.push(note);
			// show the requisite number of note placeholders
			for (var i = 0; i < active.length; i++) {
				document.querySelector('.step6 .note:nth-child(' + (i + 1) + ')').classList.add('on');
			}

			// when the array is the same length as the correct sequence, compare the two
			if (active.length == lock3c.length) {
				result++;
				var match = true;
				n1 = active.length;
				n2 = lock3c.length;
				dp = new Array(); //先宣告一維
				for(var i = 0;i <= n1;i++){ //一維長度為i,i為變數，可以根據實際情況改變
					dp[i]=new Array(); //宣告二維，每一個一維陣列裡面的一個元素都是一個陣列；
					for(var j = 0;j <= n2;j++){ //一維陣列裡面每個元素陣列可以包含的數量p，p也是一個變數；
						dp[i][j] = 0; //這裡將變數初始化，我這邊統一初始化為空，後面在用所需的值覆蓋裡面的值
					}
				}
				for (var i = 1;i <= n1;i++){
        			for (var j = 1;j <= n2;j++){
            			if (active[i - 1] != lock3c[j - 1]){
							dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
						}
            			else{
							dp[i][j] = dp[i - 1][j - 1] + 1;
						}
					}
				}
				var score = dp[n1][n2] * 100 / lock3c.length;
				var rate = 1 / (1 + Math.pow(10, (currentPoint - point3) / 400));
				currentPoint = currentPoint + rate * score * 2;
				if (currentPoint >= 400 && tried == 0)
				{
					runSequence('change2');
					currentStep += 3;
					currentPoint = 500;
				}
				else if (currentPoint > 360)
				{
					runSequence('change1');
					currentStep++;
					currentPoint = 400;
					tried = 0;
				}
				else
				{
					point3 = currentPoint;
					currentPoint = 300;
					tried = 1;
					var lockInput = document.querySelector('.step6 .lock-input');
					
					lockInput.classList.add('error');
					window.setTimeout(function(){
						lockInput.classList.remove('error');
						for (var note of lockInput.querySelectorAll('.note')) {
							note.classList.remove('on');
						}
					}, 500);
				}
				active = [];
			}
			break;

		case 7:
			var lesson4c = [72, 74, 72, 74, 72, 74, 72, 74, 72];
			// add the note to the array
			active.push(note);
			// show the requisite number of note placeholders
			for (var i = 0; i < active.length; i++) {
				document.querySelector('.step7 .note:nth-child(' + (i + 1) + ')').classList.add('on');
			}

			// when the array is the same length as the correct sequence, compare the two
			if (active.length == lesson4c.length) {
				var match = true;
				for(var i = 0;i < active.length;i++)
				{
					if(active[i] != lesson4c[i])
					{
						match = false;
						break;
					}
				}
				if (match)
				{
					runSequence('change1');
					currentStep++;
				}
				else
				{
					var lockInput = document.querySelector('.step7 .lock-input');
					
					lockInput.classList.add('error');
					window.setTimeout(function(){
						lockInput.classList.remove('error');
						for (var note of lockInput.querySelectorAll('.note')) {
							note.classList.remove('on');
						}
					}, 500);
				}
				active = [];
			}
			break;

		case 8:
			// add the note to the array
			active.push(note);
			// show the requisite number of note placeholders
			for (var i = 0; i < active.length; i++) {
				document.querySelector('.step8 .note:nth-child(' + (i + 1) + ')').classList.add('on');
			}

			// when the array is the same length as the correct sequence, compare the two
			if (active.length == lock4c.length) {
				result++;
				var match = true;
				n1 = active.length;
				n2 = lock4c.length;
				dp = new Array(); //先宣告一維
				for(var i = 0;i <= n1;i++){ //一維長度為i,i為變數，可以根據實際情況改變
					dp[i]=new Array(); //宣告二維，每一個一維陣列裡面的一個元素都是一個陣列；
					for(var j = 0;j <= n2;j++){ //一維陣列裡面每個元素陣列可以包含的數量p，p也是一個變數；
						dp[i][j] = 0; //這裡將變數初始化，我這邊統一初始化為空，後面在用所需的值覆蓋裡面的值
					}
				}
				for (var i = 1;i <= n1;i++){
        			for (var j = 1;j <= n2;j++){
            			if (active[i - 1] != lock4c[j - 1]){
							dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
						}
            			else{
							dp[i][j] = dp[i - 1][j - 1] + 1;
						}
					}
				}
				var score = dp[n1][n2] * 100 / lock4c.length;
				var rate = 1 / (1 + Math.pow(10, (point4 - currentPoint) / 400));
				currentPoint = currentPoint + rate * score * 2;
				if (currentPoint >= 500 && tried == 0)
				{
					runSequence('change2');
					currentStep += 3;
					currentPoint = 600;
				}
				else if (currentPoint > 460)
				{
					runSequence('change1');
					currentStep++;
					currentPoint = 500;
					tried = 0;
				}
				else
				{
					point4 = currentPoint;
					currentPoint = 400;
					tried = 1;
					var lockInput = document.querySelector('.step8 .lock-input');
					
					lockInput.classList.add('error');
					window.setTimeout(function(){
						lockInput.classList.remove('error');
						for (var note of lockInput.querySelectorAll('.note')) {
							note.classList.remove('on');
						}
					}, 500);
				}
				active = [];
			}
			break;

		case 9:
			runSequence('change1');
			currentStep++;
			break;
		
		case 10:
			// add the note to the array
			active.push(note);
			// show the requisite number of note placeholders
			for (var i = 0; i < active.length; i++) {
				document.querySelector('.step10 .note:nth-child(' + (i + 1) + ')').classList.add('on');
			}

			// when the array is the same length as the correct sequence, compare the two
			if (active.length == lock5c.length) {
				result++;
				var match = true;
				n1 = active.length;
				n2 = lock5c.length;
				dp = new Array(); //先宣告一維
				for(var i = 0;i <= n1;i++){ //一維長度為i,i為變數，可以根據實際情況改變
					dp[i]=new Array(); //宣告二維，每一個一維陣列裡面的一個元素都是一個陣列；
					for(var j = 0;j <= n2;j++){ //一維陣列裡面每個元素陣列可以包含的數量p，p也是一個變數；
						dp[i][j] = 0; //這裡將變數初始化，我這邊統一初始化為空，後面在用所需的值覆蓋裡面的值
					}
				}
				for (var i = 1;i <= n1;i++){
        			for (var j = 1;j <= n2;j++){
            			if (active[i - 1] != lock5c[j - 1]){
							dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
						}
            			else{
							dp[i][j] = dp[i - 1][j - 1] + 1;
						}
					}
				}
				var score = dp[n1][n2] * 100 / lock5c.length;
				var rate = 1 / (1 + Math.pow(10, (point5 - currentPoint) / 400));
				currentPoint = currentPoint + rate * score * 2;
				if (currentPoint >= 600 && tried == 0)
				{
					runSequence('change2');
					currentStep += 3;
					currentPoint = 700;
				}
				else if (currentPoint > 560)
				{
					runSequence('change1');
					currentStep++;
					currentPoint = 600;
					tried = 0;
				}
				else
				{
					point5 = currentPoint;
					currentPoint = 500;
					tried = 1;
					var lockInput = document.querySelector('.step10 .lock-input');
					
					lockInput.classList.add('error');
					window.setTimeout(function(){
						lockInput.classList.remove('error');
						for (var note of lockInput.querySelectorAll('.note')) {
							note.classList.remove('on');
						}
					}, 500);
				}
				active = [];
			}
			break;

		case 11:
			runSequence('change1');
			currentStep++;
			break;

		case 12:
			// add the note to the array
			active.push(note);
			// show the requisite number of note placeholders
			for (var i = 0; i < active.length; i++) {
				document.querySelector('.step12 .note:nth-child(' + (i + 1) + ')').classList.add('on');
			}

			// when the array is the same length as the correct sequence, compare the two
			if (active.length == lock6c.length) {
				result++;
				var match = true;
				n1 = active.length;
				n2 = lock6c.length;
				dp = new Array(); //先宣告一維
				for(var i = 0;i <= n1;i++){ //一維長度為i,i為變數，可以根據實際情況改變
					dp[i]=new Array(); //宣告二維，每一個一維陣列裡面的一個元素都是一個陣列；
					for(var j = 0;j <= n2;j++){ //一維陣列裡面每個元素陣列可以包含的數量p，p也是一個變數；
						dp[i][j] = 0; //這裡將變數初始化，我這邊統一初始化為空，後面在用所需的值覆蓋裡面的值
					}
				}
				for (var i = 1;i <= n1;i++){
        			for (var j = 1;j <= n2;j++){
            			if (active[i - 1] != lock6c[j - 1]){
							dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
						}
            			else{
							dp[i][j] = dp[i - 1][j - 1] + 1;
						}
					}
				}
				var score = dp[n1][n2] * 100 / lock6c.length;
				var rate = 1 / (1 + Math.pow(10, (point6 - currentPoint) / 400));
				currentPoint = currentPoint + rate * score * 2;
				if (currentPoint >= 700 && tried == 0)
				{
					runSequence('change2');
					currentStep += 3;
					currentPoint = 800;
				}
				else if (currentPoint > 660)
				{
					runSequence('change1');
					currentStep++;
					currentPoint = 700;
					tried = 0;
				}
				else
				{
					point6 = currentPoint;
					currentPoint = 600;
					tried = 1;
					var lockInput = document.querySelector('.step12 .lock-input');
					
					lockInput.classList.add('error');
					window.setTimeout(function(){
						lockInput.classList.remove('error');
						for (var note of lockInput.querySelectorAll('.note')) {
							note.classList.remove('on');
						}
					}, 500);
				}
				active = [];
			}
			break;

		case 13:
			runSequence('change1');
			currentStep++;
			break;

		case 14:
			// add the note to the array
			active.push(note);
			// show the requisite number of note placeholders
			for (var i = 0; i < active.length; i++) {
				document.querySelector('.step14 .note:nth-child(' + (i + 1) + ')').classList.add('on');
			}

			// when the array is the same length as the correct sequence, compare the two
			if (active.length == lock7c.length) {
				result++;
				var match = true;
				n1 = active.length;
				n2 = lock7c.length;
				dp = new Array(); //先宣告一維
				for(var i = 0;i <= n1;i++){ //一維長度為i,i為變數，可以根據實際情況改變
					dp[i]=new Array(); //宣告二維，每一個一維陣列裡面的一個元素都是一個陣列；
					for(var j = 0;j <= n2;j++){ //一維陣列裡面每個元素陣列可以包含的數量p，p也是一個變數；
						dp[i][j] = 0; //這裡將變數初始化，我這邊統一初始化為空，後面在用所需的值覆蓋裡面的值
					}
				}
				for (var i = 1;i <= n1;i++){
        			for (var j = 1;j <= n2;j++){
            			if (active[i - 1] != lock7c[j - 1]){
							dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
						}
            			else{
							dp[i][j] = dp[i - 1][j - 1] + 1;
						}
					}
				}
				var score = dp[n1][n2] * 100 / lock7c.length;
				var rate = 1 / (1 + Math.pow(10, (point7 - currentPoint) / 400));
				currentPoint = currentPoint + rate * score * 2;
				if (currentPoint >= 800 && tried == 0)
				{
					runSequence('change2');
					currentStep += 3;
					currentPoint = 900;
				}
				else if (currentPoint > 760)
				{
					runSequence('change1');
					currentStep++;
					currentPoint = 800;
					tried = 0;
				}
				else
				{
					point7 = currentPoint;
					currentPoint = 700;
					tried = 1;
					var lockInput = document.querySelector('.step14 .lock-input');
					
					lockInput.classList.add('error');
					window.setTimeout(function(){
						lockInput.classList.remove('error');
						for (var note of lockInput.querySelectorAll('.note')) {
							note.classList.remove('on');
						}
					}, 500);
				}
				active = [];
			}
			break;

		case 15:
			var lesson8c = [48, 52, 50, 53, 48, 52, 50, 53, 52, 55, 50, 53, 52, 55, 50, 53, 48, 52];
			// add the note to the active chord array
			active.push(note);

			// show the number of active notes
			for (var i = 0; i < active.length; i++) {
				document.querySelector('.step15 .note:nth-child(' + (i + 1) + ')').classList.add('on');
			}

			// If the array is the same length as the correct chord, compare
			if (active.length == lesson8c.length) {
				var match = true;
				for (var index = 0; index < active.length; index++) {
					if (lesson8c.indexOf(active[index]) < 0) {
						match = false;
						break;
					}
				}

				if (match) {
					runSequence('change1');
					currentStep++;
				}
				else {
					// Clear the array and start over
					var lockInput = document.querySelector('.step15 .lock-input');
		
					lockInput.classList.add('error');
					window.setTimeout(function(){
						lockInput.classList.remove('error');
						for (var note of lockInput.querySelectorAll('.note')) {
							note.classList.remove('on');
						}
					}, 500);
				}
				active = [];
			}
			break;

		case 16:
			// add the note to the active chord array
			active.push(note);

			// show the number of active notes
			for (var i = 0; i < active.length; i++) {
				document.querySelector('.step16 .note:nth-child(' + (i + 1) + ')').classList.add('on');
			}

			// If the array is the same length as the correct chord, compare
			if (active.length == lock8c.length) {
				result++;
				var match = true;
				for (var index = 0; index < active.length; index++) {
					if (lock8c.indexOf(active[index]) < 0) {
						match = false;
						break;
					}
				}

				if (match) {
					runSequence('change1');
					currentPoint = point9;
					currentStep++;
				}
				else {
					// Clear the array and start over
					var lockInput = document.querySelector('.step16 .lock-input');
		
					lockInput.classList.add('error');
					window.setTimeout(function(){
						lockInput.classList.remove('error');
						for (var note of lockInput.querySelectorAll('.note')) {
							note.classList.remove('on');
						}
					}, 500);
				}
				active = [];
			}
			break;

		case 17:
			runSequence('change1');
			currentStep++;
			break;

		case 18:
			// add the note to the array
			active.push(note);
			// show the requisite number of note placeholders
			for (var i = 0; i < active.length; i++) {
				document.querySelector('.step18 .note2:nth-child(' + (i + 1) + ')').classList.add('on');
			}

			// when the array is the same length as the correct sequence, compare the two
			if (active.length == lock9c.length) {
				result++;
				var match = true;
				n1 = active.length;
				n2 = lock9c.length;
				dp = new Array(); //先宣告一維
				for(var i = 0;i <= n1;i++){ //一維長度為i,i為變數，可以根據實際情況改變
					dp[i]=new Array(); //宣告二維，每一個一維陣列裡面的一個元素都是一個陣列；
					for(var j = 0;j <= n2;j++){ //一維陣列裡面每個元素陣列可以包含的數量p，p也是一個變數；
						dp[i][j] = 0; //這裡將變數初始化，我這邊統一初始化為空，後面在用所需的值覆蓋裡面的值
					}
				}
				for (var i = 1;i <= n1;i++){
        			for (var j = 1;j <= n2;j++){
            			if (active[i - 1] != lock9c[j - 1]){
							dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
						}
            			else{
							dp[i][j] = dp[i - 1][j - 1] + 1;
						}
					}
				}
				var score = dp[n1][n2] * 100 / lock9c.length;
				var rate = 1 / (1 + Math.pow(10, (point9 - currentPoint) / 400));
				currentPoint = point9 + rate * score * 2;
				if (currentPoint >= 1000 && tried == 0 && result <= 5)
				{
					runSequence('change1');
					runSequence('change1');
					currentStep += 2;
					currentPoint = 1100;
				}
				else if (currentPoint > 960)
				{
					runSequence('change1');
					currentStep++;
					currentPoint = 1000;
					tried = 0;
				}
				else
				{
					point9 = currentPoint;
					currentPoint = 900;
					tried = 1;
					var lockInput = document.querySelector('.step18 .lock-input2');
					
					lockInput.classList.add('error');
					window.setTimeout(function(){
						lockInput.classList.remove('error');
						for (var note of lockInput.querySelectorAll('.note2')) {
							note.classList.remove('on');
						}
					}, 500);
				}
				active = [];
			}
			break;

		case 19:
			// add the note to the array
			active.push(note);
			// show the requisite number of note placeholders
			for (var i = 0; i < active.length; i++) {
				document.querySelector('.step19 .note2:nth-child(' + (i + 1) + ')').classList.add('on');
			}

			// when the array is the same length as the correct sequence, compare the two
			if (active.length == lock10c.length) {
				result++;
				var match = true;
				n1 = active.length;
				n2 = lock10c.length;
				dp = new Array(); //先宣告一維
				for(var i = 0;i <= n1;i++){ //一維長度為i,i為變數，可以根據實際情況改變
					dp[i]=new Array(); //宣告二維，每一個一維陣列裡面的一個元素都是一個陣列；
					for(var j = 0;j <= n2;j++){ //一維陣列裡面每個元素陣列可以包含的數量p，p也是一個變數；
						dp[i][j] = 0; //這裡將變數初始化，我這邊統一初始化為空，後面在用所需的值覆蓋裡面的值
					}
				}
				for (var i = 1;i <= n1;i++){
        			for (var j = 1;j <= n2;j++){
            			if (active[i - 1] != lock10c[j - 1]){
							dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
						}
            			else{
							dp[i][j] = dp[i - 1][j - 1] + 1;
						}
					}
				}
				var score = dp[n1][n2] * 100 / lock10c.length;
				var rate = 1 / (1 + Math.pow(10, (point10 - currentPoint) / 400));
				currentPoint = point10 + rate * score * 2;
				if (currentPoint > 1060)
				{
					runSequence('change1');
					currentStep++;
					currentPoint = 1200;
					tried = 0;
				}
				else
				{
					point10 = currentPoint;
					currentPoint = 1000;
					tried = 1;
					var lockInput = document.querySelector('.step19 .lock-input2');
					
					lockInput.classList.add('error');
					window.setTimeout(function(){
						lockInput.classList.remove('error');
						for (var note of lockInput.querySelectorAll('.note2')) {
							note.classList.remove('on');
						}
					}, 500);
				}
				active = [];
			}
			break;

		case 20:
			currentStep = 20;
			if(result <= 6)
				document.querySelector('.step20').innerHTML = "Excellent work!<br>You have fully learned from these classes!";
			else if(result <= 8)
				document.querySelector('.step20').innerHTML = "Good job!<br>You have learned form these classes well!<br>Keep trying!"
			else if(result <= 10)
				document.querySelector('.step20').innerHTML = "Well Done!<br>You have gotten something from these classes!<br>But why don't you get more and more?<br><br>Click the reload button to restart!"
			else
				document.querySelector('.step20').innerHTML = "Good try!<br>But I think you can do much better!<br><br>Click the reload button to restart!"
			document.querySelector('body').dataset.step = "20";
			document.querySelector('body').classList.add('success');
			break;
	}
}

function noteOffListener(note) {

	switch(currentStep) {
		case 15:
			// Remove the note value from the active chord array
			active.splice(active.indexOf(note), 1);

			// Hide the last note shown
			document.querySelector('.step16 .note:nth-child(' + (active.length + 1) + ')').classList.remove('on');
			break;
		case 16:
			// Remove the note value from the active chord array
			active.splice(active.indexOf(note), 1);

			// Hide the last note shown
			document.querySelector('.step16 .note:nth-child(' + (active.length + 1) + ')').classList.remove('on');
			break;
	}
}

function runSequence(sequence) {
	switch(sequence) {
		case 'gamestart':			
			// Now we'll start a countdown timer...
			startTimer();			
			// code to trigger animations, give a clue for the first lock
			advanceScreen();
			successFlicker();
			break;
		
		case 'change1':
			startTimer();
			// code to trigger animations and give clue for the next lock
			advanceScreen();
			successFlicker();
			break;
		
		case 'change2':
			timerLength -= 0.2;
			startTimer();
			// code to trigger animations and give clue for the next lock
			advanceScreen2();
			successFlicker();
			break;

		case 'gameover':
			currentStep = 20;
			document.querySelector('.step20 p').innerHTML = "You didn't pass the course...<br>Click the reload button to try again!";
			document.querySelector('body').dataset.step = "20";
			document.querySelector('body').classList.add('gameover');
			break;
	}
}

function advanceScreen() {
	document.querySelector('body').dataset.step++;
}
function advanceScreen2() {
	document.querySelector('body').dataset.step++;
	document.querySelector('body').dataset.step++;
	document.querySelector('body').dataset.step++;
}
function successFlicker() {
	var b = document.querySelector('body')
	b.classList.add('success');
	window.setTimeout(function(){
		b.classList.remove('success');
	}, 2500);
}

function startTimer(){
  // set timer for 60 minutes from start
  var now = new Date();
  timeEnd = new Date(now.getTime() + (timerLength*60*1000) - 1);

  updateTimer();
}
/**
 * Function to update the time remaining every second
 */
function updateTimer() {
	var now = new Date();
	var distance = timeEnd.getTime() - now.getTime();
	var minutes = Math.floor(distance / (1000 * 60));
	var seconds = Math.floor((distance % (1000 * 60)) / 1000);

	if (minutes < 10) minutes = "0" + minutes;
	if (seconds < 10) seconds = "0" + seconds;

	if (currentStep < 20) {
		document.querySelector('#countdown').innerText = minutes + ":" + seconds;
		
		if (minutes > 0 || seconds > 0) {
			window.setTimeout(function() {
				updateTimer();
			}, 1000);
		} else if (minutes == 0 && seconds == 0) {
			runSequence('gameover');
  		}
	}  
}
