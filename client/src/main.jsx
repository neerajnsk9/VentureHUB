import './index.css'
import App from './App.jsx'
import { store } from './app/store.js'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'


import React, { Component } from 'react'

class ErrorBoundary extends Component {
    state = { hasError: false };
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(err) { console.warn("ClerkProvider initialization warning:", err); }
    render() {
        return this.props.children;
    }
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_placeholder';

createRoot(document.getElementById('root')).render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} appearance={{ variables: { colorPrimary: '#a11c5e' } }}>
        <BrowserRouter>
            <Provider store={store}>
                <App />
            </Provider>
        </BrowserRouter>
    </ClerkProvider>,
)
