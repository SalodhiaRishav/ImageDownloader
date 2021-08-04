const express = require('express');
const bodyParser = require("body-parser");
const joinAndDownloadVideo = require ('./Video/downloadVideoes').joinAndDownloadVideo;
const deleteVideoes = require('./Video/deleteVideoes').deleteVideoes;
const readVideoes = require('./Video/tsVideoes').readVideoes;
const mongoConnect = require('./CbDownloader/fileWork');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/downloadVideoes', function (req, res) {
    joinAndDownloadVideo(res);
})

app.post('/deleteVideoes', function (req, res) {
    deleteVideoes();
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/fetchVideoes', function (req, res) {
    mongoConnect.insertFileWithNames(req.body.modelName, res);
})

app.post('/stopfetching', function (req, res) {
    mongoConnect.stopFetchingFiles(res).catch(console.error)
})

app.post('/download', function (req, res) {
    readVideoes(res);
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`app is listening on port: ${PORT}`);
})