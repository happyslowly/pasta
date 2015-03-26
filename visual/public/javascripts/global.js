$(function () {
    var chart;

    $.get("/tweets", function(data) {
      var posSeries = new Array();
      var negSeries = new Array();
      var step = .25;

      console.log(data);

      $.each(data, function(index, value) {
        if (value['sentimental'] == 'pos') {
          var point = {
            y: step,
            text: value['content']
          };
          posSeries.push(point);
        }
        if (value['sentimental'] == 'pos') {
          negSeries.push([value['created_ts'], step]);
        }
      });

      //chart.series[0].setData(negSeries);
      chart.series[1].setData(posSeries);

    });


    $(document).ready(function() {
      chart = new Highcharts.Chart({
        chart: {
            renderTo: 'chart',
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
                    pointFormat: '{point.text}'
                }
            }
        },
        series: [{
            name: 'Negative',
            color: 'rgba(223, 83, 83, 0.5)',
            data: []

        }, {
            name: 'Positive',
            color: 'rgba(80, 180, 80, 0.5)',
            data: []
        }]
    });
  });

});
