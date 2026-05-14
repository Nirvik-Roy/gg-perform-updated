import React, { useEffect, useState } from 'react'
import './EventCheckout.css'
import {
    getSingleEvent,
    checkoutPreview,
    applyCoupon,
    createCheckoutSession,
} from '../../../utils/Event'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import CommonLoader from '../../../component/common-loader.jsx'
import CommonButton from '../../../component/CommonButton.jsx'
import { useBanner } from '../../../context/BannerContext.jsx'

// ─── helpers ──────────────────────────────────────────────────
const centsToDisplay = (cents) =>
    ((cents || 0) / 100).toFixed(2)

const isValidEmail = (val) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val?.trim?.() || '')

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

const blankPersonal = () => ({
    first_name: '',
    last_name: '',
    email: '',
    countryCode: '+1',
    phone: '',
})

const EventCheckout = () => {

    
    const navigate = useNavigate()
    const { id } = useParams()
    const [isLogin, setisLogin] = useState(false)
    // ── event data ────────────────────────────────────────────
    const [eventData, setEventData] = useState({})
    const [eventLoading, setEventLoading] = useState(false)

    // ── preview data ──────────────────────────────────────────
    const [previewData, setPreviewData] = useState(null)
    const [previewLoading, setPreviewLoading] = useState(false)

    // ── personal info ─────────────────────────────────────────
    const [personal, setPersonal] = useState(blankPersonal())
    const [personalErrors, setPersonalErrors] = useState({})

    useEffect(() => {
        const userData = localStorage.getItem('gg website user')
        const parsedData = JSON.parse(userData)
        console.log(parsedData)
        if (parsedData) {
            setPersonal({
                first_name: parsedData?.first_name || '',
                last_name:parsedData?.last_name || '',
                email:parsedData?.email || '',
                phone:parsedData?.phone || ''
            })
        }
    }, [])
    // ── date of birth ─────────────────────────────────────────
    const [dob, setDob] = useState('')
    const [dobError, setDobError] = useState('')

    // ── answers ───────────────────────────────────────────────
    const [regAnswers, setRegAnswers] = useState({})
    const [extAnswers, setExtAnswers] = useState({})

    // ── coupon ────────────────────────────────────────────────
    const [couponInput, setCouponInput] = useState('')
    const [appliedCoupon, setAppliedCoupon] = useState(null)
    const [couponLoading, setCouponLoading] = useState(false)
    const [couponError, setCouponError] = useState('')

    // ── submit ────────────────────────────────────────────────
    const [submitLoading, setSubmitLoading] = useState(false)

    const registrationQuestions = eventData?.registration_questions || []
    const extraQuestions = eventData?.extra_questions || []

    // ── derived: display price ────────────────────────────────
    const hasPreview = previewData !== null

    const displayBasePrice = hasPreview
        ? centsToDisplay(previewData?.base_amount)
        : (eventData?.sale_price || eventData?.original_price || 0)

    const displayTotal = hasPreview
        ? centsToDisplay(previewData?.total_amount)
        : (eventData?.sale_price || eventData?.original_price || 0)

    // ─────────────────────────────────────────────────────────
    // ── CHECK IF PERSONAL INFO IS FULLY FILLED ────────────────
    // ─────────────────────────────────────────────────────────
    const isPersonalFilled = () => {
        if (!personal?.first_name?.trim?.()) return false
        if (!personal?.last_name?.trim?.()) return false
        if (!personal?.email?.trim?.() || !isValidEmail(personal?.email)) return false
        if (!personal?.phone?.trim?.()) return false
        if (eventData?.dob_required && !dob) return false
        return true
    }

    // ─────────────────────────────────────────────────────────
    // ── CHECK IF ALL REGISTRATION QUESTIONS ARE ANSWERED ──────
    // ─────────────────────────────────────────────────────────
    const allRegAnswered = (answers, questions) => {
        return questions?.every?.((q) => {
            const ans = answers?.[q?.id]
            if (q?.type === 'descriptive') {
                return typeof ans === 'string' && ans?.trim?.()?.length > 0
            }
            return Array.isArray(ans) && ans?.length > 0
        })
    }

    // ─────────────────────────────────────────────────────────
    // ── MASTER CHECK: EXTRAS UNLOCKED ONLY WHEN BOTH DONE ─────
    // ─────────────────────────────────────────────────────────
    const isExtrasUnlocked = () => {
        return (
            isPersonalFilled() &&
            allRegAnswered(regAnswers, registrationQuestions)
        )
    }

    // ── 1. fetch event ────────────────────────────────────────
    const fetchEvent = async () => {
        try {
            setEventLoading(true)
            const res = await getSingleEvent?.(id)
            if (res?.data?.status === 'success') {
                setEventData(res?.data?.data || {})
            } else {
                toast?.error?.(res?.data?.message || 'Failed to load event')
            }
        } catch (err) {
            toast?.error?.(
                err?.response?.data?.message ||
                err?.message ||
                'Failed to load event'
            )
        } finally {
            setEventLoading(false)
        }
    }

    useEffect(() => {
        if (id) fetchEvent()
    }, [id])

    // ── 2. checkout preview ───────────────────────────────────
    const runPreview = async (
        newRegAnswers = regAnswers,
        newExtAnswers = extAnswers,
        couponCode = appliedCoupon?.code || null
    ) => {
        try {
            setPreviewLoading(true)

            const payload = {
                registration_answers: newRegAnswers,
                extras_answers: newExtAnswers,
                ...(eventData?.dob_required && dob ? { date_of_birth: dob } : {}),
                ...(couponCode ? { coupon_code: couponCode } : {}),
            }

            const res = await checkoutPreview?.(id, payload)

            if (res?.data?.status === 'success') {
                setPreviewData(res?.data?.data || {})
            } else {
                console?.warn?.('preview skipped:', res?.data?.message)
            }
        } catch (err) {
            console?.warn?.('preview error:', err?.response?.data?.message || err?.message)
        } finally {
            setPreviewLoading(false)
        }
    }

    // ── registration answer handlers ──────────────────────────
    const handleRegSingle = (questionId, optionId) => {
        const next = { ...regAnswers, [questionId]: [Number(optionId)] }
        setRegAnswers(next)
    }

    const handleRegMulti = (questionId, optionId, checked) => {
        const prev = regAnswers?.[questionId] || []
        const numId = Number(optionId)
        const updated = checked
            ? [...prev, numId]
            : prev?.filter?.((o) => o !== numId)
        const next = { ...regAnswers, [questionId]: updated }
        setRegAnswers(next)
    }

    const handleRegDescriptive = (questionId, text) => {
        setRegAnswers(prev => ({ ...prev, [questionId]: text }))
    }

    // ── extras answer handlers ────────────────────────────────
    const handleExtSingle = (questionId, optionId) => {
        if (!isExtrasUnlocked()) {
            toast?.error?.('Please fill all personal info and answer all registration questions first')
            return
        }
        const next = { ...extAnswers, [questionId]: [Number(optionId)] }
        setExtAnswers(next)
        runPreview(regAnswers, next)
    }

    const handleExtMulti = (questionId, optionId, checked) => {
        if (!isExtrasUnlocked()) {
            toast?.error?.('Please fill all personal info and answer all registration questions first')
            return
        }
        const prev = extAnswers?.[questionId] || []
        const numId = Number(optionId)
        const updated = checked
            ? [...prev, numId]
            : prev?.filter?.((o) => o !== numId)
        const next = { ...extAnswers, [questionId]: updated }
        setExtAnswers(next)
        runPreview(regAnswers, next)
    }

    const { setBannerTitle } = useBanner()
    useEffect(() => {
        setBannerTitle(eventData?.name)
    }, [eventData])

    // ── apply coupon ──────────────────────────────────────────
    const handleApplyCoupon = async () => {
        if (!couponInput?.trim?.()) {
            setCouponError('Please enter a coupon code')
            return
        }

        if (!allRegAnswered(regAnswers, registrationQuestions)) {
            toast?.error?.('Please answer all registration questions before applying a coupon')
            return
        }

        setCouponLoading(true)
        setCouponError('')

        try {
            const res = await applyCoupon?.({ code: couponInput?.trim?.() })

            if (res?.data?.status === 'success') {
                const couponData = res?.data?.data
                setAppliedCoupon(couponData)
                toast?.success?.(res?.data?.message || 'Coupon applied successfully!')
                await runPreview(regAnswers, extAnswers, couponData?.code)
            } else {
                setCouponError(res?.data?.message || 'Invalid coupon')
                toast?.error?.(res?.data?.message || 'Invalid coupon')
            }
        } catch (error) {
            if (error?.response?.status === 404) {
                const msg = error?.response?.data?.message || 'Invalid event coupon code'
                setCouponError(msg)
                toast?.error?.(msg)
            } else if (error?.response?.status === 422) {
                const msg = error?.response?.data?.message || 'Coupon code is required'
                setCouponError(msg)
                toast?.error?.(msg)
            } else {
                const msg = error?.response?.data?.message || error?.message || 'Something went wrong'
                setCouponError(msg)
                toast?.error?.(msg)
            }
        } finally {
            setCouponLoading(false)
        }
    }

    const handleRemoveCoupon = async () => {
        setAppliedCoupon(null)
        setCouponInput('')
        setCouponError('')
        if (allRegAnswered(regAnswers, registrationQuestions)) {
            await runPreview(regAnswers, extAnswers, null)
        }
    }

    // ── personal info change ──────────────────────────────────
    const handlePersonalChange = (e) => {
        const { name, value } = e?.target || {}
        setPersonal(prev => ({ ...prev, [name]: value }))
        setPersonalErrors(prev => ({ ...prev, [name]: '' }))
    }

    // ── validate personal info ────────────────────────────────
    const validatePersonal = () => {
        const errors = {}

        if (!personal?.first_name?.trim?.()) errors.first_name = 'First name is required'
        if (!personal?.last_name?.trim?.()) errors.last_name = 'Last name is required'
        if (!personal?.email?.trim?.()) {
            errors.email = 'Email is required'
        } else if (!isValidEmail(personal?.email)) {
            errors.email = 'Please enter a valid email'
        }
        if (!personal?.phone?.trim?.()) errors.phone = 'Phone number is required'

        if (eventData?.dob_required && !dob) {
            setDobError('Date of birth is required')
            errors.date_of_birth = 'required'
        }

        return errors
    }

    // ── validate all questions ────────────────────────────────
    const validateQuestions = () => {
        for (const q of registrationQuestions) {
            const ans = regAnswers?.[q?.id]
            if (q?.type === 'descriptive') {
                if (!ans?.trim?.()) {
                    toast?.error?.(`Please answer: "${q?.question_text}"`)
                    return false
                }
            } else {
                if (!ans?.length) {
                    toast?.error?.(`Please answer: "${q?.question_text}"`)
                    return false
                }
            }
        }

        for (const q of extraQuestions) {
            if (q?.is_mandatory) {
                const ans = extAnswers?.[q?.id]
                if (!ans?.length) {
                    toast?.error?.(`Please answer extras: "${q?.question_text}"`)
                    return false
                }
            }
        }

        return true
    }

    // ── proceed to payment ────────────────────────────────────
    const handleProceedToPayment = async () => {
        const pErrors = validatePersonal()
        if (Object?.keys?.(pErrors)?.length > 0) {
            setPersonalErrors(pErrors)
            toast?.error?.('Please fill all required personal details')
            return
        }

        if (!validateQuestions()) return

        const payload = {
            first_name: personal?.first_name?.trim?.(),
            last_name: personal?.last_name?.trim?.(),
            email: personal?.email?.trim?.(),
            phone: `${personal?.countryCode}${personal?.phone?.trim?.()}`,
            registration_answers: regAnswers,
            extras_answers: extAnswers,
            ...(eventData?.dob_required && dob ? { date_of_birth: dob } : {}),
            ...(appliedCoupon?.code ? { coupon_code: appliedCoupon?.code } : {}),
        }

        setSubmitLoading(true)
        try {
            const res = await createCheckoutSession?.(id, payload)

            if (res?.data?.status === 'success') {
                const checkoutUrl = res?.data?.data?.checkout_url
                window.location.href = checkoutUrl
            } else {
                toast?.error?.(res?.data?.message || 'Failed to create checkout session')
            }
        } catch (error) {
            if (error?.response?.status === 422) {
                toast?.error?.(
                    error?.response?.data?.message ||
                    'Please check your details and try again'
                )
            } else {
                toast?.error?.(
                    error?.response?.data?.message ||
                    error?.message ||
                    'Something went wrong'
                )
            }
        } finally {
            setSubmitLoading(false)
        }
    }
    useEffect(() => {
        const token = localStorage.getItem('gg website token')
        if (token) {
            setisLogin(true)
        } else {
            setisLogin(false)
        }
    }, [])
    if (eventLoading) return <CommonLoader />

    // ── extras unlocked boolean ───────────────────────────────
    const extrasUnlocked = isExtrasUnlocked()




    return (
        <div className="rx9x-wrap">

            {/* ── LEFT FORM ── */}

            <div className="rx9x-formSec" >
                {/* {!isLogin && <>
                    <div style={{
                        border: '1px solid rgb(236, 236, 236)',
                        borderRadius: '10px',
                        padding: '10px 20px',
                        marginBottom:'20px'
                    }}>
                        <h1 style={{fontSize:'32px',
                        fontWeight:'600'}}>Already Have an Account?</h1>
                        <p style={{
                            fontWeight:'400',
                            fontSize:'18px',
                            lineHeight:'30px',
                            color:'rgba(52, 52, 52, 1)',
                            marginTop:'-10px'
                        }}>Returning customer? Log in to quickly access your saved details, previous bookings, and a faster checkout experience. <br/> New to GG Perform? Create your account to proceed securely.</p>

                          <button onClick={(()=>navigate('/auth'))} style={{
                            padding:'15px 70px',
                            borderRadius:'8px',
                            width:'fit-content',
                            fontSize:'15px',
                            fontWeight:'600',
                            border:'2px solid rgba(102, 0, 204, 1)',
                            color:'rgba(102, 0, 204, 1)',
                            background:'transparent',
                            marginBottom:'10px',
                            marginTop:'10px',
                            cursor:'pointer',
                            fontFamily:"League Spartan', sans-serif"
                          }}>Login</button>
                    </div>
                </>} */}
                {/* ── Registration Questions ── */}
                {registrationQuestions?.length > 0 && (
                    <div style={{
                        border: '1px solid rgba(236,236,236,1)',
                        padding: '40px 20px',
                        borderRadius: '15px',
                    }}>
                        <h3 style={{ fontSize: '25px', marginBottom: '30px' }}>
                            Registration Details
                        </h3>

                        {/* Personal Info */}
                        <div className="rx9x-row">
                            <div className="rx9x-field">
                                <label>
                                    First Name
                                    <span className="rx9x-req">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="first_name"
                                    placeholder="Enter first name"
                                    value={personal?.first_name || ''}
                                    onChange={handlePersonalChange}
                                    style={personalErrors?.first_name ? { border: '1px solid red' } : {}}
                                />
                                {personalErrors?.first_name && (
                                    <small style={{ color: 'red', fontSize: '12px' }}>
                                        *{personalErrors?.first_name}
                                    </small>
                                )}
                            </div>

                            <div className="rx9x-field">
                                <label>
                                    Last Name
                                    <span className="rx9x-req">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="last_name"
                                    placeholder="Enter last name"
                                    value={personal?.last_name || ''}
                                    onChange={handlePersonalChange}
                                    style={personalErrors?.last_name ? { border: '1px solid red' } : {}}
                                />
                                {personalErrors?.last_name && (
                                    <small style={{ color: 'red', fontSize: '12px' }}>
                                        *{personalErrors?.last_name}
                                    </small>
                                )}
                            </div>

                            <div className="rx9x-field">
                                <label>
                                    Email
                                    <span className="rx9x-req">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter email"
                                    value={personal?.email || ''}
                                    onChange={handlePersonalChange}
                                    style={personalErrors?.email ? { border: '1px solid red' } : {}}
                                />
                                {personalErrors?.email && (
                                    <small style={{ color: 'red', fontSize: '12px' }}>
                                        *{personalErrors?.email}
                                    </small>
                                )}
                            </div>

                            {eventData?.dob_required && (
                                <div className="rx9x-field">
                                    <label>
                                        Date of Birth
                                        <span className="rx9x-req">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="date_of_birth"
                                        value={dob}
                                        max={new Date().toISOString().split('T')[0]}
                                        min="1900-01-01"
                                        onChange={(e) => {
                                            setDob(e?.target?.value)
                                            setDobError('')
                                        }}
                                        style={dobError ? { border: '1px solid red' } : {}}
                                    />
                                    {dobError && (
                                        <small style={{ color: 'red', fontSize: '12px' }}>
                                            *{dobError}
                                        </small>
                                    )}
                                </div>
                            )}

                            <div className="rx9x-field">
                                <label>
                                    Phone
                                    <span className="rx9x-req">*</span>
                                </label>
                                <div className="rx9x-phoneGroup">
                                    <select
                                        name="countryCode"
                                        value={personal?.countryCode || '+1'}
                                        onChange={handlePersonalChange}
                                    >
                                        {countryCodes?.map?.((c) => (
                                            <option key={c?.code} value={c?.code}>
                                                {c?.code}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Enter phone number"
                                        value={personal?.phone || ''}
                                        onChange={handlePersonalChange}
                                        style={personalErrors?.phone ? { border: '1px solid red' } : {}}
                                    />
                                </div>
                                {personalErrors?.phone && (
                                    <small style={{ color: 'red', fontSize: '12px' }}>
                                        *{personalErrors?.phone}
                                    </small>
                                )}
                            </div>
                        </div>

                         

                        {/* ── Registration Questions ── */}
                        {registrationQuestions?.map?.((q) => (
                            <div className="rx9x-field" key={q?.id}>

                                {q?.type === 'descriptive' && (
                                    <>
                                        <label>
                                            {q?.question_text}
                                            <span className="rx9x-req">*</span>
                                        </label>
                                        {q?.help_text_enabled && q?.help_text && (
                                            <small>Note - {q?.help_text}</small>
                                        )}
                                        <textarea
                                            placeholder='Enter your answer!'
                                            value={regAnswers?.[q?.id] || ''}
                                            onChange={(e) =>
                                                handleRegDescriptive(q?.id, e?.target?.value)
                                            }
                                            style={{
                                                width: '97%',
                                                height: '100px',
                                                resize: 'none',
                                                outline: 'none',
                                                border: 'none',
                                                background: '#f8f8f8',
                                                padding: '10px',
                                                borderRadius: '10px',
                                                marginTop: '8px',
                                            }}
                                        />
                                    </>
                                )}

                                {q?.type === 'dropdown' && (
                                    <>
                                        <label>
                                            {q?.question_text}
                                            <span className="rx9x-req">*</span>
                                        </label>
                                        {q?.help_text_enabled && q?.help_text && (
                                            <small>Note - {q?.help_text}</small>
                                        )}
                                        <select
                                            value={regAnswers?.[q?.id]?.[0] || ''}
                                            onChange={(e) =>
                                                handleRegSingle(q?.id, e?.target?.value)
                                            }
                                        >
                                            <option value=''>Select an option</option>
                                            {q?.options?.map?.((opt) => (
                                                <option key={opt?.id} value={opt?.id}>
                                                    {opt?.text}
                                                </option>
                                            ))}
                                        </select>
                                    </>
                                )}

                                {q?.type === 'single_choice' && (
                                    <>
                                        <label>
                                            {q?.question_text}
                                            <span className="rx9x-req">*</span>
                                        </label>
                                        {q?.help_text_enabled && q?.help_text && (
                                            <small>Note - {q?.help_text}</small>
                                        )}
                                        <div className="rx9x-radioGroup">
                                            {q?.options?.map?.((opt) => (
                                                <div key={opt?.id}>
                                                    <input
                                                        type="radio"
                                                        name={`reg_${q?.id}`}
                                                        value={opt?.id}
                                                        checked={regAnswers?.[q?.id]?.[0] === opt?.id}
                                                        onChange={() => handleRegSingle(q?.id, opt?.id)}
                                                    />
                                                    <label>{opt?.text}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {q?.type === 'multi_choice' && (
                                    <>
                                        <label>
                                            {q?.question_text}
                                            <span className="rx9x-req">*</span>
                                        </label>
                                        {q?.help_text_enabled && q?.help_text && (
                                            <small>Note - {q?.help_text}</small>
                                        )}
                                        <div className="rx9x-checkGroup">
                                            {q?.options?.map?.((opt) => (
                                                <div key={opt?.id}>
                                                    <input
                                                        type="checkbox"
                                                        name={`reg_${q?.id}`}
                                                        value={opt?.id}
                                                        checked={regAnswers?.[q?.id]?.includes?.(opt?.id) || false}
                                                        onChange={(e) =>
                                                            handleRegMulti(q?.id, opt?.id, e?.target?.checked)
                                                        }
                                                    />
                                                    <label>{opt?.text}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Extras Questions ── */}
                {extraQuestions?.length > 0 && (
                    <div
                        className={
                            extrasUnlocked
                                ? 'rx9x-extrasBox'
                                : 'rx9x-extrasBox rx9x-extrasLocked'
                        }
                    >
                        <div className="rx9x-extrasHeader">
                            <h3 className="rx9x-extrasTitle">Extras</h3>
                            {!extrasUnlocked && (
                                <span className="rx9x-lockBadge">
                                    🔒 Complete registration details first
                                </span>
                            )}
                        </div>

                        {extraQuestions?.map?.((q) => (
                            <div
                                className={
                                    extrasUnlocked
                                        ? 'rx9x-field'
                                        : 'rx9x-field rx9x-fieldLocked'
                                }
                                key={q?.id}
                            >
                                <label>
                                    {q?.question_text}
                                    {q?.is_mandatory && (
                                        <span className="rx9x-req">*</span>
                                    )}
                                </label>

                                {q?.help_text_enabled && q?.help_text && (
                                    <small>Note - {q?.help_text}</small>
                                )}

                                {q?.type === 'single_select' && (
                                    <div className="rx9x-radioGroup">
                                        {q?.options?.map?.((opt) => (
                                            <div key={opt?.id}>
                                                <input
                                                    type="radio"
                                                    name={`ext_${q?.id}`}
                                                    value={opt?.id}
                                                    disabled={!extrasUnlocked}
                                                    checked={extAnswers?.[q?.id]?.[0] === opt?.id}
                                                    onChange={() =>
                                                        handleExtSingle(q?.id, opt?.id)
                                                    }
                                                />
                                                <label>
                                                    {opt?.text}
                                                    <span style={{
                                                        fontWeight: '600',
                                                        fontSize: '15px'
                                                    }}>
                                                        {opt?.price
                                                            ? ` -$${opt?.price}`
                                                            : ' -$0.00'}
                                                    </span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {q?.type === 'multi_select' && (
                                    <div className="rx9x-checkGroup">
                                        {q?.options?.map?.((opt) => (
                                            <div key={opt?.id}>
                                                <input
                                                    type="checkbox"
                                                    name={`ext_${q?.id}`}
                                                    value={opt?.id}
                                                    disabled={!extrasUnlocked}
                                                    checked={
                                                        extAnswers?.[q?.id]?.includes?.(opt?.id) ||
                                                        false
                                                    }
                                                    onChange={(e) =>
                                                        handleExtMulti(
                                                            q?.id,
                                                            opt?.id,
                                                            e?.target?.checked
                                                        )
                                                    }
                                                />
                                                <label>
                                                    {opt?.text}
                                                    <span style={{
                                                        fontWeight: '600',
                                                        fontSize: '15px',
                                                        marginLeft: '5px'
                                                    }}>
                                                        {opt?.price
                                                            ? `-$${opt?.price}`
                                                            : '-$0.00'}
                                                    </span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── RIGHT SUMMARY ── */}
            <div className="rx9x-summarySec">
                <h2 className="rx9x-summaryTitle">Order Summary</h2>

                <div className="rx9x-product">
                    <img src={eventData?.thumbnail || '/runner.png'} alt="event" />
                    <div className="rx9x-productInfo">
                        <div className="rx9x-productName">{eventData?.name || ''}</div>
                        <p dangerouslySetInnerHTML={{ __html: eventData?.about_description || '' }} style={{
                            marginTop: '5px',
                            lineHeight: '17px',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: '2',
                            overflow: 'hidden',
                            fontSize: '15px'
                        }}>
                        </p>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        rowGap: '5px',
                        marginTop: '-25px'
                    }}>
                        <div className="rx9x-price">${displayBasePrice}</div>
                    </div>
                </div>

                {/* Coupon box */}
                <div className="rx9x-couponBox">
                    {eventData?.coupons_enabled && <div className="rx9x-couponHead">
                        {!appliedCoupon ? (
                            <>
                                <input
                                    placeholder="Enter coupon"
                                    style={{ borderRadius: '7px' }}
                                    value={couponInput || ''}
                                    onChange={(e) => {
                                        setCouponInput(e?.target?.value)
                                        setCouponError('')
                                    }}
                                    onKeyDown={(e) => {
                                        if (e?.key === 'Enter') handleApplyCoupon()
                                    }}
                                />
                                <span
                                    className="rx9x-addCoupon"
                                    onClick={couponLoading ? undefined : handleApplyCoupon}
                                    style={{
                                        cursor: couponLoading ? 'not-allowed' : 'pointer',
                                        opacity: couponLoading ? 0.6 : 1,
                                    }}
                                >
                                    {couponLoading ? 'Applying...' : '+ Add Coupon'}
                                </span>
                            </>
                        ) : (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                flexWrap: 'wrap'
                            }}>
                                <span style={{
                                    background: '#f0e6ff',
                                    color: '#6600cd',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                }}>
                                    {appliedCoupon?.code} ({appliedCoupon?.percent_off}% off)
                                </span>
                                <span
                                    style={{
                                        color: 'red',
                                        cursor: 'pointer',
                                        fontSize: '13px'
                                    }}
                                    onClick={handleRemoveCoupon}
                                >
                                    Remove
                                </span>
                            </div>
                        )}
                    </div>}

                    {couponError && (
                        <small style={{ color: 'red', fontSize: '12px' }}>
                            *{couponError}
                        </small>
                    )}

                    {hasPreview ? (
                        <>
                            <div className="rx9x-line" style={{
                                marginTop: '16px'
                            }}>
                                <span> Price</span>
                                <span style={{ fontWeight: '600' }}>
                                    ${centsToDisplay(previewData?.base_amount)}
                                </span>
                            </div>

                            {previewData?.extras_amount > 0 && (
                                <div className="rx9x-line" style={{
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        rowGap: '10px'
                                    }}>
                                        <span>
                                            Extras{previewData?.extras_count > 0
                                                ? ` (${previewData?.extras_count})`
                                                : ''}
                                        </span>
                                        {previewData?.extras_labels?.length > 0 && (
                                            <div style={{
                                                fontSize: '12px',
                                                color: '#888',
                                            }}>
                                                {previewData?.extras_labels?.join?.(', ')}
                                            </div>
                                        )}
                                    </div>
                                    <span style={{ fontWeight: '600' }}>
                                        +${centsToDisplay(previewData?.extras_amount)}
                                    </span>
                                </div>
                            )}



                            {previewData?.discount_amount > 0 && (
                                <div className="rx9x-line">
                                    <span>Coupon Discount</span>
                                    <span style={{ fontWeight: '600', color: 'green' }}>
                                        - ${centsToDisplay(previewData?.discount_amount)}
                                    </span>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="rx9x-line">
                            <span> Price</span>
                            <span style={{ fontWeight: '600' }}>
                                ${eventData?.sale_price || eventData?.original_price || 0}
                            </span>
                        </div>
                    )}

                    {previewLoading && (
                        <p style={{ fontSize: '12px', color: '#888', margin: '4px 0' }}>
                            Updating prices...
                        </p>
                    )}
                </div>

                {/* Total */}
                <div className="rx9x-totalRow">
                    <span>Total</span>
                    <span>${displayTotal}</span>
                </div>

                <p className="rx9x-terms">
                    By placing this order, you are agreeing to Terms and Conditions.
                </p>

                <button
                    className="rx9x-payBtn"
                    onClick={handleProceedToPayment}
                    disabled={submitLoading || previewLoading}
                    style={{
                        opacity: submitLoading || previewLoading ? 0.7 : 1,
                        cursor: submitLoading || previewLoading
                            ? 'not-allowed'
                            : 'pointer',
                    }}
                >
                    {submitLoading ? 'Please wait...' : 'Proceed to payment'}
                </button>
            </div>
        </div>
    )
}

export default EventCheckout