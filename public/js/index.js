var D = document,
    M = Math,
    W = window,
    $ = function (a) {
  var b = 1 < arguments.length && arguments[1] !== void 0 ? arguments[1] : D,
      c = 0 === a.indexOf('.'),
      d = 0 === a.indexOf('#');
  return c ? b.getElementsByClassName(a.substr(1, a.length)) : d ? b.getElementById(a.substr(1, a.length)) : b.getElementsByTagName(a);
},
    draggableContainer = $('.draggables')[0],
    draggables = $('.drag'),
    maxZIndex = 5 * draggables.length,
    dragged = !1,
    startPos = !1,
    currentZIndex = 1,
    forEach = function (a, b) {
  for (var c = 0; c < a.length; c++) a.hasOwnProperty(c) && b(a[c]);
},
    cl = {
  has: function has(a, b) {
    return a.className && -1 < a.className.indexOf(b);
  },
  add: function add(a, b) {
    cl.has(a, b) || (a.className && (b = a.className + ' ' + b), a.className = b);
  },
  rm: function rm(a, b) {
    cl.has(a, b) && (a.className = a.className.replace(b, '').trim());
  },
  toggle: function toggle(a, b) {
    cl.has(a, b) ? cl.rm(a, b) : cl.add(a, b);
  }
},
    on = function (a, b, c) {
  a && a.addEventListener(b, c);
},
    onload = function (a) {
  return function (b) {
    if (cl.has(b.target, 'bg')) {
      var c = b.target,
          d = c.getBoundingClientRect().width,
          e = c.getBoundingClientRect().height,
          f = 0,
          g = 0,
          h = .7 * W.innerWidth;

      if (d > h) {
        var k = d / h + .1;
        d /= k, e /= k;
      } // resize if too high


      var l = .7 * W.innerHeight;

      if (e > l) {
        var m = e / l + .1;
        e /= m, d /= m;
      }

      var i = W.innerWidth - d,
          j = W.innerHeight - e;
      f = M.random() * i, g = M.random() * j, f = "".concat(M.floor(percentFromPixels('Width', f)), "%"), g = "".concat(M.floor(percentFromPixels('Height', g)), "%"), a.style.left = f, a.style.top = g, a.style.transition = 'left 500ms, top 500ms';
    }
  };
};

forEach(draggables, function (a) {
  var b = M.random(),
      c = {
    left: '100%',
    top: '100%'
  };
  .7 < b ? c.left = "-".concat(c.left) : .3 > b && (c.top = "-".concat(c.top)), a.style.left = c.left, a.style.top = c.top;
  var d = $('.bg', a)[0];
  on(d, 'load', onload(a));
});

var touchHandler = function (a) {
  var b = a.changedTouches[0],
      c = D.createEvent("MouseEvent"),
      d = {
    touchstart: "mousedown",
    touchmove: "mousemove",
    touchend: "mouseup"
  }[a.type];
  return c.initMouseEvent(d, !0, !0, W, 1, b.screenX, b.screenY, b.clientX, b.clientY, !1, !1, !1, !1, 0, null), b.target.dispatchEvent(c), a.preventDefault(), a.stopPropagation(), !1;
},
    doNothing = function (a) {
  return a.preventDefault(), !1;
},
    getPos = function (a) {
  return parseInt(a.replace('%', ''));
},
    percentFromPixels = function (a, b) {
  return 100 * (b / W["inner".concat(a)]);
},
    pixelsFromPercent = function (a, b) {
  return b * W["inner".concat(a)] / 100;
},
    isOutOfBounds = function (a) {
  return a.clientX >= W.innerWidth || 0 >= a.clientX || a.clientY >= W.innerHeight || 0 >= a.clientY;
},
    drag = function (a) {
  dragged = a.currentTarget.parentNode, cl.add(dragged, 'dragged'), startPos = {
    left: pixelsFromPercent('Width', getPos(dragged.style.left)),
    top: pixelsFromPercent('Height', getPos(dragged.style.top))
  }, currentZIndex += 1, dragged.style.zIndex = currentZIndex, dragged.offset = {
    left: a.clientX - pixelsFromPercent('Width', getPos(dragged.style.left)),
    top: a.clientY - pixelsFromPercent('Height', getPos(dragged.style.top))
  }, dragged.style.opacity = .8, dragged.style.transition = null, on(D, 'mousemove', mousemove), on(D, 'mouseup', drop), on(D, 'mouseout', dropIfOutOfBounds);
},
    drop = function () {
  dragged && (forEach(draggables, function (a) {
    cl.rm(a, 'dragged'), a === dragged ? cl.add(dragged, 'dropped') : cl.rm(a, 'dropped');
  }), dragged.style.opacity = 1, dragged.style.transition = 'left 500ms, top 500ms', dragged = !1, startPos = !1);
},
    dropIfOutOfBounds = function (a) {
  isOutOfBounds(a) && drop(a);
},
    mousemove = function (a) {
  if (dragged) {
    var b = {
      left: W.innerWidth - dragged.clientWidth,
      top: W.innerHeight - dragged.clientHeight
    },
        c = a.clientX - dragged.offset.left;
    0 > c ? c = 0 : c > b.left && (c = b.left), dragged.style.left = "".concat(percentFromPixels('Width', c), "%");
    var d = a.clientY - dragged.offset.top;
    0 > d ? d = 0 : d > b.top && (d = b.top), dragged.style.top = "".concat(percentFromPixels('Height', d), "%");
  }
};

