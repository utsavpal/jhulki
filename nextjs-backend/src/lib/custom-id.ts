export function getCategoryPrefix(slugOrName: string): string {
  const s = slugOrName.toLowerCase();
  if (s.includes('acc')) return 'ACC';
  if (s.includes('chaniya') || s.includes('choli') || s.includes('lehenga')) return 'CHC';
  if (s.includes('women')) return 'WOM';
  if (s.includes('kurta') || s.includes('men')) return 'MEN';
  if (s.includes('blouse')) return 'BLU';
  if (s.includes('kid')) return 'KID';
  if (s.includes('couple')) return 'CPL';
  return 'GEN';
}

export function generateCustomProductCode(categoryPrefix: string, createdAtDate: Date, sequenceIndex: number): string {
  const brandInitials = 'JHK';
  const day = String(createdAtDate.getDate()).padStart(2, '0');
  const month = String(createdAtDate.getMonth() + 1).padStart(2, '0');
  const numStr = String(sequenceIndex).padStart(2, '0');
  return `${brandInitials}${categoryPrefix}${day}${month}${numStr}`;
}
