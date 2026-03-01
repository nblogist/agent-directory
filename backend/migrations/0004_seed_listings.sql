-- AgentRadar: Seed listings migration
-- Populates tags, real AI-first agent listings, junction tables, and denormalized counts
-- All listings are pre-approved so the directory launches with compelling content on day one.

BEGIN;

-- ---------------------------------------------------------------------------
-- Tags (20 total)
-- Slugs must match ^[a-z0-9][a-z0-9-]{0,59}$
-- ---------------------------------------------------------------------------
INSERT INTO tags (name, slug) VALUES
    ('AI Agent',          'ai-agent'),
    ('LLM',               'llm'),
    ('Autonomous',        'autonomous'),
    ('DeFi',              'defi'),
    ('NFT',               'nft'),
    ('Wallet',            'wallet'),
    ('SDK',               'sdk'),
    ('API',               'api'),
    ('Analytics',         'analytics'),
    ('Oracle',            'oracle'),
    ('Cross-chain',       'cross-chain'),
    ('Identity',          'identity'),
    ('DAO',               'dao'),
    ('Privacy',           'privacy'),
    ('Infrastructure',    'infrastructure'),
    ('Payments',          'payments'),
    ('Smart Contract',    'smart-contract'),
    ('Machine Learning',  'machine-learning'),
    ('Chatbot',           'chatbot'),
    ('Developer Tools',   'developer-tools')
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Listings (14 real AI-first tools spanning all 8 categories and all 6 chains)
-- Constraints:
--   status = 'approved', approved_at = NOW()
--   short_description <= 140 characters
--   contact_email NOT NULL, website_url NOT NULL
--   slug: lowercase, hyphens only, URL-safe
-- ---------------------------------------------------------------------------

-- 1. Joule Finance — CKB DeFi (Wallets & Payments)
INSERT INTO listings (
    name, slug, short_description, description,
    website_url, github_url, docs_url, contact_email,
    status, approved_at
) VALUES (
    'Joule Finance',
    'joule-finance',
    'AI-powered DeFi lending and borrowing protocol on Nervos CKB with real-time risk assessment.',
    E'## Joule Finance\n\nJoule Finance is a next-generation DeFi lending and borrowing protocol built natively on the Nervos CKB blockchain. It leverages AI-driven risk models to dynamically assess collateral health, predict liquidation risk, and optimize interest rate curves in real time — giving both lenders and borrowers a smarter, safer experience.\n\n### Key Features\n\n- **AI Risk Engine**: Continuous on-chain monitoring of collateral ratios using machine-learning models trained on historical liquidation data across DeFi protocols.\n- **Dynamic Interest Rates**: Algorithmic rate adjustment that responds to market conditions faster than traditional AMM governance cycles.\n- **CKB-native Asset Support**: First-class support for CKB, xUDT tokens, and RGB++ assets as collateral types.\n- **Agent-Accessible API**: Programmatic endpoints for AI agents to query positions, simulate loans, and manage portfolios without human interaction.\n\n### Use Cases\n\nJoule Finance is ideal for DeFi power users seeking capital efficiency on CKB, AI agents managing on-chain treasuries, and developers building automated yield strategies on the Nervos ecosystem.',
    'https://joule.finance',
    NULL,
    'https://docs.joule.finance',
    'contact@joule.finance',
    'approved',
    NOW()
);

-- 2. .bit — CKB Cross-chain Identity (Identity & Reputation)
INSERT INTO listings (
    name, slug, short_description, description,
    website_url, github_url, docs_url, contact_email,
    status, approved_at
) VALUES (
    '.bit',
    'dotbit',
    'Cross-chain decentralized identity protocol on Nervos CKB. One name, usable across all major blockchains.',
    E'## .bit\n\n.bit (formerly DAS — Decentralized Account System) is a cross-chain decentralized identity and account protocol built on Nervos CKB. It provides human-readable account names (e.g., `alice.bit`) that resolve to any blockchain address, data record, or off-chain asset — making it the most interoperable identity layer in Web3.\n\n### Key Features\n\n- **Cross-chain Resolution**: A single `.bit` account maps to Ethereum, Solana, Bitcoin, and CKB addresses simultaneously without bridging.\n- **Programmable Records**: Store arbitrary key-value data (social profiles, DID documents, payment addresses) on-chain, accessible via open REST and GraphQL APIs.\n- **Agent Identity Layer**: AI agents can register `.bit` accounts to establish persistent, cross-chain identity — enabling verifiable agent-to-agent communication.\n- **Sub-account System**: Organizations can issue branded sub-accounts (e.g., `alice.company.bit`) for employees, agents, or customers at scale.\n\n### Use Cases\n\n.bit is used by developers building identity-gated dApps, AI agents that need a stable cross-chain identity, DAOs managing member directories, and users who want a single handle across the entire Web3 ecosystem.',
    'https://did.id',
    'https://github.com/dotbitHQ',
    'https://docs.did.id',
    'contact@did.id',
    'approved',
    NOW()
);

