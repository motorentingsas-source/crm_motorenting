import apiFetch from './client';
import { normalizeDateToISO } from './utils';

export async function getCustomers() {
  return apiFetch('/customers');
}

export async function getCustomerById(id) {
  return apiFetch(`/customers/${id}`);
}

export async function createCustomer(dto) {
  const body = {
    ...dto,
    birthdate: dto.birthdate ? normalizeDateToISO(dto.birthdate) : undefined,
    advisorId: Number(dto.advisorId),
    stateId: Number(dto.stateId),
  };
  return apiFetch('/customers', { method: 'POST', body: JSON.stringify(body) });
}

export async function updateCustomer(id, dto) {
  const body = {
    ...dto,
    birthdate: dto.birthdate ? normalizeDateToISO(dto.birthdate) : undefined,
  };
  return apiFetch(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function deleteCustomer(id) {
  return apiFetch(`/customers/${id}`, { method: 'DELETE' });
}

export async function addComment(customerId, description) {
  return apiFetch(`/customers/${customerId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ description }),
  });
}

export async function assignAdvisor(customerId, advisorId) {
  return apiFetch(`/customers/${customerId}/assign/${advisorId}`, {
    method: 'POST',
  });
}

export async function importCustomers(file) {
  const fd = new FormData();
  fd.append('file', file);
  return apiFetch('/customers/import', { method: 'POST', body: fd });
}
