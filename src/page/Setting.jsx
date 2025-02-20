import { getToken } from "../utils/Auth";
import Button from "../components/Button";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
const Setting = () => {
  //state untuk data, api,
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    id: 0,
    username: "",
    email: "",
    password: "",
    isAdmin: "",
    imgUrl: "",
    isActive: "",
    language: "",
  });

  const [inputEmail, setInputEmail] = useState("");
  const [inputUsername, setInputUsername] = useState("");
  const [inputStatus, setInputStatus] = useState("");
  const [inputLanguage, setInputLanguage] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [image, setImage] = useState();
  const [imageShow, setImageShow] = useState("")

  const fileInputRef = useRef(null);
  const handleButtonChooseFile = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImage(file);
      setImageShow(imageURL)
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken("token");
      console.log("token sebelum di decode ", token);
      const decodedToken = jwtDecode(token);
      console.log("token setelah di decode ", decodedToken);
      const response = await axios.get(
        `http://172.16.148.101:8882/api/v1/users/${decodedToken.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.data) {
        setData(response.data.data);
        console.log("RESPONSE", response.data.data);

        var obj = response.data.data;
        console.log("data acuu", obj);
        setInputEmail(obj.email);
        setInputUsername(obj.username);
        setInputPassword(obj.password);
        setInputLanguage(obj.language);
        setImage(obj.imgUrl);
        setImageShow(obj.imgUrl)
      }
    } catch (err) {
      setError("Terjadi kesalahan ");
      console.error("Terjadi Kesalahan saat memuat data", err);
    } finally {
      setLoading(false);
    }
  };

  const [isEdit, setIsEdit] = useState(false);

  const editUser = async () => {
    try {
      var status;
      if (inputStatus == "true") {
        status = true;
      }
      const formData = new FormData();

      console.log("image", image)
      console.log("imageShow", imageShow)

      formData.append("email", inputEmail);
      formData.append("username", inputUsername);
      formData.append("language", inputLanguage);
      formData.append("status", inputStatus);
      formData.append("image", image);
      formData.append("password", inputPassword);

      const token = getToken("token");
      const decodedToken = jwtDecode(token);

      const response = await axios.put(
        `http://172.16.148.101:8882/api/v1/users/${decodedToken.user_id}`,
        formData, // Pass formData directly
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Ensure this is set for FormData
          },
        }
      );

      if (response.data.data) {
        alert("Berhasil Update Data");
        setIsEdit(false);
      }
    } catch (err) {
      setError("Terjadi kesalahan, coba lagi nanti.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="bg-white pl-[30px] w-[1360px] h-20 flex items-center">
        <h2>Settings</h2>
      </div>
      <div className="bg-white m-5 w-[1320px] pb-6">
        <div className="flex flex items-center gap-6 p-5">
          <div>
            <label> My Account </label>
            <img src={imageShow} className="rounded-full h-[107px] w-[107px]" />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="rounded-full w-[107px] hidden"
            onChange={handleImageChange}
          />

          {isEdit == true && (
            <Button
              className="h-12 px-6 bg-[#EB5B00] hover:bg-[#c54c00] text-white text-center rounded-[10px]"
              onClick={handleButtonChooseFile}
            >
              Change Picture
            </Button>
          )}
        </div>
        <div className="flex gap-5 p-5">
          <div className="flex flex-col">
            <label>Email</label>
            <input
              type="email"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              readOnly={!isEdit}
              className="rounded-[10px] border border-[#ebebeb] pl-4 h-12 w-[410px]"
            />
          </div>
          <div className="flex flex-col">
            <label>Username</label>
            <input
              type="username"
              value={inputUsername}
              readOnly={!isEdit}
              onChange={(e) => setInputUsername(e.target.value)}
              className="rounded-[10px] border border-[#ebebeb] pl-4 h-12 w-[410px]"
            />
          </div>
          <div className="flex flex-col">
            <label>Role</label>
            <input
              type="text"
              value={"Admin"}
              readOnly="true"
              className="rounded-[10px] border border-[#ebebeb] pl-4 h-12 w-[410px]"
            />
          </div>
        </div>
        <div className="flex gap-5 p-5">
          <div className="flex flex-col">
            <label>Status</label>
            <input
              type="text"
              value={"Active"}
              readOnly="true"
              className="rounded-[10px] border border-[#ebebeb] pl-4 h-12 w-[410px]"
            />
          </div>
          <div className="flex flex-col">
            <label>Language</label>
            <select
              onChange={(e) => setInputLanguage(e.target.value)}
              value={inputLanguage}
              disabled={!isEdit}
              className="rounded-[10px] border border-[#ebebeb] pl-4 h-12 w-[410px]"
            >
              <option value="english">English</option>
              <option value="indonesia">Indonesia</option>
            </select>
          </div>
        </div>
        <hr className="border border-gray-300 w-[1280px] m-5" />
        <div className="px-5">
          <h2>Password</h2>
        </div>
        <div className="flex flex-col p-5">
          <label>Password</label>
          <input
            type="password"
            onChange={(e) => setInputPassword(e.target.value)}
            readOnly={!isEdit}
            className="rounded-[10px] border border-[#ebebeb] pl-4 h-12 w-[410px]"
          />
        </div>
        <div className="pt-[30px] ml-5">
          {isEdit == false && (
            <Button
              className="w-[60px] h-12 bg-[#EB5B00] hover:bg-[#c54c00] text-white text-center rounded-[10px]"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </Button>
          )}

          {isEdit == true && (
            <Button
              className="h-12 px-6 bg-[#EB5B00] hover:bg-[#c54c00] text-white text-center rounded-[10px]"
              onClick={() => editUser()}
            >
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* Logic Edit User */}
      {/* <div className="bg-white m-5 w-[1320px] h-[622px]">
        <div className="flex flex-col p-5">
          <label> My Account </label>
          <input
            type="image"
            className="rounded-full w-[107px]"
            src={data.imgUrl}
          />
        </div>
        <div className="flex gap-5 p-5">
          <div className="flex flex-col">
            <label>Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setInputEmail(e.target.value)}
              className="rounded-[10px] border border-[#ebebeb] pl-4 h-12 w-[410px]"
            />
          </div>
          <div className="flex flex-col">
            <label>Username</label>
            <input
              type="username"
              value={data.username}
              onChange={(e) => setInputUsername(e.target.value)}
              className="rounded-[10px] border border-[#ebebeb] pl-4 h-12 w-[410px]"
            />
          </div>
          <div className="flex flex-col">
            <label>Role</label>
            <input
              type=""
              value={""}
              onChange={""}
              className="rounded-[10px] border border-[#ebebeb] pl-4 h-12 w-[410px]"
            />
          </div>
        </div>
        <div className="flex gap-5 p-5">
          <div className="flex flex-col">
            <label>Status</label>
            <select
              onChange={(e) => setInputStatus(e.target.value)}
              className="rounded-[10px] border border-[#ebebeb] pl-4 h-12 w-[410px]"
              defaultValue={data.isActive ? "true" : "false"}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label>Language</label>
            <select
              onChange={(e) => setInputLanguage(e.target.value)}
              defaultValue={
                data.language == "english" ? "english" : "indonesia"
              }
              className="rounded-[10px] border border-[#ebebeb] pl-4 h-12 w-[410px]"
            >
              <option value="english">English</option>
              <option value="indonesia">Indonesia</option>
            </select>
          </div>
        </div>
        <hr className="border border-gray-300 w-[1280px] m-5" />
        <div className="px-5">
          <h2>Password</h2>
        </div>
        <div className="flex flex-col p-5">
          <label>Password</label>
          <input
            type="password"
            value={""}
            onClick={(e) => setInputPassword(e.target.value)}
            className="rounded-[10px] border border-[#ebebeb] pl-4 h-12 w-[410px]"
          />
        </div>
        <div className="pt-[30px] ml-5">
          <Button
            className="w-[60px] h-12 bg-[#EB5B00] hover:bg-[#c54c00] text-white text-center rounded-[10px]"
            onClick={() => editUser()}
          >
            Edit
          </Button>
        </div>
      </div> */}
    </>
  );
};

export default Setting;
