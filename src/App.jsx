import { useState,useEffect } from 'react'
import { useDispatch } from 'react-redux';
import {Outlet} from 'react-router-dom'
import authservice from './appwrite/auth'
import { login,logout } from './store/authSlice'
import {Header,Fouter} from './componet/Index'

import './App.css'


function App() {
  const [loading,setloading]=useState(true)
  const dispatch=useDispatch()

  useEffect(()=>{
        authservice.getCurrentUser()
        .then((userData)=>{
            if(userData){
              dispatch(login({userData}))

            }
            else{
              dispatch(logout())
            }
        })
        .finally(()=>setloading(false))  
  },[])

  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-[#dda15e]'>
      <div className='w-full block'>
           <Header />
            <main>
                 <Outlet></Outlet>
            </main>
           <Fouter />
            
      </div>
    </div>
  ) : null 
}

export default App
