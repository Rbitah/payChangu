
# paychangu

A Node.js service for interacting with the PayChangu API, enabling payments and mobile money payouts in Malawi.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
  - [Initialization](#initialization)
  - [Methods](#methods)
    - [initiatePayment](#initiatepayment)
    - [verifyPayment](#verifypayment)
    - [initiateMobileMoneyPayout](#initiatemobilemoneypayout)
  - [Error Handling](#error-handling)
- [Examples](#examples)
- [License](#license)

## Introduction

`paychangu` provides a simple interface for integrating with the PayChangu API, allowing for payment processing and mobile money payouts specifically in Malawi. This service helps developers easily connect to PayChangu's payment solutions, supporting both payment initiation and verification, as well as mobile money transfers.

## Installation

To install the package, run:

```bash
npm install paychangu
```

## Usage

### Initialization

To start using `paychangu`, import the service and initialize it with your API credentials:

```javascript
const PaymentsService = require('paychangu');

const paymentService = new PaymentsService({
  apiKey: 'YOUR_API_KEY', // Replace with your actual API key
  baseURL: 'https://api.paychangu.com', // Optional, defaults to this URL
});
```

### Methods

#### `initiatePayment`

Initiates a payment transaction.

```javascript
await paymentService.initiatePayment({
  currency: 'MWK'   //currency MWK or USD
  amount: 1000,             // Amount in MWK Or USD depening on currency
  email: 'user@example.com', // Payer's email address(Optional)
  first_name,         // Payer's first name(Optional)
  last_name,         // Payer's last name (Optional)
  description: 'Test Payment', // Description of the payment
  callbackUrl: 'https://your-callback-url.com', // URL for payment completion callback
  returnUrl: 'https://your-return-url.com',     // URL to redirect after payment
});
```

This method returns a response with details about the initiated payment.

#### `verifyPayment`

Verifies the status of a payment using its transaction reference.

```javascript
await paymentService.verifyPayment(txRef);
```

**Parameters:**

- `txRef` (string): Transaction reference of the payment.

This method returns the payment verification details.

#### `initiateMobileMoneyPayout`

Initiates a payout to a mobile money account.

```javascript
await paymentService.initiateMobileMoneyPayout({
  mobile: '801234567', // Mobile number to receive payout
  amount: 500,         // Amount to payout in MWK
});
```

This method returns a response with details about the initiated payout.

### Error Handling

Each method throws an error if the API call fails. The error includes a message to assist with debugging.

## Examples

Here's an example of initiating a payment:

```javascript
try {
  const paymentResponse = await paymentService.initiatePayment({
    currency: 'MWK',
    amount: 1000,
    first_name:'Roberto',
    last_name:'Bitah',
    email: 'user@example.com',
    description: 'Sample Payment',
    callbackUrl: 'https://your-callback-url.com',
    returnUrl: 'https://your-return-url.com',
  });
  console.log('Payment initiated:', paymentResponse);
} catch (error) {
  console.error('Error initiating payment:', error.message);
}
```

## License

This project is licensed under the MIT License.
