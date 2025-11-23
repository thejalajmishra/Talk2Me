# Environment Configuration

## Frontend Setup

The frontend uses environment variables to configure the API URL. This allows you to easily switch between development, staging, and production environments.

### Setup Instructions

1. **Create `.env` file** in the `frontend` directory:
   ```bash
   cp .env.example .env
   ```

2. **Configure the API URL** in `.env`:
   ```
   VITE_API_URL=http://localhost:8000
   ```

### Environment Variables

- `VITE_API_URL`: The base URL for the backend API
  - **Development**: `http://localhost:8000`
  - **Production**: Your production API URL (e.g., `https://api.talk2me.com`)

### Important Notes

- **Vite Prefix**: All environment variables in Vite must be prefixed with `VITE_` to be exposed to the client-side code
- **Restart Required**: After changing `.env` values, you must restart the development server (`npm run dev`)
- **Git Ignore**: The `.env` file is gitignored. Use `.env.example` as a template for other developers

### Usage in Code

The API URL is centralized in `src/config/api.js`:

```javascript
import API_URL from '../config/api';

// Use in axios calls
axios.get(`${API_URL}/topics`);
```

### Production Build

When building for production:

```bash
# Set production API URL
echo "VITE_API_URL=https://your-production-api.com" > .env

# Build
npm run build
```

The built files will use the API URL specified in `.env` at build time.
