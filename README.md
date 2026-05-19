# VietBites Website

Production website for VietBites Toronto, built with **Next.js (App Router)** and integrated with **Notion CMS** and **Brevo email services**.

This repository contains the public-facing website, including the menu, catering pages, and a dynamic contact & wholesale application form available on the /visit page.

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **CMS:** Notion (read-only content source)
- **Email:** Brevo (transactional email API)
- **Hosting:** Vercel
- **Language:** TypeScript

---

## Environment Variables

This project requires environment variables to run correctly.  
**Do not commit secrets to the repo.**

Required variables include:

- `BREVO_API_KEY`
- `BREVO_ADMIN_FROM_EMAIL`
- `BREVO_TO_EMAIL`
- `BREVO_CONFIRM_FROM_EMAIL`

Refer to `.env.example` for the full list.

---

## Running Locally

```bash
npm install
npm run dev
```

The site will be available at:
```
http://localhost:300
```

---

## Project Structure (High-Level)
```
/app
  /visit
  /menu
  /catering

/components
  /visit
  /menu
  /common

/lib
  /notion
  /email
```

- `/lib/notion`→ All Notion database access and normalization
- `/components/visit/contact` → Contact + Wholesale form logic
- `/lib/email` → Brevo email payloads and templates

---

## Content Management (Notion)

All menu data, platforms, and structured content are sourced from Notion databases.

This repo does not contain admin tooling, Notion acts as the CMS.

---

## Deployment

- Production deployments occur from the main branch
- Preview deployments occur from dev and feature branches
- CI/CD is handled by Vercel

---

## License

© VietBites Toronto. All rights reserved.
