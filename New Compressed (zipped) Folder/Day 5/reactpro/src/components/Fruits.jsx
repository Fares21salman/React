export default function Fruits() {
  const fruits = ["Apple", "Banana", "Grapes", "Tomato", "Orange"];
  return (
    <div>
      {fruits.map((fruit) => (
        <h1>{fruit}</h1>
      ))}
    </div>
  );
}
