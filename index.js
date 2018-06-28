const bodyParser = require('body-parser');
const http = require('http');
const request = require('request');
const hostname = 'http://pokeapi.co/api/v2/'
const path = 'pokemon/'
const express = require('express');
const server = express();


server.use(bodyParser.json());
server.post('/poke',(req,res)=>{
    let link='';
    if(req.body.queryResult.parameters.choice.number !== 'undefined'){
        link=req.body.queryResult.parameters.choice.number;
    }
   else if (req.body.queryResult.parameters.choice.pokemon !== 'undefined'){
        link=req.body.queryResult.parameters.choice.pokemon;
    }
    if (req.body.queryResult.parameters.choice.number === 'undefined' && req.body.queryResult.parameters.choice.pokemon === 'undefined'){
        link=req.body.queryResult.parameters.choice
    };
request(`${hostname}${path}${link}/`,(err,resp,body)=> {
    let test = '';
    let type2 = '';
    const poke = JSON.parse(body);
    if((poke.types).length === 1){
        console.log((poke.types).length)
        test = `${poke.name} is a ${poke.types[0].type.name} pokemon!`;
    }
    else {test = `${poke.name} is a ${poke.types[1].type.name}, ${poke.types[0].type.name} pokemon!`;}
    request(`${hostname}ability/${poke.abilities[1].ability.name}`,(err,resp,body)=> {
        const abl= JSON.parse(body);
        let ability= abl.effect_entries[0].short_effect;
        console.log(poke.abilities[1].ability.name)
        return res.json({
            fulfillmentText: test+"special ability:"+poke.abilities[1].ability.name+": "+ability+" What would like to know about "+ poke.name+"? i can give you some moves it can use or tell you the evolutions.",
            source: 'poke'
        })
    
    })

})
})
server.listen((process.env.PORT || 8000), () => {
    console.log("Server is up and running...");
});