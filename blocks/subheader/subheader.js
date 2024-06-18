import { getMetadata } from '../../scripts/lib-franklin.js';
export default async function decorate(block) {
  // Check if the block has already been decorated to avoid infinite requests
  if (block.classList.contains('decorated')) {
    return;
  }
  
  block.classList.add('decorated');

  const subHeaderMeta = getMetadata('subheader');
  const subHeaderPath = subHeaderMeta ? new URL(subHeaderMeta, window.location).pathname : '/subheader';

  try {
    const subHeaderFragment = await loadFragment(subHeaderPath);
    
    if (subHeaderFragment && subHeaderFragment.firstElementChild) {
      const subHeader = document.createElement('div');
      subHeader.classList.add('subheader-wrapper');
      
      while (subHeaderFragment.firstElementChild) {
        subHeader.append(subHeaderFragment.firstElementChild);
      }
      
      const liElements = subHeader.querySelectorAll('li');
      liElements.forEach((li) => {
        li.classList.add('subheader-list');
      });
      
      block.textContent = '';  // Clear the block's existing content
      block.append(subHeader); // Append the new subheader
      
    } else {
      console.error('Subheader fragment is empty or malformed.');
    }
  } catch (error) {
    console.error('Error fetching or loading subheader fragment:', error);
  }
}

export async function loadFragment(path) {
    try {
      const response = await fetch(`${path}.plain.html`);
      if (response.ok) {
        const html = await response.text();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const subheader = tempDiv.querySelector('.subheader');
        if (subheader) {
          return subheader;
        } else {
          console.error(`No subheader found in the fragment from ${path}`);
        }
      } else {
        console.error(`Failed to load fragment from ${path}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error loading fragment:', error);
    }
    return null;
  }
  
  
