/**
 * Program Finder Block
 * A cascading dropdown form for finding programs by Topic, Format, and Level.
 * Uses custom dropdown components for full styling control.
 */

// Placeholder data - will eventually come from program page metadata
const PROGRAM_DATA = {
  topics: [
    { value: 'climate', label: 'Climate' },
    { value: 'energy', label: 'Energy' },
    { value: 'finance', label: 'Finance' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'health', label: 'Health, Nutrition and Population' },
    { value: 'education', label: 'Education' },
    { value: 'social-protection', label: 'Social Protection and Labor' },
  ],

  formats: {
    climate: [
      { value: 'impact', label: 'Impact Program' },
      { value: 'practitioner', label: 'Practitioner Program' },
      { value: 'online', label: 'Online Course' },
    ],
    energy: [
      { value: 'impact', label: 'Impact Program' },
      { value: 'practitioner', label: 'Practitioner Program' },
      { value: 'workshop', label: 'Workshop' },
    ],
    finance: [
      { value: 'practitioner', label: 'Practitioner Program' },
      { value: 'online', label: 'Online Course' },
      { value: 'certification', label: 'Certification' },
    ],
    infrastructure: [
      { value: 'impact', label: 'Impact Program' },
      { value: 'practitioner', label: 'Practitioner Program' },
    ],
    health: [
      { value: 'impact', label: 'Impact Program' },
      { value: 'practitioner', label: 'Practitioner Program' },
      { value: 'online', label: 'Online Course' },
    ],
    education: [
      { value: 'practitioner', label: 'Practitioner Program' },
      { value: 'online', label: 'Online Course' },
    ],
    'social-protection': [
      { value: 'impact', label: 'Impact Program' },
      { value: 'practitioner', label: 'Practitioner Program' },
    ],
  },

  levels: {
    'climate-impact': [
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
    ],
    'climate-practitioner': [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
    ],
    'climate-online': [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
    ],
    'energy-impact': [
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
    ],
    'energy-practitioner': [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
    ],
    'energy-workshop': [
      { value: 'all', label: 'All Levels' },
    ],
    'finance-practitioner': [
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
    ],
    'finance-online': [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
    ],
    'finance-certification': [
      { value: 'advanced', label: 'Advanced' },
    ],
    'infrastructure-impact': [
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
    ],
    'infrastructure-practitioner': [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
    ],
    'health-impact': [
      { value: 'intermediate', label: 'Intermediate' },
    ],
    'health-practitioner': [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
    ],
    'health-online': [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
    ],
    'education-practitioner': [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
    ],
    'education-online': [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
    ],
    'social-protection-impact': [
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
    ],
    'social-protection-practitioner': [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
    ],
  },
};

/**
 * Custom Dropdown Class
 * Creates a fully styled dropdown with keyboard navigation
 */
class CustomDropdown {
  constructor(id, placeholder, onChange) {
    this.id = id;
    this.placeholder = placeholder;
    this.onChange = onChange;
    this.isOpen = false;
    this.isDisabled = true;
    this.selectedValue = '';
    this.selectedLabel = '';
    this.options = [];
    this.focusedIndex = -1;

    this.createElements();
    this.bindEvents();
  }

  createElements() {
    // Main wrapper
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'program-finder-field custom-dropdown disabled';

    // Hidden select for form submission
    this.hiddenSelect = document.createElement('select');
    this.hiddenSelect.id = this.id;
    this.hiddenSelect.name = this.id;
    this.hiddenSelect.setAttribute('aria-hidden', 'true');
    this.hiddenSelect.tabIndex = -1;

    // Accessible label (visually hidden)
    this.label = document.createElement('label');
    this.label.setAttribute('for', `${this.id}-trigger`);
    this.label.textContent = this.placeholder;

    // Trigger button
    this.trigger = document.createElement('button');
    this.trigger.type = 'button';
    this.trigger.id = `${this.id}-trigger`;
    this.trigger.className = 'dropdown-trigger';
    this.trigger.setAttribute('aria-haspopup', 'listbox');
    this.trigger.setAttribute('aria-expanded', 'false');
    this.trigger.setAttribute('aria-labelledby', `${this.id}-trigger`);

    this.triggerText = document.createElement('span');
    this.triggerText.className = 'dropdown-trigger-text';
    this.triggerText.textContent = this.placeholder;

    this.triggerArrow = document.createElement('span');
    this.triggerArrow.className = 'dropdown-arrow';

    this.trigger.appendChild(this.triggerText);
    this.trigger.appendChild(this.triggerArrow);

    // Dropdown panel
    this.panel = document.createElement('div');
    this.panel.className = 'dropdown-panel';
    this.panel.setAttribute('role', 'listbox');
    this.panel.id = `${this.id}-panel`;

    // Options list
    this.optionsList = document.createElement('div');
    this.optionsList.className = 'dropdown-options';
    this.panel.appendChild(this.optionsList);

    // Assemble
    this.wrapper.appendChild(this.hiddenSelect);
    this.wrapper.appendChild(this.label);
    this.wrapper.appendChild(this.trigger);
    this.wrapper.appendChild(this.panel);
  }

