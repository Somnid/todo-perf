let i = 0;

var TodoList = React.createClass({displayName: "TodoList",
  render: function() {
    var createItem = function(item) {
      return React.createElement("li", {key: item.id}, item.text);
    };
    return React.createElement("ul", {id: "items"}, this.props.items.map(createItem));
  }
});
var TodoApp = React.createClass({displayName: "TodoApp",
  getInitialState: function() {
    return {items: [], text: ''};
  },
  onChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleClick: function(e) {
    e.preventDefault();
    this.state.items.push({text: this.state.text, id: i++});
    var nextText = '';
    this.setState({items: this.state.items, text: nextText});
  },
  render: function() {
    return (
		React.createElement("div", null, 
			React.createElement("h3", null, "TODO (react)"), 
			React.createElement("input", {id: "input", onChange: this.onChange, value: this.state.text}), 
			React.createElement("button", {id: "add", onClick: this.handleClick}, "Add"), 

			React.createElement(TodoList, {items: this.state.items})
		)
    );
  }
});

let start = performance.now();
document.addEventListener("DOMContentLoaded", function(){
	ReactDOM.render(
	  React.createElement(TodoApp, null),
	  document.getElementById('content')
	);
	console.log("first-render", performance.now() - start);
	PerformanceTests.create();
});
