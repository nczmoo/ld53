class Game{
	config = new Config();
	loop = new Loop();
	loopInterval = null;
	
	constructor(){		
		this.loopInterval = setInterval(this.loop.looping, 1000);
	}

	
	likeOrDislike(which){
		if (this.config.likeOrDislike == null || this.config.likeOrDislike != which){
			this.config.likeOrDislike = which;
			return;
		}
		this.config.expressOpinion();		
	}

	person(personID){
		$(".window").addClass('d-none');
		$("#profile").removeClass('d-none');
		ui.printProfile(personID);
	}

	seat(seatID){
		console.log(seatID);
		//get info on seat
	}

	topic(topicID){
		topicID = Number(topicID);		
		if (this.config.chosenTopic == null || this.config.sermonTopics.indexOf(this.config.chosenTopic) != topicID){
			this.config.pickTopic(topicID);
			return;
		}
		
		ui.polarizing = true;
	}
}
