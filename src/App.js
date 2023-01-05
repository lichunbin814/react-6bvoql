import React from 'react';
import './style.css';
import * as d3 from 'd3';
import * as topojson from 'topojson';

const Map = () => {
  // Set dimensions of the map
  const width = 960;
  const height = 500;

  // Use useRef hook to get a reference to the map container
  const mapContainer = React.useRef(null);

  React.useEffect(() => {
    // Load the TopoJSON data
    d3.json('https://cdn.jsdelivr.net/npm/taiwan-atlas/counties-10t.json').then(
      (topoData) => {
        // Create a projection
        const projection = d3
          .geoMercator()
          .center([123, 24])
          .scale(5500)
          .translate([width / 2, height / 2])
          .precision(0.1);

        // Create a path generator
        const pathGenerator = d3.geoPath().projection(projection);

        // Convert TopoJSON to GeoJSON (target object = 'countries')
        const geoJson = topojson.feature(topoData, topoData.objects.counties);

        // Bind data and create one path per GeoJSON feature
        d3.select(mapContainer.current)
          .selectAll('path')
          .data(geoJson.features)
          .enter()
          .append('path')
          .attr('d', pathGenerator)
          .style('fill', '#ccc')
          .style('stroke', '#fff')
          .style('stroke-width', '1');
      }
    );
  }, []);

  return <svg ref={mapContainer} width={width} height={height} />;
};

export default function App() {
  return (
    <div>
      <Map />
    </div>
  );
}
