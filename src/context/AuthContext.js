import React, { useState, useEffect, createContext, useContext} from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from "../firebase";
import Loading from '../components/Loading/Loading';

const appAuthContext = createContext()

const AuthContext = ({children}) => {
  const [ user, setUser ] = useState(null);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    })
  }, []);
  if (isLoading) {
    return <Loading />
  }
  return (
    <appAuthContext.Provider value={{ user }}>
      {children}
    </appAuthContext.Provider>
  )
}

export default AuthContext;

export const AppAuthState = () => {
  return useContext(appAuthContext);
}
