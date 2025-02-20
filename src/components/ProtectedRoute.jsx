
import { Navigate, useNavigate } from "react-router";
import { getToken } from "../utils/auth";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = () => {
    const token = getToken();
    console.log('token');
    if (!token) {
      return false
    }
    return true
  }
  return isAuthenticated ? children : <Navigate to="/login" />
}

export default ProtectedRoute;