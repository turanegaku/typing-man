const gulp = require('gulp');
const sass = require('gulp-sass');

const paths = {
    'sass_src': './sass/**/*.scss',
    'sass_dst': './public/stylesheets',
    'lib_dst': './static/js',
};

gulp.task('lib', () => {
    gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/jquery.cookie/jquery.cookie.js',
        'node_modules/jquery.easing/jquery.easing.min.js',
        'node_modules/moment/min/moment.min.js'
    ])
    .pipe(gulp.dest(paths.lib_dst));
});

gulp.task('sass', () => {
    return gulp.src(paths.sass_src)
    .pipe(sass({'outputStyle': 'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest(paths.sass_dst));
});

gulp.task('sass:watch', () => {
    gulp.watch(paths.sass_src, ['sass']);
});
