import { initializeScreenshot } from './screenshot.js';
import { initializeThemeSelector } from './themeSelector.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initial timeline points data
    let timelinePoints = [
        {
            title: "Enhancing Visual Appeal",
            description: "Infographics leverage visually appealing designs, which can capture users' attention quickly on Pinterest's image-centric platform. This visual aspect can lead to increased engagement and higher pin rates."
        },
        {
            title: "Simplifying Complex Information",
            description: "Infographics simplify complex data and concepts into digestible visual formats. This is particularly useful for e-commerce brands or service providers looking to explain products or services quickly."
        },
        {
            title: "Boosting Brand Awareness",
            description: "Consistent use of infographics helps in building brand identity. By using specific colors, fonts, and styles, brands can create a distinct visual language that resonates with users and enhances recall."
        },
        {
            title: "Encouraging Shares and Saves",
            description: "Infographics are highly shareable content; they encourage users to save, pin, or share them due to their informative nature. This can lead to organic reach and visibility on Pinterest."
        },
        {
            title: "Driving Traffic to Websites",
            description: "Infographics can include call-to-actions (CTAs) linking back to your website or landing page, facilitating the conversion of Pinterest users into website visitors, thus driving traffic effectively."
        },
        {
            title: "Leveraging SEO Benefits",
            description: "When properly tagged with keywords and descriptions, infographics can enhance SEO on Pinterest. This can improve discoverability, making it easier for users interested in specific topics to find your pins."
        },
        {
            title: "Creating Educational Content",
            description: "Infographics can serve as educational tools or tutorials, providing value to your audience. This type of informative content can establish authority in your niche and attract a loyal following."
        }
    ];

    // DOM Elements
    const screenshotBtn = document.getElementById('screenshot-btn');
    const modal = document.getElementById('screenshot-modal');
    const closeModal = document.querySelector('.close');
    const screenshotImage = document.getElementById('screenshot-image');
    const downloadBtn = document.getElementById('downloadBtn');
    const primaryColorInput = document.getElementById('primaryColor');
    const secondaryColorInput = document.getElementById('secondaryColor');
    const titleInput = document.getElementById('titleInput');
    const pointsContainer = document.getElementById('pointsContainer');
    const addPointBtn = document.getElementById('addPointBtn');
    const timeline = document.querySelector('.timeline');

    // Initialize screenshot functionality
    initializeScreenshot(screenshotBtn, modal, closeModal, screenshotImage, downloadBtn);

    // Function to render infographic with current colors
    function renderInfographic() {
        const primaryColor = primaryColorInput.value;
        const secondaryColor = secondaryColorInput.value;
        
        // Set CSS variables
        document.documentElement.style.setProperty('--primary-color', primaryColor);
        document.documentElement.style.setProperty('--secondary-color', secondaryColor);

        // Update title
        document.querySelector('#infographic h1').textContent = titleInput.value;

        // Update timeline points
        renderTimelinePoints();
    }

    // Function to render timeline points
    function renderTimelinePoints() {
        timeline.innerHTML = timelinePoints.map((point, index) => `
            <div class="timeline-item">
                <div class="number-box">
                    <div class="number">${index + 1}</div>
                </div>
                <div class="connector-line"></div>
                <div class="content">
                    <h3>${point.title}</h3>
                    <p>${point.description}</p>
                </div>
                <div class="timeline-dot"></div>
            </div>
        `).join('');
    }

    // Function to render point controls
    function renderPointControls() {
        pointsContainer.innerHTML = timelinePoints.map((point, index) => `
            <div class="point-control" data-index="${index}">
                <input type="text" class="point-title" value="${point.title}" placeholder="Point Title">
                <textarea class="point-description" placeholder="Point Description">${point.description}</textarea>
                <div class="point-actions">
                    <button class="move-up-btn" ${index === 0 ? 'disabled' : ''}>↑ Move Up</button>
                    <button class="move-down-btn" ${index === timelinePoints.length - 1 ? 'disabled' : ''}>↓ Move Down</button>
                    <button class="delete-btn">🗑️ Delete</button>
                </div>
            </div>
        `).join('');

        // Add event listeners to point controls
        pointsContainer.querySelectorAll('.point-control').forEach(control => {
            const index = parseInt(control.dataset.index);

            // Update point when input changes
            control.querySelector('.point-title').addEventListener('input', (e) => {
                timelinePoints[index].title = e.target.value;
                renderInfographic();
            });

            control.querySelector('.point-description').addEventListener('input', (e) => {
                timelinePoints[index].description = e.target.value;
                renderInfographic();
            });

            // Move point up
            control.querySelector('.move-up-btn').addEventListener('click', () => {
                if (index > 0) {
                    [timelinePoints[index], timelinePoints[index - 1]] = [timelinePoints[index - 1], timelinePoints[index]];
                    renderPointControls();
                    renderInfographic();
                }
            });

            // Move point down
            control.querySelector('.move-down-btn').addEventListener('click', () => {
                if (index < timelinePoints.length - 1) {
                    [timelinePoints[index], timelinePoints[index + 1]] = [timelinePoints[index + 1], timelinePoints[index]];
                    renderPointControls();
                    renderInfographic();
                }
            });

            // Delete point
            control.querySelector('.delete-btn').addEventListener('click', () => {
                timelinePoints.splice(index, 1);
                renderPointControls();
                renderInfographic();
            });
        });
    }

    // Add new point
    addPointBtn.addEventListener('click', () => {
        timelinePoints.push({
            title: "New Point",
            description: "Enter your description here"
        });
        renderPointControls();
        renderInfographic();
    });

    // Update title when changed
    titleInput.addEventListener('input', renderInfographic);

    // Initialize theme selector
    initializeThemeSelector(primaryColorInput, secondaryColorInput, renderInfographic);

    // Listen for direct color input changes
    primaryColorInput.addEventListener('input', renderInfographic);
    secondaryColorInput.addEventListener('input', renderInfographic);

    // Initial render
    renderPointControls();
    renderInfographic();
}); 