# Page Replacement Algorithm Simulator

An interactive web-based simulator to visualize and compare page replacement algorithms used in Operating Systems.

---

##  Features

- Compare multiple algorithms:
  - FIFO (First-In First-Out)
  - LRU (Least Recently Used)
  - Optimal (OPT)

-  Detailed Comparison Table:
  - Page Faults
  - Page Hits
  - Hit Ratio

- Step-by-Step Execution:
  - Shows each page request
  - Identifies HIT or FAULT
  - Explains why a page was replaced

-  Concept Section:
  - Clear explanation of each algorithm
  - Pros and cons
  - Time complexity

-  Visual Learning:
  - Frame-by-frame table visualization
  - Color-coded hits and faults
  - Expandable step logs

---

##  Tech Stack

- HTML
- CSS
- JavaScript (Vanilla JS)

---

##  How It Works

1. Enter a reference string (e.g., `7 0 1 2 0 3 0`)
2. Select number of frames
3. Click **Compare All Algorithms**
4. View:
   - Summary comparison
   - Frame simulation tables
   - Step-by-step explanations

---

##  Algorithms Explained

### FIFO (First-In First-Out)
- Replaces the oldest page in memory
- Simple but can suffer from Belady’s Anomaly
- Time Complexity: O(1) per operation

---

### LRU (Least Recently Used)
- Replaces the page not used for the longest time
- Better real-world performance than FIFO
- Time Complexity: O(n) (can be optimized to O(1))

---

### Optimal (OPT)
- Replaces the page used farthest in the future
- Produces minimum page faults
- Not implementable in real systems (requires future knowledge)
- Time Complexity: O(n²)

---

##  Project Structure
├── index.html 
├── style.css 
├── script.js 
└── README.md

---

##  Learning Outcomes

- Understanding of memory management concepts
- Difference between FIFO, LRU, and Optimal
- Visualization of page faults and hits
- Insight into algorithm efficiency

---

##  Future Improvements

- Add Clock (Second Chance) Algorithm
- Add graphical animations
- Export results as PDF
- Add dark mode toggle

---

## Contributing

Feel free to fork this repo and improve it!

---

## Author

**Venugopal Chukka**
