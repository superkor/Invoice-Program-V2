var graphs = 0

const CHART_COLORS = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
  }

const COLORS = [
    '#4dc9f6',
    '#f67019',
    '#f53794',
    '#537bc4',
    '#acc236',
    '#166a8f',
    '#00a950',
    '#58595b',
    '#8549ba'
  ];

function graph(elm){
    graphCanvas = document.getElementsByClassName("graph")
    graphCanvas = graphCanvas[seasonArray.indexOf(elm)]
    var request = $.ajax({
        url: "/getInvoice",
        type: "GET",
        headers: {"season": elm},
        contentType: "application/json",
        data: {},
        success: function(response){
            table = response["seasonTable"]

            if (table != 0){
                xAxis = []
                pcs = []
                cs =  []
                fz = []
                nv = []
                jr = []
                pep = []
                ad = []
                pw = []
                st = []
                cir = []
                rpt = []
                inter = []
                //Add months to x axis
                for (x in table){
                    xAxis.push(table[x][0])
                    //Add sessions
                    pcs.push(table[x][1])
                    cs.push(table[x][2])
                    fz.push(table[x][3])
                    nv.push(table[x][4])
                    jr.push(table[x][5])
                    pep.push(table[x][6])
                    ad.push(table[x][7])
                    pw.push(table[x][8])
                    st.push(table[x][9])
                    cir.push(table[x][10])
                    rpt.push(table[x][11])
                    inter.push(table[x][12])
                }

                const data = {
                    labels: xAxis,
                    datasets: [
                    {
                        label: "PCS",
                        data: pcs,
                        backgroundColor: CHART_COLORS.red,
                        pointStyle: 'circle',
                        pointRadius: 10,
                        pointHoverRadius: 15
                    },{
                        label: "CS",
                        data: cs,
                        backgroundColor: CHART_COLORS.blue,
                        pointStyle: 'circle',
                        pointRadius: 10,
                        pointHoverRadius: 15
                    }, {
                        label: "FZ",
                        data: fz,
                        backgroundColor: CHART_COLORS.green,
                        pointStyle: 'circle',
                        pointRadius: 10,
                        pointHoverRadius: 15
                    }, {
                        label: "PEP",
                        data: pep,
                        backgroundColor: CHART_COLORS.yellow,
                        pointStyle: 'circle',
                        pointRadius: 10,
                        pointHoverRadius: 15
                    }, {
                        label: "AD",
                        data: ad,
                        backgroundColor: CHART_COLORS.orange,
                        pointStyle: 'circle',
                        pointRadius: 10,
                        pointHoverRadius: 15
                    }, {
                        label: "PW",
                        data: pw,
                        backgroundColor: CHART_COLORS.purple,
                        pointStyle: 'circle',
                        pointRadius: 10,
                        pointHoverRadius: 15
                    }, {
                        label: "ST",
                        data: st,
                        backgroundColor: CHART_COLORS.grey,
                        pointStyle: 'circle',
                        pointRadius: 10,
                        pointHoverRadius: 15
                    }, {
                        label: "NV",
                        data: nv,
                        backgroundColor: COLORS[0],
                        pointStyle: 'circle',
                        pointRadius: 10,
                        pointHoverRadius: 15
                    }, {
                        label: "JR",
                        data: jr,
                        backgroundColor: COLORS[1],
                        pointStyle: 'circle',
                        pointRadius: 10,
                        pointHoverRadius: 15
                    }, {
                        label: "CIR",
                        data: cir,
                        backgroundColor: COLORS[2],
                        pointStyle: 'circle',
                        pointRadius: 10,
                        pointHoverRadius: 15
                    }, {
                        label: "RPT",
                        data: rpt,
                        backgroundColor: COLORS[3],
                        pointStyle: 'circle',
                        pointRadius: 10,
                        pointHoverRadius: 15
                    }, {
                        label: "IN",
                        data: inter,
                        backgroundColor: COLORS[4],
                        pointStyle: 'circle',
                        pointRadius: 10,
                        pointHoverRadius: 15
                    }, 
                    ]
                }
                const config = {
                    type: 'line',
                    data: data,
                    options: {
                        plugins: {
                          title: {
                            display: true,
                            text: elm+' Season Sessions Chart'
                          },
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          /* x: {
                            stacked: true,
                          },
                          y: {
                            stacked: true
                          } */
                        }
                      }
                    }
                graphs = new Chart(graphCanvas, config)
            }
        },
        error: function(error){
            alert("server error "+ error.status + ": " + error.responseJSON.error)
        }
    }).done()
}

function destroyGraph(){
    if (graphs != 0){
        graphs.destroy()
    }
}