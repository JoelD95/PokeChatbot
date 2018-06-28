const bodyParser = require('body-parser');
const http = require('http');
const request = require('request');
const hostname = 'http://pokeapi.co/api/v2/'
const path = 'pokemon/'
const express = require('express');
const server = express();


server.use(bodyParser.json());
server.post('/poke',(req,res)=>{
    if(req.body.queryResult.action==="pokemon.pokemon-custom"){
    let link='';
    if(req.body.queryResult.outputContexts[0].parameters.choice.number !== undefined){
        link=req.body.queryResult.outputContexts[0].parameters.choice.number;
    }
   else if (req.body.queryResult.outputContexts[0].parameters.choice !== ''){
        link=req.body.queryResult.outputContexts[0].parameters.choice;
    }
    request(`${hostname}${path}${link}/`,(err,resp,body)=> {
    let test = '';
    let type2 = '';
    const poke = JSON.parse(body);
    if((poke.types).length === 1){
        console.log((poke.types).length)
        test = `${poke.name} is a ${poke.types[0].type.name} pokemon!`;
    }
    else {test = `${poke.name} is a ${poke.types[1].type.name}, ${poke.types[0].type.name} pokemon!`;}
    if(req.body.queryResult.action ==="pokemon.pokemon-custom"){
        console.log("$$$$$$$$$$$$$$$")
    request(`${hostname}ability/${poke.abilities[1].ability.name}`,(err,resp,body)=> {
        const abl= JSON.parse(body);
        let ability= abl.effect_entries[0].short_effect;
        console.log(poke.abilities[1].ability.name)
        return res.json({
            fulfillmentText: test+"special ability:"+poke.abilities[1].ability.name+": "+ability+" What would like to know about "+ poke.name+"? Currently, i can give you some moves it can use.",
            source: 'poke'
        })
    
    })}
    else if(req.body.queryResult.action === "pokemon.pokemon-custom.getPokemon-custom.getPokemonMoves-custom"){
        console.log("%%%%5")
        let moveNumber =req.body.queryResult.parameters.number;
        let move = '';
        move =`move number ${moveNumber} is ${poke.moves[moveNumber-1].move.name}`
        request(`${hostname}move/${poke.moves[moveNumber-1].move.name}`,(err,resp,body)=>{
            const power= JSON.parse(body);
            const chance= power.effect_chance;
            const effect= (power.effect_entries[0].short_effect).replace("$effect_chance%",chance+"%");
            if(power.effect_chance === undefined){
            return res.json({
                fulfillmentText: `Move number ${moveNumber} is ${poke.moves[moveNumber-1].move.name}. ${poke.moves[moveNumber-1].move.name} ${power.effect_entries[0].short_effect} If you would like to learn about other moves this pokemon can use please enter another number, other wise enter no.`,
                source: 'poke'
            })}
            else{
                return res.json({
                    fulfillmentText: `Move number ${moveNumber} is ${poke.moves[moveNumber-1].move.name}. ${poke.moves[moveNumber-1].move.name} ${effect} If you would like to learn about other moves this pokemon can use please enter another number, other wise enter no.`,
                    source: 'poke'
                })
            }
        })
    }
    })}
    else if(req.body.queryResult.action === "location.location-custom"){
            console.log("*****")
            let locationNumber =req.body.queryResult.parameters.number;
            request(`${hostname}location-area/${locationNumber}/`,(err,resp,body)=>{
                const loc= JSON.parse(body);
                return res.json({
                    fulfillmentText: `${loc.name} is the location with that id. Some of the pokemon that can be caught here are ${loc.pokemon_encounters[0].pokemon.name}, ${loc.pokemon_encounters[1].pokemon.name}, ${loc.pokemon_encounters[2].pokemon.name}, and ${loc.pokemon_encounters[3].pokemon.name}. You can encounter pokemon in this area by ${loc.encounter_method_rates[0].encounter_method.name}ing. Although other methods such as fishing could be possible keep a lookout! If you would like to get information about another area please enter a number between 1-500.`,
                    source: 'poke'
                })
            })
        
    }
    //else if(req.body.queryResult.action === "location.location-custom")
})
server.listen((process.env.PORT || 8000), () => {
    console.log("Server is up and running...");
});