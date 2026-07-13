import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Toast from "./components/Toast";

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
    <AuthProvider>
      <ToastProvider>
        <Toast />
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
              <ProtectedRoute
              allowedRoles={["admin", "member"]}
              >
                <MainLayout>
                  <MemberListPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
  
          <Route
            path="/users"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
              >
              <MainLayout>
                <UserManagementPage />
              </MainLayout>
              </ProtectedRoute>
            }
          />
  
          <Route
            path="/users/create"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
              >
              <MainLayout>
                <UserCreatePage />
              </MainLayout>
            </ProtectedRoute>
            }
          />
  
          <Route
            path="/users/:id/edit"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
              >
              <MainLayout>
                <UserEditPage />
              </MainLayout>
            </ProtectedRoute>
            }
          />
          
          <Route
            path="/mypage"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "member"]}
              >
                <MainLayout>
                  <MyPage/>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/mypage/edit"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "member"]}
              >
                <MainLayout>
                  <UserEditPage/>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
 
export default App;
 