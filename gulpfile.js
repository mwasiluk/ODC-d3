var fs = require('fs');
var stream = require('stream');
var gulp = require('gulp');
var del = require('del');
var merge = require('merge-stream');
var plugins = require('gulp-load-plugins')();
var sass = require('gulp-sass')(require('sass'));
var browserSync = require('browser-sync').create();

var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
/* nicer browserify errors */
var gutil = require('gulp-util');
var chalk = require('chalk');

var p = require('./package.json')
var projectName= p.name

const browserifyTransforms = p.browserify.transform.reduce((acc, curr) => (acc[curr[0]] = curr[1], acc), {});

gulp.task('clean', function (cb) {
    return del(['tmp', 'dist'], cb);
});

gulp.task('build-css', function (done) {
    var fileName = projectName;
    stream.pipeline(
        gulp.src('./src/styles/*'),
        sass(),
        plugins.concat(fileName+'.css'),
        gulp.dest('./dist'),
        plugins.cleanCss(),
        plugins.rename({ extname: '.min.css' }),
        gulp.dest('./dist'),
        done
    );
});

gulp.task('build-js2', function () {
    var jsFileName =  projectName;
   return gulp.src('./src/*.js')
        .pipe(plugins.plumber({ errorHandler: onError }))
         .pipe(plugins.babel({
           presets: ['es2015']
         }))
        .pipe(plugins.concat(jsFileName+'.js'))
        .pipe(gulp.dest('dist'))
        .pipe(plugins.stripDebug())
        .pipe(plugins.uglify())
        .pipe(plugins.rename({ extname: '.min.js' }))
        .pipe(gulp.dest('dist'));
});

// src/d3.js holds the global variant from copy-global-d3 until restoreImportD3()
var d3Swapped = false;

function restoreImportD3() {
    if (d3Swapped) {
        fs.copyFileSync('./src/d3_import.js', './src/d3.js');
        d3Swapped = false;
    }
}

// Last resort when the process exits while src/d3.js is swapped, e.g. gulp-cli
// calling process.exit(1) after another task given on the command line failed.
// Not reached on signals (SIGINT/SIGTERM), see BASELINE §8.2.
process.on('exit', restoreImportD3);

gulp.task('copy-global-d3', function () {
    d3Swapped = true;
    return gulp.src("./src/d3_global.js")
        .pipe(plugins.rename({
            basename: "d3"
        }))
        .pipe(gulp.dest('./src/'))
});


gulp.task('do-build-js', gulp.series('copy-global-d3', function (done) {

    buildJs(projectName, "dist", function (err) {
        // also on error: gulp.series would skip a separate restore step
        restoreImportD3();
        done(err);
    });

}));

gulp.task('build-js', gulp.series('do-build-js'));

gulp.task('build-js-standalone', function (done) {
    buildJs(projectName, "dist/standalone", done);
});

// stream.pipeline passes an error of any stage to done and destroys the other
// stages, so a failed compile fails the task and nothing after it runs.
function buildJs(jsFileName, dest, done) {
    var bundle = browserify({
        basedir: '.',
        debug: true,
        entries: ['src/index.js'],
        cache: {},
        packageCache: {},
        standalone: 'ODCD3'
    })

        .transform("babelify", browserifyTransforms['babelify'])
        .bundle();

    stream.pipeline(
        bundle,
        source(jsFileName+'.js'),
        gulp.dest(dest),
        buffer(),
        sourcemaps.init({loadMaps: true}),
        plugins.stripDebug(),
        plugins.uglify(),
        plugins.rename({ extname: '.min.js' }),
        sourcemaps.write('./'),
        gulp.dest(dest),
        function (err) {
            if (err) {
                map_error(err);
            }
            done(err);
        }
    );
}

// Like gulp.parallel, but waits for every task before reporting the first
// error. gulp.parallel reports at once and gulp-cli exits while the other
// tasks may still be writing dist/ or have src/d3.js swapped.
function parallelSettled() {
    var tasks = Array.prototype.slice.call(arguments);
    var fn = function (done) {
        var pending = tasks.length;
        var error = null;
        tasks.forEach(function (task) {
            gulp.series(task)(function (err) {
                error = error || err;
                if (--pending === 0) {
                    done(error);
                }
            });
        });
    };
    fn.displayName = '<parallel-settled>';
    return fn;
}

gulp.task('build', parallelSettled('build-css', 'build-js'));

gulp.task('build-clean', gulp.series('clean', 'build'));



gulp.task('watch', function() {
    return gulp.watch(['./src/**/*.html', './src/styles/*.*css', 'src/**/*.js' , "!src/d3.js"], ['default']);
});

gulp.task('default', gulp.series('build-clean', 'build-js-standalone'));

gulp.task('default-watch', gulp.series('default', ()=>{ browserSync.reload() }));
gulp.task('serve', gulp.series('default', ()=>{
    browserSync.init({
        server: {
            baseDir: "examples",
            index: "index.html",
            routes: {
                "/bower_components": "bower_components",
                "/dist": "dist"
            }
        },
        port: 8089,
        open: 'local',
        browser: "google chrome"
    });
    gulp.watch(['i18n/**/*.json', './src/**/*.html', './src/styles/*.*css', 'src/**/*.js', "!src/d3.js", 'examples/**/*.*'], ['default-watch']);
}));


// error function for plumber
var onError = function (err) {
    console.log('onError', err);
    this.emit('end');
};


function map_error(err) {
    if (err.fileName) {
        // regular error
        gutil.log(chalk.red(err.name)
            + ': '
            + chalk.yellow(err.fileName.replace(__dirname + '/src/js/', ''))
            + ': '
            + 'Line '
            + chalk.magenta(err.lineNumber)
            + ' & '
            + 'Column '
            + chalk.magenta(err.columnNumber || err.column)
            + ': '
            + chalk.blue(err.description))
    } else {
        // browserify error..
        gutil.log(chalk.red(err))
    }
}