import { useState } from 'react'
import './ProductTabs.css'

const ProductTabs = ({ longDescription }) => {
    const [activeTab, setActiveTab] = useState('description')

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
            </div>

            {/* ── Description Tab ── */}
            {activeTab === 'description' && (
                <div className="pt1004">
                    {longDescription ? (
                        // ✅ Render HTML from editor
                        <div
                            className="pt1005"
                            dangerouslySetInnerHTML={{ __html: longDescription }}
                        />
                    ) : (
                        <p className="pt1005">No description available.</p>
                    )}
                </div>
            )}
        </div>
    )
}

export default ProductTabs