-- 3. Nervape — CKB AI-Enhanced NFTs (Social & Community)
INSERT INTO listings (
    name, slug, short_description, description,
    website_url, github_url, docs_url, contact_email,
    status, approved_at
) VALUES (
    'Nervape',
    'nervape',
    'AI-enhanced composable NFT characters on Nervos CKB. Mix, match, and evolve unique digital beings.',
    E'## Nervape\n\nNervape is an AI-powered composable NFT project built on Nervos CKB that pushes the boundaries of digital ownership and community storytelling. Each Nervape character is made up of independently tradeable on-chain components — head, body, hand, and scene — that can be freely composed, remixed, and evolved using AI generation tools.\n\n### Key Features\n\n- **Composable On-chain Assets**: All components are stored natively on CKB using the RGB++ protocol, ensuring true on-chain ownership without IPFS or centralized storage dependencies.\n- **AI Story Engine**: Community members can interact with AI-powered narrative tools to generate backstories, quests, and lore for their Nervape characters.\n- **Scene NFTs**: Unique background scenes that dynamically interact with character traits — AI determines compatibility scores and suggests optimal pairings.\n- **Cross-chain Composability**: RGB++ allows Nervape assets to move between CKB and Bitcoin layers while retaining their composable properties.\n\n### Use Cases\n\nNervape is for collectors who want provably scarce, fully on-chain digital art, communities building shared universes around AI-generated lore, and developers exploring composable NFT standards on CKB.',
    'https://www.nervape.com',
    'https://github.com/nervapeProject',
    NULL,
    'info@nervape.com',
    'approved',
    NOW()
);

-- 4. Autonolas — Multi-chain Autonomous Agent Services (Marketplaces & Task Coordination)
INSERT INTO listings (
    name, slug, short_description, description,
    website_url, github_url, docs_url, api_endpoint_url, contact_email,
    status, approved_at
) VALUES (
    'Autonolas',
    'autonolas',
    'Open-source platform for building, deploying, and monetizing autonomous AI agent services on-chain.',
    E'## Autonolas\n\nAutonolas is an open-source stack for creating and operating autonomous multi-agent services that live on blockchains. Rather than one-shot LLM calls, Autonolas agents run as persistent processes — they observe on-chain and off-chain data, make decisions via consensus, and execute transactions without human intervention.\n\n### Key Features\n\n- **Agent Service Framework**: Build autonomous services composed of multiple AI agents that reach consensus before acting — no single point of failure or control.\n- **On-chain Registry**: Autonomous agent services are registered as NFTs on-chain, making them discoverable, auditable, and monetizable by anyone.\n- **Multi-chain Execution**: Services currently support Ethereum, Gnosis Chain, Polygon, and Solana — with pluggable adapters for extending to new chains.\n- **Olas Protocol**: The native OLAS token incentivizes agent builders and operators through a code contribution and staking mechanism.\n\n### Use Cases\n\nAutonolas is used by DeFi protocols needing keeper bots that are decentralized and censorship-resistant, DAOs automating treasury management and governance execution, and AI developers who want to monetize agent logic on-chain.',
    'https://olas.network',
    'https://github.com/valory-xyz/open-autonomy',
    'https://docs.olas.network',
    'https://olas.network/api',
    'info@valory.xyz',
    'approved',
    NOW()
);

-- 5. Fetch.ai — Multi-chain AI Agent Network (Marketplaces & Task Coordination)
INSERT INTO listings (
    name, slug, short_description, description,
    website_url, github_url, docs_url, api_endpoint_url, contact_email,
    status, approved_at
) VALUES (
    'Fetch.ai',
    'fetch-ai',
    'Decentralized AI agent network enabling autonomous economic activity across multiple blockchains.',
    E'## Fetch.ai\n\nFetch.ai is a decentralized AI agent network that lets anyone deploy software agents capable of performing tasks and transacting autonomously. Founded in 2017 and operating its own Cosmos-SDK blockchain, Fetch.ai provides the infrastructure for a machine-to-machine economy where agents negotiate, transact, and collaborate without human oversight.\n\n### Key Features\n\n- **uAgents Framework**: Python SDK for building lightweight autonomous agents that communicate via the Agent Communication Protocol (ACP) — an open standard for agent-to-agent messaging.\n- **Agentverse**: A hosted platform for deploying, discovering, and connecting agents — think of it as an app store for autonomous AI services.\n- **DeltaV**: A natural language interface that routes user requests to the most appropriate registered agent, bridging LLM chat with on-chain agent execution.\n- **FET Token**: Powers transactions between agents and incentivizes node operators securing the Fetch network.\n\n### Use Cases\n\nFetch.ai is ideal for supply chain automation, DeFi yield optimization bots, decentralized oracle networks, and any scenario where multiple software agents must coordinate without a central orchestrator.',
    'https://fetch.ai',
    'https://github.com/fetchai',
    'https://docs.fetch.ai',
    'https://agentverse.ai/api/v1',
    'contact@fetch.ai',
    'approved',
    NOW()
);

