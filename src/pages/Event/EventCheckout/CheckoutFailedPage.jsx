import React, { useState } from "react";
import PaymentFailedModal from "./PaymentFailedModal";
const CheckoutFailedPage = () => {
    const [open, setOpen] = useState(true);
    return (
        <>
            <PaymentFailedModal
                isOpen={open}
                onRetry={() => alert("Retrying...")}
                onClose={() => setOpen(false)}
            />
        </>
    )
}

export default CheckoutFailedPage
