class Person {
    config = new PersonConfig();
    avg = null;
    attended = 1;
    id = null;
    inviting = false;
    logs = [];
    delta = 0;
    name = null;
    gender = null;
    quited = false;
    race = null;
    revealed = [];
    seat = null;
    sexuality = null;
    affiliation = null;
    opinions = {};
    trust = null;    
    
      constructor(id){    
        let demographics = ['races', 'genders', 'affiliations', 'sexualities'];

        this.id = id;
        this.trust = randNum(1, Config.maxTrust);
        this.name =  this.config.names.first_names[randNum(0, this.config.names.first_names.length - 1)] 
            + " " + this.config.names.surnames[randNum(0, this.config.names.surnames.length - 1)];
        //console.log(this.name);
        for (let demo of demographics){                                    
            this[Config.singular[demo]] = this.config.parseAndPop(PersonConfig[demo])
        }
        let sum = 0;
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
            let split = 3;
            let posNeutNeg = randNum(1, (split * 2) + 1 );
            split ++;
            if (posNeutNeg == split){
                this.opinions[topic] = 0 + randBoost;
                continue;
            }
            if (posNeutNeg < split){
                this.opinions[topic] = randNum(-1, -Config.maxTrust) + randBoost;
                continue;
            }
            this.opinions[topic] = randNum(1, Config.maxTrust) + randBoost;
            sum += Math.abs(this.opinions[topic]);
        }
        this.avg = Math.round(sum / Topic.list.length);
        if (this.avg == 0){
          this.avg = 1;
        }
        //console.log(this.avg);
        //console.log('');
      }

      agree(topic, row){
        let min = 0, max = Config.activeRows - row + this.attended; // add 1 if you removed this.attended
        if (min > max){
          min = max - 1;
        }
        let caption = '', delta = randNum(min, max);
        this.changeTrust(delta);
        if (delta > 0){
            caption = " They trust you more now! (+" + delta + ") ";
        }
        let msg = this.config.fetchName(this.id, this.name, this.quited, this.seat) + " <span class='text-success'>agrees</span> with you about " + topic + ". " + caption + this.doubleDown(topic);
        ui.topicLogs[topic].unshift("Sermon #" + Config.sermonNum + ": " + msg);
        this.narrate(msg);
        ;

      }

      changeTrust(delta){
        this.trust += delta;
        this.delta += delta;
        if (this.trust > Config.maxTrust){
          this.inviting = true;
        }
      }

      disagree(topic, row){
        let min = 0, max = ((Config.activeRows + 1 - row) * 3) - this.attended;
        if (max < 2){
          max = 1;
        }
        let caption = '', delta = randNum(min, max);
        this.changeTrust(-delta);
        if (delta > 0){
            caption = " They trust you less now! (-" + delta + ")";
        }
        let msg = this.config.fetchName(this.id, this.name, this.quited, this.seat)  + " <span class='text-danger'>disagrees</span> with you about " + topic + "." + caption;
        ui.topicLogs[topic].unshift("Sermon #" + Config.sermonNum + ": " + msg);
        this.narrate(msg);
        let rand = randNum(0, Math.abs(this.trust));
        let trustBroken = rand >= Config.maxTrust;
        if (this.trust < 0 && trustBroken){
            
            this.quit();
            this.narrate("<span class='fw-bold fs-3'>This was the final straw for " + this.config.fetchName(this.id, this.name, this.quited, this.seat)  + ". They get up and leave.</span>");
        }
      }

      doubleDown(topic){
        let opinion = this.opinions[topic];
        let rand = randNum(0, this.trust);
        if (rand <= Math.abs(opinion)){
            return '';
        }
        let msg = " They believe even more " + this.config.fetchOptionCaption(opinion) + " about " + topic + " now!";
        if (opinion > 0){
            this.opinions[topic]++;
            return msg;
        }
        this.opinions[topic] --;
        return msg;
      }



      hears(topic, likeOrDislike){
        if (!this.revealed.includes(topic)){
          this.revealed.push(topic);
        }
        let opinion = this.opinions[topic];     
        let n = {dislike: -1, like: 1 }    
        let modifier = Config.activeRows - Math.ceil((this.seat + 1 )/ Config.numOfSeatsInRow) + 1;
        if (opinion == 0){
            let rand = randNum(1, 3);
            if (rand == 1){
                this.narrate(this.config.fetchName(this.id, this.name, this.quited, this.seat)   
                    + " was neutral, but your passion swayed them into thinking " 
                    + this.config.fetchOptionCaption(n[likeOrDislike]) + " about " + topic + " from now on.");
                this.influence(topic, likeOrDislike, true);
                
            }
            return;
        }
        if ((opinion > 0 && likeOrDislike == 'like') || (opinion < 0 && likeOrDislike == 'dislike')){
            this.agree(topic, modifier);
            return;
        }
        this.disagree(topic, modifier);
      }

      influence(topic, likeOrDislike, natural){
        if (natural){
          Config.faith++;
        }
        if (likeOrDislike == 'like'){
            this.opinions[topic] ++;
            return;
        }   
        this.opinions[topic] --;
      }

      leave(){
        this.seat = null;

      }

      likesYou(){
        this.trust++; 
      }
      
      narrate(msg){
        this.logs.unshift(msg);
        ui.log(msg);
      }

      quit(){
        this.quited = true;
        
      }

      reset(){
        this.delta = 0;
        this.attended++;
        this.inviting = false;
      }

      sit(seatID){        
        this.seat = seatID;
      }

      
}   