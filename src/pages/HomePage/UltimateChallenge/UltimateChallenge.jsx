import React from 'react'
import './UltimateChallenge.css'
import { useNavigate } from 'react-router-dom'
const UltimateChallenge = () => {
    const navigate = useNavigate()
    return (
        <>
            <div className='ultimate_challenge_wrapper' style={{
                backgroundImage:"url('/Rectangle 6712.png')"
            }}>
            {/* <div className='background_overlay'></div> */}
                <div className='ultimate_challenge_conten_wrapper'>
                    <div className='ultimate_challenge_text_wrapper'>
                        <h1>Ready for the Ultimate Challenge?</h1>
                        <h2>Built for endurance, strength & every obstacle <br/>ahead.</h2>
                        <button onClick={(()=>navigate('/auth'))}>Register Now</button>
                    </div>
                    <div className='ultimate_challenge_image_wrapper'>
                        {/* <div className='ultimate_img'>
                            <img src='/b6531fd0f1da58a1287e3a4c28c837eef6f2ca96.png'/>
                        </div>
                        <div className='ultimate_img'>
                            <img src='/08304bcad17976803f86b956925e1ddafc7de730.jpg' />
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default UltimateChallenge
