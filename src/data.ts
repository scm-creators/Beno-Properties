/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Property, Agent, BlogArticle } from "./types";

export const GAUTENG_SUBURBS = [
  "Sandton",
  "Rosebank",
  "Houghton Estate",
  "Midrand",
  "Centurion",
  "Pretoria East",
  "Randburg",
  "Fourways",
  "Morningside",
  "Waterkloof",
  "Bedfordview",
  "Hyde Park",
  "Bryanston",
  "Centurion Golf Estate",
  "Woodmead",
  "Garsfontein",
  "Magaliesburg"
];

export const INITIAL_AGENTS: Agent[] = [
  {
    id: "BENO-AGT-1",
    name: "David Beno",
    title: "Principal Agent & Founder",
    phone: "+27 (0) 82 555 0192",
    email: "david@benoproperties.co.za",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    specialization: ["Luxury Sales", "Estate Portfolios", "Investment Advisory"],
    bio: "With over 15 years of premium real estate experience in Gauteng, David founded Beno Properties to deliver bespoke property match-making and seamless transaction advisory services to discerning buyers and landlords."
  },
  {
    id: "BENO-AGT-2",
    name: "Lungile Khumalo",
    title: "Senior Residential Specialist",
    phone: "+27 (0) 73 555 0284",
    email: "lungile@benoproperties.co.za",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    specialization: ["Gauteng North Sales", "Family Townhouses", "New Developments"],
    bio: "Lungile is passionate about matching families with their dream homes. Known for her in-depth knowledge of Centurion, Midrand, and Pretoria East markets, she ensures a stress-free transition for every home buyer."
  },
  {
    id: "BENO-AGT-3",
    name: "Zama Ndlovu",
    title: "Executive Rentals Manager",
    phone: "+27 (0) 84 555 0739",
    email: "zama@benoproperties.co.za",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    specialization: ["Corporate Rentals", "Tenant Vetting", "Apartments Portfolio"],
    bio: "Zama leads the Beno Rentals team. She specializes in secure corporate rentals, luxury apartments in Sandton and Rosebank, and maintaining a high occupancy rate with fully vetted long-term tenants."
  },
  {
    id: "BENO-AGT-4",
    name: "Pieter Botha",
    title: "Commercial & Industrial Director",
    phone: "+27 (0) 81 555 0413",
    email: "pieter@benoproperties.co.za",
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    specialization: ["Commercial Offices", "Industrial Warehouses", "Agricultural Land"],
    bio: "Pieter oversees our non-residential sector. From negotiating commercial leases in Sandton CBD to brokering industrial warehouse developments in Midrand, Pieter's analytical approach drives great returns for investors."
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: "BENO-1024",
    title: "Ultra-Modern 5 Bedroom Architectural Masterpiece",
    description: "Located in the heart of Sandton's most secure enclave, this architectural marvel boasts an open-plan design with floor-to-ceiling glass, a state-of-the-art cinema room, a heated infinity pool, expansive covered patios, automated smart home automation, and an independent 2-bedroom staff flatlet. Perfect for executive living and world-class entertaining.",
    type: "House",
    status: "For Sale",
    price: 14500000, // R14.5 Million
    location: "Sandton",
    city: "Johannesburg",
    province: "Gauteng",
    bedrooms: 5,
    bathrooms: 5.5,
    parkingSpaces: 4,
    sizeSqM: 680,
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    agentId: "BENO-AGT-1",
    createdAt: "2026-06-15T10:00:00-07:00"
  },
  {
    id: "BENO-1025",
    title: "Sophisticated 2 Bedroom Penthouse with Panoramic Views",
    description: "Experience lock-up-and-go luxury in this Rosebank penthouse. Featuring world-class Gaggenau kitchen appliances, direct elevator access, a private rooftop deck with a splash pool, and 360-degree views of the Johannesburg green canopy. Walk to Rosebank Mall and Gautrain Station.",
    type: "Apartment",
    status: "For Sale",
    price: 5250000, // R5.25 Million
    location: "Rosebank",
    city: "Johannesburg",
    province: "Gauteng",
    bedrooms: 2,
    bathrooms: 2,
    parkingSpaces: 2,
    sizeSqM: 145,
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    agentId: "BENO-AGT-3",
    createdAt: "2026-06-20T12:30:00-07:00",
    purchase_date: "2024-07-21" // Anniversary in 7 days!
  },
  {
    id: "BENO-1026",
    title: "Charming 3 Bedroom Family Townhouse in Secure Estate",
    description: "This modern townhouse offers a spacious lounge leading out to a beautifully manicured private garden. Situated in a highly sought-after secure family estate in Midrand with 24-hour physical patrolling, a clubhouse, communal swimming pool, and dedicated kids' playground. Solar backup inverter installed.",
    type: "Townhouse",
    status: "To Rent",
    price: 18500, // R18,500 per month
    location: "Midrand",
    city: "Midrand",
    province: "Gauteng",
    bedrooms: 3,
    bathrooms: 2.5,
    parkingSpaces: 2,
    sizeSqM: 195,
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    agentId: "BENO-AGT-2",
    createdAt: "2026-06-25T14:15:00-07:00",
    lease_start_date: "2025-08-15",
    lease_end_date: "2026-08-13" // Expiring in 30 days!
  },
  {
    id: "BENO-1027",
    title: "Elegant 4 Bedroom Double-Storey Suburban Home",
    description: "A gorgeous family home in Pretoria East's tree-lined streets. This property features 3 large reception rooms, a classic country-style kitchen, study, swimming pool, and a massive borehole-watered garden. Within walking distance to top-rated schools and upmarket shopping hubs.",
    type: "House",
    status: "To Rent",
    price: 32000, // R32,000 per month
    location: "Pretoria East",
    city: "Pretoria",
    province: "Gauteng",
    bedrooms: 4,
    bathrooms: 3,
    parkingSpaces: 3,
    sizeSqM: 380,
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    agentId: "BENO-AGT-2",
    createdAt: "2026-06-28T09:45:00-07:00"
  },
  {
    id: "BENO-1028",
    title: "Premium A-Grade Corporate Office Suite",
    description: "An exceptional corporate address in Sandton CBD. This 450 sqm suite is fully partitioned with luxury boardrooms, individual executive offices, an open-plan workspace, and a private kitchenette. Features absolute backup power, backup water, and secure underground basement parking bays.",
    type: "Commercial",
    status: "To Rent",
    price: 88000, // R88,000 per month
    location: "Sandton",
    city: "Johannesburg",
    province: "Gauteng",
    bedrooms: undefined,
    bathrooms: 3,
    parkingSpaces: 12,
    sizeSqM: 450,
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    agentId: "BENO-AGT-4",
    createdAt: "2026-07-01T11:00:00-07:00"
  },
  {
    id: "BENO-1029",
    title: "High-Volume Logistics Warehouse with Superlink Access",
    description: "A premium industrial warehouse in Midrand's logistics corridor. Boasts an impressive 10m height to eaves, fully integrated sprinkler system, multiple dock levelers, 3-phase power supply (250 Amps), secure guardhouse with 24-hour biometric control, and an expansive concrete yard for superlink truck maneuvers.",
    type: "Industrial",
    status: "For Sale",
    price: 24500000, // R24.5 Million
    location: "Midrand",
    city: "Midrand",
    province: "Gauteng",
    bedrooms: undefined,
    bathrooms: 4,
    parkingSpaces: 20,
    sizeSqM: 1850,
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    agentId: "BENO-AGT-4",
    createdAt: "2026-07-02T15:30:00-07:00"
  },
  {
    id: "BENO-1030",
    title: "Prime Development Land in Residential Hub",
    description: "A massive 2.1-hectare vacant stand zoned for high-density residential development (Residential 3). Located in a rapidly growing precinct of Centurion with water, electricity, and sewage connection permissions already approved. High investment yields expected.",
    type: "Vacant Land",
    status: "For Sale",
    price: 8900000, // R8.9 Million
    location: "Centurion",
    city: "Centurion",
    province: "Gauteng",
    bedrooms: undefined,
    bathrooms: undefined,
    parkingSpaces: undefined,
    sizeSqM: 21000,
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    agentId: "BENO-AGT-1",
    createdAt: "2026-07-03T16:00:00-07:00"
  },
  {
    id: "BENO-1031",
    title: "Spectacular Agricultural Smallholding with Guest Lodge Potentials",
    description: "This unique 12-hectare agricultural farm in Magaliesburg features an elegant primary residence, 3 income-generating cottages, a complete horse stable, chicken runs, and direct river frontage. Fully electric-fenced boundaries, robust solar backup system, and high-yield crop lands.",
    type: "Farm",
    status: "For Sale",
    price: 6850000, // R6.85 Million
    location: "Magaliesburg",
    city: "Magaliesburg",
    province: "Gauteng",
    bedrooms: 6,
    bathrooms: 5,
    parkingSpaces: 6,
    sizeSqM: 120000,
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    agentId: "BENO-AGT-1",
    createdAt: "2026-07-04T08:15:00-07:00"
  }
];

