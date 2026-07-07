import { BrowserRouter, Routes, Route } from "react-router-dom";
 
import LoginPage from "./pages/LoginPage";
import MemberListPage from "./pages/MemberListPage";
import UserCreatePage from "./pages/UserCreatePage";
import UserEditPage from "./pages/UserEditPage";
import UserManagementPage from "./pages/UserManagementPage";
import MyPage from "./pages/MyPage"; 
import MainLayout from "./layouts/MainLayout";
import "./App.css";

 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ログイン */}
        <Route
          path="/"
          element={
            <MainLayout>
              <LoginPage />
            </MainLayout>
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
          path="/users/:id/edit"
          element={
            <MainLayout>
              <UserEditPage />
            </MainLayout>
          }
        />
        
        <Route
          path="/mypage"
          element={
            <MainLayout>
              <MyPage/>
            </MainLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
 
export default App;
 