import React from 'react'

const WhatMakesDifferent = () => {
    const setApartItems = [
        "Real coaching experience — not theory alone",
        "Programs tested in competitive environments",
        "Integration of speed, strength, and endurance",
        "Focus on both performance and long-term health",
    ];

    const improvements = ["Speed", "Endurance", "Strength", "Confidence"];
    return (
        <>
            <section className="ggabt_different_shell" >
                <div className="ggabt_container" >
                    <div className="ggabt_different_grid">
                        <div className="ggabt_different_left">
                            <span className="ggabt_kicker_light">What Makes Us Different</span>
                            <h2 className="ggabt_section_title_light">
                                Not Just Workouts.
                                <br />
                                Performance Systems.
                            </h2>
                            <p className="ggabt_different_intro">
                                Many programs give you exercises.
                                <br />
                                GG Perform gives you
                                <strong> a roadmap for improvement.</strong>
                            </p>

                            <h4 className="ggabt_different_sub">What sets GG Perform apart:</h4>

                            <div className="ggabt_setapart_list">
                                {setApartItems.map((item, index) => (
                                    <div className="ggabt_setapart_item" key={index}>
                                        <div className="ggabt_setapart_check" style={{
                                            background:'transparent'
                                        }}>
                                            <i class="fa-regular fa-circle-check" style={{
                                                fontSize:'25px'
                                            }}></i>
                                        </div>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="ggabt_different_right">
                            <div className="ggabt_results_card">
                                <h4>This is why GG Perform athletes consistently see improvements in:</h4>
                                <div className="ggabt_results_grid">
                                    {improvements.map((item, index) => (
                                        <div className="ggabt_result_item" key={index}>
                                            <div className="ggabt_result_icon">
                                                <i className="fa-solid fa-bolt"></i>
                                            </div>
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default WhatMakesDifferent
