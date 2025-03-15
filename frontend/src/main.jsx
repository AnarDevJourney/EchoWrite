import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// Redux
import { Provider } from "react-redux";
import store from "./store.js";
// React Router
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
// Pages
import HomeScreen from "./screens/HomeScreen.jsx";
import CategoryBlogScreen from "./screens/CategoryBlogScreen.jsx";
import BlogDetailsScreen from "./screens/BlogDetailsScreen.jsx";
import RegisterScreen from "./screens/RegisterScreen.jsx";
import LoginScreen from "./screens/LoginScreen.jsx";
import CreateBlogScreen from "./screens/CreateBlogScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import NotificationsScreen from "./screens/NotificationsScreen.jsx";
import NotFoundScreen from "./screens/NotFoundScreen.jsx";
import BlogListScreen from "./screens/admin/BlogListScreen.jsx";
import UserListScreen from "./screens/admin/UserListScreen.jsx";
import UserEditScreen from "./screens/admin/UserEditScreen.jsx";
// Component to make some pages private (Not accessible without user account)
import PrivateRoute from "./components/PrivateRoute.jsx";
// Component to make some pages only for Admin
import AdminRoute from "./components/AdminRoute.jsx";

// React Query Client
const queryClient = new QueryClient();

// Router Configuration
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public Routes */}
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route
        path="/blogs/category/:category"
        element={<CategoryBlogScreen />}
      />
      <Route path="/blog/:id" element={<BlogDetailsScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />

      {/* Private Routes */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/create-blog" element={<CreateBlogScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/notifications" element={<NotificationsScreen />} />
      </Route>

      {/* Admin Routes */}
      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/bloglist" element={<BlogListScreen />} />
        <Route path="/admin/userlist" element={<UserListScreen />} />
        <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
      </Route>

      {/* 404 Not Found Route */}
      <Route path="*" element={<NotFoundScreen />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
