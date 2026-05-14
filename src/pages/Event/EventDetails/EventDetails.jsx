import './EventDetails.css'
import Accordion from '../../../component/Accordion.jsx'
import CommonButton from '../../../component/CommonButton.jsx'
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CommonLoader from '../../../component/common-loader.jsx';
import { getSingleEvent, submitEventEnquiry } from '../../../utils/Event';
import { convertTo12Hour, formatDate } from '../../../utils/timeFormatter';
import toast from 'react-hot-toast';
import { useBanner } from '../../../context/BannerContext.jsx';
import LoginRequestModal from './LoginRequestModal.jsx';

const countryCodes = [
    { code: '+1' },
    { code: '+44' },
    { code: '+91' },
    { code: '+61' },
    { code: '+86' },
    { code: '+81' },
    { code: '+49' },
    { code: '+33' },
]

const blankForm = () => ({
    first_name: '',
    last_name: '',
    email: '',
    countryCode: '+1',
    phone: '',
    message: '',
})

const isValidEmail = (val) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val?.trim?.() || '')

const EventDetails = () => {
    const navigate = useNavigate()
    const { id } = useParams();
    const location = useLocation()
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [singleEventData, setSingleEventData] = useState({})
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState(blankForm())
    const [formErrors, setFormErrors] = useState({})
    const [enquiryLoading, setEnquiryLoading] = useState(false)

    // ── fetch event ───────────────────────────────────────────
    const fetchSingleEvent = async () => {
        try {
            setLoading(true)
            const res = await getSingleEvent?.(id)
            if (res?.data?.status === 'success') {
                setSingleEventData(res?.data?.data || {})
            }
        } catch (err) {
            console?.error?.(err)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        if (id) fetchSingleEvent()
    }, [id])

    const { setBannerTitle } = useBanner();
    useEffect(() => {
        setBannerTitle(singleEventData?.name)

    }, [singleEventData, location.pathname])
    // ── Register Now → just navigate, checkout page does everything ──
    const handleRegisterNow = () => {
        // const token = localStorage.getItem('gg website token')
        // if(token){
        //     navigate?.(`/events/checkout/${id}`)
        // }else{
        //     setShowLoginModal(true)
        // }
        navigate?.(`/events/checkout/${id}`)

    }

    // ── enquiry handlers ──────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e?.target || {}
        setForm(prev => ({ ...prev, [name]: value }))
        setFormErrors(prev => ({ ...prev, [name]: '' }))
    }

    const validate = () => {
        const errors = {}

        if (!form?.first_name?.trim?.()) {
            errors.first_name = 'First name is required'
        } else if (form?.first_name?.trim?.()?.length > 255) {
            errors.first_name = 'First name must be under 255 characters'
        }

        if (!form?.last_name?.trim?.()) {
            errors.last_name = 'Last name is required'
        } else if (form?.last_name?.trim?.()?.length > 255) {
            errors.last_name = 'Last name must be under 255 characters'
        }

        if (!form?.email?.trim?.()) {
            errors.email = 'Email is required'
        } else if (!isValidEmail(form?.email)) {
            errors.email = 'Please enter a valid email'
        } else if (form?.email?.trim?.()?.length > 255) {
            errors.email = 'Email must be under 255 characters'
        }

        if (!form?.phone?.trim?.()) {
            errors.phone = 'Phone number is required'
        } else if (form?.phone?.trim?.()?.length > 20) {
            errors.phone = 'Phone number is too long'
        }

        if (!form?.message?.trim?.()) {
            errors.message = 'Message is required'
        }

        return errors
    }

    const handleEnquirySubmit = async () => {
        const errors = validate()
        if (Object?.keys?.(errors)?.length > 0) {
            setFormErrors(errors)
            toast?.error?.('Please fill all required fields correctly')
            return
        }

        const payload = {
            first_name: form?.first_name?.trim?.(),
            last_name: form?.last_name?.trim?.(),
            email: form?.email?.trim?.(),
            phone: `${form?.countryCode}${form?.phone?.trim?.()}`,
            message: form?.message?.trim?.(),
        }

        setEnquiryLoading(true)
        try {
            const res = await submitEventEnquiry?.(id, payload)
            if (res?.data?.status === 'success') {
                toast?.success?.(
                    res?.data?.message || 'Enquiry submitted successfully!'
                )
                setForm(blankForm())
                setFormErrors({})
            } else {
                toast?.error?.(
                    res?.data?.message || 'Failed to submit enquiry'
                )
            }
        } catch (error) {
            if (error?.response?.status === 422) {
                toast?.error?.(
                    error?.response?.data?.message ||
                    'Validation failed. Please check your inputs.'
                )
            } else if (error?.response?.status === 404) {
                toast?.error?.(
                    error?.response?.data?.message ||
                    'Event not found or not published'
                )
            } else {
                toast?.error?.(
                    error?.response?.data?.message ||
                    error?.message ||
                    'Something went wrong'
                )
            }
        } finally {
            setEnquiryLoading(false)
        }
    }

    return (
        <>
            {loading && <CommonLoader />}
            {showLoginModal && (
                <LoginRequestModal setShowLoginModal={setShowLoginModal} />
            )}
            {!loading && (
                <>
                    <h1 className="zx7-page-title">
                        {singleEventData?.name}{' '}
                        {/* <span className="zx7-event-id">
                            (#Event {singleEventData?.id})
                        </span> */}
                    </h1>

                    <div className="zx7-top-section">
                        <div className="zx7-image-box" style={{
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                top: '00',
                                left: '0',
                                zIndex: '6',
                                borderRadius: '15px',
                                backdropFilter: 'blur(5px)',
                                background: 'rgba(0,0,0,0.7)'
                            }}></div>
                            <div style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                top: '00',
                                left: '0',
                                zIndex: '5',
                                borderRadius: '15px',

                            }}>
                                <img
                                    src={singleEventData?.thumbnail}
                                    alt="Event Image"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        zIndex: '5',
                                        borderRadius: '15px',

                                    }}
                                />
                            </div>
                            <img
                                src={singleEventData?.thumbnail}
                                alt="Event Image"
                                className="zx7-main-img"
                                style={{
                                    zIndex: '9',
                                    position: 'relative'
                                }}
                            />
                        </div>

                        <div className="zx7-details-card">
                            <h2 className="zx7-details-title">Event Details</h2>

                            <div
                                className="zx7-price-row"
                                style={{
                                    borderBottom: '1px solid rgba(105,105,105,0.3)',
                                    paddingBottom: '10px',
                                }}
                            >
                                <span style={{ fontSize: '20px' }}>Price:</span>
                                {singleEventData?.sale_price ? (
                                    <div>
                                        <span className="zx7-old-price">
                                            ${singleEventData?.original_price}
                                        </span>
                                        <span className="zx7-new-price">
                                            ${singleEventData?.sale_price}
                                        </span>
                                    </div>
                                ) : (
                                    singleEventData?.original_price && (
                                        <div>
                                            <span className="zx7-new-price">
                                                ${singleEventData?.original_price}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="zx7-info-row">
                                <span className="zx7-icon">
                                    <img src='/calendar.svg' alt='date' />
                                </span>
                                <span className="zx7-label">Date:</span>
                                <span className="zx7-value">
                                    {formatDate?.(singleEventData?.event_date)}
                                </span>
                            </div>

                            <div className="zx7-info-row">
                                <span className="zx7-icon">
                                    <img src='/Clock (1).svg' alt='time' />
                                </span>
                                <span className="zx7-label">Time:</span>
                                <span className="zx7-value">
                                    {convertTo12Hour?.(singleEventData?.start_time)}
                                    {' – '}
                                    {convertTo12Hour?.(singleEventData?.end_time)}
                                </span>
                            </div>

                            <div className="zx7-info-row">
                                <span className="zx7-icon">
                                    <img src='/location.svg' alt='venue' />
                                </span>
                                <span className="zx7-label">Venue:</span>
                                <span className="zx7-value">
                                    {singleEventData?.venue}
                                </span>
                            </div>

                            <div className="zx7-info-row">
                                <span className="zx7-icon">
                                    <img src='/groups_3.svg' alt='registrants' />
                                </span>
                                <span className="zx7-label">
                                    Total Registrants Available
                                </span>
                                <span className="zx7-value">
                                    {singleEventData?.remaining_registrants || '0'}
                                    /
                                    {singleEventData?.total_registrants || '0'}
                                </span>
                            </div>




                            <div className='sponsors_wrapper166'>
                                <h3>Sponsors</h3>
                                <div className='sponsors_logo_wrapper'>
                                    {/* <img src='/Logo box.png'/> */}
                                    {id == 5 && <img src='/unnamed.png' />}
                                    {(id == 5 || id == 17 || id == 16 || id == 18) && <img src='/Hilton Barbados Resort 2025_Blue_RGB.png' />}
                                    {id == 16 && <img src='/US-PDL-Sport-Logo-Metallic-PMS877-_1_ 1.png'/>}
                                    {id == 18 && <img src='/Ruck up.png'/>}
                                    {id == 17 && <img src='/COW circle logo.jpg.jpeg' />}
                                </div>
                            </div>



                            {/* ── Register CTA ── */}
                            <div style={{
                                backgroundImage:
                                    "url('/5316a4ec363f415b077bb48696db5c52b7ac79c6.jpg')",
                                backgroundSize: 'cover',
                                height: 'fit-content',
                                minHeight: 'fit-content',
                                maxHeight: '144px',
                                width: '90%',
                                padding: '25px 20px',
                                borderRadius: '15px',
                                marginTop: '20px',
                                backgroundRepeat: 'no-repeat',
                                position: 'relative',
                            }}>
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: '0',
                                    left: '0',
                                    zIndex: '5',
                                    background: '#000000bb',
                                    borderRadius: '15px',
                                }} />
                                <h3 style={{
                                    color: '#fff',
                                    fontWeight: '800',
                                    fontSize: '27px',
                                    zIndex: '8',
                                    position: 'relative',
                                }}>
                                    Ready to Join the Event?
                                </h3>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    zIndex: '8',
                                    position: 'relative',
                                }}>
                                    <CommonButton
                                        disabled={!singleEventData?.is_booking_allowed}
                                        onClick={handleRegisterNow}
                                        text={
                                            singleEventData?.is_booking_allowed
                                                ? 'Join Now'
                                                : 'Already Registered'
                                        }
                                    />
                                    <img
                                        src='/image 169.png'
                                        style={{ width: '100px' }}
                                        alt='register'
                                    />

                                </div>
                            </div>

                            {singleEventData?.share_options && (
                                <div className="zx7-share-section" style={{
                                    marginTop: '15px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <h3 style={{
                                        margin: '0'
                                    }}>Share</h3>
                                    <div className="zx7-social-icons" style={{
                                        marginTop: '0'
                                    }}>
                                        <img src='/Facebook.svg' alt='facebook' />
                                        <img src='/Instagram.svg' alt='instagram' />
                                        <img src='/Whatsapp_new.svg' alt='whatsapp' />
                                        <img src='/Twitter.svg' alt='twitter' />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="zx7-about-section">
                        <h2 className="zx7-about-title">About The Event</h2>
                        <p
                            className="zx7-about-text"
                            dangerouslySetInnerHTML={{
                                __html:
                                    singleEventData?.about_description ||
                                    'Lorem ipsum dolor sit amet.',
                            }}
                        />
                    </div>

                    <div className='faq_enquire_wrapper'>
                        <div>
                            <h2 className="fq8-title">FAQs</h2>
                            {singleEventData?.faqs?.length > 0
                                ? <Accordion
                                    questionData={singleEventData?.faqs || []}
                                />
                                : <p>No FAQs added...</p>
                            }
                        </div>

                        <div className='enquire_form_wrapper'>
                            <h3>Enquire Now</h3>

                            <div className='form_gird' style={{ margin: '20px 0' }}>

                                <div className='input_form_wrapper'>
                                    <label>First Name <span>*</span></label>
                                    <input
                                        type='text'
                                        name='first_name'
                                        placeholder='Enter first name'
                                        value={form?.first_name || ''}
                                        onChange={handleChange}
                                        style={formErrors?.first_name
                                            ? { border: '1px solid red' }
                                            : {}
                                        }
                                    />
                                    {formErrors?.first_name && (
                                        <small style={{ color: 'red', fontSize: '12px' }}>
                                            *{formErrors?.first_name}
                                        </small>
                                    )}
                                </div>

                                <div className='input_form_wrapper'>
                                    <label>Last Name <span>*</span></label>
                                    <input
                                        type='text'
                                        name='last_name'
                                        placeholder='Enter last name'
                                        value={form?.last_name || ''}
                                        onChange={handleChange}
                                        style={formErrors?.last_name
                                            ? { border: '1px solid red' }
                                            : {}
                                        }
                                    />
                                    {formErrors?.last_name && (
                                        <small style={{ color: 'red', fontSize: '12px' }}>
                                            *{formErrors?.last_name}
                                        </small>
                                    )}
                                </div>

                                <div className='input_form_wrapper'>
                                    <label>Email <span>*</span></label>
                                    <input
                                        type='email'
                                        name='email'
                                        placeholder='Enter email address'
                                        value={form?.email || ''}
                                        onChange={handleChange}
                                        style={formErrors?.email
                                            ? { border: '1px solid red' }
                                            : {}
                                        }
                                    />
                                    {formErrors?.email && (
                                        <small style={{ color: 'red', fontSize: '12px' }}>
                                            *{formErrors?.email}
                                        </small>
                                    )}
                                </div>

                                <div className="form-group" style={{ gap: '0' }}>
                                    <label
                                        htmlFor="phone"
                                        style={{
                                            fontSize: '16px',
                                            color: 'rgba(47, 47, 47, 1)',
                                            fontWeight: '500',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        Phone
                                        <span className="edit-profile-required">*</span>
                                    </label>
                                    <div className="phone-input-group">
                                        <select
                                            name='countryCode'
                                            value={form?.countryCode || '+1'}
                                            onChange={handleChange}
                                            className="country-code-select"
                                            style={{
                                                background: 'transparent',
                                                outline: 'none',
                                                border: '1px solid rgba(40,46,57,0.57)',
                                            }}
                                        >
                                            {countryCodes?.map?.((country) => (
                                                <option
                                                    key={country?.code}
                                                    value={country?.code}
                                                >
                                                    {country?.code}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            placeholder="Enter phone number"
                                            value={form?.phone || ''}
                                            onChange={handleChange}
                                            style={{
                                                background: 'transparent',
                                                border: formErrors?.phone
                                                    ? '1px solid red'
                                                    : '1px solid rgba(40,46,57,0.57)',
                                                fontSize: '14px',
                                            }}
                                        />
                                    </div>
                                    {formErrors?.phone && (
                                        <small style={{ color: 'red', fontSize: '12px' }}>
                                            *{formErrors?.phone}
                                        </small>
                                    )}
                                </div>
                            </div>

                            <div className='input_form_wrapper' style={{ width: '100%' }}>
                                <label>Message <span>*</span></label>
                                <textarea
                                    name='message'
                                    placeholder='Enter message...'
                                    value={form?.message || ''}
                                    onChange={handleChange}
                                    style={formErrors?.message
                                        ? { border: '1px solid red' }
                                        : {}
                                    }
                                />
                                {formErrors?.message && (
                                    <small style={{ color: 'red', fontSize: '12px' }}>
                                        *{formErrors?.message}
                                    </small>
                                )}
                            </div>

                            <div style={{ marginTop: '20px' }}>
                                <CommonButton
                                    text={
                                        enquiryLoading
                                            ? 'Submitting...'
                                            : 'Contact Us'
                                    }
                                    onClick={handleEnquirySubmit}
                                    disabled={enquiryLoading}
                                />
                            </div>


                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default EventDetails