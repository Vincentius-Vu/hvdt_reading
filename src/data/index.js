import { macroNodes, macroLinks } from './macroArchitecture.js';
import { microNodes, microLinks } from './microClusters.js';
import { pressureNodes, pressureLinks } from './pressures.js';

export const ecosystemData = {
  nodes: [...macroNodes, ...microNodes, ...pressureNodes],
  links: [...macroLinks, ...microLinks, ...pressureLinks]
};
