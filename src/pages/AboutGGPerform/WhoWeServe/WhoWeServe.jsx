import React from 'react'

const WhoWeServe = () => {
    const audiences = [
        {
            icon: "fa-person-running",
            title: "Athletes",
            text: "Track & field, endurance, OCR, and sport-specific performance.",
        },
        {
            icon: "fa-trophy",
            title: "Competitive Individuals",
            text: "People who enjoy structured, challenging training.",
        },
        {
            icon: "fa-briefcase",
            title: "Professionals",
            text: "Individuals who want to maintain high levels of energy, fitness, and mental clarity.",
        },
    ];
  return (
    <>
          <section className="ggabt_serve_shell">
              <div className="about-container" style={{
                margin:'30px 0',
                paddingBottom:'0px'
              }}>
                  <div className="ggabt_serve_header">
                      <p className="ggabt_kicker" style={{
                          textAlign: 'center',
                          width:'fit-content',
                          marginInline:'auto',
                          display:'block',
                          fontSize:'20px',
                      }}>Who We Serve</p>
                      <h2 className="ggabt_section_title" style={{
                        textAlign:'center',
                        lineHeight:'1.4'
                      }}>
                          GG Perform works with individuals who want more than average
                          results.
                      </h2>
                  </div>

                  <div className="ggabt_serve_grid">
                      {audiences.map((item, index) => (
                          <div className="ggabt_serve_card" key={index}>
                              <div className="ggabt_serve_icon_wrap">
                                  <i className={`fa-solid ${item.icon}`}></i>
                              </div>
                              <h3 className="ggabt_serve_card_title">{item.title}</h3>
                              <p className="ggabt_serve_card_text">{item.text}</p>
                          </div>
                      ))}
                  </div>

                  <div className="ggabt_serve_cta_box" style={{
                    marginTop:'-10px'
                  }}>
                      <p>
                          If you are serious about improving your performance,{" "}
                          <strong>you are in the right place.</strong>
                      </p>
                  </div>
              </div>
          </section>
    </>
  )
}

export default WhoWeServe
