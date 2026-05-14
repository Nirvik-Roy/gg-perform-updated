import React, { createContext, useContext, useState, useEffect } from 'react';

const TrainingContext = createContext();

export const useTraining = () => {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error('useTraining must be used within a TrainingProvider');
  }
  return context;
};

export const TrainingProvider = ({ children }) => {
  const [trainings, setTrainings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/courses`);
        const result = await response.json();
        console.log("result", result);
        
        if (result.status === 'success') {
          // Transform API data to match our existing structure
          const transformedData = result.data.map(course => {
            // Calculate average rating from reviews array
            let averageRating = 0;
            let reviewCount = 0;
            
            if (course.reviews && course.reviews.length > 0) {
              const totalRating = course.reviews.reduce((sum, review) => sum + review.rating, 0);
              averageRating = totalRating / course.reviews.length;
              reviewCount = course.reviews.length;
            }

            return {
              id: course.id,
              title: course.course_name,
              description: course.description,
              image: course.featured_image,
              rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
              originalPrice: parseFloat(course.original_price),
              discountPrice: parseFloat(course.sale_price),
              type: course.course_type === "Live Sessions" ? "live" : "resource",
              schedule: course.live_session_type || "",
              category: course.category.name,
              reviews: reviewCount, // Actual review count from API
              reviewsData: course.reviews || [], // Store actual reviews data
              instructor: "Expert Instructor", // Default instructor since API doesn't provide it
              duration: "8 weeks", // Default duration since API doesn't provide it
              level: "All Levels", // Default level since API doesn't provide it
              features: [
                "Comprehensive course content",
                "Expert guidance",
                "Practical exercises",
                "Certificate of completion"
              ],
              sessionCount: course.number_of_sessions || 0,
              faqs: course.faqs || [],
              sessions: course.sessions || [],
              gallery: course.gallery || [],
              enableFaqs: course.enable_faq || false,
              enableReviews: course.enable_reviews || false,
            };
          });
          setTrainings(transformedData);
          
          // Extract unique categories from the courses
          const uniqueCategories = [...new Set(transformedData.map(course => course.category))];
          setCategories(uniqueCategories);
        } else {
          setError('Failed to fetch courses');
        }
      } catch (err) {
        setError('Error fetching courses: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  const getTrainingById = (id) => {
    return trainings.find(training => training.id === parseInt(id));
  };

  const getAllTrainings = () => {
    if (selectedCategory) {
      return trainings.filter(training => training.category === selectedCategory);
    }
    return trainings;
  };

  const getTrainingsByType = (type) => {
    return trainings.filter(training => training.type === type);
  };

  const getTrainingsByCategory = (category) => {
    return trainings.filter(training => training.category === category);
  };

  const selectCategory = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const clearCategoryFilter = () => {
    setSelectedCategory(null);
  };

  const value = {
    trainings,
    categories,
    selectedCategory,
    loading,
    error,
    getTrainingById,
    getAllTrainings,
    getTrainingsByType,
    getTrainingsByCategory,
    selectCategory,
    clearCategoryFilter
  };

  return (
    <TrainingContext.Provider value={value}>
      {children}
    </TrainingContext.Provider>
  );
}; 