import { useState } from "react";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import ButtonHide from "../components/ButtonHide";
import '../index.css';
import logo from '../assets/Logo.png';
// import Cookies from "js-cookie";
// import axios from "axios";
import httpService, { setRole } from "../utils/auth";
import { setToken } from "../utils/Auth";
import { jwtDecode } from 'jwt-decode';


const Login = () => {
  const goToReset = () => {
    navigate("/forget-password");
  };
  const goToRegister = () => {
    navigate("/register");
  };

  //Fungsi Login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  //Fungsi MIN LENGTH
  const MIN_LENGTH_USERNAME = 2;
  const MIN_LENGTH_PASSWORD = 6;


  const handleLogin = async (e) => {
    e.preventDefault();

    if (username.length < MIN_LENGTH_USERNAME) {
      setErrorMessage(`Username harus memiliki minimal ${MIN_LENGTH_USERNAME} karakter.`);
      return;
    }
    if (password.length < MIN_LENGTH_PASSWORD) {
      setErrorMessage(`Password harus memiliki minimal ${MIN_LENGTH_PASSWORD} karakter.`);
      return;
    }


    const payload = {
      username,
      password
    }

    try {
      const response = await httpService.post('/login', payload);
      console.log('response', response);

      const { token
      } = response.data.data;
      setToken(token);
      const decodeData = jwtDecode(token);
      console.log('decodeData', decodeData)
      setRole(decodeData.is_admin ? 'admin' : 'user')


      if (decodeData.is_admin) {
        navigate("/dashboard");
      } else {
        navigate("/dashboard/roompage");
      }


    } catch (error) {
      // Tampilkan pesan error
      console.log('error', error)
      setErrorMessage(
        error.response?.data?.message || "Terjadi kesalahan saat login."
      );
    }
  };

  return (
    <>
      <div className="bg-custom pt-[190px] py-[190px] pl-[120px] pr-[720px]">
        <div className="bg-white shadow-lg rounded-[20px] pt-[50px] pb-[130px] h-[644px] w-full sm:w-[600px] max-w-full">
          <img src={logo} className="h-[50px] w-[147px] mx-auto" />
          <h1 className="pt-7 text-center text-black">Welcome Back!</h1>
          <h4 className="pt-1 text-center text-[#919191]">Please enter username and password here!</h4>
          <form action="#" method="POST" className="pt-[50px] px-[110px]">
            <div className="flex flex-col gap-[30px]">

              {/* USERNAME */}
              <div>
                <label htmlFor="username" className="h4 text-[#5E5E5E] px-1">
                  Username
                </label>
                <div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Username"
                    required
                    autoComplete="username"
                    minLength={MIN_LENGTH_USERNAME}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h3 block w-full sm:w-[380px] h-12 rounded-md bg-white px-3.5 py-3.5 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#EBEBEB]"
                  />
                </div>
              </div>


              <div className="flex flex-col">
                <label htmlFor="password" className="h4 text-[#5E5E5E] px-1">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    autoComplete="password"
                    minLength={MIN_LENGTH_PASSWORD}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h3 block w-full sm:w-[380px] max-w-full h-12 rounded-md bg-white px-3.5 py-3.5 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#EBEBEB]"
                  />
                  <ButtonHide inputId="password" className="absolute pl-[348px] transform -translate-y-9" />
                  <span
                    onClick={goToReset}
                    className="cursor-pointer hover:underline text-[10px] text-[#ABABAB] ">
                    Forget Password?
                  </span>

                </div>
              </div>
              <div>
                <Button onClick={handleLogin} type={'solid'} choice={'vtall'}>Login</Button>
              </div>
            </div>
            {errorMessage && (
              <p className="text-red-500 text-center">{errorMessage}</p>
            )}
            <p className="p text-center mt-[10px]">
              Don&apos;t have an account?{" "}
              <span
                onClick={goToRegister}
                className="span cursor-pointer hover:underline">
                Register
              </span>
            </p>
          </form>
        </div>
      </div>


    </>

  );
}

export default Login;
