import React from 'react'

const Button = ({ text }) => {
    return (
        <button
            className='
                mt-12

                px-10
                py-5

                rounded-full

                bg-zinc-700/90
                backdrop-blur-xl

                border
                border-white/10

                text-white
                text-lg

                hover:bg-zinc-600
                hover:scale-105

                transition-all
                duration-300
                '
        >
            {text}
        </button>
    )
}

export default Button