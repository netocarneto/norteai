export function confirmDeletion(label: string) {
  return window.confirm(`Eliminar ${label}? Esta ação não pode ser anulada.`);
}

export function explainDeletionBlock(message: string) {
  window.alert(message);
}
