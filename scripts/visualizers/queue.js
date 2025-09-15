// Queue Visualizer - Interactive queue operations with animations
class QueueVisualizer {
    constructor() {
        this.queue = [];
        this.maxSize = 8;
        this.isAnimating = false;
        this.animationSpeed = 500;
        this.frontIndex = 0;
        this.rearIndex = -1;
    }

    // Enqueue element with animation
    async enqueue(value) {
        if (this.isAnimating) return false;
        if (this.queue.length >= this.maxSize) {
            this.showError('Queue Overflow! Cannot enqueue more elements.');
            return false;
        }

        this.isAnimating = true;

        try {
            // Add element with animation
            this.queue.push(value);
            this.rearIndex++;
            await this.animateQueueOperation('enqueue', value);
            this.render();
            return true;
        } finally {
            this.isAnimating = false;
        }
    }

    // Dequeue element with animation
    async dequeue() {
        if (this.isAnimating) return null;
        if (this.queue.length === 0) {
            this.showError('Queue Underflow! Cannot dequeue from empty queue.');
            return null;
        }

        this.isAnimating = true;

        try {
            const value = this.queue.shift();
            this.frontIndex++;
            await this.animateQueueOperation('dequeue', value);
            this.render();
            return value;
        } finally {
            this.isAnimating = false;
        }
    }

    // Get front element
    front() {
        if (this.queue.length === 0) {
            this.showError('Queue is empty! Nothing at front.');
            return null;
        }
        
        // Highlight front element
        this.highlightElement('front');
        return this.queue[0];
    }

    // Get rear element
    rear() {
        if (this.queue.length === 0) {
            this.showError('Queue is empty! Nothing at rear.');
            return null;
        }
        
        // Highlight rear element
        this.highlightElement('rear');
        return this.queue[this.queue.length - 1];
    }

    // Check if queue is empty
    isEmpty() {
        return this.queue.length === 0;
    }

    // Check if queue is full
    isFull() {
        return this.queue.length >= this.maxSize;
    }

    // Get queue size
    size() {
        return this.queue.length;
    }

    // Render queue visualization
    render() {
        const container = document.getElementById('queue-display');
        if (!container) return;

        if (this.queue.length === 0) {
            container.innerHTML = '<div class="empty-message">Queue is empty</div>';
            return;
        }

        // Render queue elements from front to rear
        container.innerHTML = `
            <div class="queue-labels">
                <span class="queue-label front-label">FRONT</span>
                <span class="queue-label rear-label">REAR</span>
            </div>
            <div class="queue-elements">
                ${this.queue.map((value, index) => {
                    const isFront = index === 0;
                    const isRear = index === this.queue.length - 1;
                    return `
                        <div class="queue-element ${isFront ? 'front' : ''} ${isRear ? 'rear' : ''}" 
                             data-index="${index}"
                             style="animation-delay: ${index * 0.1}s;">
                            <span class="value">${value}</span>
                            <span class="position">${index}</span>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="queue-arrow">
                <span>→ Direction of flow →</span>
            </div>
        `;
    }

    // Animate queue operations
    async animateQueueOperation(operation, value) {
        const container = document.getElementById('queue-display');
        if (!container) return;

        if (operation === 'enqueue') {
            // Create temporary element for enqueue animation
            const tempElement = document.createElement('div');
            tempElement.className = 'queue-element enqueueing';
            tempElement.innerHTML = `<span class="value">${value}</span>`;
            tempElement.style.cssText = `
                opacity: 0;
                transform: translateX(50px);
                position: absolute;
                right: 0;
                top: 50%;
                z-index: 10;
            `;
            
            container.style.position = 'relative';
            container.appendChild(tempElement);
            
            // Animate in
            await this.delay(50);
            tempElement.style.opacity = '1';
            tempElement.style.transform = 'translateX(0)';
            await this.delay(this.animationSpeed);
            
            tempElement.remove();
        } else if (operation === 'dequeue') {
            // Find and animate out the front element
            const frontElement = container.querySelector('.queue-element.front');
            if (frontElement) {
                frontElement.classList.add('dequeueing');
                frontElement.style.transform = 'translateX(-100px)';
                frontElement.style.opacity = '0';
                await this.delay(this.animationSpeed);

                // Animate remaining elements sliding left
                const elements = container.querySelectorAll('.queue-element:not(.dequeueing)');
                elements.forEach((el, index) => {
                    el.style.transform = 'translateX(-80px)';
                    setTimeout(() => {
                        el.style.transform = 'translateX(0)';
                    }, index * 50);
                });
                await this.delay(this.animationSpeed / 2);
            }
        }
    }

    // Highlight specific element
    highlightElement(position) {
        const container = document.getElementById('queue-display');
        if (!container) return;

        // Remove previous highlights
        container.querySelectorAll('.highlighted').forEach(el => {
            el.classList.remove('highlighted');
        });

        // Highlight specified element
        const element = container.querySelector(`.queue-element.${position}`);
        if (element) {
            element.classList.add('highlighted');
            setTimeout(() => {
                element.classList.remove('highlighted');
            }, 2000);
        }
    }

    // Show error message
    showError(message) {
        const container = document.getElementById('queue-display');
        if (!container) return;

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--error-color);
            color: white;
            padding: 1rem;
            border-radius: var(--border-radius);
            z-index: 100;
            animation: fadeInOut 3s ease-in-out;
        `;

        container.style.position = 'relative';
        container.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    // Clear queue
    clear() {
        this.queue = [];
        this.frontIndex = 0;
        this.rearIndex = -1;
        this.render();
    }

    // Set maximum queue size
    setMaxSize(size) {
        this.maxSize = Math.max(1, size);
    }

    // Get queue data
    getData() {
        return [...this.queue];
    }

    // Set animation speed
    setAnimationSpeed(speed) {
        this.animationSpeed = speed;
    }

    // Utility delay function
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Demonstrate queue operations
    async demonstrate() {
        if (this.isAnimating) return;

        const operations = [
            { op: 'enqueue', value: 10 },
            { op: 'enqueue', value: 20 },
            { op: 'enqueue', value: 30 },
            { op: 'front' },
            { op: 'rear' },
            { op: 'dequeue' },
            { op: 'enqueue', value: 40 },
            { op: 'dequeue' },
            { op: 'dequeue' }
        ];

        for (const operation of operations) {
            if (operation.op === 'enqueue') {
                await this.enqueue(operation.value);
            } else if (operation.op === 'dequeue') {
                await this.dequeue();
            } else if (operation.op === 'front') {
                this.front();
            } else if (operation.op === 'rear') {
                this.rear();
            }
            await this.delay(1500);
        }
    }

    // Circular queue implementation
    implementCircularQueue() {
        // This would implement a circular queue version
        // with fixed array size and wrap-around behavior
        console.log('Circular queue implementation coming soon!');
    }
}

// Export for use in main application
if (typeof window !== 'undefined') {
    window.QueueVisualizer = QueueVisualizer;
}