import apiFetch from '../auth/client';

export async function getPreApproveds() {
  return apiFetch('/customers/preApproved');
}

export async function getApproveds() {
  return apiFetch('/customers/approved');
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
  const blob = await apiFetch('/customers/export-approved', {
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
