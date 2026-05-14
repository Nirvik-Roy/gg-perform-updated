import axios from "axios";
import toast from "react-hot-toast";
export const getEvent = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}frontend/events`);

        if (res?.data?.status == "success") {
            return res
        }
    } catch (err) {
        toast.error(err.response?.data?.message);
        return err?.response?.data?.errors
    }
}

export const getSingleEvent = async (id) => {
    if (id) {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}frontend/events/${id}`);

            if (res?.data?.status == "success") {
                return res
            }
        } catch (err) {
            toast.error(err.response?.data?.message);
            return err?.response?.data?.errors
        }
    }
}

export const submitEventEnquiry = async (eventId, payload) => {
    const Token = localStorage.getItem('gg website token');
    if (Token && eventId && payload) {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}frontend/events/${eventId}/enquiry`, payload, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(Token)}`
                }
            },);
            if (res?.data?.status == "success") {
                return res
            }
        } catch (err) {
            toast.error(err.response?.data?.message);
            return err?.response?.data?.errors
        }
    }
}


// ── Step: Checkout Preview ────────────────────────────────────────────────────
export const checkoutPreview = async (eventId, payload) => {
    const Token = localStorage.getItem('gg website token');
    if (Token && eventId && payload) {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}frontend/events/${eventId}/checkout-preview`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${JSON.parse(Token)}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (res?.data?.status === 'success') {
                return res;
            }
        } catch (err) {
            toast.error(err?.response?.data?.message);
            return err?.response?.data?.errors;
        }
    }
};

// ── Step: Apply Coupon ────────────────────────────────────────────────────────
export const applyCoupon = async (payload) => {
    const Token = localStorage.getItem('gg website token');
    if (Token && payload) {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}frontend/events/apply-coupon`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${JSON.parse(Token)}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (res?.data?.status === 'success') {
                return res;
            }
        } catch (err) {
            toast.error(err?.response?.data?.message);
            return err?.response?.data?.errors;
        }
    }
};

// ── Step: Create Stripe Checkout Session ──────────────────────────────────────
export const createCheckoutSession = async (eventId, payload) => {
    if (eventId && payload) {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}frontend/events/${eventId}/checkout-session`,
                payload,
            );
            if (res?.data?.status === 'success') {
                return res;
            }
        } catch (err) {
            toast.error(err?.response?.data?.message);
            return err?.response?.data?.errors;
        }
    }
};


export const getSessionDetails = async (sessionId) => {
    if (sessionId) {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}frontend/events/checkout/by-session/${sessionId}`);

            if (res?.data?.status == "success") {
                return res
            }
        } catch (err) {
            toast.error(err.response?.data?.message);
            return err?.response?.data?.errors
        }
    }
}