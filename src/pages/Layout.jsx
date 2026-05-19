import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUser, SignIn, useAuth, CreateOrganization } from "@clerk/react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { fetchWorkspaces } from "../features/workspaceSlice";
import { Outlet } from "react-router-dom";
import { loadTheme } from "../features/themeSlice";

const Layout = () => {
  const { loading, workspaces, hasFetched } = useSelector((state) => state.workspace); // 👈 add hasFetched
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    console.log("dispatching loadTheme");
    dispatch(loadTheme());
  }, [dispatch]);

  useEffect(() => {
    if (isLoaded && user && !hasFetched && !loading) { // 👈 use hasFetched instead of workspaces.length
      dispatch(fetchWorkspaces({ getToken }));
    }
  }, [user, isLoaded, hasFetched, loading, dispatch, getToken]);

  // Not logged in
  if (!isLoaded || (!user && !isLoaded)) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-zinc-950">
        <SignIn />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-zinc-950">
        <SignIn />
      </div>
    );
  }

  // Show spinner while fetching — NOTE THE return KEYWORD 👇
  if (loading || !hasFetched) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-zinc-950">
        <Loader2 className="size-7 text-sky-500 animate-spin" />
      </div>
    );
  }

  // Only show CreateOrganization AFTER fetch is complete and truly no workspaces
  if (hasFetched && !loading && workspaces.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <CreateOrganization />
      </div>
    );
  }

  return (
    <div className="flex bg-white dark:bg-zinc-950 text-gray-900 dark:text-slate-100">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col h-screen">
        <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="flex-1 h-full p-6 xl:p-10 xl:px-16 overflow-y-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;