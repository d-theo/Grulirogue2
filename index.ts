import { Game } from "./game/game";

const express = require('express');
const app = express();
const server = require('http').Server(app);
const path = require('path');

app.use(express.static('../' + __dirname + '/ui'));

app.get('/', (req:any, res:any) => {
    const index = path.resolve(`${__dirname}/../ui/index.html`);
    res.sendFile(index);
})

server.listen(8081, () => {
    console.log('server up and running on 8081');
});