  bindEvents() {
    // Toggle on trigger click
    this.trigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (!this.isDisabled) {
        this.toggle();
      }
    });

    // Keyboard navigation
    this.trigger.addEventListener('keydown', (e) => {
      if (this.isDisabled) return;

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          this.toggle();
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!this.isOpen) {
            this.open();
          } else {
            this.focusNext();
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (!this.isOpen) {
            this.open();
          } else {
            this.focusPrev();
          }
          break;
        case 'Escape':
          if (this.isOpen) {
            e.preventDefault();
            this.close();
            this.trigger.focus();
          }
          break;
        case 'Tab':
          if (this.isOpen) {
            this.close();
          }
          break;
        default:
          break;
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.wrapper.contains(e.target)) {
        this.close();
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this.isDisabled || this.options.length === 0) return;

    // Close other dropdowns
    document.querySelectorAll('.custom-dropdown.open').forEach((dropdown) => {
      if (dropdown !== this.wrapper) {
        dropdown.classList.remove('open');
      }
    });

    this.isOpen = true;
    this.wrapper.classList.add('open');
    this.trigger.setAttribute('aria-expanded', 'true');

    // Focus selected or first option
    const selectedIndex = this.options.findIndex((opt) => opt.value === this.selectedValue);
    this.focusedIndex = selectedIndex >= 0 ? selectedIndex : 0;
    this.updateFocus();
  }

  close() {
    this.isOpen = false;
    this.wrapper.classList.remove('open');
    this.trigger.setAttribute('aria-expanded', 'false');
    this.focusedIndex = -1;
    this.clearFocus();
  }

  focusNext() {
    if (this.focusedIndex < this.options.length - 1) {
      this.focusedIndex += 1;
      this.updateFocus();
    }
  }

  focusPrev() {
    if (this.focusedIndex > 0) {
      this.focusedIndex -= 1;
      this.updateFocus();
    }
  }

  updateFocus() {
    this.clearFocus();
    const optionEls = this.optionsList.querySelectorAll('.dropdown-option');
    if (optionEls[this.focusedIndex]) {
      optionEls[this.focusedIndex].classList.add('focused');
      optionEls[this.focusedIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  clearFocus() {
    this.optionsList.querySelectorAll('.dropdown-option.focused').forEach((el) => {
      el.classList.remove('focused');
    });
  }

  selectOption(value, label) {
    this.selectedValue = value;
    this.selectedLabel = label;
    this.triggerText.textContent = label || this.placeholder;
    this.wrapper.classList.toggle('has-value', !!value);

    // Update hidden select
    this.hiddenSelect.value = value;

    // Update selected state in options
    this.optionsList.querySelectorAll('.dropdown-option').forEach((el) => {
      el.classList.toggle('selected', el.dataset.value === value);
      el.setAttribute('aria-selected', el.dataset.value === value);
    });

    this.close();
    this.trigger.focus();

    if (this.onChange) {
      this.onChange(value);
    }
  }

  setOptions(options) {
    this.options = options;
    this.optionsList.innerHTML = '';
    this.hiddenSelect.innerHTML = '';

    // Add default option to hidden select
    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = this.placeholder;
    this.hiddenSelect.appendChild(defaultOpt);

    // Create option elements
    options.forEach((opt, index) => {
      // Hidden select option
      const selectOpt = document.createElement('option');
      selectOpt.value = opt.value;
      selectOpt.textContent = opt.label;
      this.hiddenSelect.appendChild(selectOpt);

      // Custom option
      const optionEl = document.createElement('div');
      optionEl.className = 'dropdown-option';
      optionEl.setAttribute('role', 'option');
      optionEl.setAttribute('aria-selected', 'false');
      optionEl.dataset.value = opt.value;
      optionEl.textContent = opt.label;

      optionEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectOption(opt.value, opt.label);
      });

      optionEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectOption(opt.value, opt.label);
        }
      });

      optionEl.addEventListener('mouseenter', () => {
        this.focusedIndex = index;
        this.updateFocus();
      });

      this.optionsList.appendChild(optionEl);
    });
  }

  reset() {
    this.selectedValue = '';
    this.selectedLabel = '';
    this.triggerText.textContent = this.placeholder;
    this.wrapper.classList.remove('has-value');
    this.hiddenSelect.value = '';
    this.setDisabled(true);
    this.close();
  }

  setDisabled(disabled) {
    this.isDisabled = disabled;
    this.wrapper.classList.toggle('disabled', disabled);
    this.trigger.disabled = disabled;
  }

  getValue() {
    return this.selectedValue;
  }

  getElement() {
    return this.wrapper;
  }
}

