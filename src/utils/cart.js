import axios from "axios";
import toast from "react-hot-toast";

export const addToCartApi = async (data) => {
    const Token = localStorage.getItem('gg website token');
    if (data && Token) {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}frontend/cart`,
                data,
                {
                    headers: {
                        'Authorization': `Bearer ${JSON.parse(Token)}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (res?.data?.status === 'success') {
                return res?.data;
            }
        } catch (err) {
            toast.error(err?.response?.data?.message);
            return err?.response?.data?.errors;
        }
    }
};
