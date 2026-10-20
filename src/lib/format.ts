export function getWhatsAppUrl(numberStr: string): string {
  if (!numberStr) return '#';
  const digits = numberStr.replace(/\D/g, '');
  if (!digits) return '#';
  if (digits.startsWith('01')) {
    return `https://wa.me/88${digits}`;
  }
  return `https://wa.me/${digits}`;
}

