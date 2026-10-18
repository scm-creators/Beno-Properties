/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Property, Agent, BlogArticle, ClientInvitation, Appointment } from "./types";

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
    bio: "With over 15 years of premium real estate experience in Gauteng, David founded Beno Properties to deliver bespoke property match-making and seamless transaction advisory services to discerning buyers and landlords.",
    approvalStatus: "approved"
  },
  {
    id: "BENO-AGT-2",
    name: "Lungile Khumalo",
    title: "Senior Residential Specialist",
    phone: "+27 (0) 73 555 0284",
    email: "lungile@benoproperties.co.za",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    specialization: ["Gauteng North Sales", "Family Townhouses", "New Developments"],
    bio: "Lungile is passionate about matching families with their dream homes. Known for her in-depth knowledge of Centurion, Midrand, and Pretoria East markets, she ensures a stress-free transition for every home buyer.",
    approvalStatus: "approved"
  },
  {
    id: "BENO-AGT-3",
    name: "Zama Ndlovu",
    title: "Executive Rentals Manager",
    phone: "+27 (0) 84 555 0739",
    email: "zama@benoproperties.co.za",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    specialization: ["Corporate Rentals", "Tenant Vetting", "Apartments Portfolio"],
    bio: "Zama leads the Beno Rentals team. She specializes in secure corporate rentals, luxury apartments in Sandton and Rosebank, and maintaining a high occupancy rate with fully vetted long-term tenants.",
    approvalStatus: "approved"
  },
  {
    id: "BENO-AGT-4",
    name: "Pieter Botha",
    title: "Commercial & Industrial Director",
    phone: "+27 (0) 81 555 0413",
    email: "pieter@benoproperties.co.za",
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    specialization: ["Commercial Offices", "Industrial Warehouses", "Agricultural Land"],
    bio: "Pieter oversees our non-residential sector. From negotiating commercial leases in Sandton CBD to brokering industrial warehouse developments in Midrand, Pieter's analytical approach drives great returns for investors.",
    approvalStatus: "approved"
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

export const INITIAL_CLIENT_INVITATIONS: ClientInvitation[] = [
  {
    id: "INV-101",
    clientName: "Dr. Sipho Mthembu",
    clientEmail: "sipho.mthembu@medi-clinic.co.za",
    clientPhone: "+27 82 491 8832",
    category: "Buyer",
    invitedByAgentId: "BENO-AGT-1",
    invitedByAgentName: "David Beno",
    propertyRefId: "BENO-1024",
    propertyTitle: "Ultra-Modern 5 Bedroom Architectural Masterpiece",
    inviteLink: "https://benoproperties.co.za/invite?ref=INV-101&token=vip-98214a",
    status: "Accepted",
    sentAt: "2026-08-10T09:30:00-07:00",
    acceptedAt: "2026-08-11T14:15:00-07:00",
    customMessage: "Dear Dr. Mthembu, welcome to your private Beno VIP Portal. Please review our Sandton executive portfolio at your convenience.",
    notes: "High-net-worth medical practitioner looking for a secure Sandton luxury residence."
  },
  {
    id: "INV-102",
    clientName: "Eleanor & Mark Sterling",
    clientEmail: "eleanor.sterling@globalholdings.com",
    clientPhone: "+27 83 221 4455",
    category: "Investor",
    invitedByAgentId: "BENO-AGT-4",
    invitedByAgentName: "Pieter Botha",
    propertyRefId: "BENO-1030",
    propertyTitle: "Prime Development Land in Residential Hub",
    inviteLink: "https://benoproperties.co.za/invite?ref=INV-102&token=vip-33719c",
    status: "Accepted",
    sentAt: "2026-08-12T11:00:00-07:00",
    acceptedAt: "2026-08-13T08:45:00-07:00",
    customMessage: "Hi Mark, sending you the invitation link to track our Centurion commercial and multi-unit developments.",
    notes: "Exploring 2-hectare development stand in Centurion."
  },
  {
    id: "INV-103",
    clientName: "Kgomotso Dlamini",
    clientEmail: "kgomotso.d@standardbank.co.za",
    clientPhone: "+27 71 902 3341",
    category: "Tenant",
    invitedByAgentId: "BENO-AGT-3",
    invitedByAgentName: "Zama Ndlovu",
    propertyRefId: "BENO-1026",
    propertyTitle: "Charming 3 Bedroom Family Townhouse in Secure Estate",
    inviteLink: "https://benoproperties.co.za/invite?ref=INV-103&token=vip-11928e",
    status: "Sent",
    sentAt: "2026-08-15T15:20:00-07:00",
    customMessage: "Hi Kgomotso, please access our secure tenant vetting and digital lease portal using this priority link.",
    notes: "Corporate executive seeking 12-month lease in Midrand."
  },
  {
    id: "INV-104",
    clientName: "Heinrich Venter",
    clientEmail: "heinrich@venter-associates.co.za",
    clientPhone: "+27 84 330 9102",
    category: "Seller",
    invitedByAgentId: "BENO-AGT-2",
    invitedByAgentName: "Lungile Khumalo",
    inviteLink: "https://benoproperties.co.za/invite?ref=INV-104&token=vip-44012f",
    status: "Opened",
    sentAt: "2026-08-14T10:00:00-07:00",
    customMessage: "Dear Heinrich, here is your exclusive valuation tracking dashboard for your Pretoria East estate.",
    notes: "Interested in listing a 4-bedroom home in Waterkloof."
  },
  {
    id: "INV-105",
    clientName: "Naledi Molefe",
    clientEmail: "naledi.molefe@discovery.co.za",
    clientPhone: "+27 72 884 1900",
    category: "Buyer",
    invitedByAgentId: "BENO-AGT-2",
    invitedByAgentName: "Lungile Khumalo",
    propertyRefId: "BENO-1027",
    propertyTitle: "Exclusive 4 Bedroom Estate Villa with Golf Course Access",
    inviteLink: "https://benoproperties.co.za/invite?ref=INV-105&token=vip-66291b",
    status: "Accepted",
    sentAt: "2026-07-20T14:00:00-07:00",
    acceptedAt: "2026-07-21T09:10:00-07:00",
    customMessage: "Hi Naledi, welcome to Beno Properties VIP client circle.",
    notes: "Looking for Centurion Golf Estate properties."
  },
  {
    id: "INV-106",
    clientName: "Carlos Santana",
    clientEmail: "carlos.santana@braziloil.com",
    clientPhone: "+27 81 776 2309",
    category: "Tenant",
    invitedByAgentId: "BENO-AGT-3",
    invitedByAgentName: "Zama Ndlovu",
    propertyRefId: "BENO-1025",
    propertyTitle: "Sophisticated 2 Bedroom Penthouse with Panoramic Views",
    inviteLink: "https://benoproperties.co.za/invite?ref=INV-106&token=vip-77123d",
    status: "Accepted",
    sentAt: "2026-07-05T10:30:00-07:00",
    acceptedAt: "2026-07-06T11:45:00-07:00",
    customMessage: "Welcome Carlos! View your rental application and Rosebank penthouse booking details.",
    notes: "Expat corporate rental candidate."
  },
  {
    id: "INV-107",
    clientName: "Annelize de Jager",
    clientEmail: "annelize@dejager-law.co.za",
    clientPhone: "+27 82 990 1234",
    category: "Seller",
    invitedByAgentId: "BENO-AGT-1",
    invitedByAgentName: "David Beno",
    inviteLink: "https://benoproperties.co.za/invite?ref=INV-107&token=vip-88231e",
    status: "Accepted",
    sentAt: "2026-06-18T16:00:00-07:00",
    acceptedAt: "2026-06-19T09:00:00-07:00",
    customMessage: "Hi Annelize, let's track the marketing and buyer feedback for your Houghton residence.",
    notes: "Mandate signed for Houghton luxury home."
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "APT-101",
    title: "Exclusive Private Viewing: Sandton Masterpiece",
    type: "Property Viewing",
    clientName: "Dr. Sipho Mthembu",
    clientEmail: "sipho.mthembu@medi-clinic.co.za",
    clientPhone: "+27 82 491 8832",
    agentId: "BENO-AGT-1",
    agentName: "David Beno",
    propertyId: "BENO-1024",
    propertyTitle: "Ultra-Modern 5 Bedroom Architectural Masterpiece",
    propertyLocation: "Sandton",
    location: "14 Rivonia Ridge, Sandton Enclave",
    isVirtual: false,
    dateTime: "2026-08-18T14:30:00-07:00",
    durationMinutes: 60,
    status: "Confirmed",
    estimatedDealValue: 14500000,
    notes: "Client requested security escort protocol at main gate. Focus on cinema room and solar backup system.",
    reminderSent: true,
    createdAt: "2026-08-11T14:30:00-07:00"
  },
  {
    id: "APT-102",
    title: "On-Site Townhouse Walkthrough & Snag Inspection",
    type: "Property Viewing",
    clientName: "Kgomotso Dlamini",
    clientEmail: "kgomotso.d@standardbank.co.za",
    clientPhone: "+27 71 902 3341",
    agentId: "BENO-AGT-3",
    agentName: "Zama Ndlovu",
    propertyId: "BENO-1026",
    propertyTitle: "Charming 3 Bedroom Family Townhouse in Secure Estate",
    propertyLocation: "Midrand",
    location: "Unit 24, Blue Valley Grove, Midrand",
    isVirtual: false,
    dateTime: "2026-08-19T10:00:00-07:00",
    durationMinutes: 45,
    status: "Scheduled",
    estimatedDealValue: 222000, // 12-month lease value
    notes: "Client reviewing proximity to Midrand Gautrain feeder bus route.",
    reminderSent: false,
    createdAt: "2026-08-15T15:30:00-07:00"
  },
  {
    id: "APT-103",
    title: "Centurion Development Stand Strategic Review",
    type: "Valuation Consultation",
    clientName: "Mark Sterling",
    clientEmail: "eleanor.sterling@globalholdings.com",
    clientPhone: "+27 83 221 4455",
    agentId: "BENO-AGT-4",
    agentName: "Pieter Botha",
    propertyId: "BENO-1030",
    propertyTitle: "Prime Development Land in Residential Hub",
    propertyLocation: "Centurion",
    location: "Stand 402, Southdowns Industrial & Development Node, Centurion",
    isVirtual: false,
    dateTime: "2026-08-20T11:30:00-07:00",
    durationMinutes: 90,
    status: "Confirmed",
    estimatedDealValue: 8900000,
    notes: "Review civil engineering survey and municipal bulk service capacity agreements.",
    reminderSent: true,
    createdAt: "2026-08-13T09:00:00-07:00"
  },
  {
    id: "APT-104",
    title: "Virtual 3D Video Tour: Rosebank Penthouse",
    type: "Virtual Tour",
    clientName: "Carlos Santana",
    clientEmail: "carlos.santana@braziloil.com",
    clientPhone: "+27 81 776 2309",
    agentId: "BENO-AGT-3",
    agentName: "Zama Ndlovu",
    propertyId: "BENO-1025",
    propertyTitle: "Sophisticated 2 Bedroom Penthouse with Panoramic Views",
    propertyLocation: "Rosebank",
    location: "Google Meet Virtual Room",
    isVirtual: true,
    virtualMeetingUrl: "https://meet.google.com/beno-rosebank-penthouse",
    dateTime: "2026-08-17T16:00:00-07:00",
    durationMinutes: 45,
    status: "Confirmed",
    estimatedDealValue: 5250000,
    notes: "Expat client connecting from Luanda. Presenting rooftop terrace and Gaggenau kitchen.",
    reminderSent: true,
    createdAt: "2026-08-12T10:00:00-07:00"
  },
  {
    id: "APT-105",
    title: "Waterkloof Mansion Listing & Valuation Consultation",
    type: "Valuation Consultation",
    clientName: "Jennifer van Wyk",
    clientEmail: "jennifer.vw@mweb.co.za",
    clientPhone: "082 555 2468",
    agentId: "BENO-AGT-1",
    agentName: "David Beno",
    location: "77 Edward St, Waterkloof, Pretoria",
    isVirtual: false,
    dateTime: "2026-08-14T11:00:00-07:00",
    durationMinutes: 60,
    status: "Completed",
    outcome: "Offer Submitted",
    estimatedDealValue: 12500000,
    notes: "Completed comparative market analysis (CMA) presentation.",
    outcomeNotes: "Seller accepted exclusive mandate proposal at R12.5M. Photography scheduled.",
    reminderSent: true,
    createdAt: "2026-08-08T09:00:00-07:00"
  },
  {
    id: "APT-106",
    title: "Centurion Golf Estate Villa Site Viewing",
    type: "Property Viewing",
    clientName: "Naledi Molefe",
    clientEmail: "naledi.molefe@discovery.co.za",
    clientPhone: "+27 72 884 1900",
    agentId: "BENO-AGT-2",
    agentName: "Lungile Khumalo",
    propertyId: "BENO-1027",
    propertyTitle: "Exclusive 4 Bedroom Estate Villa with Golf Course Access",
    propertyLocation: "Centurion Golf Estate",
    location: "Fairway Boulevard 12, Centurion Golf Estate",
    isVirtual: false,
    dateTime: "2026-08-06T15:00:00-07:00",
    durationMinutes: 60,
    status: "Completed",
    outcome: "Pending Decision",
    estimatedDealValue: 6950000,
    notes: "Family tour with children to check estate park and squash courts.",
    outcomeNotes: "Client loves the golf course view. Awaiting pre-approval certificate from bond originator.",
    reminderSent: true,
    createdAt: "2026-07-28T11:30:00-07:00"
  },
  {
    id: "APT-107",
    title: "Commercial Office Park Lease Signing",
    type: "Contract & Lease Signing",
    clientName: "Pieter de Villiers",
    clientEmail: "pieter@devilliers-tech.com",
    clientPhone: "+27 82 301 9922",
    agentId: "BENO-AGT-4",
    agentName: "Pieter Botha",
    propertyId: "BENO-1029",
    propertyTitle: "Prime AAA-Grade Commercial Office Park",
    propertyLocation: "Sandton",
    location: "Beno Properties Sandton Head Office, 150 West Street",
    isVirtual: false,
    dateTime: "2026-07-24T10:00:00-07:00",
    durationMinutes: 60,
    status: "Completed",
    outcome: "Successfully Closed",
    estimatedDealValue: 2940000,
    notes: "Finalization of 3-year commercial tenant agreement.",
    outcomeNotes: "Deposit receipted and keys handed over. Tenant fit-out begins Aug 1.",
    reminderSent: true,
    createdAt: "2026-07-15T09:00:00-07:00"
  },
  {
    id: "APT-108",
    title: "Magaliesburg Farm Smallholding Tour",
    type: "Property Viewing",
    clientName: "Johan & Lizelle Marais",
    clientEmail: "johan.marais@agrisouth.co.za",
    clientPhone: "+27 83 119 4001",
    agentId: "BENO-AGT-1",
    agentName: "David Beno",
    propertyId: "BENO-1031",
    propertyTitle: "Spectacular Agricultural Smallholding with Guest Lodge Potentials",
    propertyLocation: "Magaliesburg",
    location: "Farm Rusticana, R560 Magaliesburg Valley",
    isVirtual: false,
    dateTime: "2026-07-18T09:30:00-07:00",
    durationMinutes: 120,
    status: "Completed",
    outcome: "Follow-up Required",
    estimatedDealValue: 6850000,
    notes: "Inspection of water rights certificate and solar borehole capacity.",
    outcomeNotes: "Clients requesting geotechnical soil sample report before submitting formal offer.",
    reminderSent: true,
    createdAt: "2026-07-10T14:00:00-07:00"
  },
  {
    id: "APT-109",
    title: "Rosebank Executive Penthouse Physical Inspection",
    type: "Property Viewing",
    clientName: "Thabo Nkosi",
    clientEmail: "thabo.nkosi@gmail.com",
    clientPhone: "083 555 9876",
    agentId: "BENO-AGT-3",
    agentName: "Zama Ndlovu",
    propertyId: "BENO-1025",
    propertyTitle: "Sophisticated 2 Bedroom Penthouse with Panoramic Views",
    propertyLocation: "Rosebank",
    location: "Oxford Road Penthouse Suites, Rosebank",
    isVirtual: false,
    dateTime: "2026-07-11T14:00:00-07:00",
    durationMinutes: 45,
    status: "Completed",
    outcome: "Offer Submitted",
    estimatedDealValue: 5250000,
    notes: "Buyer looking for lock-up-and-go Gautrain commuter base.",
    outcomeNotes: "Submitted offer of R5.1M, counter-negotiated to R5.2M.",
    reminderSent: true,
    createdAt: "2026-07-06T10:00:00-07:00"
  },
  {
    id: "APT-110",
    title: "Houghton Luxury Residence Valuation & Photography Brief",
    type: "Valuation Consultation",
    clientName: "Annelize de Jager",
    clientEmail: "annelize@dejager-law.co.za",
    clientPhone: "+27 82 990 1234",
    agentId: "BENO-AGT-1",
    agentName: "David Beno",
    location: "12 4th Avenue, Houghton Estate",
    isVirtual: false,
    dateTime: "2026-06-22T11:00:00-07:00",
    durationMinutes: 90,
    status: "Completed",
    outcome: "Successfully Closed",
    estimatedDealValue: 18000000,
    notes: "Sole mandate agreement presentation and drone architectural videography.",
    outcomeNotes: "Sole mandate secured for 180 days.",
    reminderSent: true,
    createdAt: "2026-06-15T10:00:00-07:00"
  },
  {
    id: "APT-111",
    title: "Pretoria East Family House Viewing",
    type: "Property Viewing",
    clientName: "Nadia Fourie",
    clientEmail: "nadia.fourie@vodamail.co.za",
    clientPhone: "+27 82 771 9900",
    agentId: "BENO-AGT-2",
    agentName: "Lungile Khumalo",
    location: "Garsfontein Family Enclave, Pretoria East",
    isVirtual: false,
    dateTime: "2026-06-14T14:00:00-07:00",
    durationMinutes: 60,
    status: "Completed",
    outcome: "Offer Submitted",
    estimatedDealValue: 3400000,
    notes: "Proximity to Afrikaans Hoër Meisieskool and primary schools.",
    outcomeNotes: "Offer accepted by seller.",
    reminderSent: true,
    createdAt: "2026-06-08T11:00:00-07:00"
  }
];

export const DEFAULT_EMAIL_TEMPLATES: import("./types").EmailTemplate[] = [
  {
    id: "TMPL-1",
    title: "Viewing Confirmation & Details",
    description: "Send immediately after booking a private on-site inspection or open house viewing.",
    category: "Viewing",
    subject: "Viewing Confirmation: {property_name} with Beno Properties",
    body: `Dear {client_name},

Thank you for your inquiry regarding {property_name} ({property_ref}).

We have scheduled your private property viewing as follows:
• Property: {property_name}
• Location: {property_location}
• Asking Price: {property_price}
• Scheduled Date & Time: {viewing_time}
• Dedicated Agent: {agent_name} ({agent_phone})

Please ensure you have your South African ID or passport handy for estate security gate pre-clearance if applicable.

If you need turn-by-turn directions or need to adjust your arrival time, please call or WhatsApp me directly at {agent_phone}.

We look forward to introducing you to this exceptional space!

Warm regards,
{agent_name}
Beno Properties
{office_address}
Email: {agent_email} | Cell: {agent_phone}`,
    placeholders: [
      "{client_name}",
      "{property_name}",
      "{property_ref}",
      "{property_location}",
      "{property_price}",
      "{viewing_time}",
      "{agent_name}",
      "{agent_phone}",
      "{agent_email}",
      "{office_address}"
    ],
    isDefault: true,
    createdAt: "2026-01-15T08:00:00Z"
  },
  {
    id: "TMPL-2",
    title: "Inquiry Follow-up & Portfolio Pack",
    description: "First response to portal or website inquiries with specs and qualification questions.",
    category: "Inquiry Follow-up",
    subject: "Inquiry Regarding {property_name} | Beno Properties",
    body: `Hi {client_name},

Thank you for reaching out to Beno Properties regarding {property_name} in {property_location}.

This property ({property_ref}) listed at {property_price} has attracted strong interest due to its prime position and high-standard finishes.

To help me best assist you with your property journey:
1. Are you looking to acquire with bond pre-approval or as a cash transaction?
2. What times suit you best this week for a 30-minute private walk-through?
3. Would you like to review similar off-market or upcoming listings in {property_location}?

Please let me know, and I will be delighted to coordinate a viewing at your convenience.

Best regards,
{agent_name}
Real Estate Specialist | Beno Properties
Direct: {agent_phone} | {agent_email}
Office: {office_address}`,
    placeholders: [
      "{client_name}",
      "{property_name}",
      "{property_ref}",
      "{property_location}",
      "{property_price}",
      "{agent_name}",
      "{agent_phone}",
      "{agent_email}",
      "{office_address}"
    ],
    isDefault: true,
    createdAt: "2026-01-15T08:00:00Z"
  },
  {
    id: "TMPL-3",
    title: "Price Reduction & High-Demand Alert",
    description: "Notify interested buyers/investors when a property receives a price improvement.",
    category: "Price Alert",
    subject: "Price Improvement Opportunity: {property_name} ({property_price})",
    body: `Dear {client_name},

I wanted to share an exclusive update regarding {property_name} ({property_ref}) in {property_location}.

The seller has adjusted the asking price to {property_price}, creating an exceptional equity opportunity in this high-demand Gauteng suburb.

Given your search preferences, this home represents one of the strongest value propositions currently available in {property_location}.

Would you like me to reserve a VIP viewing slot for you this Saturday or Sunday? Simply reply to this email or send a quick WhatsApp to {agent_phone}.

Sincerely,
{agent_name}
Beno Properties
Cell: {agent_phone} | {agent_email}`,
    placeholders: [
      "{client_name}",
      "{property_name}",
      "{property_ref}",
      "{property_location}",
      "{property_price}",
      "{agent_name}",
      "{agent_phone}",
      "{agent_email}"
    ],
    isDefault: true,
    createdAt: "2026-01-15T08:00:00Z"
  },
  {
    id: "TMPL-4",
    title: "Offer to Purchase (OTP) Draft & Next Steps",
    description: "Send formal OTP paperwork and FICA guidelines to a buyer ready to submit an offer.",
    category: "Offer & Closing",
    subject: "Offer to Purchase Documents: {property_name} - {client_name}",
    body: `Dear {client_name},

Congratulations on taking the exciting next step toward securing {property_name} in {property_location}!

Please find attached the official Offer to Purchase (OTP) draft prepared with an offered amount of {property_price}.

Key next steps for your review:
1. Please read through the suspensive conditions, purchase price breakdown, and standard 21-day bond application clause.
2. Initial the bottom of each page and sign Section 8 (Purchaser).
3. Provide your FICA documentation:
   • Clear copy of South African ID / Passport
   • Proof of Residential Address (utility bill or bank letter under 3 months old)
   • Marriage certificate / ANC contract if applicable

Our accredited bond origination partners are on standby to submit your application simultaneously to all major South African commercial banks at zero cost.

Please call me at {agent_phone} if you would like to discuss any clause before signing.

Warm regards,
{agent_name}
Principal / Senior Broker | Beno Properties
{office_address} | {agent_phone}`,
    placeholders: [
      "{client_name}",
      "{property_name}",
      "{property_location}",
      "{property_price}",
      "{agent_name}",
      "{agent_phone}",
      "{office_address}"
    ],
    isDefault: true,
    createdAt: "2026-01-15T08:00:00Z"
  },
  {
    id: "TMPL-5",
    title: "Tenant Vetting & Lease Pack",
    description: "Guide prospective tenants on required documents and credit check authorization.",
    category: "Tenant Vetting",
    subject: "Tenant Application & Verification: {property_name}",
    body: `Dear {client_name},

Thank you for selecting {property_name} in {property_location} (Rental: {property_price}/month) as your prospective new residence.

To proceed with TPN Credit Bureau screening and landlord authorization, please reply with the following required documents:
• Copy of South African ID Document or valid Passport & Work Permit
• 3 months' latest bank statements (stamped by your bank or downloaded with digital security seal)
• 3 months' latest payslips (or 6 months' management accounts if self-employed)
• Contact details of your previous landlord for reference verification

Upon receipt, we will expedite approval within 24 business hours and prepare the official lease contract.

Thank you,
{agent_name}
Rental Management Division | Beno Properties
Direct: {agent_phone} | {agent_email}`,
    placeholders: [
      "{client_name}",
      "{property_name}",
      "{property_location}",
      "{property_price}",
      "{agent_name}",
      "{agent_phone}",
      "{agent_email}"
    ],
    isDefault: true,
    createdAt: "2026-01-15T08:00:00Z"
  },
  {
    id: "TMPL-6",
    title: "Complimentary Valuation Consultation",
    description: "Follow up with homeowners looking to list or understand current market equity.",
    category: "Inquiry Follow-up",
    subject: "Complimentary Property Valuation: {property_location} with Beno Properties",
    body: `Dear {client_name},

Thank you for your inquiry regarding a professional property valuation for your property in {property_location}.

At Beno Properties, our Comparative Market Analysis (CMA) provides accurate, data-driven pricing intelligence including:
• Verified Deeds Office registrations and transfer records in your immediate neighbourhood
• Active competitor listings and price-per-square-metre benchmarks
• Current buyer and tenant inquiry velocity across Gauteng

I would be pleased to schedule a complimentary 30-minute valuation visit at your residence on your preferred day.

Please let me know when suits your schedule best.

Warm regards,
{agent_name}
Beno Properties
{office_address}
Phone: {agent_phone} | {agent_email}`,
    placeholders: [
      "{client_name}",
      "{property_location}",
      "{agent_name}",
      "{agent_phone}",
      "{agent_email}",
      "{office_address}"
    ],
    isDefault: true,
    createdAt: "2026-01-15T08:00:00Z"
  }
];

export const GAUTENG_SUBURB_DEMAND_DATA: import("./types").SuburbDemandData[] = [
  {
    id: "DEM-SANDTON",
    suburb: "Sandton Central & Morningside",
    region: "Sandton & Rivonia",
    inquiryCount: 384,
    viewingCount: 142,
    averageBudget: 4850000,
    demandScore: 96,
    intensityLevel: "Very High",
    topPropertyType: "Luxury Apartments & Penthouses",
    primaryPurpose: "Balanced",
    growthRatePct: 34,
    keyDemandDrivers: [
      "Gautrain rapid transit proximity",
      "Corporate finance & law headquarters",
      "24/7 security concierge living",
      "High executive rental yields"
    ],
    activePropertiesCount: 12,
    latitude: -26.1076,
    longitude: 28.0567,
    coordinates: { x: 390, y: 310 }
  },
  {
    id: "DEM-ROSEBANK",
    suburb: "Rosebank & Houghton Estate",
    region: "Johannesburg North",
    inquiryCount: 298,
    viewingCount: 118,
    averageBudget: 6200000,
    demandScore: 92,
    intensityLevel: "Very High",
    topPropertyType: "Heritage Mansions & Urban Lofts",
    primaryPurpose: "Buying",
    growthRatePct: 28,
    keyDemandDrivers: [
      "Walkable lifestyle & Oxford Parks precinct",
      "Top private schools (Roedean, St John's)",
      "High capital preservation resilience",
      "Solar & backup water microgrids"
    ],
    activePropertiesCount: 8,
    latitude: -26.1458,
    longitude: 28.0436,
    coordinates: { x: 380, y: 360 }
  },
  {
    id: "DEM-MIDRAND",
    suburb: "Midrand & Waterfall Estate",
    region: "Midrand & Centurion",
    inquiryCount: 342,
    viewingCount: 129,
    averageBudget: 3650000,
    demandScore: 94,
    intensityLevel: "Very High",
    topPropertyType: "Gated Eco-Estates & Townhouses",
    primaryPurpose: "Buying",
    growthRatePct: 41,
    keyDemandDrivers: [
      "Mall of Africa commercial growth corridor",
      "Comprehensive green lifestyle estates",
      "Midway positioning between Joburg & Pretoria",
      "Heavy young executive influx"
    ],
    activePropertiesCount: 15,
    latitude: -26.0028,
    longitude: 28.1256,
    coordinates: { x: 440, y: 220 }
  },
  {
    id: "DEM-BRYANSTON",
    suburb: "Bryanston & Riverclub",
    region: "Sandton & Rivonia",
    inquiryCount: 265,
    viewingCount: 96,
    averageBudget: 5400000,
    demandScore: 88,
    intensityLevel: "High",
    topPropertyType: "Modern Clusters & Large Stand Villas",
    primaryPurpose: "Buying",
    growthRatePct: 22,
    keyDemandDrivers: [
      "Substantial land plots with established gardens",
      "Brescia House & St Stithians school proximity",
      "Off-grid solar & inverter infrastructure",
      "High family tenure longevity"
    ],
    activePropertiesCount: 9,
    latitude: -26.0561,
    longitude: 28.0242,
    coordinates: { x: 350, y: 270 }
  },
  {
    id: "DEM-FOURWAYS",
    suburb: "Fourways & Lonehill",
    region: "Johannesburg North",
    inquiryCount: 234,
    viewingCount: 88,
    averageBudget: 2850000,
    demandScore: 84,
    intensityLevel: "High",
    topPropertyType: "Secure Townhouses & Cluster Homes",
    primaryPurpose: "Balanced",
    growthRatePct: 19,
    keyDemandDrivers: [
      "Family entertainment & shopping nodes",
      "Accessible entry-level luxury pricing",
      "Proven estate security records",
      "Consistent rental occupancy"
    ],
    activePropertiesCount: 11,
    latitude: -26.0185,
    longitude: 27.9984,
    coordinates: { x: 310, y: 230 }
  },
  {
    id: "DEM-CENTURION",
    suburb: "Centurion & Midstream Estate",
    region: "Midrand & Centurion",
    inquiryCount: 312,
    viewingCount: 115,
    averageBudget: 3450000,
    demandScore: 90,
    intensityLevel: "Very High",
    topPropertyType: "Estate Homes & Golf Villas",
    primaryPurpose: "Buying",
    growthRatePct: 36,
    keyDemandDrivers: [
      "Complete load-shedding free microgrid estates",
      "Hospitals, private schools within estate perimeter",
      "Rapid N1 / R21 highway accessibility",
      "High security safety ratings"
    ],
    activePropertiesCount: 14,
    latitude: -25.8603,
    longitude: 28.1894,
    coordinates: { x: 480, y: 150 }
  },
  {
    id: "DEM-PRETORIA-EAST",
    suburb: "Pretoria East & Waterkloof",
    region: "Pretoria & Tshwane",
    inquiryCount: 278,
    viewingCount: 104,
    averageBudget: 4200000,
    demandScore: 89,
    intensityLevel: "High",
    topPropertyType: "Diplomatic Residences & Estates",
    primaryPurpose: "Buying",
    growthRatePct: 25,
    keyDemandDrivers: [
      "Embassy & diplomatic leasing contracts",
      "Historic prestige and capital stability",
      "University of Pretoria & medical hubs",
      "Menlyn Maine green precinct expansion"
    ],
    activePropertiesCount: 10,
    latitude: -25.7831,
    longitude: 28.2526,
    coordinates: { x: 530, y: 100 }
  },
  {
    id: "DEM-MODDERFONTEIN",
    suburb: "Modderfontein & Foundershill",
    region: "East Rand",
    inquiryCount: 245,
    viewingCount: 92,
    averageBudget: 2650000,
    demandScore: 86,
    intensityLevel: "High",
    topPropertyType: "Modern Eco-Apartments & Townhouses",
    primaryPurpose: "Renting",
    growthRatePct: 31,
    keyDemandDrivers: [
      "Beno Properties headquarters node",
      "Modderfontein Nature Reserve trail access",
      "Close proximity to OR Tambo International Airport",
      "High tenant demand from logistics professionals"
    ],
    activePropertiesCount: 7,
    latitude: -26.0911,
    longitude: 28.1633,
    coordinates: { x: 470, y: 310 }
  },
  {
    id: "DEM-BEDFORDVIEW",
    suburb: "Bedfordview & Edenvale",
    region: "East Rand",
    inquiryCount: 215,
    viewingCount: 79,
    averageBudget: 3800000,
    demandScore: 82,
    intensityLevel: "High",
    topPropertyType: "Luxury Freehold & Secure Enclaves",
    primaryPurpose: "Buying",
    growthRatePct: 18,
    keyDemandDrivers: [
      "Convenient access to Johannesburg CBD and East Rand",
      "Top private schools (St Benedict's, St Andrew's)",
      "Boomed-off road enclaves",
      "Commercial business parks"
    ],
    activePropertiesCount: 6,
    latitude: -26.1783,
    longitude: 28.1408,
    coordinates: { x: 460, y: 380 }
  },
  {
    id: "DEM-SOWETO",
    suburb: "Soweto (Diepkloof & Protea Glen)",
    region: "West Rand & Soweto",
    inquiryCount: 189,
    viewingCount: 71,
    averageBudget: 1450000,
    demandScore: 78,
    intensityLevel: "Moderate",
    topPropertyType: "Freehold Residences & Starter Homes",
    primaryPurpose: "Buying",
    growthRatePct: 27,
    keyDemandDrivers: [
      "Rapidly appreciating emerging middle-class nodes",
      "High demand for newly developed gated pockets",
      "Strong community culture & retail expansions",
      "First-time home buyer FLISP subsidies"
    ],
    activePropertiesCount: 5,
    latitude: -26.2625,
    longitude: 27.8631,
    coordinates: { x: 250, y: 450 }
  },
  {
    id: "DEM-RANDBURG",
    suburb: "Randburg & Linden",
    region: "Johannesburg North",
    inquiryCount: 198,
    viewingCount: 75,
    averageBudget: 2400000,
    demandScore: 79,
    intensityLevel: "Moderate",
    topPropertyType: "Character Cottages & Townhouses",
    primaryPurpose: "Balanced",
    growthRatePct: 16,
    keyDemandDrivers: [
      "Artisan cafe culture & central proximity",
      "Affordable freehold family properties",
      "Media and broadcasting professional hub",
      "Linden school zoning popularity"
    ],
    activePropertiesCount: 8,
    latitude: -26.1284,
    longitude: 27.9942,
    coordinates: { x: 330, y: 350 }
  },
  {
    id: "DEM-HYDE-PARK",
    suburb: "Hyde Park & Craighall Park",
    region: "Johannesburg North",
    inquiryCount: 176,
    viewingCount: 68,
    averageBudget: 8500000,
    demandScore: 85,
    intensityLevel: "High",
    topPropertyType: "Ultra-Luxury Estates & Signature Mansions",
    primaryPurpose: "Buying",
    growthRatePct: 14,
    keyDemandDrivers: [
      "Ultra-exclusive status address",
      "High net worth individual (HNWI) security",
      "Hyde Park Corner bespoke shopping",
      "Long-term blue-chip capital stability"
    ],
    activePropertiesCount: 4,
    latitude: -26.1235,
    longitude: 28.0336,
    coordinates: { x: 365, y: 335 }
  }
];
