import React, { useState } from 'react'
import './Accordion.css'
const Accordion = ({ questionData = [] }) => {
    const [index, setindex] = useState([])
    const indexFunction = (i) => {
        if (index.includes(i)) {
            const dummy = [...index]
            const filteredData = dummy?.filter((e) => e != i)
            setindex(filteredData)
        } else {
            setindex([...index, i])
        }
    }
    const questions = questionData?.length > 0 ? questionData : [
        {
            heading: 'Apakah kursus ini benar-benar gratis?',
            description: ' Kursus yang disediakan bisa diakses gratis untuk menunjang kebutuhan dalam bidang kependidikan.'
        }
    ]
    return (
        <>
            {questions?.map((element, i) => (
                <>
                    <div class="fq8-item fq8-active">
                        <div class="fq8-question-row">
                            <div class="fq8-left">
                                <span class="fq8-number">{i < 10 ? '0' : ''}{i + 1}</span>
                                <span class="fq8-question">{element?.heading}</span>
                            </div>
                            <div style={index.includes(i) ? {} : { background:'rgba(243, 245, 246, 1)',
                            border:'none',color:'#000'}} class="fq8-toggle-btn" onClick={(() => { indexFunction(i) })}>{index.includes(i) ? '-' : '+'}</div>
                        </div>

                        {index.includes(i) && <div class="fq8-answer">
                            {element?.description}
                        </div>}
                    </div>

                </>
            ))}
        </>
    )
}

export default Accordion
