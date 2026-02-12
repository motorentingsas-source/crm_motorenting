import apiFetch from '../auth/client';

export async function getPaymentByOrderNumber(value) {
  return apiFetch(`/customers/payments/${value}`);
}

export async function createPayment(orderNumber, dataPayment) {
  const body = dataPayment;
  return apiFetch(`/customers/${orderNumber}/payments`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
