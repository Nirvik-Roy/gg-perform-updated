import React from 'react'
import { useNavigate } from 'react-router-dom';

const TheMission = () => {
    const goals = [
        "Winning medals",
        "Setting personal bests",
        "Returning to peak fitness",
        "Performing better in daily life",
    ];
    const navigate = useNavigate()
    return (
        <>
            <section className="ggabt_mission_shell">
                <div className="ggabt_container">
                    <div className="ggabt_mission_grid">
                        <div className="ggabt_mission_left">
                            <span className="ggabt_kicker_light">The Mission</span>
                            <h2 className="ggabt_section_title_light">
                                Building Better Performers
                            </h2>
                            <h4 className="ggabt_mission_sub">The mission of GG Perform is simple</h4>

                            <p className="ggabt_mission_statement">
                                To help individuals unlock their physical and mental potential
                                through structured, intelligent training systems.
                            </p>
                        </div>

                        <div className="ggabt_mission_right">
                            <h4 className="ggabt_mission_sub">Whether that means:</h4>

                            <div className="ggabt_mission_goals">
                                {goals.map((goal, index) => (
                                    <div className="ggabt_mission_goal_item" key={index}>
                                        <div className="ggabt_mission_goal_arrow">
                                            <i className="fa-solid fa-arrow-right"></i>
                                        </div>
                                        <span>{goal}</span>
                                    </div>
                                ))}
                            </div>
                            <p style={{
                                color:'#fff',
                                fontSize:'18px'
                            }}>
                                <strong>GG Perform</strong> is designed to guide that process.
                            </p>
                            <button style={{ width: "250px", background: '#fff', border: '1px solid #6700cb', color: '#6700cb',marginTop:'10px' }} onClick={(() => navigate('/training'))} className="submit-button " >
                                {"Explore Program"}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default TheMission
