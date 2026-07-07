/**
 * Ejected from @docusaurus/theme-classic DocSidebarItem/Category (MIT) to
 * inject the kit's section icons: categories opt in via
 * `customProps: { icon: '<name>' }` in sidebars.ts, rendered with KtIcon
 * before the label. Everything else follows the upstream implementation
 * (pinned peer range ^3.5.0); the upstream CSS module is replaced by plain
 * kit classes styled in docusaurus-overrides.css.
 *
 * Fallback if this ever proves brittle across Docusaurus minors:
 * `className`-based icons (sidebars.ts className + CSS mask-image data URIs)
 * — see the preset README.
 */
import React, { useEffect, useMemo, type ReactNode } from 'react';
import clsx from 'clsx';
import {
  ThemeClassNames,
  useThemeConfig,
  usePrevious,
  Collapsible,
  useCollapsible,
} from '@docusaurus/theme-common';
import {
  isActiveSidebarItem,
  findFirstSidebarItemLink,
  useDocSidebarItemsExpandedState,
  useVisibleSidebarItems,
} from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import useIsBrowser from '@docusaurus/useIsBrowser';
import DocSidebarItems from '@theme/DocSidebarItems';
import DocSidebarItemLink from '@theme/DocSidebarItem/Link';
import type { Props } from '@theme/DocSidebarItem/Category';
import type { PropSidebarItemCategory, PropSidebarItemLink } from '@docusaurus/plugin-content-docs';
import KtIcon from '../../Icon';

// Ported from @docusaurus/theme-common/internal (exports-map subpath that
// node10 module resolution can't type-check): trailing-slash-insensitive
// path equality.
function isSamePath(path1: string | undefined, path2: string | undefined): boolean {
  const normalize = (pathname: string | undefined) =>
    !pathname || pathname.endsWith('/') ? pathname : `${pathname}/`;
  return normalize(path1) === normalize(path2);
}

// If we navigate to a category and it becomes active, it should automatically
// expand itself
function useAutoExpandActiveCategory({
  isActive,
  collapsed,
  updateCollapsed,
  activePath,
}: {
  isActive: boolean;
  collapsed: boolean;
  updateCollapsed: (b: boolean) => void;
  activePath: string;
}) {
  const wasActive = usePrevious(isActive);
  const previousActivePath = usePrevious(activePath);
  useEffect(() => {
    const justBecameActive = isActive && !wasActive;
    const stillActiveButPathChanged = isActive && wasActive && activePath !== previousActivePath;
    if ((justBecameActive || stillActiveButPathChanged) && collapsed) {
      updateCollapsed(false);
    }
  }, [isActive, wasActive, collapsed, updateCollapsed, activePath, previousActivePath]);
}

/**
 * When a collapsible category has no link, we still link it to its first child
 * during SSR as a temporary fallback, so keyboard/no-JS navigation works.
 */
function useCategoryHrefWithSSRFallback(item: PropSidebarItemCategory): string | undefined {
  const isBrowser = useIsBrowser();
  return useMemo(() => {
    if (item.href && !item.linkUnlisted) {
      return item.href;
    }
    if (isBrowser || !item.collapsible) {
      return undefined;
    }
    return findFirstSidebarItemLink(item);
  }, [item, isBrowser]);
}

function CollapseButton({
  collapsed,
  categoryLabel,
  onClick,
}: {
  collapsed: boolean;
  categoryLabel: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      aria-label={
        collapsed
          ? translate(
              {
                id: 'theme.DocSidebarItem.expandCategoryAriaLabel',
                message: "Expand sidebar category '{label}'",
                description: 'The ARIA label to expand the sidebar category',
              },
              { label: categoryLabel },
            )
          : translate(
              {
                id: 'theme.DocSidebarItem.collapseCategoryAriaLabel',
                message: "Collapse sidebar category '{label}'",
                description: 'The ARIA label to collapse the sidebar category',
              },
              { label: categoryLabel },
            )
      }
      aria-expanded={!collapsed}
      type="button"
      className="clean-btn menu__caret"
      onClick={onClick}
    />
  );
}

function categoryIconName(item: PropSidebarItemCategory): string | undefined {
  const icon = item.customProps?.icon;
  return typeof icon === 'string' ? icon : undefined;
}

function CategoryLinkLabel({ label }: { label: string }): ReactNode {
  return (
    <span title={label} className="kt-sidenav__cat-label">
      {label}
    </span>
  );
}

