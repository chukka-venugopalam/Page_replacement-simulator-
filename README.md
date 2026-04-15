# Page Replacement Algorithm Simulator & Analysis

A web-based educational tool designed to simulate and compare Operating System Page Replacement algorithms: **FIFO**, **LRU**, and **Optimal (OPT)**. 

This project was built to help visualize memory management concepts and demonstrate **Belady's Anomaly** using dynamic graphs and step-by-step execution logs, making it highly useful for computer science students and GATE exam preparation.

## Features

* **Multi-Algorithm Support:** Run First-In-First-Out (FIFO), Least Recently Used (LRU), and Optimal (OPT) algorithms.
* **Comparison Modes:** Choose to run a single algorithm, compare two side-by-side, or run all three simultaneously.
* **Belady's Anomaly Visualization:** Automatically generates a line graph plotting Page Faults vs. Frame Count to visually prove Belady's Anomaly in the FIFO algorithm.
* **Interactive Visualizations:**
    * Summary tables for quick page fault, hit, and hit-ratio comparisons.
    * Detailed execution grids showing the state of memory frames at every step.
    * Bar charts for direct performance comparison.
* **Step-by-Step Logs:** Expandable drop-downs that explain exactly *why* a page was placed or evicted in plain English.

##  Technologies Used

* **HTML5:** Structure and UI layout.
* **CSS3:** Styling, utilizing a calm, peaceful pastel color palette and CSS Grid/Flexbox.
* **Vanilla JavaScript:** Core algorithmic logic and DOM manipulation.
* **Chart.js:** Used via CDN for rendering the responsive line and bar charts.

##  How to Run

1. Clone or download this repository to your local machine.
2. Ensure `index.html`, `style.css`, and `script.js` are in the same folder.
3. Double-click `index.html` to open it in any modern web browser (Chrome, Firefox, Edge, Safari).
4. *No server, node modules, or installations are required!*

##  Educational Concepts Covered

* **FIFO:** Replaces the oldest page. Easy to implement but suffers from Belady's Anomaly.
* **LRU:** Replaces the page not used for the longest time. A stack algorithm that performs well and avoids Belady's Anomaly.
* **OPT:** Replaces the page that won't be used for the longest time in the future. Theoretical minimum faults, used as a benchmark.
* 

##  Project Structure
├── index.html 
├── style.css 
├── script.js 
└── README.md

---


##  Future Improvements

- Add Clock (Second Chance) Algorithm
- Export results as PDF
- Add dark mode toggle

---

## Contributing

Feel free to fork this repo and improve it!

---

## Author

**Venugopal Chukka**
