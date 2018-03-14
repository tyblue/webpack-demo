var gulp = require('gulp');
var fileinclude = require("gulp-file-include");

gulp.task("fileinclude",function(){
    gulp.src("./example*.html","!app/**/*.html")
        .pipe(fileinclude({
            prefix:'@@',
            basepath:"@file"
        }))
        .pipe(gulp.dest("dist"))
});
    
gulp.task("default",["fileinclude"]);