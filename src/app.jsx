import "./App.css";
import Reservation from "./page/Reservation";
import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./page/Login";
import Register from "./page/Register";
import Forget from "./page/Forget";
import ResetPassword from "./page/ResetPassword";
import Dashboard from "./page/Dashboard";
// import Profile from './page/Profile';
import Setting from './page/Setting';
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layout/DashboardLayout";
import Profile from "./page/Profile";
import Report from "./page/Report";
// import Settings from "./page/Pengaturan";
import Roompage from "./page/Roompage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget-password" element={<Forget />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="report" element={<Report />} />
            <Route path="reservations/schedules" element={<Reservation />} />
            <Route path="setting" element={<Setting />} />
            <Route path="roompage" element={<Roompage />} />

            {/* <Route path="setting" element={<Setting />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div >
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
