Interactive Supermarket Simulation with Association Rule Mining

Authors Information

Name: 
Mandy Saint Simon


Student ID: 

Course: CAI 4002 - Artificial Intelligence
Semester: [Fall/Spring Year]

## System Overview:
Application demonstrating association rule mining (Apriori, Eclat, FP-Growth) with UI for browsing products, creating transactions, preprocessing data, running mining algorithms and querying results.



## Features

- Product catalog and category carousels with glassmorphism UI
- Slider switch navigation between `Products` and `Transactions`
- Add-to-cart and cart sidebar with quantity controls and checkout → transactions
- Preprocessing report showing cleaning statistics and summary
- Query Analysis panel for  inspecting mined rules and confidence/support
-Implementations of Apriori, Eclat, and FP-Growth

---

## Technical Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS for styling
- Zustand for client-side state management
- Lucide icons

---

## Getting Started (macOS / zsh)

Prerequisites:

- Node.js 18+ (LTS recommended)
- npm or pnpm

Install and run locally:

```bash
# clone repository (if not already)

# install dependencies
npm install

# run dev server
npm run dev
```

Open `http://localhost:3000` in your browser.

or 

https://data-mining-web-ui.vercel.app/


## Usage Guide

1. Products

	- Browse categories in the carousels and click `Add` on product cards to add items to the cart.
	- Open the cart (top-right) to change quantities or `Pay` to record a transaction and navigate to the Transactions page.

2. Transactions & Preprocessing

	- Upload or load sample transactions from `public/data/sample_transactions.csv`.
	- The Preprocessing Report summarizes cleaning steps (duplicates removed, empty rows, normalizations).

3. Mining

	- On the Transactions page use the `Query Analysis` panel:
	  - Choose the algorithm (Apriori, Eclat, FP-Growth).
	  - Adjust minimum support and confidence sliders.
	  - Click `Run Mining` to execute on the loaded transactions.
	  - View execution time and generated rules; use the query field to inspect rules for a specific item.

---

## Algorithms — brief notes

- Apriori: Level-wise candidate generation using frequent itemset pruning by support. Good for small-to-medium datasets; CPU and memory grow quickly with itemset size.
- Eclat: Uses vertical (TID-set) representation and depth-first traversal; more memory-efficient for some datasets and often faster than Apriori for dense datasets.
- FP-Growth: Builds an FP-tree and mines frequent patterns without candidate generation; generally faster than Apriori on larger datasets.

The implementations are in `lib/algorithms/*.ts`.
---

## Testing & Validation

- Manual tests: CSV import, preprocessing report, mining runs, query analysis, add-to-cart flows.
- Automated: None included by default — you can add unit tests against `lib/algorithms` functions (Jest/Vitest recommended).

---

## Known Limitations

- Mining implementations run client-side and are not optimized for large-scale datasets.
- UI/UX improvements can be made (toasts on add-to-cart, visual confirmation on mining completion).

---



## AI Tool Usage

This repository used AI-assisted tools during development for scaffolding and debugging. Specifically:

- Chat-based assistance was used to help refactor UI components and fix parsing errors.
- Code-completion assistance (e.g., Copilot) was used to accelerate boilerplate creation.

All AI-generated code was verified and adapted to the project's needs.

---

