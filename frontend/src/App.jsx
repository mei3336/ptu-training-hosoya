import { BrowserRouter, Routes, Route } from "react-router-dom";
 
import LoginPage from "./pages/LoginPage";
import MemberListPage from "./pages/MemberListPage";
import UserCreatePage from "./pages/UserCreatePage";
import UserEditPage from "./pages/UserEditPage";
import UserManagementPage from "./pages/UserManagementPage";
 
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ログイン */}
        <Route
          path="/"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />
 
        {/* ログイン後 */}
        <Route
          path="/members"
          element={
            <MainLayout>
              <MemberListPage />
            </MainLayout>
          }
        />
 
        <Route
          path="/users"
          element={
            <MainLayout>
              <UserManagementPage />
            </MainLayout>
          }
        />
 
        <Route
          path="/users/create"
          element={
            <MainLayout>
              <UserCreatePage />
            </MainLayout>
          }
        />
 
        <Route
          path="/users/edit/:id"
          element={
            <MainLayout>
              <UserEditPage />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
 
export default App;
 