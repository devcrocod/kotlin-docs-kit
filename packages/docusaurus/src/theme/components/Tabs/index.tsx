/*
 * Re-export Docusaurus' built-in <Tabs> for symmetry with the rest of the
 * components/ surface. The kt-tabs visual contract is satisfied by the CSS
 * re-skin of `.tabs / .tabs__item` in docusaurus-overrides.css — no DOM
 * changes required.
 */
import Tabs from '@theme/Tabs';
export default Tabs;
