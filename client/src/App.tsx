import Dashboard from "./components/Dashboard";
import SidebarComp from "./components/Sidebar";

const App = () => {
  return (
    <div className="flex h-screen">
      <SidebarComp />
      <div className="flex-1 overflow-y-auto">
        <Dashboard />
      </div>
    </div>
  );
};

export default App;