-- 6. SingularityNET — Ethereum AI Marketplace (Marketplaces & Task Coordination)
INSERT INTO listings (
    name, slug, short_description, description,
    website_url, github_url, docs_url, api_endpoint_url, contact_email,
    status, approved_at
) VALUES (
    'SingularityNET',
    'singularitynet',
    'Decentralized marketplace for AI services. Publish, discover, and monetize AI algorithms on-chain.',
    E'## SingularityNET\n\nSingularityNET is the world''s first decentralized AI marketplace, founded by Dr. Ben Goertzel and the team behind the Sophia robot. It enables any developer to publish AI services — from image recognition to natural language processing — to a global marketplace where buyers pay using the AGIX token.\n\n### Key Features\n\n- **AI Service Marketplace**: Browse and purchase access to hundreds of AI services across NLP, computer vision, data analysis, and autonomous agent tools — all accessible via standardized API calls.\n- **Multi-AI Framework**: Supports heterogeneous AI systems including deep learning models, symbolic AI, and evolutionary algorithms — services can be composed into pipelines.\n- **Daemon Architecture**: Each AI service runs behind a snet-daemon sidecar that handles blockchain payments, request routing, and usage metering without touching the core model.\n- **OpenCog Hyperon Integration**: SingularityNET is building toward AGI-level capabilities through the OpenCog Hyperon cognitive architecture, with on-chain coordination between specialized sub-agents.\n\n### Use Cases\n\nSingularityNET serves AI researchers who want to monetize models, enterprises needing composable AI capabilities on-demand, and developers building agentic pipelines that chain multiple specialized AI services.',
    'https://singularitynet.io',
    'https://github.com/singnet',
    'https://dev.singularitynet.io',
    'https://beta.singularitynet.io/api',
    'info@singularitynet.io',
    'approved',
    NOW()
);

-- 7. Chainlink Functions — Ethereum Serverless Compute (Developer Tools & Infrastructure)
INSERT INTO listings (
    name, slug, short_description, description,
    website_url, github_url, docs_url, api_endpoint_url, contact_email,
    status, approved_at
) VALUES (
    'Chainlink Functions',
    'chainlink-functions',
    'Serverless compute for smart contracts: fetch any API, run custom JavaScript, and bring results on-chain.',
    E'## Chainlink Functions\n\nChainlink Functions is a serverless compute layer that lets smart contracts fetch data from any web2 API, run custom JavaScript logic, and bring the results on-chain — all secured by Chainlink''s decentralized oracle network. It eliminates the need to stand up backend infrastructure for off-chain data access.\n\n### Key Features\n\n- **Any-API Access**: Query REST APIs, GraphQL endpoints, or any public data source from within a smart contract execution context — no centralized relay required.\n- **Custom JavaScript**: Write arbitrary JS code (up to 10KB) that runs inside a Chainlink DON node''s sandboxed environment, enabling complex data transformations and AI inference calls.\n- **AI Integration**: Use Chainlink Functions to call LLM APIs (OpenAI, Anthropic, etc.) from smart contracts — enabling on-chain decisions driven by off-chain AI inference.\n- **Decentralized Trust**: Results are aggregated across multiple DON nodes, providing trust-minimized data delivery without relying on a single operator.\n\n### Use Cases\n\nChainlink Functions is used by prediction markets needing off-chain resolution logic, DeFi protocols integrating AI risk scores, NFT projects with dynamic metadata driven by external APIs, and autonomous agents that need to bridge on-chain and off-chain computation.',
    'https://chain.link/functions',
    'https://github.com/smartcontractkit/functions-hardhat-starter-kit',
    'https://docs.chain.link/chainlink-functions',
    NULL,
    'devrel@smartcontract.com',
    'approved',
    NOW()
);

-- 8. Ocean Protocol — Ethereum Data Marketplace (Data & Analytics)
INSERT INTO listings (
    name, slug, short_description, description,
    website_url, github_url, docs_url, api_endpoint_url, contact_email,
    status, approved_at
) VALUES (
    'Ocean Protocol',
    'ocean-protocol',
    'Decentralized data exchange for AI training data. Publish, discover, and monetize datasets on-chain.',
    E'## Ocean Protocol\n\nOcean Protocol is a decentralized data exchange protocol that makes data assets publishable, discoverable, and monetizable as on-chain tokens. It is purpose-built for the AI economy — enabling data providers to sell training datasets and model outputs without losing control of the underlying data.\n\n### Key Features\n\n- **Data NFTs and Datatokens**: Every dataset is wrapped in a Data NFT (ownership) and an associated Datatoken (access right) — enabling granular, programmable data licensing via DeFi primitives.\n- **Compute-to-Data**: Run AI model training directly against private datasets without the data ever leaving the provider''s infrastructure — privacy-preserving ML at scale.\n- **Ocean Market**: An open marketplace for discovering and purchasing datasets, pre-trained models, and data services — searchable by category, price, and quality score.\n- **Data Farming**: Liquidity mining rewards for data providers who stake assets and contribute high-quality datasets — aligning incentives between publishers and consumers.\n\n### Use Cases\n\nOcean Protocol is ideal for AI companies needing diverse training data, researchers sharing datasets without surrendering IP, enterprises monetizing proprietary data assets, and autonomous agents that programmatically purchase data feeds.',
    'https://oceanprotocol.com',
    'https://github.com/oceanprotocol',
    'https://docs.oceanprotocol.com',
    'https://v4.aquarius.oceanprotocol.com',
    'info@oceanprotocol.com',
    'approved',
    NOW()
);

