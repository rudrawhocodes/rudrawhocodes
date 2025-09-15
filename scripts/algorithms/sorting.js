// Sorting Algorithms Visualizer - Interactive sorting with step-by-step animations
class SortingVisualizer {
    constructor() {
        this.array = [];
        this.isAnimating = false;
        this.animationSpeed = 500;
        this.currentAlgorithm = null;
        this.comparisons = 0;
        this.swaps = 0;
        this.steps = [];
        this.currentStep = 0;
    }

    // Initialize array with random values
    generateArray(size = 20) {
        this.array = Array.from({length: size}, () => Math.floor(Math.random() * 300) + 10);
        this.resetStats();
        this.render();
    }

    // Reset statistics
    resetStats() {
        this.comparisons = 0;
        this.swaps = 0;
        this.currentStep = 0;
        this.steps = [];
        this.updateStats();
    }

    // Update statistics display
    updateStats() {
        const statsContainer = document.querySelector('.sorting-stats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="stat">
                    <span class="stat-label">Comparisons:</span>
                    <span class="stat-value">${this.comparisons}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Swaps:</span>
                    <span class="stat-value">${this.swaps}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Steps:</span>
                    <span class="stat-value">${this.currentStep}</span>
                </div>
            `;
        }
    }

    // Render array visualization
    render(comparing = [], swapping = [], sorted = []) {
        const container = document.getElementById('array-display');
        if (!container || !this.array) return;

        const maxValue = Math.max(...this.array);
        
        container.innerHTML = this.array.map((value, index) => {
            let className = 'array-element';
            if (comparing.includes(index)) className += ' comparing';
            if (swapping.includes(index)) className += ' swapping';
            if (sorted.includes(index)) className += ' sorted';

            const height = (value / maxValue) * 250 + 30;
            
            return `
                <div class="${className}" 
                     data-index="${index}" 
                     style="height: ${height}px;">
                    <span class="value">${value}</span>
                    <span class="index">${index}</span>
                </div>
            `;
        }).join('');

        // Add stats container if it doesn't exist
        if (!document.querySelector('.sorting-stats')) {
            const statsDiv = document.createElement('div');
            statsDiv.className = 'sorting-stats';
            container.parentNode.insertBefore(statsDiv, container.nextSibling);
        }
        this.updateStats();
    }

    // Utility delay function
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Swap two elements with animation
    async swap(i, j) {
        if (i === j) return;
        
        this.swaps++;
        this.render([], [i, j]);
        await this.delay(this.animationSpeed);
        
        [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
        this.render();
        await this.delay(this.animationSpeed / 2);
    }

    // Compare two elements
    async compare(i, j) {
        this.comparisons++;
        this.render([i, j]);
        await this.delay(this.animationSpeed / 2);
        return this.array[i] > this.array[j];
    }

    // BUBBLE SORT
    async bubbleSort() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        this.currentAlgorithm = 'bubble-sort';
        this.resetStats();

        try {
            const n = this.array.length;
            const sorted = [];

            for (let i = 0; i < n - 1; i++) {
                for (let j = 0; j < n - i - 1; j++) {
                    this.currentStep++;
                    
                    if (await this.compare(j, j + 1)) {
                        await this.swap(j, j + 1);
                    }
                }
                sorted.push(n - i - 1);
                this.render([], [], sorted);
                await this.delay(this.animationSpeed);
            }
            
            sorted.push(0);
            this.render([], [], sorted);
            this.showCompletion('Bubble Sort');
        } finally {
            this.isAnimating = false;
        }
    }

    // SELECTION SORT
    async selectionSort() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        this.currentAlgorithm = 'selection-sort';
        this.resetStats();

        try {
            const n = this.array.length;
            const sorted = [];

            for (let i = 0; i < n - 1; i++) {
                let minIdx = i;
                
                for (let j = i + 1; j < n; j++) {
                    this.currentStep++;
                    
                    if (await this.compare(minIdx, j)) {
                        minIdx = j;
                    }
                    this.render([i, j, minIdx]);
                }
                
                if (minIdx !== i) {
                    await this.swap(i, minIdx);
                }
                
                sorted.push(i);
                this.render([], [], sorted);
                await this.delay(this.animationSpeed);
            }
            
            sorted.push(n - 1);
            this.render([], [], sorted);
            this.showCompletion('Selection Sort');
        } finally {
            this.isAnimating = false;
        }
    }

    // INSERTION SORT
    async insertionSort() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        this.currentAlgorithm = 'insertion-sort';
        this.resetStats();

        try {
            const n = this.array.length;
            const sorted = [0];

            for (let i = 1; i < n; i++) {
                let j = i;
                
                while (j > 0) {
                    this.currentStep++;
                    
                    if (await this.compare(j - 1, j)) {
                        await this.swap(j - 1, j);
                        j--;
                    } else {
                        break;
                    }
                }
                
                sorted.push(i);
                this.render([], [], [...sorted]);
                await this.delay(this.animationSpeed);
            }
            
            this.showCompletion('Insertion Sort');
        } finally {
            this.isAnimating = false;
        }
    }

    // QUICK SORT
    async quickSort(low = 0, high = this.array.length - 1, sorted = []) {
        if (!this.isAnimating && low === 0 && high === this.array.length - 1) {
            this.isAnimating = true;
            this.currentAlgorithm = 'quick-sort';
            this.resetStats();
        }

        if (low < high) {
            const pi = await this.partition(low, high);
            
            if (low === high - 1 || low === high) {
                sorted.push(low, high);
            }
            
            await this.quickSort(low, pi - 1, sorted);
            await this.quickSort(pi + 1, high, sorted);
        }

        if (low === 0 && high === this.array.length - 1) {
            // Final render with all elements sorted
            this.render([], [], Array.from({length: this.array.length}, (_, i) => i));
            this.showCompletion('Quick Sort');
            this.isAnimating = false;
        }
    }

    async partition(low, high) {
        const pivot = this.array[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            this.currentStep++;
            this.render([j, high], [], []);
            await this.delay(this.animationSpeed / 2);

            if (this.array[j] < pivot) {
                i++;
                this.comparisons++;
                if (i !== j) {
                    await this.swap(i, j);
                }
            }
        }

        await this.swap(i + 1, high);
        return i + 1;
    }

    // MERGE SORT
    async mergeSort(left = 0, right = this.array.length - 1) {
        if (!this.isAnimating && left === 0 && right === this.array.length - 1) {
            this.isAnimating = true;
            this.currentAlgorithm = 'merge-sort';
            this.resetStats();
        }

        if (left < right) {
            const mid = Math.floor((left + right) / 2);
            
            await this.mergeSort(left, mid);
            await this.mergeSort(mid + 1, right);
            await this.merge(left, mid, right);
        }

        if (left === 0 && right === this.array.length - 1) {
            this.render([], [], Array.from({length: this.array.length}, (_, i) => i));
            this.showCompletion('Merge Sort');
            this.isAnimating = false;
        }
    }

    async merge(left, mid, right) {
        const leftArr = this.array.slice(left, mid + 1);
        const rightArr = this.array.slice(mid + 1, right + 1);
        
        let i = 0, j = 0, k = left;

        while (i < leftArr.length && j < rightArr.length) {
            this.currentStep++;
            this.comparisons++;
            
            this.render([left + i, mid + 1 + j]);
            await this.delay(this.animationSpeed);

            if (leftArr[i] <= rightArr[j]) {
                this.array[k] = leftArr[i];
                i++;
            } else {
                this.array[k] = rightArr[j];
                j++;
            }
            k++;
            this.render();
            await this.delay(this.animationSpeed / 2);
        }

        while (i < leftArr.length) {
            this.array[k] = leftArr[i];
            i++;
            k++;
            this.render();
            await this.delay(this.animationSpeed / 4);
        }

        while (j < rightArr.length) {
            this.array[k] = rightArr[j];
            j++;
            k++;
            this.render();
            await this.delay(this.animationSpeed / 4);
        }
    }

    // Show completion message
    showCompletion(algorithmName) {
        const container = document.getElementById('array-display');
        if (!container) return;

        const completionDiv = document.createElement('div');
        completionDiv.className = 'completion-message';
        completionDiv.innerHTML = `
            <h3>✅ ${algorithmName} Complete!</h3>
            <p>Comparisons: ${this.comparisons} | Swaps: ${this.swaps} | Steps: ${this.currentStep}</p>
        `;
        completionDiv.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--success-color);
            color: white;
            padding: 2rem;
            border-radius: var(--border-radius);
            text-align: center;
            z-index: 100;
            animation: fadeInOut 4s ease-in-out;
        `;

        container.style.position = 'relative';
        container.appendChild(completionDiv);

        setTimeout(() => {
            completionDiv.remove();
        }, 4000);
    }

    // Start sorting with specified algorithm
    async startSorting(algorithm) {
        if (this.isAnimating) return;

        switch (algorithm) {
            case 'bubble-sort':
                await this.bubbleSort();
                break;
            case 'selection-sort':
                await this.selectionSort();
                break;
            case 'insertion-sort':
                await this.insertionSort();
                break;
            case 'quick-sort':
                await this.quickSort();
                break;
            case 'merge-sort':
                await this.mergeSort();
                break;
            default:
                console.log('Unknown sorting algorithm:', algorithm);
        }
    }

    // Stop current sorting
    stop() {
        this.isAnimating = false;
    }

    // Set animation speed
    setSpeed(speed) {
        this.animationSpeed = 1100 - (speed * 100);
    }

    // Get array copy
    getArray() {
        return [...this.array];
    }

    // Set array data
    setArray(data) {
        this.array = [...data];
        this.render();
    }
}

// Export for use in main application
if (typeof window !== 'undefined') {
    window.SortingVisualizer = SortingVisualizer;
}