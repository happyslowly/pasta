$(function () {
    var chart;

    $.get("/tweets", function(data) {
      var posSeries = new Array();
      var negSeries = new Array();
      var step = .25;
      var lastTs, posY;

      $.each(data, function(index, value) {
        if (value['sentimental'] == 'pos') {
          if (lastTs != value['plot_ts']) {
            posY = step;
          } else {
            posY += step;
          }

          lastTs = value['plot_ts'];

          var point = {
            x: value['plot_ts'],
            y: posY,
            ts: value['created_ts'],
            text: value['content']
          };
          posSeries.push(point);
        }
        if (value['sentimental'] == 'pos') {
          negSeries.push([value['plot_ts'], step]);
        }
      });

      console.log(posSeries);

      //chart.series[0].setData(negSeries);
      chart.series[1].setData(posSeries);

    });


    $(document).ready(function() {
      chart = new Highcharts.Chart({
        chart: {
            renderTo: 'chart',
            type: 'scatter',
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
            type: 'datetime',
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
                    if(this.value == 10)
                        return 'Positive';
                    if(this.value == -10)
                        return 'Negative';
                }
            },
            title: {
                text: 'Sentiment'
            }
        },

        plotOptions: {
            scatter: {
                marker: {
                    radius: 10,
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
                    pointFormat: '{point.ts} {point.text}'
                }
            },
            series: {
              //pointStart: Date.UTC(2015, 2, 26),
              pointInterval: 1000
            }

        },
        series: [{
            name: 'Negative',
            color: 'rgba(223, 83, 83, 0.5)',
            data: [],
            marker: { symbol: 'circle'}

        }, {
            name: 'Positive',
            color: 'rgba(80, 180, 80, 0.5)',
            data: [],
            marker: { symbol: 'circle'}
        }]
    });
  });

});