-- 9. Bittensor — Chain-agnostic Decentralized ML Network (Data & Analytics)
INSERT INTO listings (
    name, slug, short_description, description,
    website_url, github_url, docs_url, api_endpoint_url, contact_email,
    status, approved_at
) VALUES (
    'Bittensor',
    'bittensor',
    'Decentralized machine learning network where AI models compete, collaborate, and earn TAO rewards.',
    E'## Bittensor\n\nBittensor is a decentralized protocol that creates a machine learning marketplace on an open, permissionless blockchain. Instead of centralizing AI training at large technology companies, Bittensor incentivizes a global network of miners to run ML models and validators to rank their outputs — with TAO tokens rewarding the most useful contributions.\n\n### Key Features\n\n- **Subnet Architecture**: Bittensor is organized into specialized subnets — each subnet is an independent AI market focused on a specific task (text generation, image synthesis, data scraping, trading signals, etc.).\n- **Yuma Consensus**: A Byzantine-fault-tolerant consensus mechanism where validators rank miner outputs; miners that produce the most useful results earn the highest TAO emissions.\n- **Open Weights**: All models on the network are forced toward open collaboration — winning strategies propagate through the network, accelerating collective intelligence.\n- **TAO Token**: The native currency used to pay for inference, reward miners and validators, and stake into subnet governance.\n\n### Use Cases\n\nBittensor is used by AI researchers monetizing model weights without centralized gatekeepers, developers purchasing decentralized inference at competitive rates, and investors seeking exposure to decentralized AI infrastructure through TAO staking.',
    'https://bittensor.com',
    'https://github.com/opentensor/bittensor',
    'https://docs.bittensor.com',
    'https://api.corcel.io/v1',
    'hello@opentensor.ai',
    'approved',
    NOW()
);

-- 10. XMTP — Multi-chain Messaging Protocol (Communication & Messaging)
INSERT INTO listings (
    name, slug, short_description, description,
    website_url, github_url, docs_url, api_endpoint_url, contact_email,
    status, approved_at
) VALUES (
    'XMTP',
    'xmtp',
    'Open messaging protocol for web3. Enable AI agents to send and receive encrypted messages across wallets.',
    E'## XMTP\n\nXMTP (Extensible Message Transport Protocol) is an open and decentralized messaging protocol that enables secure, end-to-end encrypted communication between any two blockchain wallet addresses. It is rapidly becoming the standard communication layer for AI agents operating across web3 — enabling agent-to-agent, agent-to-human, and agent-to-smart-contract messaging.\n\n### Key Features\n\n- **Wallet-native Identity**: Messages are addressed to wallet addresses, not phone numbers or emails — no centralized account creation required.\n- **End-to-end Encryption**: All messages are encrypted using the Double Ratchet algorithm (same as Signal) with keys derived from wallet signatures.\n- **AI Agent Inboxes**: XMTP provides a standardized inbox that AI agents can poll or subscribe to — enabling agents to receive task requests, status updates, and payment notifications programmatically.\n- **Multi-chain Address Support**: Works with Ethereum, Solana, and any EVM-compatible chain address, making it chain-agnostic at the identity layer.\n\n### Use Cases\n\nXMTP powers AI concierge bots embedded in wallet UIs, autonomous agents that notify users of on-chain events, agent-to-agent coordination channels, and cross-dApp messaging for decentralized social protocols.',
    'https://xmtp.org',
    'https://github.com/xmtp',
    'https://docs.xmtp.org',
    'https://api.xmtp.org',
    'contact@xmtp.org',
    'approved',
    NOW()
);

-- 11. Lit Protocol — Multi-chain Decentralized Key Management (Developer Tools & Infrastructure)
INSERT INTO listings (
    name, slug, short_description, description,
    website_url, github_url, docs_url, api_endpoint_url, contact_email,
    status, approved_at
) VALUES (
    'Lit Protocol',
    'lit-protocol',
    'Decentralized key management and serverless compute for AI agents. Sign, encrypt, and act autonomously.',
    E'## Lit Protocol\n\nLit Protocol is a decentralized key management network that enables AI agents and applications to perform cryptographic actions — signing transactions, decrypting content, executing conditional logic — without exposing private keys to any single party. It is the trust layer for autonomous agents operating across web3.\n\n### Key Features\n\n- **Programmable Key Pairs (PKPs)**: Mint NFT-controlled cryptographic key pairs whose signing permissions are governed by on-chain conditions and Lit Actions — no one entity ever holds the full private key.\n- **Lit Actions**: JavaScript functions executed in a distributed TEE environment that define the conditions under which a PKP will sign — enabling rule-based agent autonomy.\n- **Agent Wallets**: AI agents can own and control PKP-based wallets, allowing them to hold assets, sign transactions, and interact with any blockchain without custody risk.\n- **Decentralized Encryption**: Encrypt files or messages such that decryption requires satisfying an on-chain condition (e.g., owning an NFT, holding a token balance, passing a DAO vote).\n\n### Use Cases\n\nLit Protocol is essential for AI agents that need autonomous signing capabilities, applications requiring privacy-preserving data access control, cross-chain automation that needs to sign on multiple networks, and DAOs automating treasury operations without multisig overhead.',
    'https://litprotocol.com',
    'https://github.com/LIT-Protocol',
    'https://developer.litprotocol.com',
    NULL,
    'hello@litprotocol.com',
    'approved',
    NOW()
);

