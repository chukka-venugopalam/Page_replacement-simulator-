function simulate() {
    // 1. Get input values
    const algorithm = document.getElementById('algorithm').value;
    const refInput = document.getElementById('referenceString').value;
    const frameCount = parseInt(document.getElementById('frameCount').value);

    // Parse the reference string
    const pages = refInput.replace(/,/g, ' ').trim().split(/\s+/).map(Number);
    
    if (pages.length === 0 || isNaN(pages[0]) || isNaN(frameCount) || frameCount < 1) {
        alert("Please enter valid numbers for the reference string and frames.");
        return;
    }

    // Shared variables
    let frames = new Array(frameCount).fill(-1); 
    let history = []; 
    let faults = 0;
    let hits = 0;

    // Specific to algorithms
    let fifoPointer = 0; 
    let lastUsed = new Array(frameCount).fill(-1); // For LRU: tracks the index when a frame was last used

    // 2. Run the Selected Algorithm
    for (let i = 0; i < pages.length; i++) {
        let currentPage = pages[i];
        let isHit = false;
        let hitIndex = -1;

        // Check if page is already in a frame (Hit)
        for (let j = 0; j < frameCount; j++) {
            if (frames[j] === currentPage) {
                isHit = true;
                hitIndex = j;
                hits++;
                break;
            }
        }

        if (isHit) {
            // If LRU, update the last used time for this hit
            if (algorithm === 'LRU') {
                lastUsed[hitIndex] = i; 
            }
        } else {
            // Page Fault logic
            faults++;
            let replacedIndex = -1;

            if (algorithm === 'FIFO') {
                replacedIndex = fifoPointer;
                fifoPointer = (fifoPointer + 1) % frameCount; 
            } 
            else if (algorithm === 'LRU') {
                // Check for empty frames first
                for (let j = 0; j < frameCount; j++) {
                    if (frames[j] === -1) {
                        replacedIndex = j;
                        break;
                    }
                }
                
                // If no empty frame, find the Least Recently Used frame
                if (replacedIndex === -1) {
                    let oldestTime = Infinity;
                    for (let j = 0; j < frameCount; j++) {
                        if (lastUsed[j] < oldestTime) {
                            oldestTime = lastUsed[j];
                            replacedIndex = j;
                        }
                    }
                }
                
                // Update LRU tracking
                lastUsed[replacedIndex] = i;
            }

            // Place the new page in the calculated frame index
            frames[replacedIndex] = currentPage;
        }

        // Save the state for visualization
        history.push({
            page: currentPage,
            framesState: [...frames],
            status: isHit ? 'Hit' : 'Fault'
        });
    }

    // 3. Update the UI Stats
    document.getElementById('faultCount').innerText = faults;
    document.getElementById('hitCount').innerText = hits;
    let ratio = ((hits / pages.length) * 100).toFixed(2);
    document.getElementById('hitRatio').innerText = ratio;

    // 4. Build the Visualization Table
    let tableHTML = '<table>';
    
    tableHTML += '<tr><th>Reference</th>';
    for (let i = 0; i < pages.length; i++) {
        tableHTML += `<th>${pages[i]}</th>`;
    }
    tableHTML += '</tr>';

    for (let f = 0; f < frameCount; f++) {
        tableHTML += `<tr><th>Frame ${f + 1}</th>`;
        for (let i = 0; i < history.length; i++) {
            let val = history[i].framesState[f];
            let displayVal = (val === -1) ? '-' : val;
            tableHTML += `<td>${displayVal}</td>`;
        }
        tableHTML += '</tr>';
    }

    tableHTML += '<tr><th>Status</th>';
    for (let i = 0; i < history.length; i++) {
        let status = history[i].status;
        let cssClass = (status === 'Hit') ? 'hit' : 'fault';
        let symbol = (status === 'Hit') ? '✓' : '✗';
        tableHTML += `<td class="${cssClass}">${symbol}</td>`;
    }
    tableHTML += '</tr>';

    tableHTML += '</table>';

    document.getElementById('tableContainer').innerHTML = tableHTML;
    document.getElementById('resultsSection').style.display = 'block';
}
