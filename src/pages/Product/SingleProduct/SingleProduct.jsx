import { useEffect, useState } from 'react'
import './SingleProduct.css'
import { Rating } from 'react-simple-star-rating'
import ProductTabs from './ProductTabs/ProductTabs'
import SimilarProducts from './SimilarProducts/SimilarProducts'
import toast from 'react-hot-toast'
import { addToCartApi } from '../../../utils/cart'
import { useCart } from '../../../context/CartContext'
import { getSingleProducts } from '../../../utils/productUtils'
import { useParams } from 'react-router-dom'
import CommonLoader from '../../../component/common-loader.jsx'

const SingleProduct = () => {
    const { refreshCart, goToCart } = useCart()
    const { id } = useParams()

    // ─── States ────────────────────────────────────────────────────
    const [singleProducts, setSingleProducts] = useState(null)
    const [loading, setLoading] = useState(false)
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)

    // ─── Variable Product States ───────────────────────────────────
    const [selectedVariant, setSelectedVariant] = useState(null)
    const [selectedSize, setSelectedSize] = useState(null)
    const [selectedColor, setSelectedColor] = useState(null)

    // ─── Fetch Single Product ──────────────────────────────────────
    const fetchSingleProduct = async () => {
        setLoading(true)
        const res = await getSingleProducts(id)
        setSingleProducts(res || null)
        setLoading(false)
    }

    useEffect(() => {
        if (id) fetchSingleProduct()
    }, [id])

    // ─── Derived Data ──────────────────────────────────────────────
    const isVariable = singleProducts?.type === 'variable'

    // ── For single: use gallery images + main image ──
    const galleryImages = isVariable
        ? [singleProducts?.main_image].filter(Boolean)
        : [
            singleProducts?.main_image,
            ...(singleProducts?.gallery?.map((g) => g?.image) || [])
        ].filter(Boolean)

    // ── For variable: use selected variant image or main image ──
    const displayImages = isVariable && selectedVariant
        ? [selectedVariant?.image, singleProducts?.main_image].filter(Boolean)
        : galleryImages

    // ── Get unique sizes & colors from variants ──
    const uniqueSizes = isVariable
        ? [...new Map(
            singleProducts?.variants?.map((v) => [v.size_attribute_value_id, { id: v.size_attribute_value_id, value: v.size }])
        ).values()]
        : []

    const uniqueColors = isVariable
        ? [...new Map(
            singleProducts?.variants?.map((v) => [v.color_attribute_value_id, { id: v.color_attribute_value_id, value: v.color }])
        ).values()]
        : []

    // ── Find matching variant when size & color selected ──
    useEffect(() => {
        if (isVariable && selectedSize && selectedColor) {
            const matched = singleProducts?.variants?.find(
                (v) =>
                    v.size_attribute_value_id === selectedSize &&
                    v.color_attribute_value_id === selectedColor
            )
            setSelectedVariant(matched || null)
            setSelectedImage(0) // reset image
        } else {
            setSelectedVariant(null)
        }
    }, [selectedSize, selectedColor, singleProducts])

    // ── Price Display ──
    const getDisplayPrice = () => {
        if (isVariable) {
            if (selectedVariant) {
                return {
                    original: selectedVariant.original_price,
                    sale: selectedVariant.sale_price,
                }
            }
            // Show price range if no variant selected
            const prices = singleProducts?.variants?.map((v) => v.sale_price || v.original_price) || []
            const min = Math.min(...prices)
            const max = Math.max(...prices)
            return { range: min === max ? `$${min}` : `$${min} - $${max}` }
        }
        return {
            original: singleProducts?.original_price,
            sale: singleProducts?.sale_price,
        }
    }

    const priceInfo = getDisplayPrice()

    // ─── Quantity ──────────────────────────────────────────────────
    const handleIncrement = () => {
        const maxStock = isVariable
            ? (selectedVariant?.stock_quantity ?? Infinity)
            : (singleProducts?.stock_quantity ?? Infinity)

        if (quantity < maxStock) {
            setQuantity((prev) => prev + 1)
        } else {
            toast.error('Maximum stock reached')
        }
    }

    const handleDecrement = () => {
        if (quantity > 1) setQuantity((prev) => prev - 1)
    }

    // ─── Add To Cart — Single ──────────────────────────────────────
    const addToSingleCart = async () => {
        const token = localStorage.getItem('gg website token')
        if (!token) { goToCart(); return }

        try {
            const res = await addToCartApi({
                product_id: singleProducts?.id,
                quantity,
            })
            if (res?.status === 'success') {
                toast.success('Product added to cart!')
                refreshCart()
            }
        } catch (err) {
            toast.error('Failed to add product to cart')
        }
    }

    // ─── Add To Cart — Variable ────────────────────────────────────
    const addVariantProductCart = async () => {
        const token = localStorage.getItem('gg website token')
        if (!token) { goToCart(); return }

        if (!selectedSize) { toast.error('Please select a size'); return }
        if (!selectedColor) { toast.error('Please select a color'); return }
        if (!selectedVariant) { toast.error('Selected combination not available'); return }

        try {
            const res = await addToCartApi({
                product_variant_id: selectedVariant?.id,
                product_id: singleProducts?.id,
                quantity,
            })
            if (res?.status === 'success') {
                toast.success('Product added to cart!')
                refreshCart()
            }
        } catch (err) {
            toast.error('Failed to add product to cart')
        }
    }

    // ─── Handle Add to Cart ────────────────────────────────────────
    const handleAddToCart = () => {
        if (isVariable) {
            addVariantProductCart()
        } else {
            addToSingleCart()
        }
    }

    if (loading) return <CommonLoader />

    if (!singleProducts) return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh'
        }}>
            <p>Product not found.</p>
        </div>
    )

    return (
        <div className="pd1000">

            {/* ── Top Section ── */}
            <div className="pd1001">

                {/* ── Thumbnail Column ── */}
                <div className="pd1002">
                    {displayImages.map((img, i) => (
                        <div
                            key={i}
                            className={`pd1003 ${selectedImage === i ? 'pd1003_active' : ''}`}
                            onClick={() => setSelectedImage(i)}
                        >
                            <img src={img} alt={`thumb-${i}`} className="pd1004" />
                        </div>
                    ))}
                </div>

                {/* ── Main Image ── */}
                <div className="pd1005">
                    <img
                        src={displayImages[selectedImage] || '/Frame 1000005447.png'}
                        alt={singleProducts?.name}
                        className="pd1006"
                    />
                    {/* Variable badge */}
                    {isVariable && (
                        <span className='pd_variable_badge'>Variable Product</span>
                    )}
                </div>

                {/* ── Info Column ── */}
                <div className="pd1007">

                    {/* Category */}
                    {singleProducts?.category_name && (
                        <span className='pd_category_tag'>
                            {singleProducts?.category_name}
                        </span>
                    )}

                    {/* Name */}
                    <h1 className="pd1008">{singleProducts?.name}</h1>

                    {/* Price */}
                    <div className="pd1009">
                        {priceInfo?.range ? (
                            <span className='pd_price_range'>{priceInfo.range}</span>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {priceInfo?.sale ? (
                                    <>
                                        <span className='pd_sale_price'>${priceInfo.sale}</span>
                                        <span className='pd_original_price'>${priceInfo.original}</span>
                                        <span className='pd_discount_badge'>
                                            {Math.round(
                                                ((priceInfo.original - priceInfo.sale) / priceInfo.original) * 100
                                            )}% OFF
                                        </span>
                                    </>
                                ) : (
                                    <span className='pd_sale_price'>${priceInfo?.original}</span>
                                )}
                            </div>
                        )}

                        {/* Rating */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                            <Rating readonly size={18} initialValue={5} />
                            <span style={{ color: 'rgba(65,65,65,1)', fontSize: '13px' }}>
                                (32 reviews)
                            </span>
                        </div>
                    </div>

                    <div className="pd1010" />

                    {/* Short Description */}
                    {singleProducts?.short_description && (
                        <p className="pd1011" dangerouslySetInnerHTML={{ __html: singleProducts?.short_description }}></p>
                    )}

                    {/* ── Variable: Size & Color Selectors ── */}
                    {isVariable && (
                        <>
                            {/* Size Selector */}
                            {uniqueSizes.length > 0 && (
                                <div className="pd1014">
                                    <span className="pd1015">
                                        Choose Size
                                        {selectedSize && (
                                            <span className='pd_selected_label'>
                                                : {uniqueSizes.find(s => s.id === selectedSize)?.value}
                                            </span>
                                        )}
                                    </span>
                                    <div className="pd1016">
                                        {uniqueSizes.map((size) => {
                                            // ── Check if this size has any available variant with selected color ──
                                            const hasStock = singleProducts?.variants?.some(
                                                (v) =>
                                                    v.size_attribute_value_id === size.id &&
                                                    (!selectedColor || v.color_attribute_value_id === selectedColor) &&
                                                    v.stock_quantity > 0
                                            )
                                            return (
                                                <button
                                                    key={size.id}
                                                    className={`pd1017 
                                                        ${selectedSize === size.id ? 'pd1017_active' : ''}
                                                        ${!hasStock ? 'pd1017_disabled' : ''}
                                                    `}
                                                    onClick={() => {
                                                        setSelectedSize(size.id)
                                                        setQuantity(1)
                                                    }}
                                                    disabled={!hasStock}
                                                    title={!hasStock ? 'Out of stock' : ''}
                                                >
                                                    {size.value}
                                                    {!hasStock && <span className='pd_out_of_stock_line' />}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Color Selector */}
                            {uniqueColors.length > 0 && (
                                <div className="pd1014">
                                    <span className="pd1015">
                                        Choose Color
                                        {selectedColor && (
                                            <span className='pd_selected_label'>
                                                : {uniqueColors.find(c => c.id === selectedColor)?.value}
                                            </span>
                                        )}
                                    </span>
                                    <div className="pd1016">
                                        {uniqueColors.map((color) => {
                                            const hasStock = singleProducts?.variants?.some(
                                                (v) =>
                                                    v.color_attribute_value_id === color.id &&
                                                    (!selectedSize || v.size_attribute_value_id === selectedSize) &&
                                                    v.stock_quantity > 0
                                            )
                                            return (
                                                <button
                                                    key={color.id}
                                                    className={`pd_color_btn ${selectedColor === color.id ? 'pd_color_btn_active' : ''} ${!hasStock ? 'pd1017_disabled' : ''}`}
                                                    onClick={() => {
                                                        setSelectedColor(color.id)
                                                        setQuantity(1)
                                                    }}
                                                    disabled={!hasStock}
                                                    title={color.value}
                                                >
                                                    <span
                                                        className='pd_color_dot'
                                                        style={{ background: color.value }}
                                                    />
                                                    {color.value}
                                                    {!hasStock && <span className='pd_out_of_stock_line' />}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* ── Selected Variant Info ── */}
                            {selectedVariant && (
                                <div className='pd_variant_info'>
                                    <i className="fa-solid fa-circle-check" style={{ color: '#22a855' }} />
                                    <div>
                                        <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>
                                            {selectedVariant.size} - {selectedVariant.color}
                                        </p>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                                            Stock: {selectedVariant.stock_quantity} available
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* ── No Variant Found Warning ── */}
                            {selectedSize && selectedColor && !selectedVariant && (
                                <div className='pd_variant_warning'>
                                    <i className="fa-solid fa-triangle-exclamation" />
                                    This combination is not available
                                </div>
                            )}
                        </>
                    )}

                    {/* ── Single: Stock Info ── */}
                    {!isVariable && singleProducts?.stock_quantity !== null && (
                        <p className='pd_stock_info'>
                            <i className="fa-solid fa-box" />
                            {singleProducts?.stock_quantity > 0
                                ? `${singleProducts?.stock_quantity} in stock`
                                : 'Out of stock'}
                        </p>
                    )}

                    {/* ── Quantity & Add to Cart ── */}
                    <div className="ac1000">

                        {/* Quantity */}
                        <div className="ac1001">
                            <button
                                className="ac1002"
                                onClick={handleDecrement}
                                disabled={quantity <= 1}
                            >
                                −
                            </button>
                            <span className="ac1003">{quantity}</span>
                            <button
                                className="ac1002"
                                onClick={handleIncrement}
                            >
                                +
                            </button>
                        </div>

                        {/* Add to Cart */}
                        <button
                            className="ac1004"
                            onClick={handleAddToCart}
                            disabled={
                                isVariable
                                    ? !selectedVariant || selectedVariant?.stock_quantity === 0
                                    : singleProducts?.stock_quantity === 0
                            }
                        >
                            {/* <i className="fa-solid fa-cart-shopping" /> */}
                            {isVariable && !selectedVariant
                                ? 'Select Options'
                                : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Product Tabs ── */}
            <ProductTabs
                longDescription={singleProducts?.long_description}
            />

        </div>
    )
}

export default SingleProduct