-- 12. Phala Network — Multi-chain Confidential AI Execution (Developer Tools & Infrastructure)
INSERT INTO listings (
    name, slug, short_description, description,
    website_url, github_url, docs_url, api_endpoint_url, contact_email,
    status, approved_at
) VALUES (
    'Phala Network',
    'phala-network',
    'Confidential AI agent execution in Trusted Execution Environments. Verifiable off-chain compute for web3.',
    E'## Phala Network\n\nPhala Network is a decentralized cloud computing protocol that runs smart contracts and AI agents inside Trusted Execution Environments (TEEs) — isolated hardware enclaves that provide verifiable confidentiality and integrity guarantees. It enables the next generation of autonomous agents that can operate on sensitive data without revealing it to any party, including Phala itself.\n\n### Key Features\n\n- **Phat Contracts**: WebAssembly smart contracts that run inside TEEs with access to HTTP requests, persistent storage, and cryptographic signing — enabling agents to interact with web2 and web3 simultaneously.\n- **AI Agent Workers**: Deploy LLM-powered agents inside TEEs that can access private API keys, user data, and wallet credentials without trusting any intermediary.\n- **Verifiable Attestation**: Every computation generates a cryptographic attestation that anyone can verify on-chain — providing proof that the AI ran the specified code on the specified inputs.\n- **Cross-chain Automation**: Phat Contracts can read from and write to any EVM chain, Substrate network, or REST API, making Phala a universal off-chain compute layer.\n\n### Use Cases\n\nPhala is used for confidential trading bots that must protect strategy logic, AI agents handling private user data, cross-chain automation triggered by off-chain events, and any application where verifiable off-chain computation is a security requirement.',
    'https://phala.network',
    'https://github.com/Phala-Network',
    'https://docs.phala.network',
    'https://api.phala.network/phat',
    'hello@phala.network',
    'approved',
    NOW()
);

-- 13. Solana Agent Kit — Solana SDK (Developer Tools & Infrastructure)
INSERT INTO listings (
    name, slug, short_description, description,
    website_url, github_url, docs_url, contact_email,
    status, approved_at
) VALUES (
    'Solana Agent Kit',
    'solana-agent-kit',
    'Open-source TypeScript SDK for building AI agents that interact with the Solana ecosystem autonomously.',
    E'## Solana Agent Kit\n\nSolana Agent Kit is an open-source TypeScript library that gives AI agents and LLM-powered applications the ability to interact with the full Solana ecosystem — DeFi protocols, NFT marketplaces, token programs, and more — through a unified, LLM-friendly interface. It is the fastest way to go from "I want an AI agent on Solana" to a working prototype.\n\n### Key Features\n\n- **LLM Tool Integration**: All Solana actions are exposed as LangChain tools and LlamaIndex functions — plug directly into any LLM orchestration framework without writing custom adapters.\n- **60+ Actions**: Swap tokens on Jupiter, mint NFTs on Metaplex, launch SPL tokens, stake SOL, interact with lending protocols, and more — all available as single function calls.\n- **Autonomous Execution**: Agents can chain multiple Solana actions together based on LLM reasoning — e.g., check a price, determine a trade, execute a swap, and send a confirmation message.\n- **Wallet Management**: Built-in Solana wallet handling with support for both server-side keypairs and user-connected wallets via wallet adapter integration.\n\n### Use Cases\n\nSolana Agent Kit is the go-to SDK for hackathon teams building AI-powered DeFi bots, developers adding Solana capabilities to existing LLM apps, autonomous trading agents that need access to Solana liquidity, and AI assistants that help users manage their Solana portfolios.',
    'https://www.solanaagentkit.xyz',
    'https://github.com/sendaifun/solana-agent-kit',
    'https://docs.solanaagentkit.xyz',
    'contact@sendaifun.com',
    'approved',
    NOW()
);

-- 14. Ordinals AI — Bitcoin AI Tooling (Other)
INSERT INTO listings (
    name, slug, short_description, description,
    website_url, github_url, contact_email,
    status, approved_at
) VALUES (
    'Ordinals AI',
    'ordinals-ai',
    'AI-powered tools for creating, analyzing, and trading Bitcoin Ordinals inscriptions and BRC-20 tokens.',
    E'## Ordinals AI\n\nOrdinals AI is a suite of AI-powered tools built specifically for the Bitcoin Ordinals ecosystem. It combines generative AI for on-chain inscription creation with intelligent analytics for tracking Ordinals collections, BRC-20 token markets, and Rune protocol activity — all without leaving the Bitcoin base layer.\n\n### Key Features\n\n- **AI Inscription Generator**: Create unique, generative pixel art, text, and SVG inscriptions using AI models tuned on existing Ordinals aesthetics — inscribe directly from the browser.\n- **Collection Analytics**: LLM-powered floor price analysis, rarity ranking, and whale wallet tracking for all major Ordinals collections — updated in real time from mempool and inscription indexers.\n- **BRC-20 Intelligence**: Autonomous market monitoring for BRC-20 tokens with configurable alert agents that notify users of significant price movements, large transfers, or minting activity.\n- **Rune Protocol Support**: Early support for analyzing and minting Bitcoin Runes with AI-assisted naming, supply modeling, and distribution strategy recommendations.\n\n### Use Cases\n\nOrdinals AI is used by Bitcoin NFT collectors seeking an edge in new collection launches, traders monitoring BRC-20 markets with AI-powered signal generation, artists who want to create and inscribe generative art without coding, and developers building Ordinals-native applications.',
    'https://ordinalsai.xyz',
    NULL,
    'hello@ordinalsai.xyz',
    'approved',
    NOW()
);

-- ---------------------------------------------------------------------------
-- Junction table: listing_categories
-- Each listing gets 1-2 categories. All 8 categories must be represented.
-- ---------------------------------------------------------------------------

-- Joule Finance -> Wallets & Payments
INSERT INTO listing_categories (listing_id, category_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'joule-finance'),
    (SELECT id FROM categories WHERE slug = 'wallets-payments')
);

-- .bit -> Identity & Reputation
INSERT INTO listing_categories (listing_id, category_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'dotbit'),
    (SELECT id FROM categories WHERE slug = 'identity-reputation')
);

