import { useState, useEffect } from "react";
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  SparklesIcon,
  StarIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

// Extended sample ideas with detailed problem statements from all domains
const sampleIdeas = [
  {
    _id: "1",
    title: "AI-Powered Code Review Assistant",
    summary: "AI-driven assistant for faster code reviews and error-free code reviews.",
    details: "Problem Statement:\nManual code reviews are slow, inconsistent, and error-prone, making it difficult to maintain quality and scalability in large teams. Developers spend hours reviewing code, missing critical bugs, and providing inconsistent feedback.\n\nExpected Solution:\nAn AI-driven assistant that analyzes code for bugs, vulnerabilities, and style issues while suggesting optimizations and ensuring compliance with best practices. Works with GitHub/GitLab to provide real-time inline feedback and learns from developer preferences over time.\n\nTechnologies Used:\nLLMs (GPT-4/5, CodeLlama/CodeT5+), static analysis tools (ESLint, SonarQube, Pylint), Python/Node.js backend, React.js dashboard, GitHub Actions/GitLab CI, Docker/Kubernetes, PostgreSQL/MongoDB, OAuth2 guidelines.",
    techStack: ["React", "Python", "OpenAI"],
    createdByName: "Mehul Kumar Singh",
    likes: 24,
    comments: 2,
    category: "AI/ML"
  },
  {
    _id: "2", 
    title: "Real-Time Collaboration Workspace",
    summary: "Seamless real-time collaboration platform for distributed teams.",
    details: "Problem Statement:\nRemote teams struggle with fragmented communication across multiple tools, leading to context switching, lost productivity, and miscommunication. Current solutions lack real-time synchronization and intuitive collaboration features.\n\nExpected Solution:\nA unified workspace combining video calls, document editing, whiteboarding, and project management with real-time synchronization. Features include live cursors, instant messaging, screen sharing, and persistent workspaces.\n\nTechnologies Used:\nWebRTC for real-time communication, WebSockets for live collaboration, React with TypeScript, Node.js backend, MongoDB for data persistence, Redis for session management.",
    techStack: ["React", "WebRTC", "Node.js"],
    createdByName: "Sarah Chen", 
    likes: 32,
    comments: 5,
    category: "Web Dev"
  },
  {
    _id: "3",
    title: "Smart Personal Finance Manager",
    summary: "AI-powered personal finance app with automated budgeting and investment advice.",
    details: "Problem Statement:\nPeople struggle with personal finance management, often overspending, missing savings goals, and making poor investment decisions. Current apps are either too complex or lack personalized insights.\n\nExpected Solution:\nAn intelligent finance app that automatically categorizes expenses, predicts spending patterns, suggests budget optimizations, and provides personalized investment advice based on user goals and risk tolerance.\n\nTechnologies Used:\nReact Native for cross-platform mobile, machine learning for expense prediction, bank API integrations, secure data encryption, cloud-based backend with real-time notifications.",
    techStack: ["React Native", "ML", "Banking APIs"],
    createdByName: "David Kim",
    likes: 45,
    comments: 8,
    category: "Mobile"
  },
  {
    _id: "4",
    title: "Decentralized Identity Verification",
    summary: "Blockchain-based identity system for secure, privacy-preserving verification.",
    details: "Problem Statement:\nCentralized identity systems are vulnerable to data breaches, lack user control, and create privacy concerns. Users have no ownership over their identity data and must trust multiple third parties.\n\nExpected Solution:\nA decentralized identity platform where users control their credentials through blockchain technology. Features zero-knowledge proofs for privacy, interoperable identity across platforms, and secure credential sharing.\n\nTechnologies Used:\nEthereum blockchain, Solidity smart contracts, IPFS for decentralized storage, zero-knowledge proof protocols, Web3 wallet integration, React frontend.",
    techStack: ["Solidity", "Ethereum", "ZK-Proofs"],
    createdByName: "Alice Johnson",
    likes: 38,
    comments: 12,
    category: "Blockchain"
  },
  {
    _id: "5",
    title: "Smart Home Energy Optimizer",
    summary: "IoT system to optimize household energy consumption automatically.",
    details: "Problem Statement:\nHomeowners face high energy bills due to inefficient device usage, lack of real-time consumption data, and inability to optimize usage patterns. Traditional smart home systems are expensive and complex to set up.\n\nExpected Solution:\nAn affordable IoT system that monitors energy consumption of individual devices, learns usage patterns, and automatically optimizes energy usage. Features include remote control, usage analytics, and integration with renewable energy sources.\n\nTechnologies Used:\nArduino and Raspberry Pi for hardware, MQTT for device communication, Node.js backend, React dashboard, machine learning for pattern recognition, mobile app for remote control.",
    techStack: ["Arduino", "Node.js", "IoT"],
    createdByName: "Mike Rodriguez",
    likes: 28,
    comments: 3,
    category: "IoT"
  },
  {
    _id: "6",
    title: "Virtual Reality Learning Platform",
    summary: "Immersive VR education platform for interactive learning experiences.",
    details: "Problem Statement:\nTraditional education methods fail to engage students effectively, especially in complex subjects like science, history, and medicine. Students struggle to visualize abstract concepts and retain information.\n\nExpected Solution:\nA VR platform that creates immersive educational experiences, allowing students to explore historical events, conduct virtual experiments, and interact with 3D models. Features collaborative virtual classrooms and progress tracking.\n\nTechnologies Used:\nUnity3D game engine, C# programming, VR SDKs (Oculus, HTC Vive), 3D modeling tools, cloud-based content delivery, multiplayer networking for collaborative experiences.",
    techStack: ["Unity", "C#", "VR SDKs"],
    createdByName: "Emma Wilson",
    likes: 51,
    comments: 9,
    category: "Game Dev"
  },
  {
    _id: "7",
    title: "Automated Code Documentation Generator",
    summary: "AI tool that automatically generates comprehensive code documentation.",
    details: "Problem Statement:\nDevelopers often neglect documentation due to time constraints, leading to poor code maintainability and knowledge transfer issues. Existing documentation tools require manual effort and become outdated quickly.\n\nExpected Solution:\nAn AI-powered tool that analyzes codebases and automatically generates comprehensive documentation including API docs, code comments, architecture diagrams, and usage examples. Updates documentation as code changes.\n\nTechnologies Used:\nAbstract Syntax Tree parsing, natural language processing, React frontend, Node.js backend, integration with Git repositories, automated CI/CD pipeline integration.",
    techStack: ["React", "NLP", "AST"],
    createdByName: "James Parker",
    likes: 29,
    comments: 6,
    category: "Web Dev"
  },
  {
    _id: "8",
    title: "Mental Health Companion App",
    summary: "AI-powered mental health support with mood tracking and therapy suggestions.",
    details: "Problem Statement:\nMental health issues are rising, but access to professional help is limited and expensive. People need daily support for mood tracking, stress management, and early intervention before crises occur.\n\nExpected Solution:\nA companion app that provides daily mood tracking, personalized coping strategies, guided meditation, crisis detection, and connections to professional help when needed. Uses AI to provide empathetic responses and track progress.\n\nTechnologies Used:\nReact Native for mobile development, machine learning for mood analysis, natural language processing for chat features, secure health data storage, integration with telemedicine platforms.",
    techStack: ["React Native", "AI", "Healthcare"],
    createdByName: "Dr. Sarah Ahmed",
    likes: 67,
    comments: 14,
    category: "Mobile"
  },
  {
    _id: "9",
    title: "Supply Chain Transparency Platform",
    summary: "Blockchain solution for end-to-end supply chain tracking and verification.",
    details: "Problem Statement:\nConsumers lack visibility into product origins, ethical sourcing, and supply chain practices. Companies struggle with counterfeit products, compliance tracking, and supplier verification across complex global supply chains.\n\nExpected Solution:\nA blockchain platform that tracks products from origin to consumer, providing immutable records of each step. Features QR code scanning for consumer verification, automated compliance reporting, and supplier reputation scoring.\n\nTechnologies Used:\nHyperledger Fabric blockchain, smart contracts, IoT sensors for tracking, React web dashboard, mobile app with QR scanning, integration with existing ERP systems.",
    techStack: ["Hyperledger", "IoT", "React"],
    createdByName: "Carlos Martinez",
    likes: 41,
    comments: 7,
    category: "Blockchain"
  },
  {
    _id: "10",
    title: "Smart Agriculture Monitoring System",
    summary: "IoT-based precision farming solution for crop optimization.",
    details: "Problem Statement:\nFarmers face unpredictable crop yields due to inadequate monitoring of soil conditions, weather patterns, and plant health. Traditional farming methods waste resources and fail to optimize growing conditions.\n\nExpected Solution:\nA comprehensive IoT system that monitors soil moisture, temperature, pH levels, and weather conditions. Provides automated irrigation, pest detection through image analysis, and yield prediction using machine learning.\n\nTechnologies Used:\nArduino sensors, LoRaWAN for long-range communication, edge computing for real-time processing, machine learning for predictive analytics, mobile dashboard for farmers.",
    techStack: ["Arduino", "LoRaWAN", "ML"],
    createdByName: "Priya Patel",
    likes: 33,
    comments: 4,
    category: "IoT"
  },
  {
    _id: "11",
    title: "Multiplayer Strategy Game with AI",
    summary: "Real-time strategy game featuring advanced AI opponents and cooperative gameplay.",
    details: "Problem Statement:\nCurrent strategy games lack sophisticated AI opponents that adapt to player strategies, leading to predictable gameplay. Players also want more cooperative options and dynamic storylines that respond to their choices.\n\nExpected Solution:\nA strategy game with machine learning-powered AI that learns from player behavior, dynamic storylines that change based on decisions, and seamless multiplayer cooperation with voice chat and shared objectives.\n\nTechnologies Used:\nUnity3D engine, C# programming, machine learning for AI behavior, Photon networking for multiplayer, voice chat integration, procedural content generation for dynamic maps.",
    techStack: ["Unity", "ML", "Photon"],
    createdByName: "Alex Turner",
    likes: 58,
    comments: 11,
    category: "Game Dev"
  },
  {
    _id: "12",
    title: "Progressive Web App Builder",
    summary: "No-code platform for creating advanced progressive web applications.",
    details: "Problem Statement:\nSmall businesses and individuals want mobile-like web experiences but lack the technical skills or budget to develop progressive web apps. Existing no-code tools produce basic websites without PWA capabilities.\n\nExpected Solution:\nA visual builder that enables creation of sophisticated PWAs with offline functionality, push notifications, app-like navigation, and performance optimization. Features drag-and-drop interface and integration marketplace.\n\nTechnologies Used:\nReact framework, service workers for offline functionality, WebAssembly for performance, visual editor built with React DnD, automated PWA optimization, cloud hosting integration.",
    techStack: ["React", "PWA", "WebAssembly"],
    createdByName: "Maria Santos",
    likes: 44,
    comments: 8,
    category: "Web Dev"
  }
];

