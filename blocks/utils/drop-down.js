// Function to initialize custom select dropdowns
export function initializeCustomSelect(selector) {
  var elements = document.querySelectorAll(selector);
  elements.forEach(function (el) {
    var selElmnt = el;
    var options = selElmnt.options;
    var ll = options.length;
    /* Create a new DIV that will act as the selected item */
    var selectedDiv = document.createElement('DIV');
    selectedDiv.setAttribute('class', 'select-selected');
    selectedDiv.innerHTML = options[selElmnt.selectedIndex].innerHTML;
    el.parentNode.appendChild(selectedDiv);

    /* Create a new DIV that will contain the option list */
    var optionsDiv = document.createElement('DIV');
    optionsDiv.setAttribute('class', 'select-items select-hide');

    /* For each option in the original select element, create a new DIV that will act as an option item */
    for (var j = 0; j < ll; j++) {
      var optionDiv = document.createElement('DIV');
      optionDiv.innerHTML = options[j].innerHTML;
      optionDiv.addEventListener('click', function (e) {
        /* When an item is clicked, update the original select box, and the selected item */
        var s = this.parentNode.parentNode.getElementsByTagName('select')[0];
        var sl = s.length;
        var h = this.parentNode.previousSibling;
        for (var i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            var selectedItems =
              this.parentNode.getElementsByClassName('same-as-selected');
            var yl = selectedItems.length;
            for (var k = 0; k < yl; k++) {
              selectedItems[k].removeAttribute('class');
            }
            this.setAttribute('class', 'same-as-selected');
            break;
          }
        }
        h.click();
      });
      optionsDiv.appendChild(optionDiv);
    }

    el.parentNode.appendChild(optionsDiv);

    selectedDiv.addEventListener('click', function (e) {
      /* When the select box is clicked, close any other select boxes, and open/close the current select box */
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle('select-hide');
      this.classList.toggle('select-arrow-active');
    });
  });

  function closeAllSelect(elmnt) {
    /* A function that will close all select boxes in the document, except the current select box */
    var x = document.getElementsByClassName('select-items');
    var y = document.getElementsByClassName('select-selected');
    var xl = x.length;
    var yl = y.length;
    var arrNo = [];
    for (var i = 0; i < yl; i++) {
      if (elmnt == y[i]) {
        arrNo.push(i);
      } else {
        y[i].classList.remove('select-arrow-active');
      }
    }
    for (var i = 0; i < xl; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add('select-hide');
      }
    }
  }

  /* If the user clicks anywhere outside the select box, then close all select boxes */
  document.addEventListener('click', closeAllSelect);
}
