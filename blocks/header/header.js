import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
// import { decorate1 } from './headermobileDecorator.js';

// const decorateBlockPromise = decorate1(block);
// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');
console.log(isDesktop);

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navMobile = nav.querySelector('.nav-mobile');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections,navMobile);
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
// function toggleMenu(nav, navSections, forceExpanded = null) {
//   const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
//   const button = nav.querySelector('.nav-hamburger button');
//   document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
//   nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
//   toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
//   button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
//   // enable nav dropdown keyboard accessibility
//   const navDrops = navSections.querySelectorAll('.nav-drop');
//   if (isDesktop.matches) {
//     navDrops.forEach((drop) => {
//       if (!drop.hasAttribute('tabindex')) {
//         drop.setAttribute('role', 'button');
//         drop.setAttribute('tabindex', 0);
//         drop.addEventListener('focus', focusNavSection);
//       }
//     });
//   } else {
//     navDrops.forEach((drop) => {
//       drop.removeAttribute('role');
//       drop.removeAttribute('tabindex');
//       drop.removeEventListener('focus', focusNavSection);
//     });
//   }
//   // enable menu collapse on escape keypress
//   if (!expanded || isDesktop.matches) {
//     // collapse menu on escape press
//     window.addEventListener('keydown', closeOnEscape);
//   } else {
//     window.removeEventListener('keydown', closeOnEscape);
//   }
// }

