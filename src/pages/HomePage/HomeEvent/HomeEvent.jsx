import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'
import EventCard from '../../../component/EventCard/EventCard'
import { getEvent } from '../../../utils/Event'
import CommonLoader from '../../../component/common-loader'
import { convertTo12Hour, formatDate } from '../../../utils/timeFormatter'
import { Link } from 'react-router-dom'

const HomeEvent = () => {
    const [eventData, seteventData] = useState([])
    const [loading, setloading] = useState(false)

    const fetchEvent = async () => {
        setloading(true)
        const res = await getEvent()
        if (res?.data?.status == 'success') {
            seteventData(res?.data?.data || [])
        }
        setloading(false)
    }

    useEffect(() => {
        fetchEvent()
    }, [])
    return (
        <>
            <div className="top-courses-section">
                {/* Header */}
                <div className="top-courses-header">
                    <h2>Upcoming Events</h2>
                    <Link to="/events" className="top-courses-view-all">
                        View All
                    </Link>
                </div>
                {loading && <CommonLoader />}
                {(eventData?.length <= 0 && !loading) && <p style={{
                    textAlign: 'center',
                    fontWeight: '600'
                }}>No events are currently available</p>}
                {/* Swiper Slider */}
                {!loading && <Swiper
                    spaceBetween={20}
                    loop
                    autoplay={{ delay: 3000 }}
                    pagination={{ clickable: true }}
                    slidesPerGroup={2}
                    breakpoints={{
                        0: {
                            slidesPerView: 2, // 1 full + part of 2nd
                        },
                        480: {
                            slidesPerView: 1,
                        },
                        640: {
                            slidesPerView: 2,
                        },
                        768: {
                            slidesPerView: 2.5,
                        },
                        1024: {
                            slidesPerView: 3,
                        },
                        1280: {
                            slidesPerView: 4,
                        },
                    }}
                    modules={[Autoplay]}
                    className="top-courses-swiper"
                >
                    {eventData?.map((e) => (
                        <SwiperSlide key={e.id}>
                            <EventCard status={e?.status} id={e?.id} title={e?.name} thumbNailImage={e?.thumbnail || ''} venue={e?.venue || ''} startDate={formatDate(e?.event_date) || ''} startTime={convertTo12Hour(e?.start_time) || ''} endTime={convertTo12Hour(e?.end_time) || ''} originalPrice={e?.original_price} salePrice={e?.sale_price || ''} />
                        </SwiperSlide>
                    ))}
                </Swiper>}
            </div>
        </>
    )
}

export default HomeEvent
