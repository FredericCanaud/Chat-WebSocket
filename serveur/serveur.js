

const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

///////// Mise en place de l'application ////////////////////

const app = express();
const server = http.createServer(app);

server.listen(8080, function listening() {
    console.log('En écoute sur le port %d', server.address().port);
});


app.use(express.static('../client'));

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
    const location = url.parse(req.url, true);


    ws.on('message', function incoming(data) {

        const emetteur = url.parse(req.url, true).query.pseudo

        console.log('Nouveau message de %s : %s', emetteur, data);

        wss.clients.forEach(function each(client) {

            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({emetteur: emetteur, texte: data}));
            }
        });
    });
});
