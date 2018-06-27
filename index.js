'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const API_KEY = require('./apiKey');

const server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use(bodyParser.json());

server.post('/poke', (req, res) => {

   // const movieToSearch = req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.movie ? req.body.queryResult.parameters.movie : 'The Godfather';
   if(req.body.queryResult.action ==='pokemon.pokemon-custom'){
    const pokemon= req.body.queryResult.parameters.choice;
    const reqUrl = encodeURI(`http://pokeapi.co/api/v2/pokemon/${pokemon}`);
    http.get(reqUrl, (responseFromAPI) => {
        let completeResponse = '';
        responseFromAPI.on('data', (chunk) => {
            completeResponse += chunk;
        });
        responseFromAPI.on('end', () => {
            const pokemonChoice = JSON.parse(completeResponse);
            let dataToSend = pokemon === 'Pikachu' ? `I don't have the required info on that. Here's some info on Pikachu instead.\n` : '';
            dataToSend += `${poke.name} is a ${poke.types.type} pokemon.`;

            return res.json({
                speech: dataToSend,
                displayText: dataToSend,
                source: 'poke'
            });
        });
    }, (error) => {
        return res.json({
            speech: 'Something went wrong!',
            displayText: 'Something went wrong!',
            source: 'poke'
        });
    });
   }
});

server.listen((process.env.PORT || 8000), () => {
    console.log("Server is up and running...");
});