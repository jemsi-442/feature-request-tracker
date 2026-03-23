import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user + token from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (storedUser && token) {
        setUser({ ...JSON.parse(storedUser), token });
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, []);

  const login = ({ user: u, token }) => {
    if (!u || !token) return console.error("Invalid login data");
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(u));
    setUser({ ...u, token }); // include token in state
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
