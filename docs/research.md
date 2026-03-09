# Craigslist Minneapolis -- Research & Audit

## Current Experience Audit

### Home (minneapolis.craigslist.org)
- ~130 blue text links organized into 7 sections: Community, Services, Housing, For Sale, Jobs, Gigs, Resumes
- No images anywhere on the home page
- Search bar exists but tiny, no prominence
- No trending, no "near you", no personalization
- Discussion Forums add another ~50 text links
- Feels like navigating a spreadsheet from 2003

### Browse (For Sale > Furniture)
- Text-only list with optional tiny thumbnails
- No price visibility without tapping into each listing
- No distance or neighborhood info in results
- No filter or sort controls
- Subcategories require separate page loads

### Search
- Bare text input, no autocomplete, no suggestions, no recent searches
- Results are same text-heavy list as browse
- No cross-category awareness
- No saved search capability

### Item Detail
- Small, low-quality image gallery
- No seller information beyond anonymous reply link
- No trust signals (no account age, no ratings, no verification)
- Reply action goes to email -- leaves the app entirely
- No save/favorite functionality visible

### Post Creation (Seller)
- Functional but dated form interface
- No photo guidance or camera-first flow
- No preview of how listing appears to buyers
- No post-publish dashboard or engagement metrics
- Zero feedback loop after posting

---

## Business Model

Craigslist makes ~$297M/year from listing fees. No ads. No data selling. ~50 employees. 500M monthly visits.

### Fee Structure (Minneapolis)
| Category | Fee | Revenue Role |
|---|---|---|
| Job Postings | $10-$75/post | Largest revenue source |
| Vehicles (owner + dealer) | $5/post | High volume |
| Apartment Rentals (select markets) | $5-$10/post | Market-dependent |
| Services & Gigs | $3-$10/post | Steady volume |
| Dealer Sales (any category) | $3-$5/post | Commercial sellers |
| Everything else | Free | Drives traffic and trust |

### Key Insight
Sellers pay. Buyers don't. But the buyer experience determines whether sellers get value from their listings. This creates a marketplace flywheel.

---

## Competitive Analysis

### Facebook Marketplace
- Photo-forward browsing with large image cards
- Integrated messaging (no email redirect)
- Identity-backed trust (real Facebook profiles)
- Shipping integration
- AI-powered categorization and pricing suggestions

### OfferUp
- Camera-first listing creation
- Seller ratings and verification badges
- In-app messaging with read receipts
- TruYou identity verification
- Promoted listings as revenue stream

### Airbnb (UI patterns)
- Search-forward home screen ("Where to?" hero prompt)
- Image-first listing cards with generous sizing
- Horizontally scrollable category chips for filtering
- Clean type hierarchy with bold headings
- Warm, inviting visual tone

### Facebook Marketplace (UI patterns)
- Full-screen modal for structured listing creation with publish CTA
- Photo/video-first upload with clear media counts
- Category-driven browsing with hyper-local relevance
- Progressive disclosure via expandable listing options

### eBay (marketplace search & discovery)
- Predictive type-ahead search with real-time suggestions as you type
- Layered filter & sort controls that refine results without full reloads
- Persistent saved searches with push alerts for new matches
- Structured category taxonomy driving efficient browsing

### Zillow (listing detail & map UX)
- Rich listing detail pages with structured data, galleries, and neighborhood context
- Interactive map-first browsing with boundary overlays and clustering
- Seamless transition between list and map views for spatial discovery
- Location-aware search with geographically relevant results

---

## Patterns Adopted for CL Redesign

| Pattern | Source | CL Application |
|---|---|---|
| Search-forward home | Airbnb | Home: search bar as hero element |
| Image-first cards | Airbnb, Marketplace | Browse, Search, Home feed |
| Category chips | Airbnb | Browse: subcategory filtering |
| Full-screen listing creation | Marketplace | Create Post: structured form flow |
| Predictive search | eBay | Search: type-ahead suggestions |
| Saved searches | eBay | Search: persistent alerts for new matches |
| Rich listing detail | Zillow | Post Detail: structured layout + gallery |
| Map-based browsing | Zillow | Housing: interactive map discovery |

---

## User Archetypes

### Power Users
- **Buyer with Intent**: Repeat searchers, specific goals, value efficiency and filters
- **Commercial Seller**: Posts regularly, pays fees, needs performance visibility

### Casual Users
- **Buyer without Intent**: Occasional browsers, driven by curiosity, need visual feed
- **Private Seller**: 1-3 items to offload, posts rarely, needs effortless experience

### The Insight
Power users on both sides share traits (repeat usage, efficiency, likely to pay).
Casual users on both sides share traits (occasional, momentary need, low friction required).
