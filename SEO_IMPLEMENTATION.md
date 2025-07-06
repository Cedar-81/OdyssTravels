# SEO Implementation for Circle Sharing

## Overview

This implementation adds dynamic SEO metadata when circles are shared via URL. When someone visits a shared circle link, the page will display rich metadata including the circle's title, location, and date information.

## How It Works

### 1. SEO Utility (`src/utils/seo.ts`)

The SEO utility provides functions to:
- `updateSEO(data)`: Updates document title and meta tags
- `resetSEO()`: Resets to default SEO values
- `formatCircleSEO(circle)`: Formats circle data for SEO

### 2. Dynamic Meta Tags

When a circle is shared, the following meta tags are updated:
- **Document Title**: `"Circle Name - Departure to Destination"`
- **Meta Description**: Rich description including dates and location
- **Open Graph Tags**: For social media sharing
- **Twitter Card Tags**: For Twitter sharing

### 3. Implementation Points

#### Circles Page (`src/pages/Circles.tsx`)
- Detects `circle_id` URL parameter
- Fetches specific circle data
- Updates SEO metadata for shared circles
- Resets SEO when viewing all circles

#### Circle Detail Component (`src/components/circle_detail.tsx`)
- Updates SEO when circle detail sidebar is opened
- Ensures SEO is set even when viewing in sidebar

#### Circle Detail Page (`src/pages/CircleDetail.tsx`)
- Handles direct `/circle/:id` routes
- Updates SEO for standalone circle pages
- Provides fallback UI for errors

### 4. Example SEO Output

For a circle named "Summer Trip to Lagos" from Abuja to Lagos on July 15-20, 2025:

**Title**: `"Summer Trip to Lagos - Abuja to Lagos"`

**Description**: `"Join this travel circle from Abuja to Lagos on Mon, July 15, 2025 - Sun, July 20, 2025. Connect with fellow travelers and book your trip together."`

**URL**: `"https://odyss.ng/circles?circle_id=123"`

### 5. Social Media Sharing

The implementation includes:
- Open Graph tags for Facebook/LinkedIn
- Twitter Card tags for Twitter
- Proper URL and image handling

### 6. Error Handling

- Gracefully handles missing circle data
- Resets SEO on errors
- Provides fallback values for missing fields
- Safe date parsing with error handling

## Usage

The SEO functionality is automatically triggered when:
1. Someone visits a shared circle link (`/circles?circle_id=123`)
2. A circle detail is opened in the sidebar
3. Someone visits a direct circle page (`/circle/123`)

No manual intervention is required - the system automatically detects and updates SEO metadata based on the circle data. 