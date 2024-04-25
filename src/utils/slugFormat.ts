export const generateSlug = (input: string): string => {
  // Remove accent symbols
  const slug = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  // Remove spaces and replace them with hyphens
  return slug
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-$/, '')
}
