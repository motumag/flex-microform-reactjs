# CyberSource Microform with Redux Toolkit

A modern React application implementing CyberSource Secure Acceptance Microform with Redux Toolkit (RTK) and RTK Query for state management.

## Features

- **Redux Toolkit (RTK)**: Modern Redux state management with simplified syntax
- **RTK Query**: Powerful data fetching and caching solution
- **Modular Architecture**: Well-organized component structure
- **Custom Hooks**: Separation of concerns with reusable logic
- **Real-time Debug Panel**: Comprehensive debugging and monitoring
- **TypeScript Support**: Type-safe development (types defined in JS for now)
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Architecture Overview

### State Management Structure

```
src/
├── store/
│   ├── index.js                 # Store configuration
│   ├── api/
│   │   └── paymentApi.js        # RTK Query API slice
│   └── slices/
│       ├── paymentFormSlice.js  # Payment form state
│       └── debugSlice.js        # Debug information state
├── hooks/
│   ├── usePaymentForm.js        # Payment form logic hook
│   ├── useMicroform.js          # CyberSource integration hook
│   └── useDebug.js              # Debug utilities hook
├── components/
│   ├── PaymentForm/             # Payment form components
│   ├── DebugPanel/              # Debug panel components
│   └── MicroformCheckout.jsx    # Main container component
└── utils/
    ├── validation.js            # Form validation utilities
    └── logger.js                # Logging utilities
```

### Key Features

#### 1. Redux Toolkit Store

- **paymentApi**: RTK Query slice for API calls
- **paymentForm**: Form state and UI management
- **debug**: Debug information and logging

#### 2. Custom Hooks

- **usePaymentForm**: Manages form state and validation
- **useMicroform**: Handles CyberSource SDK integration
- **useDebug**: Provides debugging and logging utilities

#### 3. Modular Components

- **PaymentForm**: Main payment form with card preview
- **DebugPanel**: Real-time debugging and monitoring
- **Reusable UI Components**: Card preview, form fields, buttons

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- CyberSource backend API running on localhost:8081

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Environment Variables

Create a `.env` file in the root directory:

```
REACT_APP_API_BASE_URL=http://localhost:8081
```

## API Integration

The application uses RTK Query for API management:

### Endpoints

- **POST /flex/microform/capture-context**: Get CyberSource capture context
- **POST /payment/process**: Process payment (optional)
- **POST /payment/validate-token**: Validate token (optional)

### Configuration

Update the API configuration in `src/store/api/paymentApi.js`:

```javascript
const BASE_URL = "http://localhost:8081";
```

## State Management

### Payment Form State

```javascript
{
  cardholderName: '',
  expirationMonth: '01',
  expirationYear: '25',
  flexConfig: {
    captureContext: null,
    clientLibrary: null,
    clientLibraryIntegrity: null
  },
  microformInstance: null,
  tokenInfo: null,
  loading: false,
  error: null
}
```

### Debug State

```javascript
{
  scriptLoaded: false,
  microformInitialized: false,
  fieldsLoaded: false,
  apiConnected: false,
  lastApiCall: null,
  errors: [],
  logs: []
}
```

## Custom Hooks Usage

### usePaymentForm Hook

```javascript
const { cardholderName, updateCardholderName, tokenInfo, error, loading, copyToClipboard } = usePaymentForm();
```

### useMicroform Hook

```javascript
const { processPayment, fetchCaptureContext, isGettingContext } = useMicroform();
```

### useDebug Hook

```javascript
const { debugStatus, errors, logs, exportDebugInfo } = useDebug();
```

## Component Structure

### PaymentForm Components

- `PaymentForm.jsx`: Main form container
- `CardPreview.jsx`: Animated credit card preview
- `PaymentFormFields.jsx`: Form input fields
- `PaymentButton.jsx`: Submit button with loading states
- `StatusMessages.jsx`: Error and success messages

### DebugPanel Components

- `DebugPanel.jsx`: System debug and API status
- `DebugStatus.jsx`: Status indicators
- `ApiStatus.jsx`: API connection status
- `ConfigurationDisplay.jsx`: SDK configuration details
- `TransientTokenPanel.jsx`: Dedicated transient token information with validation details
- `AuthenticationSetupPanel.jsx`: Authentication setup enrollment with complete response data

## Validation

The application includes comprehensive form validation:

- **Cardholder Name**: Required, 2-50 characters, letters only
- **Expiration Date**: Required, must be future date
- **Card Fields**: Validated by CyberSource SDK

## Error Handling

- **Network Errors**: Automatic retry with user feedback
- **Validation Errors**: Real-time form validation
- **API Errors**: Detailed error messages with suggested solutions
- **SDK Errors**: Graceful fallback with debug information

## Debug Features

- **Real-time Status**: API connection, SDK loading, field initialization
- **Activity Logs**: Detailed operation logs with timestamps
- **Error Tracking**: Historical error tracking with context
- **Configuration Display**: SDK configuration details
- **Export Functionality**: Export debug information for support

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Building for Production

```bash
npm run build
```

This builds the app for production to the `build` folder.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please check the debug panel for detailed error information and logs. The debug panel provides:

- Real-time status indicators
- Detailed error messages
- Configuration information
- Activity logs
- Export functionality for sharing debug information
