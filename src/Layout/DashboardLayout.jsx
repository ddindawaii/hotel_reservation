import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import logo from "../assets/e.png";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import Button from "../components/Button";
import { PiClipboardTextThin } from "react-icons/pi";
import { TbBuilding } from "react-icons/tb";
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import "../index.css";
import { getRole } from "../utils/Auth";

const DashboardLayout = () => {

  const role = getRole();
  console.log("role", role);
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      <div
        className={`bg-white h-screen transition-all duration-300 ${isOpen ? "w-[210px]" : "w-20"
          }`}
      >
        <img src={logo} className="s-[50px] p-[15px] " />
        <nav>
          <ul className="px-7 py-7">
            <Button
              onClick={toggleSidebar}
              className={`${isOpen ? "w-[210px]" : "w-20"}`}
            >
              {/* <FaRegArrowAltCircleRight size={24} color={isOpen ? "#C4C4C4" : "#EB5B00"} className="hover:text-[#EB5800]" /> */}
              <FaRegArrowAltCircleRight
                size={24}
                className={`transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                  } text-[#eb5b00] hover:text-[#EB5B00]`}
              />
            </Button>
          </ul>
          <ul>
            {role === "admin" ? (
              <>
                <li className="px-7 py-7">
                  <NavLink
                    to={"/dashboard"}
                    className="flex items-center hover:text-[#EB5B00]"
                  >
                    <RxDashboard
                      size={24}
                      className="text-[#c4c4c4]  hover:text-[#EB5800]"
                    />
                    {isOpen && <h6 className=" pl-[5px]">Dashboard</h6>}
                  </NavLink>
                </li>
                <li className="px-7 py-7">
                  <NavLink
                    to="/dashboard/reservations/schedules"
                    className="flex items-center hover:text-[#EB5B00]"
                  >
                    <PiClipboardTextThin
                      size={24}
                      className="text-[#c4c4c4] hover:text-[#EB5800]"
                    />
                    {isOpen && (
                      <h6 className=" pl-[5px]">Reservation Schedule</h6>
                    )}
                  </NavLink>
                </li>
                <li className="px-7 py-7">
                  <NavLink
                    to="/dashboard/roompage"
                    className="flex items-center hover:text-[#EB5B00]"
                  >
                    <TbBuilding
                      size={24}
                      className="text-[#c4c4c4]  hover:text-[#EB5800]"
                    />
                    {isOpen && <h6 className=" pl-[5px]">Rooms</h6>}
                  </NavLink>
                </li>
                <li className="px-7 py-7">
                  <NavLink
                    to="/dashboard/report"
                    className="flex items-center hover:text-[#EB5B00]"
                  >
                    <IoDocumentTextOutline
                      size={24}
                      className="text-[#c4c4c4]  hover:text-[#EB5800]"
                    />
                    {isOpen && <h6 className="pl-[5px]">Report</h6>}
                  </NavLink>
                </li>
                <li className="px-7 py-7">
                  <NavLink
                    to="/dashboard/setting"
                    className="flex items-center hover:text-[#EB5B00]"
                  >
                    <IoSettingsOutline
                      size={24}
                      className="text-[#c4c4c4] hover:text-[#EB5800]"
                    />
                    {isOpen && <h6 className="pl-[5px]">Setting</h6>}
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                {/* Navbar User */}
                <li className="px-7 py-7">
                  <NavLink
                    to="/dashboard/rooms"
                    className="flex items-center hover:text-[#EB5B00]"
                  >
                    <TbBuilding
                      size={24}
                      className="text-[#c4c4c4] hover:text-[#EB5800]"
                    />
                    {isOpen && <h6 className="pl-[5px]">Rooms</h6>}
                  </NavLink>
                </li>
                <li className="px-7 py-7">
                  <NavLink
                    to="/dashboard/history"
                    className="flex items-center hover:text-[#EB5B00]"
                  >
                    <IoDocumentTextOutline
                      size={24}
                      className="text-[#c4c4c4]  hover:text-[#EB5800]"
                    />
                    {isOpen && <h6 className="pl-[5px]">History</h6>}
                  </NavLink>
                </li>
                <li className="px-7 py-7">
                  <NavLink
                    to="/dashboard/settings"
                    className="flex items-center hover:text-[#EB5B00]"
                  >
                    <IoSettingsOutline
                      size={24}
                      className="text-[#c4c4c4]  hover:text-[#EB5800]"
                    />
                    {isOpen && <h6 className=" pl-[5px]">Settings</h6>}
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
      <div className="bg-[#f7f7f7]">
        <Outlet />
      </div>
    </div>
  );
};
export default DashboardLayout;