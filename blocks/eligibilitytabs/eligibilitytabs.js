// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';
import { p } from '../utils/dom-helper.js';
const mobileTitle = getDataAttributeValueByName('mobileTitle');
const selectDocument = getDataAttributeValueByName('selectDocument');
function hasWrapper(el) {
  return !!el.firstElementChild && window.getComputedStyle(el.firstElementChild).display === 'block';
}
function isMobileView() {
  return window.innerWidth <= 768; // Adjust breakpoint as needed
}
function createDropdown(tabs, tabpanels, block) {
  const select = document.createElement('select');
  select.className = 'tabs-dropdown';
  tabs.forEach((tab, i) => {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = tab.textContent;
    select.append(option);
  });
  select.addEventListener('change', () => {
    const selectedIndex = select.selectedIndex;
    tabpanels.forEach((panel, i) => {
      panel.setAttribute('aria-hidden', i !== selectedIndex);
    });
  });
  block.querySelector('.parent-tab-list').prepend(select);
  select.selectedIndex = 0; // Select the first option by default
  tabpanels.forEach((panel, i) => {
    panel.setAttribute('aria-hidden', i !== 0);
  });
}
export default async function decorate(block) {
  const tabpanelParent = document.createElement('div');
  tabpanelParent.className = 'parent-tab-panel';
  const tablistParent = document.createElement('div');
  tablistParent.className = 'parent-tab-list';
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');
  tablistParent.append(tablist);
  const tabs = [...block.children].map((child) => child.firstElementChild);
  const tabpanels = [...block.children];
  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent);
    const tabpanel = tabpanels[i];
    tabpanel.className = 'tabs-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');
    if (!hasWrapper(tabpanel.lastElementChild)) {
      tabpanel.lastElementChild.innerHTML = `<p>${tabpanel.lastElementChild.innerHTML}</p>`;
    }
    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.id = `tab-${id}`;
    button.innerHTML = tab.innerHTML;
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
    tab.remove();
  });
  tabpanels.forEach((panel) => {
    tabpanelParent.append(panel);
  });
  block.prepend(tabpanelParent);
  tabpanelParent.prepend(tablistParent);
  const defaultContentWrapper = document.querySelector('.eligibilitytabs-container .default-content-wrapper');
  if (defaultContentWrapper) {
    const firstChild = defaultContentWrapper.children[0];
    //   const secondChild = defaultContentWrapper.children[1];
    if (firstChild && firstChild.tagName === 'P') {
      firstChild.classList.add('eligibility-class');
    }
    const H2tag = document.createElement('H2');
    H2tag.className = 'mobile-title';
    if (mobileTitle) {
      H2tag.textContent = mobileTitle;
      defaultContentWrapper.appendChild(H2tag);
    }
  }
  const ptag = document.createElement('P');
  ptag.className = 'document-title';
  if (selectDocument) {
    ptag.textContent = selectDocument;
    block.querySelector(' .parent-tab-list').appendChild(ptag);
  }
  if (isMobileView()) {
    createDropdown(tabs, tabpanels, block);
  } else {
    tabpanels.forEach((panel, i) => {
      panel.setAttribute('aria-hidden', i !== 0); // Ensure only the first tabpanel is shown by default
    });
  }
  window.addEventListener('resize', () => {
    if (isMobileView()) {
      if (!block.querySelector('.tabs-dropdown')) {
        tablist.remove();
        createDropdown(tabs, tabpanels, block);
      }
    } else {
      const dropdown = block.querySelector('.tabs-dropdown');
      if (dropdown) {
        dropdown.remove();
        tablistParent.prepend(tablist);
        tabpanels.forEach((panel, i) => {
          panel.setAttribute('aria-hidden', i !== 0); // Ensure only the first tabpanel is shown by default
        });
      }
    }
  });
}
// Retrieve the value of a data attribute by name
function getDataAttributeValueByName(name) {
  const element = document.querySelector(`[data-${name}]`);
  return element ? element.getAttribute(`data-${name}`) : '';
}
