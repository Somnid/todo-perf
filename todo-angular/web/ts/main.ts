import {Component} from '../js/lib/angular2.core.js';
import {bootstrap} from '../js/lib/angular2.platform.browser.js';

@Component({
  selector: 'todo-form',
  template: `
      <input type="text" [(ngModel)]="task" size="30"
             placeholder="add new todo here">
      <button id="add" value="add">`
})
export class TodoForm {
  @Output() newTask = new EventEmitter<Todo>();
  task: string = '';
  addTodo() {
    if (this.task) {
      this.newTask.next({text:this.task, done:false});
    }
    this.task = '';
  }
}

@Component({
  selector: 'todo-list',
  template: `
    <ul>
      <li *ngFor="#todo of todos">{{todo.text}}</li>
    </ul>`
})
export class TodoList {
  @Input() todos: Todo[];
}

@Component({
  selector: 'todo-app',
  template: `
    <h3>Todo (react)</h3>
    <todo-list [todos]="todos"></todo-list>
    <todo-form (newTask)="addTask($event)"></todo-form>`,
  styles:['a { cursor: pointer; cursor: hand; }'],
  directives: [TodoList, TodoForm]
})
export class TodoApp {
  todos: Todo[] = [
      {text: 'learn angular',        done: true},
      {text: 'build an angular app', done: false}
  ];
  get remaining() {
    return this.todos.filter(todo => !todo.done).length;
  }
  archive(): void {
    let oldTodos = this.todos;
    this.todos = [];
    oldTodos.forEach(todo => {
      if (!todo.done) { this.todos.push(todo); }
    });
  }
  addTask(task: Todo) {
    this.todos.push(task);
  }
}

bootstrap(TodoApp);