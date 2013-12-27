(function($, global) {
    'use strict';

    var Mustache = global.Mustache,
        _ = global._;

    var todo = {
        elem: {},

        selector: {
            container: '#todolist-container',
            taskList:  '#todolist-container ul',
            addBtn:    '#todolist-container button.add'
        },

        taskItemTmpl: '<li class="task-item">{{body}}</li>',

        inputTaskItemTmpl: '<li class="input-item"><input type="text"/></li>',

        init: function() {
            for (var key in this.selector) {
                var s = this.selector[key];
                this.elem[key] = $(s);
            }

            // bind events
            this.elem.addBtn.click(_.bind(this.addInputTask, this));
        },

        appendTask: function(item) {
            return $(item).appendTo(this.elem.taskList);
        },

        addTask: function(body) {
            var taskItem = Mustache.render(this.taskItemTmpl, {
                body: body
            });
            this.appendTask(taskItem);
        },

        addInputTask: function() {
            if (this.existsInputTaskItem()) {
                return;
            }
            var $addedTask = this.appendTask(this.inputTaskItemTmpl);
            this.bindUpdateTask($addedTask);
        },

        existsInputTaskItem: function() {
            return this.elem.container.find('.input-item').length > 0;
        },

        bindUpdateTask: function($item) {
            $item.find('input').keypress(_.bind(function(e) {
                if (e.which === 13) {
                    this.updateTask($item);
                }
            }, this));
        },

        updateTask: function($item) {
            this.addTask($item.find('input').val());
            $item.remove();
        }
    }

    $(function() {
        todo.init();
    });

    global.todo = todo;

})(this.jQuery, this);