W.onload = function () {
  forEach(draggables, function (b) {
    var c = $('.bg', b)[0];

    if (c) {
      on(c, 'dragstart', doNothing), on(c, 'mousedown', drag), on(c, "touchstart", touchHandler, !0), on(c, "touchmove", touchHandler, !0), on(c, "touchend", touchHandler, !0), on(c, "touchcancel", touchHandler, !0);
      var a = c.parentNode.style;
      (a && '100%' === a.left || '-100%' === a.left) && c.dispatchEvent(new Event('load'));
    }

    var d = $('a', b)[0];
    d && on(d, 'touchend', function (a) {
      return a.stopPropagation(), !1;
    });
  });
};

// Menu
var menuContainer = $('.nav')[0];

if (menuContainer) {
  var active = $('.active', menuContainer)[0],
      toggleMenu = function (a) {
    return a.preventDefault(), cl.toggle(menuContainer, 'show'), !1;
  };

  active && on(active, 'click', toggleMenu);
} // About page


var trigger = $('.about-page-trigger')[0];
trigger && on(trigger, "click", function (a) {
  return a.preventDefault(), cl.toggle(document.body, "about-visible"), !1;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIkQiLCJkb2N1bWVudCIsIk0iLCJNYXRoIiwiVyIsIndpbmRvdyIsIiQiLCJzdHIiLCJwYXIiLCJpc0NsIiwiaW5kZXhPZiIsImlzSWQiLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwic3Vic3RyIiwibGVuZ3RoIiwiZ2V0RWxlbWVudEJ5SWQiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImRyYWdnYWJsZUNvbnRhaW5lciIsImRyYWdnYWJsZXMiLCJtYXhaSW5kZXgiLCJkcmFnZ2VkIiwic3RhcnRQb3MiLCJjdXJyZW50WkluZGV4IiwiZm9yRWFjaCIsIml0ZW1zIiwiZm4iLCJpIiwiaGFzT3duUHJvcGVydHkiLCJjbCIsImhhcyIsImUiLCJjIiwiY2xhc3NOYW1lIiwiYWRkIiwicm0iLCJyZXBsYWNlIiwidHJpbSIsInRvZ2dsZSIsIm9uIiwiZWxlIiwibGlzdGVuZXIiLCJjYiIsImFkZEV2ZW50TGlzdGVuZXIiLCJvbmxvYWQiLCJ0YXJnZXQiLCJ0YXIiLCJ3aWR0aCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImhlaWdodCIsImxlZnQiLCJ0b3AiLCJtYXhXaWR0aCIsImlubmVyV2lkdGgiLCJ3aWR0aFBlcmNlbnQiLCJtYXhIZWlnaHQiLCJpbm5lckhlaWdodCIsImhlaWdodFBlcmNlbnQiLCJtYXhMZWZ0IiwibWF4VG9wIiwicmFuZG9tIiwiZmxvb3IiLCJwZXJjZW50RnJvbVBpeGVscyIsInN0eWxlIiwidHJhbnNpdGlvbiIsImRyYWdnYWJsZSIsInJhbiIsInBvcyIsImltZyIsInRvdWNoSGFuZGxlciIsImV2ZW50IiwidG91Y2giLCJjaGFuZ2VkVG91Y2hlcyIsInNpbXVsYXRlZEV2ZW50IiwiY3JlYXRlRXZlbnQiLCJldnQiLCJ0b3VjaHN0YXJ0IiwidG91Y2htb3ZlIiwidG91Y2hlbmQiLCJ0eXBlIiwiaW5pdE1vdXNlRXZlbnQiLCJzY3JlZW5YIiwic2NyZWVuWSIsImNsaWVudFgiLCJjbGllbnRZIiwiZGlzcGF0Y2hFdmVudCIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwiZG9Ob3RoaW5nIiwiZ2V0UG9zIiwicGFyc2VJbnQiLCJkaXIiLCJweCIsInBpeGVsc0Zyb21QZXJjZW50IiwicGMiLCJpc091dE9mQm91bmRzIiwiZHJhZyIsImN1cnJlbnRUYXJnZXQiLCJwYXJlbnROb2RlIiwiekluZGV4Iiwib2Zmc2V0Iiwib3BhY2l0eSIsIm1vdXNlbW92ZSIsImRyb3AiLCJkcm9wSWZPdXRPZkJvdW5kcyIsIm1heCIsImNsaWVudFdpZHRoIiwiY2xpZW50SGVpZ2h0IiwibmV3TGVmdCIsIm5ld1RvcCIsInBhcmVudFN0eWxlIiwiRXZlbnQiLCJhIiwibWVudUNvbnRhaW5lciIsImFjdGl2ZSIsInRvZ2dsZU1lbnUiLCJ0cmlnZ2VyIiwiYm9keSJdLCJtYXBwaW5ncyI6IklBQU1BLENBQUMsR0FBR0MsUTtJQUNKQyxDQUFDLEdBQUdDLEk7SUFDSkMsQ0FBQyxHQUFHQyxNO0lBRUpDLENBQUMsR0FBRyxVQUFDQyxDQUFELEVBQWtCO0FBQUEsTUFBWkMsQ0FBWSxvRUFBTlIsQ0FBTTtBQUFBLE1BQ3BCUyxDQUFJLEdBQXdCLENBQXJCLEtBQUFGLENBQUcsQ0FBQ0csT0FBSixDQUFZLEdBQVosQ0FEYTtBQUFBLE1BRXBCQyxDQUFJLEdBQXdCLENBQXJCLEtBQUFKLENBQUcsQ0FBQ0csT0FBSixDQUFZLEdBQVosQ0FGYTtBQUFBLFNBSXRCRCxDQUpzQixHQUtqQkQsQ0FBRyxDQUFDSSxzQkFBSixDQUEyQkwsQ0FBRyxDQUFDTSxNQUFKLENBQVcsQ0FBWCxFQUFjTixDQUFHLENBQUNPLE1BQWxCLENBQTNCLENBTGlCLEdBTWZILENBTmUsR0FPakJILENBQUcsQ0FBQ08sY0FBSixDQUFtQlIsQ0FBRyxDQUFDTSxNQUFKLENBQVcsQ0FBWCxFQUFjTixDQUFHLENBQUNPLE1BQWxCLENBQW5CLENBUGlCLEdBU2pCTixDQUFHLENBQUNRLG9CQUFKLENBQXlCVCxDQUF6QixDQVRpQjtBQVczQixDO0lB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QUVEOzs7QUFFQSxJQUFNQyxPQUFPLEdBQUc3RyxDQUFDLENBQUMscUJBQUQsQ0FBRCxDQUF5QixDQUF6QixDQUFoQjtBQUVJNkcsTyxJQUNGN0UsRUFBRSxDQUFDNkUsT0FBRCxFQUFVLE9BQVYsRUFBbUIsVUFBQXpDLENBQUcsRUFBSTtBQUsxQixTQUpBQSxDQUFHLENBQUNXLGNBQUosRUFJQSxFQUZBekQsRUFBRSxDQUFDUyxNQUFILENBQVVwQyxRQUFRLENBQUNtSCxJQUFuQixFQUF5QixlQUF6QixDQUVBO0FBQ0QsQ0FOQyxDIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgRCA9IGRvY3VtZW50XG5jb25zdCBNID0gTWF0aFxuY29uc3QgVyA9IHdpbmRvd1xuXG5jb25zdCAkID0gKHN0ciwgcGFyID0gRCkgPT4ge1xuICBjb25zdCBpc0NsID0gc3RyLmluZGV4T2YoJy4nKSA9PT0gMFxuICBjb25zdCBpc0lkID0gc3RyLmluZGV4T2YoJyMnKSA9PT0gMFxuXG4gIGlmIChpc0NsKSB7XG4gICAgcmV0dXJuIHBhci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHN0ci5zdWJzdHIoMSwgc3RyLmxlbmd0aCkpXG4gIH0gZWxzZSBpZiAoaXNJZCkge1xuICAgIHJldHVybiBwYXIuZ2V0RWxlbWVudEJ5SWQoc3RyLnN1YnN0cigxLCBzdHIubGVuZ3RoKSlcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcGFyLmdldEVsZW1lbnRzQnlUYWdOYW1lKHN0cilcbiAgfVxufVxuXG4vLyBnbG9iYWwgZG9tIGVsZW1lbnRzXG5jb25zdCBkcmFnZ2FibGVDb250YWluZXIgPSAkKCcuZHJhZ2dhYmxlcycpWzBdXG5jb25zdCBkcmFnZ2FibGVzID0gJCgnLmRyYWcnKVxuY29uc3QgbWF4WkluZGV4ID0gZHJhZ2dhYmxlcy5sZW5ndGggKiA1XG5cbi8vIGdsb2JhbCBhcHAgc3RhdGVcbmxldCBkcmFnZ2VkID0gZmFsc2VcbmxldCBzdGFydFBvcyA9IGZhbHNlXG5sZXQgY3VycmVudFpJbmRleCA9IDFcblxuLy8gbG9vcCBvdmVyIGVhY2ggaXRlbSBhbmQgY2FsbCBmbihpdGVtKVxuY29uc3QgZm9yRWFjaCA9IChpdGVtcywgZm4pID0+IHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChpdGVtcy5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgZm4oaXRlbXNbaV0pXG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGNsID0ge1xuICBoYXMoZSwgYykge1xuICAgIHJldHVybiBlLmNsYXNzTmFtZSAmJiBlLmNsYXNzTmFtZS5pbmRleE9mKGMpID4gLTFcbiAgfSxcbiAgYWRkKGUsIGMpIHtcbiAgICBpZiAoIWNsLmhhcyhlLCBjKSkge1xuICAgICAgaWYgKGUuY2xhc3NOYW1lKSB7XG4gICAgICAgIGMgPSBlLmNsYXNzTmFtZSArICcgJyArIGNcbiAgICAgIH1cbiAgICAgIGUuY2xhc3NOYW1lID0gY1xuICAgIH1cbiAgfSxcbiAgcm0oZSwgYykge1xuICAgIGlmIChjbC5oYXMoZSwgYykpIHtcbiAgICAgIGUuY2xhc3NOYW1lID0gZS5jbGFzc05hbWUucmVwbGFjZShjLCAnJykudHJpbSgpXG4gICAgfVxuICB9LFxuICB0b2dnbGU6IChlLCBjKSA9PiB7XG4gICAgaWYgKGNsLmhhcyhlLCBjKSkge1xuICAgICAgY2wucm0oZSwgYylcbiAgICB9IGVsc2Uge1xuICAgICAgY2wuYWRkKGUsIGMpXG4gICAgfVxuICB9LFxufVxuXG5jb25zdCBvbiA9IChlbGUsIGxpc3RlbmVyLCBjYikgPT4ge1xuICBpZiAoZWxlKSB7XG4gICAgZWxlLmFkZEV2ZW50TGlzdGVuZXIobGlzdGVuZXIsIGNiKVxuICB9XG59XG5cbi8vIHJlc2l6ZSBhbmQgcmVwb3NpdGlvbiBhZnRlciBsb2FkIG9mIGltYWdlc1xuY29uc3Qgb25sb2FkID0gcGFyID0+IGUgPT4ge1xuICBpZiAoY2wuaGFzKGUudGFyZ2V0LCAnYmcnKSkge1xuICAgIGNvbnN0IHRhciA9IGUudGFyZ2V0XG4gICAgbGV0IHdpZHRoID0gdGFyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoXG4gICAgbGV0IGhlaWdodCA9IHRhci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHRcbiAgICBsZXQgbGVmdCA9IDBcbiAgICBsZXQgdG9wID0gMFxuXG4gICAgLy8gcmVzaXplIGlmIHRvbyB3aWRlXG4gICAgY29uc3QgbWF4V2lkdGggPSBXLmlubmVyV2lkdGggKiAuN1xuICAgIGlmICh3aWR0aCA+IG1heFdpZHRoKSB7XG4gICAgICBjb25zdCB3aWR0aFBlcmNlbnQgPSAod2lkdGggLyBtYXhXaWR0aCkgKyAuMVxuICAgICAgd2lkdGggLz0gd2lkdGhQZXJjZW50XG4gICAgICBoZWlnaHQgLz0gd2lkdGhQZXJjZW50XG4gICAgfVxuXG4gICAgLy8gcmVzaXplIGlmIHRvbyBoaWdoXG4gICAgY29uc3QgbWF4SGVpZ2h0ID0gVy5pbm5lckhlaWdodCAqIC43XG4gICAgaWYgKGhlaWdodCA+IG1heEhlaWdodCkge1xuICAgICAgY29uc3QgaGVpZ2h0UGVyY2VudCA9IChoZWlnaHQgLyBtYXhIZWlnaHQpICsgLjFcbiAgICAgIGhlaWdodCAvPSBoZWlnaHRQZXJjZW50XG4gICAgICB3aWR0aCAvPSBoZWlnaHRQZXJjZW50XG4gICAgfVxuXG4gICAgY29uc3QgbWF4TGVmdCA9IFcuaW5uZXJXaWR0aCAtIHdpZHRoXG4gICAgY29uc3QgbWF4VG9wID0gVy5pbm5lckhlaWdodCAtIGhlaWdodFxuICAgIGxlZnQgPSBNLnJhbmRvbSgpICogbWF4TGVmdFxuICAgIHRvcCA9IE0ucmFuZG9tKCkgKiBtYXhUb3BcbiAgICBsZWZ0ID0gYCR7TS5mbG9vcihwZXJjZW50RnJvbVBpeGVscygnV2lkdGgnLCBsZWZ0KSl9JWBcbiAgICB0b3AgPSBgJHtNLmZsb29yKHBlcmNlbnRGcm9tUGl4ZWxzKCdIZWlnaHQnLCB0b3ApKX0lYFxuXG4gICAgcGFyLnN0eWxlLmxlZnQgPSBsZWZ0XG4gICAgcGFyLnN0eWxlLnRvcCA9IHRvcFxuICAgIHBhci5zdHlsZS50cmFuc2l0aW9uID0gJ2xlZnQgNTAwbXMsIHRvcCA1MDBtcydcbiAgfVxufVxuXG5mb3JFYWNoKGRyYWdnYWJsZXMsIGRyYWdnYWJsZSA9PiB7XG4gIGNvbnN0IHJhbiA9IE0ucmFuZG9tKClcbiAgY29uc3QgcG9zID0ge1xuICAgIGxlZnQ6ICcxMDAlJyxcbiAgICB0b3A6ICcxMDAlJyxcbiAgfVxuXG4gIGlmIChyYW4gPiAwLjcpIHtcbiAgICBwb3MubGVmdCA9IGAtJHtwb3MubGVmdH1gXG4gIH0gZWxzZSBpZiAocmFuIDwgMC4zKSB7XG4gICAgcG9zLnRvcCA9IGAtJHtwb3MudG9wfWBcbiAgfVxuXG4gIGRyYWdnYWJsZS5zdHlsZS5sZWZ0ID0gcG9zLmxlZnRcbiAgZHJhZ2dhYmxlLnN0eWxlLnRvcCA9IHBvcy50b3BcblxuICBjb25zdCBpbWcgPSAkKCcuYmcnLCBkcmFnZ2FibGUpWzBdXG4gIG9uKGltZywgJ2xvYWQnLCBvbmxvYWQoZHJhZ2dhYmxlKSlcbn0pXG5cbmNvbnN0IHRvdWNoSGFuZGxlciA9IChldmVudCkgPT4ge1xuICBjb25zdCB0b3VjaCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdXG4gIGNvbnN0IHNpbXVsYXRlZEV2ZW50ID0gRC5jcmVhdGVFdmVudChcIk1vdXNlRXZlbnRcIilcblxuICBjb25zdCBldmVudE5hbWVzID0ge1xuICAgIHRvdWNoc3RhcnQ6IFwibW91c2Vkb3duXCIsXG4gICAgdG91Y2htb3ZlOiBcIm1vdXNlbW92ZVwiLFxuICAgIHRvdWNoZW5kOiBcIm1vdXNldXBcIixcbiAgfVxuXG4gIGNvbnN0IGV2dCA9IGV2ZW50TmFtZXNbZXZlbnQudHlwZV1cblxuICBzaW11bGF0ZWRFdmVudC5pbml0TW91c2VFdmVudChcbiAgICBldnQsIHRydWUsIHRydWUsIFcsIDEsXG4gICAgdG91Y2guc2NyZWVuWCwgdG91Y2guc2NyZWVuWSxcbiAgICB0b3VjaC5jbGllbnRYLCB0b3VjaC5jbGllbnRZLFxuICAgIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCAwLCBudWxsXG4gIClcblxuICB0b3VjaC50YXJnZXQuZGlzcGF0Y2hFdmVudChzaW11bGF0ZWRFdmVudClcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICByZXR1cm4gZmFsc2Vcbn1cblxuY29uc3QgZG9Ob3RoaW5nID0gKGUpID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gIHJldHVybiBmYWxzZVxufVxuXG5jb25zdCBnZXRQb3MgPSBlID0+IHBhcnNlSW50KGUucmVwbGFjZSgnJScsICcnKSlcblxuY29uc3QgcGVyY2VudEZyb21QaXhlbHMgPSAoZGlyLCBweCkgPT4gKHB4IC8gV1tgaW5uZXIke2Rpcn1gXSkgKiAxMDBcbmNvbnN0IHBpeGVsc0Zyb21QZXJjZW50ID0gKGRpciwgcGMpID0+IChwYyAqIFdbYGlubmVyJHtkaXJ9YF0pIC8gMTAwXG5cbmNvbnN0IGlzT3V0T2ZCb3VuZHMgPSBlID0+IChcbiAgZS5jbGllbnRYID49IFcuaW5uZXJXaWR0aCB8fFxuICBlLmNsaWVudFggPD0gMCB8fFxuICBlLmNsaWVudFkgPj0gVy5pbm5lckhlaWdodCB8fFxuICBlLmNsaWVudFkgPD0gMFxuKVxuXG5jb25zdCBkcmFnID0gZXZ0ID0+IHtcbiAgZHJhZ2dlZCA9IGV2dC5jdXJyZW50VGFyZ2V0LnBhcmVudE5vZGVcblxuICBjbC5hZGQoZHJhZ2dlZCwgJ2RyYWdnZWQnKVxuXG4gIHN0YXJ0UG9zID0ge1xuICAgIGxlZnQ6IHBpeGVsc0Zyb21QZXJjZW50KCdXaWR0aCcsIGdldFBvcyhkcmFnZ2VkLnN0eWxlLmxlZnQpKSxcbiAgICB0b3A6IHBpeGVsc0Zyb21QZXJjZW50KCdIZWlnaHQnLCBnZXRQb3MoZHJhZ2dlZC5zdHlsZS50b3ApKSxcbiAgfVxuXG4gIGN1cnJlbnRaSW5kZXggKz0gMVxuICBkcmFnZ2VkLnN0eWxlLnpJbmRleCA9IGN1cnJlbnRaSW5kZXhcbiAgZHJhZ2dlZC5vZmZzZXQgPSB7XG4gICAgbGVmdDogZXZ0LmNsaWVudFggLSBwaXhlbHNGcm9tUGVyY2VudCgnV2lkdGgnLCBnZXRQb3MoZHJhZ2dlZC5zdHlsZS5sZWZ0KSksXG4gICAgdG9wOiBldnQuY2xpZW50WSAtIHBpeGVsc0Zyb21QZXJjZW50KCdIZWlnaHQnLCBnZXRQb3MoZHJhZ2dlZC5zdHlsZS50b3ApKSxcbiAgfVxuICBkcmFnZ2VkLnN0eWxlLm9wYWNpdHkgPSAwLjhcblxuICBkcmFnZ2VkLnN0eWxlLnRyYW5zaXRpb24gPSBudWxsXG5cbiAgb24oRCwgJ21vdXNlbW92ZScsIG1vdXNlbW92ZSlcbiAgb24oRCwgJ21vdXNldXAnLCBkcm9wKVxuICBvbihELCAnbW91c2VvdXQnLCBkcm9wSWZPdXRPZkJvdW5kcylcbn1cblxuY29uc3QgZHJvcCA9ICgpID0+IHtcbiAgaWYgKCFkcmFnZ2VkKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICBmb3JFYWNoKGRyYWdnYWJsZXMsIGRyYWdnYWJsZSA9PiB7XG4gICAgY2wucm0oZHJhZ2dhYmxlLCAnZHJhZ2dlZCcpXG5cbiAgICBpZiAoZHJhZ2dhYmxlID09PSBkcmFnZ2VkKSB7XG4gICAgICBjbC5hZGQoZHJhZ2dlZCwgJ2Ryb3BwZWQnKVxuICAgIH0gZWxzZSB7XG4gICAgICBjbC5ybShkcmFnZ2FibGUsICdkcm9wcGVkJylcbiAgICB9XG4gIH0pXG5cbiAgZHJhZ2dlZC5zdHlsZS5vcGFjaXR5ID0gMVxuICBkcmFnZ2VkLnN0eWxlLnRyYW5zaXRpb24gPSAnbGVmdCA1MDBtcywgdG9wIDUwMG1zJ1xuXG4gIGRyYWdnZWQgPSBmYWxzZVxuICBzdGFydFBvcyA9IGZhbHNlXG59XG5cbmNvbnN0IGRyb3BJZk91dE9mQm91bmRzID0gZSA9PiB7XG4gIGlmIChpc091dE9mQm91bmRzKGUpKSB7XG4gICAgZHJvcChlKVxuICB9XG59XG5cbmNvbnN0IG1vdXNlbW92ZSA9IGV2dCA9PiB7XG4gIGlmIChkcmFnZ2VkKSB7XG4gICAgY29uc3QgbWF4ID0ge1xuICAgICAgbGVmdDogVy5pbm5lcldpZHRoIC0gZHJhZ2dlZC5jbGllbnRXaWR0aCxcbiAgICAgIHRvcDogVy5pbm5lckhlaWdodCAtIGRyYWdnZWQuY2xpZW50SGVpZ2h0LFxuICAgIH1cblxuICAgIGxldCBuZXdMZWZ0ID0gZXZ0LmNsaWVudFggLSBkcmFnZ2VkLm9mZnNldC5sZWZ0XG4gICAgaWYgKG5ld0xlZnQgPCAwKSB7XG4gICAgICBuZXdMZWZ0ID0gMFxuICAgIH0gZWxzZSBpZiAobmV3TGVmdCA+IG1heC5sZWZ0KSB7XG4gICAgICBuZXdMZWZ0ID0gbWF4LmxlZnRcbiAgICB9XG5cbiAgICBkcmFnZ2VkLnN0eWxlLmxlZnQgPSBgJHtwZXJjZW50RnJvbVBpeGVscygnV2lkdGgnLCBuZXdMZWZ0KX0lYFxuXG4gICAgbGV0IG5ld1RvcCA9IGV2dC5jbGllbnRZIC0gZHJhZ2dlZC5vZmZzZXQudG9wXG4gICAgaWYgKG5ld1RvcCA8IDApIHtcbiAgICAgIG5ld1RvcCA9IDBcbiAgICB9IGVsc2UgaWYgKG5ld1RvcCA+IG1heC50b3ApIHtcbiAgICAgIG5ld1RvcCA9IG1heC50b3BcbiAgICB9XG4gICAgZHJhZ2dlZC5zdHlsZS50b3AgPSBgJHtwZXJjZW50RnJvbVBpeGVscygnSGVpZ2h0JywgbmV3VG9wKX0lYFxuICB9XG59XG5cblcub25sb2FkID0gKCkgPT4ge1xuICBmb3JFYWNoKGRyYWdnYWJsZXMsIGRyYWdnYWJsZSA9PiB7XG4gICAgY29uc3QgaW1nID0gJCgnLmJnJywgZHJhZ2dhYmxlKVswXVxuICAgIGlmIChpbWcpIHtcbiAgICAgIG9uKGltZywgJ2RyYWdzdGFydCcsIGRvTm90aGluZylcbiAgICAgIG9uKGltZywgJ21vdXNlZG93bicsIGRyYWcpXG5cbiAgICAgIG9uKGltZywgXCJ0b3VjaHN0YXJ0XCIsIHRvdWNoSGFuZGxlciwgdHJ1ZSlcbiAgICAgIG9uKGltZywgXCJ0b3VjaG1vdmVcIiwgdG91Y2hIYW5kbGVyLCB0cnVlKVxuICAgICAgb24oaW1nLCBcInRvdWNoZW5kXCIsIHRvdWNoSGFuZGxlciwgdHJ1ZSlcbiAgICAgIG9uKGltZywgXCJ0b3VjaGNhbmNlbFwiLCB0b3VjaEhhbmRsZXIsIHRydWUpXG5cbiAgICAgIGNvbnN0IHBhcmVudFN0eWxlID0gaW1nLnBhcmVudE5vZGUuc3R5bGVcbiAgICAgIGlmIChwYXJlbnRTdHlsZSAmJiBwYXJlbnRTdHlsZS5sZWZ0ID09PSAnMTAwJScgfHwgcGFyZW50U3R5bGUubGVmdCA9PT0gJy0xMDAlJykge1xuICAgICAgICBpbWcuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2xvYWQnKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBhID0gJCgnYScsIGRyYWdnYWJsZSlbMF1cbiAgICBpZiAoYSkge1xuICAgICAgb24oYSwgJ3RvdWNoZW5kJywgZSA9PiB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9KVxuICAgIH1cbiAgfSlcbn1cblxuLy8gTWVudVxuY29uc3QgbWVudUNvbnRhaW5lciA9ICQoJy5uYXYnKVswXVxuaWYgKG1lbnVDb250YWluZXIpIHtcbiAgY29uc3QgYWN0aXZlID0gJCgnLmFjdGl2ZScsIG1lbnVDb250YWluZXIpWzBdXG5cbiAgY29uc3QgdG9nZ2xlTWVudSA9IGUgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGNsLnRvZ2dsZShtZW51Q29udGFpbmVyLCAnc2hvdycpXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBpZiAoYWN0aXZlKSB7XG4gICAgb24oYWN0aXZlLCAnY2xpY2snLCB0b2dnbGVNZW51KVxuICB9XG59XG5cbi8vIEFib3V0IHBhZ2VcblxuY29uc3QgdHJpZ2dlciA9ICQoJy5hYm91dC1wYWdlLXRyaWdnZXInKVswXVxuXG5pZiAodHJpZ2dlcikge1xuICBvbih0cmlnZ2VyLCBcImNsaWNrXCIsIGV2dCA9PiB7XG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBjbC50b2dnbGUoZG9jdW1lbnQuYm9keSwgXCJhYm91dC12aXNpYmxlXCIpXG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfSlcbn1cbiJdfQ==