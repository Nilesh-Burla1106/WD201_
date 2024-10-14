"use strict";
const { Model, Op } = require("sequelize"); // Import Op here

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async addTask(params) {
      return await Todo.create(params);
    }

    static async showList() {
      console.log("My Todo-list\n");

      console.log("Overdue");
      const overdueTasks = await this.overdue();
      overdueTasks.forEach((task) => {
        console.log(task.displayableString().trim());
      });
      console.log("\n");

      console.log("Due Today");
      const dueTodayTasks = await this.dueToday();
      dueTodayTasks.forEach((task) => {
        console.log(task.displayableString().trim());
      });
      console.log("\n");

      console.log("Due Later");
      const dueLaterTasks = await this.dueLater();
      dueLaterTasks.forEach((task) => {
        console.log(task.displayableString().trim());
      });
    }

    static async overdue() {
      const today = new Date();
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: today, // Use Op here
          },
          completed: false,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    static async dueToday() {
      const today = new Date();
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: today.toISOString().split("T")[0], // Use Op here
          },
          completed: false,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    static async dueLater() {
      const today = new Date();
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: today, // Use Op here
          },
          completed: false,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    static async markAsComplete(id) {
      const todo = await Todo.findByPk(id);
      if (todo) {
        todo.completed = true;
        await todo.save();
      } else {
        throw new Error(`Todo with ID ${id} not found`);
      }
    }

    displayableString() {
      const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      let checkbox = this.completed ? "[x]" : "[ ]";
      let displayString = `${this.id}. ${checkbox} ${this.title}`;
      
      const formattedDueDate = this.dueDate.toISOString().split('T')[0];

      // Format for completed past-due tasks
      if (this.completed && formattedDueDate < today) {
        // Completed past-due item - No change needed here
        return `${this.id}. [x] ${this.title} ${formattedDueDate}`; // Change highlighted
      }
    
      // Format for incomplete tasks due today or later
      if (formattedDueDate === today) {
        return `${this.id}. ${checkbox} ${this.title}`; // No date for today's tasks
      }
    
      // For overdue and future dates, show the due date
      return `${displayString} ${formattedDueDate}`; // This line is already correct
    }
  }

  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    },
  );

  return Todo;
};
