/* Project content checked against the supplied resume, original experiment evidence and pinned public repositories. */
window.PortfolioData = {
  "rag": {
    "name": "Local RAG Research Assistant",
    "kind": "ENGINEERING CASE STUDY",
    "mapKind": "ENGINEERING / LOCAL AI",
    "category": "engineering",
    "badge": "PERSONAL ENGINEERING PROJECT",
    "lead": "A local workspace for searching papers and checking cited answers.",
    "description": "I built a local PDF research workspace with FastAPI and React: ingest documents, choose a retrieval strategy, ask a question, and inspect the source document, page and chunk behind each citation.",
    "stats": [
      [
        "0.7284",
        "HOLDOUT nDCG@5"
      ],
      [
        "18",
        "BENCHMARK QUERIES"
      ],
      [
        "4",
        "RETRIEVAL MODES"
      ]
    ],
    "contributions": [
      [
        "Ingestion & provenance",
        "PyMuPDF extraction, document identity, token-aware chunks, BGE embeddings, and persistent Qdrant indexing."
      ],
      [
        "Retrieval & generation",
        "Dense and BM25 search, weighted reciprocal rank fusion, cross-encoder reranking, bounded context, and local Ollama/Qwen generation."
      ],
      [
        "API & evidence interface",
        "Modular Python components, FastAPI endpoints, a React/TypeScript workspace, citation inspection, and automated tests."
      ]
    ],
    "lesson": "A retrieval improvement needs a reproducible evaluation. Separating first-stage retrieval depth from the reranker’s candidate pool made the live pipeline match the intended offline experiment.",
    "limit": "The benchmark is small, document-scoped, and model-assisted. Retrieval scores do not establish answer faithfulness or semantic citation support.",
    "source": "Frozen Phase 13 evaluation: 3 papers, 12 development queries, 6 holdout queries and 527 model-assisted relevance judgments. Repository snapshot c32d126; the project is presented at this recorded stage.",
    "links": [
      [
        "View repository",
        "https://github.com/RazinRahat/local-rag-research-assistant"
      ],
      [
        "Evaluation report",
        "https://github.com/RazinRahat/local-rag-research-assistant/blob/c32d126442741047e4b54f7961501d7466a912bc/docs/phase13-evaluation.md"
      ],
      [
        "Citation implementation",
        "https://github.com/RazinRahat/local-rag-research-assistant/blob/c32d126442741047e4b54f7961501d7466a912bc/src/research_assistant/citations/parser.py"
      ],
      [
        "Frontend tests",
        "https://github.com/RazinRahat/local-rag-research-assistant/blob/c32d126442741047e4b54f7961501d7466a912bc/frontend/src/query/CitedAnswer.test.tsx"
      ]
    ],
    "steps": [
      {
        "title": "Ingest & index",
        "subtitle": "01 / SOURCE",
        "detail": "Extract PDF text and page metadata with PyMuPDF. Preserve document identity and provenance through token-aware chunking, then embed and persist the passages in Qdrant.",
        "code": "PDF → page metadata → 384-token chunks / 64-token overlap → BGE-small-en-v1.5 → Qdrant"
      },
      {
        "title": "Retrieve & fuse",
        "subtitle": "02 / CANDIDATES",
        "detail": "Retrieve up to 40 candidates from each of the dense and BM25 branches. Weighted reciprocal rank fusion combines their ranks rather than directly mixing incomparable raw scores.",
        "code": "RRF k = 5 · dense weight 1.00 · lexical weight 1.25 · retain hybrid top 20"
      },
      {
        "title": "Rerank & budget",
        "subtitle": "03 / EVIDENCE",
        "detail": "Score the hybrid top 10 with a cross-encoder, return five passages, and build a bounded context. Candidate generation depth remains independent of the reranking pool.",
        "code": "ms-marco-MiniLM-L6-v2 · 10 rerank candidates → 5 passages → bounded context"
      },
      {
        "title": "Generate & inspect",
        "subtitle": "04 / ANSWER",
        "detail": "Use local Ollama/Qwen generation and retain citation identities. The React workspace exposes the source document, page, and chunk so a reader can inspect the retrieved evidence.",
        "code": "FastAPI → local generation → answer + citation mapping → React evidence inspector"
      }
    ],
    "headline": "Local RAG Research Assistant",
    "tags": "Python · FastAPI · React",
    "summary": "Inspectable local RAG, from PDF ingestion to a frozen retrieval benchmark.",
    "story": [
      [
        "The problem",
        "Research answers need evidence that a reader can trace back to the original document."
      ],
      [
        "My goal",
        "Build an inspectable local pipeline and evaluate retrieval choices on a separate development and holdout split."
      ],
      [
        "What I did",
        "Implemented ingestion, indexing, dense/BM25 fusion, reranking, bounded generation context, citation identity checks and the evidence interface."
      ],
      [
        "The result",
        "Hybrid + reranking reached nDCG@5 0.7284 versus 0.4806 for dense retrieval on six frozen holdout queries. One reranking regression remains documented."
      ]
    ],
    "exploreLabel": "Explore the pipeline and benchmark"
  },
  "three": {
    "name": "Single-image 3D reconstruction",
    "kind": "GENERATIVE AI EVALUATION",
    "mapKind": "EXPERIMENT / GENERATIVE 3D",
    "category": "research",
    "badge": "COURSEWORK EXPERIMENT",
    "lead": "Evaluating TripoSR outputs from five product photographs.",
    "description": "I evaluated pretrained TripoSR on five product photographs using an RTX 4090, then inspected topology and front/rear appearance. Original GLB exports let you explore three of those outputs directly.",
    "stats": [
      [
        "5",
        "PRODUCT IMAGES"
      ],
      [
        "2.23–3.51 s",
        "NEURAL INFERENCE"
      ],
      [
        "4 / 5",
        "WATERTIGHT MESHES"
      ]
    ],
    "contributions": [
      [
        "Reproducible model execution",
        "Converted AVIF sources to PNG, ran the public pretrained TripoSR checkpoint, and retained raw GLB outputs."
      ],
      [
        "Geometry & visual inspection",
        "Measured vertices, faces, watertightness, and connected components; inspected front/rear views and solid-mode diagnostics."
      ],
      [
        "Interpretation & comparison",
        "Documented geometric and material failures, and compared the tested baseline with SF3D and InstantMesh in the report."
      ]
    ],
    "lesson": "Watertightness does not establish product fidelity. The carafe was a single watertight component, yet the reconstructed output lost the defining appearance of transparent glass.",
    "limit": "Each input was processed once. Inference timing excludes initialisation, background removal, mesh extraction, and export. I evaluated pretrained TripoSR; I did not train a new reconstruction model or experimentally validate SF3D.",
    "source": "COMP8410 experiment report, 9 October 2026, sections 3.2.1–3.2.3 and Figures 3–8. Source product photography: IKEA Australia. Generated views: recorded TripoSR outputs.",
    "links": [
      [
        "TripoSR baseline repository",
        "https://github.com/VAST-AI-Research/TripoSR"
      ]
    ],
    "experiments": [
      {
        "id": "lack",
        "name": "LACK side table",
        "ms": 3509.1,
        "vertices": 52964,
        "faces": 105924,
        "watertight": true,
        "components": 1,
        "observation": "The four-legged silhouette remained recognisable, but the tabletop became wavy, edges rounded, and leg proportions varied. Strong topology metrics hid important shape errors.",
        "source": "https://www.ikea.com/au/en/p/lack-side-table-black-brown-80352927/",
        "model": {
          "url": "./assets/models/lack.glb",
          "bytes": 12694536,
          "faces": 105924,
          "sha256": "5795d9c685c55dda477f3db3d0a4ee64bbd87cb4070aa2438d0204f4f8a327ce"
        }
      },
      {
        "id": "poang",
        "name": "POÄNG — Knisa light beige",
        "ms": 2230,
        "vertices": 55961,
        "faces": 111934,
        "watertight": false,
        "components": 7,
        "observation": "Cushion and frame regions fused, parts disconnected, and rear geometry remained unreliable. The model recognised a chair without recovering the designed structural relationships.",
        "source": "https://www.ikea.com/au/en/p/poaeng-armchair-birch-veneer-knisa-light-beige-s19240788/",
        "model": {
          "url": "./assets/models/poang.glb",
          "bytes": 13427788,
          "faces": 111930,
          "sha256": "e031780f1d0c7b7ed0abdfc89310899393bc278a07dc4bb9c721c763b5ffb73b"
        }
      },
      {
        "id": "tertial",
        "name": "TERTIAL work lamp",
        "ms": 2590.25,
        "vertices": 10994,
        "faces": 21984,
        "watertight": true,
        "components": 3,
        "observation": "Thin arms became irregular or fused, articulated joints were simplified, and a detached fragment appeared. The mesh was watertight but had three connected components.",
        "source": "https://www.ikea.com/au/en/p/tertial-work-lamp-dark-grey-50355442/"
      },
      {
        "id": "carafe",
        "name": "IKEA 365+ carafe",
        "ms": 2737.34,
        "vertices": 27222,
        "faces": 54440,
        "watertight": true,
        "components": 1,
        "observation": "A single watertight component still failed to preserve transparent glass, symmetry, wall thickness, and stopper geometry. The output became an opaque vessel-like form.",
        "source": "https://www.ikea.com/au/en/p/ikea-365-carafe-with-stopper-clear-glass-cork-70279720/",
        "model": {
          "url": "./assets/models/carafe.glb",
          "bytes": 6527112,
          "faces": 54440,
          "sha256": "968105d858c6bda54fca8399512135a570243ba855ffe563d8c373523320eb9e"
        }
      },
      {
        "id": "poang-alt",
        "name": "POÄNG — Grann black",
        "ms": 2956.74,
        "vertices": 60631,
        "faces": 121262,
        "watertight": true,
        "components": 3,
        "observation": "Watertightness coexisted with three disconnected components and unreliable hidden surfaces. This is a different chair configuration, not a controlled alternate-view test of the Knisa chair.",
        "source": "https://www.ikea.com/au/en/p/poaeng-armchair-birch-veneer-grann-black-s79625231/"
      }
    ],
    "headline": "Single-image 3D reconstruction",
    "tags": "TripoSR · PyTorch · Blender",
    "summary": "Five reconstruction experiments; three original model exports to inspect.",
    "story": [
      [
        "The problem",
        "Single-image reconstruction must infer hidden surfaces, fine structures and materials from one view."
      ],
      [
        "My goal",
        "Assess whether fast generated meshes preserve the properties that make a product recognisable."
      ],
      [
        "What I did",
        "Ran five inputs, retained raw outputs, measured geometry, and inspected generated views and upright Blender exports."
      ],
      [
        "The result",
        "All five runs completed; four raw meshes were reported watertight. Visual inspection still exposed distorted geometry, disconnected parts and lost material properties."
      ]
    ],
    "exploreLabel": "Inspect the models and experiments"
  },
  "ssi": {
    "name": "Encrypted peer-to-peer chat with SSI",
    "kind": "FIRST-AUTHOR RESEARCH",
    "mapKind": "PUBLICATION / SECURE IDENTITY",
    "category": "research",
    "badge": "IEEE ICCIT 2024 / FIRST AUTHOR",
    "lead": "Research on encrypted chat using self-sovereign identity.",
    "description": "My undergraduate thesis became a first-author IEEE ICCIT 2024 paper on end-to-end encrypted peer-to-peer chat using self-sovereign identity. My implementation work covered DIDComm messaging, QR-code connections and direct mobile communication.",
    "stats": [
      [
        "2024",
        "IEEE ICCIT"
      ],
      [
        "1st",
        "AUTHOR"
      ],
      [
        "P2P",
        "DIRECT COMMUNICATION"
      ]
    ],
    "contributions": [
      [
        "Messaging implementation",
        "DIDComm-based peer-to-peer messaging using decentralised identity concepts."
      ],
      [
        "Connection establishment",
        "QR-code connection flow to help peers establish a communication relationship."
      ],
      [
        "System architecture",
        "Direct mobile-to-mobile communication without a centralised database; research developed from my undergraduate thesis."
      ]
    ],
    "lesson": "Security work made me think beyond the interface: how a connection is established, who owns identity, and where the system’s trust assumptions live.",
    "limit": "The publication supports the described research system and implementation. This portfolio does not claim an independent security audit, production adoption, or robustness under all deployment conditions.",
    "source": "First-author publication: An End-to-End Encrypted Peer-to-Peer Chat System with Self-Sovereign Identity. IEEE ICCIT 2024. Implementation contributions cover DIDComm messaging, QR-code connections, and direct mobile-to-mobile communication.",
    "links": [
      [
        "Read publication DOI",
        "https://doi.org/10.1109/ICCIT64611.2024.11022566"
      ]
    ],
    "steps": [
      {
        "title": "Two peers",
        "connection": "CONNECTION NOT ESTABLISHED",
        "detail": "Each device is a participant in the peer-to-peer system. The research explores self-sovereign identity instead of relying on a centralised identity database."
      },
      {
        "title": "Establish a connection",
        "connection": "QR CONNECTION FLOW",
        "detail": "A QR-code flow provides a way to establish the peer relationship. This screen illustrates the connection design; it does not create real identities or invitations."
      },
      {
        "title": "Exchange messages",
        "connection": "DIDCOMM MESSAGING",
        "detail": "The implementation uses DIDComm-based peer-to-peer messaging for direct mobile-to-mobile communication. No cryptographic operation is performed in this portfolio walkthrough."
      },
      {
        "title": "Consider the boundaries",
        "connection": "INSPECT THE TRUST ASSUMPTIONS",
        "detail": "A working research system still needs its trust and deployment assumptions examined. The portfolio makes no independent audit, production-readiness, or universal security claim."
      }
    ],
    "headline": "Peer-to-peer chat with SSI",
    "tags": "SSI · DIDComm · IEEE ICCIT",
    "summary": "First-author research on decentralised identity and peer-to-peer messaging.",
    "story": [
      [
        "The problem",
        "Centralised identity and messaging systems concentrate control over communication."
      ],
      [
        "My goal",
        "Investigate a peer-to-peer chat design using decentralised identity and direct mobile communication."
      ],
      [
        "What I did",
        "Implemented DIDComm messaging, QR-code connection establishment and mobile-to-mobile communication, then contributed the work to the research publication."
      ],
      [
        "The result",
        "First-author publication at IEEE ICCIT 2024. The research implementation is evidence of the design, with no independent security-audit or production-adoption claim."
      ]
    ],
    "exploreLabel": "Walk through the connection design"
  },
  "retrieval": {
    "modes": [
      "Dense",
      "BM25",
      "Hybrid",
      "Hybrid + rerank"
    ],
    "metrics": {
      "ndcg": {
        "label": "nDCG@5",
        "description": "Graded ranking quality: how well the top five passages place relevant evidence near the top.",
        "values": [
          0.4806,
          0.5083,
          0.5397,
          0.7284
        ]
      },
      "precision": {
        "label": "Precision@5",
        "description": "Fraction of the top five passages with relevance grades 2–3.",
        "values": [
          0.4,
          0.3667,
          0.3667,
          0.4667
        ]
      },
      "recall": {
        "label": "Pooled recall@5",
        "description": "Coverage of relevant passages in the judged pool. The pool is not exhaustive.",
        "values": [
          0.7667,
          0.6917,
          0.6917,
          0.85
        ]
      },
      "mrr": {
        "label": "MRR",
        "description": "Reciprocal rank of the first passage with relevance grades 2–3, averaged across the holdout.",
        "values": [
          0.4778,
          0.6806,
          0.6667,
          0.9167
        ]
      }
    }
  },
  "gesture": {
    "name": "Real-Time Gesture Classification",
    "kind": "COMPUTER VISION CASE STUDY",
    "mapKind": "VISION / MODEL DEPLOYMENT",
    "category": "ml",
    "badge": "TRAINING & LOCAL INFERENCE",
    "headline": "Real-Time Gesture Classification",
    "tags": "PyTorch · MobileNetV2 · OpenCV",
    "summary": "A custom CNN and transfer-learning comparison, connected to local webcam inference.",
    "lead": "Comparing gesture classifiers and using the selected model with a webcam.",
    "description": "I trained a custom CNN and an ImageNet-pretrained MobileNetV2 for rock-paper-scissors recognition, compared held-out performance, and integrated the selected model with an OpenCV webcam pipeline.",
    "stats": [
      [
        "96.51%",
        "MOBILENETV2 TEST"
      ],
      [
        "94.49%",
        "CUSTOM CNN TEST"
      ],
      [
        "3",
        "GESTURE CLASSES"
      ]
    ],
    "story": [
      [
        "The problem",
        "Offline gesture recognition has to survive different framing, backgrounds and lighting when used with a real camera."
      ],
      [
        "My goal",
        "Compare a model trained from scratch with transfer learning and connect the better-performing model to local inference."
      ],
      [
        "What I did",
        "Built preprocessing and training pipelines, analysed confusion matrices and mistakes, and aligned webcam preprocessing and class labels with training."
      ],
      [
        "The result",
        "MobileNetV2 achieved 96.51% test accuracy versus 94.49% for the custom CNN. Webcam experiments exposed domain shift and an early label-mapping bug."
      ]
    ],
    "contributions": [
      [
        "Training & comparison",
        "Custom CNN, MobileNetV2 transfer learning, train/dev/test separation and checkpoint selection."
      ],
      [
        "Error analysis",
        "Confusion matrices and misclassified examples, with test performance kept separate from webcam observations."
      ],
      [
        "Local deployment",
        "OpenCV frame capture, matching preprocessing, model inference and displayed predictions."
      ]
    ],
    "lesson": "The label mapping and preprocessing are part of the deployed model. Offline accuracy does not establish webcam reliability.",
    "limit": "The accuracy figures describe the repository test split. The project does not provide a measured webcam accuracy, latency benchmark or production robustness study.",
    "source": "Recorded results and implementation in the public repository, snapshot 0d8bef5. The webcam application runs locally; this portfolio compares its saved evaluation results.",
    "links": [
      [
        "View repository",
        "https://github.com/RazinRahat/real-time-gesture-classification"
      ],
      [
        "Training notebook",
        "https://github.com/RazinRahat/real-time-gesture-classification/blob/0d8bef500a4b47952a13574183f0d05965e12a08/notebooks/gesture_classification_experiments.ipynb"
      ],
      [
        "Webcam implementation",
        "https://github.com/RazinRahat/real-time-gesture-classification/blob/0d8bef500a4b47952a13574183f0d05965e12a08/src/inference/webcam_inference.py"
      ]
    ],
    "exploreLabel": "Compare the models",
    "models": [
      {
        "name": "Custom CNN",
        "dev": 95.58,
        "test": 94.49,
        "errors": 30
      },
      {
        "name": "MobileNetV2",
        "dev": 97.79,
        "test": 96.51,
        "errors": 19
      }
    ]
  },
  "finance": {
    "name": "Personal Finance CLI",
    "kind": "SOFTWARE ENGINEERING CASE STUDY",
    "mapKind": "ENGINEERING / LOCAL TOOLS",
    "category": "engineering",
    "badge": "PYTHON APPLICATION",
    "headline": "Personal Finance CLI",
    "tags": "Python · Click · SQLite · Pytest",
    "summary": "Local CSV imports, rule-based categorisation and monthly reports with tested application boundaries.",
    "lead": "A Python tool for importing statements and producing monthly reports.",
    "description": "I built a Python CLI that validates statement CSVs, categorises transactions, stores them in SQLite and produces monthly reports. The implementation makes monetary arithmetic, duplicate imports and manual corrections explicit.",
    "stats": [
      [
        "SQLite",
        "LOCAL PERSISTENCE"
      ],
      [
        "SHA-256",
        "IMPORT IDENTITY"
      ],
      [
        "CI",
        "QUALITY CHECKS"
      ]
    ],
    "story": [
      [
        "The problem",
        "Financial CSV workflows need consistent categorisation and protection against duplicate or partially imported statements."
      ],
      [
        "My goal",
        "Build a maintainable local tool with predictable data handling and useful monthly reports."
      ],
      [
        "What I did",
        "Separated Click commands from application modules, used integer cents and parameterised SQL, made imports atomic, and added tests and a GitHub Actions quality workflow."
      ],
      [
        "The result",
        "A reusable CLI for importing, correcting, reporting and exporting normalised statements, with explicit duplicate detection and preserved manual categorisation."
      ]
    ],
    "contributions": [
      [
        "Import integrity",
        "CSV validation, exact decimal handling, atomic database writes and SHA-256 statement fingerprints."
      ],
      [
        "Reporting & corrections",
        "Monthly reporting, custom JSON rules, manual corrections and CSV exports."
      ],
      [
        "Maintainability",
        "Focused modules with Pytest, mypy, Ruff and formatting checks in the repository workflow."
      ]
    ],
    "lesson": "Reliability comes from the edge cases: a repeated file, a failed row, or a manual correction that must survive the next categorisation pass.",
    "limit": "The CLI assumes a normalised CSV and one currency with two decimal places. Transfers and refunds are not modelled separately; local storage is not encrypted at rest.",
    "source": "Implementation and fictional example statement from the public repository, snapshot d3a2031. The browser walkthrough uses the repository’s fictional statement; the Python CLI runs locally.",
    "links": [
      [
        "View repository",
        "https://github.com/RazinRahat/finance-cli"
      ],
      [
        "Import implementation",
        "https://github.com/RazinRahat/finance-cli/blob/d3a2031e6e451528c74c4df8cdb71dd491d61eb6/src/finance_cli/importer.py"
      ],
      [
        "Import tests",
        "https://github.com/RazinRahat/finance-cli/blob/d3a2031e6e451528c74c4df8cdb71dd491d61eb6/tests/test_importer.py"
      ],
      [
        "Quality workflow",
        "https://github.com/RazinRahat/finance-cli/blob/d3a2031e6e451528c74c4df8cdb71dd491d61eb6/.github/workflows/quality.yml"
      ]
    ],
    "exploreLabel": "Try the fictional import workflow",
    "exampleCsv": "date,description,amount\n2025-01-02,ACME Payroll,2100.00\n2025-01-03,Fictional Property Rent,-700.00\n2025-01-04,FreshMart,-92.40\n2025-01-06,City Transit,-30.00\n2025-01-08,StreamFlix,-16.99\n2025-01-10,Corner Cafe,-24.50\n2025-01-12,Mobile Network,-39.00\n2025-01-15,ACME Payroll,2100.00\n2025-01-17,Value Grocer,-68.75\n2025-01-19,Fitness Club,-42.00\n2025-01-21,Clothing Store,-110.50\n2025-01-23,Community Pharmacy,-27.80\n2025-01-25,MusicBox,-11.99\n2025-01-27,Office Supplies,-38.60\n2025-01-29,City Transit,-30.00",
    "rules": {
      "Income": [
        "acme payroll"
      ],
      "Rent": [
        "fictional property rent"
      ],
      "Groceries": [
        "freshmart",
        "value grocer"
      ],
      "Transport": [
        "city transit"
      ],
      "Dining": [
        "corner cafe",
        "harbour diner"
      ],
      "Subscriptions": [
        "streamflix",
        "musicbox"
      ],
      "Utilities": [
        "sample energy",
        "mobile network"
      ],
      "Shopping": [
        "clothing store",
        "online marketplace"
      ],
      "Health": [
        "community pharmacy",
        "fitness club"
      ],
      "Education": [
        "office supplies"
      ]
    }
  },
  "qqp": {
    "name": "Duplicate Question Detection",
    "kind": "NLP EVALUATION CASE STUDY",
    "mapKind": "NLP / MODEL COMPARISON",
    "category": "ml",
    "badge": "CONTROLLED MODEL COMPARISON",
    "headline": "Duplicate Question Detection",
    "tags": "DistilBERT · Siamese BiLSTM · scikit-learn",
    "summary": "Lexical baselines, a Siamese encoder and a fine-tuned Transformer compared on held-out question pairs.",
    "lead": "Comparing approaches to finding duplicate questions.",
    "description": "I compared lexical classifiers, a Siamese BiLSTM and fine-tuned DistilBERT on Quora Question Pairs, examining precision, recall, threshold selection and disagreements between models.",
    "stats": [
      [
        "0.7910",
        "DISTILBERT TEST F1"
      ],
      [
        "2,000",
        "HELD-OUT TEST PAIRS"
      ],
      [
        "6",
        "COMPARISON METHODS"
      ]
    ],
    "story": [
      [
        "The problem",
        "Two questions can share words without sharing intent, or express the same question using different wording."
      ],
      [
        "My goal",
        "Compare representation choices while keeping validation-based selection separate from held-out reporting."
      ],
      [
        "What I did",
        "Built lexical baselines and a shared BiLSTM encoder, fine-tuned DistilBERT, tuned thresholds on validation data and inspected model errors."
      ],
      [
        "The result",
        "DistilBERT achieved test F1 0.7910 versus 0.5935 for Naive Bayes. The Siamese model improved recall over Naive Bayes but had lower F1."
      ]
    ],
    "contributions": [
      [
        "Controlled comparison",
        "Stratified subsets of 10,000 training, 2,000 validation and 2,000 held-out test pairs."
      ],
      [
        "Neural modelling",
        "A Siamese BiLSTM and fine-tuned DistilBERT, with validation-based model and threshold selection."
      ],
      [
        "Interpretation",
        "Precision/recall trade-offs, high-confidence errors and disagreements between the Transformer and classical baseline."
      ]
    ],
    "lesson": "Model complexity alone did not win. The BiLSTM improved recall but lost on F1 to Naive Bayes; the pretrained Transformer produced the strongest result on this split.",
    "limit": "These results describe a sampled QQP experiment. They do not establish performance on every domain or on the official hidden GLUE test set.",
    "source": "Public experiment notebook and README, snapshot ce350fe. The held-out subset was sampled from QQP’s official validation split; project training and validation subsets came from the original training split.",
    "links": [
      [
        "View repository",
        "https://github.com/RazinRahat/duplicate-question-detection"
      ],
      [
        "Experiment notebook",
        "https://github.com/RazinRahat/duplicate-question-detection/blob/ce350fe321043334cafef5e3198e68434c86b1c5/notebooks/qqp_duplicate_detection.ipynb"
      ]
    ],
    "exploreLabel": "Compare the held-out results",
    "models": [
      {
        "name": "Majority class",
        "accuracy": 0.632,
        "precision": 0,
        "recall": 0,
        "f1": 0
      },
      {
        "name": "Lexical + LR",
        "accuracy": 0.6315,
        "precision": 0.4991,
        "recall": 0.3614,
        "f1": 0.4192
      },
      {
        "name": "TF-IDF + LR",
        "accuracy": 0.73,
        "precision": 0.7333,
        "recall": 0.4185,
        "f1": 0.5329
      },
      {
        "name": "BoW + Naive Bayes",
        "accuracy": 0.711,
        "precision": 0.6152,
        "recall": 0.5734,
        "f1": 0.5935
      },
      {
        "name": "Siamese BiLSTM",
        "accuracy": 0.6205,
        "precision": 0.4889,
        "recall": 0.6889,
        "f1": 0.5719
      },
      {
        "name": "DistilBERT",
        "accuracy": 0.8285,
        "precision": 0.7171,
        "recall": 0.8818,
        "f1": 0.791
      }
    ]
  },
  "publications": [
    {
      "id": "ssi",
      "title": "An End-to-End Encrypted Peer-to-Peer Chat System with Self-Sovereign Identity",
      "authors": [
        "Razin Rayan Rahat",
        "Shahriar Ahmed",
        "Abrar Awsaf Talukder",
        "Ilmy Islam",
        "Mahpara Chowdhury",
        "Md Yeasin Ali",
        "Md Sadek Ferdous"
      ],
      "venue": "IEEE ICCIT 2024",
      "role": "First author",
      "doi": "10.1109/iccit64611.2024.11022566",
      "citation": "Rahat, R. R., Ahmed, S., Talukder, A. A., Islam, I., Chowdhury, M., Ali, M. Y., & Ferdous, M. S. (2024). An End-to-End Encrypted Peer-to-Peer Chat System with Self-Sovereign Identity. 2024 27th International Conference on Computer and Information Technology (ICCIT) (pp. 3486–3492). IEEE. https://doi.org/10.1109/iccit64611.2024.11022566",
      "bibtex": "@inproceedings{rahat2024ssi,\n  author = {Rahat, Razin Rayan and Ahmed, Shahriar and Talukder, Abrar Awsaf and Islam, Ilmy and Chowdhury, Mahpara and Ali, Md Yeasin and Ferdous, Md Sadek},\n  title = {{An End-to-End Encrypted Peer-to-Peer Chat System with Self-Sovereign Identity}},\n  booktitle = {2024 27th International Conference on Computer and Information Technology (ICCIT)},\n  year = {2024},\n  pages = {3486--3492},\n  publisher = {IEEE},\n  doi = {10.1109/iccit64611.2024.11022566}\n}\n",
      "bibUrl": "./assets/citations/ssi.bib"
    },
    {
      "id": "biomedical",
      "title": "A Unified Computational Framework for Biomedical Sensing, AI, and Assistive Technologies",
      "authors": [
        "Tashdid Ahmed Shitab",
        "Md. Emam Hossain Emon",
        "Anjuman Ara Mim",
        "Anika Ibnat Oni",
        "Razin Rayan Rahat",
        "Prima Fariya Auishe"
      ],
      "venue": "IEEE BECITHCON 2025",
      "role": "Co-author",
      "doi": "10.1109/becithcon69222.2025.11504276",
      "citation": "Shitab, T. A., Emon, M. E. H., Mim, A. A., Oni, A. I., Rahat, R. R., & Auishe, P. F. (2025). A Unified Computational Framework for Biomedical Sensing, AI, and Assistive Technologies. 2025 IEEE International Conference on Biomedical Engineering, Computer and Information Technology for Health (BECITHCON) (pp. 693–698). IEEE. https://doi.org/10.1109/becithcon69222.2025.11504276",
      "bibtex": "@inproceedings{shitab2025biomedical,\n  author = {Shitab, Tashdid Ahmed and Emon, Md. Emam Hossain and Mim, Anjuman Ara and Oni, Anika Ibnat and Rahat, Razin Rayan and Auishe, Prima Fariya},\n  title = {{A Unified Computational Framework for Biomedical Sensing, AI, and Assistive Technologies}},\n  booktitle = {2025 IEEE International Conference on Biomedical Engineering, Computer and Information Technology for Health (BECITHCON)},\n  year = {2025},\n  pages = {693--698},\n  publisher = {IEEE},\n  doi = {10.1109/becithcon69222.2025.11504276}\n}\n",
      "bibUrl": "./assets/citations/biomedical.bib"
    }
  ]
};
window.PortfolioOrder = ["rag","gesture","finance","qqp","three","ssi"];
