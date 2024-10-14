// completeTodo.js
var argv = require("minimist")(process.argv.slice(2));
const db = require("./models/index");

const markAsComplete = async (id) => {
  try {
    await db.Todo.markAsComplete(id);
  } catch (error) {
    console.error(error);
  }
};

(async () => {
  let { id } = argv;
  if (id === undefined) {
    throw new Error("Need to pass an id");
  }
  id = parseInt(id, 10);

  if (isNaN(id)) {
    throw new Error("The id needs to be an integer");
  }
  await markAsComplete(id);
  await db.Todo.showList();
})();
