const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
var browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
// const cssFiles = [
//     './src/css/main.css',
//     './src/css/test.css'
// ];

const cssFiles = [
    './src/scss/main.scss',
    './src/scss/test.scss'
];
const jsFiles = [
    './src/js/lib.js',
    './src/js/main.js'
];


gulp.task('imgSquash', () => {
    return gulp
        .src('./src/img/*')
        .pipe(imagemin())
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ])).pipe(gulp.dest("./build/img"));
});
gulp.task('styles', () => {
    console.log("styles")
    return gulp.src(cssFiles)
        .pipe(sass())
        // Кокатанация файлов css
        .pipe(concat('style.css'))
        // Авто префиксер
        .pipe(autoprefixer({
            cascade: false
        }))
        // Минификация сss
        .pipe(cleanCSS({ level: 2 }))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
});
gulp.task('scripts', () => {
    console.log("scripts")
    return gulp.src(jsFiles)
        .pipe(concat('script.js'))
        .pipe(uglify({ toplevel: true }))
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream());
});


gulp.task('clean', () => {
    return del(['build/*'])
});


gulp.task('watch', () => {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    //Отслеживать файлы по этому пути 
    // gulp.watch('./src/css/**/*css', styles);
    gulp.watch("./src/img/*", gulp.series('imgSquash'))
    gulp.watch('./src/scss/**/*.scss', gulp.series('styles'));
    gulp.watch('./src/js/**/*.js', gulp.series('scripts'));
    gulp.watch("./*.html").on('change', browserSync.reload);

});
gulp.task('build', gulp.series('clean', gulp.parallel('styles', 'scripts', 'imgSquash')));
gulp.task('dev', gulp.series('build', 'watch'));