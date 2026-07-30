import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Add these interfaces
interface Order {
  _id: string;
  orderAmount: number;
  orderStatus: string;
  createdAt: string;
  items?: { name: string; quantity: number; price: number }[]; // Add items field for order details
  totalAmount?: number; // Add totalAmount field if needed
}

const UserProfile = () => {
  const { user, isAuthenticated, logout, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null); // State to track expanded order
  const [profileUpdateMsg, setProfileUpdateMsg] = useState<string | null>(null);
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateField, setStateField] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('');
  const defaultAvatar = '/default-avatar.png';
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    if (user?.displayName) setDisplayName(user.displayName);
    if (user?.photoURL) setPhotoURL(user.photoURL);
    if (user?.phoneNumber) setPhone(user.phoneNumber);

    // Optionally fetch user profile details from backend and set address fields here

    // Save user to backend on login
    if (user) {
      axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/save`, {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photo: user.photoURL,
        phone: user.phoneNumber,
        address,
        city,
        state: stateField,
        zip,
        country
      }).catch((err) => {
        console.error('Failed to save user:', err);
      });
    }
  }, [isAuthenticated, navigate, user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/me/${user.uid}`);
      setOrders(response.data.orders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfileBackend = async (data: {
    uid: string;
    email: string;
    name: string;
    photo: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  }) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/save`, data);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setProfileUpdateMsg(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileUpdateMsg(null);
    // Reset fields to current user values
    setDisplayName(user.displayName || '');
    setPhotoURL(user.photoURL || '');
    setPhone(user.phoneNumber || '');
    setAddress('');
    setCity('');
    setStateField('');
    setZip('');
    setCountry('');
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileUpdateMsg(null);
    if (!displayName.trim()) return;

    // Allow any http(s) image link, block only data URLs
    if (photoURL.startsWith('data:')) {
      setProfileUpdateMsg('Please use a direct image link (http/https), not a data URL.');
      return;
    }

    try {
      await updateUserProfile({ displayName, photoURL });
      const backendRes = await updateUserProfileBackend({
        uid: user.uid,
        email: user.email,
        name: displayName,
        photo: photoURL,
        phone,
        address,
        city,
        state: stateField,
        zip,
        country
      });
      if (backendRes && backendRes.user) {
        setDisplayName(backendRes.user.name || '');
        setPhotoURL(backendRes.user.photo || '');
        setPhone(backendRes.user.phone || '');
        setAddress(backendRes.user.address || '');
        setCity(backendRes.user.city || '');
        setStateField(backendRes.user.state || '');
        setZip(backendRes.user.zip || '');
        setCountry(backendRes.user.country || '');
        // Optionally force reload to update user context everywhere:
        // window.location.reload();
      }
      setIsEditing(false);
      setProfileUpdateMsg('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update failed:', error);
      setProfileUpdateMsg('Failed to update profile.');
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchOrders();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || !user) return null;

  return (
    <div className="max-w-7xl mx-auto py-20 px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col items-center">
              <img 
                className="w-32 h-32 rounded-full mb-4 object-cover"
                src={photoURL || defaultAvatar}
                alt={displayName || 'User'} 
                onError={(e) => {
                  e.currentTarget.src = defaultAvatar;
                  console.log('Failed to load image:', photoURL);
                }}
              />
              <h2 className="text-xl font-semibold mb-2">
                {user.displayName || 'Anonymous User'}
              </h2>
              <p className="text-gray-600 text-sm">{user.email}</p>
              <p className="text-gray-600 text-sm">
                Member since {new Date(user.metadata.creationTime).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Account Details</h3>
            <button className="w-full py-3 px-4 border border-gray-300 rounded-md mb-2 hover:bg-gray-50 transition-colors">
              Edit Profile
            </button>
            <button className="w-full py-3 px-4 border border-gray-300 rounded-md mb-2 hover:bg-gray-50 transition-colors">
              Change Password
            </button>
            {/* <button 
              onClick={handleLogout}
              className="w-full py-3 px-4 border border-red-500 text-red-500 rounded-md mb-2 hover:bg-red-50 transition-colors"
            >
              Delete Account
            </button> */}
            <button 
              onClick={handleLogout}
              className="w-full py-3 px-4 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
            >
              LogOut 
            </button>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex border-b mb-6">
              {['Orders', 'Wishlist', 'Settings'].map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(index)}
                  className={`px-6 py-3 font-medium transition-colors
                    ${activeTab === index 
                      ? 'border-b-2 border-black' 
                      : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="tab-content">
              {activeTab === 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Order History</h3>
                  {isLoading ? (
                    <p>Loading orders...</p>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : orders.length === 0 ? (
                    <p className="text-gray-600">No orders found.</p>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order._id}
                          className="border rounded-lg p-4 cursor-pointer"
                          onClick={() =>
                            setExpandedOrderId(expandedOrderId === order._id ? null : order._id)
                          }
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Order ID: {order._id}</p>
                              <p className="text-sm text-gray-600">
                                Date: {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">₹{order.totalAmount ?? order.orderAmount}</p>
                              <p
                                className={`text-sm ${
                                  order.orderStatus === 'completed'
                                    ? 'text-green-600'
                                    : 'text-orange-600'
                                }`}
                              >
                                {order.orderStatus}
                              </p>
                            </div>
                          </div>
                          {expandedOrderId === order._id && (
                            <div className="mt-4 bg-gray-50 rounded p-3">
                              <h4 className="font-semibold mb-2">Items</h4>
                              <ul className="mb-2">
                                {(order.items || []).map((item: any, idx: number) => (
                                  <li key={idx} className="flex justify-between py-1 border-b last:border-b-0">
                                    <span>
                                      {item.name} x {item.quantity}
                                    </span>
                                    <span>₹{item.price}</span>
                                  </li>
                                ))}
                              </ul>
                              <div className="flex justify-between font-semibold mt-2">
                                <span>Total Amount:</span>
                                <span>₹{order.totalAmount ?? order.orderAmount}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {activeTab === 1 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Wishlist</h3>
                  {/* Add wishlist logic here */}
                  <p className="text-gray-600">Your wishlist is empty.</p>
                </div>
              )}
              {activeTab === 2 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Profile Settings</h3>
                  <form onSubmit={handleProfileUpdate} className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md"
                        placeholder="Enter your name"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user.email || ''}
                        disabled
                        className="w-full px-4 py-2 border rounded-md bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Photo URL
                      </label>
                      <input
                        type="url"
                        value={photoURL}
                        onChange={(e) => setPhotoURL(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md"
                        placeholder="Enter photo URL"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md"
                        placeholder="Enter phone number"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md"
                        placeholder="Enter address"
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-4 py-2 border rounded-md"
                          placeholder="Enter city"
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          value={stateField}
                          onChange={(e) => setStateField(e.target.value)}
                          className="w-full px-4 py-2 border rounded-md"
                          placeholder="Enter state"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Zip
                        </label>
                        <input
                          type="text"
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                          className="w-full px-4 py-2 border rounded-md"
                          placeholder="Enter zip"
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full px-4 py-2 border rounded-md"
                          placeholder="Enter country"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    {profileUpdateMsg && (
                      <div className={`text-sm ${profileUpdateMsg.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
                        {profileUpdateMsg}
                      </div>
                    )}
                    <div className="flex justify-end gap-4">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Save Changes
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={handleEditClick}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


 

export default UserProfile;
