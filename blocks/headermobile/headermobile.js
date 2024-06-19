import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

let isDecorated = false;
export default async function decorate(block) {
  // Check if the block has already been decorated to avoid infinite requests
  if (isDecorated) return;
  isDecorated = true;
  const headermobileMeta = getMetadata('headermobile');
  const headermobilePath = headermobileMeta ? new URL(headermobileMeta, window.location).pathname : '/headermobile';
  try {
    const headermobileFragment = await loadFragment(headermobilePath);
    if (headermobileFragment && headermobileFragment.firstElementChild) {
      const headermobile = document.createElement('div');
      headermobile.classList.add('headermobile-wrapper');
      while (headermobileFragment.firstElementChild) {
        headermobile.append(headermobileFragment.firstElementChild);
      }
      const liElements = headermobile.querySelectorAll('li');
      liElements.forEach((li) => {
        li.classList.add('headermobile-list');
      });
      block.textContent = '';  // Clear the block's existing content
      block.append(headermobile); // Append the new secfooter
    } else {
      console.error('headermobile fragment is empty or malformed.');
    }
  } catch (error) {
    console.error('Error fetching or loading headermobile fragment:', error);
  }
}
