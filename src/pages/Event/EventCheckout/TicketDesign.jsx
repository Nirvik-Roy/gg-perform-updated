import React from 'react'
import { convertTo12Hour, formatDate } from '../../../utils/timeFormatter'
import { QRCodeSVG } from 'qrcode.react'
import './EventCheckout.css'
const TicketDesign = ({ ticketDetails, qrPayload ,ticketRef}) => {
    return (
        <>
            <div className="c1001" ref={ticketRef}>
                <div className="c1002">
                    <div className="c1003">
                        <h1 className="c1004">{ticketDetails?.event?.name}</h1>

                        <div className="c1005">
                            <p><span>Date:</span> {formatDate(ticketDetails?.event?.event_date)}</p>
                            <p><span>Time:</span> {convertTo12Hour(ticketDetails?.event?.start_time)} - {convertTo12Hour(ticketDetails?.event?.end_time)}</p>
                            <p><span>Venue:</span> {ticketDetails?.event?.venue}</p>
                            <p><span>Ticket Holder:</span> {ticketDetails?.attendees?.[0]?.first_name} {ticketDetails?.attendees?.[0]?.last_name}</p>
                        </div>
                    </div>

                    <div className="c1006">
                        {qrPayload && (
                            <QRCodeSVG
                                value={qrPayload}
                                size={'100%'}
                                level="H"
                                includeMargin={true}
                            />
                        )}
                    </div>
                </div>

                <div className="c1007">
                    <div className="c1008">Powered By</div>
                    <div className="c1009">
                        <img src="/image 169.png" alt="" />
                        <img src="/gg-logo.png" alt="" />
                    </div>
                </div>
            </div>


           
        </>
    )
}

export default TicketDesign
