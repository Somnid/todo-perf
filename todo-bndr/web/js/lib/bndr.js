var Bndr = (function(){

	var defaults = {
		template : null,
		bindings : [],
		model : {}
	};

	function create(options){
		var bndr = {};
		bndr.options = Object.assign({}, defaults, options);
		bind(bndr);
		bndr.init();
		return bndr;
	}

	function bind(bndr){
		bndr.init = init.bind(bndr);
		bndr.attachTo = attachTo.bind(bndr);
		bndr.remove = remove.bind(bndr);
		bndr.updateBinding = updateBinding.bind(bndr);
		bndr.updateElement = updateElement.bind(bndr);
		bndr.updateAttribute = updateAttribute.bind(bndr);
		bndr.updateStyle = updateStyle.bind(bndr);
		bndr.setTemplate = setTemplate.bind(bndr);
		bndr.setModel = setModel.bind(bndr);
		bndr.onPropertySet = onPropertySet.bind(bndr);
		bndr.triggerUpdate = triggerUpdate.bind(bndr);
		bndr.getBoundModel = getBoundModel.bind(bndr);
		bndr.query = query.bind(bndr);

		bndr.setListModel = setListModel.bind(bndr);
		bndr.setListTemplate = setListTemplate.bind(bndr);
		bndr.attachListTo = attachListTo.bind(bndr);
		bndr.onPush = onPush.bind(bndr);
		bndr.onPop = onPop.bind(bndr);
		bndr.pushArrayElement = pushArrayElement.bind(bndr);
		bndr.popArrayElement = popArrayElement.bind(bndr);

		bndr.bindElement = bindElement.bind(bndr);
		bndr.bindStyle = bindStyle.bind(bndr);
		bndr.bindAttribute = bindAttribute.bind(bndr);
	}

	function attachTo(element){
		if(Array.isArray(this.model.model)){
			this.attachListTo(element);
		}else{
			this.updateBinding(this.model.bindings);
			if(this.model.domRoot){
				element.appendChild(this.model.domRoot);
			}
		}
		this.model.attachment = element;
		return this;
	}

	function attachListTo(element){
		this.model.bndrs.forEach(x => x.attachTo(element));
	}

	function remove(){
		this.model.elements.forEach(x => x.parentNode.removeChild(x));
	}

	function updateBinding(bindings){
		[].concat(bindings).forEach(binding => {
			var elements = queryElementsInList(this.model.elements, binding.selector);

			if(binding.type == "element"){
				this.updateElement(elements, binding.accessor);
			}else if(binding.type == "style"){
				this.updateStyle(elements, binding.accessor, binding.style);
			}else if(binding.type == "attribute"){
				this.updateAttribute(elements, binding.accessor, binding.attribute);
			}
		});
	}

	function updateElement(elements, accessor){
		var value = traverseObjectProps(this.model.model, accessor);
		[].concat(elements).forEach(x => setElement(x, value));
	}

	function updateStyle(elements, accessor, style){
		var value = traverseObjectProps(this.model.model, accessor);
		[].concat(elements).forEach(x => setStyle(x, style, value));
	}

	function updateAttribute(elements, accessor, attribute){
		var value = traverseObjectProps(this.model.model, accessor);
		[].concat(elements).forEach(x => setAttribute(x, attribute, value));
	}

	function bindElement(selector, accessor){
		this.model.bindings.push({
			accessor : accessor,
			selector : selector,
			type : "element"
		});
		return this;
	}

	function bindStyle(selector, accessor, style){
		this.model.bindings.push({
			accessor : accessor,
			selector : selector,
			style : style,
			type : "style"
		});
		return this;
	}

	function bindAttribute(selector, accessor, attribute){
		this.model.bindings.push({
			accessor : accessor,
			selector : selector,
			attribute : attribute,
			type : "attribute"
		});
		return this;
	}

	function setTemplate(template){
		if(Array.isArray(this.model.model)){
			this.setListTemplate(template);
		}else{
			this.model.template = template;
			this.model.domRoot = getTemplate(template);
			this.model.elements = getDocfragChildList(this.model.domRoot);
			this.updateBinding(this.model.bindings);
		}

		if(this.model.attachment){
			this.attachTo(this.model.attachment);
		}

		return this;
	}

	function setListTemplate(template){
		this.model.bndrs.forEach(x => x.setTemplate(template));
	}

	function setModel(model){
		if(Array.isArray(model)){
			model = this.setListModel(model);
		}
		this.model.model = new Proxy(model, {
			set : this.onPropertySet
		});
		this.updateBinding(this.model.bindings);

		return this;
	}

	function setListModel(listModel){
		this.model.bndrs = [];
		listModel.forEach(x => {
			this.model.bndrs.push(create({
				model : x,
				template : this.model.template,
				bindings : this.model.bindings
			}));
		});
		listProxy = this.model.bndrs.map(x => x.getBoundModel());
		listProxy.push = new Proxy(listProxy.push, {
			apply : this.onPush
		});
		listProxy.pop = new Proxy(listProxy.pop, {
			apply : this.onPop
		});
		return listProxy;
		}

	function getBoundModel(){
		return this.model.model;
	}

	function query(selector){
		return queryElementsInList(this.elements, selector);
	}

	function onPropertySet(model, propertyName, newValue){
		if(model[propertyName] !== newValue){
			if(Array.isArray(model) && isNumber(propertyName) && propertyName < model.length){ //array element
				newValue = this.model.bndrs[propertyName].setModel(value).getBoundModel();
			}
			Reflect.set(model, propertyName, newValue);
			this.triggerUpdate(propertyName);
		}
		return true;
	}

	function onPush(target, thisArgument, argumentList){
		var model = this.pushArrayElement(argumentList[0]);
		Reflect.apply(target, thisArgument, [model]);
	}

	function onPop(target, thisArgument, argumentList){
		var model = this.popArrayElement(argumentList[0]);
		Reflect.apply(target, thisArgument, [model]);
	}

	function pushArrayElement(value){
		var bndr = create({
		model : value,
		template : this.model.template,
		bindings : this.model.bindings
	});
		this.model.bndrs.push(bndr);
		model = bndr.getBoundModel();
		if(this.model.attachment){
			bndr.attachTo(this.model.attachment);
		}
		return model;
	}

	function popArrayElement(){
		var model = this.model.bndrs.pop();
		model.remove();
	}

	function triggerUpdate(propertyName){
		var bindings = this.model.bindings.filter(x => getTopLevelProperty(x.accessor) == propertyName);
		this.updateBinding(bindings);
	}

	function init(){
		this.model = {};
		this.model.bindings = this.options.bindings;
		this.model.attachment = null;
		this.setTemplate(this.options.template);
		this.setModel(this.options.model);
	}

	//Static Methods
	function getTemplate(templateElement){
		if(!templateElement){
			return null;
		}
		if(templateElement.tagName == "TEMPLATE"){
			return document.importNode(templateElement.content, true);
		}
		return templateElement;
	}

	function getDocfragChildList(docfrag){
		if(!docfrag){
			return [];
		}
		var list = [];
		for(var i = 0; i < docfrag.children.length; i++){
			list.push(docfrag.children[i]);
		}
		return list;
	}

	function boolOrDefault(value, defaultValue){
		if(value == "boolean"){
			return value;
		}else if(!value){
			return defaultValue;
		}
		return true;
	}

	function isNumber(value) {
		return !isNaN(value-0) && value !== null && value !== "" && value !== false;
	}

	function getTopLevelProperty(accessor){
		if(accessor.includes(".")){
			return accessor.split(".")[0];
		}
		return accessor;
	}

	function traverseObjectProps(obj, accessor){
		if(!obj){
			return null;
		}

		var keys = accessor.split(".");
		var prop = obj;
		for(var i = 0; i < keys.length; i++){
			if(keys[i] !== undefined){
				if(prop[keys[i]] !== undefined){
					prop = prop[keys[i]];
				}else{
					return null;
				}
			}
		}
		return prop;
	}

	function queryElementsInList(elements, selector){
		var matchingElements = [];

		if(!elements){
			return [];
		}

		for(var i = 0; i < elements.length; i++){
			var foundElements = elements[i].parentNode.querySelectorAll(selector); //need parent because this can include self
			if(foundElements.length > 0){
				for(var j = 0; j < foundElements.length; j++){
					if(isAncestorOrSelf(elements[i], foundElements[j])){ //check that we didn't find on some unrelated branch off parent
						matchingElements.push(foundElements[j]);
					}
				}
			}
		}
		return matchingElements;
	}

	function isAncestorOrSelf(thisNode, nodeToTest){
		while(thisNode != nodeToTest){
			if(nodeToTest.parentNode){
				nodeToTest = nodeToTest.parentNode;
			}else{
				return false;
			}
		}
		return true;
	}

	function setElement(element, value){
		var elementType =  element.tagName.toUpperCase();

		if(elementType == "INPUT" || elementType == "SELECT" || elementType == "TEXTAREA"){
			if(element.type.toUpperCase() == "CHECKBOX"){
				element.checked = value;
			}else{
				element.value = value;
			}
		}else{
			element.textContent = value;
		}
	}

	function setStyle(element, style, value){
		element.style[style] = value;
	}

	function setAttribute(element, attribute, value){
		element.setAttribute(attribute, value);
	}

	return {
		create: create
	};

})();