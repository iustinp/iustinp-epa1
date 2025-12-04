import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  // Check if first row contains heading (h2) and button
  const firstRow = rows[0];
  const hasHeader = firstRow?.querySelector('h2');

  let stickyHeader = null;
  let cardRows = rows;

  if (hasHeader) {
    // Create sticky header from first row
    stickyHeader = document.createElement('div');
    stickyHeader.className = 'cards-feature-sticky-header';
    while (firstRow.firstElementChild) {
      stickyHeader.append(firstRow.firstElementChild);
    }
    cardRows = rows.slice(1); // Process remaining rows as cards
  }

  /* change to ul, li */
  const ul = document.createElement('ul');
  cardRows.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-feature-card-image';
      else div.className = 'cards-feature-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';

  if (stickyHeader) {
    block.append(stickyHeader);
  }
  block.append(ul);
}
