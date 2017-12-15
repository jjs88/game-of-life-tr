var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var pump = require('pump');
var htmlmin = require('gulp-htmlmin');
var csslint = require('gulp-csslint');
var concat = require('gulp-concat');
var htmlreplace = require('gulp-html-replace');
 


//perform linting for css files
gulp.task('css-lint', function() {

  gulp.src('styles/*.css')
    .pipe(csslint())
    .pipe(csslint.formatter());
});



//concat and minify CSS files
gulp.task('minify-css', function() {

  return gulp.src(['styles/normalizer.css', 'styles/style.css'])

    .pipe(concat('styles.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist'));
});



//concat and minify js files
gulp.task('minify-js', function() {

    return gulp.src(['js/game.js', 'js/app.js'])
      .pipe(concat('bundle.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('dist'));
})



gulp.task('minify-html', function() {

  return gulp.src('*.html')

   //change URL here
   .pipe(htmlreplace({
    'css': 'styles.min.css',
    'js': 'bundle.min.js'
   }))

  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('dist'));

});



//combine tasks to run in one
gulp.task('build', ['css-lint','minify-css', 'minify-js', 'minify-html'], function() {
    console.log('Build complete.');
})








