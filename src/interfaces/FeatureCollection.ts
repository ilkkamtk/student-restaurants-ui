import { Point } from 'geojson';
import { Restaurant } from './Restaurant';

interface FeatureCollection {
  type: 'FeatureCollection';
  features: Feature[];
}

interface Feature {
  type: 'Feature';
  geometry: Point;
  properties: {
    restaurant: Restaurant;
  };
}

export type { FeatureCollection, Feature };
