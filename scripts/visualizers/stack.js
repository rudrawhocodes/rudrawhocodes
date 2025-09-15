// Stack Visualizer - Interactive stack operations with animations
class StackVisualizer {
    constructor() {
        this.stack = [];
        this.maxSize = 10;
        this.isAnimating = false;
        this.animationSpeed = 500;
    }

    // Push element onto stack with animation
    async push(value) {
        if (this.isAnimating) return false;
        if (this.stack.length >= this.maxSize) {
            this.showError('Stack Overflow! Cannot push more elements.');
            return false;
        }

        this.isAnimating = true;

        try {
            // Add element with animation
            this.stack.push(value);
            await this.animateStackOperation('push', value);
            this.render();
            return true;
        } finally {
            this.isAnimating = false;
        }
    }

    // Pop element from stack with animation
    async pop() {
        if (this.isAnimating) return null;
        if (this.stack.length === 0) {
            this.showError('Stack Underflow! Cannot pop from empty stack.');
            return null;
        }

        this.isAnimating = true;

        try {
            const value = this.stack.pop();
            await this.animateStackOperation('pop', value);
            this.render();
            return value;
        } finally {
            this.isAnimating = false;
        }
    }

    // Peek at top element
    peek() {
        if (this.stack.length === 0) {
            this.showError('Stack is empty! Nothing to peek.');
            return null;
        }
        
        // Highlight top element
        this.highlightTop();
        return this.stack[this.stack.length - 1];
    }

    // Check if stack is empty
    isEmpty() {
        return this.stack.length === 0;
    }

    // Check if stack is full
    isFull() {
        return this.stack.length >= this.maxSize;
    }

    // Get stack size
    size() {
        return this.stack.length;
    }

    // Render stack visualization
    render() {
        const container = document.getElementById('stack-display');
        if (!container) return;

        if (this.stack.length === 0) {
            container.innerHTML = '<div class="empty-message">Stack is empty</div>';
            return;
        }

        // Render stack elements from bottom to top
        container.innerHTML = this.stack.map((value, index) => {
            const isTop = index === this.stack.length - 1;
            return `
                <div class="stack-element ${isTop ? 'top' : ''}" 
                     data-index="${index}"
                     style="animation-delay: ${index * 0.1}s;">
                    <span class="value">${value}</span>
                    ${isTop ? '<span class="label">TOP</span>' : ''}
                </div>
            `;
        }).reverse().join('');

        // Add stack base
        container.innerHTML += '<div class="stack-base">STACK BASE</div>';
    }

    // Animate stack operations
    async animateStackOperation(operation, value) {
        const container = document.getElementById('stack-display');
        if (!container) return;

        if (operation === 'push') {
            // Create temporary element for push animation
            const tempElement = document.createElement('div');
            tempElement.className = 'stack-element pushing';
            tempElement.innerHTML = `<span class="value">${value}</span>`;
            tempElement.style.opacity = '0';
            tempElement.style.transform = 'translateY(50px)';
            
            container.appendChild(tempElement);
            
            // Animate in
            await this.delay(50);
            tempElement.style.opacity = '1';
            tempElement.style.transform = 'translateY(0)';
            await this.delay(this.animationSpeed);
            
            tempElement.remove();
        } else if (operation === 'pop') {
            // Find and animate out the top element
            const topElement = container.querySelector('.stack-element.top');
            if (topElement) {
                topElement.classList.add('popping');
                topElement.style.transform = 'translateY(-50px)';
                topElement.style.opacity = '0';
                await this.delay(this.animationSpeed);
            }
        }
    }

    // Highlight top element
    highlightTop() {
        const container = document.getElementById('stack-display');
        if (!container) return;

        // Remove previous highlights
        container.querySelectorAll('.highlighted').forEach(el => {
            el.classList.remove('highlighted');
        });

        // Highlight current top
        const topElement = container.querySelector('.stack-element.top');
        if (topElement) {
            topElement.classList.add('highlighted');
            setTimeout(() => {
                topElement.classList.remove('highlighted');
            }, 2000);
        }
    }

    // Show error message
    showError(message) {
        const container = document.getElementById('stack-display');
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

    // Clear stack
    clear() {
        this.stack = [];
        this.render();
    }

    // Set maximum stack size
    setMaxSize(size) {
        this.maxSize = Math.max(1, size);
    }

    // Get stack data
    getData() {
        return [...this.stack];
    }

    // Set animation speed
    setAnimationSpeed(speed) {
        this.animationSpeed = speed;
    }

    // Utility delay function
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Demonstrate stack operations
    async demonstrate() {
        if (this.isAnimating) return;

        const operations = [
            { op: 'push', value: 10 },
            { op: 'push', value: 20 },
            { op: 'push', value: 30 },
            { op: 'peek' },
            { op: 'pop' },
            { op: 'push', value: 40 },
            { op: 'pop' },
            { op: 'pop' }
        ];

        for (const operation of operations) {
            if (operation.op === 'push') {
                await this.push(operation.value);
            } else if (operation.op === 'pop') {
                await this.pop();
            } else if (operation.op === 'peek') {
                this.peek();
            }
            await this.delay(1000);
        }
    }
}

// Export for use in main application
if (typeof window !== 'undefined') {
    window.StackVisualizer = StackVisualizer;
}