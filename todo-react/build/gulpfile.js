var gulp = require("gulp");
var react = require("gulp-react");
var debug = require("gulp-debug");

gulp.task("react", function(){
	gulp.src("../web/jsx/**/*.jsx")
		.pipe(debug({ title : "react" }))
		.pipe(react())
		.pipe(gulp.dest("../web/js"));
});

gulp.task("watch", function(){
	gulp.watch("../web/jsx/**/*.jsx", ["react"]);
});