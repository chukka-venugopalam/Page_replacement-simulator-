# Page_replacement-simulator-

A simple and interactive web-based simulator for the ** Page Replacement Algorithms** used in Operating Systems.

This project helps visualize how pages are loaded into memory frames and how page faults and hits occur step-by-step.

---

##  Features

- Input custom **reference string**
- Set **number of frames**
- Step-by-step **visual table representation**
- Displays:
  -  Page Hits
  -  Page Faults
  -  Hit Ratio
- Color-coded output:
  - Green → Hit
  - Red → Fault

---

##  Tech Stack

- HTML
- CSS
- JavaScript (Vanilla)

---

## How It Works

1. Enter a reference string (comma or space separated)
2. Enter number of frames
3. Click **Simulate FIFO**
4. View:
   - Frame allocation
   - Hit/Fault sequence
   - Performance metrics

---

##  Example Input
Reference String: 7 0 1 2 0 3 0 4 Frames: 3

---

##  Project Structure
page-replacement-simukator/ 
│── index.html 
│── style.css 
│── script.js 
│── README.md

---

##  Algorithm Used

**FIFO (First-In First-Out)**:
- Oldest page in memory is replaced first
- Uses a circular pointer to track replacement
**LRU (Least Recently Used)**:
-Replaces the page that was used least recently
  Uses past access history to decide which page to remove

---

##  Learning Outcome

- Understanding of **Page Replacement Algorithms**
- Visualization of **Memory Management**
- Strengthens **Operating Systems concepts (GATE relevant)**

---

##  Future Improvements

- Add:
  - Optimal Page Replacement
- Add step-by-step animation
- Add comparison between algorithms

---

## Author

**Chukka Venugopalam **  
- Web Developer  
- GATE Aspirant  
- DSA Learner  
- Python Enthusiast  

---

## Support
If you like this project, give it a ⭐ on GitHub!
