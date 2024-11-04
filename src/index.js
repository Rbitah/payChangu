const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

class PaymentsService {
  constructor({ apiKey, baseURL }) {
    this.apiKey = apiKey;
    this.operatorRefIds = {
      '8': '27494cb5-ba9e-437f-a114-4e7a7686bcca', // TNM Mpamba
      '9': '20be6c20-adeb-4b5b-a7ba-0769820df4fb', // Airtel Money
    };
    this.axiosInstance = axios.create({
      baseURL: baseURL || 'https://api.paychangu.com',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  generateUniqueTransactionReference() {
    return uuidv4();
  }

  getMobileMoneyOperatorRefId(mobile) {
    const prefix = mobile.charAt(0);
    const refId = this.operatorRefIds[prefix];
    if (!refId) {
      throw new Error('Unsupported mobile number prefix.');
    }
    return refId;
  }

  async initiatePayment({  amount, email, first_name,last_name, description, callbackUrl, returnUrl }) {
    const txRef = this.generateUniqueTransactionReference();

    try {
      const response = await this.axiosInstance.post('/payment', {
        tx_ref: txRef,
        callback_url: callbackUrl,
        return_url: returnUrl,
        currency: 'MWK',
        email,
        first_name,
        last_name,
        description,
        amount,
      });
      return response.data;
    } catch (error) {
      console.error('Error initiating payment:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'An error occurred while initiating payment.');
    }
  }

  async verifyPayment(txRef) {
    try {
      const response = await this.axiosInstance.get(`/verify-payment/${txRef}`);
      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'An error occurred while verifying payment.');
    }
  }

  async initiateMobileMoneyPayout({ mobile, amount }) {
    const mobileMoneyOperatorRefId = this.getMobileMoneyOperatorRefId(mobile);
    const chargeId = this.generateUniqueTransactionReference();

    try {
      const response = await this.axiosInstance.post('/mobile-money/payouts/initialize', {
        mobile,
        mobile_money_operator_ref_id: mobileMoneyOperatorRefId,
        amount,
        charge_id: chargeId,
      });
      return response.data;
    } catch (error) {
      console.error('Error initiating payout:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'An error occurred while processing payout.');
    }
  }
}

module.exports = PaymentsService;
