// Read json file into JavaScript and assign values to dropdown

// // Read JSON file into javascript
d3.json('data/samples.json').then((importedData) => {


    const data = importedData;
    const dropdownMenu = d3.select("#selDataset");
    const testSubjectID = Object.values(data.names);
    const metaData = data.metadata;
    const samples = data.samples;
    
    // sel.array.forEach(element => {
        
    // });

    d3.select('.well').select('select')
    .selectAll('option')
    .data(testSubjectID)
    .enter()
    .append('option')
    .html(d => `${d}`)
    .attr('value', (d, i) => i);


    const subjectIndex = dropdownMenu.property('value');
    const xData = Object.values(samples[subjectIndex].sample_values);
    const yLabels = (Object.values(samples[subjectIndex].otu_labels))
                        .map( v => {
                        return v.split(';');
                        });
    const subject_otu_id = (Object.values(samples[subjectIndex].otu_ids))
                    .slice(0,10)
                    .reverse();
    
    const genus = (yLabels.map(element => element[element.length - 1]))
                .slice(0,10)
                .reverse();
   
    // Pull Bacteria Lebel
    const bacFamily = (Object.values(samples[subjectIndex].otu_labels))
    // Split Label on semicolon
    const splitBacFamily = bacFamily.map( d => d.split(';'))

    // Remove Genus from list by dropping the last label
    const trimBacFamily = splitBacFamily.map( (d,i) => 
                            d.slice(0,(splitBacFamily[i].length - 1)));
    // Rejoin on semicolon
    const joinTrimFamily = trimBacFamily.map(d => d.join(";"))

    const trimObject = []
    //Create new object and push family labels and required data to it
    joinTrimFamily.map((d, i) => {
        trimObject.push({
            family : d,
            value: xData[i]
        });
    })

    // Loop Through and aggregate teh data
    const pushAggFamily = {};
    trimObject.forEach((item) => {
        if (pushAggFamily.hasOwnProperty(item.family)) {
            pushAggFamily[item.family] += item.value;
        } else {
            pushAggFamily[item.family] = item.value;
        }
    });


    let finalFamilyData = [];
    for (let k in pushAggFamily) {
        finalFamilyData.push({ familyLabel: k, value: pushAggFamily[k] });
    };

    const sortedFamilyFinal = finalFamilyData.sort(function (a,b){
        return b.value - a.value;
    })

    const slicedSortedFamilyFinal = sortedFamilyFinal.slice(0,10);

    const xFamAggData = slicedSortedFamilyFinal.map( d => d.value);
    const yFamAggData = slicedSortedFamilyFinal.map( d => d.familyLabel);

    // console.log(joinTrimFamily);
    function initDemo() {
        // Create Subject-Specific Chart for Selected Subject
        trace1 = {
          x: xData.slice(0, 10).reverse(),
          y: subject_otu_id.map((d,i) => 
                    `${d} : ${genus[i]}`), 
          type: "bar",
          orientation: "h"
        };
        layout = {
            xaxis : {automargin:true},
            yaxis : {automargin:true},
            title: `Top 10 Belly Button Bacteria for Subject: ${testSubjectID[subjectIndex]}`
        }
        let chartData = [trace1];
      
        Plotly.newPlot("bar1", chartData, layout);

        // Create Family Chart for Selected Subject

        trace2 = {
            x: xFamAggData,
            y: yFamAggData,
            mode:'markers', 
            marker: {
                size:(xFamAggData.map(d => d/5))
            }
        };

        let chartData2 = [trace2];

        layout2 = {
            xaxis : {automargin:true},
            yaxis : {automargin:true},
            margin: {
                l: 500,
                r: 0,
                b: 40,
                t: 40,
                pad: 0
            },
            title: `Count of Bacteria by Family for Subject: ${testSubjectID[subjectIndex]}`
        }

        Plotly.newPlot('bubble', chartData2, layout2);
        // Demographic Charts

        const objEntry = Object.entries(metaData[subjectIndex]);

        d3.select('.table').select('tbody')
        .selectAll('tr')
        .data(objEntry)
        .enter()
        .append('tr')
        .html( function(d) {
            return `<td>${d[0].toUpperCase()}</td><td>${d[1]}</td>`
        }
        
        )};
    // Update Plots on change

    d3.selectAll("#selDataset").on("change", updateSubjectData);
    
    function updateSubjectData() {

        // Update Subject Specific Bar Graph

        let subjectIndex = dropdownMenu.property("value");
        let xData = Object.values(samples[subjectIndex].sample_values);
        let yLabels = (Object.values(samples[subjectIndex].otu_labels))
                            .map( v => {
                            return v.split(';');
                            });
                            let subject_otu_id = (Object.values(samples[subjectIndex].otu_ids))
                        .slice(0,10)
                        .reverse();
        
        let genus = (yLabels.map(element => element[element.length - 1]))
                    .slice(0,10)
                    .reverse();

        let x = xData.slice(0, 10).reverse(),
            y =  subject_otu_id.map((d,i) => 
                        `${d} : ${genus[i]}`) 
  
       let title= `Top 10 Belly Button Bacteria for Subject: ${testSubjectID[subjectIndex]}`

        Plotly.restyle("bar1", "x", [x]);
        Plotly.restyle("bar1", "y", [y]);
        Plotly.relayout("bar1", "title", title);

        // Update Subject Specific Bubble Chart

        // Pull Bacteria Lebel
        let bacFamily = (Object.values(samples[subjectIndex].otu_labels))
        // Split Label on semicolon
        const splitBacFamily = bacFamily.map( d => d.split(';'))

        // Remove Genus from list by dropping the last label
        let trimBacFamily = splitBacFamily.map( (d,i) => 
                                d.slice(0,(splitBacFamily[i].length - 1)));
        // Rejoin on semicolon
        let joinTrimFamily = trimBacFamily.map(d => d.join(";"))

        let trimObject = []
        //Create new object and push family labels and required data to it
        joinTrimFamily.map((d, i) => {
            trimObject.push({
                family : d,
                value: xData[i]
            });
        })

        // Loop Through and aggregate teh data
        let pushAggFamily = {};
        trimObject.forEach((item) => {
            if (pushAggFamily.hasOwnProperty(item.family)) {
                pushAggFamily[item.family] += item.value;
            } else {
                pushAggFamily[item.family] = item.value;
            }
        });

        let finalFamilyData = [];
        for (let k in pushAggFamily) {
            finalFamilyData.push({ familyLabel: k, value: pushAggFamily[k] });
        };

        let sortedFamilyFinal = finalFamilyData.sort(function (a,b){
            return b.value - a.value;
        })

        let slicedSortedFamilyFinal = sortedFamilyFinal.slice(0,10);

        let xFamAggData = slicedSortedFamilyFinal.map( d => d.value);
        let yFamAggData = slicedSortedFamilyFinal.map( d => d.familyLabel);
        let marker = {
            size:(xFamAggData.map(d => d/5))
        }
        // on change set subject index to the value of the 
        // selected object

        //run constants again to set the new values and update
        // the plots

        Plotly.restyle('bubble', "x", [xFamAggData])
        Plotly.restyle('bubble', "y", [yFamAggData])
        Plotly.restyle('bubble', "marker", marker)
        Plotly.relayout("bubble", "title", title);

        // Demographic Charts

        const objEntry = Object.entries(metaData[subjectIndex]);

        d3.select('.table').select('tbody')
        .selectAll('tr')
        .remove()


        d3.select('.table').select('tbody')
            .selectAll('tr')
            .data(objEntry)
            .enter()
            .append('tr')
            .html( function(d) {
                return `<td>${d[0].toUpperCase()}</td><td>${d[1]}</td>`
            })

        console.log(objEntry)

    }




    initDemo();
    
    const subjectRange = []
        for (var i = 1; i <= 152; i++) {
        subjectRange.push(i)
    }

    const otu_id_list = samples.map((d,i) =>
                    samples[i].otu_ids);

    const cleanOTUList = [].concat.apply([], otu_id_list);

    const uniqueOTU = [...new Set(cleanOTUList)];

    const appendList = {}

    const aggSet = []
    // const unique = []

    // creating aggregate object
    samples.forEach((item) => {

        for (let i = 0; i < item.otu_ids.length; i++){
            aggSet.push(
                {otu_id : item.otu_ids[i],
                value: item.sample_values[i]})
        }
    });

    let pushOTUidList = {};
    aggSet.forEach((item) => {
        if (pushOTUidList.hasOwnProperty(item.otu_id)) {
            pushOTUidList[item.otu_id] += item.value;
        } else {
            pushOTUidList[item.otu_id] = item.value;
        }
    });
    let finalData = [];
    for (let k in pushOTUidList) {
        finalData.push({ otu_ID: k, totalVal: pushOTUidList[k] });
    };

    const sortedFinal = finalData.sort(function (a,b){
        return b.totalVal - a.totalVal;
    })

    // END AGG OBJECT

    // START AGG GENUS
    // Begin similar process to create top 10 family list
    let aggGenus = []

    // Create 
    samples.forEach((item) => {

        for (let i = 0; i < item.otu_labels.length; i++){
            aggGenus.push(
                {kfcofgLabel : `${item.otu_ids[i]}:${item.otu_labels[i]}`,
                value: item.sample_values[i]})
        }
    });

    let pushAggGenusList = {};
    aggGenus.forEach((item) => {
        if (pushAggGenusList.hasOwnProperty(item.kfcofgLabel)) {
            pushAggGenusList[item.kfcofgLabel] += item.value;
        } else {
            pushAggGenusList[item.kfcofgLabel] = item.value;
        }
    });


    let finalGenusData = [];
    for (let k in pushAggGenusList) {
        finalGenusData.push({ kfcofgLabel: k, value: pushAggGenusList[k] });
    };

    const sortedGenusFinal = finalGenusData.sort(function (a,b){
        return b.value - a.value;
    })

    const splitGenus = sortedGenusFinal.map(d => 
                                        d.kfcofgLabel
                                        .split(";"))




    const aggSplitGenusus = (splitGenus.map(element => element[element.length - 1]))
                .slice(0,10)

    const colonSplitGenus = aggSplitGenusus.map(d => d.split(":"))

    const splitFinalGenus =(colonSplitGenus.map(element => element[element.length - 1]))

    // END AGG GENUS
    // CREATE PLOT FOR ALL SUBJECTS BB BACTERIA

    // Slice Sorted Final DAta
    const slicedSortedFinal = sortedFinal.slice(0,10);

    // Pull x and y data from the js object
    const xAggData = slicedSortedFinal.map( d => d.totalVal);
    const yAggData = slicedSortedFinal.map( d => d.otu_ID);
 
    // Create a trace for the aggregate family bar graph
    let traceAgg = {
        x: xAggData.reverse(),
        y: yAggData.map((d,i) => `${d} : ${splitFinalGenus[i]}`).reverse(),

        type: "bar",
        orientation: "h"
      };
    //Specify Layout for aagregate family bar graph
    let layoutAgg = {
          xaxis : {automargin:true},
          yaxis : {automargin:true},
          title: 'Top 10 Belly Button Bacteria for All Subjects'
      }
      let chartAgg = [traceAgg];
    // Call for creation of new Ploty bar graph
      Plotly.newPlot("bar2", chartAgg, layoutAgg);

});