import React from 'react';
import './style.css';
import * as d3 from 'd3';
import * as topojson from 'topojson';

const Map = () => {
  // Set dimensions of the map
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Use useRef hook to get a reference to the map container
  const mapContainer = React.useRef(null);

  React.useEffect(() => {
    // Load the TopoJSON data
    d3.json('https://cdn.jsdelivr.net/npm/taiwan-atlas/counties-10t.json').then(
      (topoData) => {
        // Create a projection
        const projection = d3
          .geoMercator() // 麥卡托投影法
          .center([121, 24]) // 中心點(經緯度)
          .scale(6000) // 放大倍率
          .translate([width / 2, height / 2.5]); // 置中

        // Create a path generator
        const pathGenerator = d3.geoPath().projection(projection);

        // Convert TopoJSON to GeoJSON (target object = 'countries')
        const geoJson = topojson.feature(topoData, topoData.objects.counties);

        let previous = null;

        // Bind data and create one path per GeoJSON feature
        d3.select(mapContainer.current)
          .selectAll('path')
          .data(geoJson.features)
          .enter()
          .append('path')
          .attr('d', pathGenerator)
          .style('fill', (d) => {
            // Set fill color for specific counties
            if (
              d.properties.COUNTYNAME === '台北市' ||
              d.properties.COUNTYNAME === '新北市'
            ) {
              return 'red';
            }
            // Set default fill color for other counties
            return '#ccc';
          })
          .style('stroke', '#fff')
          .style('stroke-width', '1')
          .on('click', function (event, data) {
            if (previous) {
              d3.select(previous).style('fill', '#ccc');
            }
            d3.select(this).style('fill', '#ff1a75');
            previous = this;
          });
      }
    );
  }, []);

  return (
    <svg
      ref={mapContainer}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default function App() {
  return (
    <div>
      <Map />
    </div>
  );
}
