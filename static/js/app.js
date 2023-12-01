const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
// const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples2.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);
let dataG ={}
// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  dataG = data;
  console.log(data);
  console.log("dataG: ", dataG)

  //continue code here
  console.log("names: ", data.names)

  // populate dropdown list (<select>) with names
  function populateDropdown() {
    const dropdown = d3.select("#selDataset");
    //remove existing options
    dropdown.selectAll('option').remove()

    // // add a default message
    // dropdown.append('option')
    //     .attr('value', '')
    //     .text("Select an ID")

    //add names array as options in dropdown menu
    dropdown.selectAll('option')
        .data(data.names)
        .enter()
        .append('option')
        .attr('value', function(d){return d;})
        .text(function(d){ return d;});
}

  populateDropdown();
//   Plotly.newPlot("#sample-metadata")

})
.catch(function(error) {
    console.error('Error loading data: ', error)
}
);

function optionChanged(selected){
    console.log('Selected value: ', selected.value)
    console.log('Selected index: ', selected.selectedIndex)
    console.log('dataG: ', dataG)
    index = selected.selectedIndex;
    sample = dataG['samples'][index];
    // console.log('sample: ', sample);
    // console.log('otu_ids: ', sample.otu_ids.slice(0,10));
    let hbData= [{ 
        // convert the values to string, thick bars are displayed when we use the string template, 
        // reverse() because otherwise the largest sample value is at 
        // the bottom, we want it at the top
       y: sample.otu_ids.slice(0,10).map(function(item){return `OTU ${item}`}).reverse(),
       x: sample.sample_values.slice(0,10).reverse(),
       type: 'bar',
       orientation: 'h',
       text: sample.otu_labels.slice(0,10),
       hoverinfo: 'text+x',
       marker: {
        color: 'steelblue',
        withd: 0.5,
       }
    }];
    let layout ={
       title: 'Top 10 OTUs',
       xaxis: {title: 'Sample values'},
    //    yaxis: {title: "OTU ID"},
    };
    Plotly.newPlot('bar', hbData, layout)
    
    //fill in demographic info
    personInfo = dataG['metadata'][index]
    formattedPI = Object.keys(personInfo).map(key => key + ': ' + personInfo[key] + '<br/>').join('')
    // need to use .html() instead of .text() to display the <br> correctly
    d3.select("#sample-metadata").html(formattedPI)

    //create the bubble chart
    let trace = {
        x: sample.otu_ids,
        y: sample.sample_values,
        mode: 'markers',
        marker: {
            size: sample.sample_values,
            color: sample.otu_ids,
            colorscale: 'Viridis'
        },
        text: sample.otu_labels,
    };
    let layout2 = {
        title: 'All OTU',
        xaxis: {title: 'OTU ID'},
        yaxis: {title: 'Sample values'},
    };

    Plotly.newPlot('bubble',[trace], layout2);
    
    //BONUS section
    //create the gauge
    freq = dataG.metadata[index].wfreq;
    // console.log('wfreq: ', freq);
    let gaugeData = [{
        type: 'indicator',
        mode: 'gauge+number',
        title: { text: 'Belly Button Washing Frequency\nScrubs per Week'},
        value: freq,
        domain: {x: [0,1], y: [0,1]},
    }];
    let layout3 = { width: 600, height: 500, margin:{t: 0, b:0}};
    Plotly.newPlot('gauge', gaugeData,layout3)

}


