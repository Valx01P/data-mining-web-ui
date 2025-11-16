#+ Data Mining Web UI

Interactive Next.js application demonstrating association rule mining (Apriori, Eclat, FP-Growth) with a polished UI for browsing products, creating transactions, preprocessing data, running mining algorithms and querying results.

Author: Mandy Saint Simon
Repository: Ztos0/data-mining-web-ui
Branch: Adjustment

---

## Features

- Product catalog and category carousels with glassmorphism styling
- Slider switch navigation between `Products` and `Transactions`
- Add-to-cart and cart sidebar with quantity controls and checkout → transactions
- Preprocessing report showing cleaning statistics and summary
- Query Analysis panel for interactively inspecting mined rules and confidence/support
- Built-in implementations of Apriori, Eclat, and FP-Growth (client-side JS)

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
git clone https://github.com/Ztos0/data-mining-web-ui.git
cd data-mining-web-ui

# install dependencies
npm install

# run dev server
npm run dev
```

Open `http://localhost:3000` in your browser.

Build for production:

```bash
npm run build
npm run start
```

---

## Project Structure (relevant files)

- `app/` - Next.js app router pages and components
  - `app/page.tsx` - Home / hero and product overview
  - `app/components/Nav.tsx` - Top navigation with slider switch and cart button
  - `app/components/ProductRow.tsx` - Category carousel (now supports Add to Cart)
  - `app/components/CartSidebar.tsx` - Shopping cart drawer with quantity controls
  - `app/components/QueryPanel.tsx` - Query Analysis UI for mined rules
  - `app/(pages)/transactions/page.tsx` - Transactions and preprocessing report
- `lib/algorithms/` - `apriori.ts`, `eclat.ts`, `fpgrowth.ts` (mining implementations)
- `lib/preprocessing/cleaner.ts` - Data cleaning utilities
- `store/` - Zustand stores (`useShoppingCartStore.ts`, `useAssociationStore.ts`, `useTransactionStore.ts`)
- `public/data/` - sample CSV and products data (`products.csv`, `sample_transactions.csv`, `products.json`)

---

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

The implementations are in `lib/algorithms/*.ts` and are intended for client-side demonstration purposes (not optimized for very large datasets).

---

## Testing & Validation

- Manual tests: CSV import, preprocessing report, mining runs, query analysis, add-to-cart flows.
- Automated: None included by default — you can add unit tests against `lib/algorithms` functions (Jest/Vitest recommended).

---

## Known Limitations

- Mining implementations run client-side and are not optimized for large-scale datasets.
- UI/UX improvements can be made (toasts on add-to-cart, visual confirmation on mining completion).

---

## Development notes

- Add new algorithm: implement in `lib/algorithms`, expose in `useAssociationStore`, and add button in `QueryPanel.tsx`.
- Cart state persists via `zustand`'s `persist` middleware (localStorage).

---

## AI Tool Usage

This repository used AI-assisted tools during development for scaffolding and debugging. Specifically:

- Chat-based assistance was used to help refactor UI components and fix parsing errors.
- Code-completion assistance (e.g., Copilot) was used to accelerate boilerplate creation.

All AI-generated code was verified and adapted to the project's needs.

---

## Contributing

1. Fork the repo
2. Create a branch for your feature: `git checkout -b feature/my-change`
3. Make changes, run `npm run dev`, and verify behavior
4. Create a pull request with a clear description

---

If you'd like, I can also add a short CONTRIBUTING.md, some example unit tests for the algorithms, or wire up to a CI workflow. Tell me which you'd prefer next.
