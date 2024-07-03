const styles = [
  {
    elementType: 'geometry',
    stylers: [
      { color: '#ebe3cd' }  // Light yellowish color for map background
    ]
  },
  {
    elementType: 'labels.icon',
    stylers: [
      { visibility: 'off' }  // Hide all icons
    ]
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      { color: '#523735' }  // Dark brown text color
    ]
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      { color: '#f5f1e6' }  // Light beige text stroke
    ]
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [
      { color: '#c9b2a6' }  // Light brown borders for administrative areas
    ]
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [
      { color: '#8b716a' }  // Light brown text color for country labels
    ]
  },
  {
    featureType: 'administrative.province',
    elementType: 'geometry.stroke',
    stylers: [
      { color: '#9e8f7f' }  // Light grayish brown borders for provinces
    ]
  },
  {
    featureType: 'landscape',
    elementType: 'geometry.fill',
    stylers: [
      { color: '#e1d9c9' }  // Light beige color for landscape
    ]
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      { color: '#dfd2ae' }  // Light yellowish color for Points of Interest
    ]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      { color: '#93817c' }  // Dark grayish brown text color for POI labels
    ]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [
      { color: '#a5b076' }  // Light green color for parks
    ]
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [
      { color: '#f5f1e6' }  // Light beige color for roads
    ]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [
      { color: '#e5d7c9' }  // Light brownish beige color for road borders
    ]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      { color: '#805b3e' }  // Dark brownish beige text color for road labels
    ]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [
      { color: '#f8c967' }  // Light orange color for highways
    ]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      { color: '#e9bc62' }  // Light yellowish brown color for highway borders
    ]
  },
  {
    featureType: 'transit',
    elementType: 'geometry.fill',
    stylers: [
      { color: '#f3d3a7' }  // Light peach color for transit routes
    ]
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [
      { color: '#8a7c77' }  // Dark grayish brown text color for transit stations
    ]
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [
      { color: '#b9d3c2' }  // Light bluish green color for water bodies
    ]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      { color: '#92998d' }  // Dark grayish green text color for water labels
    ]
  }
];

export default styles;
