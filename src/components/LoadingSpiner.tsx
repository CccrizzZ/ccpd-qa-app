import React from 'react'
import { SyncLoader } from 'react-spinners'

type LoadingSpinerProp = {
    show: boolean
}

const LoadingSpiner: React.FC<LoadingSpinerProp> = ({ show }) => {
    if (show) {
        return (
            <div style={{ width: '100vw', height: '100vh', textAlign: 'center', backgroundColor: '#222', zIndex: '5', position: 'absolute', opacity: '0.9' }}>
                <div style={{ backgroundColor: '#000', borderRadius: '2em', display: 'inline-block', marginTop: '35vh', padding: '35px' }}>
                    <SyncLoader color='#0d6efd' />
                    <h2 style={{ color: 'white' }}>Loading...</h2>
                </div>
            </div>
        )
    }
}

export default LoadingSpiner

