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
    if(req.body.queryResult.parameters.choice.id === 'undefined'){
        link=req.body.queryResult.parameters.choice.pokemon
    }
    else
    link=req.body.queryResult.parameters.choice.id
request(`${hostname}${path}${link}/`,(err,resp,body)=> {
    let test = '';
    const poke = JSON.parse(body);
    test = `${poke.name} is a ${poke.types[1].type.name}, ${poke.types[0].type.name} pokemon!`;
    request(`${hostname}ability/${poke.abilities[1].ability.name}`,(err,resp,body)=> {
        const abl= JSON.parse(body);
        let ability= abl.effect_entries[0].short_effect;
        console.log(poke.abilities[1].ability.name)
        return res.json({
            speech: test+"special ability:"+poke.abilities[1].ability.name+": "+ability,
            displayText: test+"special ability:"+poke.abilities[1].ability.name+": "+ability,
            source: 'poke'
        })
    
    })

})
})
server.listen((process.env.PORT || 8000), () => {
    console.log("Server is up and running...");
});