-- Nervape -> Social & Community
INSERT INTO listing_categories (listing_id, category_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'nervape'),
    (SELECT id FROM categories WHERE slug = 'social-community')
);

-- Autonolas -> Marketplaces & Task Coordination
INSERT INTO listing_categories (listing_id, category_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'autonolas'),
    (SELECT id FROM categories WHERE slug = 'marketplaces-task-coordination')
);

-- Fetch.ai -> Marketplaces & Task Coordination
INSERT INTO listing_categories (listing_id, category_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'fetch-ai'),
    (SELECT id FROM categories WHERE slug = 'marketplaces-task-coordination')
);

-- SingularityNET -> Marketplaces & Task Coordination
INSERT INTO listing_categories (listing_id, category_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'singularitynet'),
    (SELECT id FROM categories WHERE slug = 'marketplaces-task-coordination')
);

-- Chainlink Functions -> Developer Tools & Infrastructure
INSERT INTO listing_categories (listing_id, category_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'chainlink-functions'),
    (SELECT id FROM categories WHERE slug = 'developer-tools-infrastructure')
);

-- Chainlink Functions also -> Data & Analytics (it feeds data on-chain)
INSERT INTO listing_categories (listing_id, category_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'chainlink-functions'),
    (SELECT id FROM categories WHERE slug = 'data-analytics')
);

-- Ocean Protocol -> Data & Analytics
INSERT INTO listing_categories (listing_id, category_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'ocean-protocol'),
    (SELECT id FROM categories WHERE slug = 'data-analytics')
);

-- Bittensor -> Data & Analytics
INSERT INTO listing_categories (listing_id, category_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'bittensor'),
    (SELECT id FROM categories WHERE slug = 'data-analytics')
);

-- XMTP -> Communication & Messaging
INSERT INTO listing_categories (listing_id, category_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'xmtp'),
    (SELECT id FROM categories WHERE slug = 'communication-messaging')
);

-- Lit Protocol -> Developer Tools & Infrastructure
INSERT INTO listing_categories (listing_id, category_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'lit-protocol'),
    (SELECT id FROM categories WHERE slug = 'developer-tools-infrastructure')
);

-- Phala Network -> Developer Tools & Infrastructure
INSERT INTO listing_categories (listing_id, category_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'phala-network'),
    (SELECT id FROM categories WHERE slug = 'developer-tools-infrastructure')
);

-- Solana Agent Kit -> Developer Tools & Infrastructure
INSERT INTO listing_categories (listing_id, category_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'solana-agent-kit'),
    (SELECT id FROM categories WHERE slug = 'developer-tools-infrastructure')
);

-- Ordinals AI -> Other
INSERT INTO listing_categories (listing_id, category_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'ordinals-ai'),
    (SELECT id FROM categories WHERE slug = 'other')
);

-- ---------------------------------------------------------------------------
-- Junction table: listing_chains
-- All 6 chains must be represented. CKB gets 3+ listings.
-- ---------------------------------------------------------------------------

-- Joule Finance -> CKB (Nervos)
INSERT INTO listing_chains (listing_id, chain_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'joule-finance'),
    (SELECT id FROM chain_support WHERE slug = 'ckb')
);

-- .bit -> CKB (Nervos)
INSERT INTO listing_chains (listing_id, chain_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'dotbit'),
    (SELECT id FROM chain_support WHERE slug = 'ckb')
);

-- Nervape -> CKB (Nervos)
INSERT INTO listing_chains (listing_id, chain_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'nervape'),
    (SELECT id FROM chain_support WHERE slug = 'ckb')
);

-- Autonolas -> Multi-chain
INSERT INTO listing_chains (listing_id, chain_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'autonolas'),
    (SELECT id FROM chain_support WHERE slug = 'multi-chain')
);

-- Fetch.ai -> Multi-chain
INSERT INTO listing_chains (listing_id, chain_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'fetch-ai'),
    (SELECT id FROM chain_support WHERE slug = 'multi-chain')
);

-- SingularityNET -> Ethereum
INSERT INTO listing_chains (listing_id, chain_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'singularitynet'),
    (SELECT id FROM chain_support WHERE slug = 'ethereum')
);

-- Chainlink Functions -> Ethereum
INSERT INTO listing_chains (listing_id, chain_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'chainlink-functions'),
    (SELECT id FROM chain_support WHERE slug = 'ethereum')
);

-- Ocean Protocol -> Ethereum
INSERT INTO listing_chains (listing_id, chain_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'ocean-protocol'),
    (SELECT id FROM chain_support WHERE slug = 'ethereum')
);

-- Bittensor -> Chain-agnostic
INSERT INTO listing_chains (listing_id, chain_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'bittensor'),
    (SELECT id FROM chain_support WHERE slug = 'chain-agnostic')
);

-- XMTP -> Multi-chain
INSERT INTO listing_chains (listing_id, chain_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'xmtp'),
    (SELECT id FROM chain_support WHERE slug = 'multi-chain')
);

-- Lit Protocol -> Multi-chain
INSERT INTO listing_chains (listing_id, chain_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'lit-protocol'),
    (SELECT id FROM chain_support WHERE slug = 'multi-chain')
);

-- Phala Network -> Multi-chain
INSERT INTO listing_chains (listing_id, chain_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'phala-network'),
    (SELECT id FROM chain_support WHERE slug = 'multi-chain')
);

