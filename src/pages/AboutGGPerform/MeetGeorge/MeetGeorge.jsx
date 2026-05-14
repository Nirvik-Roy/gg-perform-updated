import React from 'react'

const MeetGeorge = () => {
  return (
    <>
          <div className="about-container" style={{
              marginTop: '0px',
              marginBottom:'0px'
          }}>
              <div className="image-section">
                  <img
                      src={"/F1F0F9AB-EC62-428B-A290-6F45E11D79D6_1_105_c.jpeg"}
                      alt="George Griffith"
                      className="trainer-image"
                  />
                  <div className="experience-badge">
                      <h2>25+</h2>
                      <p>Years of Experience</p>
                  </div>
              </div>
              <div className="content-section about_gg_perform_page_heading">
                  {/* <h3 className="ggabt_kicker">YOUR STORY</h3> */}

                  <h2>
                      {"Meet George Griffith"} <br />
                      {/* <span>George Griffith</span> */}
                  </h2>
                  {/* <p className="about-text">
            {homepageContent?.about_us_section_description ? 
              cleanHtmlTags(homepageContent.about_us_section_description) : 
              "Driven by a passion for fitness and a commitment to helping others achieve their best selves, our founder brings years of experience, discipline, and vision to this gym. What started as a personal journey toward health and strength has evolved into a mission to build a supportive, results-focused space for the entire community. With a deep understanding of training, motivation, and the challenges people face in staying consistent, the owner leads with empathy, dedication, and a relentless pursuit of excellence — setting the tone for everything this gym stands for. What started as a personal journey toward health and strength has evolved into a mission to build a supportive, results-focused space for the entire community. With a deep understanding."}
          </p> */}

                  <p className="about-text">


                      <p style={{
                          marginTop: '-10px'
                      }}>GG Perform was founded by <strong>George Griffith</strong>, a performance coach with over 25 years of experience developing athletes across multiple disciplines.
                      </p>

                      <p>From early on, George recognized a problem:</p>
                      <p style={{
                          marginTop: '-10px'
                      }}>Most people train hard…
                          but very few train <b>correctly.</b> <br />
                          Too many athletes rely on random workouts, outdated methods, or programs that don’t match their needs.
                      </p>
                      <p>This leads to:</p>
                      <p style={{
                          marginTop: '-10px'
                      }}> • Plateaus</p>
                      <p style={{
                          marginTop: '-10px'
                      }}> •  Injuries</p>
                      <p style={{
                          marginTop: '-10px'
                      }}> • Burnout</p>
                      <p style={{
                          marginTop: '-10px'
                      }}> •  Wasted time</p>

                      <h4 style={{
                          marginTop: '-0px',
                          fontSize: '18px'
                      }}>GG Perform was built to solve that problem.</h4>
                  </p>
              </div>
          </div>
    </>
  )
}

export default MeetGeorge
