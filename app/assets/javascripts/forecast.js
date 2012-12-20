var SurfForecastData = (function() {
  SurfForecastData.name = "SurfForecastData";

  function SurfForecastData(dataElement) {
    this.day = parseInt(dataElement.getAttribute("day"), 0);
    this.hour = dataElement.getAttribute("hour");
    this.dayName = dataElement.getAttribute("day_name");
    this.month = dataElement.getAttribute("month");
  }

  return SurfForecastData;
})();

var SurfForecast = (function() {
  SurfForecast.name = "SurfForecast";

  function SurfForecast(options) {
    // Create the kinetic stage we'll use to draw everything
    this.stage = new Kinetic.Stage({container: "surf_forecast", width: 709, height: 166});

    // Surf Data url is where we get the surf forecast data from
    this.surfDataUrl = options.surfDataUrl;

    // Set up initial properties for Sunrise
    this.sunSetHour = options.sset.substring(0, 1) + "pm";
    this.sunRiseHour = options.srise.substring(0, 1) + "am";
    this.backgroundLayer = new Kinetic.Layer();
    this.graphWidth = 689;
    this.graphOffsetX = 19.5;

    this.stage.add(this.backgroundLayer);
    this.fetchData();
  }

  SurfForecast.prototype.fetchData = function() {
    $.ajax(this.surfDataUrl, {
      success: $.proxy(this.bindData, this)
    });
  }

  SurfForecast.prototype.bindData = function(data, textStatus, xhr) {
    var dataPoints = data.getElementsByTagName("data");
    var surfForecastDataArray = [];
    var firstDataPoint;
    for (var i = 0; i < dataPoints.length; i++) {
      var dataPoint = new SurfForecastData(dataPoints[i]);
      if (!firstDataPoint) {
        firstDataPoint = dataPoint;
      }
      if (dataPoint.day == firstDataPoint.day + 7 && dataPoint.hour == firstDataPoint.hour ) {
        break;
      } else {
        surfForecastDataArray.push(dataPoint);
      }
    }

    this.data = surfForecastDataArray;
    this.dataColumnWidth = this.graphWidth / this.data.length;
    this.generateSurfBackground();
  }


  SurfForecast.prototype.generateSurfBackground = function() {
    // Build the background rectangle
    var rect = new Kinetic.Rect({
      x: 0,
      y: 0,
      width: 709,
      height: 166,
      stroke: '#dfe3ed',
      fill: '#dfe3ed',
      strokeWidth: 1
    });
    rect.setCornerRadius(3);
    this.backgroundLayer.add(rect);

    // Build the surrounding rectangle
    rect = new Kinetic.Rect({
        x: this.graphOffsetX,
        y: 23.5,
        width: this.graphWidth,
        height: 119,
        stroke: "#969696",
        fill: "#ffffff",
        strokeWidth: 1
    });
    this.backgroundLayer.add(rect);


    // Build the day seperators
    var points, ytop = 24.5, ybottom = 141.5, sunSetIndex, days = 0;
    for (var i = 0; i < this.data.length; i++) {
      if (this.data[i].hour === "12am") {
        points = []
        var x = Math.round(((i * this.dataColumnWidth) + this.graphOffsetX) + 0.5) - 0.5;
        points.push(x);
        points.push(ytop);
        points.push(x);
        points.push(ybottom);
        var daySeperatorLine = new Kinetic.Line({
          points: points,
          stroke: '#d9d9d9',
          strokeWidth: 1
        });
        this.backgroundLayer.add(daySeperatorLine);

        // Create the Day labels
        if (days < 6) {
          points = [];
          points.push(x);
          points.push(1);
          points.push(x);
          points.push(21);
          var labelSeperatorLine = new Kinetic.Line({
            points: points,
            stroke: '#ffffff',
            strokeWidth: 1
          });
          this.backgroundLayer.add(labelSeperatorLine);

          var dayLabelText = new Kinetic.Text({
            x: x + 16,
            y: 6,
            text: this.data[i].dayName + " " + this.data[i].month + "-" + this.data[i].day,
            textFill: "#064a77",
            fontFamily: 'Arial',
            fontSize: 10
          });
          this.backgroundLayer.add(dayLabelText);

          days++;
        }
      }


      // Build the dark rectangles
      if (this.data[i].hour == this.sunSetHour) {
        sunSetIndex = i;
      }

      if (this.data[i].hour == this.sunRiseHour) {
        rect = new Kinetic.Rect ({
          x: Math.round(((sunSetIndex * this.dataColumnWidth) + this.graphOffsetX) + 0.5) - 0.5,
          y: ytop,
          width: Math.floor((i - sunSetIndex) * this.dataColumnWidth),
          height: ybottom - ytop,
          stroke: "#eeeeee",
          fill: "#eeeeee",
          strokeWidth: 1
        });
        this.backgroundLayer.add(rect);
        rect.setZIndex(rect.getZIndex() - 3);
      }
    }

    // Build the Y Axis Labels and dashed lines
    var dashedDrawFunction = function(canvas) {
      // This function draws a horizontal dashed line so it cheats
      var points = this.attrs.points;
      var dashArray = this.attrs.dashArray;

      // Initial points are the first two entries. y won't change on a horizontal line
      var x = points[0].x;
      var y = points[0].y;

      var dashLength = dashArray[0];
      var gapLength = dashArray[1];

      // Cheating here. The length of the line is the difference in the x axis
      var length = points[1].x - points[0].x;
      var currentLength = 0;


      // Start drawing the line
      var context = canvas.getContext();
      context.beginPath();
      context.moveTo(x, y);

      while (currentLength < length) {
        context.lineTo(x + dashLength + currentLength, y);
        currentLength += dashLength;

        context.moveTo(x + gapLength + currentLength, y);
        currentLength += gapLength;
      }

      context.stroke();
      //context.closePath();
      //context.lineWidth = this.attrs.strokeWidth;
      //canvas.fillStroke(this);
    }
    var dashedLine = new Kinetic.Line({
      drawFunc: dashedDrawFunction,
      stroke: 'black',
      strokeWidth: 1,
      points: [100, 100, 500, 100],
      dashArray: [10, 14]
    });
    this.backgroundLayer.add(dashedLine);
    for (var i = 0; i < 8; i++) {
    }


    this.backgroundLayer.draw();
  }

  return SurfForecast;
})();


$(document).ready(function() {
  if ($("#surf_forecast").length > 0) {
    new SurfForecast({
      surfDataUrl: "/canvas/forecast/surf_data",
      sset: "4:42",
      srise: "7:14"
    });
  }
});
