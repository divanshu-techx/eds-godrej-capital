import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('role', 'button');
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('role');
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
          <span class="nav-hamburger-icon"></span>
        </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  const navElement = document.getElementById('nav');
  console.log(navElement);

  // my js called

  console.log('js called');

  function getDataAttributeValueByName(name) {
    const element = document.querySelector(`[data-${name}]`);
    return element ? element.getAttribute(`data-${name}`) : null;
  }

  const api = getDataAttributeValueByName('globalnavigationapiurl');
  let responseData = [];

  // Create the topnav div
  const topNav = document.createElement('div');
  topNav.className = 'topnav';

  // Create main container div
  const belowNavMainContainer = document.createElement('div');
  belowNavMainContainer.className = 'belowNavMainContainer';

  const parentContainerDiv = document.createElement('div');
  parentContainerDiv.className = 'parentContainerdiv';

  const firstElementChildDiv = document.createElement('div');
  firstElementChildDiv.className = 'firstElementChildDiv';

  const secondElementDiv = document.createElement('div');
  secondElementDiv.className = 'secondElementDiv';

  const thirdElementDiv = document.createElement('div');
  thirdElementDiv.className = 'thirdElementDiv';

  navSections.appendChild(topNav);
  navSections.appendChild(belowNavMainContainer);

  function displayURLContent(url) {
    const mainUrl = url;
    fetch(mainUrl)
      .then((response) => response.text())
      .then((data) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = data;

        const mainContent = tempDiv.querySelector('main');

        if (mainContent) {
          thirdElementDiv.innerHTML = '';
          thirdElementDiv.appendChild(mainContent);
          parentContainerDiv.appendChild(thirdElementDiv);
        } else {
          console.error('Main tag not found in fetched content.');
        }
      })
      .catch((error) => {
        console.error('Error fetching URL content:', error);
      });
  }

  // function to render nav elements div for child depth is 2
  function getChildResponseDataForDepthTwo(response, itemCount) {
    console.log(response);
    console.log(itemCount);

    // Clear previous content
    parentContainerDiv.innerHTML = '';
    firstElementChildDiv.innerHTML = '';
    secondElementDiv.innerHTML = '';
    thirdElementDiv.innerHTML = '';

    // Create the main ul element
    const mainUl = document.createElement('ul');

    // Iterate over the keys in the response object
    Object.keys(response).forEach((key, index) => {
      if (response.hasOwnProperty(key)) {
        const li = document.createElement('li');
        li.className = 'listElement';
        if (index === 0) li.classList.add('active'); // Add active class to the first item by default

        const a = document.createElement('a');
        a.textContent = key;
        a.className = 'anchorPath';
        a.addEventListener('click', (event) => {
          event.preventDefault();

          // Remove active class from all items in firstElementChildDiv
          const allListItems = mainUl.querySelectorAll('li');
          allListItems.forEach((item) => item.classList.remove('active'));

          // Add active class to the clicked item
          li.classList.add('active');

          updateSecondElementDiv(response[key]);
        });

        li.appendChild(a);
        // Append the main category li to the main ul
        mainUl.appendChild(li);
      }
    });

    const firstKey = Object.keys(response)[0];
    updateSecondElementDiv(response[firstKey]);
    firstElementChildDiv.appendChild(mainUl);
    parentContainerDiv.appendChild(firstElementChildDiv);
    parentContainerDiv.appendChild(secondElementDiv);
    parentContainerDiv.appendChild(thirdElementDiv);
    belowNavMainContainer.appendChild(parentContainerDiv);

    // Function to update secondElementDiv with items
    function updateSecondElementDiv(items) {
      secondElementDiv.innerHTML = '';
      thirdElementDiv.innerHTML = '';

      // Create a nested ul for the items
      const nestedUl = document.createElement('ul');

      // Iterate over the items and create the elements
      Object.keys(items).forEach((key, index) => {
        const item = items[key];

        // Create a nested li for each item
        const nestedLi = document.createElement('li');
        nestedLi.className = 'listElement';
        if (index === 0) nestedLi.classList.add('active');

        // Create an anchor element for each item
        const anchor = document.createElement('a');
        anchor.textContent = item.title;
        anchor.href = '#';
        anchor.classList.add('anchorClass');
        anchor.setAttribute('data-path', item.path);

        // Add click event to update the thirdElementDiv content
        anchor.addEventListener('click', (event) => {
          event.preventDefault();

          // Remove active class from all items in nestedUl
          const allListItems = nestedUl.querySelectorAll('li');
          allListItems.forEach((item) => item.classList.remove('active'));

          // Add active class to the clicked item
          nestedLi.classList.add('active');

          displayURLContent(item.path);
        });

        nestedLi.appendChild(anchor);
        nestedUl.appendChild(nestedLi);

        if (index === 0) {
          displayURLContent(item.path);
        }
      });
      secondElementDiv.appendChild(nestedUl);
    }
  }

  // function to render nav elements div for child depth is 1
  function getChildResponseDataForDepthOne(response, itemCount) {
    console.log(response);
    console.log(itemCount);
    parentContainerDiv.innerHTML = '';
    firstElementChildDiv.innerHTML = '';
    secondElementDiv.innerHTML = '';
    thirdElementDiv.innerHTML = '';

    const mainUl = document.createElement('ul');
    let defaultPathSet = false;
    let overallIndex = 0;

    for (const key in response) {
        if (response.hasOwnProperty(key)) {
            response[key].forEach((item) => {
                const li = document.createElement('li');
                li.classList.add('listElement');
                if (overallIndex === 0) li.classList.add('active');
                const anchor = document.createElement('a');
                anchor.textContent = item.title;
                anchor.href = '#';
                anchor.classList.add('anchorPath');
                anchor.setAttribute('data-path', item.path);

                li.appendChild(anchor);
                mainUl.appendChild(li);

                anchor.addEventListener('click', (event) => {
                    event.preventDefault();
                    const allListItems = mainUl.querySelectorAll('li');
                    allListItems.forEach(item => item.classList.remove('active'));
                    li.classList.add('active');
                    displayURLContent(item.path);
                });

                if (!defaultPathSet) {
                    displayURLContent(item.path);
                    defaultPathSet = true;
                }

                overallIndex++;
            });
        }
    }

    if (itemCount != 0) {
        secondElementDiv.appendChild(mainUl);
        parentContainerDiv.appendChild(secondElementDiv);
    }

    parentContainerDiv.appendChild(thirdElementDiv);
    belowNavMainContainer.appendChild(parentContainerDiv);
}

  // function to render nav elements div for child depth is zero
  function getChildResponseDataForDepthZero(responseData) {
    parentContainerDiv.innerHTML = '';
    firstElementChildDiv.innerHTML = '';
    secondElementDiv.innerHTML = '';
    thirdElementDiv.innerHTML = '';

    console.log(responseData.branchlocater);

    firstElementChildDiv.innerHTML = `
        <div class="customersupport">
            <a href="${responseData.customersupportlink}" class="customer-support-anchor">
              ${responseData.customersupport}
            </a>      
        </div>
  
        <div class="selfservice">
                  <h4 class="self-service-heading">${responseData.selfservices}</h4>
            <ul class="self-service-ul">
                <li class="self-service-li">
                   <a href="${responseData.branchlocaterlink}">${responseData.branchlocater}</a>
                </li>
                 <li class="self-service-li">
                   <a href="${responseData.trackstatuslink}">${responseData.trackstatus}</a>
                </li>
                 <li class="self-service-li">
                   <a href="${responseData.faqlink}">${responseData.faq}</a>
                </li>
            </ul>
        </div>
  
        <div class="grievancecontainer">
             <h4 class="grievance-heading">${responseData.grievanceredressal}</h4>
            <ul class="grievance-ul">
                 <li class="self-service-li">
                   <a href="${responseData.godrejhousingfinancelink}">${responseData.godrejhousingfinance}</a>
                <li class="self-service-li">
                   <a href="${responseData.godrejfinancelink}">${responseData.godrejfinance}</a>
                </li>
            </ul>      
        </div>
  
        <div class="contactuscontainer">
            <h4 class="contact-heading">${responseData.contactus}</h4>
            <p class="contact-mobile-number">${responseData.mobilenumber}</p>
            <p class="contact-mail">${responseData.mail}</p>          
        </div>
         `;
    parentContainerDiv.appendChild(firstElementChildDiv);

    secondElementDiv.innerHTML = `
            <div class="free-credit-container">
                <img src="${responseData.freecrediticon}" class="free-credit-icon"><a class="free-credit-heading" href="${responseData.freecreditscorelink}">${responseData.freecreditscore}</a>
                <p class="free-credit-description">${responseData.freecreditscoredescription}</p>
                <a class="free-credit-score" href="${responseData.checkcreditscorelink}">${responseData.checkcreditscore}</a>
            </div>
            <div class="whatsUp-container">
                <h3 class="whatsUp-heading">${responseData.whatsupsupport}</h3>
                <p class="whatsUp-desciption">${responseData.whatsupdescription}</p>
                <img src="${responseData.whatsupicon}" alt="QR Code" class="whatsUp-icon">
            </div>
        `;
    parentContainerDiv.appendChild(secondElementDiv);

    thirdElementDiv.innerHTML = `
            <img src="${responseData.mainimage}" alt="Main Image" class="main-image">
        `;
    parentContainerDiv.appendChild(thirdElementDiv);

    belowNavMainContainer.appendChild(parentContainerDiv);
  }

  function transformResponseData(data) {
    const transformedData = {};
    data.forEach((item) => {
      if (item.parent) {
        if (!transformedData[item.parent]) {
          transformedData[item.parent] = [];
        }
        transformedData[item.parent].push({
          title: item.title,
          path: item.path,
        });
      } else if (item.title) {
        if (!transformedData[item.title]) {
          transformedData[item.title] = [];
        }
        transformedData[item.title].push({
          title: item.title,
          path: item.path,
        });
      }
    });
    return transformedData;
  }

  function getChildApiResponse(childApi, navListItem, depth) {
    fetch(childApi, {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((response) => {
        console.log(response.data);
        const itemCount = parseInt(depth);
        const childResponseData = response.data;
        const transformedData = transformResponseData(childResponseData);
        if (itemCount === 2) {
          getChildResponseDataForDepthTwo(transformedData, itemCount);
        } else if (itemCount === 1) {
          getChildResponseDataForDepthOne(transformedData, itemCount);
        } else {
          getChildResponseDataForDepthZero(childResponseData[0]);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // Function to render nav items
  function getResponseData(filteredData) {
    const ul = document.createElement('ul');

    filteredData.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'listElement';

      const a = document.createElement('a');
      a.href = '#.html';
      a.textContent = item.HeadingName;
      a.setAttribute('data-path', item.ChildPageUrl);
      a.setAttribute('data-depth', item.depth);
      a.setAttribute('data-navItem', item.HeadingName);

      const apiClass = item.HeadingName.replace(/\s+/g, '-');
      const customClass = 'anchorClass';
      a.classList.add(apiClass, customClass);

      li.appendChild(a);
      ul.appendChild(li);
    });

    topNav.appendChild(ul);

    const navItems = document.querySelectorAll('a.anchorClass');

    navItems.forEach((navItem) => {
      navItem.addEventListener('click', (event) => {
        event.preventDefault();

        const depth = navItem.getAttribute('data-depth');
        const navListItem = navItem.getAttribute('data-navItem');
        const childPath = navItem.getAttribute('data-path');

        getChildApiResponse(childPath, navListItem, depth);

        if (navItem.classList.contains('rotate')) {
          navItem.classList.remove('rotate');
          belowNavMainContainer.classList.remove('show');
        } else {
          navItems.forEach((item) => item.classList.remove('rotate'));
          navItem.classList.add('rotate');
          belowNavMainContainer.classList.add('show');
        }
      });
    });
  }

  function getApiResponse(navListapi) {
    fetch(navListapi, {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((response) => {
        console.log(response.data);
        responseData = response.data;
        getResponseData(responseData);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getApiResponse(api);
}
