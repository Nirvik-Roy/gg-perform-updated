import React from 'react';
import '../css/Footer.css';
import { useNavigate } from "react-router-dom";
import { FaWhatsapp, FaEnvelope, FaPhone, FaFacebookF, FaInstagram, FaTwitter, FaAddressBook } from 'react-icons/fa';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function Footer() {
  const navigate = useNavigate();
  const { siteSettings, loading: siteSettingsLoading } = useSiteSettings();

  return (
    <footer className="footer-wrapper">
      <div className="footer-overlay">
        <div className="footer-top">
          <div className="footer-content">
            {/* Logo & Text */}
            <div className="footer-left">
              <img
                src={siteSettings?.footer_logo || "/gg-logo.png"}
                alt={siteSettings?.site_identity || "Logo"}
                className="footer-logo"
              />
              <span style={{
                display: 'block',
                fontWeight: '600',
                fontSize: '18px',
                marginBottom: '0'
              }}>Intelligent | Athletic | Conditioning</span>
              <p
                style={{
                  fontSize: '14px',
                  lineHeight: '25px',
                  marginTop:'-10px'
                }}
              // dangerouslySetInnerHTML={{
              //   __html: siteSettings?.footer_description ||
              //     "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever."
              // }}

              >
                <br />  At GG Perform, we combine science-backed conditioning, performance coaching, and structured athletic development to help individuals move better, perform stronger, and unlock their full potential. Train with purpose. Perform with confidence.</p>
            </div>

            {/* Info */}
            <div className="footer-section">
              <h4>{siteSettings?.footer_menu_heading || "Information"}</h4>
              <ul>
                <li onClick={() => navigate("home")}>Home</li>
                <li onClick={() => navigate("about")}>About</li>

                <li onClick={() => navigate("training")}>Training</li>
                {/* <li onClick={() => navigate("writing")}>Writing</li> */}
                <li onClick={() => navigate("faq")}>FAQ</li>

              

              </ul>
            </div>


            <div className="footer-section">
              {/* <h4>{siteSettings?.footer_menu_heading || "Information"}</h4> */}
              <h4>Quick Links</h4>
              <ul>
                <li onClick={() => navigate("terms")}>Terms & Condition</li>
                <li onClick={() => navigate("privacy")}>Privacy Policy</li>
                <li onClick={() => navigate("refund")}>Refund Policy</li>

              </ul>
            </div>
            {/* Contact */}
            <div className="footer-link-wrapper">
              <div className="footer-section">
                <h4>{siteSettings?.contact_details_heading || "Contact"}</h4>
                <p><img src="/Vector.svg" alt="Phone" />
                  {/* {siteSettings?.phone || "123 456 789"} */} +12462314626
                </p>
                {/* <p><img src="/whatsapp.svg" alt="" />
                  {siteSettings?.address || "b"}
                </p> */}
                <p><img src="/mail.svg" alt="" />
                  {/* {siteSettings?.email || "hola@Liftmedia.com"} */}
                  support@ggperform.com
                </p>
              </div>
            </div>

            

            {/* Bodybuilder Image */}
            <div className="footer-image-right">
              <img src="/Frame 2147224721.png" alt="Bodybuilder" />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          {/* <div className="footer-email">{siteSettings?.email || "ggperform@gmail.com"}</div> */}
          <div className="footer-credit" onClick={() => navigate("https://webprismits.us/")}>{siteSettings?.copyright_statement || "Designed by Web Prism Dynamics LLP @ 2025. All rights reserved."}</div>
          <div className="footer-socials">
            Follow us
            {siteSettings?.facebook_link && (
              <a href={siteSettings.facebook_link} target="_blank" rel="noopener noreferrer">
                <FaFacebookF />
                {/* <img src="/facebook.png" alt="Facebook" /> */}
              </a>
            )}
            {siteSettings?.instagram_link && (
              <a href={siteSettings.instagram_link} target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
            )}
            {siteSettings?.x_link && (
              <a href={siteSettings.x_link} target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
            )}
            {!siteSettings?.facebook_link && !siteSettings?.instagram_link && !siteSettings?.x_link && (
              <>
                <FaFacebookF />
                <FaInstagram />
                <FaTwitter />
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
