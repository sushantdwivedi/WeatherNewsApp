
import Constants from 'expo-constants';






import axios from 'axios';

const NEWS_API_KEY = Constants.expoConfig?.extra?.NEWS_API_KEY ?? '';

const BASE_URL = 'https://newsapi.org/v2';

const ALTERNATIVE_BASE_URL = 'https://saurav.tech/NewsAPI/top-headlines/category';

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  urlToImage?: string; // Added for image support
  author?: string; // Added for author info
}

export interface NewsResponse {
  articles: NewsArticle[];
  totalResults?: number;
  status?: string;
}

// Method 1: Using NewsAPI.org (requires API key)
export const fetchNewsWithAPI = async (
  category: string = 'general',
  country: string = 'us',
  pageSize: number = 20
): Promise<NewsArticle[]> => {
  try {
    console.log("NEWS_API_KEY", NEWS_API_KEY)
    const params = {
      category,
      country,
      pageSize,
      apiKey: NEWS_API_KEY,
    };

    const response = await axios.get(`${BASE_URL}/top-headlines`, { params });
    
    if (response.data.status === 'ok') {
      return response.data.articles.map((article: any) => ({
        title: article.title || 'No title available',
        description: article.description || 'No description available',
        url: article.url || '',
        source: article.source?.name || 'Unknown Source',
        publishedAt: article.publishedAt || new Date().toISOString(),
        urlToImage: article.urlToImage,
        author: article.author,
      }));
    } else {
      throw new Error(`API Error: ${response.data.message}`);
    }
  } catch (error) {
    console.error('NewsAPI.org error:', error);
    throw error;
  }
};

// Method 2: Using free alternative API (no key required)
export const fetchNewsFree = async (
  category: string = 'general'
): Promise<NewsArticle[]> => {
  try {
    // Valid categories: business, entertainment, general, health, science, sports, technology
    const validCategories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
    const selectedCategory = validCategories.includes(category.toLowerCase()) 
      ? category.toLowerCase() 
      : 'general';

    const response = await axios.get(`${ALTERNATIVE_BASE_URL}/${selectedCategory}/us.json`);
    
    if (response.data.articles) {
      return response.data.articles.map((article: any) => ({
        title: article.title || 'No title available',
        description: article.description || 'No description available',
        url: article.url || '',
        source: article.source?.name || 'Unknown Source',
        publishedAt: article.publishedAt || new Date().toISOString(),
        urlToImage: article.urlToImage,
        author: article.author,
      }));
    } else {
      throw new Error('No articles found');
    }
  } catch (error) {
    console.error('Free News API error:', error);
    throw error;
  }
};

// Method 3: Mock data for development/testing
export const fetchNewsMock = async (
  category: string = 'general'
): Promise<NewsArticle[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const mockArticles: NewsArticle[] = [
    {
      title: "Breaking: Major Tech Breakthrough Announced",
      description: "Scientists have made a significant breakthrough in quantum computing technology that could revolutionize the industry.",
      url: "https://example.com/article1",
      source: "Tech News",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      author: "John Smith"
    },
    {
      title: "Global Climate Summit Reaches Historic Agreement",
      description: "World leaders have agreed on new measures to combat climate change in what's being called a historic moment.",
      url: "https://example.com/article2",
      source: "World News",
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      author: "Jane Doe"
    },
    {
      title: "Stock Markets Rally on Economic News",
      description: "Major stock indices surged today following positive economic indicators and corporate earnings reports.",
      url: "https://example.com/article3",
      source: "Business Today",
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      author: "Mike Johnson"
    },
    {
      title: "New Health Study Reveals Surprising Results",
      description: "A comprehensive study on nutrition has revealed unexpected benefits of certain dietary practices.",
      url: "https://example.com/article4",
      source: "Health Tribune",
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      author: "Dr. Sarah Wilson"
    },
    {
      title: "Championship Game Sets New Viewership Records",
      description: "Last night's championship game broke multiple viewership records and delivered thrilling entertainment.",
      url: "https://example.com/article5",
      source: "Sports Central",
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      author: "Tom Rodriguez"
    }
  ];

  return mockArticles;
};

// Main export function with fallback strategy
export const fetchNews = async (
  category: string = 'general',
  pageSize: number = 20
): Promise<NewsArticle[]> => {
  try {
    // Try method 1: NewsAPI.org (if you have a valid key)
    if (NEWS_API_KEY) {
      console.log('Trying NewsAPI.org...');
      return await fetchNewsWithAPI(category, 'us', pageSize);
    }
    
    // Try method 2: Free alternative API
    console.log('Trying free alternative API...');
    return await fetchNewsFree(category);
    
  } catch (error) {
    console.warn('All news APIs failed, using mock data:', error);
    // Fallback to mock data for development
    return await fetchNewsMock(category);
  }
};

// Export individual methods for flexibility
// export { fetchNewsWithAPI, fetchNewsFree, fetchNewsMock };