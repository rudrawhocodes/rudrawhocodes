// Array Visualizer - Enhanced array operations with animations
class ArrayVisualizer {
    constructor() {
        this.array = [];
        this.isAnimating = false;
        this.highlightedIndices = new Set();
        this.animationSpeed = 500;
    }

    // Generate random array
    generateArray(size = 20) {
        this.array = Array.from({length: size}, () => Math.floor(Math.random() * 90) + 10);
        this.render();
    }

    // Render array visualization
    render() {
        const container = document.getElementById('array-display');
        if (!container) return;

        container.innerHTML = this.array.map((value, index) => {
            const highlighted = this.highlightedIndices.has(index);
            return `
                <div class="array-element ${highlighted ? 'active' : ''}" 
                     data-index="${index}" 
                     style="height: ${value + 20}px;">
                    <span class="value">${value}</span>
                    <span class="index">${index}</span>
                </div>
            `;
        }).join('');
    }

    // Highlight specific indices
    highlight(indices, className = 'active') {
        if (!Array.isArray(indices)) indices = [indices];
        
        this.highlightedIndices.clear();
        indices.forEach(index => {
            if (index >= 0 && index < this.array.length) {
                this.highlightedIndices.add(index);
            }
        });
        
        this.render();
    }

    // Clear all highlights
    clearHighlights() {
        this.highlightedIndices.clear();
        this.render();
    }

    // Insert element with animation
    async insert(index, value) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        try {
            // Validate inputs
            if (index < 0 || index > this.array.length) {
                throw new Error('Invalid index');
            }

            // Highlight insertion point
            this.highlight(index, 'inserting');
            await this.delay(this.animationSpeed);

            // Shift elements to the right
            for (let i = this.array.length; i > index; i--) {
                this.highlight([i-1, i], 'shifting');
                await this.delay(this.animationSpeed / 2);
            }

            // Insert the new element
            this.array.splice(index, 0, value);
            this.highlight(index, 'inserted');
            await this.delay(this.animationSpeed);

            this.clearHighlights();
        } catch (error) {
            console.error('Insert operation failed:', error);
        } finally {
            this.isAnimating = false;
        }
    }

    // Delete element with animation
    async delete(index) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        try {
            if (index < 0 || index >= this.array.length) {
                throw new Error('Invalid index');
            }

            // Highlight element to be deleted
            this.highlight(index, 'deleting');
            await this.delay(this.animationSpeed);

            // Remove element
            this.array.splice(index, 1);

            // Animate shifting elements left
            for (let i = index; i < this.array.length; i++) {
                this.highlight(i, 'shifting');
                await this.delay(this.animationSpeed / 2);
            }

            this.clearHighlights();
        } catch (error) {
            console.error('Delete operation failed:', error);
        } finally {
            this.isAnimating = false;
        }
    }

    // Search for element with animation
    async linearSearch(target) {
        if (this.isAnimating) return -1;
        this.isAnimating = true;

        try {
            for (let i = 0; i < this.array.length; i++) {
                this.highlight(i, 'searching');
                await this.delay(this.animationSpeed);

                if (this.array[i] === target) {
                    this.highlight(i, 'found');
                    await this.delay(this.animationSpeed * 2);
                    this.clearHighlights();
                    return i;
                }
            }

            this.clearHighlights();
            return -1;
        } finally {
            this.isAnimating = false;
        }
    }

    // Binary search with animation (requires sorted array)
    async binarySearch(target) {
        if (this.isAnimating) return -1;
        this.isAnimating = true;

        try {
            let left = 0;
            let right = this.array.length - 1;

            while (left <= right) {
                const mid = Math.floor((left + right) / 2);
                
                // Highlight search range
                this.highlight([left, mid, right], 'searching');
                await this.delay(this.animationSpeed);

                if (this.array[mid] === target) {
                    this.highlight(mid, 'found');
                    await this.delay(this.animationSpeed * 2);
                    this.clearHighlights();
                    return mid;
                } else if (this.array[mid] < target) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }

            this.clearHighlights();
            return -1;
        } finally {
            this.isAnimating = false;
        }
    }

    // Utility delay function
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Get array data
    getData() {
        return [...this.array];
    }

    // Set array data
    setData(data) {
        this.array = [...data];
        this.render();
    }

    // Get array size
    size() {
        return this.array.length;
    }

    // Check if index is valid
    isValidIndex(index) {
        return index >= 0 && index < this.array.length;
    }
}

// Export for use in main application
if (typeof window !== 'undefined') {
    window.ArrayVisualizer = ArrayVisualizer;
}