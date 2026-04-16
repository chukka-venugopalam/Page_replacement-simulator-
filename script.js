let barChartInstance = null;
let lineChartInstance = null;

// NEW: Load GATE Preset
function loadPreset() {
    document.getElementById('referenceString').value = "7 0 1 2 0 3 0 4 2 3 0 3 2";
    document.getElementById('frameCount').value = 3;
    document.getElementById('simMode').value = "all";
    toggleModeInputs();
}

function toggleModeInputs() {
    const mode = document.getElementById('simMode').value;
    const selectorsDiv = document.getElementById('modeSelectors');
    const algo2Container = document.getElementById('algo2Container');

    if (mode === 'all') {
        selectorsDiv.style.display = 'none';
    } else if (mode === 'single') {
        selectorsDiv.style.display = 'grid';
        algo2Container.style.display = 'none';
    } else if (mode === 'two') {
        selectorsDiv.style.display = 'grid';
        algo2Container.style.display = 'flex';
    }
}

function runSimulation() {
    const refInput = document.getElementById('referenceString').value;
    const frameCount = parseInt(document.getElementById('frameCount').value);
    const maxFramesGraph = parseInt(document.getElementById('maxFramesGraph').value);
    const mode = document.getElementById('simMode').value;

    const pages = refInput.replace(/,/g, ' ').trim().split(/\s+/).map(Number);
    
    if (pages.length === 0 || isNaN(pages[0]) || isNaN(frameCount) || frameCount < 1) {
        alert("Please enter valid numbers for the reference string and frames.");
        return;
    }

    let algosToRun = [];
    if (mode === 'all') {
        algosToRun = ['FIFO', 'LRU', 'OPT'];
    } else if (mode === 'single') {
        algosToRun.push(document.getElementById('algo1').value);
    } else if (mode === 'two') {
        algosToRun.push(document.getElementById('algo1').value);
        algosToRun.push(document.getElementById('algo2').value);
        algosToRun = [...new Set(algosToRun)]; 
    }

    document.getElementById('summaryFrameCount').innerText = frameCount;
    document.getElementById('barChartFrameCount').innerText = frameCount;

    let summaryTableHTML = `<tr><th>Algorithm</th><th>Page Faults</th><th>Page Hits</th><th>Hit Rate</th><th>Fault Rate</th></tr>`;
    let detailedContainerHTML = '';
    
    let barChartLabels = [];
    let barChartData = [];

    // NEW: Variables to track the best algorithm
    let bestAlgos = [];
    let minFaults = Infinity;

    algosToRun.forEach(algo => {
        const results = runAlgorithm(algo, pages, frameCount);
        const hitRate = ((results.hits / pages.length) * 100).toFixed(2);
        const faultRate = ((results.faults / pages.length) * 100).toFixed(2);
        
        // Track Best Algorithm
        if (results.faults < minFaults) {
            minFaults = results.faults;
            bestAlgos = [algo];
        } else if (results.faults === minFaults) {
            bestAlgos.push(algo);
        }

        summaryTableHTML += `
            <tr>
                <td><strong>${algo}</strong></td>
                <td>${results.faults}</td>
                <td>${results.hits}</td>
                <td>${hitRate}%</td>
                <td>${faultRate}%</td>
            </tr>`;

        barChartLabels.push(algo);
        barChartData.push(results.faults);

        detailedContainerHTML += `
            <div class="algo-section">
                <h2>${algo} Simulation</h2>
                <div>${buildTable(pages, frameCount, results.history)}</div>
                <details class="step-details">
                    <summary>View Step-by-Step Explanation</summary>
                    <div class="step-log">${buildLogHtml(results.logs)}</div>
                </details>
            </div>
        `;
    });

    document.getElementById('summaryTable').innerHTML = summaryTableHTML;
    document.getElementById('detailedTablesContainer').innerHTML = detailedContainerHTML;

    // Display Best Algorithm Conclusion
    const bestAlgoDiv = document.getElementById('bestAlgoConclusion');
    if (algosToRun.length > 1) {
        bestAlgoDiv.innerHTML = `🏆 Best Algorithm: ${bestAlgos.join(' & ')} (Page Faults = ${minFaults})`;
        bestAlgoDiv.style.display = 'block';
    } else {
        bestAlgoDiv.style.display = 'none'; // Hide if only running one algorithm
    }

    generateBarChart(barChartLabels, barChartData);
    generateLineChart(pages, maxFramesGraph);

    document.getElementById('resultsSection').style.display = 'block';
}

function generateBarChart(labels, data) {
    const ctx = document.getElementById('barChart').getContext('2d');
    if (barChartInstance) barChartInstance.destroy();

    const colorMap = {
        'FIFO': '#ffb3ba',
        'LRU': '#bae1ff',
        'OPT': '#baffc9'
    };
    const backgroundColors = labels.map(lbl => colorMap[lbl] || '#e2f0cb');

    barChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Page Faults',
                data: data,
                backgroundColor: backgroundColors,
                borderColor: '#cce3de',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Total Page Faults' } }
            }
        }
    });
}

