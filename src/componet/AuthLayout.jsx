
import { useNavigate } from 'react-router-dom'
import React,{useState,useEffect} from 'react'
import { useSelector } from 'react-redux'

export default function Protected({children,authentication=true}) {

        const navigate=useNavigate()
        const [loader,setLoader]=useState(true)
        const authStatus=useSelector(state=>state.auth.status)
        console.log(authStatus,"auth")

        useEffect(()=>{
            //let authValue=authState===true?true:false  this is a lete vertion of after code of if eles f code 
            if(authentication && authStatus!==authentication){
                    navigate("/login")
            }else if(!authentication && authStatus!==authentication)
            {
                navigate("/")
            }
            setLoader(false)
        },[authStatus,navigate,authentication])
  return loader ? <h1>Looding...</h1> :<>{children}</>
}

