/**
 * Metadata block - processes page metadata and removes itself from DOM
 * @param {Element} block The metadata block element
 */
export default function decorate(block) {
  // Read metadata from the block table
  const rows = [...block.querySelectorAll(':scope > div')];

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      const value = cells[1].innerHTML.trim();

      // Skip if key is empty
      if (!key) return;

      // Check if meta tag already exists
      const existingMeta = document.head.querySelector(`meta[name="${key}"], meta[property="${key}"]`);

      if (!existingMeta) {
        const meta = document.createElement('meta');
        // Use property for og: tags, name for others
        if (key.startsWith('og:') || key.startsWith('twitter:')) {
          meta.setAttribute('property', key);
        } else {
          meta.setAttribute('name', key);
        }
        // Strip HTML tags for meta content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = value;
        meta.setAttribute('content', tempDiv.textContent.trim());
        document.head.appendChild(meta);
      }
    }
  });

  // Remove the metadata section from DOM
  const section = block.closest('.section');
  if (section) {
    section.remove();
  }
}
