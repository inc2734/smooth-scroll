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
    target.addEventListener(
      'click',
      (event) => {
        const targetPermalink   = event.currentTarget.href.split('#')[0];
        const locationPermalink = window.location.href.split('#')[0];
        if (targetPermalink !== locationPermalink) {
          return true;
        }

        event.preventDefault();
        this.handleClick(event);
      },
      false
    );
  }

  handleClick(event) {
    const hash   = event.currentTarget.hash;
    const anchor = document.getElementById(decodeURI(hash).replace(/^#/, ''));
    if (! anchor ) {
      return false;
    }

    window.history.pushState('', '', hash);

    const offset = 'function' === typeof this.settings.offset ? this.settings.offset() : this.settings.offset;
    let top = anchor.getBoundingClientRect().top + window.pageYOffset - offset;
    top = 0 > parseInt(top) ? 0 : top;

    window.scrollTo(
      {
        top,
        behavior: 'smooth',
      }
    );
  }
}
