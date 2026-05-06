const WHATSAPP_PHONE_NUMBER = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER || '224XXXXXXXX';

export const formatWhatsAppOrderMessage = ({ firstName, lastName, phone, cart, totalPrice, note, orderId }) => {
  const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
  const customerPhone = phone.trim();
  const lines = [
    'Bonjour Amidjor,',
    `Je vous contacte à propos de ma commande #${orderId || 'N/A'}`,
    '',
    `Nom: ${fullName}`,
    `Téléphone: ${customerPhone}`,
    '',
    'Produits:',
  ];

  cart.forEach((item) => {
    const quantity = Number(item.quantity || 1);
    const itemTotal = Number(item.price || 0) * quantity;
    lines.push(`- ${item.name} x${quantity} = ${itemTotal.toLocaleString()} GNF`);
  });

  lines.push('', `Total: ${totalPrice.toLocaleString()} GNF`, '');

  if (note && note.trim()) {
    lines.push(`Note: ${note.trim()}`, '');
  }

  lines.push('Merci.');
  return lines.join('\n');
};

export const createWhatsAppLink = ({ phoneNumber = WHATSAPP_PHONE_NUMBER, message }) => {
  const cleanedPhone = phoneNumber.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanedPhone}?text=${encodedMessage}`;
};
