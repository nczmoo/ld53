class Game{
	config = new Config();
	loop = new Loop();
	loopInterval = null;
	
	constructor(){		
		this.loopInterval = setInterval(this.loop.looping, 1000);
	}

	influence(personID, likeOrDislike, topicID){
		let person = this.config.congregation[personID];
		let topic = Topic.list[topicID];
		let opinion = person.opinions[topic];
		let cost = Math.abs(opinion);
		if (cost == 0){
			cost = 1;
		}
		if (Config.faith < cost){
			console.log('not enough faith');
			return;
		}
		console.log(Config.faith, cost);
		Config.faith -= cost;
		ui.profile.print(personID);

	}
	
	likeOrDislike(which){
		if (this.config.likeOrDislike == null || this.config.likeOrDislike != which){
			this.config.likeOrDislike = which;
			return;
		}
		this.config.sermon.deliver();		
	}

	person(personID){
		$(".window").addClass('d-none');
		$("#profile").removeClass('d-none');
		ui.profile.print(personID);
	}

	seat(seatID){
		
		if (this.config.seats[seatID] == null){
			return;
		}
		let personID = this.config.seats[seatID];

		this.person(personID);
	}

	topic(topicID){
		topicID = Number(topicID);		
		if (this.config.chosenTopic == null || this.config.sermonTopics.indexOf(this.config.chosenTopic) != topicID){			
			this.config.sermon.pickTopic(topicID);

			return;
		}
		ui.polarizing = true;
	}

	trust(personID){
		let person = this.config.congregation[personID];		
		let cost = Math.abs(person.trust);
		if (cost == 0){
			cost = 1;
		}
		if (Config.faith < cost){
			console.log('not enough faith');
			return;
		}
		Config.faith -= cost;
		person.likesYou();
		ui.profile.print(personID);

	}
}
