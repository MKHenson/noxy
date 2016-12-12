const util = require( 'util' )
const fs = require( 'fs' )
const exec = require( 'child_process' ).exec;
const child;

const prevTag = "v0.1.2";
const nextTag = "v0.2.2";


// Executes the git log command
child = exec( 'git log ' + prevTag + '...' + nextTag + ' --pretty=format:"{ \\"author\\" : \\"%an\\", \\"commit\\" : \\"%h\\", \\"date\\" : \\"%ar\\", \\"title\\" : \\"%s\\" },"', function( error, stdout, stderr ) {

    const jsonStr = "{ \"data\" : [ " + stdout.toString();
    jsonStr = jsonStr.substr( 0, jsonStr.length - 1 ) + " ] } ";

    try {
        const json = JSON.parse( jsonStr );
        json = json.data;

        console.log( "Parsed JSON" )

        const changes = "";
        for ( let i = 0, l = json.length; i < l; i++ )
            changes += `* ${json[ i ].title} - see ${json[ i ].commit} \n`;

        try {
            fs.writeFile( 'changes.md', changes, function( err ) {
                if ( err )
                    throw err;
                console.log( 'It\'s saved!' );
            });
        }
        catch ( err ) {
            console.log( 'Could not write file:  ' + err );
        }
    }
    catch ( err ) {
        console.log( 'Could not parse JSON:  ' + err );
        console.log( 'JSON STRING: ' + jsonStr );
    }


    if ( error !== null ) {
        console.log( 'exec error: ' + error );
    }
});