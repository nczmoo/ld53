class UIProfile {
    print(personID){
		let fills = ['gender', 'race', 'sexuality', 'affiliation'];
		let txt = '';
		let person = game.config.congregation[personID];
		let seat = ui.formatID(person.seat);
		$("#seating").removeClass('d-none');
		if (person.seat == null){
			$("#seating").addClass('d-none');
		}
		$("#profile-seat").html(seat);
		let cost = Math.abs(person.trust);
		if (cost == 0){
			cost = 1;
		}
		let disabled = '';		
		if (Config.faith < cost){
			disabled = ' disabled ';
		}
		$("#trustButton").html("<button id='trust-" + personID + "' class='verb1 btn btn-outline-success p-1 form-control' " + disabled + ">spent time with them (+1 trust / -" + cost + " Holy Spirity)</button>");
		$("#profile-trust").html(person.trust + "/" + Config.maxTrust );		
		$("#profile-name").html(person.name);		

		for (let fill of fills){
			txt += person[fill] 
			if (fills.indexOf(fill) != fills.length - 1){
				txt += " / ";
			}
			
		}
		$("#profile-demographics").html(txt);
		txt = '';
		for (let i in person.logs){
			let log = person.logs[i];
			txt += "<div>" + log + "</div>";
		}
		$("#profile-log").html(txt);
		txt = '';
		for (let topicID in Topic.list){
			let topic = Topic.list[topicID];
			let opinion = person.opinions[topic];
			if (!person.revealed.includes(topic)){
				continue;
			}
			disabled = '';
			cost = Math.abs(opinion);
			if (cost == 0){
				cost = 1;
			}
			if (Config.faith <  cost){
				disabled = ' disabled ';
			}
			txt += "<button id='influence-" + personID + "-dislike-" + topicID + "' class='verb3 btn btn-outline-danger me-1 ms-2' " + disabled + ">-</button>"
			txt += "<span class=''>" + topic + ": ";				
			let opinionCaption = " 0";
			if (opinion > 0){
				opinionCaption = "<span class='text-success'>+" + opinion + "</span>";
			} else if (opinion < 0){
				opinionCaption = "<span class='text-danger'>" + opinion + "</span>";
			}
			txt += opinionCaption + "</span>";
			txt += "<button id='influence-" + personID + "-like-" + topicID + "' class='verb3 btn btn-outline-success ms-1 me-2' " + disabled + ">+</button>"
		}
		$("#profile-beliefs").html(txt);
	}
}