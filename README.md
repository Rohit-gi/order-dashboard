# Order Management Dashboard

A modern internal dashboard to manage orders.

## Tech Stack
- Next.js 15 (App Router + Server Actions)
- TypeScript + React 19
- Material UI v7 + X DataGrid v8
- Recharts
- JSON as local API data source

## Project Structure

src/
├── app/
│   ├── layout.tsx            # Shared layout with Sidebar & Header
│   ├── page.tsx              # Redirect to /home
│   ├── home/                 # Home page with summary cards
│   ├── order/
│   │   ├── list/             # Order List with filters
│   │   ├── create/           # Order Create form
│   │   ├── [orderNumber]/    # View Order details (read-only)
├── components/
│   ├── Sidebar.tsx           # Collapsible nav menu
│   ├── UserModal.tsx         # Profile modal on user icon click
│   ├── OrderForm.tsx         # Shared form logic for Create/View
│   ├── OrderTable.tsx        # Modular DataGrid
│   ├── OrderFilters.tsx      # Filters for list page
│   ├── OrderSummary.tsx      # Cards showing totals
│   ├── OrderHistory.tsx      # Timeline/history view
├── lib/
│   ├── orders.ts             # Fetch + manipulate orders from JSON
├── data/
│   └── orders.json           # Simulated API data source


## Features

- Collapsible sidebar + top user modal 
- Home page with live summary          
- Orders table with sorting + filters  
- Create order with validation rules   
- Modular View page (read-only mode)   
- Chronological history log            
- Additional filters (date, codes)     
- Fully responsive & accessible UI     


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
