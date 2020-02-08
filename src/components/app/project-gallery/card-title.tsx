import React, { FC } from 'react';
import styled from 'styled-components';

import { slackIcon, discordIcon } from '@images';
import { noop } from '@utils';

type CardTitleProps = {
  name: string;
  communicationPlatformUrl?: string;
  clickable?: boolean;
};

type IconProps = {
  clickable?: boolean;
};

type CommunicationPlatform = {
  name: string;
  icon: string;
};

const communicationPlatforms: CommunicationPlatform[] = [
  {
    name: 'slack',
    icon: slackIcon,
  },
  {
    name: 'discord',
    icon: discordIcon,
  },
];

const Wrapper = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  margin: 0.2em 0 0.8em;
`;

const Icon = styled.img.attrs(() => ({
  alt: '',
}))<IconProps>`
  filter: grayscale(100%);
  margin: 0 0 -0.06em;
  position: relative;
  left: 0.35em;
  height: 0.9em;
  user-select: none;
  transition: filter 0.2s ease-out;

  @media (hover: hover) {
    &:hover {
      filter: ${({ clickable = false }) =>
        clickable ? 'grayscale(0%)' : 'grayscale(100%)'};
      cursor: ${({ clickable = false }) => (clickable ? 'pointer' : 'default')};
    }
  }
`;

const CardTitle: FC<CardTitleProps> = ({
  name,
  communicationPlatformUrl,
  clickable = false,
}) => {
  const handleClick = () => {
    window.open(communicationPlatformUrl, '_blank');
  };

  return (
    <Wrapper>
      {name}{' '}
      {communicationPlatformUrl ? (
        <span>
          <Icon
            src={
              communicationPlatforms.find(({ name }) =>
                communicationPlatformUrl.includes(name),
              )?.icon
            }
            onClick={clickable ? handleClick : noop}
          />
        </span>
      ) : null}
    </Wrapper>
  );
};

export default CardTitle;
