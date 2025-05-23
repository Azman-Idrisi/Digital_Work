import { themeTemplates } from './themes.js';

export function initializeThemeSelector(primaryColorInput, secondaryColorInput, renderInfographic) {
    // Create theme selector
    function createThemeSelector() {
        const controlSection = document.querySelector('.color-controls').parentElement;
        const themeSelect = document.createElement('div');
        themeSelect.className = 'theme-selector';
        themeSelect.innerHTML = `
            <h4>Quick Themes</h4>
            <div class="theme-grid"></div>
        `;
        
        const themeGrid = themeSelect.querySelector('.theme-grid');
        
        // Create buttons for each theme
        Object.entries(themeTemplates).forEach(([key, theme]) => {
            const themeButton = document.createElement('div');
            themeButton.className = 'theme-button';
            themeButton.innerHTML = `
                <div class="theme-preview" style="background-color: ${theme.primary}; border: 2px solid ${theme.secondary}">
                    <div class="theme-secondary" style="background-color: ${theme.secondary}"></div>
                </div>
                <div class="theme-info">
                    <div class="theme-name">${theme.name}</div>
                    <div class="theme-description">${theme.description}</div>
                </div>
            `;
            themeButton.onclick = () => applyTheme(theme);
            themeGrid.appendChild(themeButton);
        });
        
        controlSection.insertBefore(themeSelect, controlSection.firstChild);
    }

    // Apply selected theme
    function applyTheme(theme) {
        primaryColorInput.value = theme.primary;
        secondaryColorInput.value = theme.secondary;
        
        // Add animation class to infographic
        const infographic = document.getElementById('infographic');
        infographic.classList.add('theme-transition');
        
        // Render the changes
        renderInfographic();
        
        // Remove animation class after transition
        setTimeout(() => {
            infographic.classList.remove('theme-transition');
        }, 500);
    }

    // Add theme selector styles
    const style = document.createElement('style');
    style.textContent = `
        .theme-selector {
            margin-bottom: 30px;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
        }
        .theme-selector h4 {
            margin-bottom: 15px;
            color: #333;
            font-size: 16px;
        }
        .theme-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
            max-height: 300px;
            overflow-y: auto;
            padding-right: 10px;
        }
        .theme-button {
            display: flex;
            align-items: center;
            padding: 10px;
            background: white;
            border-radius: 8px;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            border: 1px solid #eee;
        }
        .theme-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .theme-preview {
            width: 50px;
            height: 50px;
            border-radius: 8px;
            margin-right: 12px;
            position: relative;
            overflow: hidden;
        }
        .theme-secondary {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 40%;
        }
        .theme-info {
            flex: 1;
        }
        .theme-name {
            font-weight: bold;
            color: #333;
            margin-bottom: 4px;
        }
        .theme-description {
            font-size: 12px;
            color: #666;
        }
        .theme-transition {
            transition: all 0.3s ease;
        }
        
        /* Scrollbar styles for theme grid */
        .theme-grid::-webkit-scrollbar {
            width: 8px;
        }
        .theme-grid::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }
        .theme-grid::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
        }
        .theme-grid::-webkit-scrollbar-thumb:hover {
            background: #666;
        }
    `;
    document.head.appendChild(style);

    // Initialize theme selector
    createThemeSelector();
} 