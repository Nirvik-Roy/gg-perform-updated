import { useEffect, useState } from 'react'
import './SingleProduct.css'
import { Rating } from 'react-simple-star-rating'
import ProductTabs from './ProductTabs/ProductTabs'
import toast from 'react-hot-toast'
import { addToCartApi } from '../../../utils/cart'
import { useCart } from '../../../context/CartContext'
import { getSingleProducts } from '../../../utils/productUtils'
import { useParams } from 'react-router-dom'
import CommonLoader from '../../../component/common-loader.jsx'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

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

    // ─── Fetch ─────────────────────────────────────────────────────
    const fetchSingleProduct = async () => {
        setLoading(true)
        const res = await getSingleProducts(id)
        setSingleProducts(res || null)
        setLoading(false)
    }

    useEffect(() => {
        if (id) fetchSingleProduct()
    }, [id])

    // ─── Set Default Variant (first one) ──────────────────────────
    useEffect(() => {
        if (singleProducts?.type === 'variable' && singleProducts?.variants?.length > 0) {
            setSelectedVariant(singleProducts.variants[0])
        }
    }, [singleProducts])

    // ─── Reset image when variant changes ─────────────────────────
    useEffect(() => {
        setSelectedImage(0)
        setQuantity(1)
    }, [selectedVariant])

    // ─── Derived ───────────────────────────────────────────────────
    const isVariable = singleProducts?.type === 'variable'

    // ── Images ──
    const displayImages = isVariable
        ? [selectedVariant?.image, singleProducts?.main_image].filter(Boolean)
        : [
            singleProducts?.main_image,
            ...(singleProducts?.gallery?.map((g) => g?.image) || [])
        ].filter(Boolean)

    // ── Price ──
    const currentOriginalPrice = isVariable
        ? selectedVariant?.original_price
        : singleProducts?.original_price

    const currentSalePrice = isVariable
        ? selectedVariant?.sale_price
        : singleProducts?.sale_price

    const discountPercent = currentOriginalPrice && currentSalePrice
        ? Math.round(((currentOriginalPrice - currentSalePrice) / currentOriginalPrice) * 100)
        : null

    // ── Stock ──
    const currentStock = isVariable
        ? selectedVariant?.stock_quantity
        : singleProducts?.stock_quantity

    // ─── Quantity Handlers ─────────────────────────────────────────
    const handleIncrement = () => {
        if (quantity < (currentStock ?? Infinity)) {
            setQuantity((prev) => prev + 1)
        } else {
            toast.error('Maximum stock reached')
        }
    }

    const handleDecrement = () => {
        if (quantity > 1) setQuantity((prev) => prev - 1)
    }

    // ─── Add to Cart ───────────────────────────────────────────────
    const handleAddToCart = async () => {
        const token = localStorage.getItem('gg website token')
        if (!token) { goToCart(); return }

        try {
            const payload = isVariable
                ? {
                    product_variant_id: selectedVariant?.id,
                    product_id: singleProducts?.id,
                    quantity,
                }
                : {
                    product_id: singleProducts?.id,
                    quantity,
                }

            const res = await addToCartApi(payload)
            if (res?.status === 'success') {
                toast.success('Product added to cart!')
                refreshCart()
            }
        } catch (err) {
            toast.error('Failed to add product to cart')
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

            {/* ══════════════════════════════════════════════════════
                TOP SECTION
            ══════════════════════════════════════════════════════ */}
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
                    {/* Discount Badge on Image */}
                    {discountPercent && (
                        <span className='pd_img_discount_badge'>
                            -{discountPercent}%
                        </span>
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

                    {/* Rating */}

                    {/* ── Price ── */}
                    <div className='pd_price_wrapper'>
                        {currentSalePrice ? (
                            <>
                                <span className='pd_sale_price'>${currentSalePrice}</span>
                                <span className='pd_original_price'>${currentOriginalPrice}</span>

                            </>
                        ) : (
                            <span className='pd_sale_price'>${currentOriginalPrice ?? '—'}</span>
                        )} |
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Rating readonly size={18} initialValue={5} />
                            <span style={{ color: '#666', fontSize: '13px' }}>
                                (32 reviews)
                            </span>
                        </div>
                    </div>


                    <div className="pd1010" />



                    {/* Stock */}
                    <p className='pd_stock_info' style={currentStock > 0 ? {
                        background: '#24bb24',
                        width: 'fit-content',
                        padding: '5px 10px', color: '#fff',
                        borderRadius: '3px'
                    } : {
                        background: 'red',
                        width: 'fit-content',
                        padding: '5px 10px', color: '#fff',
                        borderRadius: '3px'
                    }}>
                        {/* <i className="fa-solid fa-box" /> */}
                        {currentStock > 0
                            ? ` In stock`
                            : 'Out of stock'}
                    </p>

                    {/* Short Description */}
                    {singleProducts?.short_description && (
                        <p className="pd1011" dangerouslySetInnerHTML={{ __html: singleProducts?.short_description }}></p>
                    )}

                    <div className="pd1010" />

                    {/* ── Variable: Variant Info ── */}
                    {isVariable && selectedVariant && (
                        <div className='pd_selected_variant_info'>
                            {/* Size */}
                            {selectedVariant?.size && (
                                <div className='pd_attr_chip'>
                                    <span className='pd_attr_label'>Size</span>
                                    <span className='pd_attr_value'>{selectedVariant.size}</span>
                                </div>
                            )}
                            {/* Color */}
                            {selectedVariant?.color && (
                                <div className='pd_attr_chip'>
                                    <span className='pd_attr_label'>Color</span>
                                    <span
                                        className='pd_color_dot_sm'
                                        style={{ background: selectedVariant.color }}
                                    />
                                    <span className='pd_attr_value'>{selectedVariant.color}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Quantity & Add to Cart ── */}
                    <div className="ac1000">
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
                                disabled={currentStock === 0}
                            >
                                +
                            </button>
                        </div>

                        <button
                            className="ac1004"
                            onClick={handleAddToCart}
                            disabled={currentStock === 0}
                        >
                            <i className="fa-solid fa-cart-shopping" />
                            {currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════
                VARIANT SLIDER (only for variable products)
            ══════════════════════════════════════════════════════ */}
            {isVariable && singleProducts?.variants?.length > 0 && (
                <div className='pd_variant_section'>

                    <div className='pd_variant_section_head'>
                        <h3 className='pd_variant_section_title'>
                            Available Variants
                        </h3>
                        <span className='pd_variant_count'>
                            {singleProducts.variants.length} variants
                        </span>
                    </div>

                    <Swiper
                        modules={[Navigation]}
                        navigation
                        spaceBetween={16}
                        slidesPerView={'auto'}
                        className='pd_variant_swiper'
                    >
                        {singleProducts.variants.map((variant, i) => {
                            const isSelected = selectedVariant?.id === variant.id
                            const isOutOfStock = variant.stock_quantity === 0

                            return (
                                <SwiperSlide
                                    key={variant.id}
                                    style={{ width: 'auto' }}
                                >
                                    <div
                                        className={`pd_variant_card 
                                            ${isSelected ? 'pd_variant_card_active' : ''}
                                            ${isOutOfStock ? 'pd_variant_card_oos' : ''}
                                        `}
                                        onClick={() => {
                                            if (!isOutOfStock) setSelectedVariant(variant)
                                        }}
                                    >
                                        {/* ── Variant Image ── */}
                                        <div className='pd_variant_img_wrapper'>
                                            <img
                                                src={variant?.image || singleProducts?.main_image}
                                                alt={`${variant.size} - ${variant.color}`}
                                                className='pd_variant_img'
                                            />
                                            {/* Selected Check */}
                                            {isSelected && (
                                                <div className='pd_variant_check'>
                                                    <i className="fa-solid fa-check" />
                                                </div>
                                            )}
                                            {/* Out of Stock Overlay */}
                                            {isOutOfStock && (
                                                <div className='pd_variant_oos_overlay'>
                                                    <span>Out of Stock</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* ── Variant Details ── */}
                                        <div className='pd_variant_details'>
                                            {/* Size & Color */}
                                            <div className='pd_variant_attrs'>
                                                {variant.size && (
                                                    <span className='pd_variant_size_tag'>
                                                        {variant.size}
                                                    </span>
                                                )}
                                                {variant.color && (
                                                    <span
                                                        className='pd_variant_color_dot'
                                                        style={{ background: variant.color }}
                                                        title={variant.color}
                                                    />
                                                )}
                                            </div>

                                            {/* Price */}
                                            <div className='pd_variant_price_wrapper'>
                                                {variant.sale_price ? (
                                                    <>
                                                        <span className='pd_variant_sale'>
                                                            ${variant.sale_price}
                                                        </span>
                                                        <span className='pd_variant_original'>
                                                            ${variant.original_price}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className='pd_variant_sale'>
                                                        ${variant.original_price}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Stock */}
                                            <p className='pd_variant_stock'>
                                                {isOutOfStock
                                                    ? 'Out of stock'
                                                    : `${variant.stock_quantity} left`}
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </div>
            )}

            {/* ── Product Tabs ── */}
            <ProductTabs
                longDescription={singleProducts?.long_description}
            />

        </div>
    )
}

export default SingleProduct