import axios from "axios";
import toast from "react-hot-toast";
export const getProducts = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}frontend/products`);
        if (res?.data?.status == "success") {
            return res?.data?.data
        }
    } catch (err) {
        toast.error(err.response?.data?.message);
        return err?.response?.data?.errors
    }
}

export const getProductCategories = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}frontend/product-categories`);

        if (res?.data?.status == "success") {
            return res?.data?.data
        }
    } catch (err) {
        toast.error(err.response?.data?.message);
        return err?.response?.data?.errors
    }
}