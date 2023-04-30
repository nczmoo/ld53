class UINave {
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

    fetchSeatClass(seatID){
		let personID = game.config.seats[seatID];
		let person = game.config.congregation[personID];

		let append = '';
		if (person.delta > 0){
			append = '-pos';
		}

		if (person.delta < 0){
			append = '-neg';
		}
		if (game.config.chosenTopic == null){
			return 'neutral' + append;
		}
		if (game.config.chosenTopic != null && game.config.likeOrDislike == null){
			return this.fetchTopicOpinionClass(seatID) + append;
		}

		let polarity = this.fetchTopicPolarity(seatID);		
		return polarity + append;
	}


	fetchTopicOpinionClass(seatID){
		let personID = game.config.seats[seatID];
		let person = game.config.congregation[personID];
		let opinion = person.opinions[game.config.chosenTopic];
		if (opinion == 0){
			return 'neutral';
		}
		if (opinion > 0){
			return 'positive';
		}
		return 'negative';
	}

	fetchTopicPolarity(seatID){
		let personID = game.config.seats[seatID];
		let person = game.config.congregation[personID];
		let opinion = person.opinions[game.config.chosenTopic];
		if (opinion == 0){
			return 'neutral';
		}
		if ((opinion > 0 && game.config.likeOrDislike == 'like') 
			|| (opinion < 0 && game.config.likeOrDislike == 'dislike')){
			return 'positive';
		}
		return 'negative';
	}

	fetchCaption(seatID){


	}

    print(){
        let rowTxt = '', txt = '';
        for (let i = game.config.numOfSeats - 1; i >= 0;  i --){
            let poop = " id='seat-" + i + "' class='verb1 ";
            if ((i + 1) % Config.numOfSeatsInRow == 0){				
                txt += "<div class='text-center'><span class='me-3'>Row " + ((i + 1) / 10) + "</span>";
            }
            let caption = "<img " + poop + "' src='img/empty.png'>", filled = '';
            if (game.config.seats[i] != null){
                /*filled = this.fetchSeatClass(i);	
                caption = this.fetchDelta(i);
				*/
				caption = "<img " + poop + " seat' src='img/" + this.fetchSeatClass(i) + ".png'>";
            }
			console.log(caption);
            rowTxt = "<div class='cell'>" + caption + "</div>" + rowTxt;
            if ((i + 1) % Config.numOfSeatsInRow == 1){				
                txt += rowTxt + "</div>";
                rowTxt = '';
            }
        }
        $("#nave").html(txt);
    }

}