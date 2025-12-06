'use client';

import React from 'react';
import Link from 'next/link';
import { useSoundEffects, SoundEffect } from '@/contexts/SoundEffectsContext';

interface SoundButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  clickSound?: SoundEffect;
  hoverSound?: SoundEffect;
  children: React.ReactNode;
}

export function SoundButton({
  clickSound = 'buttonClick',
  hoverSound = 'buttonHover',
  onClick,
  onMouseEnter,
  children,
  ...props
}: SoundButtonProps) {
  const { playSound } = useSoundEffects();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playSound(clickSound);
    onClick?.(e);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    playSound(hoverSound);
    onMouseEnter?.(e);
  };

  return (
    <button onClick={handleClick} onMouseEnter={handleMouseEnter} {...props}>
      {children}
    </button>
  );
}

interface SoundLinkProps extends Omit<React.ComponentProps<typeof Link>, 'onClick'> {
  clickSound?: SoundEffect;
  hoverSound?: SoundEffect;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function SoundLink({
  clickSound = 'buttonClick',
  hoverSound = 'buttonHover',
  onClick,
  children,
  ...props
}: SoundLinkProps) {
  const { playSound } = useSoundEffects();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    playSound(clickSound);
    onClick?.(e);
  };

  const handleMouseEnter = () => {
    playSound(hoverSound);
  };

  return (
    <Link onClick={handleClick} onMouseEnter={handleMouseEnter} {...props}>
      {children}
    </Link>
  );
}

// Higher-order component to add sounds to any component
export function withSounds<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  clickSound: SoundEffect = 'buttonClick',
  hoverSound: SoundEffect = 'buttonHover'
) {
  return function SoundWrappedComponent(props: P & { onClick?: () => void; onMouseEnter?: () => void }) {
    const { playSound } = useSoundEffects();

    const handleClick = () => {
      playSound(clickSound);
      props.onClick?.();
    };

    const handleMouseEnter = () => {
      playSound(hoverSound);
      props.onMouseEnter?.();
    };

    return <WrappedComponent {...props} onClick={handleClick} onMouseEnter={handleMouseEnter} />;
  };
}

export default SoundButton;
