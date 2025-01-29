import React from 'react'

function Button({
    children,
    type='Button',
    bgColor="bg-blue-600",
    textColor='text-red',
    className='',
    ...props
}) 
{
  return (
    <button className={`px-4 py-2 rounded-lg ${className} ${textColor} ${type} `} {...props}> {children}</button>
  )
}

export default Button