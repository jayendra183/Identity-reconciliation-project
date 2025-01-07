# Emotorad Backend Task: Identity Reconciliation

This service provides an API endpoint for identifying and consolidating contact information across multiple requests.

## Features

- Contact identification and linking
- Automatic consolidation of contact information
- Primary and secondary contact management
- Comprehensive validation and error handling

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file with:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run database migrations:
   The migrations will be applied automatically when connecting to Supabase.

## Running the Service

Development mode:
```bash
npm run dev
```

Run tests:
```bash
npm test
```

## API Documentation

### POST /identify

Identifies and consolidates contact information.

Request body:
```json
{
  "email": "string?",
  "phoneNumber": "string?"
}
```

Response:
```json
{
  "contact": {
    "primaryContactId": "uuid",
    "emails": ["string"],
    "phoneNumbers": ["string"],
    "secondaryContactIds": ["uuid"]
  }
}
```

## Error Handling

The service includes comprehensive error handling:
- Input validation
- Database errors
- Runtime errors

All errors return appropriate HTTP status codes and descriptive messages.

## Testing

The test suite includes:
- Input validation tests
- Contact creation tests
- Contact linking tests
- Edge case handling

## Security

- Row Level Security (RLS) enabled
- Input validation and sanitization
- Error message sanitization
