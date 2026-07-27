import { createContext, useState, useEffect } from "react";
import api, { clearAccessToken, setAccessToken } from "../Services/api";

export const UserContext = createContext();

const UserContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCurrentUser = async () => {
    try {
      const res = await api.get(
        "/api/v1/users/current-user"
      );

      setUser(res.data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          const refreshRes = await api.post("/api/v1/users/refresh-token");
          setAccessToken(refreshRes.data.data.accessToken);

          const userRes = await api.get(
            "/api/v1/users/current-user"
          );

          setUser(userRes.data.data);
        } catch (refreshError) {
          clearAccessToken();
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const value = {
    user,
    setUser,
    getCurrentUser,
    loading,
  };

  return (
    <UserContext.Provider value={value}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
