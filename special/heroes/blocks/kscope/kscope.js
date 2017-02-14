var box = document.querySelector('.k-scope-wrap'),
  linkPrev = false,
  boxDragged = Boolean(box.getAttribute('data-dragged')),
  centerElem = document.querySelector('.centerEl'),
  grids = box.getElementsByClassName('k-scope-block'),
  gridW = 2100,
  gridH = 1800,
  gridsCoords = [{
    x : 0,
    y : 0
  }];

if (window.innerWidth <= 600) {
  gridH = 900;
  gridW = 1050;
}

var msnry = new Masonry( '.k-scope-block', {
  itemSelector: '.k-scope-item',
  columnWidth: '.grid-sizer',
  percentPosition: true,
  initLayout: false
});

msnry.on('layoutComplete', startBoxCentering);

msnry.layout();

// TODO: resize with timeout (https://developer.mozilla.org/ru/docs/Web/Events/resize)
function startBoxCentering () {
  $(window).on('resize', function () {
    centerGrid();
    addGridOnWideScreen();
  });
  centerGrid();
  addGridOnWideScreen();
}

function centerGrid () {
  if (boxDragged) return;
  var docW = window.innerWidth,
    docH = window.innerHeight,
    centerElemBounds = centerElem.getBoundingClientRect(),
    boxPx = parseInt(box.getAttribute('data-x')),
    boxPy = parseInt(box.getAttribute('data-y')),
    centerElemPosX = (docW - centerElemBounds.width) / 2,
    centerElemPosY = (docH - centerElemBounds.height) / 2,
    x, y;

  x =  boxPx + (centerElemPosX - centerElemBounds.left);
  y = boxPy + (centerElemPosY - centerElemBounds.top);

  box.style.webkitTransform =
    box.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

  box.setAttribute('data-x', x);
  box.setAttribute('data-y', y);
}

function addGridOnWideScreen () {
  if (window.innerWidth > gridW) {
    if (!checkGrid(gridsCoords, gridW, 0)) {
      cloneGrid({
        x: gridW,
        y: 0,
        id: gridsCoords.length
      });
      gridsCoords.push({
        x: gridW,
        y: 0
      });
    }
    if (!checkGrid(gridsCoords, -gridW, 0)) {
      cloneGrid({
        x: -gridW,
        y: 0,
        id: gridsCoords.length
      });
      gridsCoords.push({
        x: -gridW,
        y: 0
      });
    }
  }
}

$('body').on('mouseover', '.k-scope-item', function () {
  $(this).addClass("_hover");
});
$('body').on('mouseout', '.k-scope-item', function () {
  $(this).removeClass("_hover");
});


interact('.k-scope-wrap')
  .allowFrom('.k-scope-block')
  .draggable({
    inertia: true,
    restrict: {
      restriction: {
        left: -50000,
        top: -50000,
        width: 100000,
        height: 100000
      }
    },
    onstart: function () {
      linkPrev = true;
    },
    onmove: dragMoveListener,
    onend: function () {
      setTimeout(function () {
        linkPrev = false;
      }, 300);
    }
  });

function dragMoveListener (event) {
  linkPrev = true;
  changePosition(event);
  checkPosition(event);
}

