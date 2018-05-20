import * as React from 'react';

import { preferenceStore } from '../../store';
import { properties } from '../../utils/translations';
import css from './CourseList.scss';

let tooltipTimeout;
const tooltip = document.createElement('div');
tooltip.classList.add(css.tooltip);
document.body.appendChild(tooltip);

const showTooltip = (element: EventTarget, property: string) => {
  if (element instanceof HTMLElement) {
    const rect = element.getBoundingClientRect();
    const prop = properties.find(p => p.key === property);
    if (prop) {
      tooltipTimeout = setTimeout(() => {
        tooltip.innerHTML = prop['name_' + preferenceStore.lang];
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = rect.top + window.scrollY + 20 + 'px';
        tooltip.classList.add(css.tooltipVisible);

        const tooltipRect = tooltip.getBoundingClientRect();
        if (tooltipRect.left + tooltipRect.width > window.innerWidth) {
          tooltip.style.left =
            window.innerWidth - tooltipRect.width - 10 + 'px';
        }
      }, 150);
    }
  }
};

const hideTooltip = () => {
  clearTimeout(tooltipTimeout);
  tooltip.classList.remove(css.tooltipVisible);
};

export default ({ property }) => (
  <span
    onMouseOver={e => showTooltip(e.target, property)}
    onMouseOut={hideTooltip}
  >
    {property}
    <span
      className={css.propertyClickTrap}
      onClick={() => preferenceStore.toggleProperty(property)}
    />
  </span>
);
