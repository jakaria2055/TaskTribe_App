import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUser, SignIn, useAuth, CreateOrganization } from "@clerk/react";
import Navbar from "../components/Navbar";
import { loadTheme } from "../features/themeSlice";
import Sidebar from "../components/Sidebar";
import Outlet from "../components/Outlet";
import { fetchWorkspaces } from "../features/workspaceSlice";

const Layout = () => {
  const { loading, workspaces } = useSelector((state) => state.workspace);
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    dispatch(loadTheme());
  }, [dispatch]);

  useEffect(() => {
    if (isLoaded && user && workspaces.length === 0) {
      dispatch(fetchWorkspaces({ getToken }));
    }
  }, [user, isLoaded, dispatch, getToken, workspaces.length]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-zinc-950">
        <SignIn />
      </div>
    );
  }

  if (loading) {
    <div className="flex items-center justify-center h-screen bg-white dark:bg-zinc-950">
      <Loader2 className="size-7 text-sky-500 animate-spin" />
    </div>;
  }

  if (user && workspaces.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <CreateOrganization />
      </div>
    );
  }

  return (
    <div className="flex bg-white dark:bg-zinc-950 text-gray-900 dark:text-slate-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex-1 flex flex-col h-screen">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="flex-1 h-full p-6 xl:p-10 xl:px-16 overflow-y-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