-- Solana Agent Kit -> Solana
INSERT INTO listing_chains (listing_id, chain_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'solana-agent-kit'),
    (SELECT id FROM chain_support WHERE slug = 'solana')
);

-- Ordinals AI -> Bitcoin
INSERT INTO listing_chains (listing_id, chain_id)
VALUES (
    (SELECT id FROM listings WHERE slug = 'ordinals-ai'),
    (SELECT id FROM chain_support WHERE slug = 'bitcoin')
);

-- ---------------------------------------------------------------------------
-- Junction table: listing_tags
-- Each listing gets 2-4 relevant tags.
-- ---------------------------------------------------------------------------

-- Joule Finance: defi, ai-agent, smart-contract, payments
INSERT INTO listing_tags (listing_id, tag_id)
VALUES
    ((SELECT id FROM listings WHERE slug = 'joule-finance'), (SELECT id FROM tags WHERE slug = 'defi')),
    ((SELECT id FROM listings WHERE slug = 'joule-finance'), (SELECT id FROM tags WHERE slug = 'ai-agent')),
    ((SELECT id FROM listings WHERE slug = 'joule-finance'), (SELECT id FROM tags WHERE slug = 'smart-contract')),
    ((SELECT id FROM listings WHERE slug = 'joule-finance'), (SELECT id FROM tags WHERE slug = 'payments'));

-- .bit: identity, cross-chain, api, autonomous
INSERT INTO listing_tags (listing_id, tag_id)
VALUES
    ((SELECT id FROM listings WHERE slug = 'dotbit'), (SELECT id FROM tags WHERE slug = 'identity')),
    ((SELECT id FROM listings WHERE slug = 'dotbit'), (SELECT id FROM tags WHERE slug = 'cross-chain')),
    ((SELECT id FROM listings WHERE slug = 'dotbit'), (SELECT id FROM tags WHERE slug = 'api')),
    ((SELECT id FROM listings WHERE slug = 'dotbit'), (SELECT id FROM tags WHERE slug = 'autonomous'));

-- Nervape: nft, ai-agent, sdk
INSERT INTO listing_tags (listing_id, tag_id)
VALUES
    ((SELECT id FROM listings WHERE slug = 'nervape'), (SELECT id FROM tags WHERE slug = 'nft')),
    ((SELECT id FROM listings WHERE slug = 'nervape'), (SELECT id FROM tags WHERE slug = 'ai-agent')),
    ((SELECT id FROM listings WHERE slug = 'nervape'), (SELECT id FROM tags WHERE slug = 'sdk'));

-- Autonolas: ai-agent, autonomous, dao, infrastructure
INSERT INTO listing_tags (listing_id, tag_id)
VALUES
    ((SELECT id FROM listings WHERE slug = 'autonolas'), (SELECT id FROM tags WHERE slug = 'ai-agent')),
    ((SELECT id FROM listings WHERE slug = 'autonolas'), (SELECT id FROM tags WHERE slug = 'autonomous')),
    ((SELECT id FROM listings WHERE slug = 'autonolas'), (SELECT id FROM tags WHERE slug = 'dao')),
    ((SELECT id FROM listings WHERE slug = 'autonolas'), (SELECT id FROM tags WHERE slug = 'infrastructure'));

-- Fetch.ai: ai-agent, autonomous, api, cross-chain
INSERT INTO listing_tags (listing_id, tag_id)
VALUES
    ((SELECT id FROM listings WHERE slug = 'fetch-ai'), (SELECT id FROM tags WHERE slug = 'ai-agent')),
    ((SELECT id FROM listings WHERE slug = 'fetch-ai'), (SELECT id FROM tags WHERE slug = 'autonomous')),
    ((SELECT id FROM listings WHERE slug = 'fetch-ai'), (SELECT id FROM tags WHERE slug = 'api')),
    ((SELECT id FROM listings WHERE slug = 'fetch-ai'), (SELECT id FROM tags WHERE slug = 'cross-chain'));

-- SingularityNET: ai-agent, machine-learning, api, llm
INSERT INTO listing_tags (listing_id, tag_id)
VALUES
    ((SELECT id FROM listings WHERE slug = 'singularitynet'), (SELECT id FROM tags WHERE slug = 'ai-agent')),
    ((SELECT id FROM listings WHERE slug = 'singularitynet'), (SELECT id FROM tags WHERE slug = 'machine-learning')),
    ((SELECT id FROM listings WHERE slug = 'singularitynet'), (SELECT id FROM tags WHERE slug = 'api')),
    ((SELECT id FROM listings WHERE slug = 'singularitynet'), (SELECT id FROM tags WHERE slug = 'llm'));

-- Chainlink Functions: oracle, smart-contract, api, infrastructure
INSERT INTO listing_tags (listing_id, tag_id)
VALUES
    ((SELECT id FROM listings WHERE slug = 'chainlink-functions'), (SELECT id FROM tags WHERE slug = 'oracle')),
    ((SELECT id FROM listings WHERE slug = 'chainlink-functions'), (SELECT id FROM tags WHERE slug = 'smart-contract')),
    ((SELECT id FROM listings WHERE slug = 'chainlink-functions'), (SELECT id FROM tags WHERE slug = 'api')),
    ((SELECT id FROM listings WHERE slug = 'chainlink-functions'), (SELECT id FROM tags WHERE slug = 'infrastructure'));

