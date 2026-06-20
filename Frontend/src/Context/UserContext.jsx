import { createContext, useState, useEffect } from "react";
import axios from "axios";
export const UserContext = createContext()

const UserContextProvider = (props) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const getCurrentUser = async () => {
    try {
        const res = await axios.get(
            `${import.meta.env.VITE_APP_URI}/api/v1/users/current-user`,
            { withCredentials: true }
        );
        setUser(res.data.data);

    } catch (error) {
        const status = error.response?.status;

        if (status === 401) {
            // Token expired — try refresh
            try {
                await axios.post(
                    `${import.meta.env.VITE_APP_URI}/api/v1/users/refresh-token`,
                    {},
                    { withCredentials: true }
                );
                const res = await axios.get(
                    `${import.meta.env.VITE_APP_URI}/api/v1/users/current-user`,
                    { withCredentials: true }
                );
                setUser(res.data.data);

            } catch (refreshError) {
                setUser(null); // genuinely unauthenticated
            }

        } else if (status >= 500 || !error.response) {
            // Server down, cold start, network blip — don't log out
            // Just leave user state as-is, keep them logged in optimistically
            console.warn("Server unreachable, preserving auth state");

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

    const value = { user, setUser, getCurrentUser,loading }



    return (
        <UserContext.Provider value={value}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContextProvider