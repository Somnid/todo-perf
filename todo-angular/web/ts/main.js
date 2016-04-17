System.register(['../js/lib/angular2.core.js', '../js/lib/angular2.platform.browser.js'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var angular2_core_js_1, angular2_platform_browser_js_1;
    var TodoForm, TodoList, TodoApp;
    return {
        setters:[
            function (angular2_core_js_1_1) {
                angular2_core_js_1 = angular2_core_js_1_1;
            },
            function (angular2_platform_browser_js_1_1) {
                angular2_platform_browser_js_1 = angular2_platform_browser_js_1_1;
            }],
        execute: function() {
            TodoForm = (function () {
                function TodoForm() {
                    this.newTask = new EventEmitter();
                    this.task = '';
                }
                TodoForm.prototype.addTodo = function () {
                    if (this.task) {
                        this.newTask.next({ text: this.task, done: false });
                    }
                    this.task = '';
                };
                __decorate([
                    Output(), 
                    __metadata('design:type', Object)
                ], TodoForm.prototype, "newTask", void 0);
                TodoForm = __decorate([
                    angular2_core_js_1.Component({
                        selector: 'todo-form',
                        template: "\n      <input type=\"text\" [(ngModel)]=\"task\" size=\"30\"\n             placeholder=\"add new todo here\">\n      <button id=\"add\" value=\"add\">"
                    }), 
                    __metadata('design:paramtypes', [])
                ], TodoForm);
                return TodoForm;
            }());
            exports_1("TodoForm", TodoForm);
            TodoList = (function () {
                function TodoList() {
                }
                __decorate([
                    Input(), 
                    __metadata('design:type', Array)
                ], TodoList.prototype, "todos", void 0);
                TodoList = __decorate([
                    angular2_core_js_1.Component({
                        selector: 'todo-list',
                        template: "\n    <ul>\n      <li *ngFor=\"#todo of todos\">{{todo.text}}</li>\n    </ul>"
                    }), 
                    __metadata('design:paramtypes', [])
                ], TodoList);
                return TodoList;
            }());
            exports_1("TodoList", TodoList);
            TodoApp = (function () {
                function TodoApp() {
                    this.todos = [
                        { text: 'learn angular', done: true },
                        { text: 'build an angular app', done: false }
                    ];
                }
                Object.defineProperty(TodoApp.prototype, "remaining", {
                    get: function () {
                        return this.todos.filter(function (todo) { return !todo.done; }).length;
                    },
                    enumerable: true,
                    configurable: true
                });
                TodoApp.prototype.archive = function () {
                    var _this = this;
                    var oldTodos = this.todos;
                    this.todos = [];
                    oldTodos.forEach(function (todo) {
                        if (!todo.done) {
                            _this.todos.push(todo);
                        }
                    });
                };
                TodoApp.prototype.addTask = function (task) {
                    this.todos.push(task);
                };
                TodoApp = __decorate([
                    angular2_core_js_1.Component({
                        selector: 'todo-app',
                        template: "\n    <h3>Todo (react)</h3>\n    <todo-list [todos]=\"todos\"></todo-list>\n    <todo-form (newTask)=\"addTask($event)\"></todo-form>",
                        styles: ['a { cursor: pointer; cursor: hand; }'],
                        directives: [TodoList, TodoForm]
                    }), 
                    __metadata('design:paramtypes', [])
                ], TodoApp);
                return TodoApp;
            }());
            exports_1("TodoApp", TodoApp);
            angular2_platform_browser_js_1.bootstrap(TodoApp);
        }
    }
});
//# sourceMappingURL=main.js.map