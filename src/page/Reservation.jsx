import { useEffect, useState } from "react";
import axios from "axios";
import "../index.css";
import Button from "../components/Button";
import { getToken } from "../utils/Auth";
import Modal from "../components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

const Reservation = () => {
  const today = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedToday = today.toLocaleDateString("en-ID", options);

  var year = today.getFullYear();
  var month = String(today.getMonth() + 1).padStart(2, "0");
  var day = String(today.getDate()).padStart(2, "0");
  var defaultDate = year + "-" + month + "-" + day;

  // State untuk tanggal mulai dan akhir
  const [startDate, setStartDate] = useState(defaultDate);
  const [endDate, setEndDate] = useState(defaultDate);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openModalDetail = () => setIsModalDetailOpen(true);
  const closeModalDetail = () => setIsModalDetailOpen(false);
  // State untuk data dan status loading/error
  const [data, setData] = useState([]);
  const [dataRooms, setDataRooms] = useState([]);
  const [dataSnacks, setDataSnacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isHiddenSnack, setIsHiddenSnack] = useState(true);

  // Fungsi untuk fetch data dari API
  const fetchData = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = getToken("token");
      console.log(token);

      const response = await axios.get(
        "http://172.16.148.101:8882/api/v1/reservations/schedules",
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

      if (response.data && response.data.data) {
        setData(response.data.data);
      }
    } catch (err) {
      setError("Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.");
      console.error("Terjadi kesalahan saat memuat data.", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken("token");
      const response = await axios.get(
        "http://172.16.148.101:8882/api/v1/rooms",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Tambahkan Bearer Token di sini
          },
        }
      );

      console.log("data room : ", response.data);
      if (response.data) {
        setDataRooms(response.data);
      }
    } catch (err) {
      setError("Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.");
      console.error("Terjadi kesalahan saat memuat data.", err);
    } finally {
      setLoading(false);
    }
  };

  const inquiryId = async (id) => {
    try {
      const token = getToken("token");
      const response = await axios.post(
        ` http://172.16.148.101:8882/api/v1/reservations/${id} `,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Tambahkan Bearer Token di sini
          },
        }
      );
    } catch (err) {
      setError("Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.");
      console.error("Terjadi kesalahan saat memuat data.", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataSnacks = async (e) => {
    // e.preventDefault();
    // setLoading(true);
    // setError(null);
    try {
      const token = getToken("token");
      const response = await axios.get(
        "http://172.16.148.101:8882/api/v1/snacks",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Tambahkan Bearer Token di sini
          },
        }
      );

      console.log("data snack : ", response.data.data);
      if (response.data.data) {
        setDataSnacks(response.data.data);
      }
    } catch (err) {
      setError("Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.");
      console.error("Terjadi kesalahan saat memuat data.", err);
    } finally {
      setLoading(false);
    }
  };

  const [dataReservation, setDataReservation] = useState({
    bookingDate: "",
    company: "",
    endTime: "",
    name: "",
    notes: "",
    participants: 0,
    phone: "",
    roomId: 0,
    snackId: 0,
    startTime: "",
  });

  const [dataInquiry, setDataInquiry] = useState({
    id: 0,
    userId: 0,
    roomId: 0,
    roomName: "",
    roomType: "",
    roomCapacity: 0,
    roomPrice: 0,
    bookingDate: "",
    startTime: "",
    endTime: "",
    duration: 0,
    name: "",
    phone: "",
    company: "",
    participants: 0,
    snackId: 0,
    snackName: "",
    snackCategory: "",
    snackPrice: 0,
    totalRoomPrice: 0,
    totalSnackPrice: 0,
    totalPrice: 0,
    notes: "",
    createdAt: "",
    updatedAt: "",
  });

  const handleChangeDataReservation = (e) => {
    console.log(e.target.name);

    setDataReservation({
      ...dataReservation,
      [e.target.name]:
        e.target.name === "participants" ||
          e.target.name === "roomId" ||
          e.target.name === "snackId"
          ? parseInt(e.target.value, 10) || 0 // Convert to integer, default to 0 if NaN
          : e.target.value,
    });
  };

  const handleSubmitDataReservation = async (e) => {
    e.preventDefault();
    console.log("data dikirim : ", dataReservation);

    try {
      const token = getToken("token");
      console.log(token);

      const response = await axios.post(
        "http://172.16.148.101:8882/api/v1/reservations/inquiry",
        dataReservation,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Tambahkan Bearer Token di sini
          },
        }
      );

      console.log("response save inquiry", response.data.data);
      setDataInquiry(response.data.data);
      openModalDetail();
    } catch (err) {
      alert(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowSnackInput = async (e) => {
    if (e.target.checked) {
      setIsHiddenSnack(false);
    } else {
      setIsHiddenSnack(true);
    }
  };

  const showToast = (message) => {
    Toastify({
      text: message,
      duration: 2000,
      destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#FFF",
        color: "#222",
        borderLeft: "2px solid #00AF10",
      },
      onClick: function () { }, // Callback after click
    }).showToast();
  };

  const handleSubmit = async (id) => {
    closeModal();
    closeModalDetail();
    inquiryId(id);
    showToast("New Reservation Successfully added");
  };

  // Panggil fetchData saat halaman pertama kali dimuat atau filter berubah
  useEffect(() => {
    fetchData();
    fetchDataRooms();
    fetchDataSnacks();
  }, [startDate, endDate]);

  return (
    <>
      <div className="bg-white flex items-center pl-[30px] h-20 w-[1360px]">
        <h2>Reservation Schedule</h2>
      </div>

      {/* Form Input Tanggal */}
      <div className="bg-white w-[1320px] h-[114px] mx-5 mt-5 flex align-baseline">
        <div className="flex-row">
          <input
            type="text"
            value={formattedToday}
            readOnly
            className="mt-[46px] pl-5 border-r-2 border-[#c4c4c4c4] p-2 w-[279px] h-12 text-xl font-normal"
          />
        </div>
        <div className="flex-row mt-5 w-[515px]">
          <label className="pl-5">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="ml-5 mt-[2px] px-[14px] w-full h-[48px] rounded-[10px] border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div className="flex-row pl-5 mt-5 w-[515px]">
          <label className="pl-5">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="ml-5 mt-[2px] px-[14px] w-full  h-[48px] rounded-[10px] border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div className="mt-[46px]">
          <Button
            onClick={fetchData}
            type="outline"
            className="ml-10 w-[155px] h-[48px] font-normal"
          >
            Search
          </Button>
        </div>
        <div className="mt-[46px] px-5 text-center">
          <Button
            onClick={openModal}
            type="solid"
            className="w-[198px] h-[48px] text-base text-nowrap"
          >
            + Add New Reservation
          </Button>
        </div>
      </div>

      {/* Indikator loading */}
      {loading && (
        <div className="mt-8 text-center">
          <p>Loading...</p>
        </div>
      )}

      {/* Pesan error */}
      {error && (
        <div className="mt-8 text-center text-red-500">
          <p>{error}</p>
        </div>
      )}

      {/* Tabel data */}
      {!loading && !error && data.length > 0 && (
        <div className="mx-5 mt-1 bg-white">
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="border  border-r-slate-300  h-[70px] text-2xl">
                  Time
                </th>
                <th className="border border-gray-300  w-[400px] text-2xl"> Room Name</th>
                <th className="border border-gray-300 w-[400px] text-2xl">Company</th>
                <th className="border border-gray-300 w-[400px] text-2xl">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((reservation) => (
                <tr key={reservation.id}>
                  <td className="border p-3">
                    {reservation.startTime.split("T")[1].substring(0, 5)} -{" "}
                    {reservation.endTime.split("T")[1].substring(0, 5)}
                  </td>
                  <td className="border p-3">{reservation.roomName}</td>
                  <td className="border p-3">{reservation.company}</td>
                  <td className="border p-3">{reservation.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pesan jika tidak ada data */}
      {!loading && !error && data.length === 0 && (
        <div className="mt-8 text-center">
          <p>Tidak ada data reservasi yang tersedia.</p>
        </div>
      )}

      {/* Logika Add Reservation */}
      <Modal isOpen={isModalOpen} closeModal={closeModal}>
        <div className="bg-white w-[456px] h-[1136px]">
          <form>
            <div className="px-5 h-20 pt-5 flex justify-between">
              <div>
                <h5>Reservation Form</h5>
              </div>
              <div>
                <a href="#" onClick={closeModal}>
                  <FontAwesomeIcon icon={faTimes} />
                </a>
              </div>
            </div>
            <hr className="border border-gray-300 w-[456px]" />
            <div className="h-[114px] pt-5 pl-5">
              <label className="h4 text-[#5e5e5e]">Room Name</label>
              <select
                className="w-[416px] h-12 rounded-[10px] px-[14px] border border-[#ababab]"
                name="roomId"
                onChange={handleChangeDataReservation}
              >
                <option></option>
                {dataRooms.map((room) => (
                  <option value={room.id}>{room.name}</option>
                ))}
              </select>
            </div>
            <hr className="border border-gray-300 w-[456px]" />
            <div className=" bg-white h-[854px] pt-5 pl-5">
              <div>
                <label className=" h4 text-[#5e5e5e]">Name</label>
                <input
                  type="text"
                  className="h-12 border border-[#ababab] rounded-[10px] px-[14px] w-[416px]"
                  onChange={handleChangeDataReservation}
                  name="name"
                />
              </div>
              <div className="pt-[15px]">
                <label className=" h4 text-[#5e5e5e]">No.Hp</label>
                <input
                  type="text"
                  className="h-12 border border-[#ababab] rounded-[10px] px-[14px] w-[416px]"
                  onChange={handleChangeDataReservation}
                  name="phone"
                />
              </div>
              <div className="pt-[15px]">
                <label className=" h4 text-[#5e5e5e] ">
                  Company/Organization
                </label>
                <input
                  type="text"
                  className="h-12 border border-[#ababab] rounded-[10px] px-[14px] w-[416px]"
                  onChange={handleChangeDataReservation}
                  name="company"
                />
              </div>
              <div className="pt-[15px]">
                <label className=" h4 text-[#5e5e5e]">Date Reservation</label>
                <input
                  type="date"
                  className="h-12 border border-[#ababab] rounded-[10px] px-[14px] w-[416px]"
                  onChange={handleChangeDataReservation}
                  name="bookingDate"
                />
              </div>
              <div className="flex justify-between">
                <div className="pt-[15px]">
                  <label className=" h4 text-[#5e5e5e]">Start Time</label>
                  <input
                    type="time"
                    className=" block h-12 border border-[#ababab] rounded-[10px] px-[14px] w-[203px]"
                    onChange={handleChangeDataReservation}
                    name="startTime"
                  />
                </div>
                <div className="pt-[15px]">
                  <label className=" h4 text-[#5e5e5e]">End Time</label>
                  <input
                    type="time"
                    className=" block h-12 border border-[#ababab] rounded-[10px] px-[14px] w-[203px]"
                    onChange={handleChangeDataReservation}
                    name="endTime"
                  />
                </div>
              </div>
              <div className="pt-[15px]">
                <label className=" h4 text-[#5e5e5e]">Total Participants</label>
                <input
                  type="number"
                  className=" block h-12 border border-[#ababab] rounded-[10px] px-[14px] w-[416px]"
                  name="participants"
                  onChange={handleChangeDataReservation}
                />
              </div>
              <br />
              <div>
                <input
                  className="size-[18px] rounded-[4px]"
                  type="checkbox"
                  onChange={handleShowSnackInput}
                />
                <label className="p-[10px]">Add Snack</label>
              </div>
              <div className={`pt-[15px] ${isHiddenSnack ? "hidden" : ""}`}>
                <label className=" h4 text-[#5e5e5e]">Snack</label>
                <select
                  className=" block h-12 border border-[#ababab] rounded-[10px] px-[14px] w-[416px]"
                  name="snackId"
                  onChange={handleChangeDataReservation}
                >
                  <option></option>
                  {dataSnacks.map((snack) => (
                    <option value={snack.id}>{snack.name}</option>
                  ))}
                </select>
              </div>
              <div className="pt-[15px]">
                <label className=" h4 text-[#5e5e5e]">Note</label>
                <textarea
                  id=""
                  className=" block border border-[#ababab] rounded-[10px] px-[14px] w-[416px]"
                  rows="5"
                  onChange={handleChangeDataReservation}
                  name="notes"
                ></textarea>
              </div>
            </div>
            <button
              className="m-5 text-white bg-orange-500 rounded-md w-[416px] h-12 hover:bg-orange-600"
              onClick={handleSubmitDataReservation}
              type="button"
            >
              Next
            </button>
          </form>
        </div>
      </Modal>

      {/* Start Modal Detail */}

      <Modal
        isOpen={isModalDetailOpen}
        closeModal={closeModalDetail}
        className="h-[985px]"
      >
        <div className="flex justify-between">
          <div>
            <h2 className="px-4 text-xl font-normal text-black">
              Detail Reservation
            </h2>
          </div>
          <div>
            <a href="#" onClick={closeModalDetail}>
              <FontAwesomeIcon icon={faTimes} />
            </a>
          </div>
        </div>
        <hr className="border-b-0 border-gray-300 my-4" />
        <div className="px-4">
          <h1 className="text-xl text-black">Room Details</h1>
          <div className="mt-2 flex justify-between">
            <div>Room Name</div>
            <div className="text-black">{dataInquiry.roomName}</div>
          </div>
          <div className="mt-2 flex justify-between">
            <div>Room Type</div>
            <div className="text-black">{dataInquiry.roomType}</div>
          </div>
          <div className="mt-2 flex justify-between">
            <div>Capacity</div>
            <div className="text-black">{dataInquiry.roomCapacity} people</div>
          </div>
          <div className="mt-2 flex justify-between">
            <div>Price/hours</div>
            <div className="text-black">Rp{dataInquiry.roomPrice}</div>
          </div>
        </div>
        <hr className="border-b-0 border-gray-300 my-4" />
        <div className="px-4">
          <h1 className="text-xl text-black">Personal Data</h1>
        </div>
        <div className="px-4">
          <div className="mt-2 flex justify-between">
            <div>Name</div>
            <div className="text-black">{dataInquiry.name}</div>
          </div>
          <div className="mt-2 flex justify-between">
            <div>No.Hp</div>
            <div className="text-black">{dataInquiry.phone}</div>
          </div>
          <div className="mt-2 flex justify-between">
            <div>Company/Organization</div>
            <div className="text-black">{dataInquiry.company}</div>
          </div>
          <div className="mt-2 flex justify-between">
            <div>Date Reservation</div>
            <div className="text-black">{dataInquiry.bookingDate}</div>
          </div>
          <div className="mt-2 flex justify-between">
            <div>Duration</div>
            <div className="text-black">{dataInquiry.duration}</div>
          </div>
          <div className="mt-2 flex justify-between">
            <div>Total Participants</div>
            <div className="text-black">{dataInquiry.participants}</div>
          </div>
        </div>
        <hr className="border-b-0 border-gray-300 my-4" />
        <div className="px-4">
          <h1 className="text-xl text-black">Snack Details</h1>
        </div>
        <div className="px-4">
          <div className="mt-2 flex justify-between">
            <div>Snack Category</div>
            <div className="text-black">{dataInquiry.snackCategory}</div>
          </div>
          <div className="mt-2 flex justify-between">
            <div>Packages</div>
            <div className="text-black">{dataInquiry.snackName}</div>
          </div>
        </div>
        <hr className="border-b-0 border-gray-300 my-4" />
        <div className="px-4">
          <h1 className="text-xl text-black">Total</h1>
        </div>
        <div className="px-4">
          <div className="mt-2 flex justify-between items-center">
            <div>
              <div>{dataInquiry.roomName}</div>
              <div className="text-black">
                {dataInquiry.duration} x {dataInquiry.roomPrice}
              </div>
            </div>
            <div className="text-black">{dataInquiry.totalRoomPrice}</div>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <div>
              <div>
                {dataInquiry.snackName} - Rp{dataInquiry.snackPrice}/box
              </div>
              <div className="text-black">
                {dataInquiry.totalSnackPrice / dataInquiry.snackPrice} x{" "}
                {dataInquiry.snackPrice}
              </div>
            </div>
            <div className="text-black">{dataInquiry.totalSnackPrice}</div>
          </div>
        </div>
        <hr className="border-b-0 border-gray-300 my-4 " />
        <div className="mt-2 flex justify-end items-center mx-4">
          <div>
            <div className="text-black font-bold text-2xl">
              Rp{dataInquiry.totalPrice}
            </div>
          </div>
        </div>
        <div className="mt-2 flex justify-between items-center mx-4 mb-24">
          <div>
            <div>Note</div>
            <div className="text-xs">{dataInquiry.notes}</div>
          </div>
        </div>
        <div className="flex fixed gap-4 justify-between bottom-0 mt-4 shadow-lg shadow-[0_-10px_15px_rgba(0,0,0,0.3)] w-full p-6">
          <button
            onClick={(e) => handleSubmit(dataInquiry.id)}
            className="px-6 py-2 text-white bg-orange-500 rounded-md w-full hover:bg-orange-600"
          >
            Submit
          </button>
        </div>
      </Modal>
      {/* End Modal Detail */}
    </>
  );
};

export default Reservation;

//Fungsi untuk format data
// const formatDate = (date) => {
//   const options = {
//     weekday: 'long',
//     day: 'numeric',
//     month: 'long',
//     year: 'numeric'
//   };
//   return date.toLocaleDateString('us-US', options);
// };
// const currentDate = new Date();

// import { useEffect, useState } from "react";
// import { httpService } from "../utils/auth"
// const Dashboard = () => {
//   const [profile, setProfil] = useState({});
//   const fetchProfile = async () => {
//     const response = await httpService.get('/auth/profile');
//     console.log('response profile', response)
//     setProfil(response.data)
//   }

//   useEffect(() => {
//     fetchProfile()
//   }, [])
//   return (
//     <div>
//       <img src={profile.avatar} alt="profile" />
//       Welcome {profile.name}
//     </div>
//   );

// }

// export default Dashboard;