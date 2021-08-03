const fs = require('fs');
const { exec } = require("child_process");

async function createTextFile (res) {
    const dir = 'public/uploads/';

    let filenames = fs.readdirSync(dir);
  
    let fileData = '\n';

    if (!filenames.length)
    {
        console.log('folder is empty');
    }
    else 
    {
        filenames.forEach
        (
            (file) =>
            {
                if (file.includes('.mp4'))
                {
                    fileData = fileData + 'file public/uploads/' + file + '\n';
                }
            }
        );

        fs.writeFile
        (
            'mylist.txt',
            fileData,
            function (err)
            {
                if (err)
                {
                    console.log(err);
                }
                else
                {
                    console.log('text file created successfully.');
                    createOutputMp4File(res);
                }
            }
        );
    }
}

function createOutputMp4File (res) {
    const output = 'output.mp4';
    const command = `ffmpeg -f concat -i mylist.txt -c copy output.mp4`

    exec
    (
        command,
        function (error, stdout, stderr)
        {
            if (error)
            {
                console.log(`error: ${error.message}`);
            }
            else
            {
                res.download
                (
                    output,
                    function (error)
                    {
                        if (error)
                        {
                            console.log(error);
                        }
                        else
                        {
                            deleteOutputMp4();
                        }
                    }
                )
            }
    });
}

function deleteOutputMp4 () {
    const output = 'output.mp4';

    fs.unlink
    (
        output,
        function (err) 
        {
            if (err)
            {
                console.log(err);
            }
            else
            {
                console.log("Output.mp4 deleted");
            }
        }
    )
}

function joinAndDownloadVideo (res) {
    createTextFile(res);
}

module.exports = {
    joinAndDownloadVideo
}