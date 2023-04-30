class PersonConfig {
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
          "Bailey",
          "Cameron",
          "Casey",
          "Charlie",
          "Dakota",
          "Devin",
          "Drew",
          "Emerson",
          "Finley",
          "Harper",
          "Hayden",
          "Jaden",
          "Jayden",
          "Jordan",
          "Kai",
          "Kendall",
          "Leighton",
          "Logan",
          "Morgan",
          "Parker",
          "Peyton",
          "Phoenix",
          "Quinn",
          "Reese",
          "Riley",
          "Rowan",
          "Ryan",
          "Sage",
          "Sawyer",
          "Skyler",
          "Spencer",
          "Tatum",
          "Taylor",
          "Toby",
          "Tyler",
          "Vivian",
          "Ashton",
          "Alex",
          "Alexis",
          "Ali",
          "Ariel",
          "August",
          "Brook",
          "Cory",
          "Darian",
          "Devon",
          "Elliot",
          "Ezra",
          "Jesse"
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

      fetchName (id, name, quited, seat){
        let txt = "<a href='#' id='person-" + id + "' class='verb1'>" + name + "</a>"
        if (!quited){
            txt += " (seat #" + ui.formatID(seat) + ") ";
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
}