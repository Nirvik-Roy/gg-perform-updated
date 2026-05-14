import React from "react";
import { useEffect, useState } from "react";
import { useBanner } from "../../context/BannerContext";
import "./HomePage.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import TopCourses from "../../component/TopCourses";
import BlogCarousel from "../../component/BlogCarousel";
import { useNavigate } from "react-router-dom";
import UltimateChallenge from "./UltimateChallenge/UltimateChallenge.jsx";
import Gearup from "./Gearup/Gearup";
import HomeEvent from "./HomeEvent/HomeEvent.jsx";

// Helper function to clean HTML tags from text
const cleanHtmlTags = (text) => {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '');
};
function HomePage() {
  const navigate = useNavigate()
  const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();

  // State for homepage content
  const [homepageContent, setHomepageContent] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [whyChooseUsItems, setWhyChooseUsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch homepage content
  const fetchHomepageContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/home-page`);

      if (!response.ok) {
        throw new Error('Failed to fetch homepage content');
      }

      const result = await response.json();

      if (result.status === "success") {
        setHomepageContent(result.data.content);
        // setFaqs(result.data.faqs || []);
        setWhyChooseUsItems(result.data.why_choose_us_items || []);
      } else {
        setError('Failed to load homepage content');
      }
    } catch (error) {
      console.error("Error fetching homepage content:", error);
      setError('An error occurred while loading content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setBannerTitle("Home");
    setBreadcrumb("");
    setBannerImage("/home-banner.jpg");
    fetchHomepageContent();
  }, []);

  // Use API data or fallback to static data
  const features = whyChooseUsItems.length > 0 ? whyChooseUsItems : [
    {
      title: 'Expert Guidance',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac libero a nisi tincidunt sollicitudin non in risus.'
    },
    {
      title: 'Expert Guidance',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac libero a nisi tincidunt sollicitudin non in risus.'
    },
    {
      title: 'Expert Guidance',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac libero a nisi tincidunt sollicitudin non in risus.'
    }
  ];

  const faqData = faqs.length > 0 ? faqs : [
    {
      question: "What is GG Perform?",
      answer: `GG Perform is a high-performance training platform offering structured programs designed to improve speed, strength, endurance, and overall athletic performance. \n All programs are built using real coaching experience and performance principles used in competitive sport.`
    },
    {
      question: "Who are these programs for?",
      answer: `GG Perform is designed for: \n • Athletes (track & field, endurance, OCR, HYROX, team sports)\n • Competitive fitness individuals \n • Busy professionals who want structured, effective training \n If you want measurable improvement—not random workouts—these programs are for you.`
    },
    {
      question: "Do I need to be an advanced athlete?",
      answer: `No. \n Programs are designed with <b>progressions and clear structure,</b> so they can be adapted to different levels. \n However, they are best suited for individuals who are serious about improving.`
    },
    {
      question: "How are the programs delivered?",
      answer: `Programs are delivered digitally and may include: \n • Structured training plans \n  • Video or written instruction \n  • Weekly or monthly programming (for subscriptions) \n You can follow the programs at your own pace unless otherwise specified.
`
    },
  ];
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAnswer = (index) => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Validation function to check if all fields are filled
  const isFormValid = () => {
    return form.firstName.trim() !== '' &&
      form.lastName.trim() !== '' &&
      form.email.trim() !== '' &&
      form.phone.trim() !== '' &&
      form.message.trim() !== '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!isFormValid()) {
      setSubmitMessage("Please fill in all fields before submitting.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/contact-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          phone: form.phone,
          message: form.message,
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        console.log(result);

        setSubmitMessage("Your form is submitted successfully. We will be reaching out to you soon.");
        // Reset form
        setForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
        });
      } else {
        setSubmitMessage("Failed to submit form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  // const [openIndex, setOpenIndex] = useState(0);
  return (
    <div className="homePage-main-container">
      <div className="about-container">
        <div className="image-section">
          <img
            // src={homepageContent?.about_us_section_image || "/F1F0F9AB-EC62-428B-A290-6F45E11D79D6_1_105_c.jpeg"}
            src={'/WhatsApp Image 2026-05-11 at 5.57.35 PM.jpeg'}
            alt="George Griffith"
            className="trainer-image"
          />
          <div className="experience-badge">
            <h2>25+</h2>
            <p>Years of Experience</p>
          </div>
        </div>
        <div className="content-section">
          <h2>
            About George
            {/* {homepageContent?.about_us_section_heading || "About"} */}
             <br />
            {/* <span>George Griffith</span> */}
          </h2>
          {/* <p className="about-text">
            {homepageContent?.about_us_section_description ? 
              cleanHtmlTags(homepageContent.about_us_section_description) : 
              "Driven by a passion for fitness and a commitment to helping others achieve their best selves, our founder brings years of experience, discipline, and vision to this gym. What started as a personal journey toward health and strength has evolved into a mission to build a supportive, results-focused space for the entire community. With a deep understanding of training, motivation, and the challenges people face in staying consistent, the owner leads with empathy, dedication, and a relentless pursuit of excellence — setting the tone for everything this gym stands for. What started as a personal journey toward health and strength has evolved into a mission to build a supportive, results-focused space for the entire community. With a deep understanding."}
          </p> */}

          <p className="about-text">
            <h3>Coaching Experience You Can Trust
            </h3>

            <p style={{
              marginTop: '-10px'
            }}>GG Perform was founded by George Griffith, a performance coach with more than two decades of experience developing athletes and high performers.</p>

            <p>Highlights include:</p>
            <p style={{
              marginTop: '-10px'
            }}> • Coaching <b>Carifta Games gold medalists</b></p>
            <p style={{
              marginTop: '-10px'
            }}> • Working with athletes across <b>track & field, combat sports, and endurance sports</b></p>
            <p style={{
              marginTop: '-10px'
            }}> • <b>Certified Speed Specialist</b></p>
            <p style={{
              marginTop: '-10px'
            }}> • <b>ACSM Exercise Physiologist</b></p>
            <p style={{
              marginTop: '-10px'
            }}> •  <b>Altis Endurance Specialist</b></p>
            <p style={{
              marginTop: '-10px'
            }}> •  25+ years coaching experience</p>
            <p style={{
              marginTop: '-10px'
            }}>George's approach blends <b>practical coaching experience with modern performance science.</b></p>

            <p style={{
              marginTop: '-10px'
            }}>The goal is simple:</p>
            <h3 style={{
              marginTop: '-10px'
            }}>Make athletes faster, stronger, and more resilient.
            </h3>
          </p>
        </div>
      </div>
      <div className="mvv-section">
        <div className="mvv-overlay">
          <div className="mvv-box">
            <h1><span className="mvv-number">01</span> <span className="mvv-heading">Mission</span></h1>
            {/* <div>{cleanHtmlTags(homepageContent?.mission_description)}</div> */}
            {/* <strong style={{
              marginTop: '-10px',
              display: 'block',
              fontSize: '20px'
            }}>Our Mission</strong> */}
            <p>To help athletes and driven individuals unlock their full physical and mental potential through structured, intelligent training systems. <br /> <br />
              GG Perform exists to replace random workouts with <strong>clear direction, measurable progress, and proven performance methods.</strong>
            </p>

          </div>
          <div className="mvv-box">
            <h1><span className="mvv-number">02</span> <span className="mvv-heading">Vision</span></h1>

            {/* <strong style={{
              marginTop: '-10px',
              display: 'block',
              fontSize: '20px'
            }}>Our Vision
            </strong> */}
            <p>To become a leading performance brand in the Caribbean and beyond, recognized for developing athletes, elevating standards, and redefining how people train. <br /> <br />
              GG Perform aims to build a global community grounded in <strong>discipline, consistency, and high-level performance.</strong>
            </p>
            {/* <div dangerouslySetInnerHTML={{ __html: homepageContent?.vision_description || 
            "To be the most trusted and results-driven fitness destination in the community.<br />We envision a world where fitness is accessible, sustainable, and transformational — creating confident, resilient individuals who prioritize well-being and personal growth." }} /> */}
            {/* <div>{cleanHtmlTags(homepageContent?.vision_description)}</div> */}
          </div>
          <div className="mvv-box">
            <h1><span className="mvv-number">03</span> <span className="mvv-heading">Values</span></h1>
            {/* <strong style={{
              marginTop: '-10px',
              display: 'block',
              fontSize: '20px'
            }}>Our Values
            </strong> */}
            <p>Structured training with measurable progress and consistent effort drives real performance and disciplined improvement.<br /> <br />
              Sustainable methods and experienced coaching build long-term strength, ensuring growth, health, and performance over time.
            </p>

            {/* <div dangerouslySetInnerHTML={{ __html: homepageContent?.values_description || 
            "<ul></ul>" }} /> */}
            {/* <div>{cleanHtmlTags(homepageContent?.values_description)}</div> */}
          </div>
        </div>
      </div>
      <div className="why-container">
        <h2 className="why-heading">
        {/* {homepageContent?.why_choose_us_section_heading || ""} */}
        Training Philosophy
        </h2>
        <div className="why-content">
          <div className="why-column">
            {whyChooseUsItems.slice(0, Math.ceil(whyChooseUsItems.length / 2)).map((item, index) => (
              <div className="why-box" key={index}>
                <h4 style={{
                  fontWeight: '600'
                }}>{item.heading}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>

          <div className="why-image">
            <img src={homepageContent?.why_choose_us_section_image || '/runner.png'} alt="Runner" />
          </div>

          <div className="why-column">
            {whyChooseUsItems.slice(Math.ceil(whyChooseUsItems.length / 2)).map((item, index) => (
              <div className="why-box" key={index + Math.ceil(whyChooseUsItems.length / 2)}>
                <h4 style={{
                  fontWeight: '600'
                }}>{item.heading}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <TopCourses />
      <UltimateChallenge/>
      {/* <Gearup/> */}
      <HomeEvent/>
      {/* <BlogCarousel /> */}
      <div className="faq-container">
        <div className="faq-left">
          <h2 className="faq-heading">Faq</h2>
          <div className="faq-list">
            {faqData.map((item, index) => (
              <div
                key={index}
                className={`faq-item ${openIndex === index ? 'open' : ''}`}
                onClick={() => toggleAnswer(index)}
              >
                <div className="faq-question">
                  <strong>{item.heading || item.question}</strong>
                  <span>{openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </div>
                {openIndex === index && <p style={{
                  whiteSpace: 'pre-line'
                }} className="faq-answer" dangerouslySetInnerHTML={{ __html: item.answer || item.description }}></p>}
              </div>
            ))}

          
          </div>
          <div onClick={(()=>navigate('/faq'))} style={{
            display:'flex',
            justifyContent:'end'
          }}>
            <button className="submit-button" style={{
              width: 'fit-content',
              marginLeft: 'auto',
              background:'#7920d2',
              marginTop:'15px',
              textAlign:'right',
              fontSize:'18px'
            }}>Know more</button>
          </div>
        
        </div>

        <div className="faq-right">
          {/* <img src={homepageContent?.faq_section_image || '/WhatsApp Image 2026-05-11 at 5.59.06 PM.jpeg'} alt="FAQ Visual" /> */}

          <img src={'/WhatsApp Image 2026-05-11 at 5.59.06 PM.jpeg'} alt="FAQ Visual" />
        </div>

      </div>
      <div className="contact-container">
        {/* <p className="ggabt_kicker" style={{
          textAlign: 'center',
          width: 'fit-content',
          marginInline: 'auto',
          display: 'block',
          fontSize: '20px',
        }}>CALL TO ACTION</p> */}

        <h2 className="contact-heading" style={{
          textAlign: 'center',
          borderBottom: 'none'
        }}>
          {/* {homepageContent?.contact_us_heading || "CALL TO ACTION"} */}
          Ready to Train at a Higher Level?
        </h2>
        <p className="contact_para_heading" style={{
          textAlign: 'center',
          display: 'block',
          marginTop: '-20px',
          marginBottom: '40px',
          marginInline: 'auto',
          lineHeight: '1.5',
          fontSize: '20px',
          textTransform: 'capitalize',
          color: '#000'
        }}>Explore the programs or join the GG Perform Elite Coaching Hub to start your next phase of development.</p>
        <form onSubmit={handleSubmit} className="contact-form">
          {/* <h4 className="form-subheading">Basic Details</h4> */}

          <div className="input-grid">
            <div className="form-group">
              <label className="contact-form-label">First Name<span className="required-star"> *</span></label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="contact-form-label">Last Name<span className="required-star"> *</span></label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="contact-form-label">Email<span className="required-star"> *</span></label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="contact-form-label">Phone<span className="required-star"> *</span></label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label className="contact-form-label">Message</label>
            <textarea
              name="message"
              rows="4"
              value={form.message}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <button style={{ width: "200px", }} type="submit" className="submit-button explore_btn56" disabled={isSubmitting || !isFormValid()}>
            {isSubmitting ? "Submitting..." : "Join the Hub"}
          </button>


          <button  style={{ width: "200px", marginLeft: '20px', background: 'transparent', border: '1px solid #6700cb', color: '#6700cb' }} onClick={(() => navigate('/training'))} className="submit-button explore_btn56" >
            {"Explore Program"}
          </button>



          {submitMessage && (
            <div className={`submit-message ${submitMessage.includes("successfully") ? "success" : "error"}`}>
              {submitMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default HomePage;
