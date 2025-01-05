'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    // Static method to get all Todos
    static getTodos() {
      return this.findAll();
    }

    // Static method to add a new Todo
    static addTodo({ title, dueDate }) {
      return this.create({ title, dueDate, completed: false });
    }

    // Instance method to mark Todo as completed
    markAsCompleted() {
      return this.update({ completed: true }, { where: { id: this.id } });
    }
  }

  // Initialize Todo model
  Todo.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false, // Ensure the title cannot be null
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: true, // It's optional
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Default value for completed is false
      },
    },
    {
      sequelize,
      modelName: 'Todo',
      tableName: 'Todos', // Explicitly specify the table name here
    }
  );

  return Todo;
};
