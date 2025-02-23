import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UserTablePage from "./pages/UserTablePage";
import Charts from "./pages/Charts";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/table" element={<UserTablePage />} />
      <Route path="/charts" element={<Charts />} />
    </Routes>
  );
};

export default App;
