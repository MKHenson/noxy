var gulp = require( 'gulp' );
var ts = require( 'gulp-typescript' );
var fs = require( 'fs' );
var utils = require( './gulp/utils.js' );

const tsProject = ts.createProject( 'tsconfig.json' );
var tsConfig = JSON.parse( fs.readFileSync( 'tsconfig.json' ) );

const configFiles = [
    './readme.md',
    './install-script.sh',
    './src/dist-files/package.json',
    './package.json'
];

/**
 * Builds each of the ts files into JS files in the output folder
 */
gulp.task( 'ts-code', function() {
    var tsResult = tsProject.src()
        .pipe( tsProject() );

    return tsResult.js.pipe( gulp.dest( './dist' ) );
});

/**
 * Copies the distribution files from src to the dist folder
 */
gulp.task( 'dist-files', function() {
    return gulp.src( [ 'src/dist-files/*.json' ], { base: 'src/dist-files/' })
        .pipe( gulp.dest( './dist' ) );
});

gulp.task( 'bump-patch', function() { return utils.bumpVersion( utils.bumpPatchNum, configFiles ) });
gulp.task( 'bump-minor', function() { return utils.bumpVersion( utils.bumpMidNum, configFiles ) });
gulp.task( 'bump-major', function() { return utils.bumpVersion( utils.bumpMajorNum, configFiles ) });
gulp.task( 'build', [ 'ts-code', 'dist-files' ] );