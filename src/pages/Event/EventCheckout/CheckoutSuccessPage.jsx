import React, { useEffect, useRef, useState } from "react";
import PaymentSuccessModal from "./PaymentSuccessModal.jsx";
import { getSessionDetails } from "../../../utils/Event.js";
import { QRCodeSVG } from 'qrcode.react'
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Barcode from "react-barcode";
import CommonLoader from "../../../component/common-loader.jsx";
import TicketDesign from "./TicketDesign.jsx";
import html2canvas from 'html2canvas'
import { useBanner } from "../../../context/BannerContext.jsx";
const CheckoutSuccessPage = () => {
    const navigate = useNavigate()
    const ticketRef = useRef(null)
    const [ticketDetails, setticketDetails] = useState([])
    const [qrPayload, setqrPayload] = useState('');
    const [loading, setloading] = useState(false)
    const [searchParams] = useSearchParams();
    const location = useLocation()
    const session_id = searchParams.get("session_id");
    // const testSessionId = 'cs_test_a1hwYODs0wKorBn7fBaWyAZWDFZko4hKpN2U5YQUaLnIkNSlHmQnAijCyK'
    const fetchTicket = async () => {
        setloading(true)
        const res = await getSessionDetails(session_id)
        if (res?.data?.status == 'success') {
            setticketDetails(res?.data?.data || {})
            setqrPayload(res?.data?.data?.tickets?.[0]?.qr_payload)
            setloading(false)
        }
        setloading(false)
    }
    useEffect(() => {
        fetchTicket()
    }, [session_id])



    const handleDownload = async () => {
        if (!ticketRef.current) return
        const canvas = await html2canvas(ticketRef.current, {
            scale: 3,
            useCORS: true,
            backgroundColor: '#e6e6e6',
            logging: false,
        })
        const link = document.createElement('a')
        link.href = canvas.toDataURL('image/png')
        link.download = `${ticketDetails?.event?.name || 'ticket'}-ticket.png`
        link.click()
    }

    useEffect(() => {
        if (ticketDetails?.tickets?.[0]?.qr_payload) {
            handleDownload()
        }
    }, [ticketDetails])

    const { setBannerTitle, setbannerDescription4 } = useBanner();
    useEffect(() => {
        setBannerTitle('Payment Successful')
        setbannerDescription4('Your ticket has been confirmed. A confirmation email has been sent to your registered email address.')

    }, [location.pathname])


    // useEffect(() => {
    //     // Remove the tag when this route mounts
    //     const meta = document.querySelector('meta[name="viewport"]');
    //     if (meta) meta.remove();

    //     // Restore it when leaving this route
    //     return () => {
    //         const restored = document.createElement('meta');
    //         restored.name = 'viewport';
    //         restored.content = 'width=device-width, initial-scale=1.0';
    //         document.head.appendChild(restored);
    //     };
    // }, []);
    return (
        <>
            {loading && <CommonLoader />}

            {!loading &&
                <div className="c2000">

                    {/* Success Header Section */}
                    <div className="c2001">
                        {/* <div className="c2002">✅ Payment Successful</div> */}
                        {/* <div className="c2003">
                            Your ticket has been confirmed. A confirmation has been sent to your email.
                        </div> */}
                        {/* {session_id && (
                            <div className="c2004">
                                Reference ID: <span>{session_id}</span>
                            </div>
                        )} */}
                    </div>

                    {/* Your Existing Ticket Design (UNCHANGED) */}
                    <TicketDesign ticketRef={ticketRef} qrPayload={qrPayload} ticketDetails={ticketDetails} />

                    <div className="c2005">
                        <button className="c2006" onClick={handleDownload}>Download Ticket</button>
                        {/* <button onClick={(() => navigate('/'))} className="c2007">Go To Home</button> */}
                    </div>

                </div>
            }

        </>
    )
}

export default CheckoutSuccessPage
