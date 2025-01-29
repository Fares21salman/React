function Hello({ person }) {
  return (
    <div>
      <h1>
        Hello from {person.names}. {person.message} , My Employee ID {""}
        {person.empID}
      </h1>
      <h1>How are you? {person.emoji} </h1>
    </div>
  );
}

export default Hello;
