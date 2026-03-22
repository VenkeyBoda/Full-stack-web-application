import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {

  const [users,setUsers] = useState([]);
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");

  const fetchUsers = async () => {
    const res = await axios.get("/api/users");   // 👈 CHANGE
    setUsers(res.data);
  };

  const addUser = async () => {
    await axios.post("/api/users",{name,email}); // 👈 CHANGE
    fetchUsers();
  };

  useEffect(()=>{ fetchUsers(); },[]);

  return (
    <div style={{padding:40}}>
      <h2>User App</h2>

      <input placeholder="Name" onChange={e=>setName(e.target.value)} />
      <input placeholder="Email" onChange={e=>setEmail(e.target.value)} />
      <button onClick={addUser}>Add</button>

      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name} - {u.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;