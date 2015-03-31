var offset = 10;
var chart;
var keep = 1 * 10 * 1000;
var refreshRate = 5000;
var tzOffset = new Date().getTimezoneOffset() * 60 * 1000;

window.setInterval(getTweets, refreshRate);

function appendZero(number) {
  return ((number < 10) ? '0' : '') + number.toString();
}

function normalizeTimeStamp(unixTs) {
  var date = new Date(unixTs - tzOffset);
  return date.toDateString() + ' ' + 
    appendZero(date.getHours()) + ':' + 
    appendZero(date.getMinutes()) + ':' + 
    appendZero(date.getSeconds());
}

function getTweets() {
    $.get("/tweets?offset=" + offset, function(data) {
      var posSeries = new Array();
      var negSeries = new Array();

      var step = .25;
      var posLastTs, negLastTs, posY, negY

      $.each(data, function(index, value) {
        //console.log(value);

        if (value['sentiment'] == 'pos') {
          if (posLastTs != value['created_ts']) {
            posY = step;
          } else {
            posY += step;
          }

          posLastTs = value['created_ts'];

          var point = {
            x: value['created_ts'],
            y: posY,
            ts: normalizeTimeStamp(value['created_ts']),
            text: value['content']
          };
          posSeries.push(point);
        }

        if (value['sentiment'] == 'neg') {
          if (negLastTs != value['created_ts']) {
            negY = -1 * step;
          } else {
            negY -= step;
          }

          negLastTs = value['created_ts'];

          var point = {
            x: value['created_ts'],
            y: negY,
            ts: normalizeTimeStamp(value['created_ts']),
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
        credits: {
          enabled: false  
        },
        chart: {
            renderTo: 'chart',
            type: 'scatter',
        },
        title: {
            text: 'PayPal Sentiments'
        },
        subtitle: {
            text: 'See what peopel are tweeting about PayPal in latest 10 minutes'
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