function changePosition (event) {
  var target = event.target,
    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

function checkPosition (event) {
  var event = event;
  var timer = setTimeout(function () {
    var newGrid = {};
    newGrid.left = 0;
    newGrid.top = 0;
    for (var i = 0; i < grids.length; i++) {
      var grid = grids[i],
        gridBounds = getBounds(grid);
      if (gridBounds.isVisible) {
        if (gridBounds.R > 0 && event.velocityX < 0) {
          newGrid.left = gridBounds.px + gridBounds.width;
          newGrid.top = gridBounds.py;
          if (!checkGrid(gridsCoords, newGrid.left, newGrid.top)) {
            cloneGrid({
              x: newGrid.left,
              y: newGrid.top,
              id: gridsCoords.length
            });
            gridsCoords.push({
              x: newGrid.left,
              y: newGrid.top
            });
          }
          newGrid.left = 0;
          newGrid.top = 0;
        }
        if (gridBounds.L > 0 && event.velocityX > 0) {
          newGrid.left = gridBounds.px - gridBounds.width;
          newGrid.top = gridBounds.py;
          if (!checkGrid(gridsCoords, newGrid.left, newGrid.top)) {
            cloneGrid({
              x: newGrid.left,
              y: newGrid.top,
              id: gridsCoords.length
            });
            gridsCoords.push({
              x: newGrid.left,
              y: newGrid.top
            });
          }
          newGrid.left = 0;
          newGrid.top = 0;
        }
        if (gridBounds.T > 0 && event.velocityY > 0) {
          newGrid.left = gridBounds.px;
          newGrid.top = gridBounds.py - gridBounds.height;
          if (!checkGrid(gridsCoords, newGrid.left, newGrid.top)) {
            cloneGrid({
              x: newGrid.left,
              y: newGrid.top,
              id: gridsCoords.length
            });
            gridsCoords.push({
              x: newGrid.left,
              y: newGrid.top
            });
          }
          newGrid.left = 0;
          newGrid.top = 0;
        }
        if (gridBounds.B > 0 && event.velocityY < 0) {
          newGrid.left = gridBounds.px;
          newGrid.top = gridBounds.py + gridBounds.height;
          if (!checkGrid(gridsCoords, newGrid.left, newGrid.top)) {
            cloneGrid({
              x: newGrid.left,
              y: newGrid.top,
              id: gridsCoords.length
            });
            gridsCoords.push({
              x: newGrid.left,
              y: newGrid.top
            });
          }
          newGrid.left = 0;
          newGrid.top = 0;
        }
      }
      else {
        if (gridBounds.id !== 0 && gridBounds.deletable) {
          box.removeChild(grid);
          removeGridInfo(gridsCoords, gridBounds.px, gridBounds.py);
        }
      }
    }
  }, 66);
}

function getBounds (elem) {
  var bounds = {};
  var docW = window.innerWidth,
    docH = window.innerHeight;
  if (!elem) return {};
  bounds.width = gridW;
  bounds.height = gridH;
  bounds.T = elem.getBoundingClientRect().top;
  bounds.L = elem.getBoundingClientRect().left;
  bounds.B = docH - elem.getBoundingClientRect().bottom;
  bounds.R = docW - elem.getBoundingClientRect().right;
  bounds.px = parseInt(elem.getAttribute('data-px'));
  bounds.py = parseInt(elem.getAttribute('data-py'));
  bounds.id = parseInt(elem.getAttribute('data-id'));
  bounds.deletable = Boolean(elem.getAttribute('data-deletable'));
  bounds.isVisible = true;

  if ((bounds.L > docW || bounds.L < -bounds.width) || (bounds.T > docH || bounds.T < -bounds.height)) {
    bounds.isVisible = false;
  }
  return bounds;
}

function removeGridInfo (arr, x, y) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].x === x && arr[i].y === y ) {
      arr.splice(i, 1);
    }
  }
}

function checkGrid (arr, x, y) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].x === x && arr[i].y === y ) {
      return true;
    }
  }
  return false;
}

function cloneGrid (posObj) {
  var baseGrid = document.querySelector('.k-scope-block'),
    clonedGrid = baseGrid.cloneNode(true),
    box = document.querySelector('.k-scope-wrap');
  clonedGrid.style.position = "absolute";
  clonedGrid.style.top = posObj.y + "px";
  clonedGrid.style.left = posObj.x + "px";
  clonedGrid.setAttribute('data-id', posObj.id);
  clonedGrid.setAttribute('data-px', posObj.x);
  clonedGrid.setAttribute('data-py', posObj.y);

  setTimeout(function () {
    clonedGrid.setAttribute('data-deletable', 'true');
  }, 3000);

  box.appendChild(clonedGrid);
}

$('body').on('click', '.item__overlay', function (e) {
  if (linkPrev && !checkMobile()) {
    e.preventDefault();
    //window.open($(this).attr('href'), "_blank");
  }
});
$('body').on('touchend', '.item__overlay', function (e) {
  if ($(this).closest('.k-scope-item').hasClass("_hover") && !linkPrev) {
    window.open($(this).attr('href'));
    return;
  }
  if (linkPrev) return;
  $('.k-scope-item').removeClass("_hover");
  $(this).closest('.k-scope-item').addClass('_hover');
});
