import Header from "./components/Header";
import InlineComponent from "./components/InlineComponent";
import OutlineComponent from "./components/outlineComponent";
import Todo from "./components/todo";
import "./App.css";
import ClassComponent from "./components/ClassComponent";
import Hooks from "./components/Hooks";
import LoginContextProvider from "./components/LoginContextProvider";
import React, { createContext } from "react";
import UseLayoutEffect from "./components/UseLayoutEffect";
import UseCallback from "./components/UseCallback";
import CreatingForm from "./components/CreatingForm";

export const loginContext = createContext();

function App() {
  return (
    <div className="App">
      <Header />
      <Todo />
      <InlineComponent />
      <OutlineComponent />
      <ClassComponent />
      <LoginContextProvider>
        <Hooks />
      </LoginContextProvider>
      <UseLayoutEffect />
      <UseCallback />
      <CreatingForm />
    </div>
  );
}

export default App;
