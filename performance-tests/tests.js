let PerformanceTests = (function(){
	
	const defaults = {
		times : null,
		test : null
	};
	
	function create(options){
		let performanceTests = {};
		performanceTests.options = Object.assign({}, defaults, options);
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
		this.dom.add = document.querySelector("#add");
		this.dom.input = document.querySelector("#input");
		this.dom.list = document.querySelector("#items");
	}

	function fireEvent(element,event){
		var evt = document.createEvent("HTMLEvents");
		evt.initEvent(event, true, true );
		return element.dispatchEvent(evt);
	}
	
	function addTest(i){
		return new Promise((resolve, reject) => {
			let mutationObserver = new MutationObserver((mutations) => {
				mutations.forEach((mutationRecord) => {
					if(mutationRecord.target.childNodes.length > i){
						mutationObserver.disconnect();
						resolve();
					}
				});
			});
			mutationObserver.observe(this.dom.list, { childList : true });

			this.dom.input.value = `test${i}`;
			fireEvent(this.dom.input, "input");
			setTimeout(() => {
				fireEvent(this.dom.add, "click");
			},0);
		});
	}
	
	function* getTestSequence(test, times){
		let i = 0;
		while(i < times){
			yield test(i++);
		}
	}
	
	function startTest(test, times){
		let start = performance.now();
		let sequence = getTestSequence(test, times);
		let result;

		function iterate(){
			result = sequence.next();
			if(!result.done){
				result.value.then(iterate);
			}else{
				console.log("test finished:", performance.now() - start)
			}
		}
		iterate();
	}
	
	function init(){
		let query = new URLSearchParams(window.location.search.substr(1));
		this.options.times = this.options.times || parseInt(query.get("times"));
		this.options.test = this.options.test || parseInt(query.get("test"));
		this.cacheDom();
		
		if(this.options.test === 1){
			startTest(this.addTest, this.options.times);
		}
	}
	
	return {
		create : create
	};
})();