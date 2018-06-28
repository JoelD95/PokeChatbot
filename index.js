const bodyParser = require('body-parser');
const http = require('http');
const request = require('request');
const hostname = 'http://pokeapi.co/api/v2/'
const path = 'pokemon/bulbasaur/'
const express = require('express');
const server = express();
server.use(bodyParser.json());
server.post('/poke',(req,res)=>{
request(`${hostname}${path}`,(err,resp,body)=> {
    let test = '';
    const poke = JSON.parse(body);
    test = `${poke.name} is a ${poke.types[1].type.name}, ${poke.types[0].type.name} pokemon!`;
    request(`${hostname}ability/${poke.abilities[1].ability.name}`,(err,resp,body)=> {
        const abl= JSON.parse(body);
        let ability= abl.effect_entries[0].short_effect;
        console.log(poke.abilities[1].ability.name)
        return res.json({
            status: test+"special ability:"+poke.abilities[1].ability.name+": "+ability,
        })
    
    })

})
})
server.listen((process.env.PORT || 8000), () => {
    console.log("Server is up and running...");
});