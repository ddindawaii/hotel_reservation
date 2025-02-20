import axios from "axios";
import { useNavigate, useParams, useSearchParams } from "react-router";
import Button from "../components/Button";
import '../index.css';
import logo from '../assets/Logo.png';
import { useState } from "react";
import ButtonHide from "../components/ButtonHide";

const ResetPassword = () => {
  const { token } = useParams(); // Mengambil key dari URL  
  const [searchParams] = useSearchParams(); // Mengambil query parameter  
  const email = searchParams.get("email");
  const navigate = useNavigate();
  const [newpassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newpassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("token", token);
      formData.append("email", email);
      formData.append("password", newpassword);

      const response = await axios.post(
        `http://172.16.148.101:8882/api/v1/reset-password/${token}?email=${email}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set header untuk FormData  
          },
        }
      );

      console.log(response);
      alert("Password successfully updated!");
      navigate("/Login");
    } catch (err) {
      console.error("Error:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="bg-custom pt-[190px] py-[190px] pl-[120px] pr-[720px]">
        <div className="bg-white shadow-lg rounded-[20px] pt-[50px] pb-[130px] h-[644px] w-full sm:w-[600px] max-w-full">
          <img src={logo} className="h-[50px] w-[147px] mx-auto" alt="Logo" />
          <h1 className="pt-7 text-center text-black">Reset Password</h1>
          <h4 className="pt-1 text-center text-[#919191]">Please enter your new password and confirm</h4>
          {/* pesan error */}
          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
          <form action="#" method="POST" className="pt-[50px] px-[110px]" onSubmit={handleResetPassword}>
            <div className="flex flex-col gap-[30px]">

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="h4 text-[#5E5E5E] px-1">
                  New Password
                </label>
                <div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="New Password"
                    required
                    value={newpassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    className="h3 block w-full sm:w-[380px] h-12 rounded-md bg-white px-3.5 py-3.5 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#EBEBEB]"
                  />
                  <ButtonHide inputId="newPassword" className="absolute pl-[348px] transform -translate-y-9" />
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label htmlFor="confirmPassword" className="h4 text-[#5E5E5E] px-1">
                  Confirm New Password
                </label>
                <div>
                  <input
                    id="confirmPassword" // ID yang unik  
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm New Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    className="h3 block w-full sm:w-[380px] h-12 rounded-md bg-white px-3.5 py-3.5 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#EBEBEB]"
                  />
                  <ButtonHide inputId="confirmPassword" className="absolute pl-[348px] transform -translate-y-9" />
                </div>
              </div>

              <div>
                <Button type={'solid'} choice={'vtall'}>Reset Password</Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;  
