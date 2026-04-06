function simulateFIFO() {
        // 1. Get input values
        const refInput = document.getElementById('referenceString').value;
        const frameCount = parseInt(document.getElementById('frameCount').value);

        // Parse the reference string (handles commas or spaces)
        const pages = refInput.replace(/,/g, ' ').trim().split(/\s+/).map(Number);
        
        if (pages.length === 0 || isNaN(pages[0]) || isNaN(frameCount) || frameCount < 1) {
            alert("Please enter valid numbers for the reference string and frames.");
            return;
        }

        // 2. Initialize variables for FIFO
        let frames = new Array(frameCount).fill(-1); // -1 represents an empty frame
        let pointer = 0; // Points to the oldest page
        let faults = 0;
        let hits = 0;
        
        // This array will store the state of frames at each step for the visual table
        let history = []; 

        // 3. Run the FIFO Algorithm
        for (let i = 0; i < pages.length; i++) {
            let currentPage = pages[i];
            let isHit = false;

            // Check if page is already in a frame
            for (let j = 0; j < frameCount; j++) {
                if (frames[j] === currentPage) {
                    isHit = true;
                    hits++;
                    break;
                }
            }

            // If it's a fault, replace the page at the FIFO pointer
            if (!isHit) {
                frames[pointer] = currentPage;
                pointer = (pointer + 1) % frameCount; // Move pointer to next oldest
                faults++;
            }

            // Save the state for visualization (copy the array)
            history.push({
                page: currentPage,
                framesState: [...frames],
                status: isHit ? 'Hit' : 'Fault'
            });
        }

        // 4. Update the UI Stats
        document.getElementById('faultCount').innerText = faults;
        document.getElementById('hitCount').innerText = hits;
        let ratio = ((hits / pages.length) * 100).toFixed(2);
        document.getElementById('hitRatio').innerText = ratio;

        // 5. Build the Visualization Table
        let tableHTML = '<table>';
        
        // First row: The requested pages
        tableHTML += '<tr><th>Reference</th>';
        for (let i = 0; i < pages.length; i++) {
            tableHTML += `<th>${pages[i]}</th>`;
        }
        tableHTML += '</tr>';

        // Rows for each frame
        for (let f = 0; f < frameCount; f++) {
            tableHTML += `<tr><th>Frame ${f + 1}</th>`;
            for (let i = 0; i < history.length; i++) {
                let val = history[i].framesState[f];
                let displayVal = (val === -1) ? '-' : val;
                tableHTML += `<td>${displayVal}</td>`;
            }
            tableHTML += '</tr>';
        }

        // Bottom row: Hit or Fault status
        tableHTML += '<tr><th>Status</th>';
        for (let i = 0; i < history.length; i++) {
            let status = history[i].status;
            let cssClass = (status === 'Hit') ? 'hit' : 'fault';
            let symbol = (status === 'Hit') ? '✓' : '✗';
            tableHTML += `<td class="${cssClass}">${symbol}</td>`;
        }
        tableHTML += '</tr>';

        tableHTML += '</table>';

        // Display the table and unhide the results section
        document.getElementById('tableContainer').innerHTML = tableHTML;
        document.getElementById('resultsSection').style.display = 'block';
}
