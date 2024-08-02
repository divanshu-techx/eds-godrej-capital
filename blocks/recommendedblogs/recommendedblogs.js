// Get data attribute value by name
function getDataAttributeValueByName(name) {
  const element = document.querySelector(`[data-${name}]`);
  return element ? element.getAttribute(`data-${name}`) : '';
}

// Retrieve configurable values from data attributes
const readMoreLabel = getDataAttributeValueByName('read-more-label');
const notFoundMsg = getDataAttributeValueByName('not-found-msg');

function getBlogsUrls(block) {
  const parentElement = block.querySelector('div');
  if (!parentElement) {
    console.error('Parent div element not found.');
    return [];
  }
  const pElements = parentElement.querySelectorAll('p');
  return Array.from(pElements).map((p) => p.textContent);
}

function createBlogContainer(block) {
  const blogsContainer = document.createElement('div');
  blogsContainer.id = 'blogs-container';
  blogsContainer.classList.add('blogs-container');
  block.appendChild(blogsContainer);
  return blogsContainer;
}

// Function to get meta content by name or property
function getMetaContentByNameOrProperty(doc, nameOrProperty) {
  const metaTag = doc.querySelector(`meta[name="${nameOrProperty}"], meta[property="${nameOrProperty}"]`);
  return metaTag ? metaTag.getAttribute('content') : null;
}

function removeHostFromUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return `${parsedUrl.pathname}${parsedUrl.search}`;
  } catch (error) {
    console.error('Invalid URL:', error);
    return '';
  }
}

function addLeadingZero(dateString) {
  const [day, month, year] = dateString.split(' ');
  const formattedDay = day.length === 1 ? '0' + day : day;
  // Return the formatted date string
  return `${formattedDay} ${month} ${year}`;
}

// Render article cards
function renderBlogs(blogsContainer, doc) {
  const image = getMetaContentByNameOrProperty(doc, 'og:image');
  const imageAlt = getMetaContentByNameOrProperty(doc, 'imagealt');
  const publishDate = getMetaContentByNameOrProperty(doc, 'articlepublishdate');
  const description = getMetaContentByNameOrProperty(doc, 'description');
  const detailPageUrl = getMetaContentByNameOrProperty(doc, 'detailpageurl');
  const blogCard = document.createElement('div');
  blogCard.classList.add('blog-card');
  blogCard.innerHTML = `
    <a href="${detailPageUrl}"><img src="${removeHostFromUrl(image)}" alt="${imageAlt}">
      <div class="blog-content">
        <p class="article-date">${addLeadingZero(publishDate)}</p>
        <p class="article-description">${description}</p>
        <a href="#" class="read-more">${readMoreLabel}</a>
      </div>
    </a>
    `;
  blogsContainer.appendChild(blogCard);
}

function createNoResultDiv(block) {
  const notFoundContainer = document.createElement('div');
  notFoundContainer.id = 'blogs-not-found-container';
  notFoundContainer.innerHTML = notFoundMsg;
  block.appendChild(notFoundContainer);
}

// Main function to decorate the block
export default async function decorate(block) {
  // try {
  //   const blogsUrls = getBlogsUrls(block);
  //   if (blogsUrls) {
  //     const blogsContainer = createBlogContainer(block);
  //     for (const blogUrl of blogsUrls) {
  //       const responseData = await fetch(blogUrl);
  //       if (responseData.ok) {
  //         const text = await responseData.text();
  //         // Parse the HTML string using DOMParser
  //         const parser = new DOMParser();
  //         const doc = parser.parseFromString(text, 'text/html');
  //         renderBlogs(blogsContainer, doc);
  //       } else {
  //         console.error('No data fetched for the given blog url.');
  //       }
  //     }
  //   } else {
  //     createNoResultDiv(block);
  //   }
  // } catch (error) {
  //   console.error('Error fetching data:', error);
  // }

  try {
    const blogsUrls = getBlogsUrls(block);
    if (blogsUrls) {
      const blogsContainer = createBlogContainer(block);
      // Define an async function to fetch and render blog data
      const fetchAndRenderBlog = async (blogUrl) => {
        try {
          const response = await fetch(blogUrl);
          if (response.ok) {
            const text = await response.text();
            // Parse the HTML string using DOMParser
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            renderBlogs(blogsContainer, doc);
          } else {
            console.error('No data fetched for the given blog url:', blogUrl);
          }
        } catch (error) {
          console.error('Error fetching data for URL:', blogUrl, error);
        }
      };

      // Use Promise.all to fetch all blogs concurrently
      await Promise.all(blogsUrls.map(fetchAndRenderBlog));
    } else {
      createNoResultDiv(block);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
