
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';

// Make sure to set your publishable key from environment variables
const PUBLISHABLE_KEY = "pk_test_Y2xvc2luZy1iYXJuYWNsZS0yOC5jbGVyay5hY2NvdW50cy5kZXYk";

// Check if the key is available
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
