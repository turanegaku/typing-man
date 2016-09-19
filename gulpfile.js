const gulp = require('gulp');

gulp.task('lib', ['js', 'css', 'fonts']);

gulp.task('js', () => {
    gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/jquery.easing/jquery.easing.min.js',
        'node_modules/moment/min/moment.min.js'
    ])
    .pipe(gulp.dest('static/js'));
});
