const fs = require('fs');

function CreateDirectory ()
{
    const directory = 'public';
    const subDirectory = 'public/uploads';

    if(!fs.existsSync(directory))
    {
        fs.mkdir(directory, () => {
            console.log('public directory created');
        });
    
        fs.mkdir(subDirectory, () => {
            console.log('uploads sub-directory created');
        });
    }
}

module.exports = {
    CreateDirectory
}