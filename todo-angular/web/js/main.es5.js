var TodoForm = ng
	.core.Component({
		selector: "todo-form",
		template :  `
			<input id="input" [(ngModel)]="task">
			<button id="add" (click)="addTodo()">Add</button>`,
		outputs : [
			"newTask"
		]
	})
	.Class({
		constructor : function(){
			this.newTask = new ng.core.EventEmitter();
			this.task = "";
		},
		addTodo : function (){
			if(this.task) {
				this.newTask.next({text:this.task, done:false});
			}
			this.task = '';
		}
	});

var TodoList = ng
	.core.Component({
		selector: 'todo-list',
		template: `
			<ul id="items">
			<li *ngFor="#todo of todos">{{todo.text}}</li>
			</ul>`,
		inputs : [
			"todos"
		]
	})
	.Class({
		constructor : function(){
			this.todos = [];
		}
	});

var TodoApp = ng
	.core.Component({
	  selector: 'todo-app',
	  template: `
		<h3>TODO (angular2)</h3>
		<todo-form (newTask)="addTask($event)"></todo-form>
		<todo-list [todos]="todos"></todo-list>`,
	  directives: [TodoList, TodoForm]
	})
	.Class({
		constructor : function(){
			this.todos = [];
		},
		remaining : function() {
			return this.todos.filter(todo => !todo.done).length;
		},
		archive : function(){
			let oldTodos = this.todos;
			this.todos = [];
			oldTodos.forEach(todo => {
				if (!todo.done) { this.todos.push(todo); }
			});
		},
		addTask : function(task) {
			this.todos.push(task);
		}
	});
	
let start = performance.now();
document.addEventListener('DOMContentLoaded', function () {
	ng.platform.browser.bootstrap(TodoApp);
  	console.log("first-render", performance.now() - start);
	setTimeout(PerformanceTests.create, 0);
});