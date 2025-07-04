import { wsManager } from '../common/websocket.js';
import { API } from '../common/api.js';
import { ActivityFeed } from '../components/activity-feed.js';
import { formatDuration, formatBytes } from '../common/utils.js';

/**
 * Dashboard Page Controller
 * Manages dashboard-specific functionality
 */
class Dashboard {
    constructor() {
        this.currentFile = null;
        this.currentJobId = null;
        this.isTraining = false;
        this.activityFeed = null;
        
        this.init();
    }
    
    async init() {
        // Initialize components
        this.initializeComponents();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup WebSocket listeners
        this.setupWebSocketListeners();
        
        // Load initial data
        await this.loadInitialData();
    }
    
    initializeComponents() {
        // Initialize activity feed if container exists
        const activityContainer = document.getElementById('activityFeed');
        if (activityContainer) {
            this.activityFeed = new ActivityFeed('activityFeed');
        }
    }
    
    setupEventListeners() {
        // File upload
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }
        
        // Upload area click and drag and drop
        const uploadArea = document.querySelector('.upload-area');
        if (uploadArea) {
            uploadArea.addEventListener('click', () => {
                const fileInput = document.getElementById('fileInput');
                if (fileInput) fileInput.click();
            });
            uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
            uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            uploadArea.addEventListener('drop', (e) => this.handleFileDrop(e));
        }
        
        // Training button
        const trainButton = document.getElementById('trainButton');
        if (trainButton) {
            trainButton.addEventListener('click', () => this.startTraining());
        }
        
