
import { DevProject } from '../types';

export const JULY_2025_PROJECTS: DevProject[] = [
    {
        username: "pubgcarporation",
        projectName: "Confidential Vote",
        repoUrl: "https://github.com/pubgcarporation/confidential-vote",
        description: "A decentralized confidential voting system built with Solidity and Fully Homomorphic Encryption (FHE) using the FHEVM framework. Features encrypted ballots, proposal management, and audit trails.",
        prize: "$1,000",
        demoUrl: "https://confidential-voting-xcpb.vercel.app/"
    },
    {
        username: "PrivacyPad",
        projectName: "Privacy Pad",
        repoUrl: "https://github.com/PrivacyPad",
        description: "A decentralized launchpad using FHE via Zama to enable private participation in token sales. Users invest with cWETH, keeping contributions encrypted until the sale ends.",
        prize: "$1,000",
        demoUrl: "https://launchpad-interface-eight.vercel.app/",
        videoUrl: "https://drive.google.com/drive/folders/1qVWWKMerpkDfAW2cw7hoYnB8EopLcnS1"
    },
    {
        username: "Web3StudyGroup",
        projectName: "Encrypted Transfer Platform",
        repoUrl: "https://github.com/Web3StudyGroup/Secret_Platform",
        description: "Users can wrap USDT into FHE-encrypted cUSDT and transfer arbitrary amounts between addresses privately. Supports encrypted claims by designated addresses.",
        prize: "$1,000",
        videoUrl: "https://drive.google.com/open?id=1tcaJDA4Ap_Ip2qMDgK5tvcdL3H3celjb"
    },
    {
        username: "chenlike",
        projectName: "Hush",
        repoUrl: "https://github.com/chenlike/Hush",
        description: "A BTC trading competition demo preventing copy trading. Uses FHE to encrypt player actions, position size, and direction on-chain to ensure operation privacy.",
        prize: "$1,000",
        demoUrl: "https://hush-iota.vercel.app/",
        videoUrl: "https://drive.google.com/open?id=1iZDXzLJ3WERMDw9Lvs"
    },
    {
        username: "dordunu1",
        projectName: "Confidential Governance",
        repoUrl: "https://github.com/dordunu1/ZAMADAO/",
        description: "Confidential governance for DAOs. Ensures votes and staked amounts remain private throughout the voting process using FHE, revealing only the final tally.",
        prize: "$1,000",
        demoUrl: "https://zamadao.netlify.app/",
        videoUrl: "https://drive.google.com/open?id=18DphvD-ngpGYnAOdxnlXp_B55inhJ8"
    }
];

