const express = require('express');
const path = require('path');
const fs = require('fs');
const manageDirectory = require('./manageDirectory');
const multerWork = require('./multerWork');
const app = express();
const { exec } = require("child_process");


manageDirectory.CreateDirectory();

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/download', function (req, res) {
    const command = `(for %i in (public/uploads/*.png) do @echo file 'public/uploads/%i') > mylist.txt`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
        } else {
            const output = 'mylist.txt';
            res.download(output, (error) => {
                if (error) {
                    throw error;
                }
            })
        }
    });
    
})

app.post('/downloadVideoes', function (req, res) {
    const dir = 'public/uploads/'
    let filenames = fs.readdirSync(dir);
  
    let fileData = '\n';
    filenames.forEach((file) => {
        if (file.includes('.mp4')) {
            fileData = fileData + 'file public/uploads/' + file + '\n';
        }
    });

    fs.writeFile('mylist.txt', fileData, function (err) {
        if (err) throw err;
        console.log('newFile is created successfully.');
        const output = 'output.mp4';
        const command = `ffmpeg -f concat -i mylist.txt -c copy output.mp4`

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            } else {
                res.download(output, (error) => {
                    if (error) {
                        throw error;
                    }
                    
                    fs.unlink(output, err => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                          console.log("Output deleted");
                        }
                      });
                })
            }
        });
    });
    
})

app.post('/upload',multerWork.upload.single('imageFile'), function (req, res) {
    console.log(req.file.path);
    res.sendFile(path.join(__dirname, 'index.html'))
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`app is listening on port: ${PORT}`);
})