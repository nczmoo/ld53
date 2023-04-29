class Config {
    static activeRows = 0;  
    chosenTopic = null; 
    initParishSize = 10;   
    likeOrDislike = 'like';
    
    leaving = 0;
    static maxTrust = 3;
    maxTurns = 5;
    numOfRows = 10;
    static numOfSeatsInRow = 10;
    numOfSeats = 0;
    numOfTopics = 3;
    parishSize = 0;
    prevTopics = [];
    congregation = [];
    seats = [];    
    sermonNum = 1;
    sermonTopics = [];
    turns = 0;
    static singular = {races: 'race', sexualities: 'sexuality', genders: 'gender', affiliations: 'affiliation'}
	constructor(){
        this.numOfSeats = this.numOfRows * Config.numOfSeatsInRow;
        
        this.addToCongregation(this.initParishSize);
        this.fetchSermonTopics();
        this.assignSeats();
    }

    addToCongregation(num){
        this.parishSize += num;
        for (let i = 0; i < num; i ++){                                    
            this.congregation.push(new Person(this.congregation.length));            
        }        
    }

    assignSeats(){
        let trustDivider = this.numOfSeats / this.parishSize;
        if (Config.activeRows <= this.numOfRows && Config.maxTrust > Config.activeRows){
            Config.activeRows = Config.maxTrust;
        }
        this.resetSeats();
        for (let personID in this.congregation){
            let person = this.congregation[personID];            
            if (person.quited){
                continue;
            }
            let row = Math.round(Config.activeRows + 1 - person.trust / Config.maxTrust * Config.activeRows);
            let seatID = this.fetchRandSeatInRow(row);
            person.sit(seatID);
            this.seats[seatID] = personID;
        }
    }



    checkIfQuit(){
        let leaving = [];
        for (let personID in this.congregation){
            let person = this.congregation[personID];            
            if (person.quited ){                
                this.seats[person.seat] = null;
                person.leave();
                leaving.push(personID);
            }
        }
        if (leaving.length < 1){
            return;
        }
        let caption = "person";
        if (leaving.length > 1){
            caption = "people";
        }
        let txt = leaving.length + " " + caption + " (";
        for (let personID of leaving){
            let person = this.congregation[personID];
            txt += person.fetchName() + ", ";
            
        }
        txt += ") left.";
        this.leaving += leaving.length;
        ui.log(txt);
    }

    endSermon(){
        let txt = "";
        for (let topic of this.prevTopics){
            txt += topic + ",  ";
        }
        
        ui.log("You finished a sermon. (" + txt + ")"); 
        let high = null, growing = [];
        for (let personID in this.congregation){
            let person = this.congregation[personID];
            person.reset();
            if (person.quited || person.trust <= Config.maxTrust){
                continue;
            }
            growing.push(personID);
            high = person.trust;
        }
        Config.maxTrust += high;
        let growthCaption = '', leavingCaption = '';
        if (growing.length > 0){
            this.addToCongregation(growing.length);
            growthCaption = growing.length + " " + ui.fetchPplCaption(growing.length) 
            + " told you they were bringing a friend next time they come. ";
        }
        if (this.leaving > 0){
            leavingCaption = this.leaving + " " 
                + ui.fetchPplCaption(this.leaving) 
                + " left. (maybe call them to ask them to come back...)";
            this.parishSize -= this.leaving;
        }
        ui.log(growthCaption + leavingCaption);
        this.turns = 0;
        this.sermonNum ++;
        this.leaving = 0;
        this.prevTopics = [];
        this.fetchSermonTopics();
        this.assignSeats();
        console.log(Config.maxTrust);
    }

    expressOpinion(){
        ui.resetMenu();
        let caption = ' negatively ';
        let txtClass = ' text-danger ';
        if (this.likeOrDislike == 'like'){
            caption = ' positively ';
            txtClass = ' text-success ';
        }
        let msg = "You speak <span class='fw-bold " + txtClass + "'>" + caption + "</span> about <span class='fw-bold'>" + this.chosenTopic + "</span> in your sermon.";
		for (let i in this.congregation){
            let person = this.congregation[i];
            person.hears(this.chosenTopic, this.likeOrDislike);
            person.logs.unshift(msg);
        }
        this.checkIfQuit();
        ui.log(msg);
        
        this.prevTopics.push(this.chosenTopic);
        this.chosenTopic = null;
        this.likeOrDislike = 'like';
        ui.polarizing = false;
        this.fetchSermonTopics();
        $("#menu").removeClass('d-none');
        $("#polarMenu").addClass('d-none');
        this.turns ++ ;
        if (this.turns >= this.maxTurns){
            this.endSermon();
        }
	}

    fetchRandSeat(){
        while(1){
            let rand = randNum(0, this.numOfSeats - 1);
            if (this.seats[rand] != null){
                continue;
            }
            return rand;
        }
    }


    fetchRandSeatInRow(row){        
        let generated = [];
        if (row == null){
            return this.fetchRandSeat();
        }
        while (1){
            let rand = randNum((row -1 ) * 10, (row * Config.numOfSeatsInRow) - 1);
            if (generated.length == Config.numOfSeatsInRow){
                return this.fetchRandSeat();
            }
            if (!generated.includes(rand)){
                generated.push(rand);
            }
            if (this.seats[rand] != null){            
                continue;
            }
            return rand;
        }
    }


    fetchSermonTopics(){
        this.sermonTopics = [];
        for (let i = 0; i < this.numOfTopics; i ++){
            while(1){
                let rand = Topic.fetchRand();
                if (this.sermonTopics.includes(rand) || this.prevTopics.includes(rand)){
                    continue;
                }
                this.sermonTopics.push(rand);
                break;
            }
        }
    }

    fetchRandomEmptySeat(row){

    }


    pickTopic(sermonTopicID){        
        this.chosenTopic = this.sermonTopics[sermonTopicID];
    }

    resetSeats(){
        for (let i = 0; i < this.numOfSeats; i ++){
            this.seats[i] = null;
        }
    }
}