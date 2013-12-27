(function($, global) {
    'use strict';

    var _ = global._,
        Backbone = global.Backbone,
        TODO = {};

    TODO.TaskModel = Backbone.Model.extend({

        /**
         * Task contents.
         * 
         * @type {String}
         */
        body: null,

        empty: function() {
            return ! this.getTask();
        },

        getTask: function() {
            return this.get('body');
        },

        updateTask: function(options) {
            this.set({'body': options.body});
        }
    });

    TODO.TaskCollection = Backbone.Collection.extend({

        /**
         * Task contents.
         */
        model: TODO.TaskModel
    });

    TODO.TaskView = Backbone.View.extend({
        model: null,

        el: '.task-list',

        events: {
            'keypress input': 'updateTask'
        },

        template: _.template($('#bb-marionette-task').html()),

        emptyTemplate: _.template($('#bb-marionette-input-task').text()),

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function() {
            (  this.model.empty()) && this.renderInputTask();
            (! this.model.empty()) && this.renderTask();
        },

        renderInputTask: function() {
            if (this.getInputTaskElem().length) {
                return;
            }
            this.$el.append(this.emptyTemplate());
        },

        renderTask: function() {
            var $input = this.getInputTaskElem();
            var body = this.getInputTask()

            // delete input task
            $input.remove();

            // add task
            this.$el.append(this.template({
                body: body
            }));
        },

        getInputTaskElem: function() {
            return this.$el.find('.input-item');
        },

        getInputTask: function() {
            return this.getInputTaskElem().find('input').val();
        },

        updateTask: function(e) {
            if (e.which === 13) {
                this.model.updateTask({
                    body: this.getInputTask()
                });
            }
        }

    });

    TODO.TaskListView = Backbone.View.extend({
        el: '#todolist-container .task-list',

        collection: null,

        initialize: function() {
            this.listenTo(this.collection, 'add', this.addTask);
        },

        addTask: function(model) {
            var view = new TODO.TaskView({model: model});
            view.render();
        }
    });

    TODO.AppView = Backbone.View.extend({
        el: '#todolist-container',

        taskListView: null,

        events: {
            'click .add': 'addTask'
        },

        initialize: function(options) {
            this.taskListView = options.taskListView;
        },

        addTask: function() {
            this.taskListView.collection.add(new TODO.TaskModel());
        }
    });

    var app = new TODO.AppView({
        taskListView: new TODO.TaskListView({
            collection: new TODO.TaskCollection()
        })
    });


    global.TODO = TODO;
    global.TODO.exports = {
        app: app
    };
})(this.jQuery, this);