        // Advanced options toggle
        const advancedToggle = document.getElementById('advancedToggle');
        if (advancedToggle) {
            advancedToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleAdvanced();
            });
        }
        
        // Use model button
        const useModelButton = document.getElementById('useModelButton');
        if (useModelButton) {
            useModelButton.addEventListener('click', () => this.useModel());
        }
        
        // View details button
        const viewDetailsButton = document.getElementById('viewDetailsButton');
        if (viewDetailsButton) {
            viewDetailsButton.addEventListener('click', () => this.viewDetails());
        }
    }
    
    setupWebSocketListeners() {
        // Training progress updates
        wsManager.on('training_progress', (data) => {
            this.updateTrainingProgress(data);
        });
        
        // Training completed
        wsManager.on('training_completed', (data) => {
            this.handleTrainingCompleted(data);
        });
        
        // Training failed
        wsManager.on('training_failed', (data) => {
            this.handleTrainingFailed(data);
        });
        
        // System metrics updates
        wsManager.on('system_metrics', (data) => {
            this.updateSystemMetrics(data);
        });
        
        // Health changes
        wsManager.on('health_change', (data) => {
            this.updateSystemHealth(data);
        });
    }
    
    async loadInitialData() {
        try {
            // Load current models
            await this.loadCurrentModelMetrics();
            
            // Load system status
            await this.loadSystemStatus();
            
        } catch (error) {
            console.error('Failed to load initial data:', error);
        }
    }
    
    async loadCurrentModelMetrics() {
        try {
            const models = await API.getModels();
            const activeModel = models.find(m => m.status === 'active' || m.status === 'deployed');
            
            if (activeModel) {
                this.updateCurrentModelDisplay(activeModel);
            }
        } catch (error) {
            console.error('Failed to load model metrics:', error);
        }
    }
    
    async loadSystemStatus() {
        try {
            const status = await API.getSystemStatus();
            this.updateSystemStatusDisplay(status);
        } catch (error) {
            console.error('Failed to load system status:', error);
        }
    }
    
    updateCurrentModelDisplay(model) {
        // Update model name and info
        const modelNameEl = document.querySelector('.card strong');
        if (modelNameEl) {
            modelNameEl.textContent = model.name;
        }
        
        // Update accuracy
        const accuracyEl = document.getElementById('liveAccuracy');
        if (accuracyEl) {
            accuracyEl.textContent = `${(model.accuracy * 100).toFixed(1)}%`;
        }
        
        // Update predictions
        const predictionsEl = document.getElementById('livePredictions');
        if (predictionsEl && model.predictions_made > 0) {
            // Calculate rate based on model age
            const hoursSinceCreated = (Date.now() - new Date(model.created_at)) / (1000 * 60 * 60);
            const rate = Math.max(1, Math.round(model.predictions_made / hoursSinceCreated / 60));
            predictionsEl.textContent = `${rate}/min`;
        }
    }
    
    updateSystemStatusDisplay(status) {
        // Update system health indicator
        const healthEl = document.getElementById('systemHealth');
        if (healthEl) {
            healthEl.textContent = status.system_health === 'healthy' ? '✅' : '⚠️';
        }
        
        // Update training status if active
        if (status.active_training_jobs > 0) {
            this.showTrainingInProgress();
        }
    }
    
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }
    
    handleDragOver(event) {
        event.preventDefault();
        event.target.classList.add('dragover');
    }
    
    handleDragLeave(event) {
        event.preventDefault();
        event.target.classList.remove('dragover');
    }
    
    handleFileDrop(event) {
        event.preventDefault();
        event.target.classList.remove('dragover');
        
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }
    
    async processFile(file) {
        if (!file.name.endsWith('.csv')) {
            this.showError('Please select a CSV file');
            return;
        }
        
        const uploadArea = document.querySelector('.upload-area');
        const trainButton = document.getElementById('trainButton');
        
        try {
            // Show upload progress
            uploadArea.innerHTML = `
                <div class="upload-icon">📤</div>
                <h4>Uploading...</h4>
                <div class="progress-bar" style="margin-top: 1rem;">
                    <div class="progress-fill" id="uploadProgress" style="width: 0%"></div>
                </div>
            `;
            
            // Upload file with progress
            const result = await API.upload(file, (progress) => {
                const progressEl = document.getElementById('uploadProgress');
                if (progressEl) {
                    progressEl.style.width = `${progress}%`;
                }
            });
            
            // Update UI with success
            this.currentFile = result;
            this.showFileUploadSuccess(result);
            
            // Enable training button
            if (trainButton) {
                trainButton.disabled = false;
                trainButton.textContent = 'Start Training';
            }
            
        } catch (error) {
            console.error('Upload failed:', error);
            this.showError(`Upload failed: ${error.message}`);
            this.resetUploadArea();
        }
    }
    
    showFileUploadSuccess(result) {
        const uploadArea = document.querySelector('.upload-area');
        uploadArea.innerHTML = `
            <div class="upload-icon">✅</div>
            <h4>File uploaded successfully!</h4>
            <p style="color: var(--text-secondary); margin-top: var(--spacing-sm);">
                ${result.filename} (${result.rows} rows, ${result.columns} columns)
            </p>
        `;
    }
    
    resetUploadArea() {
        const uploadArea = document.querySelector('.upload-area');
        uploadArea.innerHTML = `
            <div class="upload-icon">📊</div>
            <h4>Upload Your Data</h4>
            <p style="color: var(--text-secondary); margin-top: var(--spacing-sm);">
                Click here or drag & drop your CSV file
            </p>
        `;
    }
    
    async startTraining() {
        if (!this.currentFile || this.isTraining) {
            return;
        }
        
        try {
            const response = await API.startTraining({
                file_path: this.currentFile.file_path,
                model_type: 'automatic'
            });
            
            this.currentJobId = response.job_id;
            this.isTraining = true;
            
            // Update UI
            this.showTrainingInProgress();
            
        } catch (error) {
            console.error('Training failed to start:', error);
            this.showError(`Failed to start training: ${error.message}`);
        }
    }
    
    showTrainingInProgress() {
        // Show detailed training card
        const detailedCard = document.getElementById('detailedTrainingCard');
        if (detailedCard) {
            detailedCard.style.display = 'block';
        }
        
        // Update training button
        const trainButton = document.getElementById('trainButton');
        if (trainButton) {
            trainButton.disabled = true;
            trainButton.textContent = 'Training in Progress...';
        }
    }
    
    updateTrainingProgress(data) {
        // Update main progress bar
        const mainProgressBar = document.getElementById('mainProgressBar');
        if (mainProgressBar) {
            mainProgressBar.style.width = `${data.progress}%`;
            mainProgressBar.classList.add('active');
        }
        
        // Update stage info
        const stageEl = document.getElementById('trainingStage');
        if (stageEl) {
            stageEl.textContent = data.current_stage;
        }
        
        const percentEl = document.getElementById('trainingPercent');
        if (percentEl) {
            percentEl.textContent = `${data.progress}%`;
        }
        
        // Update detailed progress if visible
        this.updateDetailedTrainingProgress(data);
    }
    
    updateDetailedTrainingProgress(data) {
        // Update current stage
        const currentStageEl = document.getElementById('currentTrainingStage');
        if (currentStageEl) {
            currentStageEl.textContent = data.current_stage;
        }
        
        // Update time remaining
        const timeRemainingEl = document.getElementById('trainingTimeRemaining');
        if (timeRemainingEl && data.estimated_remaining) {
            timeRemainingEl.textContent = `Estimated: ${data.estimated_remaining} remaining`;
        }
        
        // Update live accuracy if available
        if (data.live_accuracy) {
            const liveAccuracyEl = document.getElementById('liveTrainingAccuracy');
            if (liveAccuracyEl) {
                liveAccuracyEl.textContent = `${(data.live_accuracy * 100).toFixed(1)}%`;
            }
        }
        
        // Update predictions processed
        if (data.predictions_processed) {
            const predictionsEl = document.getElementById('predictionsProcessed');
            if (predictionsEl) {
                predictionsEl.textContent = data.predictions_processed.toLocaleString();
            }
        }
        
        // Update elapsed time
        if (data.elapsed_time) {
            const elapsedEl = document.getElementById('trainingElapsedTime');
            if (elapsedEl) {
                elapsedEl.textContent = data.elapsed_time;
            }
        }
    }
    
    handleTrainingCompleted(data) {
        this.isTraining = false;
        
        // Update progress to 100%
        const mainProgressBar = document.getElementById('mainProgressBar');
        if (mainProgressBar) {
            mainProgressBar.style.width = '100%';
            mainProgressBar.classList.remove('active');
        }
        
        // Show success message
        this.showSuccess(`Training completed! Final accuracy: ${(data.final_accuracy * 100).toFixed(1)}%`);
        
        // Reset training button
        const trainButton = document.getElementById('trainButton');
        if (trainButton) {
            trainButton.disabled = false;
            trainButton.textContent = 'Start Training';
        }
        
        // Hide detailed training card after a delay
        setTimeout(() => {
            const detailedCard = document.getElementById('detailedTrainingCard');
            if (detailedCard) {
                detailedCard.style.display = 'none';
            }
        }, 5000);
        
        // Reload model metrics
        this.loadCurrentModelMetrics();
    }
    
    handleTrainingFailed(data) {
        this.isTraining = false;
        
        // Show error
        this.showError(`Training failed: ${data.error || 'Unknown error'}`);
        
        // Reset UI
        const trainButton = document.getElementById('trainButton');
        if (trainButton) {
            trainButton.disabled = false;
            trainButton.textContent = 'Start Training';
        }
        
        const detailedCard = document.getElementById('detailedTrainingCard');
        if (detailedCard) {
            detailedCard.style.display = 'none';
        }
    }
    
    updateSystemMetrics(data) {
        // This would update real-time system metrics
        // For now, we'll keep the existing static display
        // but this is where live CPU, memory, disk usage would be updated
    }
    
    updateSystemHealth(data) {
        const healthEl = document.getElementById('systemHealth');
        if (healthEl) {
            switch (data.current_health) {
                case 'critical':
                    healthEl.textContent = '🚨';
                    break;
                case 'warning':
                    healthEl.textContent = '⚠️';
                    break;
                default:
                    healthEl.textContent = '✅';
            }
        }
    }
    
    toggleAdvanced() {
        const container = document.querySelector('.card');
        if (container) {
            container.classList.toggle('show-advanced');
            
            const link = document.querySelector('[onclick="toggleAdvanced()"]');
            if (link) {
                const isShowing = container.classList.contains('show-advanced');
                link.textContent = isShowing ? 'Hide Advanced Options' : 'Show Advanced Options';
            }
        }
    }
    
    showSuccess(message) {
        // Simple success notification - will be enhanced in future phases
        this.showNotification(message, 'success');
    }
    
    showError(message) {
        // Simple error notification - will be enhanced in future phases
        this.showNotification(message, 'error');
    }
    
    showNotification(message, type = 'info') {
        // Simple notification system - placeholder for future enhancement
        // Could be enhanced with toast notifications, sound alerts, etc.
        const event = new CustomEvent('notification', {
            detail: { message, type, timestamp: Date.now() }
        });
        window.dispatchEvent(event);
    }
    
    useModel() {
        // Deploy the current model - will be implemented in Phase 2
        this.showSuccess('Model deployment feature coming in Phase 2');
    }
    
    viewDetails() {
        // Show detailed model information - will be implemented in Phase 2
        this.showSuccess('Model details view coming in Phase 2');
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});

export { Dashboard };