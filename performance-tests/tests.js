let PerformanceTests = (function(){
	
	function create(){
		let performanceTests = {};
		bind(performanceTests);
		performanceTests.init();
		return performanceTests;
	}
	
	function bind(performanceTests){
		performanceTests.init = init.bind(performanceTests);
		performanceTests.cacheDom = cacheDom.bind(performanceTests);
		performanceTests.addTest = addTest.bind(performanceTests);
	}
	
	function cacheDom(){
		this.dom = {};
		this.dom.add = document.getElementById("add");
		this.dom.input = document.getElementById("input");
	}

	function fireEvent(element,event){
		var evt = document.createEvent("HTMLEvents");
		evt.initEvent(event, true, true );
		return element.dispatchEvent(evt);
	}
	
	function addTest(i){
		input.value = `test${i}`;
		fireEvent(input, "input");
		fireEvent(add, "click");
	}
	
	function startTest(test){
		var start = performance.now();
		for(let i = 0; i < 1000; i++){
			test(i);
		}
		console.log(performance.now() - start);
	}
	
	function init(){
		this.cacheDom();
		startTest(this.addTest);
	}
	
	return {
		create : create
	};
})();