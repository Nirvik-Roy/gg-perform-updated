import React, { createContext, useContext, useState, useEffect } from 'react';

const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/blogs`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }
      
      const result = await response.json();
      
      if (result.status === 'success' && result.data) {
        // Transform API data to match our component structure
        const transformedBlogs = result.data.map(blog => ({
          id: blog.id,
          title: blog.name,
          description: blog.introduction_description,
          date: new Date(blog.created_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          category: blog.category?.name || 'Uncategorized',
          image: blog.thumbnail_image,
          view_count: blog.view_count || 0,
          content: {
            intro: blog.introduction_description,
            sections: blog.sections?.map(section => ({
              title: section.heading,
              content: section.description,
              image: section.image,
              buttonName: section.button_name,
              buttonUrl: section.button_url,
              imageLocation: section.image_location
            })) || []
          },
          enableFacebookShare: blog.enable_facebook_share,
          enableTwitterShare: blog.enable_twitter_share,
          enableLinkedinShare: blog.enable_linkedin_share
        }));

        setBlogs(transformedBlogs);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getBlogById = (id) => {
    return blogs.find(blog => blog.id === parseInt(id));
  };

  const getBlogByTitle = (titleOrSlug) => {
    if (!titleOrSlug) return null;
    
    // Direct slug creation - no external dependencies
    const toSlug = (title) => title?.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '') || '';
    
    // Try multiple matching strategies
    return blogs.find(blog => {
      if (!blog.title) return false;
      
      // Exact match
      if (blog.title === titleOrSlug) return true;
      
      // Case-insensitive match
      if (blog.title.toLowerCase().trim() === titleOrSlug.toLowerCase().trim()) return true;
      
      // Slug match
      if (toSlug(blog.title) === titleOrSlug || toSlug(blog.title) === titleOrSlug.toLowerCase()) return true;
      
      // Reverse slug match (slug to title)
      if (blog.title.toLowerCase().trim() === titleOrSlug.replace(/-/g, ' ').toLowerCase().trim()) return true;
      
      return false;
    }) || null;
  };

  const getBlogByCategoryAndTitle = (category, titleOrSlug) => {
    if (!category || !titleOrSlug) return null;
    
    // Direct slug creation
    const toSlug = (text) => text?.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '') || '';
    
    // Filter by category first, then find by title
    const categoryBlogs = blogs.filter(blog => {
      if (!blog.category) return false;
      
      // Try exact category match
      if (blog.category === category) return true;
      
      // Try case-insensitive category match
      if (blog.category.toLowerCase().trim() === category.toLowerCase().trim()) return true;
      
      // Try slug category match
      if (toSlug(blog.category) === category || toSlug(blog.category) === category.toLowerCase()) return true;
      
      // Try reverse slug match for category
      if (blog.category.toLowerCase().trim() === category.replace(/-/g, ' ').toLowerCase().trim()) return true;
      
      return false;
    });
    
    // Now find by title within the category
    return categoryBlogs.find(blog => {
      if (!blog.title) return false;
      
      // Exact title match
      if (blog.title === titleOrSlug) return true;
      
      // Case-insensitive title match
      if (blog.title.toLowerCase().trim() === titleOrSlug.toLowerCase().trim()) return true;
      
      // Slug title match
      if (toSlug(blog.title) === titleOrSlug || toSlug(blog.title) === titleOrSlug.toLowerCase()) return true;
      
      // Reverse slug match for title
      if (blog.title.toLowerCase().trim() === titleOrSlug.replace(/-/g, ' ').toLowerCase().trim()) return true;
      
      return false;
    }) || null;
  };

  // Test function to check if API is working
  const testViewCountAPI = async (blogId) => {
    try {
      console.log('Testing view count API for blog ID:', blogId);
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/blogs/${blogId}/view-count`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Test API Response Status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Test API Success Result:', result);
        return result;
      } else {
        const errorText = await response.text();
        console.error('Test API Error:', errorText);
        return null;
      }
    } catch (error) {
      console.error('Test API Exception:', error);
      return null;
    }
  };

  // Function to increment view count for the clicked blog only
  const incrementViewCount = async (clickedBlogId) => {
    try {
      console.log('Incrementing view count for clicked blog ID:', clickedBlogId);
      
      // Find the current blog to get its current view count
      const currentBlog = blogs.find(blog => blog.id === clickedBlogId);
      if (!currentBlog) {
        console.error('Blog not found:', clickedBlogId);
        return;
      }
      
      // Calculate new view count (increment by 1)
      const currentViewCount = currentBlog.view_count || 0;
      const newViewCount = currentViewCount + 1;
      
      console.log(`Current view count: ${currentViewCount}, New view count: ${newViewCount}`);
      
      // Make API call to update the view count
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/blogs/${clickedBlogId}/view-count`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          view_count: newViewCount
        })
      });
      
      console.log(`API Response status for blog ${clickedBlogId}:`, response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('View count updated for blog', clickedBlogId, ':', result);
        
        // Update the blog's view count in the state with the new count
        if (result.status === 'success' && result.data) {
          setBlogs(prevBlogs => 
            prevBlogs.map(blog => 
              blog.id === clickedBlogId 
                ? { ...blog, view_count: result.data.view_count }
                : blog
            )
          );
          console.log(`Updated view count for blog ${clickedBlogId} to:`, result.data.view_count);
        }
      } else {
        const errorText = await response.text();
        console.error(`Failed to update view count for blog ${clickedBlogId}. Status: ${response.status}, Response:`, errorText);
      }
      
    } catch (error) {
      console.error('Error in incrementViewCount:', error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <BlogContext.Provider value={{ 
      blogs, 
      loading, 
      error, 
      fetchBlogs,
      getBlogById,
      getBlogByTitle,
      getBlogByCategoryAndTitle,
      incrementViewCount,
      testViewCountAPI
    }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => useContext(BlogContext); 