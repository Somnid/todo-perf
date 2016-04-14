var AppView = (function(){

	function create(){
		var appView = {};
		bind(appView);
		appView.init();
		return appView;
	}
	
	function bind(appView){
		appView.cacheDom = cacheDom.bind(appView);
		appView.attachEvents = attachEvents.bind(appView);
		appView.init = init.bind(appView);
		appView.template = template.bind(appView);
		appView.add = add.bind(appView);
	}
	
	function cacheDom(){
		this.dom = {};
		this.dom.add = document.getElementById("add");
		this.dom.input = document.getElementById("input");
		this.dom.list = document.getElementById("list");
		this.dom.itemTmpl = document.getElementById("item-tmpl");
	}
	
	function attachEvents(){
		this.dom.add.addEventListener("click", this.add);
	}
	
	function add(){
		this.model.push({
			name : this.dom.input.value
		});
		this.dom.input.value = "";
	}
	
	function template(){
		this.bndr = Bndr.create()
			.setTemplate(this.dom.itemTmpl)
			.setModel([])
			.bindElement(".name", "name");
		this.model = this.bndr.getBoundModel();
		this.bndr.attachTo(this.dom.list);
	}
	
	function init(){
		this.cacheDom();
		this.attachEvents();
		this.template();
	}
	
	return {
		create : create
	};

})();