import React from 'react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {

    const navigate = useNavigate()
    const [input, setInput] = React.useState('')

    const onSubmitHandler = (e) => {
        e.preventDefault()
        navigate(`/marketplace?search=${input}`)
    }

    return (
        <>

            <div className="rethink relative flex flex-col items-center justify-center text-sm px-4 md:px-16 lg:px-24 xl:px-40 text-gray-800">

                {/* Avatars + Stars */}
                <div className="flex items-center mt-24 md:mt-36">
                    <div className="flex -space-x-3 pr-3">
                        <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" alt="user3" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[1]" />
                        <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="user1" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-2" />
                        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" alt="user2" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[3]" />
                        <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" alt="user3" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[4]" />
                        <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="user5" className="size-8 rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[5]" />
                    </div>

                    <div>
                        <div className="flex ">
                            {Array(5).fill(0).map((_, i) => (
                                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star text-transparent fill-[#a11c5e]" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
                            ))}
                        </div>
                        <p className="text-sm text-gray-700"> Trusted by 10,000+ founders & investors </p>
                    </div>
                </div>

                {/* Headline */}
                <h1 className="text-4xl md:text-6xl font-bold max-w-3xl text-center mt-4 leading-tight text-slate-900">
                    Discover & Fund <span className="relative inline-block bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] bg-clip-text text-transparent pb-1">
                        Innovative
                        <svg className="absolute -bottom-1 left-0 w-full h-2.5 text-[#a11c5e] opacity-80" viewBox="0 0 100 20" preserveAspectRatio="none">
                            <path d="M0,15 Q50,2 100,15" fill="none" stroke="url(#arc-gradient)" strokeWidth="5" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="arc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#702371" />
                                    <stop offset="50%" stopColor="#a11c5e" />
                                    <stop offset="100%" stopColor="#442077" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </span> <span className='relative bg-gradient-to-r from-[#a11c5e] to-[#702371] bg-clip-text text-transparent'>Startups</span>
                </h1>

                <p className="max-w-xl text-center text-base my-7 text-slate-600">
                    A trusted startup marketplace where founders raise capital and investors discover high-potential startups across SaaS, FinTech, AI, and more.
                </p>

                {/* Search Box */}
                <form onSubmit={onSubmitHandler} className='w-full flex justify-center group mt-2 px-2 sm:px-0'>
                    <label className='border border-gray-300 shadow-lg focus-within:border-[#a11c5e] focus-within:ring-2 focus-within:ring-pink-200 transition-all rounded-2xl p-1.5 flex items-center w-full max-w-lg bg-white'>
                        <input
                            onChange={e => setInput(e.target.value)}
                            value={input}
                            type="text"
                            placeholder='Search startups by name, sector, or keyword...'
                            className='pl-3 sm:pl-4 min-w-0 flex-1 outline-none text-xs sm:text-sm text-slate-700 placeholder:text-gray-400'
                        />
                        <button className='bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] hover:opacity-95 text-white py-2.5 sm:py-3 px-5 sm:px-8 rounded-xl cursor-pointer text-xs sm:text-sm font-bold shadow-md shadow-pink-500/20 active:scale-95 transition-all shrink-0'>
                            Explore
                        </button>
                    </label>
                </form>
            </div>

            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?&family=Rethink+Sans:ital,wght@0,400..800;1,400..800&display=swap');

                   .rethink {
                       font-family: 'Rethink Sans', sans-serif;
                   }
                `}
            </style>
        </>
    );
}

export default Hero;
