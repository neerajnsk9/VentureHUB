import React from 'react'

const Title = ({ title, description }) => {
  return (
    <div className='flex flex-col items-center mb-8 text-center px-4'>
        <h3 className='text-2xl font-bold text-slate-900'> {title} </h3>
        <p className='text-slate-600 max-w-[500px] text-center mt-1 text-sm sm:text-base'> {description} </p>
    </div>
  )
}

export default Title