export const AUGUST_2025_PROJECTS: DevProject[] = [
    // Builder Track
    {
        category: "Builder Track",
        username: "NarutoLab",
        projectName: "FHEZmail",
        repoUrl: "https://github.com/NarutoLab/fhevm-zama-mail-app",
        description: "FHEZmail is a decentralized, privacy email platform on the Ethereum Sepolia testnet. Using Fully Homomorphic Encryption (FHE), all emails are encrypted on-chain, and only the sender and recipient can read their content.",
        prize: "$1,000",
        videoUrl: "https://www.youtube.com/watch?v=ZfaCx10UO2k"
    },
    {
        category: "Builder Track",
        username: "OrionFinanceAI",
        projectName: "Orion Finance",
        repoUrl: "https://github.com/OrionFinanceAI/protocol",
        description: "Orion Finance is a permissionless portfolio management protocol designed to optimize onchain capital efficiency while preserving privacy for managers and auditability for users using fhEVM.",
        prize: "$1,000",
        demoUrl: "https://app.orionfinance.ai/",
        videoUrl: "https://www.youtube.com/watch?v=ov3SErn4GPE"
    },
    {
        category: "Builder Track",
        username: "devEMEL",
        projectName: "EmelMarket",
        repoUrl: "https://github.com/devEMEL/emel-market-main",
        description: "EmelMarket is a confidential NFT auction marketplace built on Zama's FHE technology. The platform enables users to participate in NFT auctions while keeping their bid amounts completely private.",
        prize: "$1,000",
    },
    {
        category: "Builder Track",
        username: "huaigu",
        projectName: "Number Guessing",
        repoUrl: "https://github.com/huaigu/number-verse-arena",
        description: "A private multiplayer number guessing game powered by Zama's FHE. Players select a number within a specified range, keeping their choice encrypted client-side until the reveal phase.",
        prize: "$1,000",
        videoUrl: "https://youtu.be/_eOtbshkZ5w"
    },
    {
        category: "Builder Track",
        username: "ntclick",
        projectName: "Spinning Wheel",
        repoUrl: "https://github.com/ntclick/spingamefhe",
        description: "A private spinning wheel game featuring in-game GM coin purchases, daily check-in bonuses, and an ETH prize pool. Includes optional public/private leaderboard settings.",
        prize: "$1,000",
        demoUrl: "https://lucky-spin-fhe.vercel.app/",
        videoUrl: "https://youtu.be/08HiwX_jhhU"
    },
    // Bounty Track
    {
        category: "Bounty Track",
        username: "vitwit",
        projectName: "DCA Bot",
        repoUrl: "https://github.com/vitwit/zama-dca-bot",
        description: "A Dollar Cost Averaging (DCA) bot leveraging Zama's privacy technology.",
        prize: "$5,000",
        videoUrl: "https://drive.google.com/open?id=1JB1K1dMwnyozbsQCvARaIW9ploapgzm5"
    },
    {
        category: "Bounty Track",
        username: "huaigu",
        projectName: "DCA Bot",
        repoUrl: "https://github.com/huaigu/DCA_FHE_BOT",
        description: "Privacy-preserving Dollar Cost Averaging (DCA) system using FHE on Sepolia. Enables encrypted USDC-to-ETH trading strategies with batch processing for k-anonymity and FHE price filtering.",
        prize: "$3,000",
        demoUrl: "https://dca-fhe-bot.vercel.app"
    },
    {
        category: "Bounty Track",
        username: "Envoy-VC",
        projectName: "DCA Bot",
        repoUrl: "https://github.com/Envoy-VC/kora",
        description: "An implementation of a privacy-focused DCA bot for the Zama bounty track.",
        prize: "$2,000",
        videoUrl: "https://youtu.be/1psS7fdNOdc"
    },
    // Aleph Track
    {
        category: "Aleph Track",
        username: "dumprahul",
        projectName: "Event Management",
        repoUrl: "https://github.com/dumprahul/zuma",
        description: "A confidential event management system built during the hackathon.",
        prize: "$2,500",
        demoUrl: "https://zuma-site-xi.vercel.app",
        videoUrl: "https://www.youtube.com/watch?v=uAjIKqK8a2E"
    },
    {
        category: "Aleph Track",
        username: "eth-ecuador",
        projectName: "Apu Sensible Data",
        repoUrl: "https://github.com/eth-ecuador/apu",
        description: "Apu Sensible Data Guardian for protecting sensitive information.",
        prize: "$1,500",
        demoUrl: "https://www.apuguardian.xyz/",
        videoUrl: "https://www.youtube.com/watch?v=rynEpOLxKIc"
    },
    {
        category: "Aleph Track",
        username: "tasneemtoolba",
        projectName: "Confidential OTC",
        repoUrl: "https://github.com/tasneemtoolba/OTC-with-FHE",
        description: "A confidential Over-The-Counter (OTC) escrow service utilizing Fully Homomorphic Encryption.",
        prize: "$1,000",
        demoUrl: "https://cipherotc-tasneemtoolbas-projects.vercel.app/",
        videoUrl: "https://youtu.be/9rEIkXp_B55inhJ8"
    }
];

