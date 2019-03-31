import * as React from 'react';
import Img, { GatsbyImageProps } from 'gatsby-image';

import styled from '@styled-components';

interface OwnProps {
  small?: boolean;
}

type AvatarProps = OwnProps & GatsbyImageProps;

const Image = styled(Img).attrs({ small: false })<AvatarProps>`
  min-height: 4em;
  max-height: 4em;
  min-width: 4em;
  max-width: 4em;
  border-radius: 50%;
  margin-right: 1.6em;
`;

const Avatar: React.FC<AvatarProps> = (avatarProps) => (
  <Image {...avatarProps} />
);

export default Avatar;
