import { CookiesProvider } from "react-cookie";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import { Admin } from "./components/admin/Admin";
import { CatchAll } from "./components/CatchAll";
import { Dashboard } from "./components/dashboard/Dashboard";
import { StudentDashboard } from "./components/dashboard/studentDashboard/StudentDashboard";
import { Discovery } from "./components/discovery/Discovery";
import { Login } from "./components/login/Login";
import { Playground } from "./components/playground/Playground";
import { Bookings } from "./components/bookings/Bookings";
import { Profile } from "./components/profile/Profile";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Resources } from "./components/resources/Resources";
import { Signup } from "./components/signup/Signup";
import { TeacherSignup } from "./components/teacher-signup/TeacherSignup";
import { AuthProvider } from "./contexts/AuthContext";
import { BackendProvider } from "./contexts/BackendContext";
import { RoleProvider } from "./contexts/RoleContext";
import { Reviews } from "./components/reviews/Reviews"

const App = () => {
  return (
    <CookiesProvider>
      <BackendProvider>
        <AuthProvider>
          <RoleProvider>
            <Router>
              <Routes>
                <Route
                  path="/login"
                  element={<Login />}
                />
                <Route
                  path="/signup"
                  element={<Signup />}
                />
                <Route
                  path="/teacher-signup"
                  element={<TeacherSignup />}
                />
                <Route
                  path="/dashboard"
                  element={<ProtectedRoute element={<Dashboard />} />}
                />
                <Route
                  path="/dashboard/students"
                  element={<ProtectedRoute element={<StudentDashboard />} />}
                />
                <Route
                  path="/bookings"
                  element={<ProtectedRoute element={< Bookings/>} />}
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute
                      element={<Admin />}
                      allowedRoles={["admin"]}
                    />
                  }
                />
                <Route
                  path="/resources"
                  element={<ProtectedRoute element={<Resources />} />}
                />
                <Route
                  path="/profile"
                  element={<ProtectedRoute element={<Profile />} />}
                />
                <Route
                  path="/playground"
                  element={<ProtectedRoute element={<Playground />} />}
                />

                <Route
                  path="/reviews"
                  element={<ProtectedRoute element={<Reviews/>} />}
                />

                <Route
                  path="/discovery"
                  element={<ProtectedRoute element={<Discovery />} />}
                />
                <Route
                  path="/"
                  element={
                    <Navigate
                      to="/login"
                      replace
                    />
                  }
                />
                <Route
                  path="*"
                  element={<ProtectedRoute element={<CatchAll />} />}
                />
              </Routes>
            </Router>
          </RoleProvider>
        </AuthProvider>
      </BackendProvider>
    </CookiesProvider>
  );
};

export default App;
