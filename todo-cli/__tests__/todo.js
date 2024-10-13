const todoList = require("../todo");

const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();

describe("TodoList Test Suite", () => {
    // Reset the todo list before each test
    beforeEach(() => {
        all.length = 0; // Clear the list before each test
    });

    // Test for adding a new todo
    test("Should add new todo", () => {
        const todoItemsCount = all.length; 
        add({
            title: "New Todo",
            completed: false,
            dueDate: new Date().toISOString().slice(0, 10) // Today's date
        });
        expect(all.length).toBe(todoItemsCount + 1);
        expect(all[0].title).toBe("New Todo");
    });

    // Test for marking a todo as complete
    test("Should mark a todo as complete", () => {
        add({
            title: "Test Todo",
            completed: false,
            dueDate: new Date().toISOString().slice(0, 10) // Today's date
        });
        expect(all[0].completed).toBe(false); // Initially not completed
        markAsComplete(0);
        expect(all[0].completed).toBe(true); // Should be completed now
    });

    // Test for retrieving overdue items
    test("Should retrieve overdue items", () => {
        add({
            title: "Overdue Task",
            completed: false,
            dueDate: "2023-10-10" // Assume today's date is later
        });
        const overdueItems = overdue();
        expect(overdueItems.length).toBe(1); // One overdue item
        expect(overdueItems[0].title).toBe("Overdue Task");
    });

    // Test for retrieving due today items
    test("Should retrieve due today items", () => {
        add({
            title: "Due Today Task",
            completed: false,
            dueDate: new Date().toISOString().slice(0, 10) // Today's date
        });
        const todayItems = dueToday();
        expect(todayItems.length).toBe(1); // One item due today
        expect(todayItems[0].title).toBe("Due Today Task");
    });

    // Test for retrieving due later items
    test("Should retrieve due later items", () => {
        add({
            title: "Future Task",
            completed: false,
            dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().slice(0, 10) // 5 days later
        });
        const laterItems = dueLater();
        expect(laterItems.length).toBe(1); // One item due later
        expect(laterItems[0].title).toBe("Future Task");
    });
});
