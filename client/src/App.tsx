import { CookiesProvider } from "react-cookie";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import { Admin } from "./components/admin/Admin";
import { Bookings } from "./components/bookings/Bookings";
import { CatchAll } from "./components/CatchAll";
import ClassDashboard, {
  OverallClassDashboard,
} from "./components/dashboard/classDashboard/ClassDashboard";
import ClassInfoDashboard from "./components/dashboard/classInfoDashboard/ClassInfoDashboard";
import { Dashboard, DashboardHome } from "./components/dashboard/Dashboard";
import { Discovery } from "./components/discovery/Discovery";
import { CreateEvent } from "./components/forms/createEvent";
import { Login } from "./components/login/Login";
import { Playground } from "./components/playground/Playground";
import { Profile } from "./components/profile/Profile";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Resources } from "./components/resources/Resources";
import { Reviews } from "./components/reviews/Reviews";
import { Signup } from "./components/signup/Signup";
import { TeacherSignup } from "./components/teacher-signup/TeacherSignup";
import { AuthProvider } from "./contexts/AuthContext";
import { BackendProvider } from "./contexts/BackendContext";
import { RoleProvider } from "./contexts/RoleContext";
import SettingsDashboard from "./components/dashboard/settingsDashboard/SettingsDashboard";
import Request from "./components/teacher-signup/requests/Request";

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
                  path="/create-event"
                  element={<CreateEvent />}
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
                  element={
                    <ProtectedRoute
                      element={<Dashboard />}
                      allowedRoles={"admin"}
                    />
                  }
                >
                  <Route
                    index
                    element={<DashboardHome />}
                  />
                  <Route
                    path="settings"
                    element={<SettingsDashboard />}
                  />
                  <Route
                    path="classes"
                    element={<ClassDashboard />}
                  >
                    <Route
                      index
                      element={<OverallClassDashboard />}
                    />
                    <Route
                      path=":classId"
                      element={<ClassInfoDashboard />}
                    />
                  </Route>
                </Route>
                <Route
                  path="/bookings"
                  element={<ProtectedRoute element={<Bookings />} />}
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
                  element={<ProtectedRoute element={<Reviews />} />}
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
                <Route 
                  path = "/teacher-signup/request"
                  element = {<ProtectedRoute element = {<Request />} />}
                />
                <Route 
                  path = "/teacher-signup/pending"
                  element = {<ProtectedRoute element = {<Request />} />}
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
