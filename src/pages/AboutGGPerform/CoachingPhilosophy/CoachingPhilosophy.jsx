import React from 'react'

const CoachingPhilosophy = () => {
    const pillars = [
        {
            icon: "fa-layer-group",
            title: "Structure",
            text: "Training is organized into progressive phases, not random sessions.",
        },
        {
            icon: "fa-chart-line",
            title: "Measurement",
            text: "Performance is tracked using real metrics — times, splits, output, and progression.",
        },
        {
            icon: "fa-crosshairs",
            title: "Specificity",
            text: "Training matches the demands of the sport or goal.",
        },
        {
            icon: "fa-infinity",
            title: "Longevity",
            text: "Athletes are developed to perform consistently, not just peak once.",
        },
    ];
  return (
    <>
          <section className="ggabt_philosophy_shell">
              <div className="about-container" style={{
                margin:'0',
                  paddingBottom: '50px'

              }}>
                  <div className="ggabt_philosophy_header">
                      <h2 className="ggabt_kicker">Coaching Philosophy</h2>
                      <h2 className="ggabt_section_title">Train With Purpose</h2>
                      <div className="ggabt_intro_block">
                          <p>
                              At GG Perform, training is not random. Every program is built
                              around a simple idea:
                          </p>
                          <h3 className="ggabt_highlight_quote">
                              Performance is a system.
                          </h3>
                          <p>That system includes:</p>
                      </div>
                  </div>

                  <div className="ggabt_pillars_grid">
                      {pillars.map((item, index) => (
                          <div className="ggabt_pillar_card" key={index}>
                              <div className="ggabt_pillar_icon_wrap">
                                  <i className={`fa-solid ${item.icon}`}></i>
                                  <span className="ggabt_pillar_number">0{index + 1}</span>
                              </div>
                              <h4 className="ggabt_pillar_title">{item.title}</h4>
                              <p className="ggabt_pillar_text">{item.text}</p>
                          </div>
                      ))}
                  </div>

                  <div className="ggabt_philosophy_footer">
                      <p>
                          This philosophy ensures that athletes improve{" "}
                          <strong>efficiently</strong> and <strong>sustainably</strong>.
                      </p>
                  </div>
              </div>
          </section>
    </>
  )
}

export default CoachingPhilosophy
