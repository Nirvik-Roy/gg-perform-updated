import React, { useEffect } from 'react'
import { useBanner } from '../../context/BannerContext.jsx';
import './AboutGGPerform.css'
import MeetGeorge from './MeetGeorge/MeetGeorge.jsx';
import ProvenCoaching from './ProvenCoaching/ProvenCoaching.jsx';
import CoachingPhilosophy from './CoachingPhilosophy/CoachingPhilosophy.jsx';
import WhatMakesDifferent from './WhatMakesDifferent/WhatMakesDifferent.jsx';
import WhoWeServe from './WhoWeServe/WhoWeServe.jsx';
import TheMission from './TheMission/TheMission.jsx';
const AboutGGPerform = () => {
    const { setBannerTitle, setBreadcrumb, setbannerDescription2, setbannerDescription3, setbannerDescription4 } = useBanner();
    useEffect(() => {
        setBreadcrumb('About')
        setBannerTitle('About GG Perform')
        // setbannerDescription2('Performance is not built on motivation.'),
        //     setbannerDescription3('It is built on structure, discipline, and intelligent training.')
        setbannerDescription4('GG Perform exists to help athletes and driven individuals reach higher levels of physical and mental performance through systems that actually work.')
    }, [])
    return (
        <>
            <MeetGeorge />
            <ProvenCoaching/>
            <CoachingPhilosophy/>
            <WhatMakesDifferent/>
            <WhoWeServe/>
            <TheMission/>
        </>
    )
}

export default AboutGGPerform
