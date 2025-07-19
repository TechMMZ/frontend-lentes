import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('usuario');
      }
    }
  }, []);

  const loginUser = (usuario) => {
    setUser(usuario);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('usuario');
  };

  return (
    <UserContext.Provider value={{ user, setUser, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
