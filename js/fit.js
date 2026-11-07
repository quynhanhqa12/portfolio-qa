/* Fit the design to the window on mouse screens (Quỳnh Anh's note: zooming or resizing must
 * never break the layout; it should always look like the Figma design, only bigger or smaller).
 *
 * The pages are laid out for the 1920-wide Figma frames. On a screen with a mouse (or any
 * screen at least 1280px wide) the whole page is zoomed by
 *   z = min(window width / 1920, window height / 800)
 * so the design is scaled as one piece and always fills the width. Browser windows are usually
 * a little shorter than 16:9 (toolbars), so the one-screen pages (Home, Works, Contact, the first
 * screen of About) are laid out for that height and tighten their vertical spacing a little; only
 * a very short window (under 800 design px tall) shrinks the whole page instead. Browser zoom (Ctrl/Cmd +/-) only changes the window size
 * in CSS pixels, so the page is rescaled and looks the same at any zoom level.
 * Phones and tablets (touch, narrower than 1280px) keep their own layouts: no zoom here, and the
 * stylesheets' breakpoints apply to them only.
 *
 * Loaded as a plain script in <head>, before the stylesheets, so the first paint is already
 * scaled. --vw / --vh replace vw / svh in the CSS (see base.css :root). */
(function () {
  var root = document.documentElement;
  var mouse = window.matchMedia('(hover: hover) and (pointer: fine)');
  var last = '';

  function fit() {
    var width = root.clientWidth || window.innerWidth; // without the scrollbar
    var height = window.innerHeight;
    var board = mouse.matches || width >= 1280;
    var key = board + ' ' + width + ' ' + height;
    if (key === last) return; // nothing changed (also stops the resize observer from looping)
    last = key;
    root.classList.toggle('is-scaled', board);
    if (!board) {
      root.style.zoom = '';
      root.style.removeProperty('--vw');
      root.style.removeProperty('--vh');
      root.style.removeProperty('--cqk');
      return;
    }
    var zoom = Math.min(width / 1920, height / 800);
    root.style.zoom = String(zoom);
    // the page is laid out at width / zoom x height / zoom CSS pixels (>= 1920 wide, >= 800 tall)
    root.style.setProperty('--vw', width / zoom / 100 + 'px');
    root.style.setProperty('--vh', height / zoom / 100 + 'px');
    root.style.setProperty('--cqk', String(containerUnitFix()));
  }

  // Safari (WebKit) applies the page zoom to container-query units a second time (Chrome doesn't):
  // 100cqw of a 100px box comes out as 100 x zoom. Measure it and return the factor that undoes it.
  function containerUnitFix() {
    var box = document.createElement('div');
    var inner = document.createElement('div');
    box.style.cssText = 'position:absolute;left:0;top:0;width:100px;height:1px;visibility:hidden;pointer-events:none;container-type:inline-size';
    inner.style.cssText = 'width:100cqw;height:1px';
    box.appendChild(inner);
    root.appendChild(box);
    var ratio = inner.getBoundingClientRect().width / box.getBoundingClientRect().width;
    root.removeChild(box);
    return ratio > 0.05 && Math.abs(ratio - 1) > 0.01 ? 1 / ratio : 1;
  }

  fit();
  window.addEventListener('resize', fit);
  if (mouse.addEventListener) mouse.addEventListener('change', fit);
  // a scrollbar appearing after load (long pages, Windows) narrows the page without a resize event
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(root);
})();
