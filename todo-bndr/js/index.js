let start = performance.now();
document.addEventListener("DOMContentLoaded", function(){
	AppView.create();
	console.log("first-render", performance.now() - start);
	PerformanceTests.create();
}, true);