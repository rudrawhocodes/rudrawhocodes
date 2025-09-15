// Main JavaScript for DSA Visualizer
class DSAVisualizer {
    constructor() {
        this.currentVisualizer = null;
        this.animationSpeed = 500;
        this.isPlaying = false;
        this.isPaused = false;
        this.currentStep = 0;
        this.totalSteps = 0;
        this.currentLanguage = 'java';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.setupModal();
    }

    setupEventListeners() {
        // Navigation
        document.addEventListener('DOMContentLoaded', () => {
            this.updateActiveNavLink();
        });

        window.addEventListener('scroll', () => {
            this.updateActiveNavLink();
        });

        // Hamburger menu
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Speed control
        const speedSlider = document.getElementById('speed-slider');
        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                this.animationSpeed = 1100 - (parseInt(e.target.value) * 100);
            });
        }

        // Language toggle
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                langButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentLanguage = e.target.dataset.lang;
                this.updateCodeDisplay();
            });
        });

        // Control buttons
        this.setupControlButtons();
    }

    setupControlButtons() {
        const playBtn = document.getElementById('play-btn');
        const pauseBtn = document.getElementById('pause-btn');
        const resetBtn = document.getElementById('reset-btn');
        const stepBtn = document.getElementById('step-btn');

        if (playBtn) {
            playBtn.addEventListener('click', () => this.play());
        }
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.pause());
        }
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }
        if (stepBtn) {
            stepBtn.addEventListener('click', () => this.step());
        }
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });
    }

    setupModal() {
        const modal = document.getElementById('visualizer-modal');
        const closeBtn = document.querySelector('.close');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    openVisualizer(type) {
        const modal = document.getElementById('visualizer-modal');
        const modalTitle = document.getElementById('modal-title');
        const visualizationArea = document.getElementById('visualization-area');
        
        // Set title based on type
        const titles = {
            array: 'Array Visualization',
            linkedlist: 'Linked List Visualization',
            stack: 'Stack Visualization',
            queue: 'Queue Visualization',
            tree: 'Binary Tree Visualization',
            graph: 'Graph Visualization'
        };
        
        modalTitle.textContent = titles[type] || 'Data Structure Visualization';
        
        // Clear previous content
        visualizationArea.innerHTML = '';
        
        // Load appropriate visualizer
        this.currentVisualizer = type;
        this.loadVisualizer(type);
        
        // Show modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    openAlgorithm(type) {
        const modal = document.getElementById('visualizer-modal');
        const modalTitle = document.getElementById('modal-title');
        
        const titles = {
            'bubble-sort': 'Bubble Sort Algorithm',
            'quick-sort': 'Quick Sort Algorithm',
            'merge-sort': 'Merge Sort Algorithm',
            'heap-sort': 'Heap Sort Algorithm',
            'linear-search': 'Linear Search Algorithm',
            'binary-search': 'Binary Search Algorithm',
            'bfs': 'Breadth-First Search',
            'dfs': 'Depth-First Search',
            'dijkstra': 'Dijkstra\'s Algorithm'
        };
        
        modalTitle.textContent = titles[type] || 'Algorithm Visualization';
        
        this.currentVisualizer = type;
        this.loadAlgorithm(type);
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('visualizer-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Stop any running animations
        this.pause();
        this.reset();
        this.currentVisualizer = null;
    }

    loadVisualizer(type) {
        const visualizationArea = document.getElementById('visualization-area');
        
        switch(type) {
            case 'array':
                this.loadArrayVisualizer();
                break;
            case 'linkedlist':
                this.loadLinkedListVisualizer();
                break;
            case 'stack':
                this.loadStackVisualizer();
                break;
            case 'queue':
                this.loadQueueVisualizer();
                break;
            case 'tree':
                this.loadTreeVisualizer();
                break;
            case 'graph':
                this.loadGraphVisualizer();
                break;
            default:
                visualizationArea.innerHTML = '<p>Visualizer coming soon!</p>';
        }
        
        this.updateCodeDisplay();
    }

    loadAlgorithm(type) {
        const visualizationArea = document.getElementById('visualization-area');
        
        switch(type) {
            case 'bubble-sort':
            case 'quick-sort':
            case 'merge-sort':
            case 'heap-sort':
                this.loadSortingAlgorithm(type);
                break;
            case 'linear-search':
            case 'binary-search':
                this.loadSearchAlgorithm(type);
                break;
            case 'bfs':
            case 'dfs':
            case 'dijkstra':
                this.loadGraphAlgorithm(type);
                break;
            default:
                visualizationArea.innerHTML = '<p>Algorithm visualization coming soon!</p>';
        }
        
        this.updateCodeDisplay();
    }

    loadArrayVisualizer() {
        const visualizationArea = document.getElementById('visualization-area');
        
        const html = `
            <div class="array-controls">
                <button onclick="dsaVisualizer.generateRandomArray()">Generate Random Array</button>
                <button onclick="dsaVisualizer.addElement()">Add Element</button>
                <button onclick="dsaVisualizer.removeElement()">Remove Element</button>
                <input type="number" id="element-input" placeholder="Value" min="1" max="99">
                <input type="number" id="index-input" placeholder="Index" min="0">
            </div>
            <div id="array-display" class="array-container">
                <!-- Array elements will be displayed here -->
            </div>
        `;
        
        visualizationArea.innerHTML = html;
        this.generateRandomArray();
    }

    loadStackVisualizer() {
        const visualizationArea = document.getElementById('visualization-area');
        
        const html = `
            <div class="stack-controls">
                <button onclick="dsaVisualizer.pushToStack()">Push</button>
                <button onclick="dsaVisualizer.popFromStack()">Pop</button>
                <button onclick="dsaVisualizer.peekStack()">Peek</button>
                <input type="number" id="stack-input" placeholder="Value" min="1" max="99">
            </div>
            <div id="stack-display" class="stack-container">
                <!-- Stack elements will be displayed here -->
            </div>
        `;
        
        visualizationArea.innerHTML = html;
        this.stackData = [];
        this.updateStackDisplay();
    }

    loadQueueVisualizer() {
        const visualizationArea = document.getElementById('visualization-area');
        
        const html = `
            <div class="queue-controls">
                <button onclick="dsaVisualizer.enqueue()">Enqueue</button>
                <button onclick="dsaVisualizer.dequeue()">Dequeue</button>
                <button onclick="dsaVisualizer.queueFront()">Front</button>
                <input type="number" id="queue-input" placeholder="Value" min="1" max="99">
            </div>
            <div id="queue-display" class="queue-container">
                <!-- Queue elements will be displayed here -->
            </div>
        `;
        
        visualizationArea.innerHTML = html;
        this.queueData = [];
        this.updateQueueDisplay();
    }

    loadSortingAlgorithm(type) {
        const visualizationArea = document.getElementById('visualization-area');
        
        const html = `
            <div class="sorting-controls">
                <button onclick="dsaVisualizer.generateRandomArray()">Generate New Array</button>
                <button onclick="dsaVisualizer.startSorting('${type}')">Start ${type.replace('-', ' ').toUpperCase()}</button>
                <div>Array Size: <input type="range" id="array-size" min="5" max="50" value="20" onchange="dsaVisualizer.generateRandomArray()"></div>
            </div>
            <div id="array-display" class="array-container">
                <!-- Array elements will be displayed here -->
            </div>
        `;
        
        visualizationArea.innerHTML = html;
        this.generateRandomArray();
    }

    // Array operations
    generateRandomArray() {
        const sizeSlider = document.getElementById('array-size');
        const size = sizeSlider ? parseInt(sizeSlider.value) : 20;
        
        this.arrayData = Array.from({length: size}, () => Math.floor(Math.random() * 90) + 10);
        this.updateArrayDisplay();
    }

    updateArrayDisplay() {
        const arrayDisplay = document.getElementById('array-display');
        if (!arrayDisplay || !this.arrayData) return;
        
        arrayDisplay.innerHTML = this.arrayData.map((value, index) => `
            <div class="array-element" data-index="${index}">
                ${value}
                <div class="array-index">${index}</div>
            </div>
        `).join('');
    }

    addElement() {
        const input = document.getElementById('element-input');
        const indexInput = document.getElementById('index-input');
        
        if (!input || !this.arrayData) return;
        
        const value = parseInt(input.value) || Math.floor(Math.random() * 90) + 10;
        const index = indexInput && indexInput.value !== '' ? parseInt(indexInput.value) : this.arrayData.length;
        
        if (index >= 0 && index <= this.arrayData.length) {
            this.arrayData.splice(index, 0, value);
            this.updateArrayDisplay();
        }
        
        input.value = '';
        if (indexInput) indexInput.value = '';
    }

    removeElement() {
        const indexInput = document.getElementById('index-input');
        
        if (!this.arrayData || this.arrayData.length === 0) return;
        
        const index = indexInput && indexInput.value !== '' ? parseInt(indexInput.value) : this.arrayData.length - 1;
        
        if (index >= 0 && index < this.arrayData.length) {
            this.arrayData.splice(index, 1);
            this.updateArrayDisplay();
        }
        
        if (indexInput) indexInput.value = '';
    }

    // Stack operations
    pushToStack() {
        const input = document.getElementById('stack-input');
        if (!input) return;
        
        const value = parseInt(input.value) || Math.floor(Math.random() * 90) + 10;
        
        if (!this.stackData) this.stackData = [];
        this.stackData.push(value);
        this.updateStackDisplay();
        
        input.value = '';
    }

    popFromStack() {
        if (!this.stackData || this.stackData.length === 0) return;
        
        this.stackData.pop();
        this.updateStackDisplay();
    }

    peekStack() {
        if (!this.stackData || this.stackData.length === 0) {
            alert('Stack is empty!');
            return;
        }
        
        alert(`Top element: ${this.stackData[this.stackData.length - 1]}`);
    }

    updateStackDisplay() {
        const stackDisplay = document.getElementById('stack-display');
        if (!stackDisplay) return;
        
        if (!this.stackData || this.stackData.length === 0) {
            stackDisplay.innerHTML = '<div class="empty-message">Stack is empty</div>';
            return;
        }
        
        stackDisplay.innerHTML = this.stackData.map((value, index) => `
            <div class="stack-element ${index === this.stackData.length - 1 ? 'top' : ''}">
                ${value}
            </div>
        `).join('');
    }

    // Queue operations
    enqueue() {
        const input = document.getElementById('queue-input');
        if (!input) return;
        
        const value = parseInt(input.value) || Math.floor(Math.random() * 90) + 10;
        
        if (!this.queueData) this.queueData = [];
        this.queueData.push(value);
        this.updateQueueDisplay();
        
        input.value = '';
    }

    dequeue() {
        if (!this.queueData || this.queueData.length === 0) return;
        
        this.queueData.shift();
        this.updateQueueDisplay();
    }

    queueFront() {
        if (!this.queueData || this.queueData.length === 0) {
            alert('Queue is empty!');
            return;
        }
        
        alert(`Front element: ${this.queueData[0]}`);
    }

    updateQueueDisplay() {
        const queueDisplay = document.getElementById('queue-display');
        if (!queueDisplay) return;
        
        if (!this.queueData || this.queueData.length === 0) {
            queueDisplay.innerHTML = '<div class="empty-message">Queue is empty</div>';
            return;
        }
        
        queueDisplay.innerHTML = this.queueData.map((value, index) => `
            <div class="queue-element ${index === 0 ? 'front' : ''} ${index === this.queueData.length - 1 ? 'rear' : ''}">
                ${value}
            </div>
        `).join('');
    }

    updateCodeDisplay() {
        const codeDisplay = document.getElementById('code-display');
        if (!codeDisplay || !this.currentVisualizer) return;
        
        const code = this.getCodeExample(this.currentVisualizer, this.currentLanguage);
        codeDisplay.innerHTML = `<pre><code class="language-${this.currentLanguage === 'cpp' ? 'cpp' : 'java'}">${code}</code></pre>`;
        
        // Re-highlight syntax
        if (window.Prism) {
            Prism.highlightAll();
        }
    }

    getCodeExample(visualizer, language) {
        const codes = {
            array: {
                java: `// Array Implementation in Java
public class Array {
    private int[] data;
    private int size;
    private int capacity;
    
    public Array(int capacity) {
        this.capacity = capacity;
        this.data = new int[capacity];
        this.size = 0;
    }
    
    // Insert element at index
    public void insert(int index, int value) {
        if (size >= capacity) return;
        for (int i = size; i > index; i--) {
            data[i] = data[i - 1];
        }
        data[index] = value;
        size++;
    }
    
    // Delete element at index
    public void delete(int index) {
        for (int i = index; i < size - 1; i++) {
            data[i] = data[i + 1];
        }
        size--;
    }
    
    // Get element at index
    public int get(int index) {
        return data[index];
    }
}`,
                cpp: `// Array Implementation in C++
#include <iostream>
using namespace std;

class Array {
private:
    int* data;
    int size;
    int capacity;
    
public:
    Array(int cap) : capacity(cap), size(0) {
        data = new int[capacity];
    }
    
    // Insert element at index
    void insert(int index, int value) {
        if (size >= capacity) return;
        for (int i = size; i > index; i--) {
            data[i] = data[i - 1];
        }
        data[index] = value;
        size++;
    }
    
    // Delete element at index
    void remove(int index) {
        for (int i = index; i < size - 1; i++) {
            data[i] = data[i + 1];
        }
        size--;
    }
    
    // Get element at index
    int get(int index) {
        return data[index];
    }
    
    ~Array() {
        delete[] data;
    }
};`
            },
            stack: {
                java: `// Stack Implementation in Java
public class Stack {
    private int[] data;
    private int top;
    private int capacity;
    
    public Stack(int capacity) {
        this.capacity = capacity;
        this.data = new int[capacity];
        this.top = -1;
    }
    
    // Push element onto stack
    public void push(int value) {
        if (top >= capacity - 1) return;
        data[++top] = value;
    }
    
    // Pop element from stack
    public int pop() {
        if (top < 0) return -1;
        return data[top--];
    }
    
    // Peek top element
    public int peek() {
        if (top < 0) return -1;
        return data[top];
    }
    
    // Check if stack is empty
    public boolean isEmpty() {
        return top < 0;
    }
}`,
                cpp: `// Stack Implementation in C++
#include <iostream>
using namespace std;

class Stack {
private:
    int* data;
    int top;
    int capacity;
    
public:
    Stack(int cap) : capacity(cap), top(-1) {
        data = new int[capacity];
    }
    
    // Push element onto stack
    void push(int value) {
        if (top >= capacity - 1) return;
        data[++top] = value;
    }
    
    // Pop element from stack
    int pop() {
        if (top < 0) return -1;
        return data[top--];
    }
    
    // Peek top element
    int peek() {
        if (top < 0) return -1;
        return data[top];
    }
    
    // Check if stack is empty
    bool isEmpty() {
        return top < 0;
    }
    
    ~Stack() {
        delete[] data;
    }
};`
            },
            queue: {
                java: `// Queue Implementation in Java
public class Queue {
    private int[] data;
    private int front;
    private int rear;
    private int size;
    private int capacity;
    
    public Queue(int capacity) {
        this.capacity = capacity;
        this.data = new int[capacity];
        this.front = 0;
        this.rear = -1;
        this.size = 0;
    }
    
    // Add element to rear
    public void enqueue(int value) {
        if (size >= capacity) return;
        rear = (rear + 1) % capacity;
        data[rear] = value;
        size++;
    }
    
    // Remove element from front
    public int dequeue() {
        if (size <= 0) return -1;
        int value = data[front];
        front = (front + 1) % capacity;
        size--;
        return value;
    }
    
    // Get front element
    public int front() {
        if (size <= 0) return -1;
        return data[front];
    }
}`,
                cpp: `// Queue Implementation in C++
#include <iostream>
using namespace std;

class Queue {
private:
    int* data;
    int front;
    int rear;
    int size;
    int capacity;
    
public:
    Queue(int cap) : capacity(cap), front(0), rear(-1), size(0) {
        data = new int[capacity];
    }
    
    // Add element to rear
    void enqueue(int value) {
        if (size >= capacity) return;
        rear = (rear + 1) % capacity;
        data[rear] = value;
        size++;
    }
    
    // Remove element from front
    int dequeue() {
        if (size <= 0) return -1;
        int value = data[front];
        front = (front + 1) % capacity;
        size--;
        return value;
    }
    
    // Get front element
    int getFront() {
        if (size <= 0) return -1;
        return data[front];
    }
    
    ~Queue() {
        delete[] data;
    }
};`
            }
        };
        
        return codes[visualizer] && codes[visualizer][language] ? 
               codes[visualizer][language] : 
               '// Code example will be displayed here';
    }

    // Animation controls
    play() {
        this.isPlaying = true;
        this.isPaused = false;
        // Implementation depends on specific visualizer
    }

    pause() {
        this.isPlaying = false;
        this.isPaused = true;
    }

    reset() {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentStep = 0;
        // Reset visualization state
    }

    step() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            // Execute one step of the algorithm
        }
    }
}

// Utility functions
function scrollToSection(sectionId) {
    dsaVisualizer.scrollToSection(sectionId);
}

function openVisualizer(type) {
    dsaVisualizer.openVisualizer(type);
}

function openAlgorithm(type) {
    dsaVisualizer.openAlgorithm(type);
}

function closeModal() {
    dsaVisualizer.closeModal();
}

// Initialize the application
const dsaVisualizer = new DSAVisualizer();