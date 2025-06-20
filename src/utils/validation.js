// Validation utilities for payment form
export const validateCardholderName = (name) => {
  if (!name || typeof name !== "string") {
    return { isValid: false, error: "Cardholder name is required" };
  }

  const trimmedName = name.trim();
  if (trimmedName.length < 2) {
    return { isValid: false, error: "Cardholder name must be at least 2 characters" };
  }

  if (trimmedName.length > 50) {
    return { isValid: false, error: "Cardholder name must be less than 50 characters" };
  }

  // Basic name validation - letters, spaces, hyphens, apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(trimmedName)) {
    return { isValid: false, error: "Cardholder name contains invalid characters" };
  }

  return { isValid: true, error: null };
};

export const validateExpirationDate = (month, year) => {
  if (!month || !year) {
    return { isValid: false, error: "Expiration date is required" };
  }

  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);

  if (monthNum < 1 || monthNum > 12) {
    return { isValid: false, error: "Invalid expiration month" };
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100; // Get 2-digit year
  const currentMonth = currentDate.getMonth() + 1; // getMonth() is 0-indexed

  if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
    return { isValid: false, error: "Card has expired" };
  }

  return { isValid: true, error: null };
};

export const validatePaymentForm = (formData) => {
  const errors = {};

  // Validate cardholder name
  const nameValidation = validateCardholderName(formData.cardholderName);
  if (!nameValidation.isValid) {
    errors.cardholderName = nameValidation.error;
  }

  // Validate expiration date
  const expValidation = validateExpirationDate(formData.expirationMonth, formData.expirationYear);
  if (!expValidation.isValid) {
    errors.expiration = expValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
