class Topic {
    static list = [
        'white people', 
        'Hispanic people', 
        'black people', 
        'Asian people', 
        'mixed-raced people', 
        'Native Americans', 
        'other races', 
        'straight people', 
        'asexual people', 
        'gays', 
        'bisexuals', 
        'demisexuals', 
        'men', 
        'women', 
        'intersex people', 
        'nonbinary people', 
        'trans people', 
        'Democrats', 
        'Republicans', 
        'political independents',
        'abortion',
        'gun control',
        'environmentalism',
        'feminism',
        "men's rights",
        'separation of church and state',
        'globalization',
        'automation',
        'climate change',
        'labor unions',
        'drag shows',
        'universal healthcare',
        'prayer in schools',
        'white supremacy',
        'vaccines',
        'COVID 19',
        'marijuana',
        'corporations',
        'nationalism',
        'immigrants',


    ];

    static fetchRand(){
        return this.list[randNum(0, this.list.length - 1)];
    }
}