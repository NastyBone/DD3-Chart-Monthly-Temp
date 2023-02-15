//BLOQUE CERO: RESOURCES
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

const padd = 20;
const h = 300 - padd;
const w = 720 - padd;
const l = 300;
var dataYear = [];
var dataTempe = [];
var colors = ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"];


//BLOQUE UNO: WORKSPACE

d3.select('body').
append('div').
attr('id', 'description');

d3.select('#description').
append('h2').
text('Monthly Global Land-Surface Temperature').
attr('id', 'title');


//BLOQUE DOS: DATA REQUEST

var request = new XMLHttpRequest();
request.open('GET', url, true);
request.send();
request.onload = function () {
  var json = JSON.parse(request.responseText);

  //BLOQUE 2.5: MAPPING & GETTING DATA
  json['monthlyVariance'].map((obj, i) => {
    dataYear[i] = obj.year;
    dataTempe[i] = obj.variance;


  });

  d3.select('#description').
  append('h5').
  text('1753 - 2015: base temperature: ' + json.baseTemperature + 'C');


  const minTemp = json.baseTemperature + Math.min(...dataTempe);
  const maxTemp = json.baseTemperature + Math.max(...dataTempe);

  //BLOQUE TRES: TOOLTIP

  var tooltip = d3.select('#description').
  append('div').
  attr('id', 'tooltip');

  //BLOQUE CUATRO: CANVAS & SVG

  var svg = d3.select('#description').
  append('svg').
  attr('class', 'canvas');


  //BLOQUE CINCO: LEGEND
  var legend = d3.select('#description').
  append('svg').
  attr('id', 'legend');



  //BLOQUE CINCO: AXES & SCALES

  const yScale = d3.scaleBand().
  domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).
  range([0, h]);



  const xScale = d3.scaleBand().
  domain(dataYear).
  range([0, w - padd * 3]);





  var yAxis = d3.axisLeft(yScale).tickFormat(month => {
    var date = new Date(0);
    date.setUTCMonth(month + 1);
    return d3.timeFormat('%B')(date);});




  var xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d')).
  tickValues(xScale.domain().filter(value => value % 10 == 0));



  svg.append('g').
  attr('transform', `translate(${padd * 3},${h})`).
  call(xAxis).
  attr('id', 'x-axis');

  svg.append('g').
  attr('transform', `translate(${padd * 3},0)`).
  call(yAxis).
  attr('id', 'y-axis');

  const colorScale = d3.scaleThreshold().
  domain(function (min, max, count) {
    var arr = [];
    var step = (max - min) / count;
    var base = min;

    for (let i = 1; i < count; i++) {
      arr.push(base + step * i);
    }
    return arr;
  }(minTemp, maxTemp, colors.length)).
  range(colors.reverse());


  const colorXScale = d3.scaleLinear().
  domain([minTemp, maxTemp]).
  range([0, l]);


  const colorAxis = d3.axisBottom(colorXScale).
  tickValues(colorScale.domain()).
  tickFormat(d3.format('.1f'));


  legend.selectAll('#legend').
  data(colorScale.range().map(color => {
    var d = colorScale.invertExtent(color);
    if (d[0] == null) d[0] = colorXScale.domain()[0];
    if (d[1] == null) d[1] = colorXScale.domain()[1];
    return d;
  })).
  enter().
  append('rect').
  attr('y', 0).
  attr('x', d => colorXScale(d[0])).
  style('fill', d => colorScale(d[0])).
  attr('height', 35).
  attr('width', d => colorXScale(d[1]) - colorXScale(d[0])).
  attr('value', d => d);


  legend.append('g').
  attr('transform', 'translate(0,0)').
  call(colorAxis);



  // BLOQUE SEIS: DATA VSUALIZATION

  svg.append('g').
  selectAll('rect').
  data(json.monthlyVariance).
  enter().
  append('rect').
  attr('class', 'cell').
  attr('x', d => xScale(d.year) + padd * 3).
  attr('y', d => yScale(d.month - 1)).
  attr('height', d => yScale.bandwidth()).
  attr('width', d => xScale.bandwidth()).
  attr('fill', d => colorScale(json.baseTemperature + d.variance)).
  attr('data-month', d => d.month - 1).
  attr('data-year', d => d.year).
  attr('data-temp', d => d.variance).
  on('mouseover', (d, i) => {
    tooltip.transition().
    duration(200).
    style('opacity', 0.8);

    tooltip.style('left', d3.event.pageX + 'px').
    style('top', d3.event.pageY + 'px');
    tooltip.attr('data-year', d.year);
    var date = new Date(0, d.month);

    tooltip.html(`
Year: ${d.year} - Month: ${date.getUTCMonth()}<br/></br>
Temperature: ${d.variance + json.baseTemperature}<br/>
Variance: ${d.variance}
`);}).

  on('mouseleave', () => {
    tooltip.transition().
    duration(200).
    style('opacity', 0).
    style('left', 0).
    style('top', 0);


  });



  //BLOQUE INFINITO: TEST AREA


};


/*

ESTO SIRVE PARA LA PARTE DE PRESENTACION DE DATOS
const colorScale = d3.scaleQuantize()
          .domain(d3.extent(dataTempe))
      .range(['red','orange','yellow','green','cyan','blue']);

 const colorXScale = d3.scaleBand()
        .domain(dataTempe.map(d  => d))
        .range([0,l])
        
        
 legend.selectAll('#legend')
      .data(dataTempe)
      .enter()
      .append('rect')
      .attr('y', 0)
      .attr('x', (d)=> colorXScale(d))
      .attr('fill',(d)=> colorScale(d))
      .attr('height',35)
      .attr('width', d=>  colorXScale.bandwidth())
      .attr('value',(d)=>d)
*/