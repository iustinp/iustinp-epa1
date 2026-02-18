/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-pillars block
 *
 * Source: https://academy.worldbank.org/en/how-we-work
 * Base Block: cards
 *
 * Block Structure:
 * - Each row: 2 columns [image | heading + description]
 *
 * Source HTML Pattern:
 * <div class="academy_list_navigation section">
 *   <div class="row">
 *     <div class="col-lg-4">
 *       <div class="lp__listnav_icon_cta">
 *         <div class="lp__listnav_icon_cta_top">
 *           <img src="..." alt="...">
 *           <div class="lp__listnav_icon_cta_title"><span>Title</span></div>
 *         </div>
 *         <div class="lp__listnav_icon_cta_bottom"><p>Description</p></div>
 *       </div>
 *     </div>
 *   </div>
 * </div>
 *
 * Generated: 2026-02-03
 */
export default function parse(element, { document }) {
  // Find all pillar items
  const pillarItems = element.querySelectorAll('.lp__listnav_icon_cta');

  // Build cells array - one row per pillar item
  const cells = [];

  pillarItems.forEach((item) => {
    // Extract icon image
    const image = item.querySelector('.lp__listnav_icon_cta_top img, img');

    // Extract title
    const titleElement = item.querySelector('.lp__listnav_icon_cta_title span, .lp__listnav_icon_cta_title');
    const title = titleElement ? titleElement.textContent.trim() : '';

    // Extract description
    const descElement = item.querySelector('.lp__listnav_icon_cta_bottom p, .lp__listnav_icon_cta_bottom');
    const description = descElement ? descElement.textContent.trim() : '';

    // Create content cell with heading and description
    const contentCell = document.createElement('div');

    // Add heading (h3 for card titles)
    const heading = document.createElement('h3');
    heading.textContent = title;
    contentCell.appendChild(heading);

    // Add description paragraph
    const para = document.createElement('p');
    para.textContent = description;
    contentCell.appendChild(para);

    // Add row: [image, content]
    if (image) {
      cells.push([image.cloneNode(true), contentCell]);
    } else {
      cells.push([contentCell]);
    }
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Pillars', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
