// src/components/PopularPosts.jsx
import React from 'react';
import { useBlog } from '../context/BlogContext';
import '../css/PopularPosts.css';

export default function PopularPosts() {
  const { blogs, loading } = useBlog();

  // Get popular posts sorted by view count (highest first - descending order)
  const getPopularPosts = () => {
    if (!blogs || blogs.length === 0) return [];
    
    // Sort blogs by view count in descending order and take top 10
    return blogs
      .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
      .slice(0, 10);
  };

  const popularPosts = getPopularPosts();

  if (loading) {
    return (
      <div className="popular-posts">
        <h3>Popular Posts</h3>
        <div className="popular-posts-scroll">
          <p>Loading popular posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="popular-posts">
      <h3>Popular Posts</h3>
      <div className="popular-posts-scroll">
        {popularPosts.length > 0 ? (
          popularPosts.map((post, index) => (
            <div className="popular-post" key={post.id || index}>
              <img src={post.image || "/pp1.png"} alt="Popular" />
              <div className="info">
                <span>{post.category || "Uncategorized"}</span><br />
                <small>{post.date || "No date"}</small>
                <p>{post.title || "No title"}</p>
                <small style={{ color: '#666', fontSize: '10px' }}>
                  {post.view_count || 0} views
                </small>
              </div>
            </div>
          ))
        ) : (
          <p>No popular posts available</p>
        )}
      </div>
    </div>
  );
}