/**
 * Updates the Go button state
 */
function updateGoButton(button, topicDropdown, formatDropdown, levelDropdown) {
  const allSelected = topicDropdown.getValue()
    && formatDropdown.getValue()
    && levelDropdown.getValue();
  button.disabled = !allSelected;
}

/**
 * Handles form submission
 */
function handleSubmit(e, topicDropdown, formatDropdown, levelDropdown) {
  e.preventDefault();

  const topic = topicDropdown.getValue();
  const format = formatDropdown.getValue();
  const level = levelDropdown.getValue();

  if (topic && format && level) {
    const searchUrl = `/en/our-programs?topic=${encodeURIComponent(topic)}&format=${encodeURIComponent(format)}&level=${encodeURIComponent(level)}`;
    window.location.href = searchUrl;
  }
}

export default async function decorate(block) {
  block.textContent = '';

  const form = document.createElement('form');
  form.className = 'program-finder-form';

  // Create custom dropdowns
  let formatDropdown;
  let levelDropdown;
  let goButton;

  const topicDropdown = new CustomDropdown('program-topic', 'Select Topic', (value) => {
    // Reset dependent dropdowns
    formatDropdown.reset();
    levelDropdown.reset();

    if (value && PROGRAM_DATA.formats[value]) {
      formatDropdown.setOptions(PROGRAM_DATA.formats[value]);
      formatDropdown.setDisabled(false);
    }

    updateGoButton(goButton, topicDropdown, formatDropdown, levelDropdown);
  });

  formatDropdown = new CustomDropdown('program-format', 'Select Format', (value) => {
    // Reset level dropdown
    levelDropdown.reset();

    const topic = topicDropdown.getValue();
    const key = `${topic}-${value}`;
    if (value && PROGRAM_DATA.levels[key]) {
      levelDropdown.setOptions(PROGRAM_DATA.levels[key]);
      levelDropdown.setDisabled(false);
    }

    updateGoButton(goButton, topicDropdown, formatDropdown, levelDropdown);
  });

  levelDropdown = new CustomDropdown('program-level', 'Select Level', () => {
    updateGoButton(goButton, topicDropdown, formatDropdown, levelDropdown);
  });

  // Initialize topic dropdown
  topicDropdown.setOptions(PROGRAM_DATA.topics);
  topicDropdown.setDisabled(false);

  // Create Go button
  const buttonWrapper = document.createElement('div');
  buttonWrapper.className = 'program-finder-field program-finder-submit';

  goButton = document.createElement('button');
  goButton.type = 'submit';
  goButton.textContent = 'Go';
  goButton.disabled = true;
  buttonWrapper.appendChild(goButton);

  // Form submit handler
  form.addEventListener('submit', (e) => {
    handleSubmit(e, topicDropdown, formatDropdown, levelDropdown);
  });

  // Assemble form
  const fieldsContainer = document.createElement('div');
  fieldsContainer.className = 'program-finder-fields';
  fieldsContainer.appendChild(topicDropdown.getElement());
  fieldsContainer.appendChild(formatDropdown.getElement());
  fieldsContainer.appendChild(levelDropdown.getElement());
  fieldsContainer.appendChild(buttonWrapper);

  form.appendChild(fieldsContainer);
  block.appendChild(form);
}
