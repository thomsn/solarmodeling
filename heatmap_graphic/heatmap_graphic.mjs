export function create_histogram(d3, svg, data) {
    Number.prototype.pad = function(size) {
        var s = String(this);
        while (s.length < (size || 2)) {s = "0" + s;}
        return s;
    };

    let chart_height = 500;
    let chart_width = 1460;
    let boundry = 40;

    var x_range = d3.scaleLinear()
        .domain([0,data.length/24])
        .range([boundry, chart_width + boundry]);

    let max_value = d3.max(data, function(d) { return parseInt(d.IT_solar_generation); });
    var y_range = d3.scaleLinear()
        .domain([24, 0])
        .range([chart_height + boundry, boundry]);

    var contrast_scale = d3.scaleLinear()
        .domain([1, max_value])
        .range([0, 1.0]);

    svg.select('rect')
        .attr('height', chart_height + 24)
        .attr('width', chart_width + boundry)
        .attr('x', 0)
        .attr('y', boundry);

    svg.attr("width", chart_width + boundry)
        .attr("height", chart_height + boundry * 2);

    var tooltip_text = svg.select(".tooltip_text");

    var small_lines = svg.append('g');

    small_lines.selectAll("g")
        .data(data)
        .enter()
        .append('g')
        .append('line')
        .style('stroke-width', 1).style('stroke', '#ffffff')
        .attr('y1', function (data) {
            return y_range(parseInt(data.utc_timestamp.substr(11,2)));
        })
        .attr('y2', function (data) {
            return y_range(parseInt(data.utc_timestamp.substr(11,2))+1);
        })
        .attr('x1', function (data, i) {
            let col = Math.floor(i / 24);
            return x_range(col);
        })
        .attr('x2', function (data, i) {
            let col = Math.floor(i / 24);
            return x_range(col);
        })
        .attr('opacity', function (data) {return contrast_scale(parseInt(data.IT_solar_generation) + 1)});

    var line_hitboxes = svg.append('g');

    line_hitboxes.selectAll("g")
        .data(data)
        .enter()
        .append('line')
        .attr('y1', function (data) {
            return y_range(parseInt(data.utc_timestamp.substr(11,2)));
        })
        .attr('y2', function (data) {
            return y_range(parseInt(data.utc_timestamp.substr(11,2))+1);
        })
        .attr('x1', function (data, i) {
            let col = Math.floor(i / 24);
            return x_range(col);
        })
        .attr('x2', function (data, i) {
            let col = Math.floor(i / 24);
            return x_range(col);
        })
        .style('stroke-width', 4)
        .style('stroke', 'green')
        .attr('opacity', 0)
        .on("mouseover", function(d) {
            var line = d3.select(this);
            line.style('opacity', 1.0);
            tooltip_text.text(d.utc_timestamp +' '+ d.IT_solar_generation + ' MW');
            tooltip_text.transition().duration(200).style('opacity', 1.0);
        })
        .on("mouseout", function(d) {
            var line = d3.select(this);
            line.style('opacity', 0.0);
            tooltip_text.transition()
                .duration(500)
                .style("opacity", 0);

        });

    svg.append('text')
        .attr('x', chart_width-155)
        .attr('y', boundry + 16)
        .attr('text-anchor','right')
        .attr('fill', 'azure')
        .text('Italian Solar Production 2015');

    for (const x of Array(24).keys()) {
        svg.append('text')
            .attr('x', 4)
            .attr('y', y_range(x) + 16)
            .attr('text-anchor','left')
            .attr('fill', 'azure')
            .text(x.pad(2) + ':00');
    }

    ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'].map(function(element, index)
    {
        svg.append('text')
            .attr('x', 4 + (index + 0.5) * chart_width / 12)
            .attr('y', chart_height + boundry + 16)
            .attr('text-anchor','center').attr('fill', 'azure').text(element);
    });
}