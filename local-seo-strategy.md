# Boston Legend Ice Cream Truck — Local SEO Strategy

## 1. Executive Summary
This document outlines the long-term Local SEO strategy for Boston Legend Ice Cream Truck following the RC-1 hardening phase. The goal is to dominate local search queries (e.g., "ice cream truck near me", "ice cream truck for parties Boston", "book ice cream truck Cambridge") across the Greater Boston area.

## 2. On-Page SEO (Completed in RC-1)
We have completely rebuilt the programmatic City Pages engine (`/cities/[slug]`).
*   **Hyper-Local Content Pools:** 12 unique intros, 15 local event types, 15 neighborhoods, 14 landmarks.
*   **PRNG-Seeded Generation:** Ensures stable, deterministic, but highly unique content combinations for every city (eliminates duplicate content penalties).
*   **JSON-LD Schema Implementation:**
    *   `LocalBusiness` (specifically `IceCreamShop`) mapping the service area explicitly to the target city.
    *   `FAQPage` schema automatically injected for 5 distinct local FAQs.
    *   `BreadcrumbList` for clear site architecture mapping.
*   **Internal Linking:** "Nearby Cities" mapping logic interconnects all service area pages seamlessly to distribute link equity.

## 3. Off-Page & Local Profiles (Next Steps)
To capitalize on the on-page structure, the following external signals must be built:

### A. Google Business Profile (GBP) Optimization
1.  **Service Area Settings:** Ensure the GBP lists the physical address (Revere, MA) but explicitly defines the Service Areas to include all 20+ generated cities (Boston, Cambridge, Somerville, Newton, etc.).
2.  **Category:** Primary: `Ice Cream Shop`. Secondary: `Event Planner`, `Caterer`.
3.  **Products/Services:** Add the specific packages (Classic Birthday, Corporate, Community Festival) as distinct products with pricing in the GBP.
4.  **Review Strategy:** The RC-1 expanded 30-day cron job will automatically funnel more reviews to the GBP. Respond to *every* review, weaving local keywords into the responses (e.g., "Thanks for having our ice cream truck at your Cambridge block party!").

### B. Local Citations & Directories
*   Ensure NAP (Name, Address, Phone Number) consistency across Yelp, Bing Places, Apple Maps, and local Boston wedding/event directories.
*   Get listed on local parent/family blogs (e.g., BostonMoms).

## 4. Content Expansion Strategy
*   **Occasions Pages:** We have successfully routed legacy URLs (e.g., `/occasion/birthday-parties`) to the new Next.js routes. Future steps involve expanding these Occasion pages with the same rich JSON-LD structure used on City pages.
*   **Blog/Resource Center:** Create "Event Planning Guides" specific to Boston (e.g., "Top 5 Parks for Birthday Parties in Newton MA").

## 5. Technical SEO Health
*   **Core Web Vitals:** The migration to Next.js App Router (v14) provides excellent LCP and CLS. Ensure images (like the Webflow CDN logo) use proper width/height attributes or the Next `next/image` component in future refactors.
*   **Sitemap:** Ensure `/sitemap.xml` dynamically includes all newly generated city pages and is submitted to Google Search Console.
*   **Robots.txt:** Verify that `/admin` and `/api` routes remain disallowed.

## 6. Monitoring & KPIs
*   **Google Search Console:** Monitor "Coverage" for the `/cities/*` routes to ensure full indexation.
*   **Google Analytics 4:** Track conversion rates specifically originating from `/cities/[slug]` landing pages vs. the homepage. 
*   **Keyword Tracking:** Track rankings for "[City] ice cream truck rental" for the top 10 target cities.
