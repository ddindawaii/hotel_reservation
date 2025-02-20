// Modal.js
import React, { useEffect, useState } from "react";

const Modal = ({ isOpen, closeModal, children }) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
    } else {
      const timer = setTimeout(() => setShowModal(false), 300); // Sync dengan durasi fade-out
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!showModal) return null;

  return (
    <div
      className={`fixed overflow-y-auto inset-0 bg-black bg-opacity-50 flex justify-end items-start z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white px-0 py-4 shadow-lg w-[456px] transform transition-all duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-2 text-gray-500 hover:text-gray-800"
        >
          <i className="fa fa-times"></i>
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
