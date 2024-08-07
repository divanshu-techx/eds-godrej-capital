import { toClassName } from '../../scripts/aem.js';

// Function to create a field wrapper for each form field
function createFieldWrapper(fd) {
  const fieldWrapper = document.createElement('div');
  if (fd.Style) fieldWrapper.className = fd.Style;
  fieldWrapper.classList.add('field-wrapper', `${fd.Type}-wrapper`);
  fieldWrapper.dataset.fieldset = fd.Fieldset;
  return fieldWrapper;
}

// Function to generate unique field IDs
const ids = [];
function generateFieldId(fd, suffix = '') {
  const slug = toClassName(`form-${fd.Name}${suffix}`);
  ids[slug] = ids[slug] || 0;
  const idSuffix = ids[slug] ? `-${ids[slug]}` : '';
  ids[slug] += 1;
  return `${slug}${idSuffix}`;
}

// Function to create a label for a form field
function createLabel(fd) {
  let label = '';
  if (fd.Label) {
    label = document.createElement('label');
    label.id = generateFieldId(fd, '-label');
    // label.textContent = '';
    label.setAttribute('for', fd.Id);
    
    // custom method to set the label text content
    modifyLabel(fd, label);
  }
  return label;
}

// Function to set common attributes for form fields
function setCommonAttributes(field, fd) {
  field.id = fd.Id;
  field.name = fd.Name;
  field.required = fd.Mandatory && (fd.Mandatory.toLowerCase() === 'true' || fd.Mandatory.toLowerCase() === 'x');
  field.placeholder = fd.Placeholder;
  field.value = fd.Value;
}

// Function to create a heading field
const createHeading = (fd) => {
  const fieldWrapper = createFieldWrapper(fd);
  const level = fd.Style && fd.Style.includes('sub-heading') ? 3 : 2;
  const heading = document.createElement(`h${level}`);
  heading.textContent = fd.Value || fd.Label;
  heading.id = fd.Id;
  fieldWrapper.append(heading);
  return { field: heading, fieldWrapper };
};

// Function to create a plaintext field
const createPlaintext = (fd) => {
  const fieldWrapper = createFieldWrapper(fd);
  const text = document.createElement('p');
  // text.textContent = fd.Value || fd.Label;

  // custom method to set the label text content
  modifyLabel(fd, text);
  text.id = fd.Id;
  fieldWrapper.append(text);
  return { field: text, fieldWrapper };
};

// Function to create a select dropdown field
const createSelect = async (fd) => {
  const select = document.createElement('select');
  setCommonAttributes(select, fd);
  const addOption = ({ text, value }) => {
    const option = document.createElement('option');
    option.text = text.trim();
    option.value = value.trim();
    if (option.value === select.value) {
      option.setAttribute('selected', '');
    }
    select.add(option);
    return option;
  };

  if (fd.Placeholder) {
    const ph = addOption({ text: fd.Placeholder, value: '' });
    ph.setAttribute('disabled', '');
  }

  if (fd.Options) {
    const options = [];
    const resp = await fetch(fd.Options);
    const json = await resp.json();
    json.data.forEach((opt) => {
      options.push({
        text: opt.Option,
        value: opt.Value || opt.Option,
      });
    });

    options.forEach((opt) => addOption(opt));
  }
  const fieldWrapper = createFieldWrapper(fd);
  fieldWrapper.append(select);
  fieldWrapper.append(createLabel(fd));
  return { field: select, fieldWrapper };
};

// Function to create a confirmation field
const createConfirmation = (fd, form) => {
  form.dataset.confirmation = new URL(fd.Value).pathname;
  return {};
};

// Function to create a submit button field
const createSubmit = (fd) => {
  const button = document.createElement('button');
  button.textContent = fd.Label || fd.Name;
  button.classList.add('button');
  button.type = 'submit';
  const fieldWrapper = createFieldWrapper(fd);
  fieldWrapper.append(button);
  return { field: button, fieldWrapper };
};

// Function to create a textarea field
const createTextArea = (fd) => {
  const field = document.createElement('textarea');
  setCommonAttributes(field, fd);
  const fieldWrapper = createFieldWrapper(fd);
  const label = createLabel(fd);
  if (label) {
    field.setAttribute('aria-labelledby', label.id);
    fieldWrapper.append(label);
  }
  fieldWrapper.append(field);

  return { field, fieldWrapper };
};

// Function to create an input field
const createInput = (fd) => {
  const field = document.createElement('input');
  field.type = fd.Type;
  setCommonAttributes(field, fd);

  const fieldWrapper = createFieldWrapper(fd);
  const label = createLabel(fd);
  if (label) {
    field.setAttribute('aria-labelledby', label.id);
    fieldWrapper.append(label);
  }
  fieldWrapper.append(field);

  return { field, fieldWrapper };
};

