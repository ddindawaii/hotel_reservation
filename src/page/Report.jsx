import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faEdit,
  faTimes,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { getToken } from "../utils/Auth";
import axios from "axios";

const Report = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const today = new Date();
  var year = today.getFullYear();
  var month = String(today.getMonth() + 1).padStart(2, "0");
  var day = String(today.getDate()).padStart(2, "0");
  var defaultDate = year + "-" + month + "-" + day;

  var bgColorStatus = {
    booked: "#FF802F",
    paid: "#00AF10",
    cancelled: "#FF3333",
  };

  const showToast = (message) => {
    Toastify({
      text: message,
      duration: 3000,
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

  const showAlert = () => {
    Swal.fire({
      title: "Are you sure want to cancel reservation?",
      text: "",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsModalOpen(false);
        showToast("Reservation Successfully Canceled");
      }
    });
  };

  // State untuk tanggal mulai dan akhir
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [roomId, setRoomId] = useState(0);
  const [roomType, setRoomType] = useState();
  const [roomStatus, setRoomStatus] = useState();
  const [dataReservation, setReservation] = useState([]);
  const [page, setPage] = useState(1);
  const [dataDetailReservation, setDetailReservation] = useState(null);

  const fetchDataReservation = async () => {
    try {
      setError(false);
      const token = getToken("token");
      const response = await axios.get(
        "http://172.16.148.101:8882/api/v1/reservations",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Tambahkan Bearer Token di sini
          },
          params: {
            start_date: startDate || defaultDate, // Kirim nilai undefined jika kosong
            end_date: endDate || defaultDate,
            room_type: roomType || undefined,
            status: roomStatus || undefined,
          },
        }
      );

      console.log("data reservation : ", response.data.data);
      if (response.data.data) {
        setReservation(response.data.data);
        console.log(dataPagination())

        dataPagination().map((reservation, index) => {
          console.log("reservation " + index, reservation)
        })
        buttonPagination()
      }
    } catch (err) {
      setError("Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.");
      console.error("Terjadi kesalahan saat memuat data.", err);
    } finally {
      setLoading(false);
    }
  };

  const exportDataReservation = async (e) => {
    try {
      const token = getToken("token");
      const response = await axios.get(
        "http://172.16.148.101:8882/api/v1/reservations/export",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Tambahkan Bearer Token di sini
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
          params: {
            start_date: startDate || defaultDate, // Kirim nilai undefined jika kosong
            end_date: endDate || defaultDate,
            room_type: roomType || undefined,
            status: roomStatus || undefined,
          },
          responseType: "blob",
        }
      );

      console.log("data reservation : ", response);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data_reservation.xlsx"); // Nama file saat di-download
      document.body.appendChild(link);
      link.click();

      // // Hapus objek URL setelah digunakan
      // link.parentNode.removeChild(link);
      // window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.");
      console.error("Terjadi kesalahan saat memuat data.", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataReservationById = async (id) => {
    try {
      const token = getToken("token");
      const response = await axios.get(
        `http://172.16.148.101:8882/api/v1/reservations/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Tambahkan Bearer Token di sini
          },
        }
      );

      if (response.data.data) {
        console.log("detail : ", response.data.data[0].reservationId);
        setDetailReservation(response.data.data[0]);
        setRoomId(response.data.data[0].reservationId);
        openModal();
      }
    } catch (err) {
      setError("Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.");
      console.error("Terjadi kesalahan saat memuat data.", err);
    } finally {
      setLoading(false);
    }
  };

  const payReservation = async (id) => {
    try {
      const token = getToken("token");

      const response = await axios.put(
        `http://172.16.148.101:8882/api/v1/reservations/${id}/pay`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("response pay", response);

      if (response.data) {
        showToast(response.data.message);
        closeModal();
      }
    } catch (err) {
      // console.error("Error:", err);
      alert(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTanggal = (tgl) => {
    const date = new Date(tgl);
    const dateString = date.toISOString().split("T")[0]; // Ambil bagian tanggalnya saja
    const [year, month, day] = dateString.split("-"); // Pisahkan berdasarkan tanda '-'
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  };

  const goToPage = (toPage) => {
    setPage(toPage)
  }

  const dataPagination = () => {

    const perPage = 5;
    const offset = (page - 1) * perPage;
    const totalPage = Math.ceil(dataReservation.length / perPage)

    var halaman = [];
    for (let i = 1; i <= totalPage; i++) {
      halaman.push(i)
    }

    let tempData = [];
    for (let i = 0; i < perPage; i++) {
      if (dataReservation[offset + i]) {
        tempData.push(dataReservation[offset + i])
      }
    }

    console.log("pagination", tempData)


    return tempData
  }

  const buttonPagination = () => {
    const perPage = 5
    const totalPage = Math.ceil(dataReservation.length / perPage)
    const pageSize = 3;
    let startIndex = page - 1;

    var halaman = [];
    for (let i = 1; i <= totalPage; i++) {
      halaman.push(i)
    }

    if (page <= 2) {
      startIndex = 0;
    } else if (page >= halaman.length - 1) {
      startIndex = halaman.length - pageSize;
    }
    const visiblePages = halaman.slice(startIndex, startIndex + pageSize);
    console.log("visiblePages : ", visiblePages);

    return visiblePages
  }

  useEffect(() => {
    fetchDataReservation();
  }, []);

  return (
    <>
      <div className="bg-white flex items-center pl-[30px] h-20 w-[1360px]">
        <h2>Report</h2>
      </div>

      <div className="bg-white w-[1320px] m-5">
        <div className="grid grid-cols-5 gap-4 p-5">
          <div className="">
            <label className="text-sm ml-1">Start Date</label>
            <div className="flex mt-2 items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
              <input
                type="date"
                defaultValue={defaultDate}
                value={startDate}
                className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>

          <div className="">
            <label className="text-sm ml-1">End Date</label>
            <div className="flex mt-2 items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
              <input
                type="date"
                defaultValue={defaultDate}
                value={endDate}
                className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="">
            <label className="text-sm ml-1">Room Type</label>
            <div className="flex mt-2 items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
              <select
                className="block min-w-0 grow py-2 pb-2.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                onChange={(e) => setRoomType(e.target.value)}
              >
                <option value=""></option>
                <option value="1">Small</option>
                <option value="2">Medium</option>
                <option value="3">Large</option>
              </select>
            </div>
          </div>

          <div className="">
            <label className="text-sm ml-1">Status</label>
            <div className="flex mt-2 items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
              <select
                className="block min-w-0 grow py-2 pb-2.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                onChange={(e) => setRoomStatus(e.target.value)}
              >
                <option value=""></option>
                <option value="booked">Booked</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancel</option>
              </select>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex gap-4">
              <div>
                <button
                  class="bg-[#EB5B00] w-[120px] rounded-lg p-1.5 hover:bg-[#da7e45ad] border border-[#EB5B00] text-[#FFF]"
                  onClick={fetchDataReservation}
                >
                  Search
                </button>
              </div>
              <div>
                <button
                  class="bg-[#FFF] w-[60px] rounded-lg p-1.5 hover:bg-[#da7e45ad] border border-[#EB5B00] text-[#EB5B00]"
                  onClick={() => exportDataReservation()}
                >
                  {/* <i className="fas fa-download"></i> */}
                  <FontAwesomeIcon icon={faDownload} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white mt-1 text-sm px-6 py-3">
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

          {!loading && !error && dataReservation.length > 0 && (
            <table
              className="table-auto text-left"
              width={"100%"}
              style={{
                width: "100%",
                borderRadius: "10px 10px 0 0",
                overflow: "hidden",
              }}
            >
              <thead className="font-light bg-[#F7F7F7]">
                <tr>
                  <th className="p-4">Date Reservation</th>
                  <th className="p-4">Room Name</th>
                  <th className="p-4">Room Type</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {dataPagination().map((reservation, index) => (
                  <tr
                    key={index}
                    className="border border-b-slate-300 border-x-0"
                  >
                    <td className="p-4">
                      {formatTanggal(reservation.bookingDate)}
                    </td>
                    <td className="p-4">{reservation.roomName}</td>
                    <td className="p-4">{reservation.roomType}</td>
                    <td className="p-4 text-center">
                      <span
                        className={`py-1 px-4 text-white rounded-2xl`}
                        style={{
                          backgroundColor:
                            bgColorStatus[reservation.status] || "transparent",
                        }}
                      >
                        {reservation.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => fetchDataReservationById(reservation.id)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="flex justify-between mt-4 items-center">
            <div className="grid grid-cols-3 gap-1 items-center">
              <div>Show:</div>
              <div>
                <select className="block grow text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 text-xs border border-[#EBEBEB] rounded-lg p-2">
                  <option value="5">5</option>
                </select>
              </div>
              <div>Entries</div>
            </div>

            <div className="flex gap-1">
              <button className="bg-[#EBEBEB] text-[#ABABAB] py-2 px-3 rounded-md" onClick={() => goToPage(page > 1 ? page - 1 : 1)}>
                <FontAwesomeIcon icon={faChevronLeft} className="" />
              </button>
              {buttonPagination().map((paginate) => (
                <button
                  key={paginate}
                  onClick={() => goToPage(paginate)}
                  className={(page === paginate ? "bg-[#FF802F] text-white" : "bg-[#EBEBEB] text-[#ABABAB]") + " py-2 px-3 rounded-md"}
                >
                  {paginate}
                </button>
              ))}

              {/* <button className="bg-[#EBEBEB] text-[#ABABAB] py-2 px-3 rounded-md">
                ...
              </button> */}
              <button className="bg-[#FF802F] text-white py-2 px-3 rounded-md" onClick={() => goToPage(page == buttonPagination().length ? page + 1 : buttonPagination().length)}>
                <FontAwesomeIcon icon={faChevronRight} className="" />
              </button>
            </div>
          </div>

          {/* Start Modal */}
          <Modal isOpen={isModalOpen} closeModal={closeModal}>
            <div className="flex justify-between mr-4 items-center">
              <h2 className="px-4 text-xl font-normal text-black">
                Reservation Details
              </h2>
              <a href="#" onClick={closeModal}>
                <FontAwesomeIcon icon={faTimes} />
              </a>
            </div>
            <hr className="border-b-0 border-gray-300 my-4" />
            {dataDetailReservation !== null && (
              <div className="px-4">
                <h1 className="text-xl text-black">Room Details</h1>
                <div className="mt-2 flex justify-between">
                  <div>Room Name</div>
                  <div className="text-black">
                    {dataDetailReservation?.roomDetails?.[0]?.roomName || "-"}
                  </div>
                </div>
                <div className="mt-2 flex justify-between">
                  <div>Room Type</div>
                  <div className="text-black">Room Type</div>
                </div>
                <div className="mt-2 flex justify-between">
                  <div>Capacity</div>
                  <div className="text-black">
                    {dataDetailReservation?.roomDetails?.[0]?.capacity || "-"}
                  </div>
                </div>
                <div className="mt-2 flex justify-between">
                  <div>Price/hours</div>
                  <div className="text-black">
                    Rp
                    {dataDetailReservation?.roomDetails?.[0]?.roomPrice || "0"}
                  </div>
                </div>

                <hr className="border-b-0 border-gray-300 my-4" />

                <h1 className="text-xl text-black">Personal Data</h1>
                <div className="mt-2 flex justify-between">
                  <div>Name</div>
                  <div className="text-black">
                    {dataDetailReservation?.bookDetails?.[0]?.name || "-"}
                  </div>
                </div>
                <div className="mt-2 flex justify-between">
                  <div>No.Hp</div>
                  <div className="text-black">
                    {dataDetailReservation?.bookDetails?.[0]?.phone || "-"}
                  </div>
                </div>
                <div className="mt-2 flex justify-between">
                  <div>Company/Organization</div>
                  <div className="text-black">
                    {dataDetailReservation?.bookDetails?.[0]?.company || "-"}
                  </div>
                </div>
                <div className="mt-2 flex justify-between">
                  <div>Date Reservation</div>
                  <div className="text-black">
                    {dataDetailReservation?.bookDetails?.[0]?.dateReservation ||
                      "-"}
                  </div>
                </div>
                <div className="mt-2 flex justify-between">
                  <div>Duration</div>
                  <div className="text-black">
                    {dataDetailReservation?.bookDetails?.[0]?.duration || "0"}{" "}
                    hours
                  </div>
                </div>
                <div className="mt-2 flex justify-between">
                  <div>Total Participants</div>
                  <div className="text-black">
                    {dataDetailReservation?.bookDetails?.[0]?.participants ||
                      "0"}{" "}
                    participants
                  </div>
                </div>

                <hr className="border-b-0 border-gray-300 my-4" />

                <h1 className="text-xl text-black">Snack Details</h1>
                <div className="mt-2 flex justify-between">
                  <div>Snack Category</div>
                  <div className="text-black">
                    {dataDetailReservation?.consumption?.[0]?.category || "-"}
                  </div>
                </div>
                <div className="mt-2 flex justify-between">
                  <div>Packages</div>
                  <div className="text-black">
                    {dataDetailReservation?.consumption?.[0]?.name || "-"} - Rp
                    {dataDetailReservation?.consumption?.[0]?.price || "0"}/box
                  </div>
                </div>

                <hr className="border-b-0 border-gray-300 my-4" />

                <h1 className="text-xl text-black">Total</h1>
                <div className="mt-2 flex justify-between items-center">
                  <div>
                    <div>
                      {dataDetailReservation?.totalPrice?.[0]?.roomName || "-"}
                    </div>
                    <div className="text-black">
                      {dataDetailReservation?.totalPrice?.[0]?.duration || "0"}{" "}
                      x{" "}
                      {dataDetailReservation?.totalPrice?.[0]?.roomName || "-"}
                    </div>
                  </div>
                  <div className="text-black">
                    Rp
                    {dataDetailReservation?.totalPrice?.[0]?.totalRoomPrice ||
                      "0"}
                  </div>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <div>
                    <div>
                      {dataDetailReservation?.totalPrice?.[0]?.snackName || "-"}{" "}
                      - Rp
                      {dataDetailReservation?.totalPrice?.[0]
                        ?.totalSnackPrice || "0"}
                      /box
                    </div>
                    <div className="text-black">
                      {dataDetailReservation?.totalPrice?.[0]?.Qty > 0
                        ? `${dataDetailReservation.totalPrice[0].Qty} x Rp${parseInt(
                          dataDetailReservation.totalPrice[0]
                            .totalSnackPrice
                        ) /
                        parseInt(dataDetailReservation.totalPrice[0].Qty)
                        }`
                        : "0"}
                    </div>
                  </div>
                  <div className="text-black">
                    Rp
                    {dataDetailReservation?.totalPrice?.[0]?.totalSnackPrice ||
                      "0"}
                  </div>
                </div>

                <hr className="border-b-0 border-gray-300 my-4 " />

                <div className="mt-2 flex justify-end items-center mx-4">
                  <div>
                    <div className="text-black font-bold text-2xl">
                      Rp
                      {dataDetailReservation?.totalPrice?.[0]?.totalPrice ||
                        "0"}
                    </div>
                  </div>
                </div>

                <div className="mt-2 flex justify-between items-center mx-4 mb-24">
                  <div>
                    <div>Note</div>
                    <div className="text-xs">
                      {dataDetailReservation?.notes || "-"}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex fixed gap-4 justify-between bottom-0 mt-4 shadow-lg shadow-[0_-10px_15px_rgba(0,0,0,0.3)] w-full p-6">
              <button
                onClick={showAlert}
                className="px-6 py-2  w-full text-orange-500 border border-orange-500 rounded-md hover:bg-orange-100"
              >
                Cancel Reservation
              </button>
              <button
                className="px-6 py-2 text-white bg-orange-500 rounded-md w-full hover:bg-orange-600"
                onClick={() => payReservation(roomId)}
              >
                Pay
              </button>
            </div>
          </Modal>
          {/* End Modal */}
        </div>
      </div >
    </>
  );
};

export default Report;