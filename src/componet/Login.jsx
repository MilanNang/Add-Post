import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import { Logo, Button, Input } from '../componet/Index.js'
import { useDispatch } from 'react-redux'
import authService from '../appwrite/auth'
import { useForm } from "react-hook-form"

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPopup, setShowPopup] = useState(false)

    const login = async (data) => {
        setError("")
        setShowPopup(true)  // Show popup when login starts
        try {
            setLoading(true)
            const session = await authService.login(data)
            if (session) {
                const userData = await authService.getCurrentUser()
                if (userData) dispatch(authLogin(userData))
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
            setShowPopup(false)  // Hide popup after login process ends
        }
    }

    return (
        <div className='flex items-center justify-center w-full'>
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
                {error && <p className='text-red-600 mt-8 text-center'>{error}</p>}
                <form onSubmit={handleSubmit(login)} className='mt-8'>
                    <div className='space-y-5'>
                        <Input
                            label="Email :"
                            placeholder="Enter Your Email"
                            type="email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPatern: (value) => /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(value) || "Email address must be valid"
                                }
                            })}
                        />
                        <Input
                            label="Password :"
                            placeholder="Enter tha password"
                            type="password" {...register("password", { required: true })}
                        />
                        {
                            loading ? (
                                <Button className='w-full bg-slate-500' type='submit'>Sige In.....
                                </Button>
                            ) : (
                                <Button className='w-full bg-slate-500' type='submit'>Sige In
                                </Button>
                            )
                        }
                    </div>
                </form>
            </div>

            {/* Popup Modal */}
            {showPopup && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-lg font-bold">Logging in...</h2>
                        <p className="text-gray-500 mt-2">Please wait while we log you in.</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Login
