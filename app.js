const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
var dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

 d3.json(url).then(function(data) {
  
   function createDropDown(data) {
     let names = data.names;
     let select = d3.select("#selDataset");
     names.forEach((name) => {
      select.append("option").text(name).property("value", name);  
      });
  }

   function init() {
    var firstName = data.names[0];
    getData(firstName); 
  }
  
   d3.select("#selDataset").on("change", getData); 

   function getData() {
     let dataValue = d3.select("#selDataset").property("value");
      let metadata = data.metadata;
     let chosenMetadata = metadata.filter(meta => meta.id == dataValue);  
    let chosenMeta = chosenMetadata[0]  

     updatePanel(chosenMeta);

      let samples = data.samples;
     let sampleMatched = samples.filter(s => s.id === dataValue)[0]; 

      makeBarChart(sampleMatched); 
     makeBubbleChart(sampleMatched); 
     makeGaugeChart(chosenMeta); 

  }

   function makeBarChart(newdata) {
     let otu_ids = newdata.otu_ids.slice(0, 10).reverse();
    let otu_labels = newdata.otu_labels.slice(0, 10).reverse();
    let sample_values = newdata.sample_values.slice(0, 10).reverse();

     let y_labels = otu_ids.map(otu_id => `OTU ${otu_id}`);   

     let trace1 = {
      x: sample_values,
      y: y_labels, 
      text: otu_ids,
      hovertext: otu_labels,
      name: "beboBar",
      type: "bar",
      orientation: "h"
    };

    var barData = [trace1];

    let layout_bar = {
      title: `<b>Top Ten OTUs in ID: ${newdata.id}</b>`, 
      margin: {
        l: 75,
        r: 0,
        t: 50,
        b: 50
      }
    };


    Plotly.newPlot("bar", barData, layout_bar); 
  }

  
  function makeBubbleChart(newdata) {
 
    let otu_ids = newdata.otu_ids;
    let otu_labels = newdata.otu_labels;
    let sample_values = newdata.sample_values;

    let trace2 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels, 
      mode: 'markers',
      marker: {
        color: otu_ids,
        colorscale: 'Earth',
        size: sample_values,
        sizeref: 1.6, 
      }
    };

    // Add the trace2 to bubbleData array:
    let bubbleData = [trace2];

    // Apply a title to the layout and turn off legend, pull the ID for the title:
    let layout_bubble = {
      title: `<b>Bubble Chart of OTUs in ID: ${newdata.id}</b>`,
      xaxis: {
        title: {
          text: 'OTU ID'}
        }, 
      showlegend: false,
      margin: {
        t: 50,
        r: 50,
        b: 100,
        l: 50
      },
    };
    
     Plotly.newPlot('bubble', bubbleData, layout_bubble); 

  }
  

   function makeGaugeChart(newdata) {
     let washing_freq = newdata.wfreq

     var gaugeData = [
        {
          type: "indicator",
          mode: "gauge+number",
          domain: { x: [0, 1], y: [0, 1] },
          value: washing_freq,
          title: { text: `<b>Belly Button Washing Frequency of ID: ${newdata.id}</b> <br> Scrubs per Week`, font: { size: 18 } },
          gauge: {
            axis: { range: [null, 9], tickmode: "array", ticktext: ["Very<br>Dirty","1","2","3","4","5","6","7","8","Very<br>Clean"],tickvals: [0,1,2,3,4,5,6,7,8,9], ticks: "inside", tickwidth: 4, ticklen: 50, tickcolor: "lightslategrey",
            tickfont: {size: 22} }, 
            // Set the color of the gauge marker:
            bar: { thickness:0.6, color: "black" },  
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "lightslategrey",
             steps: [
              { range: [0, 1], color: "#f7fcf0" },
              { range: [1, 2], color: "#e0f3db" },
              { range: [2,3], color: "#ccebc5" },
              { range: [3, 4], color: "#a8ddb5" },
              { range: [4, 5], color: "#7bccc4" },
              { range: [5, 6], color: "#4eb3d3" },
              { range: [6, 7], color: "#2b8cbe" },
              { range: [7, 8], color: "#0868ac" },
              { range: [8, 9], color: "#084081" }
            ]
          }
        }
      ];

       var layout_gauge = {
        width: 500,
        height: 450,
        margin: { t: 25, r: 75, l: 65, b: 50 },
        annotations: 
        {
            x: 0,
            y: 0, 
             text: 'HERE',
            showarrow: true,
            font: {
              family: 'Courier New, monospace',
              size: 16,
              color: '#ffffff'
            }
      }
    }
      
      Plotly.newPlot("gauge", gaugeData, layout_gauge);

  } 

   function updatePanel(newdata) {
     let panel = d3.select("#sample-metadata");

     panel.html("");

 
     function reformKeys(key) {
      if (key === "id") return key = "Subject ID" 
      else if (key === "ethnicity") return key = "Ethnicity"
      else if (key === "gender") return key = "Gender"
      else if (key === "age") return key = "Age"
      else if (key === "location") return key = "Location"
      else if (key === "bbtype") return key = "Belly Button Type"
      else if (key === "wfreq") return key = "Washing Frequency"; 
        }

     function reformValues(value) {
      if (value === null) return value = "Missing" 
      else return value
    }

     Object.entries(newdata).forEach(([key, value]) => { 
       var key = reformKeys(key);
       var value = reformValues(value);
      panel.append("h5").text(`${key}: ${value}`);     
    });    
  } 

   createDropDown(data);  
  init();

}); 