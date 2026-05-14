import React, { useEffect, useState } from 'react'
import './AllEvents.css'
import { getEvent } from '../../utils/Event'
import { formatDate, convertTo12Hour } from '../../utils/timeFormatter'
import EventCard from '../../component/EventCard/EventCard'
import { useBanner } from '../../context/BannerContext'
import { useLocation } from 'react-router-dom'
import CommonLoader from '../../component/common-loader'
const AllEvents = () => {
    const [eventData, seteventData] = useState([])
    const [loading, setloading] = useState(false)
    const location = useLocation()

    const { setBannerTitle } = useBanner();
    useEffect(() => {
        setBannerTitle("Events")

    }, [location.pathname])
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
            <div className='all_events_wrapper'>
                <div style={{
                    gridColumn: '1/-1'
                }}>
                    {loading && <CommonLoader />}

                </div>
                {(eventData?.length <= 0 && !loading) && <p style={{
                    textAlign: 'center',
                    gridColumn: '1/-1'
                }}>No events available...</p>}
                {!loading && <>
                    {eventData?.map((e) => (
                        <EventCard status={e?.status} id={e?.id} title={e?.name} thumbNailImage={e?.thumbnail || ''} venue={e?.venue || ''} startDate={formatDate(e?.event_date) || ''} startTime={convertTo12Hour(e?.start_time) || ''} endTime={convertTo12Hour(e?.end_time) || ''} originalPrice={e?.original_price} salePrice={e?.sale_price || ''} />
                    ))}
                </>}
            </div>
        </>
    )
}

export default AllEvents
