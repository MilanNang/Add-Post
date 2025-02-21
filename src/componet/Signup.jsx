import React, { useState } from 'react'
import authservice from '../appwrite/auth'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/authSlice'
import { Button, Logo, Input } from './Index'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'

function Signup() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPopup, setShowPopup] = useState(false)

    const create = async (data) => {
        setError("")
        setShowPopup(true)  // Show popup when signup starts
        try {
            setLoading(true)
            const userData = await authservice.createAccount(data)
            if (userData) {
                const userData = await authservice.getCurrentUser()
                if (userData) dispatch(login(userData));
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
            setShowPopup(false)  // Hide popup after signup process ends
        }
    }

    return (
        <div className="flex items-center justify-center">
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                {error && <p className='text-red-600 mt-8 text-center'>{error}</p>}
                <form onSubmit={handleSubmit(create)}>
                    <div className="space-y-5">
                        <Input
                            label="Full Name :"
                            placeholder="Enter Your Name"
                            {...register("name", {
                                required: true
                            })}
                        />
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
                            placeholder="Enter the password"
                            type="password"
                            {...register("password", {
                                required: true,
                            })}
                        />
                        <Button type="submit" className="w-full text-black bg-slate-400">
                            {loading ? "Creating Account..." : "Create Account"}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Popup Modal */}
            {showPopup && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-lg font-bold">Signing up...</h2>
                        <p className="text-gray-500 mt-2">Please wait while we create your account.</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Signup
