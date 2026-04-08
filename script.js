function compareAlgorithms() {
    const refInput = document.getElementById('referenceString').value;
    const frameCount = parseInt(document.getElementById('frameCount').value);

    const pages = refInput.replace(/,/g, ' ').trim().split(/\s+/).map(Number);
    
    if (pages.length === 0 || isNaN(pages[0]) || isNaN(frameCount) || frameCount < 1) {
        alert("Please enter valid numbers for the reference string and frames.");
        return;
    }

    // Run all three algorithms
    const fifoResults = runAlgorithm('FIFO', pages, frameCount);
    const lruResults = runAlgorithm('LRU', pages, frameCount);
    const optResults = runAlgorithm('OPT', pages, frameCount);

    // Update Summary Table
    updateSummaryRow('fifo', fifoResults, pages.length);
    updateSummaryRow('lru', lruResults, pages.length);
    updateSummaryRow('opt', optResults, pages.length);

    // Render detailed tables
    document.getElementById('fifoTableContainer').innerHTML = buildTable(pages, frameCount, fifoResults.history);
    document.getElementById('lruTableContainer').innerHTML = buildTable(pages, frameCount, lruResults.history);
    document.getElementById('optTableContainer').innerHTML = buildTable(pages, frameCount, optResults.history);

    // Show results
    document.getElementById('resultsSection').style.display = 'block';
}

function runAlgorithm(algorithm, pages, frameCount) {
    let frames = new Array(frameCount).fill(-1); 
    let history = []; 
    let faults = 0;
    let hits = 0;

    let fifoPointer = 0; 
    let lastUsed = new Array(frameCount).fill(-1); 

    for (let i = 0; i < pages.length; i++) {
        let currentPage = pages[i];
        let isHit = false;
        let hitIndex = -1;

        // Check for hit
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
        } else {
            faults++;
            let replacedIndex = -1;

            if (algorithm === 'FIFO') {
                replacedIndex = fifoPointer;
                fifoPointer = (fifoPointer + 1) % frameCount; 
            } 
            else if (algorithm === 'LRU' || algorithm === 'OPT') {
                // Find empty frame first
                for (let j = 0; j < frameCount; j++) {
                    if (frames[j] === -1) {
                        replacedIndex = j;
                        break;
                    }
                }
                
                // If full, apply specific logic
                if (replacedIndex === -1) {
                    if (algorithm === 'LRU') {
                        let oldestTime = Infinity;
                        for (let j = 0; j < frameCount; j++) {
                            if (lastUsed[j] < oldestTime) {
                                oldestTime = lastUsed[j];
                                replacedIndex = j;
                            }
                        }
                    } 
                    else if (algorithm === 'OPT') {
                        let farthest = -1;
                        for (let j = 0; j < frameCount; j++) {
                            let nextUse = pages.indexOf(frames[j], i + 1);
                            if (nextUse === -1) {
                                replacedIndex = j;
                                break; 
                            } else if (nextUse > farthest) {
                                farthest = nextUse;
                                replacedIndex = j;
                            }
                        }
                    }
                }
            }

            if (algorithm === 'LRU') lastUsed[replacedIndex] = i;
            frames[replacedIndex] = currentPage;
        }

        // Save state snapshot
        history.push({
            page: currentPage,
            framesState: [...frames],
            status: isHit ? 'Hit' : 'Fault'
        });
    }

    return { faults, hits, history };
}

function updateSummaryRow(prefix, results, totalPages) {
    document.getElementById(`${prefix}Faults`).innerText = results.faults;
    document.getElementById(`${prefix}Hits`).innerText = results.hits;
    document.getElementById(`${prefix}Ratio`).innerText = ((results.hits / totalPages) * 100).toFixed(2) + '%';
}

function buildTable(pages, frameCount, history) {
    let html = '<table>';
    
    html += '<tr><th>Ref</th>';
    for (let i = 0; i < pages.length; i++) {
        html += `<th>${pages[i]}</th>`;
    }
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
