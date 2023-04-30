class Config {
    static activeRows = 0;  
    chosenTopic = null; 
    static faith = 0;
    initParishSize = 10;   
    likeOrDislike = 'like';
    
    leaving = 0;
    static maxTrust = 3;
    maxTurns = 5;
    numOfRows = 9;
    static numOfSeatsInRow = 10;
    numOfSeats = 0;
    numOfTopics = 3;
    parishSize = 0;
    prevTopics = [];
    congregation = [];
    seats = [];    
    sermon = new ConfigSermon();
    static sermonNum = 1;
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
        if (Config.activeRows <= this.numOfRows && Config.maxTrust > Config.activeRows){
            Config.activeRows = Config.maxTrust;
            if (Config.activeRows > this.numOfRows){
                Config.activeRows = this.numOfRows;
            }
        }
        this.resetSeats();
        for (let personID in this.congregation){
            let person = this.congregation[personID];            
            if (person.quited){
                continue;
            }
            let row = Math.round(Config.activeRows + 1 - person.trust / Config.maxTrust * Config.activeRows);            
            if (person.trust < 0 || person.trust == 0 ){
                row = Config.activeRows;
            }
            if (row > this.numOfRows){
                row = this.numOfRows;
            }
            let seatID = this.fetchRandSeatInRow(row);
            
            person.sit(seatID);
            this.seats[seatID] = personID;
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

    resetSeats(){
        for (let i = 0; i < this.numOfSeats; i ++){
            this.seats[i] = null;
        }
    }
}