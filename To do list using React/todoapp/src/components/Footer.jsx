import styles from "./footer.module.css";

export default function Footer({ completedTodos, totalTodos }) {
  return (
    <div className={styles.footer}>
      <span className={styles.footerItem}>Total Todos: {totalTodos}</span>
      <span className={styles.footerItem}>
        Completed Todos: {completedTodos}
      </span>
    </div>
  );
}
