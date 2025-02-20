import { useNavigate } from "react-router";
import Button from "../components/Button";
import '../index.css';
import logo from '../assets/Logo.png';
import { useState } from "react";
import ButtonHide from "../components/ButtonHide";
import axios from "axios";
import Cookies from "js-cookie";



const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const MIN_LENGTH_USERNAME = 2;
  const MIN_LENGTH_PASSWORD = 6;

  const handleRegister = async (e) => {
    e.preventDefault();



    //validasi min length
    if (username.length < MIN_LENGTH_USERNAME) {
      setErrorMessage(`Username harus memiliki minimal ${MIN_LENGTH_USERNAME} karakter.`);
      return;
    }
    if (password.length < MIN_LENGTH_PASSWORD) {
      setErrorMessage(`Password harus memiliki minimal ${MIN_LENGTH_PASSWORD} karakter.`);
      return;
    }
    // Validasi konfirmasi password
    if (password !== confirmPassword) {
      setErrorMessage("Password dan Konfirmasi Password Tidak Cocok !");
      return;
    }


    try {
      const response = await axios.post("http://172.16.148.101:8882/api/v1/register", {
        username,
        email,
        password,
      });

      // Periksa apakah registrasi berhasil
      const { token } = response.data;
      Cookies.set("authToken", token, {
  
      });
      navigate("/login");

    } catch (error) {
      // Tampilkan pesan error
      setErrorMessage(
        error.response?.data?.message || "Terjadi kesalahan saat login."
      );
    }
  };

  const goToLogin = () => {
    navigate('/login');
  }

  return (
    <>
      <div className="bg-custom pt-[104px] pl-[120px] pr-[720px]">
        <div className="bg-white shadow-lg rounded-[20px] pt-[50px] pb-[130px] h-[815px] w-full sm:w-[600px] max-w-full">
          <img src={logo} className="h-[50px] w-[147px] mx-auto" />
          <h1 className="pt-7 text-center text-black">Welcome Back!</h1>
          <h4 className="pt-1 text-center text-[#919191]">Create your account here!</h4>

          {/* Tampilan Login */}
          <form action="#" method="POST" onSubmit={handleRegister} className="pt-[50px] px-[110px]">
            <div className="flex flex-col gap-[30px]">
              {/* USERNAME */}
              <div>
                <label htmlFor="username" className="h4 text-[#5E5E5E] px-1">
                  Username
                </label>
                <div className="">
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
                    className="h3 block w-full sm:w-[380px] h-12 rounded-[10px] bg-white px-3.5 py-3.5 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#EBEBEB]"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label htmlFor="email" className="h4 text-[#5E5E5E] px-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  autoComplete="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h3 block w-full sm:w-[380px] h-12 rounded-[10px] bg-white px-3.5 py-3.5 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#EBEBEB]"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="h4 text-[#5E5E5E] px-1">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  minLength={MIN_LENGTH_PASSWORD}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="h3 block w-full sm:w-[380px] max-w-full h-12 rounded-[10px] bg-white px-3.5 py-3.5 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#EBEBEB]"
                />
                <ButtonHide inputId="password" className="absolute pl-[348px] transform -translate-y-9" />

              </div>


              {/* Confirm Password */}
              <div>
                <label htmlFor="password" className="h4 text-[#5E5E5E] px-1">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  required
                  autoComplete="confirm-password"
                  value={confirmPassword}
                  minLength={MIN_LENGTH_PASSWORD}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h3 block w-full sm:w-[380px] max-w-full h-12 rounded-[10px] bg-white px-3.5 py-3.5 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#EBEBEB]"
                />
                <ButtonHide inputId="confirmPassword" className="absolute pl-[348px] transform -translate-y-9" />

              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm text-center">{errorMessage}</p>
              )}
              <div>
                <Button onClick={'goToLogin'} type={'solid'} choice={'vtall'}>Create Account</Button>
              </div>

            </div>
            <p className="mt-[10px] p text-center">
              Already have an account?
              <span
                onClick={goToLogin}
                className="span cursor-pointer hover:underline">
                Login
              </span>
            </p>
          </form>
        </div >
      </div >


    </>

  );
}

export default Register;