export const SEPTEMBER_2025_PROJECTS: DevProject[] = [
    // Builder Track
    {
        category: "Builder Track",
        username: "tasneemtoolba",
        projectName: "OTC With FHE",
        repoUrl: "https://github.com/tasneemtoolba/OTC-with-FHE/tree/main",
        description: "A Confidential OTC Marketplace, where you get to create OTC requests with values all encrypted, and to view all created requests.",
        prize: "$2,000",
        demoUrl: "https://cipherotc.vercel.app/",
        videoUrl: "https://youtu.be/9rEIkXpJmac?si=iLhV6EqV2RRqKfWW"
    },
    {
        category: "Builder Track",
        username: "6ygb",
        projectName: "Camm",
        repoUrl: "https://github.com/6ygb/CAMM",
        description: "CAMM (Confidential Automated Market Maker) is an AMM based on Uniswap V2 integrating fhEVM so every amount sent to or received from the pool stays encrypted. It uses division invariance tricks to handle calculations without exposing raw numbers.",
        prize: "$2,000",
        demoUrl: "https://camm.6ygb.dev/",
        videoUrl: "https://youtu.be/GSyv_a6ZUek"
    },
    {
        category: "Builder Track",
        username: "dordunu1",
        projectName: "Zamabelief",
        repoUrl: "https://github.com/dordunu1/Zamabelief",
        description: "Belief Protocol is a privacy-preserving conviction market DApp built on ZAMA FHEVM. Stake/bet on your takes/opinions and resolve markets with true confidentiality and on-chain verifiability.",
        prize: "$2,000",
        demoUrl: "https://beliefprotocol.netlify.app/",
        videoUrl: "https://youtu.be/FZ7FisiAS1I"
    },
    {
        category: "Builder Track",
        username: "Nilay27",
        projectName: "Uni Versal Privacy Hook",
        repoUrl: "https://github.com/Nilay27/UNIVersalPrivacyHook",
        description: "A groundbreaking Uniswap V4 hook that enables completely private token swaps using Zama's FHE technology. Includes encrypted swap amounts, MEV protection, and trustless execution.",
        prize: "$2,000",
        demoUrl: "https://universalprivatehook.vercel.app/",
        videoUrl: "https://youtu.be/sYnSRw6ADEo"
    },
    {
        category: "Builder Track",
        username: "tomi204",
        projectName: "Privacy Pool Monorepo",
        repoUrl: "https://github.com/tomi204/privacy-pool-monorepo",
        description: "This project implements a Privacy AMM that integrates confidential tokens (ERC7984) using Zama’s FHEVM. It enables encrypted balances, confidential swaps, and private liquidity provision.",
        prize: "$2,000",
        demoUrl: "https://privacy-pool-monorepo-site.vercel.app/",
        videoUrl: "https://youtu.be/58bi7gsbfho"
    },
    // Bounty Track
    {
        category: "Bounty Track",
        username: "MadeleineAguil",
        projectName: "ZamaSchool",
        repoUrl: "https://github.com/MadeleineAguil/ZamaSchool",
        description: "Educational platform for learning Zama technologies.",
        prize: "$5,000",
        demoUrl: "https://zamaschool.netlify.app/",
        videoUrl: "https://zamaschool.netlify.app/"
    },
    {
        category: "Bounty Track",
        username: "realchriswilder",
        projectName: "hello-fhevm",
        repoUrl: "https://github.com/realchriswilder/hello-fhevm",
        description: "A beginner-friendly introduction and implementation of FHEVM concepts.",
        prize: "$3,000",
        demoUrl: "https://hello-evm-bounty.netlify.app/step/welcome",
        videoUrl: "https://hello-evm-bounty.netlify.app/step/private-voting"
    },
    {
        category: "Bounty Track",
        username: "NecipAkgz",
        projectName: "fhe-crypto-guess",
        repoUrl: "https://github.com/NecipAkgz/fhe-crypto-guess",
        description: "A guessing game leveraging Fully Homomorphic Encryption for privacy.",
        prize: "$2,000",
        demoUrl: "https://fhe-guessing.vercel.app/",
        videoUrl: "https://fhe-guessing.vercel.app/"
    }
];

