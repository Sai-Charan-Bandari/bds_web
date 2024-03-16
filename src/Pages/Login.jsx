// Login.js
import React, { useState } from 'react';
import '../Login.css';

const Login = ({ setMainState }) => {
  const [formData, setFormData] = useState({
    id: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // CHECK ALL FIELDS ARE COMPLETE
    try {
      let k = await fetch(import.meta.env.VITE_SERVER_URL + '/login-hospital', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      k = await k.json();
      console.log('hospital login response', k);
      if (k.msg === 'done') {
        setMainState({ hospitalId: formData.id, hospitalLocation: k.hospitalLocation, token: k.tok });
        localStorage.setItem('bds_tok', k.tok);
      }else{
        alert('login failed. please check your id and password')
        setFormData({...formData,password:''})
      }
    } catch (e) {
      console.log('error in logging in ', e);
    }
  };

  return (
    <div className="wrapper">
      <div className="login-box">
        <div className="login-header">
          <span>Login</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input_box">
            <input
              type="text"
              id="user"
              className="input-field"
              name="id"
              value={formData.id}
              onChange={handleChange}
              required
            />
            <label htmlFor="user" className="label">Username</label>
            <i className="bx bx-user icon"></i>
          </div>
          <div className="input_box">
            <input
              type="password"
              id="pass"
              className="input-field"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="pass" className="label">Password</label>
            <i className="bx bx-lock-alt icon"></i>
          </div>
          <div className="input_box">
            <input type="submit" className="input-submit" value="Login" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;