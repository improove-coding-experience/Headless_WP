// WordPress REST API service
// Base URL should point to the WP REST namespace (`/wp-json/wp/v2`)
const WP_BASE_URL = 'https://skyblue-kingfisher-507526.hostingersite.com/wp-json/wp/v2';

// const WP_BASE_URL = 'http://localhost/Real-estate-website/wp-json/wp/v2';

const PROPERTIES_ENDPOINT = `${WP_BASE_URL}/properties`;

// Fetch all properties
export const fetchProperties = async () => {
  try {
    console.log('Fetching from:', `${PROPERTIES_ENDPOINT}?per_page=100&_embed`);
    const response = await fetch(`${PROPERTIES_ENDPOINT}?per_page=100&_embed`);
    
    // If properties endpoint doesn't exist, fallback to posts
    if (response.status === 404) {
      console.warn('Properties endpoint not found, trying posts endpoint...');
      const postsResponse = await fetch(`${WP_BASE_URL}/posts?per_page=100&_embed`);
      if (!postsResponse.ok) throw new Error('Failed to fetch posts');
      const data = await postsResponse.json();
      console.log('Fetched posts:', data);
      return data;
    }
    
    if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch properties`);
    const data = await response.json();
    console.log('Fetched properties:', data);
    if (data.length === 0) {
      console.warn('No properties found in the API response.');
    }
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
};

// Fetch single property
export const fetchPropertyById = async (id) => {
  try {
    console.log('Fetching property ID:', id);
    const response = await fetch(`${PROPERTIES_ENDPOINT}/${id}?_embed`);
    
    // If properties endpoint doesn't exist, fallback to posts
    if (response.status === 404) {
      console.warn('Property endpoint not found, trying posts endpoint...');
      const postResponse = await fetch(`${WP_BASE_URL}/posts/${id}?_embed`);
      if (!postResponse.ok) throw new Error('Failed to fetch post');
      return await postResponse.json();
    }
    
    if (!response.ok) throw new Error('Failed to fetch property');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
};
