var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('styles', function () {
  return gulp.src('./sass/*.scss')
      .pipe(sass())
      .pipe(gulp.dest('./public/styles/css'));
});

gulp.task('watch_styles', function () {
  gulp.watch('./public/styles/**/*.css', ['styles']);
  gulp.watch('./public/scripts/**/*.js', notifyLiveReload);
});

function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

var tinylr;
gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
  tinylr.listen(35729);
});


gulp.task('default', ['styles','watch_styles']);