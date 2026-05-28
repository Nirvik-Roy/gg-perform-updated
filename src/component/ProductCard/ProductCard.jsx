import { useState } from 'react'
import './ProductCard.css'

const ProductCard = ({
    image,
    name = 'BAR Run club Vest – Jamaica',
    originalPrice,
    salePrice,
    onView,
    onAddToCart,
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
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {salePrice && <div className="pc1012">
                        <span className="pc1013">${originalPrice}</span>
                        <span className="pc1014">${salePrice}</span>
                    </div>}

                    {(originalPrice && !salePrice) && <div className="pc1012">
                        <span className="pc1014">${originalPrice}</span>
                    </div>}

                    {/* ✅ Cart Icon with onClick */}
                    <img
                        src='/shopping_cart (1).svg'
                        onClick={(e) => {
                            e.stopPropagation(); // prevent card click
                            onAddToCart?.();
                        }}
                        style={{ cursor: 'pointer' }}
                        alt="Add to cart"
                    />
                </div>
            </div>
        </div>
    )
}

export default ProductCard;