// Function to create a fieldset
const createFieldset = (fd) => {
  const field = document.createElement('fieldset');
  setCommonAttributes(field, fd);

  if (fd.Label) {
    const legend = document.createElement('legend');
    // legend.textContent = fd.Label;

    // custom method to set the legend text content
    modifyLabel(fd, legend);
    field.append(legend);
  }

  const fieldWrapper = createFieldWrapper(fd);
  fieldWrapper.append(field);

  return { field, fieldWrapper };
};

// Function to create a toggle (checkbox) field
const createToggle = (fd) => {
  const { field, fieldWrapper } = createInput(fd);
  field.type = 'checkbox';
  if (!field.value) field.value = 'on';
  field.classList.add('toggle');
  fieldWrapper.classList.add('selection-wrapper');

  const toggleSwitch = document.createElement('div');
  toggleSwitch.classList.add('switch');
  toggleSwitch.append(field);
  fieldWrapper.append(toggleSwitch);

  const slider = document.createElement('span');
  slider.classList.add('slider');
  toggleSwitch.append(slider);
  slider.addEventListener('click', () => {
    field.checked = !field.checked;
  });

  return { field, fieldWrapper };
};

const createCheckbox = (fd) => {
  const { field, fieldWrapper } = createInput(fd);
  if (!field.value) field.value = 'checked';
  fieldWrapper.classList.add('selection-wrapper');

  return { field, fieldWrapper };
};

const createRadio = (fd) => {
  const { field, fieldWrapper } = createInput(fd);
  if (!field.value) field.value = fd.Label || 'on';
  fieldWrapper.classList.add('selection-wrapper');

  return { field, fieldWrapper };
};

// Object containing functions to create different types of form fields
const FIELD_CREATOR_FUNCTIONS = {
  select: createSelect,
  heading: createHeading,
  plaintext: createPlaintext,
  'text-area': createTextArea,
  toggle: createToggle,
  submit: createSubmit,
  confirmation: createConfirmation,
  fieldset: createFieldset,
  checkbox: createCheckbox,
  radio: createRadio,
};

function modifyLabel(fd, label) {
  const splitTexts = getArraySplitByComma(fd.SplitTexts);
  const splitTextsAnchorPath = getArraySplitByComma(fd.SplitTextsAnchorPath);
  const splitTextsId = getArraySplitByComma(fd.SplitTextsId);
  let labelText = fd.Label;
  let i = 0;

  while (true) {
    const textPattern = `{text${i + 1}}`;
    const isTextPatternMatch = labelText !== '' ? labelText.includes(textPattern) : false;

    const linkPattern = `{link${i + 1}}`;
    const isLinkPatternMatch = labelText !== '' ? labelText.includes(linkPattern) : false;

    if (!isTextPatternMatch && !isLinkPatternMatch) {
      break; // Exit loop if neither pattern matches
    }

    if (isTextPatternMatch) {
      const textContent = getValueAtIndex(splitTexts, i);
      const id = getValueAtIndex(splitTextsId, i);
      if (textContent !== '') {
        const span = document.createElement('span');
        span.textContent = textContent;
        if (id !== '') {
          span.id = id;
        }
        // Replace text pattern with span.outerHTML
        labelText = labelText.replace(textPattern, span.outerHTML);
      }
    }

    if (isLinkPatternMatch) {
      const textContent = getValueAtIndex(splitTexts, i);
      const id = getValueAtIndex(splitTextsId, i);
      const redirectPath = getValueAtIndex(splitTextsAnchorPath, i);
      if (textContent !== '') {
        const anchor = document.createElement('a');
        anchor.textContent = textContent;
        if (id !== '') {
          anchor.id = id;
        }
        anchor.href = redirectPath === '' ? 'javascript:void(0)' : redirectPath;
        anchor.target = '_blank';
        // Replace link pattern with anchor.outerHTML
        labelText = labelText.replace(linkPattern, anchor.outerHTML);
      }
    }

    i++;
  }
  // Set the final processed HTML to the labelElement
  label.innerHTML = labelText;

  return labelText;
}

function getArraySplitByComma(field) {
  if (field == null) {
    return [];  // Return an empty array if field is null or undefined
  }

  return field.split(',').map(item => item.trim()).filter(item => item.length > 0);
}

function getValueAtIndex(array, index) {
  // Check if array is valid and index is within bounds
  if (Array.isArray(array) && index >= 0 && index < array.length) {
    return array[index];
  } else {
    return '';
  }
}

// Function to create a form field based on its type
export default async function createField(fd, form) {
  fd.Id = fd.Id || generateFieldId(fd);
  const type = fd.Type.toLowerCase();
  const createFieldFunc = FIELD_CREATOR_FUNCTIONS[type] || createInput;
  const fieldElements = await createFieldFunc(fd, form);

  return fieldElements.fieldWrapper;
}