function generateLineChart(pages, maxFrames) {
    const ctx = document.getElementById('lineChart').getContext('2d');
    if (lineChartInstance) lineChartInstance.destroy();

    let frameLabels = [];
    let fifoFaults = [];
    let lruFaults = [];
    let optFaults = [];

    for (let f = 1; f <= maxFrames; f++) {
        frameLabels.push(`${f} Frames`);
        fifoFaults.push(runAlgorithm('FIFO', pages, f).faults);
        lruFaults.push(runAlgorithm('LRU', pages, f).faults);
        optFaults.push(runAlgorithm('OPT', pages, f).faults);
    }

    lineChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: frameLabels,
            datasets: [
                {
                    label: 'FIFO (Look for bumps!)',
                    data: fifoFaults,
                    borderColor: '#ff4d4d', 
                    backgroundColor: 'rgba(255, 77, 77, 0.2)',
                    borderWidth: 3,
                    tension: 0.1,
                    fill: false
                },
                {
                    label: 'LRU',
                    data: lruFaults,
                    borderColor: '#54a0ff', 
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0.1
                },
                {
                    label: 'Optimal',
                    data: optFaults,
                    borderColor: '#1dd1a1',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Page Faults' } },
                x: { title: { display: true, text: 'Number of Frames Available' } }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        afterBody: function(context) {
                            if(context[0].dataset.label.includes('FIFO')) {
                                let index = context[0].dataIndex;
                                if(index > 0 && fifoFaults[index] > fifoFaults[index-1]) {
                                    return "\n⚠️ BELADY'S ANOMALY DETECTED HERE!";
                                }
                            }
                            return "";
                        }
                    }
                }
            }
        }
    });
}

function runAlgorithm(algorithm, pages, frameCount) {
    let frames = new Array(frameCount).fill(-1); 
    let history = []; 
    let logs = []; 
    let faults = 0;
    let hits = 0;

    let fifoPointer = 0; 
    let lastUsed = new Array(frameCount).fill(-1); 

    for (let i = 0; i < pages.length; i++) {
        let currentPage = pages[i];
        let isHit = false;
        let hitIndex = -1;
        
        let stepLogStr = `<strong>Step ${i + 1}:</strong> Request Page <strong>${currentPage}</strong>. `;

        for (let j = 0; j < frameCount; j++) {
            if (frames[j] === currentPage) {
                isHit = true;
                hitIndex = j;
                hits++;
                break;
            }
        }

        if (isHit) {
            if (algorithm === 'LRU') lastUsed[hitIndex] = i; 
            stepLogStr += `<span class="text-hit">HIT!</span> Page ${currentPage} is already in Frame ${hitIndex + 1}.`;
        } else {
            faults++;
            let replacedIndex = -1;
            let reasonStr = "";

            if (algorithm === 'FIFO') {
                replacedIndex = fifoPointer;
                reasonStr = `Replaced via FIFO pointer at Frame ${replacedIndex + 1}.`;
                fifoPointer = (fifoPointer + 1) % frameCount; 
            } 
            else if (algorithm === 'LRU' || algorithm === 'OPT') {
                for (let j = 0; j < frameCount; j++) {
                    if (frames[j] === -1) {
                        replacedIndex = j;
                        reasonStr = `Placed into empty Frame ${replacedIndex + 1}.`;
                        break;
                    }
                }
                
                if (replacedIndex === -1) {
                    if (algorithm === 'LRU') {
                        let oldestTime = Infinity;
                        for (let j = 0; j < frameCount; j++) {
                            if (lastUsed[j] < oldestTime) {
                                oldestTime = lastUsed[j];
                                replacedIndex = j;
                            }
                        }
                        reasonStr = `Page ${frames[replacedIndex]} was least recently used, so it was replaced.`;
                    } 
                    else if (algorithm === 'OPT') {
                        let farthest = -1;
                        for (let j = 0; j < frameCount; j++) {
                            let nextUse = pages.indexOf(frames[j], i + 1);
                            if (nextUse === -1) {
                                replacedIndex = j;
                                reasonStr = `Page ${frames[replacedIndex]} is never used again, so it was replaced.`;
                                break; 
                            } else if (nextUse > farthest) {
                                farthest = nextUse;
                                replacedIndex = j;
                                reasonStr = `Page ${frames[replacedIndex]} is not used until furthest in the future, so it was replaced.`;
                            }
                        }
                    }
                }
            }

            if (algorithm === 'LRU') lastUsed[replacedIndex] = i;
            
            let oldPage = frames[replacedIndex];
            frames[replacedIndex] = currentPage;
            
            stepLogStr += `<span class="text-fault">FAULT!</span> `;
            stepLogStr += (oldPage === -1) ? `Added to memory. ${reasonStr}` : `Evicted Page ${oldPage}. ${reasonStr}`;
        }

        history.push({
            page: currentPage,
            framesState: [...frames],
            status: isHit ? 'Hit' : 'Fault'
        });
        
        logs.push(stepLogStr);
    }

    return { faults, hits, history, logs };
}

function buildTable(pages, frameCount, history) {
    let html = '<table><tr><th>Ref</th>';
    for (let i = 0; i < pages.length; i++) html += `<th>${pages[i]}</th>`;
    html += '</tr>';

    for (let f = 0; f < frameCount; f++) {
        html += `<tr><th>F${f + 1}</th>`;
        for (let i = 0; i < history.length; i++) {
            let val = history[i].framesState[f];
            html += `<td>${val === -1 ? '-' : val}</td>`;
        }
        html += '</tr>';
    }

    html += '<tr><th>Status</th>';
    for (let i = 0; i < history.length; i++) {
        let status = history[i].status;
        let cssClass = (status === 'Hit') ? 'hit' : 'fault';
        let symbol = (status === 'Hit') ? '✓' : '✗';
        html += `<td class="${cssClass}">${symbol}</td>`;
    }
    html += '</tr></table>';
    return html;
}

function buildLogHtml(logs) {
    let html = '';
    for(let i=0; i<logs.length; i++) html += `<p>${logs[i]}</p>`;
    return html;
                    }
                            
