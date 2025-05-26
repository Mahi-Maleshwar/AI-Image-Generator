import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, backendUrl } = useContext(AppContext)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('User not authenticated.');
          setLoading(false);
          return;
        }

        const res = await axios.get(`${backendUrl}/api/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data && res.data.histories) {
          setHistory(res.data.histories);
        } else {
          setHistory([]);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <div className="p-6 text-lg">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Image Generation History</h2>
      {history.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {history.map((item, idx) => (
            <div
              key={item._id || idx}
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition duration-300"
            >
              <img
                src={item.imageUrl}
                alt={item.prompt}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <p className="text-sm text-gray-700">{item.prompt}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No history found yet.</p>
      )}
    </div>
  );
};

export default HistoryPage;
