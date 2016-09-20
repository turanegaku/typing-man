const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('lib', ['js', 'css', 'fonts']);

gulp.task('js', () => {
    gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/jquery.easing/jquery.easing.min.js',
        'node_modules/moment/min/moment.min.js'
    ])
    .pipe(gulp.dest('static/js'));
});

gulp.task('sass', () => {
    return gulp.src('./sass/**/*.scss')
    .pipe(sass({'outputStyle': 'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('sass:watch', () => {
    gulp.watch('./sass/**/*.scss', ['sass']);
});
