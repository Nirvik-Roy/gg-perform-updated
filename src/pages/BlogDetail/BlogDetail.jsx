import React, { useEffect } from "react";
import { useBanner } from "../../context/BannerContext";
import { useBlog } from "../../context/BlogContext";
import { useParams, useNavigate } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import './BlogDetail.css';

function BlogDetail() {
  const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();
  const { getBlogById, getBlogByTitle, getBlogByCategoryAndTitle, loading, incrementViewCount, testViewCountAPI } = useBlog();
  const { category, title } = useParams();
  const navigate = useNavigate();

  console.log('BlogDetail params - category:', category, 'title:', title);
  
  const blog = category && title 
    ? getBlogByCategoryAndTitle(decodeURIComponent(category), decodeURIComponent(title))
    : getBlogByTitle(decodeURIComponent(title || ''));
  
  console.log('BlogDetail found blog:', blog?.title || 'No blog found');

  useEffect(() => {
    const handleViewCount = async () => {
      if (blog) {
        setBannerTitle(blog.title);
        setBreadcrumb(`Writing/${blog.category}/${blog.title}`);
        setBannerImage("/other-banner.png");
        
        // Increment view count for the clicked blog (only once per session)
        const viewedKey = `blog_${blog.title}_viewed`;
        if (!sessionStorage.getItem(viewedKey)) {
          console.log('Incrementing view count for blog ID:', blog.title);
          incrementViewCount(blog.title);
          sessionStorage.setItem(viewedKey, 'true');
        }
      }
    };

    handleViewCount();
  }, [blog, setBannerTitle, setBreadcrumb, setBannerImage, incrementViewCount, testViewCountAPI, title]);

  // Function to render HTML content safely
  const renderHTML = (htmlContent) => {
    return { __html: htmlContent };
  };

  // Function to handle social media sharing
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blog?.title || 'Check out this blog post';
    const text = blog?.description || '';

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="article-wrapper">
        <div className="loading-container">
          <p>Loading blog...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="article-wrapper">
        <div className="error-container">
          <h2>Blog Not Found</h2>
          <p>The blog you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/blog1')} className="back-button">
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="article-wrapper">
      {/* Blog Header */}
      <div className="blog-header">
        <div className="blog-meta">
          <span className="blog-category">{blog.category}</span>
          <span className="blog-date">{blog.date}</span>
        </div>
        <h1 className="blog-title">{blog.title}</h1>
        <div 
          className="blog-description"
          dangerouslySetInnerHTML={renderHTML(blog.description)}
        />
        
        {/* Social Share Buttons */}
        <div className="social-share">
          <span>Share this post:</span>
          {blog.enableFacebookShare && (
            <button 
              onClick={() => handleShare('facebook')}
              className="share-button facebook"
              title="Share on Facebook"
            >
              <FaFacebookF />
            </button>
          )}
          {blog.enableTwitterShare && (
            <button 
              onClick={() => handleShare('twitter')}
              className="share-button twitter"
              title="Share on Twitter"
            >
              <FaTwitter />
            </button>
          )}
          {blog.enableLinkedinShare && (
            <button 
              onClick={() => handleShare('linkedin')}
              className="share-button linkedin"
              title="Share on LinkedIn"
            >
              <FaLinkedinIn />
            </button>
          )}
        </div>
      </div>

      {/* Blog Content */}
      <div className="blog-content">
        

        {blog.content.sections.map((section, index) => (
          <div key={index} className="blog-section">
            <h2>{section.title}</h2>
            <div 
          className="intro"
          dangerouslySetInnerHTML={renderHTML(blog.content.intro)}
        />
            
            {/* Render section content based on image location */}
            {section.image ? (
              <div className={`image-text-row ${section.imageLocation === 'right' ? 'image-right' : 'image-left'}`}>
                {section.imageLocation === 'right' ? (
                  <>
                    <div className="text-content">
                      <div 
                        dangerouslySetInnerHTML={renderHTML(section.content)}
                      />
                      {section.buttonName && section.buttonUrl && (
                        <a 
                          href={section.buttonUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="section-button"
                        >
                          {section.buttonName}
                        </a>
                      )}
                    </div>
                    <img src={section.image} alt={section.title} />
                  </>
                ) : (
                  <>
                    <img src={section.image} alt={section.title} />
                    <div className="text-content">
                      <div 
                        dangerouslySetInnerHTML={renderHTML(section.content)}
                      />
                      {section.buttonName && section.buttonUrl && (
                        <a 
                          href={section.buttonUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="section-button"
                        >
                          {section.buttonName}
                        </a>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-content">
                <div 
                  dangerouslySetInnerHTML={renderHTML(section.content)}
                />
                {section.buttonName && section.buttonUrl && (
                  <a 
                    href={section.buttonUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="section-button"
                  >
                    {section.buttonName}
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Back to Blogs Button */}
      <div className="back-to-blogs">
        <button onClick={() => navigate('/blog1')} className="back-button">
          ← Back to All Blogs
        </button>
      </div>
    </div>
  );
}

export default BlogDetail;
