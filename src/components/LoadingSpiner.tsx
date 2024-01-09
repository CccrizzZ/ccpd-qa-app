import React from 'react'
import { PulseLoader } from 'react-spinners'

type LoadingSpinerProp = {
  show: boolean
}

const LoadingSpiner: React.FC<LoadingSpinerProp> = ({ show }) => {
  if (show) {
    return (
      <div className='fixed flex h-screen w-full text-center select-none opacity-90 bg-neutral-800 justify-center items-center' style={{ zIndex: '1200' }} >
        <div className='rounded-lg p-6 pt-10' style={{ backgroundColor: '#000', display: 'inline-block' }}>
          <PulseLoader className='ml-auto mr-auto' color='#D97706' />
          <h4 className='mt-5 text-white'>Loading...</h4>
        </div>
      </div>
    )
  }
}

export default LoadingSpiner

