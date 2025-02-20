import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import "../index.css";
import Button from "../components/Button";
import { getToken, removeToken } from "../utils/Auth.js";
const Dashboard = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState({
    totalReservation: 0,
    totalSnackPrice: 0,
    totalPrice: 0,
    totalRooms: 0,
    totalVisitors: 0,
    totalOmzet: 0,
    roomDetails: [],
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken()
    navigate("/login");
  }


  // Fungsi untuk fetch data dari API
  const fetchData = async () => {
    try {
      const token = getToken("token");
      const response = await axios.get(
        "http://172.16.148.101:8882/api/v1/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Tambahkan Bearer Token di sini
          },
          params: {
            start_date: startDate || undefined, // Kirim nilai undefined jika kosong
            end_date: endDate || undefined,
          },
        }
      );

      if (response.data) {
        setData(response.data.data);
        console.log("RESPONSE", response.data);
      }
      console.log(data);
    } catch (err) {
      console.error("Terjadi kesalahan saat memuat data.", err);
    }
  };



  // Panggil fetchData saat halaman pertama kali dimuat atau filter berubah
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="bg-white flex items-center pl-[30px] h-20 w-[1360px] flex justify-between">
        <h2>Dashboard</h2>
        <div className="mr-12">
          <a href="#" onClick={handleLogout}>Logout</a>
        </div>
      </div>

      {/* Form Input Tanggal */}
      <div className="bg-white w-[1320px] h-[114px] mx-5 mt-5 flex align-baseline">
        <div className="flex-row mt-5 w-[515px]">
          <label className="pl-5">Start Date </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="ml-5 mt-[2px] px-[14px] w-[515px] h-[48px] rounded-[10px] border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div className="flex-row pl-5 mt-5 w-[515px]">
          <label className="pl-5">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="ml-5 mt-[2px] px-[14px] w-full h-[48px] rounded-[10px] border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div className="mt-[46px] pl-[60px]">
          <Button
            onClick={fetchData} // Tambahkan ini jika tetap ingin tombol manual
            type="solid"
            className="w-[210px] h-[48px]"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Tampilan Total */}
      <div className="grid grid-cols-4 gap-5 m-5">
        <div className="bg-white p-5 rounded-[10px] shadow-sm">
          <p className="text-lg text-[#5E5E5E]">Total Omzet</p>
          <h1 className="text-[#000000]">Rp {data.totalOmzet}</h1>
        </div>
        <div className="bg-white p-5 rounded-[10px] shadow-sm">
          <p className="text-lg text-[#5E5E5E]">Total Reservation</p>
          <h1 className="text-[#000000]">{data.totalReservation}</h1>
        </div>
        <div className="bg-white p-5 rounded-[10px] shadow-sm">
          <p className="text-lg text-[#5E5E5E]">Total Visitors</p>
          <h1 className="text-[#000000]">{data.totalVisitors}</h1>
        </div>
        <div className="bg-white p-5 rounded-[10px] shadow-sm">
          <p className="text-lg text-[#5E5E5E]">Total Rooms</p>
          <h1 className="text-[#000000]">{data.totalRooms}</h1>
        </div>
      </div>

      {/* Daftar Room Details */}
      <div className="grid grid-cols-4 gap-5 m-5">
        {data?.roomDetails?.length > 0 ? (
          data.roomDetails.map((room) => (
            <div
              key={room.roomId}
              className="bg-white p-5 rounded-[10px] shadow-sm flex justify-between items-center"
            >
              <div>
                <h2 className="text-[#5E5E5E]">{room.roomName}</h2>
                <p className="text-[#787878]">Percentage of Usage</p>
                <h2 className="text-[#000000]">{parseFloat(room.presentage).toFixed(2)}%</h2>
                <p className="text-[#787878]">Omzet</p>
                <h2 className="text-[#000000]">Rp {room.roomOmzet ?? 0}</h2>

              </div>
              <div className="">
                {/* <DoughnutChart percentage={room.presentage} /> */}
                <svg height="95" viewBox="0 0 36 36" width="95">
                  <circle className="text-gray-300" cx="18" cy="18" fill="none" r="16" stroke="currentColor" strokeWidth="4" />
                  {/* <circle className="text-orange-500" cx="18" cy="18" fill="none" r="16" stroke="currentColor"
                    strokeDasharray={(room.presentage) - 100}, {(room.presentage)} strokeWidth="4" strokeLinecap="round"></circle> */}
                  <circle
                    className="text-orange-500"
                    cx="18"
                    cy="18"
                    fill="none"
                    r="16"
                    stroke="currentColor"
                    strokeDasharray={`${100 - (100 - room.presentage)} ${100 - room.presentage}`}
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>

              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-4">
            Data tidak tersedia.
          </p>
        )}
      </div>
    </>
  );
};

export default Dashboard;

// // import { useEffect, useState } from "react";
// // import { httpService } from "../utils/auth"
// // const Dashboard = () => {
// //   const [profile, setProfil] = useState({});
// //   const fetchProfile = async () => {
// //     const response = await httpService.get('/auth/profile');
// //     console.log('response profile', response)
// //     setProfil(response.data)
// //   }

// //   useEffect(() => {
// //     fetchProfile()
// //   }, [])
// //   return (
// //     <div>
// //       <img src={profile.avatar} alt="profile" />
// //       Welcome {profile.name}
// //     </div>
// //   );

// // }

// // export default Dashboard;