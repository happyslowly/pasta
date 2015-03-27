var offset = 10;
var chart;
var keep = 1 * 10 * 1000;


window.setInterval(getTweets, 10000);

function getTweets() {
    $.get("/tweets?offset=" + offset, function(data) {
      var posSeries = new Array();
      var negSeries = new Array();

      var step = .25;
      var posLastTs, negLastTs, posY, negY

      $.each(data, function(index, value) {
        //console.log(value);

        if (value['sentiment'] == 'pos') {
          if (posLastTs != value['plot_ts']) {
            posY = step;
          } else {
            posY += step;
          }

          posLastTs = value['plot_ts'];

          var point = {
            x: value['plot_ts'],
            y: posY,
            ts: value['created_ts'],
            text: value['content']
          };
          posSeries.push(point);
        }

        if (value['sentiment'] == 'neg') {
          if (negLastTs != value['plot_ts']) {
            negY = -1 * step;
          } else {
            negY -= step;
          }

          negLastTs = value['plot_ts'];

          var point = {
            x: value['plot_ts'],
            y: negY,
            ts: value['created_ts'],
            text: value['content']
          };
          negSeries.push(point);
        }
      });

      chart.series[0].setData(negSeries);
      chart.series[1].setData(posSeries);

      //console.log(negSeries);

      chart.redraw();

    });
}

$(function () {

    getTweets();

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
            reversed: true,
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
                    if(this.value == 1)
                        return 'Positive';
                    if(this.value == -1)
                        return 'Negative';
                }
            },
            title: {
                text: 'Sentiment'
            },
            min: -2,
            max: 2
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
              pointStart: Date.UTC(new Date().getTime()),
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
