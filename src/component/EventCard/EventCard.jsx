import React from 'react'
import './EventCard.css'
import { useNavigate } from 'react-router-dom'
const EventCard = ({ title = '', venue = '', startDate = '', startTime = '', endTime = '', originalPrice = '', salePrice = '', thumbNailImage = '', id = '', }) => {
    const navigate = useNavigate()
    return (
        <>
            <div class="gx9-card-box" onClick={(() => navigate(`/event-details/${title?.trim()}/${id}`))}>

                <div class="gx9-image-container">
                    <img src={thumbNailImage} alt="Event Image" class="gx9-main-image" />

                </div>

                <div class="gx9-content-area">
                    <h2 class="gx9-event-title">{title}</h2>


                    <div class="gx9-location-row">
                        <img src='/Vector2.svg' />
                        <span>{venue}</span>
                    </div>

                    <div class="gx9-datetime-row">
                        <div class="gx9-date">
                            <img src='/Union.svg' />
                            <span>{startDate}</span>
                        </div>

                        <div class="gx9-time">
                            <img src='/Clock.svg' />

                            <span>{startTime} - {endTime}</span>
                        </div>
                    </div>
                    {salePrice && <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div class="gx9-price-row">
                            <span class="gx9-old-price">${originalPrice}</span>
                            <span class="gx9-new-price">${salePrice}</span>
                        </div>

                        <strong onClick={(() => navigate(`/event-details/${title?.trim() }/${id}`))} style={{
                            color: 'rgba(102, 0, 204, 1)',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor: 'pointer'
                        }}>Know More</strong>
                    </div>}

                    {(originalPrice && !salePrice) && <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div class="gx9-price-row">
                            <span class="gx9-new-price">${originalPrice}</span>
                        </div>
                        <strong onClick={(() => navigate(`/event-details/${title?.trim()}/${id}`))} style={{
                            color: 'rgba(102, 0, 204, 1)',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor:'pointer'
                        }}>Know More</strong>

                    </div>

                    }
                </div>

            </div>
        </>
    )
}

export default EventCard
