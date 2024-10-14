const today = new Date().toISOString().slice(0, 10);

const todoList = () => {
  const all = [];
  
  const add = (todoItem) => {
    all.push(todoItem);
  };

  const markAsComplete = (index) => {
    if (index < 0 || index >= all.length) {
      console.error("Invalid index");
      return;
    }
    all[index].completed = true;
  };

  const overdue = () => {
    // Return overdue items (dueDate < today)
    return all.filter((todo) => todo.dueDate < today);
  };

  const dueToday = () => {
    // Return items due today (dueDate === today)
    return all.filter((todo) => todo.dueDate === today);
  };

  const dueLater = () => {
    // Return items due later (dueDate > today)
    return all.filter((todo) => todo.dueDate > today);
  };

  const toDisplayableList = (list) => {
    // Format the To-Do list for display
    return list
      .map((todo) => {
        const checkbox = todo.completed ? "[x]" : "[ ]";
        // Display date only if not today
        const displayDate = todo.dueDate === today ? "" : todo.dueDate;
        return `${checkbox} ${todo.title} ${displayDate}`.trim();
      })
      .join("\n");
  };

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList
  };
};

// ####################################### #
// DO NOT CHANGE ANYTHING BELOW THIS LINE. #
// ####################################### #

module.exports = todoList;
