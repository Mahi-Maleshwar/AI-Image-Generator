import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${backendUrl}/api/user/reset-password/${token}`,
        { password }
      );
      setMsg(res.data.message);
      setSuccess(res.data.success);
    } catch (error) {
      setMsg("Error resetting password");
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  return (
    <div className="p-5 max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Reset Your Password</h2>
      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Reset Password
        </button>
      </form>
      {msg && <p className="mt-4 text-blue-600">{msg}</p>}
    </div>
  );
};

export default ResetPassword;
