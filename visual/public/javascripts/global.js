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
            lineColor: 'black',
            lineWidth: 2,
            crossing:0,
            opposite:true,
            tickLength : 2,
            labels:
            {
              enabled: false
            }
        },
        yAxis: {
            tickPixelInterval: 15,
            allowDecimals: false,
            gridLineWidth: 0,
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

        plotOptions: {
            scatter: {
                marker: {
                    radius: 11,
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
            color: 'rgba(223, 83, 83, 0.5)',
            data: [[100, -0.25],[100, -0.5],[100, -.75],[100, -1.0],[200, -0.25],[200, -0.50],[200, -0.75]]

        }, {
            name: 'Positive',
            color: 'rgba(80, 180, 80, 0.5)',
            data: [[100, 0.25],[100, .50],[100, .75],[200,0.25],[200,0.5]]
        }]
    });
});
