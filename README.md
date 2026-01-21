# AS ONE MAN Diamond Global Conference Registration

Next.js registration application for the AS ONE MAN Diamond Global Conference (February 1-28, 2026).

## Features

- User registration with dynamic zone/group selection
- MongoDB database storage
- Admin dashboard with authentication
- Export registrations to CSV
- Delete individual or all registrations
- Responsive design with conference theme

## Environment Variables

Create a `.env` file with:

```bash
MONGODB_URI=mongodb://localhost:27017/conference-registration
ADMIN_PASSWORD=aom@2026
```

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Admin Access

Navigate to `/admin` and use password: `aom@2026`

## Docker Deployment

```bash
docker build -t conference-registration .
docker run -p 3000:3000 -e MONGODB_URI=mongodb://mongo:27017/conference-registration -e ADMIN_PASSWORD=aom@2026 conference-registration
```

## Coolify Deployment

1. Push this code to a public Git repository (GitHub/GitLab)
2. In Coolify, create a new application
3. Connect your Git repository
4. Set environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `ADMIN_PASSWORD`: Your admin password (default: aom@2026)
5. Deploy!

## Tech Stack

- Next.js 14 (App Router)
- MongoDB with Mongoose
- TypeScript
- Tailwind CSS
