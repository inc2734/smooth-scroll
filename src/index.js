import forEachHtmlNodes from '@inc2734/for-each-html-nodes';
import smoothscroll from 'smoothscroll-polyfill';
smoothscroll.polyfill();

export class SmoothScroll {

  constructor(params = {}) {
    const defaultParams = {
      selector: undefined,
      offset: 0,
    };

    this.settings = { ...defaultParams, ...params };

    const targets = document.querySelectorAll(this.settings.selector);
    forEachHtmlNodes(targets, (target) => this.apply(target));
  }

  apply(target) {
    target.addEventListener('click', (event) => this.handleClick(event), false);
  }

  handleClick(event) {
    const targetPermalink   = event.currentTarget.href.split('#')[0];
    const locationPermalink = window.location.href.split('#')[0];
    if (targetPermalink !== locationPermalink) {
      return true;
    }

    event.preventDefault();

    const hash   = event.currentTarget.hash.split('%').join('\\%').split('(').join('\\(').split(')').join('\\)');
    const anchor = document.querySelector(hash);
    if (! anchor ) {
      return false;
    }

    window.history.pushState('', '', hash);

    const rectTop   = anchor.getBoundingClientRect().top;
    const scrollTop = window.pageYOffset
    const offset    = 'function' === typeof this.settings.offset ? this.settings.offset() : this.settings.offset;

    if (document.activeElement !== anchor) {
      anchor.tabIndex = -1
      anchor.focus();
    }

    window.scrollTo(
      {
        top: rectTop + scrollTop - offset,
        behavior: 'smooth',
      }
    );
  }
}
