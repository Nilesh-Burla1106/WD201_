"use strict";
const { Model, Op } = require("sequelize");

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
            [Op.lt]: today,
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
            [Op.eq]: today.toISOString().split("T")[0],
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
            [Op.gt]: today,
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
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  const checkbox = this.completed ? "[x]" : "[ ]"; // Checkbox based on completion status

  // If it's a completed past-due task
  if (this.completed && this.dueDate < today) {
    return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`; // Format for completed past-due tasks
  }

  // If it's due today, no need to show the date
  if (this.dueDate === today) {
    return `${this.id}. ${checkbox} ${this.title}`; // Format for tasks due today
  }

  // For future tasks, show the date
  return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`; // Format for future tasks
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