function toggleMenu(nav, navSections, navMobile, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  
  // Toggle body scroll based on the menu state
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  
  // Set the aria-expanded attribute to reflect the current state
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  
  // Toggle all nav sections based on the current state
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  
  // Set the aria-label of the button based on the current state
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');

  // Handle the display of nav-mobile based on the current state and viewport
  if (isDesktop.matches) {
    navMobile.style.display = 'none';
  } else {
    navMobile.style.display = expanded ? 'none' : 'block';
  }

  // Enable or disable nav dropdown keyboard accessibility based on viewport
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

  // Enable or disable menu collapse on escape keypress based on the current state
  if (!expanded || isDesktop.matches) {
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

  // const classes = ['brand', 'sections', 'tools', 'mobile'];
  // classes.forEach((c, i) => {
  //   const section = nav.children[i];
  //   console.log(section)
  //   if (section) section.classList.add(`nav-${c}`);
  // });
  const classes = ['brand', 'sections', 'mobile', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    // console.log(`Section ${i}:`, section);
    if (section) {
      section.classList.add(`nav-${c}`);
      // console.log(`Content of nav-${c}:`, section.innerHTML);
    } else {
      console.warn(`No element found for nav-${c}`);
    }
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.nav-sections');
  const navMobile = nav.querySelector('.nav-mobile');
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
      hamburger.addEventListener('click', () => toggleMenu(nav, navSections,navMobile));
      nav.prepend(hamburger);
      nav.setAttribute('aria-expanded', 'false');
      // prevent mobile nav behavior on window resize
      toggleMenu(nav, navSections,navMobile, isDesktop.matches);
      isDesktop.addEventListener('change', () => toggleMenu(nav, navSections,navMobile, isDesktop.matches));

      const navWrapper = document.createElement('div');
      navWrapper.className = 'nav-wrapper';
      navWrapper.append(nav);
      block.append(navWrapper);

      var navElement = document.getElementById("nav");
      // console.log(navElement);
  // my js called

      // console.log('js called');

      //const api = "https://main--eds-practice--imjeekxgurjar.hlx.page/nav-element/globalnavigation.json";
      const api = "https://main--eds-godrej-capital--divanshu-techx.hlx.live/nav-element/globalnavigation.json";
      let responseData = [];

      // Create the topnav div
      const topNav = document.createElement('div');
      topNav.className = 'topnav';

      // create main container div
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

  // Function to render news items
        function getResponseData(filteredData) {
              // Create the ul element
              const ul = document.createElement('ul');

              filteredData.forEach((item) => {
                  // Create the li element
                  const li = document.createElement('li');
                  li.className = 'listElement';

                  // Create the a element
                  const a = document.createElement('a');
                  a.href = "#.html";
                  a.textContent = item.HeadingName;
                  a.setAttribute('data-path', item.ChildPageUrl);
                  a.setAttribute('data-depth',item.depth);
                  a.setAttribute('data-navItem',item.HeadingName)

                  // Replace spaces with hyphens and add custom class
                  const apiClass = item.HeadingName.replace(/\s+/g, '-');
                  const customClass = 'anchorClass';
                  a.classList.add(apiClass, customClass);
                  // Append the a element to the li
                  li.appendChild(a);
                  // Append the li element to the ul
                  ul.appendChild(li);
              });

              // Append the ul to the topNav
              topNav.appendChild(ul);
                  // Add event listeners to show/hide the belowNavMainContainer
                  const navItems = ul.querySelectorAll('a.anchorClass');
                  const belowNavMainContainer = document.querySelector('.belowNavMainContainer');

                  navItems.forEach((navItem) => {
                      navItem.addEventListener('click', () => {
                          let depth = navItem.getAttribute('data-depth'),
                              navElement = navItem.getAttribute('data-navItem') ,
                              childPath =  navItem.getAttribute('data-path');
                              getChildApiResponse(childPath, navElement, depth);
                          belowNavMainContainer.classList.toggle('show');
                      });
                  });
                //  rotation behave of nav bar 
                  const navLinks = document.querySelectorAll('.anchorClass');
                  navLinks.forEach(link => {
                    link.addEventListener('click', function(event) {
                      event.preventDefault();
                      if (this.classList.contains('rotate')) {
                        this.classList.remove('rotate');
                        belowNavMainContainer.classList.remove('show');
                      } else {
                        navLinks.forEach(link => link.classList.remove('rotate'));
                        this.classList.add('rotate');
                        belowNavMainContainer.classList.add('show');
                      }
                    });
                  });
        }


        function createListElement(textContent, href = "#.html") {
          const li = document.createElement('li');
          li.className = 'listElement';
          const a = document.createElement('a');
          a.href = href;
          a.textContent = textContent;
          a.className = 'anchorPath';
          a.addEventListener('click', function(event) {
            event.preventDefault();
        });
          li.appendChild(a);
          return li;
        }

        // }
        function getChildResponseData(childResponseData) {
          parentContainerDiv.innerHTML = '';
          firstElementChildDiv.innerHTML = '';
          secondElementDiv.innerHTML = '';
          let depth;
     
          const ul = document.createElement('ul');
     
          if (typeof childResponseData === 'object' && childResponseData !== null) {
              for (const key in childResponseData) {
                  if (childResponseData.hasOwnProperty(key)) {
                      const item = childResponseData[key];
                      const li = createListElement(key);
                      ul.appendChild(li);
     
                      if (Array.isArray(item)) {
                          const subUl = document.createElement('ul');
                          subUl.className = 'subList';
                          item.forEach((subItem) => {
                              subUl.appendChild(createListElement(subItem.title, subItem.path));
                              depth = subItem.depth;
                              if (depth < 2)
                                displayURLContent(subItem.path);
                          });
                          secondElementDiv.appendChild(subUl);
                      }
                  }
              }
          } else {
              console.error("childResponseData is not an array or object.");
          }
   
          if (depth === '2') {
            firstElementChildDiv.appendChild(ul);
            parentContainerDiv.appendChild(firstElementChildDiv);
        }
     
        if (depth == '1' || depth == '2') {
          parentContainerDiv.appendChild(secondElementDiv);
      }
          parentContainerDiv.appendChild(thirdElementDiv);
   
          const subLists = secondElementDiv.querySelectorAll('.subList');
          if (subLists.length > 0) {
              subLists[0].classList.add('active');
          }
     
          const mainItems = firstElementChildDiv.querySelectorAll('.listElement');
          if (mainItems.length > 0) {
              mainItems[0].classList.add('active');
          }
     
          mainItems.forEach((item, index) => {
              item.addEventListener('click', () => {
                  mainItems.forEach(mainItem => mainItem.classList.remove('active'));
                  item.classList.add('active');
                  thirdElementDiv.innerHTML = '';
                  subLists.forEach(subList => subList.classList.remove('active'));
                  if (index < subLists.length) {
                      subLists[index].classList.add('active');
                      const firstSubItem = subLists[index].querySelector('.anchorPath');
                      if (firstSubItem) {
                          displayURLContent(firstSubItem.getAttribute('href'));
                          firstSubItem.classList.add('anchor_active');
                      }
                  }
              });
          });
     
          const anchorTags = secondElementDiv.querySelectorAll('.anchorPath');
          anchorTags.forEach(anchor => {
              anchor.addEventListener('click', function () {
                  anchorTags.forEach(anchor => anchor.classList.remove('anchor_active'));
                  this.classList.add('anchor_active');
                  let imagePath = this.getAttribute('href');
                  displayURLContent(imagePath);
              });
          });
     
          belowNavMainContainer.appendChild(parentContainerDiv);
     
          if (mainItems.length > 0) {
              const firstMainItem = mainItems[0];
              firstMainItem.click(); // Simulate a click on the first main item
          }
      }

        function getApiResponse(api) {
            fetch(api, {
                method: 'GET',
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then((response) => {
                // console.log(response.data);
                responseData = response.data;
                getResponseData(responseData);
            })
            .catch((error) => {
                console.error(error);
            });
        }

        function transformResponseData(data) {
          // console.log(data.depth);
          let depth = data.depth;
          const transformedData = {};
          data.forEach(item => {
            if(item.parent){
              if (!transformedData[item.parent]) {
                  transformedData[item.parent] = [];
              }
              transformedData[item.parent].push({
                title: item.title,
                path: item.path,
                depth: depth
            });
            } else {
              if(item.title){
                if (!transformedData[item.title]) {
                    transformedData[item.title] = [];
                }
                transformedData[item.title].push({
                  title:item.title,
                  path: item.path,
                  depth:depth
              });
              }

            }
          });

          return transformedData;
        }

  // child path response
        function getChildApiResponse(api, navElement, depth) {
          fetch(api, {
              method: 'GET',
          })
          .then((response) => {
              if (!response.ok) {
                  throw new Error(response.statusText);
              }
              return response.json();
          })
          .then((response) => {
              // console.log(response.data);
              let childResponseData = response.data;
              childResponseData.depth = depth;
              // console.log(childResponseData.depth);
              // Transform the response data
              const transformedData = transformResponseData(childResponseData);
              // console.log(transformedData);
              getChildResponseData(transformedData);
          })
          .catch((error) => {
              console.error(error);
          });
        }

        function displayURLContent(url) {
          let mainUrl = "https://main--eds-godrej-capital--divanshu-techx.hlx.live" + url;
          fetch(mainUrl)
              .then(response => response.text())
              .then(data => {
                  let tempDiv = document.createElement('div');
                  tempDiv.innerHTML = data;
     
                  let mainContent = tempDiv.querySelector('main');
     
                  if (mainContent) {
                      thirdElementDiv.innerHTML = '';
                      thirdElementDiv.appendChild(mainContent);
                      parentContainerDiv.appendChild(thirdElementDiv);
                  } else {
                      console.error('Main tag not found in fetched content.');
                  }
              })
              .catch(error => {
                  console.error('Error fetching URL content:', error);
              });
      }

  getApiResponse(api);
}