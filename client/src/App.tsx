import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UserTablePage from "./pages/UserTable";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/table" element={<UserTablePage />} />
    </Routes>
  );
};

export default App;
