import styles from "./inlinecomponent.module.css";
export default function InlineComponent() {
  return <div>{<h1 className={styles.header}>Inline Styles</h1>}</div>;
}
