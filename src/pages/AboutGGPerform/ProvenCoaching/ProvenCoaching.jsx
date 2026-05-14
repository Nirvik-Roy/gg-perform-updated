import React from 'react'

const ProvenCoaching = () => {
    const highlights = [
        "Coaching athletes to Carifta Games gold medals",
        "Developing athletes across track & field, endurance, OCR, and combat sports",
        "Supporting athletes in achieving personal bests and national-level performances",
    ];
    const certifications = [
        {
            icon: "fa-heart-pulse",
            title: "ACSM Exercise Physiologist",
            org: "",
        },
        {
            icon: "fa-person-running",
            title: " USATFCCA Speed Specialist Certification",
            org: "",
        },
        {
            icon: "fa-stopwatch",
            title: " Altis Endurance Specialist",
            org: "",
        },
        {
            icon: "fa-brain",
            title: " USATFCCA  Psychology for Track & Field",
            org: "",
        },
    ];
    return (
        <>
            <section className="ggexp_shell">
                <div className="about-container" style={{
                    margin: '0',
                    paddingBottom: '0'
                }}>
                    {/* ---- HEADER ---- */}
                    <div className="ggexp_header">
                        <span className="ggexp_kicker">Experience & Credentials</span>
                        <h2 className="ggexp_title">
                            Proven Coaching. <br />
                            Real Results.
                        </h2>
                        <p className="ggexp_intro">
                            Over the past two decades, George has worked with athletes ranging
                            from beginners to elite performers.
                        </p>
                    </div>

                    {/* ---- MAIN GRID ---- */}
                    <div className="ggexp_main_grid">
                        {/* ---- LEFT: HIGHLIGHTS ---- */}
                        <div className="ggexp_highlights_col">
                            <div className="ggexp_highlights_card">
                                <div className="ggexp_highlights_top_bar">
                                    <div className="ggexp_highlights_icon">
                                        <i className="fa-solid fa-medal"></i>
                                    </div>
                                    <h3 className="ggexp_highlights_heading">Key Highlights</h3>
                                </div>

                                <div className="ggexp_highlights_list">
                                    {highlights.map((item, index) => (
                                        <div className="ggexp_highlight_item" key={index}>
                                            <div className="ggexp_highlight_marker">
                                                <div className="ggexp_highlight_dot"></div>
                                                {index < highlights.length - 1 && (
                                                    <div className="ggexp_highlight_line"></div>
                                                )}
                                            </div>
                                            <p className="ggexp_highlight_text">{item}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* ---- STATS ROW ---- */}
                                <div className="ggexp_stats_row">
                                    <div className="ggexp_stat_item">
                                        <h4>20+</h4>
                                        <span>Years Coaching</span>
                                    </div>
                                    <div className="ggexp_stat_divider"></div>
                                    <div className="ggexp_stat_item">
                                        <h4>Gold</h4>
                                        <span>Carifta Medals</span>
                                    </div>
                                    <div className="ggexp_stat_divider"></div>
                                    <div className="ggexp_stat_item">
                                        <h4>100+</h4>
                                        <span>Athletes Trained</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ---- RIGHT: CERTIFICATIONS ---- */}
                        <div className="ggexp_certs_col">
                            <h3 className="ggexp_certs_heading">Professional Certifications</h3>

                            <div className="ggexp_certs_grid">
                                {certifications.map((cert, index) => (
                                    <div className="ggexp_cert_card" key={index}>
                                        <div className="ggexp_cert_icon_wrap">
                                            <i className={`fa-solid ${cert.icon}`}></i>
                                        </div>
                                        <div className="ggexp_cert_text">
                                            <h4 className="ggexp_cert_title">{cert.title}</h4>
                                            <span className="ggexp_cert_org">{cert.org}</span>
                                        </div>
                                        <div className="ggexp_cert_badge">
                                            <i className="fa-solid fa-certificate"></i>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ---- BOTTOM STATEMENT ---- */}
                    <div className="ggexp_bottom_statement">
                        <div className="ggexp_bottom_line"></div>
                        <p>
                            This combination of <strong>hands-on coaching</strong> and{" "}
                            <strong>formal education</strong> allows GG Perform to bridge the
                            gap between science and real-world performance.
                        </p>
                        <div className="ggexp_bottom_line"></div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ProvenCoaching
