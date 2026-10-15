# Invoicy

A clean, simple billing/invoicing web app. Manage companies (clients), create bills with Indian GST calculations, download PDF invoices, and track revenue — all from a dashboard.

## Features

- 🔐 Authentication (email + password via Supabase Auth)
- 🏢 Manage companies (clients) with GST details
- 🧾 Create, view, edit and delete bills with line items
- 📊 GST calculation (default rate configurable, Indian GST format validation)
- 📄 PDF invoice download
- 📈 Dashboard analytics (revenue charts, top companies, recent bills)
- 🔒 Row Level Security — every user only sees their own data
- 👁️ Hide amounts toggle (mask money values as `****`)

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Backend:** [Supabase](https://supabase.com) (Auth, Postgres, RLS)
- **PDF:** `@react-pdf/renderer`

## Getting Started

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd invoicy
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a Supabase project and run the SQL from `docs/` in the SQL editor.

4. Create a `.env.local` file (never committed) with your Supabase keys:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=<your-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   ```

5. Run the dev server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## License

MIT © `<Your Name>` — see [LICENSE](LICENSE).
