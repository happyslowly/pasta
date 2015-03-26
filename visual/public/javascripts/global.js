$(function () {
    $('#chart').highcharts({
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: 'PayPal Sentiments'
        },
        subtitle: {
            text: 'Source: Real time twitter feed'
        },
        xAxis: {
            crossing:0,
            opposite:true,
            tickLength : 0,
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                day: '%e. %b',
                hour: '%b'
            },
            title: {
                text: 'Date'
            }
        },
        yAxis: {
            allowDecimals: false,
            labels: {
                formatter: function () {
                    if(this.value == 1)
                        return 'Positive';
                    if(this.value == -1)
                        return 'Negative';
                }
            },
            title: {
                text: 'Sentiment)'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
            borderWidth: 2
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 7,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.x} cm, {point.y} kg'
                }
            }
        },
        series: [{
            name: 'Negative',
            color: 'rgba(223, 83, 83, 0.7)',
            data: [[100, -0.25],[100, -0.5],[100, -.75],[100, -1.0],[200, -0.25],[200, -0.50],[200, -0.75]]

        }, {
            name: 'Positive',
            color: 'rgba(80, 180, 80, 0.7)',
            data: [[100, 0.25],[100, .50],[100, .75],[200,0.25],[200,0.5]]
        }]
    });
});
