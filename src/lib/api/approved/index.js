import apiFetch from '../auth/client';

export async function getPreApproveds(params = {}) {
  const { page = 1, limit = 10, ...filters } = params;

  const query = new URLSearchParams();

  query.set('page', String(page));
  query.set('limit', String(limit));

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      query.set(key, String(value));
    }
  });

  return apiFetch(`/customers/preApproved?${query.toString()}`);
}

export async function getApproveds(params = {}) {
  const { page = 1, limit = 10, ...filters } = params;

  const query = new URLSearchParams();

  query.set('page', String(page));
  query.set('limit', String(limit));

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      query.set(key, String(value));
    }
  });

  return apiFetch(`/customers/approved?${query.toString()}`);
}

export async function createApproved(id, dataApproved) {
  const body = cleanCustomerPayload(dataApproved);
  return apiFetch(`/customers/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// Limpia los campos innecesarios antes de enviar el payload
function cleanCustomerPayload(customer) {
  const cleanArray = (arr) =>
    arr?.map(({ id, customerId, createdAt, isNew, ...rest }) => rest) || [];

  return {
    ...customer,
    holders: cleanArray(customer.holders),
    payments: cleanArray(customer.payments),
    receipts: cleanArray(customer.receipts),
  };
}

export async function exportAllCustomersApproved() {
  const blob = await apiFetch('/customers/approved/export', {
    method: 'GET',
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `clientes_aprobados_${Date.now()}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function downloadDeliveryOrder(customerId, nameCustomer) {
  const blob = await apiFetch(`/customers/${customerId}/order-delivery`, {
    method: 'GET',
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `orden_entrega_${nameCustomer}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