export const INITIAL_BLOGS: BlogArticle[] = [
  {
    id: "BENO-BLOG-1",
    title: "Parenthood & Housing Needs: When is it Time to Upsize?",
    summary: "As your family expands, your housing needs transform. We explore when to move from a lock-up-and-go apartment to a suburban house.",
    content: "Welcoming a new member into the family is one of life's most beautiful milestones, but it also quickly highlights the limitations of your current living space. A chic 2-bedroom Rosebank penthouse, while perfect for dynamic young couples, can feel cramped once a crib, diaper stations, and endless toy chests move in.\n\n### 1. The Red Flags of Space Constraints\n- **No separate work vs play zones**: If your living room floor has permanently become an obstacle course of baby gyms and play mats, it's a sign.\n- **The second bathroom squeeze**: Sharing a single bathroom with a toddler and morning corporate schedules creates unnecessary friction.\n- **Storage deficit**: When baby gear overflows into main hallways, larger wardrobes and linen closets are urgently needed.\n\n### 2. Surburban Enclaves vs. Inner-City Densities\nSuburbs like Pretoria East, Bryanston, and Midrand are highly popular for growing families. They offer spacious yards, tree-lined streets, and access to top-tier schools. In contrast, inner-city apartments lack private gardens which are essential for active children and family pets.\n\n### 3. Practical Steps to Upsizing Successfully\nWhen planning your next family home transition:\n- **Look for safety**: Gated security estates (like those in Centurion) provide unmatched peace of mind.\n- **Choose a flexible layout**: A bedroom that can convert from a nursery to a teen study to an office later is invaluable.\n- **Map school commutes**: Select properties that keep your daily school-run within a 15-minute radius.\n\nAt Beno Properties, we specialize in navigating families through these exciting transition phases. Speak to our residential agents today to view secure family properties in Gauteng.",
    category: "Housing Tips",
    imageUrl: "https://images.unsplash.com/photo-1511180598587-b2bc095fc644?auto=format&fit=crop&w=800&q=80",
    publishedDate: "2026-06-10",
    readTime: "4 min read"
  },
  {
    id: "BENO-BLOG-2",
    title: "South African Property Trends: What to Expect in Late 2026",
    summary: "An analytical breakdown of interest rates, solar investment tax incentives, and hot high-yield suburbs in Gauteng.",
    content: "The South African real estate landscape continues to demonstrate remarkable resilience as we navigate late 2026. Buyers, sellers, and landlords alike are encountering a market shaped by green energy adaptations and a shifting interest rate cycle.\n\n### 1. The Rise of 'Off-Grid' Premium Listings\nLoad shedding may be stabilized, but energy security remains a critical selling point. Homes equipped with pre-installed solar systems, hybrid inverters, and borehole water access command a 10% to 15% pricing premium. Buyers are actively avoiding the capital outlay of installing their own systems, preferring to bundle these green assets into their primary home loan.\n\n### 2. Gauteng's Semi-Grigration Nodes\nWhile coastal semi-grigration to the Western Cape remains popular, we are observing a counter-trend: professional 're-shoring' to Gauteng's economic core. Sandton, Rosebank, and Midrand are seeing an influx of young professionals who require physical access to corporate headquarters but demand secure estate living.\n\n### 3. Investment Hotspots to Watch\n- **Midrand & Centurion**: High rental demand for multi-bedroom townhouses from mid-management corporate executives.\n- **Pretoria East**: Ongoing stable capital appreciation due to concentrated private school developments and luxury lifestyle estates.\n\nSellers looking to capitalize on these trends should contact David Beno for a complimentary, data-driven market valuation.",
    category: "Market Trends",
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
    publishedDate: "2026-06-28",
    readTime: "5 min read"
  },
  {
    id: "BENO-BLOG-3",
    title: "A Landlord's Guide to Tenant Vetting and Rent Protection",
    summary: "Protect your real estate investment assets. Learn our proven tenant vetting procedures to secure high-yield, low-risk occupants.",
    content: "Securing a premium tenant is the cornerstone of successful property investing. A tenant who respects your property, pays on time, and communicates transparently is worth their weight in gold.\n\n### 1. The Tri-Layer Vetting Formula\nAt Beno Properties, we protect our landlords using a rigorous vetting process:\n- **Credit Bureau Deep-Dive**: We scrutinize payment behaviors, existing debts, judgements, and default notices. We look for a consistent history of honoring credit agreements.\n- **Affordability Assessment**: A golden rule is that monthly rental should not exceed 30% of the tenant's gross monthly income. We verify this via three months of certified bank statements and salary slips.\n- **Prior Landlord References**: Speaking directly to previous rental managers provides critical, unvarnished insight into the tenant's day-to-day property care and lease compliance.\n\n### 2. Draft a Bulletproof Lease Agreement\nEnsure your lease agreement explicitly covers maintenance responsibilities, solar system care, municipal utility billing procedures, and strict penalty clauses for overdue rent. Standardized, professionally drafted documents protect both parties.\n\n### 3. Security Deposits & Escrow Accounts\nNever hand over keys without securing a minimum of 1.5 to 2 months' rental deposit. This deposit must be held in an interest-bearing escrow account, with interest accruing to the tenant upon successful, undamaged handover at lease expiry.\n\nWant to hand over the stress of property management? Zama Ndlovu's Rentals team is ready to fully manage your property portfolio.",
    category: "Property Management",
    imageUrl: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=800&q=80",
    publishedDate: "2026-07-03",
    readTime: "6 min read"
  }
];
