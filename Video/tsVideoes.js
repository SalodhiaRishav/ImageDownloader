const fs = require('fs');
const {zip} = require('zip-a-folder');

async function readVideoes (res) {
    const dir = 'public/uploads/';
    const output = 'output.zip';

    await zip(dir, output);
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
                deleteOutputZip()
            }
        }
    )
}

function deleteOutputZip () {
    const output = 'output.zip';

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
                console.log("Output.zip deleted");
            }
        }
    )
}
module.exports = {
    readVideoes
}