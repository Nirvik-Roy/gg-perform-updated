import { useState } from 'react'
import './ProductCard.css'

const ProductCard = ({
    image,
    name = 'BAR Run club Vest – Jamaica',
    originalPrice = 97,
    salePrice = 67,
    onEdit,
    onDelete,
    onView,
}) => {
    return (
        <div className="pc1000">

            {/* Image Box */}
            <div onClick={onView} className="pc1001">
                <img src={image} alt={name} className="pc1002" />
            </div>

            {/* Info */}
            <div className="pc1010">
                <p className="pc1011">{name}</p>
               <div style={{
                display:'flex',
                justifyContent:'space-between',
                alignItems:'center'
               }}>
                <div className="pc1012">
                    <span className="pc1013">${originalPrice}</span>
                    <span className="pc1014">${salePrice}</span>
                </div>

                <img src='/shopping_cart (1).svg'/>

               </div>
            </div>

        </div>
    )
}

export default ProductCard