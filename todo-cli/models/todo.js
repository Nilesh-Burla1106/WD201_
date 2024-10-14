'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }

    static async showList() {
      console.log('My Todo list \n');

      // Fetch and print overdue tasks
      const overdueTasks = await Todo.overdue();
      if (overdueTasks.length === 0) {
        console.log('No overdue tasks.');
      } else {
        for (const task of overdueTasks) {
          console.log(task.displayableString().trim());
        }
      }

      console.log('\n');

      // Fetch and print tasks due today
      const dueTodayTasks = await Todo.dueToday();
      if (dueTodayTasks.length === 0) {
        console.log('No tasks due today.');
      } else {
        for (const task of dueTodayTasks) {
          console.log(task.displayableString().trim());
        }
      }

      console.log('\n');

      // Fetch and print tasks due later
      const dueLaterTasks = await Todo.dueLater();
      if (dueLaterTasks.length === 0) {
        console.log('No tasks due later.');
      } else {
        for (const task of dueLaterTasks) {
          console.log(task.displayableString().trim());
        }
      }
    }

    static async overdue() {
      const today = new Date();
      return await Todo.findAll({
        where: {
          completed: false,
          dueDate: {
            [sequelize.Op.lt]: today,
          },
        },
      });
    }

    static async dueToday() {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of the day
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1); // Set to tomorrow

      return await Todo.findAll({
        where: {
          completed: false,
          dueDate: {
            [sequelize.Op.gte]: today,
            [sequelize.Op.lt]: tomorrow,
          },
        },
      });
    }

    static async dueLater() {
      const today = new Date();
      return await Todo.findAll({
        where: {
          completed: false,
          dueDate: {
            [sequelize.Op.gt]: today,
          },
        },
      });
    }

    static async markAsComplete(id) {
      const todo = await Todo.findByPk(id);
      if (todo) {
        todo.completed = true;
        await todo.save();
      } else {
        throw new Error(`Todo with ID ${id} not found.`);
      }
    }

    displayableString() {
      let checkbox = this.completed ? '[x]' : '[ ]';
      const date = this.completed || this.dueDate === null ? '' : ` ${this.dueDate}`;
      return `${this.id}. ${checkbox} ${this.title}${date}`;
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
