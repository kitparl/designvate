# DESIGNVATE VENTURES LLP — Website

A premium, mobile-first website for DESIGNVATE VENTURES LLP (VSAS Group), built with Next.js, Tailwind CSS, and Framer Motion.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Edit Content

All website content is controlled via a single file:

```
/data/content.json
```

### Option 1: Use the Browser Editor

1. Go to `/edit` on your website
2. Enter password: `designvate2024`
3. Edit any section using the form fields
4. Click **Download JSON** to get the updated file
5. Replace `/data/content.json` in your project with the downloaded file
6. Push to GitHub — Vercel auto-deploys

### Option 2: Edit the JSON File Directly

1. Open `/data/content.json` in any text editor
2. Edit the text, image URLs, or add/remove items
3. Save the file
4. Push to GitHub to deploy

### What You Can Edit

| Section       | What you can change                        |
| ------------- | ------------------------------------------ |
| Home          | Title, subtitle, hero image, CTA button    |
| About         | Description, vision, mission, team info    |
| Stats         | Numbers and labels                         |
| Services      | Add/edit/remove services                   |
| Projects      | Add/edit/remove projects with images       |
| Testimonials  | Client quotes                              |
| Clients       | Client names and logos                      |
| Contact       | Phone, email, address, map                 |
| SEO           | Page title, meta description, keywords     |

### Images

You can use:
- **External URLs** (recommended) — e.g., from Unsplash, Imgur, or any image hosting
- **Local images** — place them in `/public/images/` and reference as `/images/filename.jpg`

## Deploy on Vercel (Free)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **Import Project** → Select your GitHub repo
4. Click **Deploy** — that's it!

Every time you push changes to GitHub, Vercel automatically re-deploys.

## Deploy on Netlify (Free)

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click **Add New Site** → **Import an existing project**
4. Select your GitHub repo
5. Build command: `npm run build`
6. Publish directory: `.next`
7. Click **Deploy**

## Tech Stack

- **Next.js 16** (App Router, Static Generation)
- **Tailwind CSS** (Utility-first styling)
- **Framer Motion** (Animations)
- **Lucide React** (Icons)
- No backend, no database

## Project Structure

```
website/
├── data/
│   └── content.json          ← Edit this file to update website content
├── public/
│   └── images/               ← Place local images here
├── src/
│   ├── app/
│   │   ├── about/            ← About page
│   │   ├── contact/          ← Contact page
│   │   ├── edit/             ← Content editor (browser-based)
│   │   ├── projects/         ← Projects listing + detail pages
│   │   ├── services/         ← Services listing + detail pages
│   │   ├── layout.tsx        ← Root layout
│   │   └── page.tsx          ← Home page
│   ├── components/           ← Reusable UI components
│   └── lib/
│       └── content.ts        ← Content loader
└── package.json
```