-- Ocean Protocol: analytics, machine-learning, api, privacy
INSERT INTO listing_tags (listing_id, tag_id)
VALUES
    ((SELECT id FROM listings WHERE slug = 'ocean-protocol'), (SELECT id FROM tags WHERE slug = 'analytics')),
    ((SELECT id FROM listings WHERE slug = 'ocean-protocol'), (SELECT id FROM tags WHERE slug = 'machine-learning')),
    ((SELECT id FROM listings WHERE slug = 'ocean-protocol'), (SELECT id FROM tags WHERE slug = 'api')),
    ((SELECT id FROM listings WHERE slug = 'ocean-protocol'), (SELECT id FROM tags WHERE slug = 'privacy'));

-- Bittensor: machine-learning, llm, infrastructure, autonomous
INSERT INTO listing_tags (listing_id, tag_id)
VALUES
    ((SELECT id FROM listings WHERE slug = 'bittensor'), (SELECT id FROM tags WHERE slug = 'machine-learning')),
    ((SELECT id FROM listings WHERE slug = 'bittensor'), (SELECT id FROM tags WHERE slug = 'llm')),
    ((SELECT id FROM listings WHERE slug = 'bittensor'), (SELECT id FROM tags WHERE slug = 'infrastructure')),
    ((SELECT id FROM listings WHERE slug = 'bittensor'), (SELECT id FROM tags WHERE slug = 'autonomous'));

-- XMTP: ai-agent, api, cross-chain, chatbot
INSERT INTO listing_tags (listing_id, tag_id)
VALUES
    ((SELECT id FROM listings WHERE slug = 'xmtp'), (SELECT id FROM tags WHERE slug = 'ai-agent')),
    ((SELECT id FROM listings WHERE slug = 'xmtp'), (SELECT id FROM tags WHERE slug = 'api')),
    ((SELECT id FROM listings WHERE slug = 'xmtp'), (SELECT id FROM tags WHERE slug = 'cross-chain')),
    ((SELECT id FROM listings WHERE slug = 'xmtp'), (SELECT id FROM tags WHERE slug = 'chatbot'));

-- Lit Protocol: privacy, infrastructure, sdk, autonomous
INSERT INTO listing_tags (listing_id, tag_id)
VALUES
    ((SELECT id FROM listings WHERE slug = 'lit-protocol'), (SELECT id FROM tags WHERE slug = 'privacy')),
    ((SELECT id FROM listings WHERE slug = 'lit-protocol'), (SELECT id FROM tags WHERE slug = 'infrastructure')),
    ((SELECT id FROM listings WHERE slug = 'lit-protocol'), (SELECT id FROM tags WHERE slug = 'sdk')),
    ((SELECT id FROM listings WHERE slug = 'lit-protocol'), (SELECT id FROM tags WHERE slug = 'autonomous'));

-- Phala Network: privacy, infrastructure, ai-agent, smart-contract
INSERT INTO listing_tags (listing_id, tag_id)
VALUES
    ((SELECT id FROM listings WHERE slug = 'phala-network'), (SELECT id FROM tags WHERE slug = 'privacy')),
    ((SELECT id FROM listings WHERE slug = 'phala-network'), (SELECT id FROM tags WHERE slug = 'infrastructure')),
    ((SELECT id FROM listings WHERE slug = 'phala-network'), (SELECT id FROM tags WHERE slug = 'ai-agent')),
    ((SELECT id FROM listings WHERE slug = 'phala-network'), (SELECT id FROM tags WHERE slug = 'smart-contract'));

-- Solana Agent Kit: sdk, ai-agent, developer-tools, autonomous
INSERT INTO listing_tags (listing_id, tag_id)
VALUES
    ((SELECT id FROM listings WHERE slug = 'solana-agent-kit'), (SELECT id FROM tags WHERE slug = 'sdk')),
    ((SELECT id FROM listings WHERE slug = 'solana-agent-kit'), (SELECT id FROM tags WHERE slug = 'ai-agent')),
    ((SELECT id FROM listings WHERE slug = 'solana-agent-kit'), (SELECT id FROM tags WHERE slug = 'developer-tools')),
    ((SELECT id FROM listings WHERE slug = 'solana-agent-kit'), (SELECT id FROM tags WHERE slug = 'autonomous'));

-- Ordinals AI: nft, ai-agent, analytics, machine-learning
INSERT INTO listing_tags (listing_id, tag_id)
VALUES
    ((SELECT id FROM listings WHERE slug = 'ordinals-ai'), (SELECT id FROM tags WHERE slug = 'nft')),
    ((SELECT id FROM listings WHERE slug = 'ordinals-ai'), (SELECT id FROM tags WHERE slug = 'ai-agent')),
    ((SELECT id FROM listings WHERE slug = 'ordinals-ai'), (SELECT id FROM tags WHERE slug = 'analytics')),
    ((SELECT id FROM listings WHERE slug = 'ordinals-ai'), (SELECT id FROM tags WHERE slug = 'machine-learning'));

-- ---------------------------------------------------------------------------
-- Update denormalized listing_count on categories and tags
-- Must reflect actual junction table row counts.
-- ---------------------------------------------------------------------------

UPDATE categories SET listing_count = (
    SELECT COUNT(*) FROM listing_categories WHERE category_id = categories.id
);

UPDATE tags SET listing_count = (
    SELECT COUNT(*) FROM listing_tags WHERE tag_id = tags.id
);

COMMIT;
