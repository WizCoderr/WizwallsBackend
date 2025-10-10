# Wallpaper API Server

A Node.js/Express server that fetches wallpapers from Unsplash and stores them in MongoDB, with public API endpoints for retrieving wallpapers by category, search, and more.

## Features

- 🖼️ Fetch and organize wallpapers from Unsplash collections
- 🗄️ MongoDB integration for data persistence
- 🔍 Search functionality for wallpapers
- 📂 Category-based wallpaper organization
- ⭐ Premium wallpaper selection (top 3 most-liked photos per batch)
- 🔄 Multiple API key rotation to handle rate limits
- 🚀 RESTful API endpoints for public and admin access

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- Unsplash API keys (up to 6 for rotation)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
ATLAS_URI=your_mongodb_connection_string
EXPRESS_PORT=8000
UNSPLASH_API_KEY1=your_unsplash_api_key_1
UNSPLASH_API_KEY2=your_unsplash_api_key_2
UNSPLASH_API_KEY3=your_unsplash_api_key_3
UNSPLASH_API_KEY4=your_unsplash_api_key_4
UNSPLASH_API_KEY5=your_unsplash_api_key_5
UNSPLASH_API_KEY6=your_unsplash_api_key_6
```

## Usage

### Starting the Server

```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 8000).

## API Endpoints

### Public Endpoints

#### Get All Categories
```
GET /public/category
```
Returns all available wallpaper categories.

#### Get All Wallpapers (Paginated)
```
GET /public/getAllWallpapers?page=1
```
Returns all wallpapers with pagination.

#### Get Wallpapers by Category
```
GET /public/wallpapers?id={collectionId}&page=1
```
Returns wallpapers for a specific category.

#### Get Single Wallpaper
```
GET /public/wallpaper/{id}
```
Returns details for a specific wallpaper.

#### Search Wallpapers
```
GET /public/wallpaper/search/{query}/{page}
```
Search wallpapers by query string.

### Admin Endpoints

**Note:** Admin endpoints are restricted when `IS_SERVER=true` in environment variables.

#### Search Collections
```
GET /admin/collections/{name}
```
Search Unsplash collections by name.

#### Get Collection Photos
```
GET /admin/collections/photos/{id}
```
Get photos from a specific Unsplash collection.

#### Add Collection
```
GET /admin/add/collections/{name}
```
Add a new collection to the fetching queue.

#### Start Fetching
```
GET /start
```
Starts the automated wallpaper fetching and uploading process.

#### Stop Fetching
```
GET /stop
```
Stops the automated fetching process.

## How It Works

### Fetching Process

1. The server searches for collections on Unsplash based on query terms
2. Collections are added to a queue with metadata
3. The `/start` endpoint initiates automated fetching
4. Photos are retrieved in batches of 30
5. Top 3 most-liked photos per batch are marked as premium
6. Data is stored in MongoDB with proper categorization
7. Progress is saved to allow resuming after interruption

### API Key Rotation

The server automatically rotates through 6 Unsplash API keys (45 requests per key) to manage rate limits effectively.

### Data Structure

**Category:**
- ID, title, cover photo, blur hash

**Wallpaper:**
- ID, category ID, dimensions, color, blur hash
- Description, image URL, likes, premium status
- Creation timestamp

## Configuration

- `premiumPerPage`: Number of premium wallpapers per batch (default: 3)
- `maxPhotoCount`: Maximum photos per collection (default: 5000)
- `apiChangePerCount`: Requests per API key before rotation (default: 45)
- Delay between fetches: 14 seconds

## Error Handling

- Database connection errors return 503 status
- Invalid requests return 400 status
- Not found resources return 404 status
- Server errors return 500 status
- Automatic error reporting to file system

## Dependencies

- `express`: Web framework
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variable management
- `body-parser`: Request body parsing
- `unsplash-js`: Unsplash API client
- `node-fetch`: HTTP client
- `mongoose`: MongoDB ODM

## Development

To run in development mode with server restrictions disabled:
- Set `isServer = false` in `app.ts` (current default)
- This enables admin endpoints for local testing

## License

This project is intended for educational purposes. Ensure compliance with Unsplash API terms of service when using in production.

## Notes

- The server includes a 14-second delay between fetches to respect API rate limits
- Progress is saved to allow resuming interrupted fetching sessions
- Premium wallpapers are automatically selected based on like counts
- All wallpapers are fetched at raw quality from Unsplash