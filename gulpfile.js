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

gulp.task('build-css', function () {
    var fileName = projectName;
    return gulp.src('./src/styles/*')
        .pipe(plugins.plumber({ errorHandler: onError }))
        .pipe(sass())
        .pipe(plugins.concat(fileName+'.css'))
        .pipe(gulp.dest('./dist'))
        .pipe(plugins.cleanCss())
        .pipe(plugins.rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./dist'));
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

gulp.task('copy-global-d3', function () {
    return gulp.src("./src/d3_global.js")
        .pipe(plugins.rename({
            basename: "d3"
        }))
        .pipe(gulp.dest('./src/'))
});


gulp.task('do-build-js', gulp.series('copy-global-d3', function () {

    return buildJs(projectName, "dist")

}));

gulp.task('build-js', gulp.series('do-build-js', function () {
    return gulp.src("./src/d3_import.js")
        .pipe(plugins.rename({
            basename: "d3"
        }))
        .pipe(gulp.dest('./src/'))
}));

gulp.task('build-js-standalone', function () {
    return buildJs(projectName, "dist/standalone");
});

function buildJs(jsFileName, dest) {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/index.js'],
        cache: {},
        packageCache: {},
        standalone: 'ODCD3'
    })

        .transform("babelify", browserifyTransforms['babelify'])
        .bundle()
        .on('error', map_error)
        .pipe(plugins.plumber({ errorHandler: onError }))
        .pipe(source(jsFileName+'.js'))
        .pipe(gulp.dest(dest))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(plugins.stripDebug())
        .pipe(plugins.uglify())
        .pipe(plugins.rename({ extname: '.min.js' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dest));
}

gulp.task('build', gulp.parallel('build-css', 'build-js'));

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

    this.emit('end');
}