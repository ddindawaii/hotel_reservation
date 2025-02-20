import { useNavigate } from "react-router";
import Button from "../components/Button";
import '../index.css';
import logo from '../assets/Logo.png';
import { useState } from "react";
import axios from "axios";

const Forget = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleForget = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    try {

      // Panggil API untuk memvalidasi email
      const response = await axios.post("http://172.16.148.101:8882/api/v1/forget-password", {
        email,
      });

      if (response.data.success) {
        navigate("/resetPassword");
      } else {
        setError(response.data.message || "Email tidak ditemukan. Mohon coba lagi");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Terjadi kesalahan. Mohon coba lagi"
      );
    }
  };
  return (
    <div className="bg-custom pt-[190px] py-[190px] pl-[120px] pr-[720px]">
      <div className="bg-white shadow-lg rounded-[20px] pt-[50px] pb-[130px] h-[644px] w-full sm:w-[600px] max-w-full">
        <img src={logo} className="h-[50px] w-[147px] mx-auto" alt="Logo" />
        <h1 className="pt-7 text-center text-black">Reset Password</h1>
        <h4 className="pt-1 text-center text-[#919191]">
          Please enter your registered email here
        </h4>
        <form onSubmit={handleForget} className="pt-[50px] px-[110px]">
          <div className="flex flex-col gap-[30px]">
            
            {/* EMAIL */}
            <div>
              <label htmlFor="email" className="h4 text-[#5E5E5E] px-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                autoComplete="email"
                className="h3 block w-full sm:w-[380px] h-12 rounded-md bg-white px-3.5 py-3.5 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#EBEBEB]"
              />
              {error && (
                <p className="text-red-500 text-sm mt-2 items-center">{error}</p>
              )}
            </div>
            <div>
              <Button type="solid" choice="vtall">submit</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Forget;