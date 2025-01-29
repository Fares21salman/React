import React, { useContext } from "react";
import { loginContext } from "../components/LoginContextProvider";

export default function SinglePost() {
  const login = useContext(loginContext);
  console.log(login);
  return <h1>SinglePost</h1>;
}
