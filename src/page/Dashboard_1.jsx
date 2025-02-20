import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Dashboard = () => {
  const rooms = [
    'Aster Room', 'Bluebell Room', 'Camellia Room', 'Daisy Room',
    'Edelweiss Room', 'Freesia Room', 'Gardenia Room', 'Hibiscus Room',
    'Iris Room', 'Jasmine Room', 'Kalmia Room', 'Lavender Room'
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <div className="bg-white p-4 shadow-md">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Dashboard</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <img
                    alt="User profile picture"
                    className="rounded-full w-10 h-10"
                    height="40"
                    src="https://storage.googleapis.com/a1aa/image/shrKeeYVdefmmQ1BlX86PehUgaxgdauMm3TZMfn7UcOAFOQeJA.jpg"
                    width="40"
                  />
                  <span className="font-semibold">sinau</span>
                </div>
                <i className="fas fa-sign-out-alt text-gray-400" />
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {rooms.map((room, index) => (
                <div key={index} className="bg-white p-4 rounded-md shadow-md">
                  <h3 className="text-lg font-semibold">{room}</h3>
                  <p className="text-sm text-gray-500">Percentage of Usage</p>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <p className="text-xl font-semibold">80%</p>
                      <p className="text-sm text-gray-500 mt-2">Omzet</p>
                      <p className="text-lg font-semibold">Rp 2.000.000</p>
                    </div>
                    <svg height="80" viewBox="0 0 36 36" width="80">
                      <circle
                        className="text-gray-300"
                        cx="18"
                        cy="18"
                        fill="none"
                        r="16"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <circle
                        className="text-orange-500"
                        cx="18"
                        cy="18"
                        fill="none"
                        r="16"
                        stroke="currentColor"
                        strokeDasharray="80, 100"
                        strokeWidth="4"
                      ></circle>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;