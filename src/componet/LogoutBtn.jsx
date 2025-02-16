import React from 'react'
import { useDispatch } from 'react-redux'
import authservice from '../appwrite/auth'
import { logout } from '../store/authSlice'
import { useNavigate } from 'react-router-dom'

function Logoutbtn() {
  const navigate = useNavigate()
    const dispatch=useDispatch()
    const logoutHandler=()=>{
        authservice.logout().then(()=>{

            dispatch(logout())
            navigate('/login')
        })
    }
  return (
    <button className=" h-[40px] inline-block px-6  duration-200 hover:bg-red-700 rounded-full" onClick={logoutHandler}>Logout</button>
  )
}

export default Logoutbtn