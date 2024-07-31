const styles = [
  {
    elementType: 'geometry',
    // Light yellowish color for map background
    stylers: [
      { color: '#ebe3cd' },
    ],
  },
  {
    elementType: 'labels.icon',
    // Hide all icons
    stylers: [
      { visibility: 'off' },
    ],
  },
  {
    elementType: 'labels.text.fill',
    // Dark brown text color
    stylers: [
      { color: '#523735' },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    // Light beige text stroke
    stylers: [
      { color: '#f5f1e6' },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    // Light brown borders for administrative areas
    stylers: [
      { color: '#c9b2a6' },
    ],
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    // Light brown text color for country labels
    stylers: [
      { color: '#8b716a' },
    ],
  },
  {
    featureType: 'administrative.province',
    elementType: 'geometry.stroke',
    // Light grayish brown borders for provinces
    stylers: [
      { color: '#9e8f7f' },
    ],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry.fill',
    // Light beige color for landscape
    stylers: [
      { color: '#e1d9c9' },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    // Light yellowish color for Points of Interest
    stylers: [
      { color: '#dfd2ae' },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    // Dark grayish brown text color for POI labels
    stylers: [
      { color: '#93817c' },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    // Light green color for parks
    stylers: [
      { color: '#a5b076' },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    // Light beige color for roads
    stylers: [
      { color: '#f5f1e6' },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    // Light brownish beige color for road borders
    stylers: [
      { color: '#e5d7c9' },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    // Dark brownish beige text color for road labels
    stylers: [
      { color: '#805b3e' },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    // Light orange color for highways
    stylers: [
      { color: '#f8c967' },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    // Light yellowish brown color for highway borders
    stylers: [
      { color: '#e9bc62' },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'geometry.fill',
    // Light peach color for transit routes
    stylers: [
      { color: '#f3d3a7' },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    // Dark grayish brown text color for transit stations
    stylers: [
      { color: '#8a7c77' },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    // Light bluish green color for water bodies
    stylers: [
      { color: '#b9d3c2' },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    // Dark grayish green text color for water labels
    stylers: [
      { color: '#92998d' },
    ],
  },
];

export default styles;
