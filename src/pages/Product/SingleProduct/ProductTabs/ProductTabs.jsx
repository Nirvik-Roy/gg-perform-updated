import { useState } from 'react'
import './ProductTabs.css'
import { Rating } from 'react-simple-star-rating'

const reviews = [
    {
        id: 1,
        name: 'Mark Doe',
        avatar: '/Ellipse 19.png',
        rating: 3,
        date: '22nd March, 2024',
        review: 'I was initially apprehensive, having no prior design experience. But the instructor, John Doe, did an amazing job of breaking down complex concepts into easily digestible modules. The video lectures were engaging, and the real-world examples really helped solidify my understanding.',
    },
    {
        id: 2,
        name: 'Mark Doe',
        avatar: '/Ellipse 19.png',
        rating: 3,
        date: '22nd March, 2024',
        review: 'I was initially apprehensive, having no prior design experience. But the instructor, John Doe, did an amazing job of breaking down complex concepts into easily digestible modules. The video lectures were engaging, and the real-world examples really helped solidify my understanding.',
    },
    {
        id: 3,
        name: 'Mark Doe',
        avatar: '/Ellipse 19.png',
        rating: 3,
        date: '22nd March, 2024',
        review: 'I was initially apprehensive, having no prior design experience. But the instructor, John Doe, did an amazing job of breaking down complex concepts into easily digestible modules. The video lectures were engaging, and the real-world examples really helped solidify my understanding.',
    },
]

const ratingBars = [
    { star: 5, percent: 80 },
    { star: 4, percent: 65 },
    { star: 3, percent: 40 },
    { star: 2, percent: 20 },
    { star: 1, percent: 10 },
]



const ProductTabs = ({ description, bullets }) => {
    const [activeTab, setActiveTab] = useState('description')
    const [currentSlide, setCurrentSlide] = useState(0)

    const visibleReviews = reviews.slice(currentSlide * 3, currentSlide * 3 + 3)
    const totalSlides = Math.ceil(reviews.length / 3)

    return (
        <div className="pt1000">

            {/* ── Tabs Header ── */}
            <div className="pt1001">
                <button
                    className={`pt1002 ${activeTab === 'description' ? 'pt1002_active' : ''}`}
                    onClick={() => setActiveTab('description')}
                >
                    Description
                </button>

                <div className="pt1003" />

                <button
                    className={`pt1002 ${activeTab === 'reviews' ? 'pt1002_active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    Reviews
                </button>
            </div>

            {/* ── Description Tab ── */}
            {activeTab === 'description' && (
                <div className="pt1004">
                    <p className="pt1005">{description || "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}</p>

                    {bullets?.length > 0 && (
                        <ul className="pt1006">
                            {bullets.map((b, i) => (
                                <li key={i} className="pt1007">{b}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* ── Reviews Tab ── */}
            {activeTab === 'reviews' && (
                <div className="pt1008">

                    {/* Summary */}
                    <div className="pt1009">
                        <p className="pt1010">Summary</p>

                        {/* Overall Rating */}
                        <div className="pt1011">
                            <Rating size={20} readonly initialValue={4} />

                            <span className="pt1012">4.5</span>
                            <span className="pt1013">273 Reviews</span>
                        </div>

                        {/* Rating Bars */}
                        <div className="pt1014">
                            {ratingBars.map((bar) => (
                                <div key={bar.star} className="pt1015">
                                    <span className="pt1016">{bar.star}</span>
                                    <div className="pt1017">
                                        <div
                                            className="pt1018"
                                            style={{ width: `${bar.percent}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Review Cards */}
                    <div className="pt1023">
                        <div className="pt1024">
                            {reviews.map((review) => (
                                <div key={review.id} className="pt1025">

                                    {/* Reviewer Info */}
                                    <div className="pt1026">
                                        <img
                                            src={review.avatar}
                                            alt={review.name}
                                            className="pt1027"
                                        />
                                        <div className="pt1028">
                                            <p className="pt1029">{review.name}</p>
                                        </div>
                                    </div>

                                    {/* Rating + Date */}
                                    <div className="pt1030">
                                        <Rating size={20} readonly initialValue={5} />

                                        <span className="pt1031">

                                            Reviewed on {review.date}
                                        </span>
                                    </div>

                                    {/* Review Text */}
                                    <p className="pt1032">{review.review}</p>

                                </div>
                            ))}
                        </div>

                        {/* Dots */}
                        <div className="pt1033">
                            {Array.from({ length: totalSlides }, (_, i) => (
                                <button
                                    key={i}
                                    className={`pt1034 ${currentSlide === i ? 'pt1034_active' : ''}`}
                                    onClick={() => setCurrentSlide(i)}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            )}

        </div>
    )
}

export default ProductTabs