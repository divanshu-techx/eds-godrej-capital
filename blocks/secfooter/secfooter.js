import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

let isDecorated = false;
export default async function decorate(block) {
  // Check if the block has already been decorated to avoid infinite requests
  if (isDecorated) return;
  isDecorated = true;
  const secfooterMeta = getMetadata('secfooter');
  const secfooterPath = secfooterMeta ? new URL(secfooterMeta, window.location).pathname : '/secondaryfooter';
  try {
    const secfooterFragment = await loadFragment(secfooterPath);
    if (secfooterFragment && secfooterFragment.firstElementChild) {
      const secfooter = document.createElement('div');
      secfooter.classList.add('secfooter-wrapper');
      while (secfooterFragment.firstElementChild) {
        secfooter.append(secfooterFragment.firstElementChild);
      }
      const liElements = secfooter.querySelectorAll('li');
      liElements.forEach((li) => {
        li.classList.add('secfooter-list');
      });
      block.textContent = '';  // Clear the block's existing content
      block.append(secfooter); // Append the new secfooter
    } else {
      console.error('secfooter fragment is empty or malformed.');
    }
  } catch (error) {
    console.error('Error fetching or loading secfooter fragment:', error);
  }
}