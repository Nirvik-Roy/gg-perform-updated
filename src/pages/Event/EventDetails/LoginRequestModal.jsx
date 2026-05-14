import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const LoginRequestModal = ({ setShowLoginModal }) => {
    const navigate = useNavigate()
    return (
        <>
            <div
                onClick={(() => setShowLoginModal(false))}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(26,26,26,0.75)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 9999
                }}
            >
                <div
                    style={{
                        background: "#ffffff",
                        padding: "20px 30px",
                        borderRadius: "12px",
                        width: "320px",
                        textAlign: "center"
                    }}
                >
                    {/* <h3 style={{ color: "#1a1a1a", marginBottom: "15px" }}>
                        Login Required
                    </h3> */}

                    <p style={{ color: "#555", marginBottom: "25px",
                    fontSize:'19px' }}>
                        Returning customer? <Link to={'/auth'} style={{
                            fontSize:'19px',
                            fontWeight:'600'
                        }}>Login</Link>
                    </p>

                    <p style={{
                        color: "#555", marginBottom: "25px",
                        fontSize: '17px',
                        lineHeight:'25px'
                    }}>New to GG Perform? Create your account during registration to proceed securely.</p>
                    

                    {/* <button
                        onClick={() => navigate("/auth")}
                        style={{
                            width: "100%",
                            padding: "10px",
                            backgroundColor: "#6300c3",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            marginBottom: "10px",
                            cursor: "pointer"
                        }}
                    >
                        Go to Login
                    </button>

                    <button
                        onClick={() => setShowLoginModal(false)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            backgroundColor: "#fff",
                            color: "#6300c3",
                            border: "2px solid #6300c3",
                            borderRadius: "8px",
                            cursor: "pointer"
                        }}
                    >
                        Cancel
                    </button> */}
                    <div style={{
                        display:'flex',
                        justifyContent:'flex-start',
                        alignItems:'center',
                        gap:'15px'
                    }}>

                        <button
                            onClick={() => setShowLoginModal(false)}
                            style={{
                                width: "100%",
                                padding: "10px",
                                backgroundColor: "#fff",
                                color: "#6300c3",
                                border: "2px solid #6300c3",
                                borderRadius: "8px",
                                cursor: "pointer"
                            }}
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() => navigate('/auth')}
                            style={{
                                width: "100%",
                                padding: "10px",
                                backgroundColor: "#6300c3",
                                color: "#fff",
                                border: "2px solid #6300c3",
                                borderRadius: "8px",
                                cursor: "pointer"
                            }}
                        >
                            Register
                        </button>
                    </div>
                    
                </div>
            </div>
        </>
    )
}

export default LoginRequestModal
