let start = performance.now();
let i = 0;

var TodoList = React.createClass({
  render: function() {
    var createItem = function(item) {
      return <li key={item.id}>{item.text}</li>;
    };
    return <ul>{this.props.items.map(createItem)}</ul>;
  }
});
var TodoApp = React.createClass({
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
		<div>
			<h3>TODO (react)</h3>
			<input id="input" onChange={this.onChange} value={this.state.text}/>
			<button id="add" onClick={this.handleClick}>Add</button>

			<TodoList items={this.state.items} />
		</div>
    );
  }
});
ReactDOM.render(
  <TodoApp />,
  document.getElementById('content')
);
console.log("first-render", performance.now() - start);
PerformanceTests.create();
