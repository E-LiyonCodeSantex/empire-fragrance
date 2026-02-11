import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import api from "@/utils/axiosInstance";

interface User {
  _id: string;
  userName?: string;
  email: string;
  role: "admin" | "user";
}

interface AuthContextProps {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  error: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Validate token with server on mount and keep localStorage in sync
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("role");

    if (!token || !role) {
      setCurrentUser(null);
      setLoading(false);
      return;
    }

    try {
      const endpoint =
        role === "admin" ? "/api/admin/me" : "/api/account/user/me";
      const res = await api.get<User>(endpoint);
      //console.log("refreshUser response:", res.data);
      const userData = res.data;
      setCurrentUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        // Unauthorized or forbidden → clear auth
        setCurrentUser(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setError("Your session has expired. Please log in again.");
      } else if (err.code === "ERR_NETWORK") {
        // Backend unreachable
        setError(
          "Backend unavailable: could not reach authentication service. Please try again later."
        );
      } else {
        console.error("refreshUser error:", err);
        setError("Failed to refresh user information.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setLoading(false);
    }
    refreshUser();

    const onAuthLogout = () => {
      setCurrentUser(null);
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    }
    window.addEventListener("auth:logout", onAuthLogout);

    return () => {
      window.removeEventListener("auth:logout", onAuthLogout);
    };
  }, [refreshUser]);

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setError(null);
    window.dispatchEvent(new Event("auth:logout"));
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, logout, refreshUser, error, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
