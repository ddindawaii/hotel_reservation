import React from 'react';

const Sidebar = () => {
  const logos = [
    "/assets/images/logo1.png",
    "/assets/images/logo2.png",
    "/assets/images/logo3.png",
    "/assets/images/logo4.png",
    "/assets/images/logo5.png",
    "/assets/images/logo6.png"
  ];

  return (
    <div className="w-16 bg-white h-screen shadow-md">
      <div className="flex flex-col items-center py-4">
        {/* Logo dan navigasi */}
        <div className="bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center mb-8">
          <span className="text-xl font-bold">E</span>
        </div>
        {/* Logo 1-6 */}
        {logos.map((logo, index) => (
          <div key={index} className="w-7 h-7 mb-6">
            <img src={logo} alt={`Logo ${index + 1}`} className="w-full h-full rounded-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;