export default function DocSidebarItemCategory(props: Props): ReactNode {
  const visibleChildren = useVisibleSidebarItems(props.item.items, props.activePath);
  if (visibleChildren.length === 0) {
    return <DocSidebarItemCategoryEmpty {...props} />;
  } else {
    return <DocSidebarItemCategoryCollapsible {...props} />;
  }
}

function isCategoryWithHref(
  category: PropSidebarItemCategory,
): category is PropSidebarItemCategory & { href: string } {
  return typeof category.href === 'string';
}

// If a category doesn't have any visible children, we render it as a link
function DocSidebarItemCategoryEmpty({ item, ...props }: Props): ReactNode {
  if (!isCategoryWithHref(item)) {
    return null;
  }
  const { type, collapsed, collapsible, items, linkUnlisted, ...forwardableProps } = item;
  void type;
  void collapsed;
  void collapsible;
  void items;
  void linkUnlisted;
  const linkItem = {
    type: 'link',
    ...forwardableProps,
  } as PropSidebarItemLink;
  return <DocSidebarItemLink item={linkItem} {...props} />;
}

function DocSidebarItemCategoryCollapsible({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}: Props): ReactNode {
  const { items, label, collapsible, className, href } = item;
  const {
    docs: {
      sidebar: { autoCollapseCategories },
    },
  } = useThemeConfig();
  const hrefWithSSRFallback = useCategoryHrefWithSSRFallback(item);
  const isActive = isActiveSidebarItem(item, activePath);
  const isCurrentPage = isSamePath(href, activePath);
  const { collapsed, setCollapsed } = useCollapsible({
    // Active categories are always initialized as expanded. The default
    // (`item.collapsed`) is only used for non-active categories.
    initialState: () => {
      if (!collapsible) {
        return false;
      }
      return isActive ? false : item.collapsed;
    },
  });
  const { expandedItem, setExpandedItem } = useDocSidebarItemsExpandedState();
  // Use this instead of `setCollapsed`, because it is also reactive
  const updateCollapsed = (toCollapsed: boolean = !collapsed) => {
    setExpandedItem(toCollapsed ? null : index);
    setCollapsed(toCollapsed);
  };
  useAutoExpandActiveCategory({ isActive, collapsed, updateCollapsed, activePath });
  useEffect(() => {
    if (collapsible && expandedItem != null && expandedItem !== index && autoCollapseCategories) {
      setCollapsed(true);
    }
  }, [collapsible, expandedItem, index, setCollapsed, autoCollapseCategories]);

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onItemClick?.(item);
    if (collapsible) {
      if (href) {
        // When already on the category's page we collapse it; when navigating
        // to a new category we always expand (upstream behavior).
        if (isCurrentPage) {
          e.preventDefault();
          updateCollapsed();
        } else {
          updateCollapsed(false);
        }
      } else {
        e.preventDefault();
        updateCollapsed();
      }
    }
  };

  const icon = categoryIconName(item);

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemCategory,
        ThemeClassNames.docs.docSidebarItemCategoryLevel(level),
        'menu__list-item',
        {
          'menu__list-item--collapsed': collapsed,
        },
        className,
      )}
    >
      <div
        className={clsx('menu__list-item-collapsible', {
          'menu__list-item-collapsible--active': isCurrentPage,
        })}
      >
        <Link
          className={clsx('menu__link', 'kt-sidenav__cat-link', {
            'menu__link--sublist': collapsible,
            'menu__link--sublist-caret': !href && collapsible,
            'menu__link--active': isActive,
          })}
          onClick={handleItemClick}
          aria-current={isCurrentPage ? 'page' : undefined}
          role={collapsible && !href ? 'button' : undefined}
          aria-expanded={collapsible && !href ? !collapsed : undefined}
          href={collapsible ? (hrefWithSSRFallback ?? '#') : hrefWithSSRFallback}
          {...props}
        >
          {icon && <KtIcon name={icon} className="kt-sidenav__sec-icon" size={16} />}
          <CategoryLinkLabel label={label} />
        </Link>
        {href && collapsible && (
          <CollapseButton
            collapsed={collapsed}
            categoryLabel={label}
            onClick={(e) => {
              e.preventDefault();
              updateCollapsed();
            }}
          />
        )}
      </div>

      <Collapsible lazy as="ul" className="menu__list" collapsed={collapsed}>
        <DocSidebarItems
          items={items}
          tabIndex={collapsed ? -1 : 0}
          onItemClick={onItemClick}
          activePath={activePath}
          level={level + 1}
        />
      </Collapsible>
    </li>
  );
}
