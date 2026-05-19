import { useState } from 'react'
import './SingleProduct.css'
import { Rating } from 'react-simple-star-rating'
import ProductTabs from './ProductTabs/ProductTabs'
import SimilarProducts from './SimilarProducts/SimilarProducts'

const SingleProduct = ({ product }) => {
    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedSize, setSelectedSize] = useState(null)

    const images = product?.images || ['/Frame 1000005447.png', '/Frame 1000005519.png', '/Frame 1000005466.png']
    const sizes = product?.sizes || ['S', 'M', 'L', 'XL']
   
    return (
        <div className="pd1000">

            {/* ── Top Section ── */}
            <div className="pd1001">

                {/* Thumbnail Column */}
                <div className="pd1002">
                    {images.map((img, i) => (
                        <div
                            key={i}
                            className={`pd1003 ${selectedImage === i ? 'pd1003_active' : ''}`}
                            onClick={() => setSelectedImage(i)}
                        >
                            <img src={img} alt={`thumb-${i}`} className="pd1004" />
                        </div>
                    ))}
                </div>

                {/* Main Image */}
                <div className="pd1005">
                    <img
                        src={images[selectedImage]}
                        alt={product?.name}
                        className="pd1006"
                    />
                </div>

                {/* Info Column */}
                <div className="pd1007">

                    {/* Name */}
                    <h1 className="pd1008">{product?.name || 'BAR Run club Vest – Jamaica'}</h1>

                    {/* Price */}
                    <p className="pd1009" style={{
                        display:'flex',
                        justifyContent:'flex-start',
                        alignItems:'center',
                        gap:'10px'
                    }}>${product?.price || '54.98'} | <Rating readonly size={20} initialValue={5} /> <span style={{
                        color:'rgba(65, 65, 65, 1)',
                        fontSize:'14px',
                        display:'block'
                    }}>( 32 review )</span></p>

                    <div className="pd1010" />

                    {/* Short Description */}
                    <p className="pd1011">{product?.short_description || 'Lorem ipsum dolor sit amet, consectetuer adipi scing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magn. Lorem ipsum dolor sit amet, consectetuer adipi scing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magn. '}</p>

                    {/* Bullet Points */}
                    {(
                        <ul className="pd1012">
                            {[1, 2, 3, 4].map((b, i) => (
                                <li key={i} className="pd1013">{'Lorem ipsum dolor sit amet, adipi scing elit'}</li>
                            ))}
                        </ul>
                    )}

                    {/* Size Selector */}
                    {sizes.length > 0 && (
                        <div className="pd1014">
                            <span className="pd1015">Choose Size</span>
                            <div className="pd1016">
                                {sizes.map((size, i) => (
                                    <button
                                        key={i}
                                        className={`pd1017 ${selectedSize === size ? 'pd1017_active' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="ac1000">

                        {/* Quantity */}
                        <div className="ac1001">
                            <button className="ac1002">−</button>
                            <span className="ac1003">1</span>
                            <button className="ac1002">+</button>
                        </div>

                        {/* Add to Cart */}
                        <button className="ac1004">Add to Cart</button>

                    </div>

                </div>
            </div>

           <ProductTabs/>

           <SimilarProducts/>

        </div>
    )
}

export default SingleProduct