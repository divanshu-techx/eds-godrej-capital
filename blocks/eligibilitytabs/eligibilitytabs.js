// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';
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
  block.prepend(select);
  select.selectedIndex = 0; // Select the first option by default
  tabpanels.forEach((panel, i) => {
    panel.setAttribute('aria-hidden', i !== 0);
  });
}
export default async function decorate(block) {
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');
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
  if (isMobileView()) {
    createDropdown(tabs, tabpanels, block);
  } else {
    block.prepend(tablist);
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
        block.prepend(tablist);
        tabpanels.forEach((panel, i) => {
          panel.setAttribute('aria-hidden', i !== 0); // Ensure only the first tabpanel is shown by default
        });
      }
    }
  });
}
