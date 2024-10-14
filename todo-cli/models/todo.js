'use strict';
const { Model, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async addTask(params) {
      return await Todo.create(params);
    }

    static async showList() {
      console.log('My Todo list \n');

      console.log('Overdue');
      const overdueTasks = await this.overdue();
      overdueTasks.forEach((task) => {
        console.log(task.displayableString().trim());
      });
      console.log('\n');

      console.log('Due Today');
      const dueTodayTasks = await this.dueToday();
      dueTodayTasks.forEach((task) => {
        console.log(task.displayableString().trim());
      });
      console.log('\n');

      console.log('Due Later');
      const dueLaterTasks = await this.dueLater();
      dueLaterTasks.forEach((task) => {
        console.log(task.displayableString().trim());
      });
    }

    static async overdue() {
      const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: today,
          },
        },
        order: [['dueDate', 'ASC']],
      });
    }

    static async dueToday() {
      const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
      return await Todo.findAll({
        where: {
          dueDate: today,
        },
        order: [['dueDate', 'ASC']],
      });
    }

    static async dueLater() {
      const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: today,
          },
        },
        order: [['dueDate', 'ASC']],
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
      const checkbox = this.completed ? '[x]' : '[ ]';
      const dueDateString = this.completed && this.dueDate < new Date().toISOString().split("T")[0] ? this.dueDate : '';
      
      // For completed past-due tasks
      if (this.completed && this.dueDate < new Date().toISOString().split("T")[0]) {
        return `${this.id}. ${checkbox} ${this.title} ${dueDateString}`.trim(); // Format: ID. [x] TITLE DUE_DATE
      }

      // For incomplete tasks due today
      if (this.dueDate === new Date().toISOString().split("T")[0]) {
        return `${this.id}. ${checkbox} ${this.title}`; // No date for tasks due today
      }

      // Format for future incomplete tasks
      if (!this.completed && this.dueDate > new Date().toISOString().split("T")[0]) {
        return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`; // Include due date
      }

      // For overdue and future dates, show the due date
      return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`; 
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
      modelName: 'Todo',
    },
  );

  return Todo;
};
