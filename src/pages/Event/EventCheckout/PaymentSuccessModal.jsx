import React, { useEffect } from "react";
import "./PaymentSuccessModal.css";
import { Link, useNavigate } from "react-router-dom";

const PaymentSuccessModal = ({ isOpen, onClose }) => {
    
    if (!isOpen) return null;

    return (
        <div className="ps7x-overlay">
            <div className="ps7x-modal">

                <div className="ps7x-iconWrap">
                    <div className="ps7x-checkCircle">
                        ✓
                    </div>
                </div>

                <h2 className="ps7x-title">Payment Successful!</h2>

                <p className="ps7x-message">
                    You're all set!<br />
                    Redirecting to your dashboard
                </p>

                <p>If not redirected, <Link>Click continue</Link></p>

                <button className="ps7x-button" onClick={(()=>{
                    navigate('/MyAccount')
                    onClose
                })}>
                    Continue
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccessModal;