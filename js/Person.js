class Person {
    id = null;
    logs = [];
    delta = 0;
    name = null;
    gender = null;
    quited = false;
    race = null;
    seat = null;
    sexuality = null;
    affiliation = null;
    opinions = {};
    trust = null;    
    static affiliations = {
        democrat: 31,
        republican: 25,
        independent: 41,
    }

    static genders = {
        male: 470,
        female: 500,
        intersex: 20,
        nonbinary: 3,
        trans: 5
    }

    static races = {
        white: 57,
        hispanic: 18,
        black: 12,
        asian: 6,
        mixed: 4,
        native: 1,
        other: 1,
    }
    
    static sexualities = {
        straight: 93,
        asexual: 2,
        gay: 2,
        bisexual: 2,
        demisexual: 1,
    }

    names = {
        first_names: [
          "Avery",
          "Charlie",
          "Jordan",
          "Riley",
          "Taylor",
          "Alex",
          "Hayden",
          "Jamie",
          "Morgan",
          "Casey"
        ],
        surnames: [
          "Smith",
          "Johnson",
          "Williams",
          "Brown",
          "Jones",
          "Garcia",
          "Miller",
          "Davis",
          "Rodriguez",
          "Martinez"
        ]
      }
      constructor(id){    
        this.id = id;
        this.trust = randNum(1, Config.maxTrust);
        let demographics = ['races', 'genders', 'affiliations', 'sexualities'];
        this.name =  this.names.first_names[randNum(0, this.names.first_names.length - 1)] 
            + " " + this.names.surnames[randNum(0, this.names.first_names.length - 1)];
        //console.log(this.name);
        for (let demo of demographics){                                    
            this[Config.singular[demo]] = this.parseAndPop(Person[demo])
        }
       
        for (let topic of Topic.list){
            let identify = false;
            for (let demo of demographics){                  
                let identity = this[Config.singular[demo]];
                if (topic == 'white supremacy'){
                    continue;
                }
                if (topic.toLowerCase().includes(identity)                    
                    || ((topic == 'men' && identity == 'male' )
                    || (topic == 'women' && identity == 'female' ))){
                    identify = true;
                    //console.log(topic, identity);
                }
            }
            let randBoost = 0;
            if (identify){
                randBoost = randNum(1, Config.maxTrust);
            }
            
            let posNeutNeg = randNum(1, 3);
            if (posNeutNeg == 2){
                this.opinions[topic] = 0 + randBoost;
                continue;
            }
            if (posNeutNeg == 1){
                this.opinions[topic] = randNum(-1, -Config.maxTrust) + randBoost;
                continue;
            }
            this.opinions[topic] = randNum(1, Config.maxTrust) + randBoost;
                    
        }
        //console.log('');
      }

      agree(topic, row){
        let caption = '', delta = randNum(0, Math.abs(this.opinions[topic]) +  row);
        this.trust += delta;
        this.delta += delta;
        if (delta > 0){
            caption = " They trust you more now! (+" + delta + ")";
        }
        this.narrate(this.fetchName() + " <span class='text-success'>agrees</span> with you about " + topic + "." + caption);
        this.doubleDown(topic);

      }

      disagree(topic, row){
        let caption = '', delta = randNum(0, Math.abs(this.opinions[topic]) + row);
        this.trust -= delta;
        this.delta -= delta;
        if (delta > 0){
            caption = " They trust you less now! (-" + delta + ")";
        }
        this.narrate(this.fetchName() + " <span class='text-danger'>disagrees</span> with you about " + topic + "." + caption);
        let rand = randNum(0, Math.abs(this.trust));
        let trustBroken = rand >= Config.maxTrust;
        if (this.trust < 0 && trustBroken){
            
            this.quit();
            this.narrate("This was the final straw for " + this.fetchName() + ". They get up and leave.");
        }
      }

      doubleDown(topic){
        let opinion = this.opinions[topic];
        let rand = randNum(0, this.trust);
        if (rand <= Math.abs(opinion)){
            return;
        }
        this.narrate(this.fetchName() + " believe even more " + this.fetchOptionCaption(opinion) + " about " + topic + " now!");
        if (opinion > 0){
            this.opinions[topic]++;
            return;
        }
        this.opinions[topic] --;
      }

      fetchName (){
        let txt = "<button id='person-" + this.id + "' class='btn btn-link verb1'>" + this.name + "</button>"
        if (!this.quited){
            txt += " (seat #" + this.seat + ") ";
        }
        return txt;
      }

      fetchOptionCaption(n){
        if (n > 0) {
            return "<span class='text-success'>positively</span>";
        }
        if (n < 0){
            return "<span class='text-danger'>negatively</span>";
        }
      }

      hears(topic, likeOrDislike){
        let opinion = this.opinions[topic];     
        let n = {dislike: -1, like: 1 }    
        let modifier = Config.activeRows - Math.ceil((this.seat + 1 )/ Config.numOfSeatsInRow) + 1;
        if (opinion == 0){
            let rand = randNum(1, 3);
            if (rand == 1){
                this.narrate(this.fetchName()  
                    + " was neutral, but your passion swayed them into thinking " 
                    + this.fetchOptionCaption(n[likeOrDislike]) + " about " + topic + " from now on.");
                this.influence(topic, likeOrDislike);
                
            }
            return;
        }
        if ((opinion > 0 && likeOrDislike == 'like') || (opinion < 0 && likeOrDislike == 'dislike')){
            this.agree(topic, modifier);
            return;
        }
        this.disagree(topic, modifier);
      }

      influence(topic, likeOrDislike){
        if (likeOrDislike == 'like'){
            this.opinions[topic] ++;
            return;
        }   
        this.opinions[topic] --;
      }

      leave(){
        this.seat = null;
      }
      
      narrate(msg){
        this.logs.unshift(msg);
        ui.log(msg);
      }

      parseAndPop(obj){
        let total = 0, sums = {};
        for (let name in obj){
            let n = obj[name];
            total += n;
            sums[name] = total;            
        }
        let rand = randNum(1, total);

        for (let name in sums){
            let n = sums[name];
            if (rand > n){
                continue;
            }            
            return name;
        }   
      }

      quit(){
        this.quited = true;
      }

      reset(){
        this.delta = 0;
      }

      sit(seatID){        
        if (this.seat != null){
            this.narrate(this.fetchName() + " changes seat from seat #" + this.seat + " to seat #" + seatID);
        }
        this.seat = seatID;
      }

      
}   