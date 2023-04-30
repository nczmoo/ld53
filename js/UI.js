class UI{	
	logs = [];
	
	nave = new UINave();
	polarizing = false;
	profile = new UIProfile();
	topicLogs = {};
	turnLogs = [];

	constructor(){
		for (let topic of Topic.list){
			this.topicLogs[topic] = [];
		}
	}
	
	refresh(){
		$("#chosenTopic").html(game.config.chosenTopic);
		$("#centSermon").html( Math.round(game.config.turns / game.config.maxTurns * 100) + "%")
		$("#sermonNum").html(Config.sermonNum);
		$("#parishSize").html(game.config.parishSize);
		$("#faith").html(Config.faith);
		this.nave.print();
		this.printMenu();
		this.printLog();		
		if (this.turnLogs.length > 0 && $("#turnLogs").hasClass('d-none')){
			$('.log').removeClass('d-none');
		}
		let txt = '';
		for (let  log of this.turnLogs){
			txt += "<div class='p-3'>" + log + "</div>";
		}
		$("#turnLogs").html(txt);
		this.resetMenu();
	}

	fetchPplCaption(n){
		let txt = 'person';
		if (n > 1){
			txt = 'people';
		}
		return txt;
	}

	formatID(id){
		return Number(id) + 1;
	}

	log(msg){
		this.logs.unshift(msg);
		this.turnLogs.unshift(msg);
	}

	printLog(){
		let txt = '';
		for (let  log of this.logs){
			txt += "<div class='p-1'>" + log + "</div>";
		}
		$("#logList").html(txt);
	}

	printMenu(){
		$("#topicClick").addClass('d-none');

		if (!this.polarizing){
			this.printSermonMenu();			
			if (game.config.chosenTopic != null){				
				$("#topicClick").removeClass('d-none');
			}
			return;
		}
		$("#menu").addClass('d-none');
		$("#polarMenu").removeClass('d-none');		
	}
	
	printSermonMenu(){
		let txt = '';

		for (let i in game.config.sermonTopics){
			let topic = game.config.sermonTopics[i];
			let btnClass = ' btn-outline-secondary ';
			if (topic == game.config.chosenTopic){
				btnClass = ' btn-secondary ';
			}			
			txt += "<div class='col p-3'><button id='topic-" 
				+ i + "' class='verb1 btn " + btnClass 
				+ " form-control btn-lg p-3'>" 
				+ topic + "</button></div>";
			
		}
		$("#topicMenu").html(txt);
	}

	printTopicLogs(topic){
		let txt = "<div class='fw-bold'> Last time you talked about this topic...</div>";
		for (let  log of this.topicLogs[topic]){
			txt += "<div class='p-3'>" + log + "</div>";
		}
		if (this.topicLogs[topic].length < 1){
			txt = "<div class='fw-bold'>This is your first time talking about this.</div>";
		}
		$("#topicLogs").html(txt);
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
