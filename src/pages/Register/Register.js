import React, { useState } from 'react';
import './Register.css';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import {setDoc, doc, Timestamp} from "firebase/firestore";
import { useNavigate } from "react-router-dom"; 

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    error: null,
    isLoading: false,
  });

  const navigate = useNavigate();

  const {name, email, password, error, isLoading} = data;

  const handleChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setData({...data, error: null, isLoading: true})
    if(!name || !email || !password) {
      setData({
        ...data,
        error: "All fields are required"
      })
    }
    try {
      // Register/create new user
      const result = await createUserWithEmailAndPassword( 
        auth, 
        email, 
        password
      );
      // Add  the created user information to the firestore or database
        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          name,
          email,
          createdAt: Timestamp.fromDate(new Date()),
          isOnline: true,
        });
        setData({
          name: "",
          email: "",
          password: "",
          error: null,
          isLoading: false,
        });
        navigate("/")
    } catch(err) {
      setData({
        ...data,
        error: err.message,
        isLoading: false,
      })
    }
  }
  return (
    <div className='register_wrap'>
      <h3>Create An Account</h3>
      <form className='form' onSubmit={handleSubmit}>
        <div className="input_wrap">
          <label htmlFor="name">Name</label>
          <input 
            type="text" 
            name='name' 
            value={name} 
            onChange={handleChange}
          />
        </div>
        <div className="input_wrap">
          <label htmlFor="email">Email</label>
          <input 
            type="text" 
            name='email' 
            value={email} 
            onChange={handleChange} 
          />
        </div>
        <div className="input_wrap">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            name='password' 
            value={password} 
            onChange={handleChange}
          />
        </div>
        { error ?
          <p className="error">{error}</p> :
          null
        }
        <div className="btn_wrap">
          <button className="btn" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Register