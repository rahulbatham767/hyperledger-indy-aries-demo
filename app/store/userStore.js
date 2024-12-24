import axios from "axios";
import Cookies from "js-cookie";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useRouter } from "next/router";

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
        set({ loading: true, error: null });
        const { email, password } = data;
        try {
          const response = await axios.post("/api/login", { email, password });
          const userData = response.data;

          if (userData.success) {
            set({
              isLoggedIn: true,
              user: userData.data,
              token: userData.token,
              role: userData.data.role,
              loading: false,
            });
            sessionStorage.setItem("userRole", userData.data.role);
            sessionStorage.setItem("userName", userData.data.user.name);
            // Use Next.js useRouter for navigation
            const router = useRouter();
            router.push("/connection");
          }

          return userData;
        } catch (error) {
          set({ loading: false, error: error.message });
          return { success: false, message: error.message };
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
        const response = await axios.get("/api/logout");
        const message = response.data;

        set({
          isLoggedIn: false,
          user: null,
          token: null,
          role: null,
          loading: false,
          error: null,
          message: message,
        });
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
}

export default useUserStore;
