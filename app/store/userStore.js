import axios from "axios";
import Cookies from "js-cookie";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const useUserStore = create(
  persist(
    (set) => ({
      isLoggedIn: Cookies.get("userToken") ? true : false,
      user: null,
      token: null,
      role: null,
      error: null,
      message: "",
      loading: false,
      login: async (data) => {
        set({ loading: true, error: null, success: false });
        const { email, password } = data;

        try {
          const response = await axios.post("/api/login", { email, password });
          const userData = response.data;

          if (userData.success && userData.data?.name) {
            set({
              isLoggedIn: true,
              user: userData.data,
              token: userData.token,
              role: userData.data.role,
              loading: false,
              success: true,
            });

            toast.success("Login successful!");
            window.location.href = "/"; // Redirect after login

            return userData;
          } else {
            toast.error(userData?.message || "Login failed.");
            set({
              loading: false,
              error: userData?.message || "Login failed.",
              success: false,
            });
            return userData;
          }
        } catch (error) {
          const errorMessage =
            error?.response?.data?.message || "An unexpected error occurred.";
          toast.error(errorMessage);
          set({ loading: false, error: errorMessage, success: false });
          return { success: false, message: errorMessage };
        }
      },

      register: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post("/api/register", data);
          const userData = response.data;

          if (userData.success) {
            set({
              isLoggedIn: true,
              user: userData.data,
              token: userData.token,
              role: userData.data.role,
              loading: false,
            });
          }

          return userData;
        } catch (error) {
          set({ loading: false, error: error.message });
          return { success: false, message: error.message };
        }
      },
      logOut: async () => {
        try {
          // Call the backend logout API (if any)
          const response = await axios.get("/api/logout");
          const message = response.data;

          // Clear app state
          set({
            isLoggedIn: false,
            user: null,
            token: null,
            role: null,
            loading: false,
            error: null,
            message: message,
          });

          // Clean up localStorage and sessionStorage
          localStorage.removeItem("issuer-storage");
          sessionStorage.removeItem("userRole");
          sessionStorage.removeItem("isLoggedIn");
          sessionStorage.removeItem("userName");

          // Optionally remove cookies if set
          Cookies.remove("userToken");
          Cookies.remove("userRole");

          // Redirect to login page
          window.location.href = "/login"; // Ensure the redirect happens after cleanup
        } catch (error) {
          // Handle any errors during logout
          console.error("Logout error:", error);
          set({
            loading: false,
            error: "Logout failed. Please try again.",
          });
        }
      },

      setUser: (user, token) =>
        set({
          isLoggedIn: true,
          user,
          token,
          role: user.role,
        }),
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        token: state.token,
        role: state.role,
      }),
      storage: {
        getItem: (name) => {
          if (typeof window !== "undefined") {
            const item = localStorage.getItem(name);
            return item ? JSON.parse(item) : null;
          }
          return null;
        },
        setItem: (name, value) => {
          if (typeof window !== "undefined") {
            localStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          if (typeof window !== "undefined") {
            localStorage.removeItem(name);
          }
        },
      },
    }
  )
);

if (typeof window !== "undefined") {
  window.store = useUserStore;
  const TAB_ID = `tab_${Math.random()}`;
  sessionStorage.setItem(TAB_ID, "active");
  // Listen for unload event to clean up
  window.addEventListener("unload", () => {
    // Remove this tab from sessionStorage
    sessionStorage.removeItem(TAB_ID);

    // If no active tabs are left, log out the user
    if (Object.keys(sessionStorage).length === 0) {
      const useStoreInstance = useUserStore.getState();
      localStorage.removeItem("issuer-storage");
      useStoreInstance.logOut();
    }
  });
}

export default useUserStore;
