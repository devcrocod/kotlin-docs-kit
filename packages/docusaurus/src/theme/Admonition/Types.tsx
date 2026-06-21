import React, { type ComponentType, type ReactNode } from 'react';
import DefaultAdmonitionTypes from '@theme-init/Admonition/Types';
import AdmonitionLayout from '@theme/Admonition/Layout';
import { CalloutIcon } from '../components/Callout/icons';
import type { CalloutType } from '../components/Callout';

/**
 * Register the kit's seven extra admonition keywords as real admonition types
 * so `:::deprecated`, `:::experimental`, etc. render with the correct
 * `theme-admonition-<type>` host class (which custom.css re-skins) and the kit's
 * Callout icon — instead of falling back to the Info component.
 *
 * This also corrects the upstream legacy aliases: theme-classic maps
 * `:::success` → Tip and `:::important` → Info, so those would otherwise carry
 * `theme-admonition-tip` / `-info` and miss the kit's palette. We override them.
 *
 * Uses `@theme-init/Admonition/Types` (not `@theme-original`) to read the
 * pre-kit defaults without recursing into this swizzle.
 */
interface AdmonitionProps {
  type?: string;
  icon?: ReactNode;
  title?: ReactNode;
  className?: string;
  /** Anchor id; forwarded to AdmonitionLayout for heading/anchor links. */
  id?: string;
  children?: ReactNode;
}

function kitAdmonitionType(
  type: CalloutType,
  defaultTitle: string,
): ComponentType<AdmonitionProps> {
  return function KitAdmonitionType(props: AdmonitionProps): React.ReactElement {
    return (
      <AdmonitionLayout
        {...props}
        type={type}
        icon={props.icon ?? <CalloutIcon type={type} />}
        title={props.title ?? defaultTitle}
      >
        {props.children}
      </AdmonitionLayout>
    );
  };
}

const kitAdmonitionTypes = {
  success: kitAdmonitionType('success', 'Success'),
  caution: kitAdmonitionType('caution', 'Caution'),
  important: kitAdmonitionType('important', 'Important'),
  quote: kitAdmonitionType('quote', 'Quote'),
  example: kitAdmonitionType('example', 'Example'),
  deprecated: kitAdmonitionType('deprecated', 'Deprecated'),
  experimental: kitAdmonitionType('experimental', 'Experimental'),
};

export default {
  ...DefaultAdmonitionTypes,
  ...kitAdmonitionTypes,
};
