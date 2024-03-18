import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./components/pages/Home"
import Login from "./components/pages/Login"
import Signup from "./components/pages/Signup"
import Transaction from "./components/pages/Transaction"
import NotFound404 from "./components/pages/NotFound404"
import Header from "./components/Header"
import { useQuery } from '@apollo/client';
import { GET_AUTHENTICATED_USER } from "./graphql/queries/User.queries";
import {  Toaster  } from 'react-hot-toast';

function App() {
  
  const {data,loading} = useQuery(GET_AUTHENTICATED_USER);

  if(loading) return null;

  

  return (
    <>
    {data?.authUser && <Header/>}
    <Routes>
      <Route path="/" element={data.authUser ? <Home/> : <Navigate to={'/login'}/>}/>
      <Route path="/login" element={!data.authUser ? <Login/> : <Navigate to={'/'}/>}/>
      <Route path="/signup" element={!data.authUser ? <Signup/> : <Navigate to={'/'}/>}/>
      <Route path="/transaction/:id" element={data.authUser ? <Transaction/> : <Navigate to={'/login'}/>}/>
      <Route path="*" element={<NotFound404/>}/>
      
    </Routes>
<Toaster   position="top-center"/>
    </>
    
  )
}

export default App
