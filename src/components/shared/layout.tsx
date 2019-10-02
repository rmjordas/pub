import * as React from 'react';

import Navigation, { NavigationLink } from './navigation';
import Footer from './footer';
import { Seo } from '@components/shared';
import { useSiteMetadata } from '@hooks';
import { ThemeProvider } from '@styled-components';
import { GlobalStyle, theme } from '@styles';

interface OwnProps {
  navLinks?: NavigationLink[];
}

type LayoutProps = OwnProps;

const Layout: React.FC<LayoutProps> = ({ children, navLinks = [] }) => {
  const siteMetadata = useSiteMetadata();

  if (navLinks.length === 0) {
    navLinks = [
      {
        content: 'Projects',
        external: false,
        href: '/app/projects',
        title: `${siteMetadata.title} projects`,
        requiresAuthentication: false,
        link: true,
      },
      {
        content: 'Login',
        external: false,
        href: '/signin',
        title: `${siteMetadata.title} login`,
        requiresAuthentication: false,
        button: true,
      },
      {
        content: 'Projects',
        external: false,
        href: '/app/projects',
        title: `${siteMetadata.title} projects`,
        requiresAuthentication: true,
        link: true,
      },
      {
        // TODO: Update href once ricky PR #70 merged
        content: 'Start Project',
        external: false,
        href: '/app/projects',
        title: `${siteMetadata.title} start project`,
        requiresAuthentication: true,
        button: true,
      },
    ];
  }

  return (
    <React.Fragment>
      <Seo title="Home" />

      <ThemeProvider theme={theme}>
        <React.Fragment>
          <Navigation navLinks={navLinks} />
          {children}
          <Footer />
        </React.Fragment>
      </ThemeProvider>

      <GlobalStyle />
    </React.Fragment>
  );
};

export default Layout;
