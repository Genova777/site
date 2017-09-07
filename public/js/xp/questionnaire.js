"use strict";
$(window).on('questionnaire', function(){
	$("#results_form").submit(function(e){
		e.preventDefault();
		//Doesn't send the datas if there was no AVAILABLE_RNG
		if(AVAILABLE_RNG != null){
			var formData = $("#results_form").serializeArray();
			formData.push({name: 'results', value: JSON.stringify(AVAILABLE_RNG.results)});
			formData.push({name: 'rng_id', value: AVAILABLE_RNG.id});
			$.post("/xp/send_results/" + getXpId(), formData, function(data){
				window.location.replace("/xp/end_xp");
			});
		}
		else{
			window.location.replace("/xp/end_xp_problem");
		}
	});
});
