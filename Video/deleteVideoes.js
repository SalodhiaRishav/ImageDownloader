const path = require('path');
const fs = require('fs');

function deleteVideoes () {
    const dir = 'public/uploads/';

    fs.readdir(dir, (err, files) => {
        if (err)
        {
            console.log(err);
        } 
        else
        {
            for (const file of files)
            {
                fs.unlink(path.join(dir, file), err => {
                    if (err) console.log(err);
                });
            }
            console.log('folder empty');
        }
    });
}

module.exports = {
    deleteVideoes
}