export const OCTOBER_2025_PROJECTS: DevProject[] = [
    // Builder Track
    {
        category: "Builder Track",
        username: "mintychan",
        projectName: "PayProof",
        repoUrl: "https://github.com/mintychan/PayProof",
        description: "Privacy-preserving payroll streaming and proof-of-income attestations powered by Zama’s fhEVM.",
        prize: "$1,500",
        demoUrl: "https://pay-proof.vercel.app/",
        videoUrl: "https://drive.google.com/file/d/1Tij_kpEFkDZkdv-OKo0OgL6IXfS_aMpx/view"
    },
    {
        category: "Builder Track",
        username: "Farukest",
        projectName: "Zolymarket",
        repoUrl: "https://github.com/Farukest/Zolymarket/",
        description: "A fully decentralized prediction market leveraging FHE to keep bet amounts private while maintaining transparent market outcomes.",
        prize: "$1,500",
        demoUrl: "http://www.xflydev.xyz/",
        videoUrl: "https://www.youtube.com/watch?v=Wy09FM6gYKY"
    },
    {
        category: "Builder Track",
        username: "erzawansyah",
        projectName: "FHEdback",
        repoUrl: "https://github.com/erzawansyah/fhedback",
        description: "FHEdback is a survey platform that lets you collect responses privately while still being able to compute aggregated results. Individual answers stay hidden, but overall insights remain accessible.",
        prize: "$1,500",
        demoUrl: "https://fhedback.vercel.app/",
        videoUrl: "https://youtu.be/Gf_GRwU-ms8"
    },
    {
        category: "Builder Track",
        username: "6ygb",
        projectName: "OBOL",
        repoUrl: "https://github.com/6ygb/OBOL",
        description: "Highly recommend reading the OBOL README on GitHub — it’s detailed and well-organized. This summary is brief and doesn’t cover the full project logic, which is worth exploring to understand the underlying maths behind the protocol.",
        prize: "$1,500",
        demoUrl: "https://obol.6ygb.dev/",
        videoUrl: "https://youtu.be/DchckQGCChQ"
    },
    {
        category: "Builder Track",
        username: "dordunu1",
        projectName: "FHERatings",
        repoUrl: "https://github.com/dordunu1/Ratings",
        description: "Rate your favorite influencer — your rating stays private forever. Only the average score is public. Simple, fun, and privacy-first.",
        prize: "$1,500",
        demoUrl: "https://fheratings.netlify.app/",
        videoUrl: "https://youtu.be/USvn2HwXE5k"
    },
    {
        category: "Builder Track",
        username: "Nilay27",
        projectName: "AlphaEngine",
        repoUrl: "https://github.com/Nilay27/AlphaEngine",
        description: "We turn Uniswap liquidity into a private, competitive marketplace where elite strategists deploy capital across DeFi — without ever leaking alpha.",
        prize: "$1,500"
    },
    {
        category: "Builder Track",
        username: "kocaemre",
        projectName: "FHE GeoGuessr",
        repoUrl: "https://github.com/kocaemre/zama-fheguessr",
        description: "A privacy-preserving location guessing game using Zama’s FHE. Players guess from 360° views while coordinates stay encrypted — fair play without revealing sensitive data.",
        prize: "$1,500",
        demoUrl: "https://zama-fheguessr.vercel.app/",
        videoUrl: "https://youtu.be/gsYPBcCHhLw"
    },
    // Bounty Track
    {
        category: "Bounty Track",
        username: "jobjab-dev",
        projectName: "FHEVM React Template",
        repoUrl: "https://github.com/jobjab-dev/fhevm-react-template",
        description: "Template for building React applications with FHEVM",
        prize: "$5,000",
        demoUrl: "https://jobjab-fhevm-react-template-nextjs.vercel.app/",
        videoUrl: "https://youtu.be/ASWVwOE1iPk"
    },
    {
        category: "Bounty Track",
        username: "0xAleksaOpacic",
        projectName: "FHEVM SDK",
        repoUrl: "https://github.com/0xAleksaOpacic/FHEVM-SDK",
        description: "JavaScript/TypeScript SDK for interacting with FHEVM",
        prize: "$3,000",
        demoUrl: "https://fhevm-sdk-nextjs-example.vercel.app/",
        videoUrl: "https://drive.google.com/file/d/1LKnxOQMf7k-oKwqDGeIgbRgWSCrTy7vd/view?usp=sharing"
    },
    {
        category: "Bounty Track",
        username: "Farukest",
        projectName: "FHEVM Universal SDK",
        repoUrl: "https://github.com/Farukest/fhevm-universal-sdk/",
        description: "Universal SDK for multi-framework FHEVM apps",
        prize: "$2,000",
        demoUrl: "http://react.unifhevm.xyz/",
        videoUrl: "https://youtu.be/kagta5-JjcU"
    },
    {
        category: "Bounty Track",
        username: "tomi204",
        projectName: "FHEVM React Native Template",
        repoUrl: "https://github.com/tomi204/fhevm-react-native-template",
        description: "React Native template for building FHEVM mobile apps",
        prize: "$0 (HONORABLE MENTION)",
        demoUrl: "https://fhevm-react-native-template-docs-4x.vercel.app/docs/intro",
        videoUrl: "https://www.youtube.com/watch?v=Wbl9w8CPH8I"
    },
    {
        category: "Bounty Track",
        username: "JupiterXiaoxiaoYu",
        projectName: "FHEVM React Template",
        repoUrl: "https://github.com/JupiterXiaoxiaoYu/fhevm-react-template",
        description: "React starter template + extra Universal FHEVM SDK demo",
        prize: "$0 (HONORABLE MENTION)",
        demoUrl: "https://fhevm-counter.vercel.app/"
    },
    // EthRome Hackathon
    {
        category: "EthRome Hackathon",
        username: "SwineCoder101",
        projectName: "Cibon",
        repoUrl: "https://github.com/SwineCoder101/cibon/blob/main/packages/hardhat/contracts/CibonCarbonFootprintCalculator.sol",
        description: "A trustless carbon credit distribution platform that verifies carbon footprints through encrypted computation, ensuring privacy while maintaining transparency in the carbon credit ecosystem.",
        prize: "$1,750",
        demoUrl: "https://cibon-nextjs.vercel.app/",
        videoUrl: "https://youtu.be/o4m3WJlmlPo"
    },
    {
        category: "EthRome Hackathon",
        username: "Wagalidoom",
        projectName: "FHESplit",
        repoUrl: "https://github.com/Wagalidoom/ethrome",
        description: "Split expenses and settle dues privately – no one needs to know!",
        prize: "$1,250"
    },
    {
        category: "EthRome Hackathon",
        username: "romispectrum",
        projectName: "ZAMA LMM",
        repoUrl: "https://github.com/romispectrum/zama-llm-docs",
        description: "zama has a lot of docs, runs python script, python file will download docs folder, will run one markdown, zama llm txt, go to cursor opens second project, opens settings, indexer and docs, great",
        prize: "$1,250"
    },
    {
        category: "EthRome Hackathon",
        username: "batikanor",
        projectName: "SecSanta",
        repoUrl: "https://github.com/batikanor/SecSanta",
        description: "Pool a gift amount, and let the receipent choose their own gifts. Hide individual contributions in a secure way. In a secret way. Not to be confused with Sex Santa",
        prize: "$750",
        demoUrl: "https://secsanta.vercel.app/"
    }
];
