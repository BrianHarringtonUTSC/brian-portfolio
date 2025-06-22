# MongoDB Setup for PRG Schedule

This guide will help you set up MongoDB for the PRG (Paper Reading Group) schedule migration.

## Prerequisites

1. **MongoDB Installation**: You need MongoDB installed locally or access to a MongoDB service (like MongoDB Atlas).

### Local MongoDB Installation

#### macOS (using Homebrew):

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Windows:

Download and install from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

#### Linux (Ubuntu):

```bash
sudo apt update
sudo apt install mongodb
sudo systemctl start mongodb
```

### MongoDB Atlas (Cloud Service)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string

## Environment Setup

1. **Update `.env.local`** with your MongoDB connection string:

For local MongoDB:

```
MONGODB_URI=mongodb://localhost:27017/brian-portfolio
```

For MongoDB Atlas:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/brian-portfolio
```

## Migration Steps

1. **Install dependencies** (if not already done):

```bash
pnpm install
```

2. **Run the migration script** to populate the database with existing JSON data:

```bash
pnpm migrate
```

This will:

- Connect to MongoDB
- Clear any existing PRG sessions
- Import all sessions from `public/data/prg-schedule.json`
- Display a summary of migrated data

3. **Start the development server**:

```bash
pnpm dev
```

## API Endpoints

The following API endpoints are now available:

### GET `/api/prg-sessions`

- Returns all PRG sessions grouped by academic year
- Query parameter: `?academicYear=2024-2025` (optional)

### POST `/api/prg-sessions`

- Creates a new PRG session
- Body: Session object with required fields

### GET `/api/prg-sessions/[id]`

- Returns a specific PRG session by ID

### PUT `/api/prg-sessions/[id]`

- Updates a specific PRG session by ID

### DELETE `/api/prg-sessions/[id]`

- Deletes a specific PRG session by ID

## Admin Interface

Access the admin interface at `/admin/prg-sessions` to:

- View all sessions in a table format
- Add new sessions
- Edit existing sessions
- Delete sessions

## Database Schema

The PRG sessions are stored with the following schema:

```typescript
interface PRGSession {
  _id: string; // MongoDB ObjectId
  date: string; // Session date (DD-MM-YY format)
  paperTitle: string; // Title of the paper
  paperLink: string; // Link to the paper
  slidesLink?: string; // Optional link to slides
  resources?: string; // Optional additional resources
  presenter: Presenter[]; // Array of presenters
  academicYear: string; // Academic year (e.g., "2024-2025")
  createdAt: Date; // MongoDB timestamp
  updatedAt: Date; // MongoDB timestamp
}

interface Presenter {
  name: string; // Presenter's name
  link: string; // Link to presenter's profile
}
```

## Troubleshooting

### Connection Issues

- Ensure MongoDB is running locally or your Atlas connection string is correct
- Check that the `MONGODB_URI` environment variable is set correctly
- Verify network connectivity for cloud MongoDB instances

### Migration Issues

- Ensure the JSON file exists at `public/data/prg-schedule.json`
- Check that the JSON structure matches the expected format
- Verify database permissions

### API Issues

- Check the browser console for error messages
- Verify the API routes are accessible
- Ensure the database connection is established

## Production Deployment

For production deployment:

1. **Use a production MongoDB service** (MongoDB Atlas recommended)
2. **Set environment variables** in your hosting platform
3. **Update connection string** to use production database
4. **Run migration** on production database
5. **Configure proper security** (authentication, network access, etc.)

## Backup and Maintenance

- **Regular backups**: Set up automated backups of your MongoDB database
- **Data validation**: Periodically verify data integrity
- **Performance monitoring**: Monitor database performance and optimize queries as needed
