import * as React from 'react';

import Navigation, { NavigationLink } from './navigation';
import Footer from './footer';
import { Seo } from '@components/shared';
import { useSiteMetadata } from '@hooks';
import { ThemeProvider } from '@styled-components';
import { GlobalStyle, theme } from '@styles';
import profileImg from '../../images/default.png';

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
        content: 'Log In',
        external: false,
        href: '/login',
        title: `${siteMetadata.title} Log In`,
        requiresAuthentication: false,
        button: true,
      },
      {
        content: 'Start Project',
        external: false,
        href: '/projects',
        title: `${siteMetadata.title} start project`,
        requiresAuthentication: true,
        button: true,
      },
      {
        content: profileImg,
        external: false,
        href: '/blog',
        title: `${siteMetadata.title} blog`,
        requiresAuthentication: true,
        profileIcon: true,
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
