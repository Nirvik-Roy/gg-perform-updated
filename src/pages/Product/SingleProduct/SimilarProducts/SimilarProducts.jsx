import React from 'react'
import './SimilarProducts.css'
import ProductCard from '../../../../component/ProductCard/ProductCard'
import { useNavigate } from 'react-router-dom'
const SimilarProducts = () => {
    const navigate = useNavigate()
    return (
        <>
            <div className='similar_product_wrapper'>
                <h3>Similar Products</h3>
                <div className='similar_grid_wrapper'>
                    {[1,2,3,4]?.map(()=>(
                        <ProductCard onView={(()=>navigate('/products/2'))} image={'/Frame 1000005447.png'}/>
                    ))}
                </div>
            </div>
        </>
    )
}

export default SimilarProducts
