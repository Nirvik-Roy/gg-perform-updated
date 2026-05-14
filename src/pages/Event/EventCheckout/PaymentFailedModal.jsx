import React from "react";
import "./PaymentFailedModal.css";
import { useNavigate } from "react-router-dom";

const PaymentFailedModal = ({ isOpen, onRetry, onClose }) => {
    const navigate = useNavigate()
    if (!isOpen) return null;

    return (
        <div className="pf8x-overlay">
            <div className="pf8x-modal">

                <div className="pf8x-iconWrap">
                    <div className="pf8x-crossCircle">
                        ✕
                    </div>
                </div>

                <h2 className="pf8x-title">Payment Failed</h2>

                <p className="pf8x-message">
                    Unfortunately, your payment could not be processed.
                    Please check your payment details and try again later.
                </p>

                <div className="pf8x-btnGroup">
                    <button className="pf8x-retryBtn" onClick={(()=>{
                        navigate('/MyAccount')
                    })}>
                        Redirect to dashboard
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PaymentFailedModal;