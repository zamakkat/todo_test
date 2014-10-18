/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

	// The Application
	// ---------------

	// Our overall **AppView** is the top-level piece of UI.
	app.AppView = Backbone.View.extend({

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: '#todoapp',

		// Our template for the line of statistics at the bottom of the app.
		statsTemplate: _.template($('#stats-template').html()),

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			'click #make-todo': 'showInputBox',
			'keypress #new-todo': 'createOnEnter',
			'keydown #new-todo': 'cancelOnEscape',
			'blur #new-todo': 'cancelOnBlur',
			'click #clear-completed': 'clearCompleted'
			// 'click #toggle-all': 'toggleAllComplete'
		},

		// At initialization we bind to the relevant events on the `Todos`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting todos that might be saved in *localStorage*.
		initialize: function () {
			// this.allCheckbox = this.$('#toggle-all')[0];
			this.$make = this.$('#make-todo');
			this.$input = this.$('#new-todo');
			this.$lists = this.$('#lists');
			this.$main = this.$('#main');
			this.$list = $('#todo-list');

			this.$input.hide();

			this.listenTo(app.todos, 'add', this.addOne);
			this.listenTo(app.todos, 'reset', this.addAll);
			this.listenTo(app.todos, 'change:completed', this.filterOne);
			this.listenTo(app.todos, 'filter', this.filterAll);
			this.listenTo(app.todos, 'all', this.render);

			// Suppresses 'add' events with {reset: true} and prevents the app view
			// from being re-rendered for every model. Only renders when the 'reset'
			// event is triggered at the end of the fetch.
			app.todos.fetch({reset: true});
		},

		// Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
		render: function () {
			var completed = app.todos.completed().length;
			var remaining = app.todos.remaining().length;

			this.$main.show();
			this.$lists.show();

			this.$lists.html(this.statsTemplate({
				completed: completed,
				remaining: remaining
			}));

			if (app.todos.length) {

				this.$('#filters li a')
					.removeClass('selected')
					.filter('[href="#/' + (app.TodoFilter || '') + '"]')
					.addClass('selected');
			}

			// this.allCheckbox.checked = !remaining;
		},

		// Add a single todo item to the list by creating a view for it, and
		// appending its element to the `<ul>`.
		addOne: function (todo) {
			var view = new app.TodoView({ model: todo });
			this.$list.append(view.render().el);
		},

		// Add all items in the **Todos** collection at once.
		addAll: function () {
			this.$list.html('');
			app.todos.each(this.addOne, this);
		},

		filterOne: function (todo) {
			todo.trigger('visible');
		},

		filterAll: function () {
			app.todos.each(this.filterOne, this);
		},

		// Generate the attributes for a new Todo item.
		newAttributes: function () {
			return {
				title: this.$input.val().trim(),
				order: app.todos.nextOrder(),
				completed: false
			};
		},

		// Shows the input box on clicking the "Make a todo" button
		showInputBox: function() {
			this.$make.hide();
			this.$input.show();
			this.$input.focus();
			// Push the cursor to the end of the text
			var val = this.$input.val();
			this.$input.val('');
			this.$input.val(val);
		},

		// If you hit return in the main input field, create new **Todo** model,
		// persisting it to *localStorage*.
		createOnEnter: function (e) {
			if (e.which === ENTER_KEY && this.$input.val().trim()) {
				app.todos.create(this.newAttributes());
				this.$make.show();
				this.$input.hide();
				this.$input.val('');
			}
		},

		// Cancel the current input of a new todo and show the default button on Esc
		cancelOnEscape: function (e) {
			if (e.which === ESC_KEY) {
				this.$make.show();
				this.$input.hide();
			}
		},

		// Cancel the current input of a new todo and show the default button on blur
		cancelOnBlur: function () {
			this.$make.show();
			this.$input.hide();
		},

		// Clear all completed todo items, destroying their models.
		clearCompleted: function () {
			_.invoke(app.todos.completed(), 'destroy');
			return false;
		}

		// toggleAllComplete: function () {
		// 	var completed = this.allCheckbox.checked;

		// 	app.todos.each(function (todo) {
		// 		todo.save({
		// 			completed: completed
		// 		});
		// 	});
		// }
	});
})(jQuery);
