var barHeight = 55,
  barPad = 3,
  textDy = 16,
  width = 600;

var margin = { top: 0, bottom: 0, left: 60, right: 0 };

var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", width);

var x = d3
  .scaleLinear()
  .range([0, width - margin.left])
  .domain([0, 60]);

var colorArray = ["#009654", "#00d48a", "#ffa171", "#fd4a49", "#ffcec9"];

d3.csv("data.csv", types, function(error, data) {
  var keys = [],
    legKeys = [];

  _.keys(data[0]).forEach(function(d, i) {
    if (i > 0) {
      d.includes("pct") ? keys.push(d) : legKeys.push(d);
    }
  });

  // create the legend
  $(".legend").css("margin-left", margin.left);
  legKeys.forEach(function(legKey, i) {
    $(".legend").append(
      '<div class="swatch" style="background:' +
        colorArray[i] +
        '"></div>' +
        legKey
    );
  });

  var height = data.length * barHeight + barPad * 3;

  d3.select("svg").attr("height", height);

  keys.forEach(function(key, i) {
    console.log(data);
    svg
      .selectAll(".bar ." + key)
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar " + key)
      .attr("width", function(d, i) {
        return x(d[key]);
      })
      .attr("height", barHeight - barPad)
      .attr("x", function(d) {
        return widths(keys, key, d);
      })
      .attr("y", function(d, i) {
        return pad(d, i);
      });

    d3.selectAll("." + key).style("fill", colorArray[i]);

    svg
      .selectAll(".bar-label ." + key)
      .data(data)
      .enter()
      .append("text")
      .attr("class", "bar-label " + key)
      .attr("x", function(d) {
        var barX;
        key !== keys[keys.length - 1]
          ? (barX = widths(keys, key, d) + 5)
          : (barX = width - 5);
        return barX;
      })
      .attr("dy", textDy)
      .attr("y", function(d, i) {
        return pad(d, i);
      })
      .attr("text-anchor", function(d) {
        var ta;
        key == keys[keys.length - 1] ? (ta = "end") : (ta = "start");
        return ta;
      })

      .text(function(d) {
        var text;
        d[key] < 5
          ? (text = "")
          : (text =
              Math.round(d[key]) +
              pct(d, data[0].group, data[data.length - 1].group));
        return text;
      });
  });
});

function types(d) {
  var keys = _.keys(d);

  var arr = [];
  keys.forEach(function(k, i) {
    if (i !== 0) {
      arr.push(+d[k]);
      d[k] = +d[k];
    }
  });

  var sum = arr.reduce(function(a, b) {
    return a + b;
  }, 0);
  keys.forEach(function(k, i) {
    i !== 0 ? (d[k + "pct"] = +d[k] / sum * 100) : null;
  });

  return d;
}

function pad(d, i) {
  var barI;
  d.group == "total"
    ? (barI = i * barHeight + barPad * 2)
    : (barI = i * barHeight);
  return barI;
}

function pct(d, first, last) {
  var extra;
  d.group == first || d.group == last ? (extra = "%") : (extra = "");
  return extra;
}

function widths(keys, key, d) {
  if (key == keys[0]) {
    return margin.left;
  } else if (key == keys[1]) {
    return margin.left + x(d[keys[0]]);
  } else if (key == keys[2]) {
    return margin.left + x(d[keys[0]]) + x(d[keys[1]]);
  } else if (key == keys[3]) {
    return margin.left + x(d[keys[0]]) + x(d[keys[1]]) + x(d[keys[2]]);
  } else if (key == keys[4]) {
    return (
      margin.left +
      x(d[keys[0]]) +
      x(d[keys[1]]) +
      x(d[keys[2]]) +
      x(d[keys[3]])
    );
  } else if (key == keys[5]) {
    return (
      margin.left +
      x(d[keys[0]]) +
      x(d[keys[1]]) +
      x(d[keys[2]]) +
      x(d[keys[3]]) +
      x(d[keys[4]])
    );
  } else if (key == keys[6]) {
    return (
      margin.left +
      x(d[keys[0]]) +
      x(d[keys[1]]) +
      x(d[keys[2]]) +
      x(d[keys[3]]) +
      x(d[keys[4]]) +
      x(d[keys[5]])
    );
  } else if (key == keys[7]) {
    return (
      margin.left +
      x(d[keys[0]]) +
      x(d[keys[1]]) +
      x(d[keys[2]]) +
      x(d[keys[3]]) +
      x(d[keys[4]]) +
      x(d[keys[5]]) +
      x(d[keys[6]])
    );
  }
}

function addTotal(data, keys) {
  var totObj = {};
  var arrA = [];
  keys.forEach(function(key) {
    var arrB = [];
    data.forEach(function(d) {
      arrB.push(d[key]);
    });
    var sumB = arrB.reduce(function(a, b) {
      return a + b;
    }, 0);
    totObj[key] = sumB;
    arrA.push(sumB);
  });

  var sumA = arrA.reduce(function(a, b) {
    return a + b;
  }, 0);

  keys.forEach(function(key) {
    totObj[key + "pct"] = totObj[key] / sumA * 100;
  });

  totObj.group = "total";

  data.push(totObj);

  return data;
}
