    class ConfigSermon {
    checkIfQuit(){
        let leaving = [];
        for (let personID in game.config.congregation){
            let person = game.config.congregation[personID];            
            if (person.quited && person.seat != null){                
                game.config.seats[person.seat] = null;
                person.leave();
                leaving.push(personID);

            }
        }
        if (leaving.length < 1){
            return;
        }
        game.config.parishSize -= leaving.length;
        let caption = ui.fetchPplCaption(leaving.length);
        let txt = "<span class='fw-bold fs-4'>" + leaving.length + " " + caption + " (";
        for (let personID of leaving){
            let person = game.config.congregation[personID];
            txt += person.config.fetchName(person.id, person.name, person.quited, person.seat);
            if (leaving.indexOf(personID) !=  leaving.length - 1){
                txt += ", ";
            }
        }
        txt += ") left.</span>";
        game.config.leaving += leaving.length;
        ui.log(txt);        
    }

    deliver(){
        $("#topicLogs").html('');
        ui.turnLogs = [];
        ui.resetMenu();
        let caption = ' negatively ';
        let txtClass = ' text-danger ';
        if (game.config.likeOrDislike == 'like'){
            caption = ' positively ';
            txtClass = ' text-success ';
        }
        let msg = "You speak <span class='fw-bold " + txtClass + "'>" + caption + "</span> about <span class='fw-bold'>" + game.config.chosenTopic + "</span> in your sermon.";
		for (let i in game.config.congregation){            
            let person = game.config.congregation[i];
            if (person.quited){
                continue;
            }
            person.hears(game.config.chosenTopic, game.config.likeOrDislike);
            person.logs.unshift(msg);
        }
        this.checkIfQuit();
        ui.topicLogs[game.config.chosenTopic].unshift("Sermon #" + Config.sermonNum + ": " + msg);
        ui.log(msg);
        
        game.config.prevTopics.push(game.config.chosenTopic);
        game.config.chosenTopic = null;
        game.config.likeOrDislike = 'like';
        ui.polarizing = false;
        game.config.fetchSermonTopics();
        $("#menu").removeClass('d-none');
        $("#polarMenu").addClass('d-none');
        game.config.turns ++ ;
        if (game.config.turns >= game.config.maxTurns){
            this.end();
        } 
        if (game.config.parishSize < 1){
            alert("Everyone left your church. GAME OVER!!");
            location.reload();
        }
	}

    end(){
        let txt = "";
        for (let topic of game.config.prevTopics){
            txt += topic + ",  ";
        }                
        let high = 0, growing = [], lostInterest = 0;
        for (let personID in game.config.congregation){
            let person = game.config.congregation[personID];
            if (!person.quited && person.trust < 0){
                person.leave();
                person.quit();                             
                lostInterest++;
            }
            if (!person.quited && person.inviting){
                growing.push(personID);            
            }
            person.reset();
            if (person.quited || person.trust <= Config.maxTrust){
                continue;
            }
            if (person.trust > high){
                high = person.trust;
            }
            
        }
        if (high > Config.maxTrust){
            Config.maxTrust = high;
        }
        let growthCaption = '', leavingCaption = '', lostCaption = '';
        if (growing.length > 0){
            
            growthCaption = growing.length + " " + ui.fetchPplCaption(growing.length) 
            + " people told you they were bringing a friend next time they come. ";
        }
        if (game.config.leaving > 0){
            leavingCaption = game.config.leaving + " " 
                + ui.fetchPplCaption(game.config.leaving) 
                + " left because you offended them.  ";
        }
        if (lostInterest > 0){
            lostCaption = lostInterest + " " + ui.fetchPplCaption(lostInterest)  + " looks like they might not be coming back... ";
        }
        let msg = "You finished sermon #" + Config.sermonNum + " to " + game.config.parishSize + "  people. ";
        ui.log(msg + growthCaption + leavingCaption + lostCaption);
        if (growing.length > 0){
            game.config.addToCongregation(growing.length);
        }
        game.config.parishSize -= lostInterest;

        game.config.turns = 0;
        Config.sermonNum ++;
        game.config.leaving = 0;
        game.config.prevTopics = [];
        game.config.fetchSermonTopics();
        if (game.config.parishSize >= game.config.numOfSeats){
            alert("You filled your church to maximum occupancy. You won!!");
            if (game.config.parishSize > game.config.numOfSeats){
                game.config.parishSize = game.config.numOfSeats;
            }
            location.reload();
        } else {
            game.config.assignSeats();
        }
    }

    

    pickTopic(sermonTopicID){        
        game.config.chosenTopic = game.config.sermonTopics[sermonTopicID];
        ui.printTopicLogs(game.config.chosenTopic);
    }
}