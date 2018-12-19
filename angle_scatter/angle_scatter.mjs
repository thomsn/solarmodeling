export function create_angle_scatter(d3, svg, data) {

    let chart_height = 700;
    let chart_width = 1460;
    let boundry = 40;
    let circle_size = 2;
    let cirlce_opacity = 0.3;

    let max_value = d3.max(data, function(d) { return parseFloat(d.power); });

    let max_angle = d3.max(data, function (d) { return parseFloat(d.altitude); });

    let min_angle = d3.min(data, function (d) { return parseFloat(d.altitude)});

    var x_range = d3.scaleLinear()
        .domain([min_angle, max_angle])
        .range([2 * boundry, chart_width + boundry - circle_size]);

    var y_range = d3.scaleLinear()
        .domain([0, max_value])
        .range([chart_height, 2 * boundry]);

    var azimuth_scale = d3.scaleLinear()
        .domain([-1.0, 0.0, 1.0])
        .range(['#3D88FF', 'white', '#FF8A3D']);

    function calc_color(azimuth) {
        return azimuth_scale(-Math.sin(parseFloat(azimuth) * Math.PI / 180))
    }

    var tooltip_text = svg.select(".tooltip_text");

    svg.select('rect')
        .attr('height', chart_height + 24)
        .attr('width', chart_width + boundry)
        .attr('x', 0)
        .attr('y', boundry);

    svg.attr("width", chart_width + boundry)
        .attr("height", chart_height + boundry * 2);

    svg.selectAll('g').data(data).enter().append('g').append('circle')
        .attr('r', circle_size)
        .attr('cy', function (data) {
            return y_range(parseFloat(data.power));
        })
        .attr('cx', function (data) {
            return x_range(parseFloat(data.altitude));
        }).attr('fill', function (data) {return calc_color(data.azimuth);})
        .style('opacity', cirlce_opacity)
        .on("mouseover", function(d) {
            var dot = d3.select(this);
            dot.attr('r', 8);
            tooltip_text.text('Sun Altitude/Azimuth ' + Math.floor(d.altitude) +'°/' + Math.floor(d.azimuth) + '° Power '+ parseInt(d.power) + ' MW');
            tooltip_text.transition().duration(200).style('opacity', 1.0);
        })
        .on("mouseout", function(d) {
            var dot = d3.select(this);
            dot.style('fill', calc_color(d.azimuth)).style('opacity', cirlce_opacity);
            dot.attr('r', circle_size);
            tooltip_text.transition()
                .duration(500)
                .style("opacity", 0);

        });

    let min_deca = Math.ceil(min_angle / 10) * 10;
    let num_ticks = Math.floor((max_angle - min_deca)/10);
    [...Array(num_ticks).keys()].forEach(d => {
        svg.append('text')
            .attr('x', x_range(Math.floor(10 * d + min_deca)))
            .attr('y', boundry + chart_height + 5)
            .attr('text-anchor','center')
            .attr('fill', 'azure')
            .text( Math.floor(10 * d + min_deca) + '°');
    });

    [...Array(10).keys()].forEach(d => {
        svg.append('text')
            .attr('x', 0)
            .attr('y', y_range(Math.round((d/10)*max_value/100)*100))
            .attr('text-anchor','center')
            .attr('fill', 'azure')
            .text(Math.round((d/10)*max_value/100)*100 + ' MW');
    });
}
