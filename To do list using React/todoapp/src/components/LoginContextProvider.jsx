import React, { createContext, useState } from "react";

export const loginContext = createContext();

const LoginContextProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(true);
  return (
    <div>
      <loginContext.Provider value={userDetails}>
        {children}
      </loginContext.Provider>
    </div>
  );
};

export default LoginContextProvider;
