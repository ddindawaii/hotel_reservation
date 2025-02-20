import { useEffect, useState } from "react";
import Button from "../components/Button";
import "../index.css";
import { getToken } from "../utils/Auth";
import axios from "axios";
import Modal from "../components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";

const Roompage = () => {
  // param fetchRoom
  const [name, setName] = useState("");
  const [roomTypeId, setRoomTypeId] = useState("");
  const [capacity, setCapacity] = useState("");

  // formData addRoom
  const [roomId, setRoomId] = useState(0);
  const [roomName, setRoomName] = useState("");
  const [roomPrice, setRoomPrice] = useState("");
  const [typeId, setTypeId] = useState("");
  const [roomCapacity, setRoomCapacity] = useState("");
  const [roomImage, setRoomImage] = useState();

  // imageShow
  const [image, setImage] = useState(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState();

  const [isEdit, setIsEdit] = useState(false);

  //FUNGSI
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  //Fungsi allert
  const showAlert = (id) => {
    Swal.fire({
      title: "Are you sure want to delete this room?",
      html: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRooms(id);
      }
    });
  };

  const handleButtonAdd = async () => {
    setIsEdit(false);
    openModal();
  };

  const fetchRoomById = async (id) => {
    setLoading(true);
    setError(null);
    setIsEdit(true);
    try {
      const token = getToken("token");
      const response = await axios.get(
        `http://172.16.148.101:8882/api/v1/rooms/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.data);
      if (response.data && response.data) {
        var data = response.data.data;
        setRoomId(data.id);
        setRoomName(data.name);
        setRoomPrice(data.price);
        setTypeId(data.room_type_id);
        setRoomCapacity(data.capacity);
        setRoomImage(data.imgUrl);
        setImage(data.imgUrl);
        openModal();
      }
    } catch (err) {
      setError("Terjadi kesalahan, coba lagi nanti.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    // e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = getToken("token");
      const response = await axios.get(
        "http://172.16.148.101:8882/api/v1/rooms",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            name: name || undefined,
            roomTypeId: roomTypeId || undefined,
            capacity: capacity || undefined,
          },
        }
      );

      if (response.data && response.data) {
        setData(response.data);
      }
    } catch (err) {
      setError("Terjadi kesalahan, coba lagi nanti.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addRoom = async () => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", roomName);
      formData.append("room_type_id", typeId);
      formData.append("price", roomPrice);
      formData.append("capacity", roomCapacity);
      formData.append("image", roomImage);

      const token = getToken("token");
      console.log(token);

      const response = await axios.post(
        "http://172.16.148.101:8882/api/v1/rooms",
        formData, // Pass formData directly
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Ensure this is set for FormData
          },
        }
      );

      if (response.data.data) {
        setRoomId(0);
        setRoomName("");
        setRoomCapacity("");
        setRoomPrice("");
        setTypeId("");
        setImage(null);
        fetchRooms();
      }
    } catch (err) {
      setError("Terjadi kesalahan, coba lagi nanti.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fileInputRef = useRef(null);
  const handleButtonChooseFile = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImage(imageURL);
      setRoomImage(file);
    }
  };

  const deleteRooms = async (id) => {
    // setLoading(true);
    // setError(null);
    try {
      const token = getToken("token");
      const response = await axios.delete(
        `http://172.16.148.101:8882/api/v1/rooms/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data) {
        // setData(response.data);
        fetchRooms();
      }
    } catch (err) {
      setError("Terjadi kesalahan, coba lagi nanti.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const editRooms = async (id) => {
    try {
      const formData = new FormData();
      formData.append("name", roomName);
      formData.append("room_type_id", typeId);
      formData.append("price", roomPrice);
      formData.append("capacity", roomCapacity);
      formData.append("image", roomImage);

      const token = getToken("token");
      console.log(token);

      const response = await axios.put(
        `http://172.16.148.101:8882/api/v1/rooms/${id}`,
        formData, // Pass formData directly
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Ensure this is set for FormData
          },
        }
      );

      if (response.data.data) {
        setRoomId(0);
        setRoomName("");
        setRoomCapacity("");
        setRoomPrice("");
        setTypeId("");
        setImage(null);
        fetchRooms();
        closeModal();
      }
    } catch (err) {
      setError("Terjadi kesalahan, coba lagi nanti.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    // showAlert();
  }, []);

  return (
    <>
      <div className="bg-white flex items-center pl-[30px] h-20 w-[1360px]">
        <h2>Rooms</h2>
      </div>

      {/* Form Search */}
      <div className="bg-white w-[1320px] h-20 flex mx-5 mt-5">
        <div className="flex-row py-4 pl-5">
          <input
            type="search"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-[362px] h-12 rounded-[10px] border border-[#ebebeb] pl-4"
            placeholder="Enter the keyword here.."
          />
        </div>
        <div className="flex-row py-4 pl-5">
          <select
            value={roomTypeId}
            onChange={(e) => setRoomTypeId(e.target.value)}
            className="w-[280px] h-12 rounded-[10px] border border-[#ebebeb] pl-4"
          >
            <option value=""></option>
            <option value="1">Small</option>
            <option value="2">Medium</option>
            <option value="3">Large</option>
          </select>
        </div>
        <div className="flex-row py-4 pl-[20px]">
          <select
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-[280px] h-12 rounded-[10px] border border-[#ebebeb] pl-4"
          >
            <option value="">Capacity</option>
            <option value="1">&lt; 10 people</option>
            <option value="2">11-50 people</option>
            <option value="3">51-100 people</option>
          </select>
        </div>
        <div className="flex-row py-4 pl-[20px]">
          <Button
            onClick={fetchRooms}
            type="outline"
            className="w-[102px] h-[48px] font-normal"
          >
            Search
          </Button>
        </div>

        <div className="flex-row py-4 pl-[20px]">
          <Button
            type="solid"
            className="w-[156px] h-[48px] font-normal text-nowrap"
            onClick={handleButtonAdd}
          >
            + Add New Room
          </Button>
        </div>
      </div>

      {/* Rooms Section */}
      <div className="w-[1320px] h-[812px] bg-white mx-5 mt-1">
        {loading ? (
          <p className="text-center mt-5">Loading...</p>
        ) : error ? (
          <p className="text-center mt-5 text-red-500">{error}</p>
        ) : data.length > 0 ? (
          <div className="grid grid-cols-4">
            {data.map((room) => (
              <div
                key={room.id}
                className="w-[304px] h-[262px] bg-white m-5 rounded-[20px] border-2 border-[#ebebeb] overflow-hidden"
              >
                <div className="relative">
                  <img src={room.imgUrl} className="h-[174px] w-[302px]" />
                  {/* Tombol yang berada di atas gambar */}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      onClick={() => showAlert(room.id)}
                      className=" bg-white text-red-600 px-2 py-1 rounded-[10px]"
                    >
                      <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                    </Button>
                    <Button
                      onClick={() => fetchRoomById(room.id)}
                      className=" bg-white text-yellow-500 px-2 py-1 rounded-[10px]"
                    >
                      <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 px-4 ">
                  <h3 className="text-2xl font-bold">{room.name}</h3>
                  <span className="px-2 bg-orange-500 text-white rounded-full">
                    {room.room_type}
                  </span>
                </div>
                <div className="flex justify-between items-center px-4">
                  <p>{room.capacity}</p>
                  <p>{room.price}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center mt-5">No rooms found</p>
        )}
      </div>

      {/* Logika ADD New Room */}
      <Modal isOpen={isModalOpen} closeModal={closeModal}>
        <div className="w-[456px]">
          <div className="pl-5 py-6 flex justify-between items-center pr-[10px]">
            <h2 className="font-normal">Add New Room</h2>
            <div>
              <a href="#" onClick={closeModal}>
                <FontAwesomeIcon icon={faTimes} />
              </a>
            </div>
          </div>

          <hr className=" border-gray-300 w-[456px]" />
          <div className="px-5 my-5">
            {image ? (
              <div className="p-2">
                <img
                  src={image}
                  alt="Preview"
                  className="w-[416px] h-[220px] object-cover rounded-lg"
                />
              </div>
            ) : (
              <div className="p-20 border border-dashed flex flex-col justify-center items-center border-orange-500 ">
                <div className="mb-2">Drag and Drop your file here or</div>
                <button
                  className="p-2 border-none bg-orange-500 text-white rounded-lg"
                  onClick={handleButtonChooseFile}
                >
                  Choose File
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col px-5 mb-5">
            <label>Room Name</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Room Name"
              className="border border-[#ebebeb] rounded-[10px] h-12 p-3"
            />
          </div>
          <div className="px-5 flex flex-col mb-5">
            <label>Room type</label>
            <select
              className="text-[#c4c4c4] border border-[#ebebeb] rounded-[10px] h-12 p-3"
              value={typeId}
              onChange={(e) => setTypeId(e.target.value)}
            >
              <option>Room Type</option>
              <option value={1}>Small</option>
              <option value={2}>Medium</option>
              <option value={3}>Large</option>
            </select>
          </div>
          <div className="flex flex-col px-5 mb-5">
            <label>Price/hours</label>
            <input
              type="number"
              value={roomPrice}
              placeholder="Price"
              onChange={(e) => setRoomPrice(e.target.value)}
              className="border border-[#ebebeb] rounded-[10px] h-12 p-3"
            />
          </div>
          <div className="flex flex-col px-5 mb-5">
            <label>Capacity</label>
            <input
              type="number"
              value={roomCapacity}
              onChange={(e) => setRoomCapacity(e.target.value)}
              placeholder="Capacity"
              className="border border-[#ebebeb] rounded-[10px] h-12 p-3"
            />
          </div>
          <div className="">
            <button
              className="m-5 text-white bg-orange-500 rounded-md w-[416px] h-12 hover:bg-orange-600"
              onClick={() => (!isEdit ? addRoom() : editRooms(roomId))}
              type="button"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Roompage;