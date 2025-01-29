import styles from "./todoItem.module.css";

export default function TodoItem({ item, todos, setTodos }) {
  function handleDelete(item) {
    console.log("Delete BUtton CLicked for item", item);
    setTodos(todos.filter((todo) => todo !== item));
  }
  function handleClick(item) {
    console.log("Item clicked is", item);
    const newArray = todos.map((todo) =>
      todo.name === item ? { ...todo, done: !todo.done } : todo
    );
    setTodos(newArray);
  }
  let strikeOut = item.done ? styles.selected : "";
  return (
    <div className={styles.todoListContainer}>
      <div className={styles.itemName}>
        <span className={strikeOut} onClick={() => handleClick(item.name)}>
          {item.name}
        </span>
        <span>
          <button
            onClick={() => handleDelete(item)}
            className={styles.deleteButton}
          >
            x
          </button>
        </span>
      </div>
      <hr className={styles.line} />
    </div>
  );
}
