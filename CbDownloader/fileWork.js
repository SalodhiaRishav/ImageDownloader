var fetch = require('fetch');
var fs = require('fs');
var path = require('path');
const http = require('http');
const fetchs = require("node-fetch");



const storedfileNames = [];
let saveFileTimer;

const dir = 'public/uploads/';

function insertFileWithNames (name, res) {
    const url = "https://chaturbate.com/get_edge_hls_url_ajax/";

    const headers = {
        "content-type": "multipart/form-data; boundary=----WebKitFormBoundary",
        "x-requested-with": "XMLHttpRequest",
    };

    const body = "------WebKitFormBoundary\r\nContent-Disposition: form-data; name=\"room_slug\"\r\n\r\n" + name + "\r\n------WebKitFormBoundary\r\nContent-Disposition: form-data; name=\"bandwidth\"\r\n\r\nhigh\r\n";

    const method = "POST";

    const options = {
        headers: headers,
        body: body,
        method: method
    };

    fetchs(url, options)
    .catch(error => {
        res.send(error.toString());
        console.log(error.toString());
    })
    .then(res => res.json())
    .then(json => {
        if (json.url === '')
        {
            console.log('offline user');
            res.send('offline user');
        }
        else
        {
            getStreamResolutions(name, json.url, res)
        }
    })
}

function getStreamResolutions (name, playListUrl, res) {
    fetch.fetchUrl(playListUrl, function (err, meta, body) {
        if (err)
        {
            console.log('Error fetching url:' + playListUrl);
            res.send('Error fetching url: ' + playListUrl)
        }
        else
        {
            if (!body)
            {
                res.send('some error in getStreamResolutions body')
                console.log('some error try some error in getStreamResolutions body')
            }
            else
            {
                const bodyString = body.toString();
    
                if (!bodyString)
                {
                    res.send('error in getStreamResolutions body.toString(), maybe user offline or private')
                    console.log('error in getStreamResolutions body.toString(), maybe user offline or private');
                }
                else
                {
                    let re = /chunklist.*/g;
                    var result = [...bodyString.matchAll(re)];
                    const fileUrl = playListUrl.replace('playlist.m3u8', result[1][0]);
                    const regX = /(.*)chunklist(.*).m3u8/;
                    const match = fileUrl.match(regX);
                    const baseAddress = match[1];
                    const mediaAddress = baseAddress + 'media' + match[2];

                    saveFileTimer = setInterval(() => {
                        loopInsertFileWithNames(name, fileUrl, mediaAddress)
                    }, 2000);

                    res.redirect('/')
                }
            }
        }
    })
}

async function stopFetchingFiles (res) {
    closeTimer();
    res.redirect('/')
}

function closeTimer () {
    if (saveFileTimer) {
        clearInterval(saveFileTimer);
        console.log('Stopped timer successfully');
    }
}

function loopInsertFileWithNames(name, uri, mediaAddress) {
    fetch.fetchUrl(uri, function (err, meta, body) {
        if (err)
        {
            console.log('Error fetching url:', uri);
            closeTimer();
        }
        else
        {
            if (!body)
            {
                console.log('some error try some error in loopInsertFileWithNames body');
                closeTimer();
            }
            else
            {
                const bodyString = body.toString();

                if (!bodyString)
                {
                    console.log('error in loopInsertFileWithNames body.toString(), maybe user offline or private');
                    closeTimer();
                }
                else
                {
                    var re = /_(\d*).ts/g;
                    var result = [...bodyString.matchAll(re)];
                   
                    for(let i=0;i < result.length; ++i) {
                        storeFileStream(name, mediaAddress, result[i][0]);
                    }
                } 
            }
        }
    })
}

function storeFileStream (name, mediaAddress, fileName) {
    const fileNameToStore = name + fileName.replace('.ts', '');

    if (storedfileNames.indexOf(fileNameToStore) === -1)
    {
        storedfileNames.push(fileNameToStore);

        const url = mediaAddress + fileName;

        const dest = dir + fileNameToStore + '.mp4';

        var file = fs.createWriteStream(dest);

        new fetch.FetchStream(url).pipe(file);
        
        file.on('finish', function() {
            console.log(fileNameToStore + ' file inserted successfully')
            file.close();
        });
    }
}

module.exports = {
    insertFileWithNames,
    stopFetchingFiles
}