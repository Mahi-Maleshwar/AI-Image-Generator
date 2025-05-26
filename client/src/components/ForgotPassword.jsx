"use client";
import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });
      setMsg(res.data.message);
    } catch (error) {
      setMsg("Something went wrong");
    }
  };

  return (
    <div className="p-5 max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send Reset Link
        </button>
      </form>
      {msg && <p className="mt-4 text-green-600">{msg}</p>}
    </div>
  );
};

export default ForgotPassword;
