var gulp = require('gulp');
var ts = require('gulp-typescript');
var fs = require('fs');

var tsConfig = JSON.parse(fs.readFileSync('tsconfig.json'));

/**
 * Checks to see that all TS files listed exist
 */
gulp.task('check-files', function(){

    // Make sure the files exist
    for (var i = 0, l = tsConfig.files.length; i < l; i++ )
        if(!fs.existsSync(tsConfig.files[i]))
        {
            console.log("File does not exist:" + tsConfig.files[i] );
            process.exit();
        }
})

/**
 * Builds each of the ts files into JS files in the output folder
 */
gulp.task('ts-code', ['check-files'], function() {

    return gulp.src(tsConfig.files, { base: "src/" })
        .pipe(ts({
            "module": tsConfig.compilerOptions.module,
            "removeComments": tsConfig.compilerOptions.removeComments,
            "noEmitOnError": tsConfig.compilerOptions.noEmitOnError,
            "declaration": tsConfig.compilerOptions.declaration,
            "sourceMap": tsConfig.compilerOptions.sourceMap,
            "preserveConstEnums": tsConfig.compilerOptions.preserveConstEnums,
            "target": tsConfig.compilerOptions.target,
            "noImplicitAny": tsConfig.compilerOptions.noImplicitAny
            }))
        .pipe(gulp.dest(tsConfig.compilerOptions.outDir));
});

gulp.task('build-all', ['ts-code']);