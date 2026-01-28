import { toClassName, fetchPlaceholders } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Tabs-Carousel Block
 *
 * A compound block that combines tabs with carousels.
 * Each tab contains a carousel of cards.
 *
 * Authoring format:
 * | **Tabs-Carousel** |  |
 * | **Tab: People** |  |
 * | ![Education](img.png) | ### Education<br>Description... |
 * | ![Health](img.png) | ### Health...<br>Description... |
 * | **Tab: Planet** |  |
 * | ![Agriculture](img.png) | ### Agriculture<br>Description... |
 */

function updateActiveSlide(carousel, slideIndex) {
  const slides = carousel.querySelectorAll('.tabs-carousel-slide');
  const realIndex = Math.max(0, Math.min(slideIndex, slides.length - 1));

  carousel.dataset.activeSlide = realIndex;

  slides.forEach((slide, idx) => {
    slide.setAttribute('aria-hidden', idx !== realIndex);
    slide.querySelectorAll('a').forEach((link) => {
      if (idx !== realIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });

  // Update navigation button states
  const prevBtn = carousel.querySelector('.slide-prev');
  const nextBtn = carousel.querySelector('.slide-next');
  if (prevBtn) prevBtn.disabled = realIndex === 0;
  if (nextBtn) nextBtn.disabled = realIndex >= slides.length - 1;
}

function showSlide(carousel, slideIndex) {
  const slides = carousel.querySelectorAll('.tabs-carousel-slide');
  const realIndex = Math.max(0, Math.min(slideIndex, slides.length - 1));
  const activeSlide = slides[realIndex];

  if (activeSlide) {
    const slidesContainer = carousel.querySelector('.tabs-carousel-slides');
    slidesContainer.scrollTo({
      top: 0,
      left: activeSlide.offsetLeft,
      behavior: 'smooth',
    });
  }
}

function bindCarouselEvents(carousel) {
  const prevBtn = carousel.querySelector('.slide-prev');
  const nextBtn = carousel.querySelector('.slide-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const currentSlide = parseInt(carousel.dataset.activeSlide || '0', 10);
      showSlide(carousel, currentSlide - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const currentSlide = parseInt(carousel.dataset.activeSlide || '0', 10);
      showSlide(carousel, currentSlide + 1);
    });
  }

  // Observe slides for intersection
  const slideObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const slideIndex = parseInt(entry.target.dataset.slideIndex, 10);
          updateActiveSlide(carousel, slideIndex);
        }
      });
    },
    { root: carousel.querySelector('.tabs-carousel-slides'), threshold: 0.5 },
  );

  carousel.querySelectorAll('.tabs-carousel-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
}

function createSlide(row, slideIndex) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.classList.add('tabs-carousel-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`tabs-carousel-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

function createCarousel(cards, tabId, placeholders) {
  const carousel = document.createElement('div');
  carousel.classList.add('tabs-carousel-carousel');
  carousel.dataset.activeSlide = '0';

  const container = document.createElement('div');
  container.classList.add('tabs-carousel-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('tabs-carousel-slides');

  cards.forEach((row, idx) => {
    const slide = createSlide(row, idx);
    moveInstrumentation(row, slide);
    slidesWrapper.append(slide);
  });

  container.append(slidesWrapper);

  // Add navigation if more than one card
  if (cards.length > 1) {
    const navButtons = document.createElement('div');
    navButtons.classList.add('tabs-carousel-navigation');
    navButtons.innerHTML = `
      <button type="button" class="slide-prev" aria-label="${placeholders.previousSlide || 'Previous Slide'}" disabled></button>
      <button type="button" class="slide-next" aria-label="${placeholders.nextSlide || 'Next Slide'}"></button>
    `;
    container.append(navButtons);
  }

  carousel.append(container);
  return carousel;
}

function parseTabsAndCards(rows) {
  const tabs = [];
  let currentTab = null;

  rows.forEach((row) => {
    const firstCell = row.querySelector(':scope > div:first-child');
    const firstCellText = firstCell?.textContent?.trim() || '';

    // Check if this row is a tab delimiter (starts with "Tab:" in bold or just bold text)
    const strongElement = firstCell?.querySelector('strong');
    const isTabDelimiter = strongElement && (
      strongElement.textContent.trim().toLowerCase().startsWith('tab:')
      || (firstCell.children.length === 1 && firstCell.querySelector('strong'))
    );

    if (isTabDelimiter) {
      // Extract tab name - remove "Tab:" prefix if present
      let tabName = strongElement.textContent.trim();
      if (tabName.toLowerCase().startsWith('tab:')) {
        tabName = tabName.substring(4).trim();
      }

      currentTab = {
        name: tabName,
        id: toClassName(tabName),
        cards: [],
      };
      tabs.push(currentTab);
    } else if (currentTab) {
      // This is a card row for the current tab
      currentTab.cards.push(row);
    }
  });

  return tabs;
}

let blockId = 0;

export default async function decorate(block) {
  blockId += 1;
  block.setAttribute('id', `tabs-carousel-${blockId}`);

  const placeholders = await fetchPlaceholders();
  const rows = [...block.querySelectorAll(':scope > div')];
  const tabs = parseTabsAndCards(rows);

  // Clear original content
  block.innerHTML = '';

  if (tabs.length === 0) {
    return;
  }

  // Create tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-carousel-list';
  tablist.setAttribute('role', 'tablist');

  // Create tab panels container
  const panelsContainer = document.createElement('div');
  panelsContainer.className = 'tabs-carousel-panels';

  tabs.forEach((tab, idx) => {
    // Create tab button
    const button = document.createElement('button');
    button.className = 'tabs-carousel-tab';
    button.id = `tab-${tab.id}-${blockId}`;
    button.textContent = tab.name;
    button.setAttribute('aria-controls', `tabpanel-${tab.id}-${blockId}`);
    button.setAttribute('aria-selected', idx === 0);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');

    button.addEventListener('click', () => {
      // Deselect all tabs
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', 'false');
      });
      // Hide all panels
      panelsContainer.querySelectorAll('.tabs-carousel-panel').forEach((panel) => {
        panel.setAttribute('aria-hidden', 'true');
      });
      // Select this tab and show its panel
      button.setAttribute('aria-selected', 'true');
      const panel = document.getElementById(`tabpanel-${tab.id}-${blockId}`);
      if (panel) {
        panel.setAttribute('aria-hidden', 'false');
        // Reset carousel to first slide when tab is shown
        const carousel = panel.querySelector('.tabs-carousel-carousel');
        if (carousel) {
          showSlide(carousel, 0);
          updateActiveSlide(carousel, 0);
        }
      }
    });

    tablist.append(button);

    // Create tab panel
    const panel = document.createElement('div');
    panel.className = 'tabs-carousel-panel';
    panel.id = `tabpanel-${tab.id}-${blockId}`;
    panel.setAttribute('aria-hidden', idx !== 0);
    panel.setAttribute('aria-labelledby', `tab-${tab.id}-${blockId}`);
    panel.setAttribute('role', 'tabpanel');

    // Create carousel for this tab's cards
    if (tab.cards.length > 0) {
      const carousel = createCarousel(tab.cards, tab.id, placeholders);
      panel.append(carousel);
      // Bind events after appending to DOM
      setTimeout(() => bindCarouselEvents(carousel), 0);
    }

    panelsContainer.append(panel);
  });

  block.append(tablist);
  block.append(panelsContainer);
}
