import React, { useEffect, useState } from 'react'
import { useBanner } from '../../context/BannerContext';
import './FaqPage.css'
const FaqPage = () => {
    const { setBannerTitle, setBreadcrumb, setbannerDescription4 } = useBanner();
    useEffect(() => {
        setBreadcrumb('FAQ ')
        setBannerTitle('FAQ ')
    }, [])

    const faqData = [
        {
            img: '/product1.png',
            title: 'GENERAL QUESTIONS',
            questions: [{
                title: 'What is GG Perform?',
                para: 'GG Perform is a high-performance training platform offering structured programs designed to improve speed, strength, endurance, and overall athletic performance.\n All programs are built using real coaching experience and performance principles used in competitive sport.'
            },

            {

                title: 'Who are these programs for?',
                para: 'GG Perform is designed for: \n • Athletes (track & field, endurance, OCR, HYROX, team sports) \n  • Competitive fitness individuals\n  • Busy professionals who want structured, effective training \n If you want measurable improvement—not random workouts—these programs are for you.'
            },
            {
                title: 'Do I need to be an advanced athlete?',
                para: 'No \n Programs are designed with <b>progressions and clear structure</b>, so they can be adapted to different levels. \n However, they are best suited for individuals who are serious about improving.'
            },
            ]
        },
        {
            img: '/A72B17A6-7D28-4A7D-B4A5-056BD6697140_1_105_c.jpeg',
            title: 'PROGRAM STRUCTURE',
            questions: [{
                title: 'How are the programs delivered?',
                para: 'Programs are delivered digitally and may include:\n • Structured training plans \n  • Video or written instruction \n  • Weekly or monthly programming (for subscriptions) \n You can follow the programs at your own pace unless otherwise specified.'
            },

            {
                title: 'How much time do I need to train?',
                para: 'Most programs require <b>3–5 training sessions per week,</b> depending on the program. \n Each session typically ranges from <b>45 to 75 minutes</b>.'
            },
            {
                title: 'Do I need access to a gym or track?',
                para: 'It depends on the program. \n Some programs require: \n • Track access \n  • Basic gym equipment (dumbbells, barbells, kettlebells) \n Others can be adapted to minimal equipment.'
            },
            ]
        },

        {
            img: '/course.png',
            title: 'RESULTS & EXPECTATIONS',
            questions: [{
                title: 'How quickly will I see results?',
                para: 'Most individuals begin to notice improvements within <b>2–4 weeks</b>, with more significant performance changes <b>over 6–12 weeks.</b> \n Results depend on: \n • Consistency \n  • Effort \n  • Recovery \n  • Nutrition'
            },

            {
                title: 'What kind of results can I expect?',
                para: 'Depending on the program, results may include: \n • Improved speed and acceleration \n  • Increased strength and power \n  • Better endurance and conditioning \n  • Improved body composition \n  • Greater overall performance capacity'
            },
            {
                title: 'Is this suitable if I’m coming back from injury?',
                para: 'If you are returning from injury, you should proceed cautiously.\n GG Perform programs are built with <b>long-term performance in mind,</b> but individual conditions vary.\n Consult a medical or rehabilitation professional if needed before starting.'
            },
            ]
        },
        {
            img: '/A72B17A6-7D28-4A7D-B4A5-056BD6697140_1_105_c.jpeg',
            title: 'COACHING & SUPPORT',
            questions: [{
                title: 'Do I get coaching support?',
                para: 'This depends on the program. \n The <b>Elite Coaching Hub</b> provides ongoing guidance and updated programming. \n Personal coaching is available separately for athletes who need individualized support.'
            },

            {
                title: 'Can I work directly with George Griffith?',
                para: 'Yes, but availability is limited. \n Personal coaching is reserved for: \n • Competitive athletes \n  • Individuals preparing for specific events \n  • Those seeking advanced performance guidance'
            },
            ]
        },
        {
            img: '/product1.png',
            title: 'PAYMENT & ACCESS',
            questions: [{
                title: 'How do I purchase a program?',
                para: 'Programs can be purchased directly through the website. \n Once purchased, you will receive access to your program materials.'
            },

            {
                title: 'Are there refunds?',
                para: 'Due to the nature of digital programs, purchases are generally non-refundable. \n However, GG Perform is committed to delivering high-quality training systems that produce results when followed correctly.'
            },
            ]
        },
        {
            img: '/891CA45A-8F60-456B-BAED-8AA56107CE84_1_105_c.jpeg',
            title: 'FINAL QUESTION ',
            questions: [{
                title: 'What should I start with?',
                para: 'If you’re unsure where to begin:\n Start with a structured program that matches your primary goal (speed, conditioning, or general performance).\n If you want ongoing guidance, the <b>GG Perform Elite Coaching Hub</b> is the best place to start.'
            },
            ]
        }
    ]

    const [faqIndex, setfaqIndex] = useState({
        parent: null,
        child: null
    });
    const faqIndexFunction = (parentIndex, childIndex) => {
        if (
            faqIndex.parent === parentIndex &&
            faqIndex.child === childIndex
        ) {
            setfaqIndex({ parent: null, child: null });
        } else {
            setfaqIndex({ parent: parentIndex, child: childIndex });
        }
    };
    return (
        <>
            <div className='faq_page_content_wrapper'>
                {faqData?.map((element, index) => {
                    return (
                        <>
                            <div key={index} className='faq-container'>
                                <div className='faq-left'>
                                    <h2 className='faq-heading' style={{
                                        fontSize: '45px',
                                        marginBottom: '0px',
                                        lineHeight: '50px'
                                    }}>{element.title}</h2>
                                    {element?.questions?.map((e, i) => (
                                        <div onClick={() => faqIndexFunction(index, i)} className='faq-item ' style={{
                                            minHeight: 40
                                        }}>
                                            <div className='faq-question'>
                                                <strong>{e?.title}</strong>
                                                <i class="fa-solid fa-angle-down"></i>
                                            </div>
                                            {faqIndex.parent === index && faqIndex.child === i && (
                                                <p
                                                    style={{ whiteSpace: 'pre-line' }}
                                                    className='faq-answer'
                                                    dangerouslySetInnerHTML={{ __html: e.para }}
                                                ></p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className='faq_right'>
                                    <img src={element?.img} style={{
                                        width: '100%',
                                        height: '500px',
                                        objectFit: 'cover'
                                    }} />
                                </div>
                            </div>
                        </>
                    )
                })}

            </div>
        </>
    )
}

export default FaqPage
