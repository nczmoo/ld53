class UI{	
	logs = [];
	polarizing = false;
	constructor(){

	}
	refresh(){
		$("#chosenTopic").html(game.config.chosenTopic);
		$("#centSermon").html( Math.round(game.config.turns / game.config.maxTurns * 100) + "%")
		$("#sermonNum").html(game.config.sermonNum);
		this.printNave();
		this.printMenu();
		if (this.logs.length > 0 && $("#log").hasClass('d-none')){
			$('.log').removeClass('d-none');
		}
		let txt = '';
		for (let  log of this.logs){
			txt += "<div class='p-1'>" + log + "</div>";
		}
		$("#log").html(txt);
		this.resetMenu();
	}

	fetchDelta(seatID){
		let personID = game.config.seats[seatID];
		let person = game.config.congregation[personID];
		if (person.delta > 0){
			return "&uarr;";
		} else if (person.delta < 0){
			return "-";
		}
		return "&nbsp;";
	}

	fetchPplCaption(n){
		let txt = 'person';
		if (n > 1){
			txt = 'people';
		}
		return txt;
	}

	fetchSeatClass(seatID){
		let personID = game.config.seats[seatID];
		let person = game.config.congregation[personID];

		if (game.config.chosenTopic == null && person.delta == 0){
			return ' filled ';
		} 
		if (game.config.chosenTopic == null && person.delta > 0){
			return ' filled-pos ';
		}

		if (game.config.chosenTopic == null && person.delta < 0){
			return ' filled-neg ';
		}

		if (game.config.chosenTopic != null && game.config.likeOrDislike == null){
			return this.fetchTopicOpinionClass(seatID);
		}

		let polarity = this.fetchTopicPolarity(seatID);		
		return polarity;
	}

	fetchTopicOpinionClass(seatID){
		let personID = game.config.seats[seatID];
		let person = game.config.congregation[personID];
		let opinion = person.opinions[game.config.chosenTopic];
		if (opinion == 0){
			return ' neutral ';
		}
		if (opinion > 0){
			return ' positive ';
		}
		return ' negative ';
	}

	fetchTopicPolarity(seatID){
		let personID = game.config.seats[seatID];
		let person = game.config.congregation[personID];
		let opinion = person.opinions[game.config.chosenTopic];
		if (opinion == 0){
			return ' neutral ';
		}
		if ((opinion > 0 && game.config.likeOrDislike == 'like') 
			|| (opinion < 0 && game.config.likeOrDislike == 'dislike')){
			return ' positive ';
		}
		return ' negative ';
	}

	formatID(id){
		return Number(id) + 1;
	}

	log(msg){
		this.logs.unshift(msg);
	}

	printNave(){
		let txt = '';
		for (let i = game.config.numOfSeats - 1; i >= 0;  i --){
			if ((i + 1) % Config.numOfSeatsInRow == 0){				
				txt += "<div class='text-center'>";
			}
			let caption = '&nbsp;', filled = '';
			if (game.config.seats[i] != null){
				filled = this.fetchSeatClass(i);	
				caption = this.fetchDelta(i);
			}
			txt += "<div id='seat-" + i + "' class='fw-bold verb1 cell text-center fs-4 " + filled + "'>" + caption + "</div>";
			if ((i + 1) % Config.numOfSeatsInRow == 1){				
				txt += "</div>";
			}
		}
		$("#nave").html(txt);
	}

	printMenu(){
		if (!this.polarizing){
			this.printSermonMenu();
			return;
		}
		$("#menu").addClass('d-none');
		$("#polarMenu").removeClass('d-none');
		
	}

	printProfile(personID){
		let fills = ['gender', 'race', 'sexuality', 'affiliation'];
		let txt = '';
		let person = game.config.congregation[personID];
		$("#profile-name").html(person.name);		
		for (let fill of fills){
			txt += person[fill] + " / ";
		}
		$("#profile-demographics").html(txt);
		txt = '';
		for (let i in person.logs){
			let log = person.logs[i];
			txt += "<div>" + log + "</div>";
		}
		$("#profile-log").html(txt);
	}

	printSermonMenu(){
		let txt = '';

		for (let i in game.config.sermonTopics){
			let topic = game.config.sermonTopics[i];
			let btnClass = ' btn-primary ';
			if (topic == game.config.chosenTopic){
				btnClass = ' btn-secondary ';
			}			
			txt += "<div class='col'><button id='topic-" 
				+ i + "' class='verb1 btn " + btnClass 
				+ " form-control btn-lg p-3'>" 
				+ topic + "</button></div>";
			
		}
		$("#menu").html(txt);
	}

	resetMenu(){
		$(".likeOrDislike").removeClass('btn-secondary');					
		if (game.config.likeOrDislike == 'like'){
			$("#likeOrDislike-" + game.config.likeOrDislike).removeClass('btn-success');
			$("#likeOrDislike-dislike").addClass('btn-danger');
		} else {
			$("#likeOrDislike-" + game.config.likeOrDislike).removeClass('btn-danger');
			$("#likeOrDislike-like").addClass('btn-success');
		}
		$("#likeOrDislike-" + game.config.likeOrDislike).addClass('btn-secondary');
	}
}
