require('prismjs/themes/prism.css');

exports.shouldUpdateScroll = ({ prevRouterProps, routerProps }) => {
  if (prevRouterProps.location.pathname === routerProps.location.pathname) {
    return false;
  }

  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

  return false;
};
