import React from 'react';

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-[#FAEEE7] font-sans text-[#6C4A34]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#C6814C] text-white fixed top-0 left-0 h-screen shadow-lg z-20">
        <div className="p-6 pt-8 text-2xl font-extrabold tracking-wide border-b border-white/20">
          PahadiCraft
        </div>
        <nav className="p-3 space-y-2 text-lg">
          <a href="#" className="block hover:bg-white/10 rounded px-3 py-2 transition">🏠 Dashboard</a>
          <a href="#" className="block hover:bg-white/10 rounded px-3 py-2 transition">📦 Products</a>
          <a href="#" className="block hover:bg-white/10 rounded px-3 py-2 transition">🧾 Orders</a>
          <a href="#" className="block hover:bg-white/10 rounded px-3 py-2 transition">👥 Customers</a>
          <a href="#" className="block hover:bg-white/10 rounded px-3 py-2 transition">📨 Messages</a>
          <a href="#" className="block hover:bg-white/10 rounded px-3 py-2 transition">⚙️ Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 w-full pt-20 pb-40 px-6 md:px-12 lg:px-20">
        <h1 className="text-4xl font-bold mb-10 border-b pb-3">Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Account Info */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6">Account Information</h2>
            <form className="space-y-5">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C6814C]"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C6814C]"
              />
              <input
                type="text"
                placeholder="Phone"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C6814C]"
              />
              <button
                type="submit"
                className="bg-[#6C4A34] hover:bg-[#593d2b] text-white px-6 py-3 rounded-lg transition font-medium"
              >
                Save Changes
              </button>
            </form>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6">Notification Preferences</h2>
            <form className="space-y-4">
              {["Order Confirmation", "Order Status Changed", "Order Delivered"].map((label, index) => (
                <label key={index} className="flex items-center space-x-3 text-lg">
                  <input type="checkbox" className="form-checkbox h-5 w-5 text-[#6C4A34]" defaultChecked />
                  <span>{label}</span>
                </label>
              ))}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;





