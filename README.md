# queue-management-system

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## API Request Helper

The project includes a helpful Axios instance configured in `src/helpers/request.js` to simplify making requests to the backend API.

### Features:
- **Base URL:** Pre-configured to point to your backend (default: `http://localhost:3000`). You should adjust this URL in the file to match your API server.
- **Automatic Authorization Header:** It automatically attaches the `Authorization: Bearer <token>` header to every request if an `access_token` is found in `localStorage`.
- **Centralized Error Handling:** API errors are automatically caught and displayed using a `SweetAlert2` popup. The popup shows the error message from the API response.
- **Copy Transaction ID:** If the error response from the API contains a `transactionId`, it will be displayed in the error popup, and the user can easily copy it to the clipboard.

### How to Use

First, import the request helper into your Vue component or Pinia store:

```javascript
import request from '@/helpers/request';
```

The helper handles the `Authorization` header automatically. It checks `localStorage` for an `access_token`. For login or other authentication actions, you should save the token there:

```javascript
// Example after a successful login
localStorage.setItem('access_token', response.data.access_token);
```