export default function IdeaHub() {
  const [ideas, setIdeas] = useState(sampleIdeas);
  const [filteredIdeas, setFilteredIdeas] = useState(sampleIdeas);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [userLikes, setUserLikes] = useState({});
  const [userStars, setUserStars] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    summary: "", 
    details: "",
    techStack: "",
    category: "Web Dev"
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load ideas from backend on component mount
  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    try {
      const response = await fetch('/api/ideas', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Combine backend ideas with sample ideas
          const backendIdeas = data.data.map(idea => ({
            ...idea,
            category: idea.category || categorizeIdea(idea.techStack)
          }));
          setIdeas([...backendIdeas, ...sampleIdeas]);
        }
      }
    } catch (error) {
      console.error('Failed to load ideas:', error);
      // Keep using sample ideas if backend fails
    }
  };

  // Generate new ideas using AI
  const generateNewIdeas = async () => {
    setIsGenerating(true);
    setShowGenerateModal(true);
    setGeneratedIdeas([{ _id: 'loading', isLoading: true }]);

    // Simulate API call with 4-5 seconds delay
    const delay = Math.random() * 1000 + 4000; // Random delay between 4-5 seconds
    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      const response = await fetch('/api/ideas/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setGeneratedIdeas(data.data);
        } else {
          const localIdea = generateSingleIdea();
          setGeneratedIdeas([localIdea]);
        }
      } else {
        // Fallback to generating a single idea locally
        const localIdea = generateSingleIdea();
        setGeneratedIdeas([localIdea]);
      }
    } catch (error) {
      console.error('Failed to generate ideas:', error);
      // Fallback to local generation
      const localIdea = generateSingleIdea();
      setGeneratedIdeas([localIdea]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate a single idea locally
  const generateSingleIdea = () => {
    const technologies = [
      ["React", "Node.js", "PostgreSQL"],
      ["Python", "FastAPI", "MongoDB"],
      ["Flutter", "Firebase", "Dart"],
      ["Solidity", "Ethereum", "Web3"],
      ["Arduino", "IoT", "MQTT"],
      ["Unity", "C#", "Multiplayer"],
      ["Next.js", "TypeScript", "Tailwind"],
      ["Vue.js", "Django", "REST API"]
    ];

    const problems = [
      {
        title: "Real-Time Expense Tracking Dashboard",
        summary: "A comprehensive dashboard for tracking and analyzing personal and business expenses with real-time insights.",
        problemStatement: `PROBLEM STATEMENT:
Users struggle to track expenses across multiple platforms and lack a unified view of their spending patterns. Current solutions are fragmented - bank statements, receipt apps, and spreadsheets don't communicate with each other, leading to:
- Difficulty identifying spending patterns and wastage
- Inability to stick to budgets
- Time-consuming manual categorization
- No predictive insights for future planning
- Limited collaborative tracking for shared expenses

TARGET USERS:
- Freelancers and small business owners
- Families managing shared finances
- Students tracking personal budgets
- Corporate teams managing project expenses

EXPECTED SOLUTION:
A real-time dashboard that automatically categorizes expenses, generates spending reports, and provides insights for budget optimization. 

KEY FEATURES:
1. Automatic bank/payment integration (Plaid API)
2. Smart expense categorization using AI/ML
3. Real-time spending alerts and notifications
4. Budget setting and tracking with visual progress bars
5. Recurring transaction detection and management
6. Collaborative expense sharing for teams/families
7. Advanced analytics with trend analysis
8. Export reports in multiple formats (PDF, CSV, Excel)
9. Mobile app for on-the-go tracking
10. Multi-currency support
11. Receipt scanning with OCR
12. Customizable spending categories
13. Predictive spending forecasts

TECHNOLOGIES REQUIRED:
- Frontend: React/Vue.js with TailwindCSS for responsive design
- Backend: Node.js/Python with REST/GraphQL APIs
- Database: PostgreSQL for relational data, Redis for caching
- Mobile: React Native or Flutter
- AI/ML: TensorFlow or scikit-learn for categorization
- Banking API: Plaid or similar for secure bank connections
- Payment Processing: Stripe/PayPal integration
- Cloud: AWS/Google Cloud for hosting and storage

IMPLEMENTATION STEPS:
1. Design database schema for users, expenses, categories, budgets
2. Integrate banking APIs for secure data fetching
3. Develop ML model for expense categorization
4. Build responsive dashboard with Chart.js/D3.js
5. Implement real-time notifications
6. Create mobile application
7. Add advanced analytics engine
8. Implement security measures (encryption, 2FA)

SUCCESS METRICS:
- User acquisition: 10K+ users in first 6 months
- Daily active users: 30% of total users
- Average session duration: 10+ minutes
- Customer retention: 70% monthly
- Integration success rate: 95%+
- Response time: <500ms for all queries

REVENUE MODEL:
- Freemium: Basic features free, premium at $4.99/month
- B2B: Corporate plans starting at $99/month
- API access for enterprise clients`,
        category: "Web Dev"
      },
      {
        title: "AI-Powered Customer Support Chatbot",
        summary: "Intelligent chatbot for handling customer support queries with natural language processing and ML-powered responses.",
        problemStatement: `PROBLEM STATEMENT:
Customer support teams are overwhelmed with repetitive queries, leading to slow response times, increased operational costs, and poor customer satisfaction. Issues include:
- 60-70% of queries are repetitive (password resets, billing, FAQs)
- Average response time: 2-4 hours (unacceptable for modern users)
- High support staff burnout and turnover
- Inconsistent responses across different support agents
- 24/7 availability impossible with human-only support
- Language barriers for global companies

TARGET USERS:
- E-commerce platforms
- SaaS companies
- Banks and financial institutions
- Telecom companies
- Healthcare providers
- Online education platforms

EXPECTED SOLUTION:
An AI-powered chatbot that understands customer intent, provides instant solutions, learns from past interactions, and escalates complex issues to human agents.

KEY FEATURES:
1. Natural Language Understanding (NLU) for intent recognition
2. Multi-language support (15+ languages)
3. Context awareness and conversation memory
4. Smart escalation to human agents
5. Integration with knowledge base/FAQ
6. Sentiment analysis for emotional intelligence
7. Real-time learning from interactions
8. Customizable conversation flows
9. Integration with CRM systems (Salesforce, HubSpot)
10. Analytics dashboard for conversation metrics
11. Handoff to human agents with context
12. Proactive assistance based on user behavior
13. Payment processing integration
14. Ticket creation and tracking
15. Multi-channel support (Web, WhatsApp, Messenger, SMS)

TECHNOLOGIES REQUIRED:
- NLP: OpenAI GPT-4, Google BERT, Hugging Face Transformers
- Conversation Management: Rasa, Dialogflow, Azure Bot Service
- Frontend: React for web interface
- Backend: Node.js/Python FastAPI
- Database: MongoDB for conversation logs, PostgreSQL for structured data
- Message Queue: RabbitMQ/Kafka for handling high volume
- Cloud: AWS/GCP/Azure for scalability
- Analytics: Elasticsearch for logging and analytics
- Integration: Zapier API, Webhooks for third-party integrations

IMPLEMENTATION STEPS:
1. Define use cases and train intents
2. Build NLU model with training data
3. Integrate knowledge base and FAQ
4. Create conversation flow logic
5. Set up human handoff mechanism
6. Implement multi-channel messaging
7. Build analytics dashboard
8. Set up monitoring and alerts
9. Deploy with load balancing
10. Create admin panel for fine-tuning

SUCCESS METRICS:
- Query resolution rate: 80%+ without escalation
- Average resolution time: <2 minutes
- Customer satisfaction: 4.5+/5 stars
- Cost reduction: 60-70% compared to human support
- Uptime: 99.9%
- Language accuracy: 95%+
- Human escalation rate: <20%

REVENUE MODEL:
- SaaS subscription: $500-5000/month based on query volume
- Usage-based pricing: $0.10-0.50 per resolved query
- Enterprise licensing
- Custom integration services`,
        category: "AI/ML"
      },
      {
        title: "Decentralized Task Management Platform",
        summary: "Blockchain-based task management system for transparent and secure project collaboration.",
        problemStatement: `PROBLEM STATEMENT:
Teams lack trust in centralized project management tools and need transparent, immutable task records with decentralized control. Current issues:
- Task tampering and unauthorized modifications
- Centralized data control and potential censorship
- High fees for task delegation platforms
- Lack of transparent reward distribution
- No verifiable proof of work completion
- Disputes between team members over task status
- Single point of failure in centralized systems

TARGET USERS:
- Remote development teams
- Freelance marketplaces
- Distributed autonomous organizations (DAOs)
- Open-source projects
- Bounty program managers
- Project management agencies

EXPECTED SOLUTION:
A blockchain-based platform where tasks are recorded as smart contracts, ensuring transparency, immutability, and fair reward distribution.

KEY FEATURES:
1. Smart contract-based task creation
2. Immutable task history and audit logs
3. Automated milestone-based payments
4. Reputation scoring system
5. Dispute resolution mechanism
6. Multi-signature approval workflows
7. Token-based rewards system
8. Escrow services for secure transactions
9. Real-time collaboration tools
10. Deadline tracking with penalties/incentives
11. Skills-based task matching
12. Portfolio building for freelancers
13. Privacy controls and access management
14. Integration with crypto wallets
15. Verification system for completed work

TECHNOLOGIES REQUIRED:
- Blockchain: Ethereum, Polygon, or Solana
- Smart Contracts: Solidity or Rust
- Frontend: React/Vue with Web3.js
- Backend: Node.js with ethers.js
- Database: IPFS for decentralized storage
- Payment: Native blockchain tokens, stablecoins
- Analytics: The Graph for data indexing
- Authentication: MetaMask, WalletConnect
- Oracle: Chainlink for external data verification

IMPLEMENTATION STEPS:
1. Design smart contract architecture
2. Create task and payment smart contracts
3. Implement reputation system on-chain
4. Build web interface with wallet integration
5. Develop escrow mechanism
6. Create dispute resolution system
7. Implement off-chain messaging
8. Set up token economics
9. Deploy on test networks
10. Audit smart contracts for security

SUCCESS METRICS:
- Total value locked (TVL): $1M+ in 6 months
- Active tasks: 10K+
- Number of freelancers: 5K+
- Average dispute rate: <5%
- Smart contract security: 0 exploits
- Platform uptime: 99.99%
- Transaction finality: <30 seconds

REVENUE MODEL:
- Platform transaction fees: 2-5% per task
- Premium features subscription: $10-50/month
- Token staking rewards
- Enterprise licensing for DAOs`,
        category: "Blockchain"
      },
      {
        title: "Environmental Monitoring IoT Network",
        summary: "Connected IoT sensors for real-time environmental monitoring and pollution detection across cities.",
        problemStatement: `PROBLEM STATEMENT:
Cities lack comprehensive air and water quality monitoring systems, making it difficult to respond to environmental issues quickly. Current challenges:
- Limited monitoring stations (expensive to set up)
- Data collected only at specific locations
- Delayed data availability (hours/days)
- Lack of real-time public awareness
- No early warning system for pollution events
- Incomplete picture of environmental health
- Difficulty in regulatory compliance
- Lack of historical trend analysis

TARGET USERS:
- Government environmental agencies
- Municipal corporations
- Environmental NGOs
- Public health departments
- Urban planners
- Automotive emission regulators
- Industrial companies
- Citizen activists

EXPECTED SOLUTION:
A distributed IoT network of low-cost sensors monitoring air quality, water quality, noise levels, and temperature with real-time data visualization.

KEY FEATURES:
1. Distributed IoT sensor network (cheap, easy to deploy)
2. Multi-parameter monitoring: PM2.5, PM10, NO2, O3, CO2, CO, SO2
3. Real-time data dashboard with heat maps
4. Mobile app for public access
5. Historical data analysis and trend detection
6. Predictive pollution forecasts
7. Instant alerts for hazardous conditions
8. Integration with weather data
9. Source identification for pollution
10. Citizen reporting mechanism
11. API for third-party developers
12. Data export in multiple formats
13. Customizable alert thresholds
14. Community visualization tools
15. Machine learning for anomaly detection

TECHNOLOGIES REQUIRED:
- Hardware: Arduino, Raspberry Pi, Sensors (BME680, SDS011, MQ series)
- Communication: MQTT, LoRaWAN, 4G/5G
- Backend: Node.js/Python
- Database: InfluxDB for time-series data, PostgreSQL for relational
- Frontend: React/Vue with D3.js for visualizations
- Mobile: React Native/Flutter
- Cloud: AWS/GCP/Azure for storage and processing
- ML: TensorFlow for forecasting models
- Data Pipeline: Apache Kafka for stream processing

IMPLEMENTATION STEPS:
1. Design sensor hardware and PCB
2. Develop firmware for sensor nodes
3. Set up MQTT broker for data collection
4. Build backend API for data ingestion
5. Create time-series database
6. Develop real-time dashboard
7. Implement ML forecasting model
8. Build mobile app
9. Create public API
10. Deploy pilot program in 5-10 locations

SUCCESS METRICS:
- Number of sensors deployed: 1000+
- Data accuracy: 95%+ vs reference stations
- Real-time data latency: <5 minutes
- Public app downloads: 50K+
- API users: 100+
- Forecast accuracy: 80%+
- Coverage area: 100+ km²

REVENUE MODEL:
- Government contracts for city deployments
- Data licensing to research institutions
- Premium analytics for businesses ($500-2000/month)
- API usage pricing
- Data visualization tools for enterprises`,
        category: "IoT"
      },
      {
        title: "Virtual Fitness Training Platform",
        summary: "Immersive VR fitness platform with AI-powered personal trainers and multiplayer challenges.",
        problemStatement: `PROBLEM STATEMENT:
Traditional fitness apps lack engagement and personalization. Users face:
- High dropout rate (80% quit within 3 months)
- Lack of real-time form correction (risk of injury)
- No gamification or social motivation
- Generic workout plans not adapted to user
- Boring repetitive workouts
- Lack of real-time coaching
- No social accountability
- Difficulty tracking progress

TARGET USERS:
- Fitness enthusiasts aged 18-45
- People with gym anxiety or time constraints
- VR headset owners (Meta Quest, PlayStation VR)
- Remote workers needing fitness options
- Corporate wellness programs
- Rehabilitation centers
- Physical therapy patients

EXPECTED SOLUTION:
A VR platform with AI-powered trainers that provide real-time form correction and personalized workout plans in an immersive environment.

KEY FEATURES:
1. Full-body motion tracking (skeletal tracking)
2. AI coaches providing real-time form correction
3. Immersive virtual environments (gym, outdoor, fantasy worlds)
4. Personalized workout generation based on fitness level
5. Real-time heart rate monitoring integration
6. Multiplayer fitness challenges and competitions
7. Global leaderboards and achievements
8. Wearable device integration (Apple Watch, Fitbit)
9. Progress tracking with detailed analytics
10. Virtual reward system and gamification
11. Social features (friend challenges, group classes)
12. Difficulty adjustment based on performance
13. Audio coaching and motivation
14. Recovery and nutrition recommendations
15. Integration with fitness trackers and smartwatches

TECHNOLOGIES REQUIRED:
- VR Platform: Unity/Unreal Engine
- Motion Capture: OpenPose, MediaPipe for skeletal tracking
- AI/ML: TensorFlow for pose estimation and form analysis
- Backend: Node.js/Python FastAPI
- Database: MongoDB for user profiles, Redis for real-time data
- Cloud: AWS/Google Cloud for processing
- Wearables Integration: APIs for Apple Health, Fitbit, Garmin
- Networking: Photon/Netcode for multiplayer synchronization
- Mobile Companion: React Native app for app store

IMPLEMENTATION STEPS:
1. Set up VR development environment
2. Create virtual environments and avatars
3. Implement motion tracking system
4. Build AI pose analysis model
5. Develop personalization engine
6. Create multiplayer networking
7. Implement real-time coaching system
8. Build leaderboard system
9. Integrate wearable devices
10. Develop mobile companion app
11. Create progression and reward system
12. Set up analytics dashboard

SUCCESS METRICS:
- Number of active users: 100K+
- Workouts completed weekly: 500K+
- Average session duration: 30+ minutes
- 30-day retention rate: 70%+
- Form correction accuracy: 95%+
- User satisfaction: 4.6+/5
- Social engagement: 40% of users active in challenges
- Monthly recurring revenue: $2M+

REVENUE MODEL:
- Subscription: $9.99/month (basic), $19.99/month (premium)
- Annual subscription with discount: $99/year
- Corporate wellness licenses: $5000-20000/month
- In-app purchases for virtual items
- Premium coaching sessions
- Data analytics for gyms and studios`,
        category: "Game Dev"
      },
      {
        title: "Smart Parking Management System",
        summary: "IoT and AI-powered system for efficient urban parking management and real-time availability tracking.",
        problemStatement: `PROBLEM STATEMENT:
Urban drivers waste time searching for parking, causing traffic congestion and increased emissions. Current issues:
- Average driver spends 15-20 minutes searching for parking
- 30% of urban traffic is caused by parking searches
- Increased fuel consumption and carbon emissions
- Frustration and road rage incidents
- Underutilized parking spaces due to lack of visibility
- No dynamic pricing optimization
- Difficulty enforcing parking regulations
- Loss of revenue for municipalities

TARGET USERS:
- Urban municipal corporations
- Airport and transit authorities
- Shopping mall management
- Parking lot operators
- Ride-sharing companies (Uber, Lyft)
- Fleet management companies
- City planners
- Individual drivers

EXPECTED SOLUTION:
An integrated system combining IoT sensors in parking spaces, mobile app for real-time availability, dynamic pricing, and reservation capabilities.

KEY FEATURES:
1. IoT sensors in parking spots (occupancy detection)
2. Real-time availability map on mobile app
3. GPS navigation to available spots
4. Reservation system for guaranteed parking
5. Dynamic pricing based on demand and location
6. Automatic payment processing
7. Integrated permit management
8. Violation detection with computer vision
9. Predictive analytics for parking demand
10. Integration with navigation apps (Google Maps, Waze)
11. Data analytics dashboard for operators
12. EV charging station integration
13. Accessible parking enforcement
14. Revenue optimization algorithms
15. Multi-zone management capabilities

TECHNOLOGIES REQUIRED:
- Hardware: IoT sensors (ultrasonic, magnetic, cameras)
- Communication: LoRaWAN, 5G, cellular
- Frontend: React web app, React Native mobile
- Backend: Node.js/Python
- Database: MongoDB for real-time data, PostgreSQL for transactions
- ML: TensorFlow for demand prediction
- Computer Vision: YOLOv5 for plate recognition and violations
- Cloud: AWS/Azure for scalability
- Payment: Stripe/PayPal integration
- Mapping: Google Maps API, Mapbox

IMPLEMENTATION STEPS:
1. Design IoT sensor hardware
2. Deploy sensors across parking areas
3. Build backend for data aggregation
4. Develop real-time availability API
5. Create mobile app with map interface
6. Implement payment processing
7. Build operator dashboard
8. Set up dynamic pricing algorithm
9. Implement violation detection system
10. Deploy predictive analytics engine
11. Integrate with existing systems
12. Launch pilot program

SUCCESS METRICS:
- Parking search time reduction: 50-60%
- Traffic reduction in parking areas: 40-50%
- Average parking occupancy: 85%+
- User satisfaction: 4.5+/5
- Number of app downloads: 500K+
- Daily active users: 50K+
- Revenue increase for municipalities: 200-300%
- Emission reduction: 15% in parking-related trips

REVENUE MODEL:
- Municipal licensing: $50K-500K per city (based on size)
- Parking transaction fees: $0.25-1.00 per transaction
- Operator premium features: $500-5000/month
- Data analytics licensing to traffic planning agencies
- API access for navigation apps and mobility services`,
        category: "IoT"
      },
      {
        title: "Cross-Platform Productivity App",
        summary: "Universal productivity tool syncing seamlessly across web, mobile, and desktop platforms.",
        problemStatement: `PROBLEM STATEMENT:
Users switch between different apps for notes, tasks, calendars, and documents, losing productivity due to fragmentation. Current issues:
- Context switching between 5-10 different apps daily
- Sync delays causing data inconsistencies
- Lack of integrated workflow
- Privacy concerns with multiple services
- High subscription costs for multiple tools
- Complex setup and onboarding
- Limited collaboration features
- No offline-first capabilities

TARGET USERS:
- Remote knowledge workers
- Students managing assignments
- Project managers
- Entrepreneurs and startups
- Corporate teams
- Freelancers managing multiple clients
- Personal productivity enthusiasts
- Educational institutions

EXPECTED SOLUTION:
A unified platform combining note-taking, task management, calendar, file storage, and collaboration tools with perfect synchronization.

KEY FEATURES:
1. Rich note-taking with markdown support
2. Hierarchical task management with subtasks
3. Integrated calendar with event management
4. Cloud file storage with version control
5. Real-time collaborative editing
6. Full-text search across all content
7. Offline-first sync (works without internet)
8. End-to-end encryption for privacy
9. Templates for recurring tasks/notes
10. AI-powered suggestions and organization
11. Integrations with email, Slack, GitHub
12. Custom workspaces for teams
13. Time tracking and productivity analytics
14. Shared calendars and task lists
15. Mobile app with full feature parity
16. Dark mode and customizable themes
17. API for third-party integrations
18. Advanced permission controls
19. Backup and recovery system
20. Widget support on all platforms

TECHNOLOGIES REQUIRED:
- Frontend: React/Vue for web, React Native/Flutter for mobile
- Desktop: Electron for Windows/Mac
- Backend: Node.js/Python
- Database: PostgreSQL for structured data, DynamoDB for sync
- Real-time: WebSockets for collaborative editing
- Cloud: AWS/Google Cloud for storage
- Encryption: libsodium for end-to-end encryption
- Search: Elasticsearch for full-text search
- Sync: Operational transformation or CRDT for real-time sync
- Mobile: Cross-platform with native performance

IMPLEMENTATION STEPS:
1. Design unified data model
2. Build core note-taking engine
3. Develop task management system
4. Create calendar integration
5. Set up file storage with versioning
6. Implement real-time collaboration
7. Build mobile apps
8. Implement offline sync
9. Add encryption layer
10. Create desktop apps
11. Build integration ecosystem
12. Set up analytics platform
13. Develop admin console

SUCCESS METRICS:
- Number of users: 500K+ within 1 year
- Daily active users: 100K+
- Average session duration: 20+ minutes
- Feature retention: 80%+ use 5+ features weekly
- Sync success rate: 99.99%
- Search accuracy: 98%+
- Data privacy: Zero breaches
- User satisfaction: 4.7+/5

REVENUE MODEL:
- Freemium: Basic (free), Pro ($10/month), Team ($20/user/month)
- Family plan: $25/month for 6 people
- Enterprise licensing: Custom pricing
- API access for developers
- Storage upgrades: $5 per 100GB`,
        category: "Mobile"
      },
      {
        title: "Blockchain-Based Academic Credentials",
        summary: "Tamper-proof digital credentials system using blockchain for educational achievements.",
        problemStatement: `PROBLEM STATEMENT:
Academic credentials are prone to fraud, and verification processes are slow and manual. Issues include:
- 50%+ credential fraud rate in some industries
- Employers spend hours verifying degrees
- Slow credential issuing process (weeks/months)
- Credentials can be altered or forged
- Lost transcripts cause delays
- Centralized vulnerability to hacks
- Graduates lack portable credential ownership
- No unified format for credentials

TARGET USERS:
- Universities and educational institutions
- Students and job seekers
- Employers and HR departments
- Professional certification bodies
- Governments for credential verification
- Recruitment agencies
- International education platforms
- Scholarship program administrators

EXPECTED SOLUTION:
A blockchain system where educational institutions issue verifiable digital certificates stored on decentralized ledger.

KEY FEATURES:
1. Immutable credential storage on blockchain
2. Instant issuance by educational institutions
3. One-click verification for employers
4. Portable credential portfolio for graduates
5. QR code for easy sharing
6. Multi-credential aggregation
7. Privacy-preserving verification (zero-knowledge proofs)
8. Smart contracts for conditional credentials
9. Integration with job platforms
10. Automatic background check integration
11. Blockchain wallet for credential ownership
12. Cryptographic signatures for authenticity
13. Credential expiration and renewal system
14. Batch credential issuance
15. Multi-language support
16. Credential analytics for institutions
17. API for employer integration
18. Mobile wallet application
19. Institutional dashboard
20. Compliance with international standards (W3C)

TECHNOLOGIES REQUIRED:
- Blockchain: Ethereum, Polygon, or Hyperledger
- Smart Contracts: Solidity for credential logic
- Frontend: React for web, React Native for mobile
- Backend: Node.js with Web3.js
- Database: IPFS for document storage, blockchain for records
- Identity: Decentralized Identity (DID) standards
- Digital Signatures: Elliptic Curve Cryptography
- Authentication: OAuth 2.0 with blockchain verification
- API: RESTful APIs for employer integrations
- Zero-Knowledge Proofs: For privacy-preserving verification

IMPLEMENTATION STEPS:
1. Design smart contract architecture
2. Create credential issuance contracts
3. Implement verification logic
4. Build web portal for institutions
5. Develop mobile wallet for graduates
6. Create employer verification system
7. Implement zero-knowledge proof system
8. Build analytics dashboard
9. Create API for integrations
10. Deploy on mainnet with insurance
11. Migrate legacy credentials
12. Establish institutional partnerships
13. Create governance framework

SUCCESS METRICS:
- Number of credentials issued: 1M+ in first year
- Verification response time: <2 seconds
- Adoption by institutions: 500+
- Employer registrations: 10K+
- Fraud prevention rate: 99.9%+
- User satisfaction: 4.8+/5
- System uptime: 99.99%
- Cost per credential: <$0.10

REVENUE MODEL:
- Per-credential issuance fee: $0.50-2.00
- Institutional subscription: $5000-50000/year
- Employer API subscription: $2000-10000/year
- Premium wallet features: $5/month
- Enterprise verification services
- Data analytics reports for institutions`,
        category: "Blockchain"
      }
    ];

    const randomIndex = Math.floor(Math.random() * problems.length);
    const randomTechIndex = Math.floor(Math.random() * technologies.length);
    const problem = problems[randomIndex];

    return {
      _id: `generated_${Date.now()}_${Math.random()}`,
      title: problem.title,
      summary: problem.summary,
      details: problem.problemStatement,
      techStack: technologies[randomTechIndex],
      createdByName: "AI Generated",
      likes: 0,
      comments: 0,
      category: problem.category,
      isGenerated: true
    };
  };

  // Categorize idea based on tech stack
  const categorizeIdea = (techStack) => {
    if (!techStack || !Array.isArray(techStack)) return "Web Dev";
    
    const tech = techStack.join(" ").toLowerCase();
    if (tech.includes("react native") || tech.includes("flutter") || tech.includes("swift") || tech.includes("kotlin")) return "Mobile";
    if (tech.includes("ai") || tech.includes("ml") || tech.includes("machine learning") || tech.includes("openai")) return "AI/ML";
    if (tech.includes("blockchain") || tech.includes("solidity") || tech.includes("web3") || tech.includes("ethereum")) return "Blockchain";
    if (tech.includes("arduino") || tech.includes("iot") || tech.includes("sensors") || tech.includes("raspberry pi")) return "IoT";
    if (tech.includes("unity") || tech.includes("game") || tech.includes("vr") || tech.includes("ar")) return "Game Dev";
    return "Web Dev";
  };

  // Load saved likes and stars from localStorage
  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem('ideaLikes') || '{}');
    const savedStars = JSON.parse(localStorage.getItem('ideaStars') || '{}');
    setUserLikes(savedLikes);
    setUserStars(savedStars);
  }, []);

  const categories = [
    "All", "Web Dev", "Mobile", "AI/ML", "Blockchain", "IoT", "Game Dev"
  ];

  // Filter ideas based on category and search
  useEffect(() => {
    let filtered = ideas;
    
    if (selectedCategory !== "All") {
      filtered = filtered.filter(idea => idea.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(idea => 
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.summary.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredIdeas(filtered);
  }, [ideas, selectedCategory, searchQuery]);

  const toggleLike = (ideaId, e) => {
    e.stopPropagation();
    const newUserLikes = { ...userLikes };
    const wasLiked = newUserLikes[ideaId];
    
    newUserLikes[ideaId] = !wasLiked;
    setUserLikes(newUserLikes);
    localStorage.setItem('ideaLikes', JSON.stringify(newUserLikes));
    
    // Update the ideas array to reflect the like change
    setIdeas(prevIdeas => 
      prevIdeas.map(idea => 
        idea._id === ideaId 
          ? { ...idea, likes: wasLiked ? idea.likes - 1 : idea.likes + 1 }
          : idea
      )
    );
  };

  const toggleStar = (ideaId, e) => {
    if (e) e.stopPropagation();
    const newUserStars = { ...userStars };
    newUserStars[ideaId] = !newUserStars[ideaId];
    setUserStars(newUserStars);
    localStorage.setItem('ideaStars', JSON.stringify(newUserStars));
  };

  const isLiked = (ideaId) => userLikes[ideaId] || false;
  const isStarred = (ideaId) => userStars[ideaId] || false;

  const addComment = () => {
    if (!newComment.trim() || !selectedIdea) return;
    
    const savedComments = JSON.parse(localStorage.getItem('ideaComments') || '{}');
    if (!savedComments[selectedIdea._id]) {
      savedComments[selectedIdea._id] = [];
    }
    
    savedComments[selectedIdea._id].push({
      text: newComment,
      authorName: "You",
      createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('ideaComments', JSON.stringify(savedComments));
    setNewComment("");
    
    // Update the comment count
    setIdeas(prevIdeas =>
      prevIdeas.map(idea =>
        idea._id === selectedIdea._id
          ? { ...idea, comments: idea.comments + 1 }
          : idea
      )
    );
  };

  const getComments = (ideaId) => {
    const savedComments = JSON.parse(localStorage.getItem('ideaComments') || '{}');
    return savedComments[ideaId] || [];
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFormError("");
  };

  const handleSubmitIdea = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    // Validation
    if (!formData.title.trim() || !formData.summary.trim() || !formData.details.trim()) {
      setFormError("Title, summary, and details are required.");
      setSubmitting(false);
      return;
    }

    try {
      const techStackArray = formData.techStack
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0);

      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          title: formData.title.trim(),
          summary: formData.summary.trim(),
          details: formData.details.trim(),
          techStack: techStackArray
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Add the new idea to the list with category
        const newIdea = {
          ...data.data,
          category: formData.category
        };
        
        setIdeas(prev => [newIdea, ...prev]);
        
        // Reset form and close modal
        setFormData({
          title: "",
          summary: "",
          details: "",
          techStack: "",
          category: "Web Dev"
        });
        setShowAddModal(false);
      } else {
        setFormError(data.message || "Failed to create idea. Please try again.");
      }
    } catch (error) {
      console.error('Error submitting idea:', error);
      setFormError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white flex items-center gap-2">
            Ideas Hub 💡
          </h1>
          <p className="text-slate-400 mt-1">Discover and share innovative project ideas</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={generateNewIdeas}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-700 disabled:cursor-not-allowed border border-slate-700 rounded-lg text-slate-200 transition-colors"
          >
            <SparklesIcon className="w-4 h-4" />
            {isGenerating ? "Generating..." : "Generate New Ideas"}
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Add New Idea
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "bg-white text-black"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIdeas.map((idea) => (
          <div
            key={idea._id}
            onClick={() => setSelectedIdea(idea)}
            className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-colors cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded">
                {idea.category}
              </span>
              <button
                onClick={(e) => toggleStar(idea._id, e)}
                className="text-slate-400 hover:text-yellow-400 transition-colors"
              >
                {isStarred(idea._id) ? (
                  <StarIconSolid className="w-5 h-5 text-yellow-400" />
                ) : (
                  <StarIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
              {idea.title}
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              {idea.summary}
            </p>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {idea.techStack.slice(0, 3).map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">by {idea.createdByName}</span>
              <div className="flex items-center gap-3 text-slate-400">
                <button
                  onClick={(e) => toggleLike(idea._id, e)}
                  className={`flex items-center gap-1 hover:text-red-400 transition-colors ${
                    isLiked(idea._id) ? 'text-red-400' : 'text-slate-400'
                  }`}
                >
                  {isLiked(idea._id) ? (
                    <HeartIconSolid className="w-4 h-4" />
                  ) : (
                    <HeartIcon className="w-4 h-4" />
                  )}
                  {idea.likes}
                </button>
                <span className="flex items-center gap-1">
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  {idea.comments + getComments(idea._id).length}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed View Modal */}
      {selectedIdea && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded">
                      {selectedIdea.category}
                    </span>
                    <button
                      onClick={() => toggleStar(selectedIdea._id)}
                      className="text-slate-400 hover:text-yellow-400 transition-colors"
                    >
                      {isStarred(selectedIdea._id) ? (
                        <StarIconSolid className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <StarIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {selectedIdea.title}
                  </h2>
                  <p className="text-slate-400 mb-4">By {selectedIdea.createdByName}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedIdea.techStack.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedIdea(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Problem Statement */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Problem Statement:</h3>
                  <div className="bg-slate-800 rounded-lg p-4">
                    <p className="text-slate-300 whitespace-pre-line">{selectedIdea.details}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-red-400">
                    <HeartIconSolid className="w-5 h-5" />
                    <span>{selectedIdea.likes} Likes</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <ChatBubbleLeftIcon className="w-5 h-5" />
                    <span>{selectedIdea.comments + getComments(selectedIdea._id).length} Comments</span>
                  </div>
                </div>

                {/* Comments Section */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Comments</h3>
                  
                  {/* Local Storage Comments */}
                  <div className="space-y-3 mb-4">
                    {getComments(selectedIdea._id).map((comment, index) => (
                      <div key={index} className="bg-slate-800 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-white">{comment.authorName}</span>
                          <span className="text-xs text-slate-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm">{comment.text}</p>
                      </div>
                    ))}
                    
                    {/* Default comments */}
                    {selectedIdea._id === "1" && (
                      <>
                        <div className="bg-slate-800 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-white">Anonymous</span>
                          </div>
                          <p className="text-slate-300 text-sm">This is great!</p>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-white">Anonymous</span>
                          </div>
                          <p className="text-slate-300 text-sm">Can it work with Java?</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Add Comment */}
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                      onKeyDown={(e) => e.key === 'Enter' && addComment()}
                    />
                    <button
                      onClick={addComment}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Idea Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmitIdea} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Add New Idea</h2>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="Enter your idea title (max 150 characters)"
                    maxLength={150}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    required
                  />
                  <div className="text-xs text-slate-500 mt-1">
                    {formData.title.length}/150 characters
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Web Dev">Web Dev</option>
                    <option value="Mobile">Mobile</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Blockchain">Blockchain</option>
                    <option value="IoT">IoT</option>
                    <option value="Game Dev">Game Dev</option>
                  </select>
                </div>

                {/* Summary */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Summary <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleFormChange}
                    placeholder="Brief description of your idea (max 350 characters)"
                    maxLength={350}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    required
                  />
                  <div className="text-xs text-slate-500 mt-1">
                    {formData.summary.length}/350 characters
                  </div>
                </div>

                {/* Details */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Detailed Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleFormChange}
                    placeholder="Detailed explanation of the problem statement, expected solution, and implementation approach (max 5000 characters)"
                    maxLength={5000}
                    rows={6}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    required
                  />
                  <div className="text-xs text-slate-500 mt-1">
                    {formData.details.length}/5000 characters
                  </div>
                </div>

                {/* Tech Stack */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tech Stack
                  </label>
                  <input
                    type="text"
                    name="techStack"
                    value={formData.techStack}
                    onChange={handleFormChange}
                    placeholder="React, Node.js, MongoDB, etc. (comma-separated)"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                  <div className="text-xs text-slate-500 mt-1">
                    Separate multiple technologies with commas
                  </div>
                </div>

                {/* Error Message */}
                {formError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <p className="text-red-300 text-sm">{formError}</p>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    {submitting ? "Creating..." : "Create Idea"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generate New Ideas Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">✨ AI-Generated Ideas</h2>
                  <p className="text-slate-400">Select an idea below to add it to your hub or customize it further</p>
                </div>
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Generated Ideas List */}
              <div className="space-y-4 mb-6">
                {isGenerating ? (
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 flex flex-col items-center justify-center">
                    <div className="mb-4">
                      <div className="w-12 h-12 rounded-full border-4 border-slate-600 border-t-indigo-500 animate-spin"></div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Generating Your Idea...</h3>
                    <p className="text-slate-400 text-sm text-center">Our AI is analyzing and creating a unique idea for you</p>
                  </div>
                ) : (
                  generatedIdeas.map((idea) => (
                    <div
                      key={idea._id}
                      className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                              {idea.category}
                            </span>
                            <span className="px-2 py-1 bg-indigo-600/20 text-indigo-300 text-xs rounded">
                              ✨ AI Generated
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {idea.title}
                          </h3>
                          <p className="text-slate-400 text-sm mb-3">
                            {idea.summary}
                          </p>

                          {/* Problem Statement */}
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-slate-300 mb-2">Problem & Solution Details:</h4>
                            <p className="text-slate-300 text-sm whitespace-pre-line bg-slate-900 rounded p-4 max-h-[400px] overflow-y-auto">
                              {idea.details}
                            </p>
                          </div>

                          {/* Tech Stack */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {idea.techStack.map((tech, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => {
                              // Pre-fill the add form with this idea
                              setFormData({
                                title: idea.title,
                                summary: idea.summary,
                                details: idea.details,
                                techStack: idea.techStack.join(', '),
                                category: idea.category
                              });
                              setShowGenerateModal(false);
                              setShowAddModal(true);
                            }}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors whitespace-nowrap"
                          >
                            Use This
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Bottom Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => {
                    generateNewIdeas();
                  }}
                  disabled={isGenerating}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-700 text-slate-200 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <SparklesIcon className="w-4 h-4" />
                  {isGenerating ? "Generating..." : "Generate Another Idea"}
                </button>
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}