$(window).on('the_fountain', function(){
	var XP_DURATION = 10; // In seconds
	var MAX_TIME_BETWEEN_NUMBERS = 1000; // In ms
	var running = true;
	var xpStarted = false;

	$("#xp_container").addClass("fountain-container");
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	var
		width = 362,
		height = 600;

	canvas.width = width;
	canvas.height = height;

	var fountainHeight = 0;
	var level = 1;
	var heightToAdd = 30;

	var previousTime = Date.now();
	var lastNumberTime = Date.now();
	var timeStart = null;

	var trialCount = 0;

	//Adding keyboard controls
	document.onkeyup = function(e) {
		// Start counting numbers on the first keyup
		if(!xpStarted) {
			AVAILABLE_RNG.reset();
			xpStarted = true;
			timeStart = Date.now();
		}
		//Incrémenter la taille de la fontaine
		var key = e.keyCode;
		//Key up or space
		if (key == 38 || key == 32) {
			fountainHeight += heightToAdd;
			if(fountainHeight >= 500){
				fountainHeight = 0;
				level++;
				heightToAdd -= 2;
			}
		}
	};

	function update(){
		var currentTime = Date.now();
		var deltaTime = currentTime - previousTime;
		var deltaNumberTime = currentTime - lastNumberTime;
		var totalTime = currentTime - timeStart;

		// If no number are recieved for a long time, then stop the xp
		if(deltaNumberTime > MAX_TIME_BETWEEN_NUMBERS) {
			running = false;
			$(window).trigger('rng-error');
		}

		ctx.clearRect(0, 0, width, height);
		ctx.font = '16pt Arial Black, Gadget, sans-serif';
		ctx.textAlign = 'center';

		image = document.getElementById("the_fountain");
		ctx.drawImage(image, 0, 0);
		jet = document.getElementById("jet");
		ctx.drawImage(jet, 80, 500 - fountainHeight);


		if(!xpStarted) {
			ctx.fillText('Appuyez sur haut ou espace', width / 2, height / 2);
			ctx.fillText('pour faire grandir la fontaine', width / 2, height / 2 + 50);
		}

		if(xpStarted) {
			ctx.fillText("Niveau : " + level, 60, 50);
			ctx.fillText('Nb. restants : ' + parseInt(XP_DURATION * 10 - trialCount ), 240, 50);
		}

		if(deltaTime >= 50){
			var decrease = Math.ceil(deltaTime / 10.0);
			if(fountainHeight > 0){
				fountainHeight -= decrease;
				fountainHeight = Math.max(fountainHeight, 0);
			}
			previousTime = currentTime;	
		}
	};

	function animloop() {
		if(running) {
			update();
			requestAnimId = requestAnimFrame(animloop);
		}
	};

	function endXp() {
		running = false;
		window.cancelAnimationFrame(requestAnimId);
		document.onkeydown = null;
		ctx.fillText("FIN DE L'EXPERIENCE", width / 2, height / 2);
		removeFromQueue(function () {
			//Changing container content to display questionnaire which will send xp results
			$.get("/xp/questionnaire", function(html){
				$("#xp_container").removeClass("fountain-container");
				exitFullscreen();
				$("#xp_container").fadeToggle(1000, function () {
					$("#xp_container").html(html);
					$(window).trigger('questionnaire');
					$("#xp_container").fadeToggle(2000);
				});
			});
		})
	}

	function onNumbers(trialRes) {
		lastNumberTime = Date.now();
		if(xpStarted) {
			trialRes.gameScore = fountainHeight;
			trialRes.level = level;

			trialCount++;
			// We recieve the numbers each 100ms
			if(trialCount >= XP_DURATION * 10) {
				console.log('End XP, total trials : ', trialCount, 'total bit recieved : ', AVAILABLE_RNG.totalOnes + AVAILABLE_RNG.totalZeros)
				endXp();
			}
		}
	}

	//Set up everything for the RNG and results collecting
	if(AVAILABLE_RNG != null){
	  AVAILABLE_RNG.addNumbersCb(onNumbers);
	}

	animloop();
});
