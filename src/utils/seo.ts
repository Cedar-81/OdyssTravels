// SEO utility functions for dynamic meta tag management

interface SEOData {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

export function updateSEO(data: SEOData) {
  // Update document title
  document.title = data.title;
  
  // Update or create meta tags
  updateMetaTag('name', 'description', data.description);
  updateMetaTag('property', 'og:title', data.title);
  updateMetaTag('property', 'og:description', data.description);
  updateMetaTag('property', 'og:url', data.url || window.location.href);
  
  if (data.image) {
    updateMetaTag('property', 'og:image', data.image);
  }
  
  // Twitter Card meta tags
  updateMetaTag('name', 'twitter:card', 'summary_large_image');
  updateMetaTag('name', 'twitter:title', data.title);
  updateMetaTag('name', 'twitter:description', data.description);
  
  if (data.image) {
    updateMetaTag('name', 'twitter:image', data.image);
  }
}

function updateMetaTag(attribute: 'name' | 'property', value: string, content: string) {
  let meta = document.querySelector(`meta[${attribute}="${value}"]`) as HTMLMetaElement;
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, value);
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
}

export function resetSEO() {
  // Reset to default values
  document.title = 'Travel Odyss- Book a trip with your community';
  updateMetaTag('name', 'description', 'Join travel circles and book trips with your community on Odyss');
}

export function formatCircleSEO(circle: any): SEOData {
  // Safely handle missing circle data
  const circleName = circle.name || 'Travel Circle';
  const departure = circle.departure || 'Unknown';
  const destination = circle.destination || 'Unknown';
  const description = circle.description || 'Join this travel circle';
  
  const title = `${circleName} - ${departure} to ${destination}`;
  
  // Format date range
  let dateText = '';
  if (circle.startDate && circle.endDate) {
    try {
      const startDate = new Date(circle.startDate);
      const endDate = new Date(circle.endDate);
      
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        if (startDate.toDateString() === endDate.toDateString()) {
          dateText = startDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          });
        } else {
          dateText = `${startDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })} - ${endDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}`;
        }
      }
    } catch (error) {
      console.warn('Error formatting circle dates for SEO:', error);
    }
  }
  
  const fullDescription = `${description} from ${departure} to ${destination}${dateText ? ` on ${dateText}` : ''}. Connect with fellow travelers and book your trip together.`;
  
  return {
    title,
    description: fullDescription,
    url: `${window.location.origin}/circles?circle_id=${circle.id}`
  };
} 