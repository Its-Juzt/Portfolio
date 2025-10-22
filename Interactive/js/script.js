const githubUsername = '7wp81x';
let typingInterval;
let currentSection = 'intro';
let isPlayMode = false;
let currentPlayIndex = 0;
let autoplayEnabled = true;
let idleEnabled = true;
let darkMode = false;
let musicEnabled = true;
let soundEnabled = true;
let menheraChanEnabled = true;
let idleTimer;
let idleChangeTimer;
let interactionOccurred = false;
let isInIdleMode = false;
let isPaused = false;
let playTimeout;
let lastPick = "";
let lastImage = "";
let musicStarted = false;  // New variable to track if music has been initiated after user interaction

let characterImages;
let playOrder;
let predefinedThemes;
let sections;

let happy_expressions = [];
let idle_expressions = [];
let typingSpeed = 3;
let idleTimeout = 5;
const settingsKey = 'portfolioSettings';

let savedThemes = [];

const bgMusic = new Audio('./audio/background.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.3;

const clickSound = new Audio('./audio/click.mp3');
clickSound.volume = 0.4;

function modifyPath(path) {
    return path.replace(/\.png$/, menheraChanEnabled ? '.png' : '_kun.png');
}

function checkImage(imagePath) {
  let hostUrl;
  console.log(window.location.host);
  if (window.location.host.includes('github')) {
    hostUrl = `http://${window.location.host}/Portfolio/img`;
  } else {
    hostUrl = `http://${window.location.host}/img`;
  }
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = `${hostUrl}${imagePath}`;
  });
}

async function loadHappyExpressions(){
  const suffix = menheraChanEnabled ? '' : '_kun';
  const image_pattern = `/Menhera/smiling`;
  let i = 0;
  const expressions = [];
  while (true) {
    const image = `${image_pattern}${i}${suffix}.png`;
    const exists = await checkImage(image);
    if (!exists) break;
    console.log(window.location.host);
    if (window.location.host.includes('github')) {
        expressions.push(`http://${window.location.host}/Portfolio/img${image}`);
        console.log(`http://${window.location.host}/Portfolio/img${image}`);
    } else {
        expressions.push(`http://${window.location.host}/img${image}`);
    }
    i++;
  }

  console.log("Loaded expressions:", expressions);
  return expressions;
}


async function loadIdleExpressions(){
  console.log(window.location.host);
  const suffix = menheraChanEnabled ? '' : '_kun';
  const image_pattern = `/Menhera/idle/idle`;
  let i = 0;
  const expressions = [];
  while (true) {
    const image = `${image_pattern}${i}${suffix}.png`;
    const exists = await checkImage(image);
    if (!exists) break;
      
    console.log(`host is http://${window.location.host}`);
      
    if (window.location.host.includes('github')) {
        expressions.push(`http://${window.location.host}/Portfolio/img${image}`);
        console.log(`http://${window.location.host}/Portfolio/img${image}`);
    } else {
        expressions.push(`http://${window.location.host}/img${image}`);
    }
    i++;
  }

  console.log("Loaded expressions:", expressions);
  return expressions;
}




function randomPick(listImages) {
    if (!Array.isArray(listImages) || listImages.length === 0) {
        return listImages || characterImages.default.map(modifyPath)[0]; // Fallback
    }
    const randomIndex = Math.floor(Math.random() * listImages.length);
    const randomImg = listImages[randomIndex];
    console.log(randomImg);
    return randomImg;
}



function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 105, 180';
}

function applyColors(colorA, colorB) {
    const aRgb = hexToRgb(colorA);
    const bRgb = hexToRgb(colorB);
    document.documentElement.style.setProperty('--light-primary', colorA);
    document.documentElement.style.setProperty('--light-secondary', colorB);
    document.documentElement.style.setProperty('--light-primary-rgb', aRgb);
    document.documentElement.style.setProperty('--light-secondary-rgb', bRgb);
    document.documentElement.style.setProperty('--dark-primary', colorB);
    document.documentElement.style.setProperty('--dark-secondary', colorA);
    document.documentElement.style.setProperty('--dark-primary-rgb', bRgb);
    document.documentElement.style.setProperty('--dark-secondary-rgb', aRgb);
}

function resetColors() {
    const defaultA = '#0fd8e6';
    const defaultB = '#00b4e0';
    applyColors(defaultA, defaultB);
    const colorAInput = document.getElementById('color-a');
    const colorBInput = document.getElementById('color-b');
    colorAInput.value = defaultA;
    colorBInput.value = defaultB;
}

function playClickSound() {
    if (soundEnabled) {
        clickSound.currentTime = 0;
        clickSound.play().catch(e => console.log('Sound play failed:', e));
    }
}

function toggleMusic() {
    if (musicEnabled) {
        if (interactionOccurred || musicStarted) {  // Only attempt play if there's been interaction or music already started
            bgMusic.play().catch(e => console.log('Music play failed:', e));
        }
    } else {
        bgMusic.pause();
        bgMusic.currentTime = 0;
        musicStarted = false;  // Reset if disabled
    }
}

function saveTheme() {
    const nameInput = document.getElementById('theme-name');
    const name = nameInput.value.trim();
    if (!name) {
        alert('Please enter a theme name.');
        return;
    }
    const colorA = document.getElementById('color-a').value;
    const colorB = document.getElementById('color-b').value;
    savedThemes.push({name, colorA, colorB});
    localStorage.setItem('savedThemes', JSON.stringify(savedThemes));
    populateThemes();
    nameInput.value = '';
}

function deleteTheme(name) {
    savedThemes = savedThemes.filter(t => t.name !== name);
    localStorage.setItem('savedThemes', JSON.stringify(savedThemes));
    populateThemes();
}

function populateThemes() {
    const select = document.getElementById('theme-select');
    if (!select) return;
    select.innerHTML = '';
    predefinedThemes.forEach(theme => {
        const opt = document.createElement('option');
        opt.value = JSON.stringify(theme);
        opt.textContent = theme.name;
        select.appendChild(opt);
    });
    savedThemes.forEach(theme => {
        const opt = document.createElement('option');
        opt.value = JSON.stringify(theme);
        opt.textContent = `${theme.name} (saved)`;
        select.appendChild(opt);
    });

    const listDiv = document.getElementById('saved-themes-list');
    if (!listDiv) return;
    listDiv.innerHTML = '<h4>Saved Themes:</h4>';
    if (savedThemes.length === 0) {
        listDiv.innerHTML += '<p>No saved themes.</p>';
    } else {
        savedThemes.forEach(theme => {
            const div = document.createElement('div');
            div.style.marginBottom = '5px';
            div.innerHTML = `<span>${theme.name}</span> <button onclick="playClickSound(); deleteTheme('${theme.name.replace(/'/g, "\\'")}')">Delete</button>`;
            listDiv.appendChild(div);
        });
    }
}

function typeText(text, callback) {
    const textElement = document.getElementById('text');
    textElement.innerHTML = '';
    let i = 0;
    clearInterval(typingInterval);
    const skipBtn = document.getElementById('skip-btn');
    skipBtn.style.display = 'block';
    skipBtn.textContent = 'Skip';
    skipBtn.onclick = () => {
        playClickSound();
        clearInterval(typingInterval);
        textElement.innerHTML = text;
        skipBtn.style.display = 'none';
        if (callback) callback();
    };

    const hasHTML = /<[^>]+>/g.test(text);

    if (hasHTML) {
        textElement.innerHTML = text;
        skipBtn.style.display = 'none';
        if (callback) callback();
    } else {
        typingInterval = setInterval(() => {
            if (i < text.length) {
                textElement.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
                skipBtn.style.display = 'none';
                if (callback) callback();
            }
        }, typingSpeed);
    }
}

function getCharacterImage(key) {
    let images;
    if (key === 'happy') {
        images = happy_expressions.length > 0 ? happy_expressions : characterImages.default.map(modifyPath);
    } else {
        images = (characterImages[key] || characterImages.default).map(modifyPath);
    }
    return randomPick(images);
}

function loadSettings() {
    const saved = localStorage.getItem(settingsKey);
    if (saved) {
        const settings = JSON.parse(saved);
        darkMode = settings.darkMode || false;
        autoplayEnabled = settings.autoplayEnabled !== undefined ? settings.autoplayEnabled : true;
        if (darkMode) {
            document.body.classList.add('dark-mode');
            const character = document.getElementById('character');
            if (character) character.classList.add('dark-mode');
            for (const key in sections) {
                if (sections[key].background) {
                  sections[key].background = sections[key].background.replace('.jpg', '_dark.jpg');
                }
            }
        
        }

        idleEnabled = settings.idleEnabled !== undefined ? settings.idleEnabled : true;
        musicEnabled = settings.musicEnabled !== undefined ? settings.musicEnabled : false;
        soundEnabled = settings.soundEnabled !== undefined ? settings.soundEnabled : true;
        menheraChanEnabled = settings.menheraChanEnabled !== undefined ? settings.menheraChanEnabled : true;
        idleTimeout = settings.idleTimeout || 10;
        typingSpeed = settings.typingSpeed || 3;
        if (settings.colorA && settings.colorB) {
            applyColors(settings.colorA, settings.colorB);
        }
    }
    savedThemes = JSON.parse(localStorage.getItem('savedThemes')) || [];
    const characterName = document.getElementById('name');

    if (!menheraChanEnabled) {
        characterName.textContent = "Menhera-kun";
    } else {
        characterName.textContent = "Menhera-chan";
    }
}


async function fetchGitHubRepos() {
    try {
        const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated&direction=desc`);
        if (!response.ok) throw new Error('Failed to fetch repos');
        const repos = await response.json();
        return repos.slice(0, 50).map(repo => ({
            name: repo.name,
            description: repo.description || 'No description available',
            language: repo.language || 'Unknown',
            stars: repo.stargazers_count,
            url: repo.html_url
        }));
    } catch (error) {
        console.error('Error fetching repos:', error);
        return [];
    }
}


function saveSettings() {
    const colorA = document.getElementById('color-a').value;
    const colorB = document.getElementById('color-b').value;
    const settings = {
        darkMode: document.getElementById('dark-toggle').checked,
        autoplayEnabled: autoplayEnabled,
        idleEnabled: document.getElementById('idle-toggle').checked,
        musicEnabled: document.getElementById('music-toggle').checked,
        soundEnabled: document.getElementById('sound-toggle').checked,
        menheraChanEnabled: document.getElementById('menhera-toggle').checked,
        idleTimeout: parseInt(document.getElementById('idle-timeout').value),
        typingSpeed: parseInt(document.getElementById('typing-speed').value),
        colorA: colorA,
        colorB: colorB
    };
    localStorage.setItem(settingsKey, JSON.stringify(settings));
    darkMode = settings.darkMode;
    if (darkMode) {
        document.body.classList.add('dark-mode');
        const character = document.getElementById('character');
        if (character) character.classList.add('dark-mode');
        for (const key in sections) {
            if (!sections[key].background.endsWith('_dark.jpg')) {
              sections[key].background = sections[key].background.replace('.jpg', '_dark.jpg');
            }
        }
    } else {
        document.body.classList.remove('dark-mode');
        const character = document.getElementById('character');
        if (character) character.classList.remove('dark-mode');

        for (const key in sections) {
            if (sections[key].background) {
              sections[key].background = sections[key].background.replace('_dark.jpg', '.jpg');
            }
        }

    }
    idleEnabled = settings.idleEnabled;
    musicEnabled = settings.musicEnabled;
    soundEnabled = settings.soundEnabled;
    menheraChanEnabled = settings.menheraChanEnabled;
    idleTimeout = settings.idleTimeout;
    typingSpeed = settings.typingSpeed;

       const characterName = document.getElementById('name');

        if (!menheraChanEnabled) {
            characterName.textContent = "Menhera-kun";
        } else {
            characterName.textContent = "Menhera-chan";
        }


    applyColors(colorA, colorB);
    toggleMusic();  // Safe to call here since settings change implies interaction
    updateScene('intro');
}

function exitIdleMode() {
    if (!isInIdleMode) return;
    isInIdleMode = false;
    clearTimeout(idleChangeTimer);
    const characterDiv = document.getElementById('character');
    characterDiv.style.opacity = 0;
    setTimeout(() => {
        const happyImg = getCharacterImage('happy');
        document.querySelector('#character img').src = happyImg;
        characterDiv.style.opacity = 1;
    }, 500);
}

function handleInteraction() {
    interactionOccurred = true;
    clearTimeout(idleTimer);
    exitIdleMode();
    
    // New: Attempt to start background music on first user interaction if enabled
    if (musicEnabled && !musicStarted) {
        bgMusic.play().then(() => {
            musicStarted = true;
            console.log('Background music started after user interaction');
        }).catch(e => {
            console.log('Music play failed even after interaction:', e);
        });
    }
}

function togglePause() {
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
        if (isPaused) {
            isPaused = false;
            pauseBtn.textContent = 'Pause';
            const isLast = currentPlayIndex >= playOrder.length - 1;
            const delay = isLast ? 5000 : 8000;
            if (autoplayEnabled) {
                playTimeout = setTimeout(() => {
                    if (!isPaused && autoplayEnabled) {
                        if (isLast) {
                            endPlayMode();
                        } else {
                            currentPlayIndex++;
                            playClickSound();
                            updateScene(playOrder[currentPlayIndex]);
                        }
                    }
                }, delay);
            }
        } else {
            isPaused = true;
            pauseBtn.textContent = 'Resume';
            clearTimeout(playTimeout);
        }
    }
}


function updateScene(sectionKey) {
    const key = sectionKey.toLowerCase().replace(/ /g, '_');
    const section = sections[key];
    if (!section) return;
    interactionOccurred = true;
    clearTimeout(idleTimer);
    clearTimeout(idleChangeTimer);
    clearTimeout(playTimeout);
    isInIdleMode = false;
    isPaused = false;
    currentSection = key;

    document.getElementById('side-box').style.display = 'none';
    document.getElementById('character').style.display = 'block';

    document.body.style.backgroundImage = `url('${section.background}')`;

    const characterDiv = document.getElementById('character');
    characterDiv.style.opacity = 0;
    setTimeout(() => {

        let charImg = getCharacterImage(section.characterKey || 'default');
        let counter = 0;
        while(charImg == lastImage && counter != 3) {
            charImg = getCharacterImage('happy');
            counter++;
        }
        counter = 0;

        lastImage = charImg;
        document.querySelector('#character img').src = charImg;
        characterDiv.style.opacity = 1;
    }, 500);

    const backBtn = document.getElementById('back-btn');
    backBtn.style.display = (key !== 'intro') ? 'block' : 'none';
    backBtn.textContent = isPlayMode ? 'Exit' : 'Back';
    backBtn.onclick = () => {
        playClickSound();
        handleInteraction();
        if (isPlayMode) {
            endPlayMode();
        } else {
            if (currentSection.startsWith('project_')) {
                updateScene('web_projects');
            } else {
                updateScene('intro');
            }
        }
    };

    if (isPlayMode) {
        backBtn.style.display = 'none';
        const skipBtn = document.getElementById('skip-btn');
        if (skipBtn) skipBtn.style.display = 'none';
    }

    const subtitleElement = document.getElementById('subtitle');
    if (key === 'intro') {
        subtitleElement.innerHTML = '';
    } else {
        let title = key.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        if (title.includes("Activity")) {
            title = title.replace("Project", "");
        }
        subtitleElement.innerHTML = title;
    }

    const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';

    const textbox = document.getElementById('textbox');
    textbox.style.opacity = 0;
    textbox.style.transform = 'translateY(80px)';
    setTimeout(() => {
        textbox.style.opacity = 1;
        textbox.style.transform = 'translateY(0)';
    }, 300);

    setTimeout(async () => {
        typeText(section.text, async () => {

            if (!isPlayMode) {
                section.choices.forEach(choice => {
                    const btn = document.createElement('div');
                    btn.className = 'choice';
                    btn.textContent = choice;
                    btn.onclick = () => {
                        playClickSound();
                        handleChoice(choice);
                    };
                    choicesDiv.appendChild(btn);
                });
            } else {
                const controlsDiv = document.createElement('div');
                controlsDiv.id = 'play-controls';
                controlsDiv.style.display = 'flex';
                controlsDiv.style.justifyContent = 'center';
                controlsDiv.style.alignItems = 'center';
                controlsDiv.style.gap = '10px';
                controlsDiv.style.marginTop = '20px';

                // Exit button
                const exitBtn = document.createElement('div');
                exitBtn.className = 'choice';
                exitBtn.textContent = 'Exit';
                exitBtn.onclick = () => {
                    playClickSound();
                    endPlayMode();
                };
                controlsDiv.appendChild(exitBtn);

                // Previous button
                const prevBtn = document.createElement('div');
                prevBtn.className = 'choice';
                prevBtn.textContent = 'Previous';
                prevBtn.onclick = () => {
                    playClickSound();
                    if (currentPlayIndex > 0) {
                        currentPlayIndex--;
                        updateScene(playOrder[currentPlayIndex]);
                    }
                };
                controlsDiv.appendChild(prevBtn);

                // Toggle Autoplay button
                const toggleBtn = document.createElement('div');
                toggleBtn.className = 'choice';
                toggleBtn.id = 'toggle-autoplay-btn';
                function updateToggleText() {
                    toggleBtn.textContent = `Autoplay: ${autoplayEnabled ? 'On' : 'Off'}`;
                }
                updateToggleText();
                toggleBtn.onclick = () => {
                    playClickSound();
                    autoplayEnabled = !autoplayEnabled;
                    updateToggleText();
                    if (autoplayEnabled) {
                        if (!isPaused) {
                            const isLast = currentPlayIndex >= playOrder.length - 1;
                            const delay = isLast ? 5000 : 8000;
                            playTimeout = setTimeout(() => {
                                if (autoplayEnabled && !isPaused) {
                                    if (isLast) {
                                        endPlayMode();
                                    } else {
                                        currentPlayIndex++;
                                        playClickSound();
                                        updateScene(playOrder[currentPlayIndex]);
                                    }
                                }
                            }, delay);
                        }
                    } else {
                        clearTimeout(playTimeout);
                    }
                };
                controlsDiv.appendChild(toggleBtn);

                // Next button
                const nextBtn = document.createElement('div');
                nextBtn.className = 'choice';
                nextBtn.textContent = 'Next';
                nextBtn.onclick = () => {
                    playClickSound();
                    clearTimeout(playTimeout);
                    if (currentPlayIndex < playOrder.length - 1) {
                        currentPlayIndex++;
                        updateScene(playOrder[currentPlayIndex]);
                    } else {
                        endPlayMode();
                    }
                };
                controlsDiv.appendChild(nextBtn);

                // Pause/Resume button
                const pauseBtn = document.createElement('div');
                pauseBtn.className = 'choice';
                pauseBtn.id = 'pause-btn';
                pauseBtn.textContent = 'Pause';
                pauseBtn.onclick = togglePause;
                controlsDiv.appendChild(pauseBtn);

                choicesDiv.appendChild(controlsDiv);
            }

            if (section.largeContent || key === 'github_repos') {
                const sideBox = document.getElementById('side-box');
                const isAndroid = /Android/i.test(navigator.userAgent);
                const isWide = window.innerWidth > 768;
                
                
                let contentHtml = section.largeContent;
                if (key === 'github_repos' && (!section.largeContent || section.largeContent === '')) {

                    const repos = await fetchGitHubRepos();
                    contentHtml = '<h3>My GitHub Repos</h3><div class="repos-grid">';
                    if (repos.length === 0) {
                        contentHtml += '<p>No repositories found or error loading.</p>';
                    } else {
                        repos.forEach(repo => {
                            contentHtml += `
                                <div class="repo-card">
                                    <h4><a href="${repo.url}" target="_blank" onclick="playClickSound();">${repo.name}</a></h4>
                                    <p>${repo.description}</p>
                                    <div class="repo-meta">
                                        <span class="language">${repo.language}</span>
                                        <span class="stars">⭐ ${repo.stars}</span>
                                    </div>
                                </div>
                            `;
                        });
                    }
                    contentHtml += '</div>';
                }

                sideBox.innerHTML = contentHtml;
                sideBox.style.opacity = '0';
                sideBox.style.transform = 'translateX(-20px)';
                sideBox.style.display = 'block';


                if (!isAndroid || isWide) {

                    sideBox.style.left = '10px';
                    sideBox.style.width = '60%';
                    sideBox.style.height = key.includes('project') ? '50%' : '50%';
                    sideBox.style.bottom = key.includes('project') ? '33%' : '33%';
                    sideBox.style.marginBottom = "20px"
                    setTimeout(() => {
                        sideBox.style.opacity = '1';
                        sideBox.style.transform = 'translateX(0)';
                    }, 20);
                } else {
                    setTimeout(() => {
                        document.getElementById('character').style.display = 'none';
                    }, 2000)

                    sideBox.style.left = '0';
                    sideBox.style.width = '90%';
                    sideBox.style.top = '0';
                    sideBox.style.height = key.includes('project') ? '70%' : '50%';
                    sideBox.style.bottom = 'auto';
                    setTimeout(() => {
                        sideBox.style.opacity = '1';
                        sideBox.style.transform = 'translateX(0)';
                    }, 2000);

                    
                }


                if (key === 'settings') {
                    document.getElementById('dark-toggle').checked = darkMode;
                    document.getElementById('idle-toggle').checked = idleEnabled;
                    document.getElementById('music-toggle').checked = musicEnabled;
                    document.getElementById('sound-toggle').checked = soundEnabled;
                    document.getElementById('menhera-toggle').checked = menheraChanEnabled;
                    document.getElementById('idle-timeout').value = idleTimeout;



                    const speedInput = document.getElementById('typing-speed');
                    const speedValue = document.getElementById('speed-value');
                    speedInput.value = typingSpeed;
                    speedValue.textContent = typingSpeed;
                    speedInput.oninput = (e) => speedValue.textContent = e.target.value;
                    const colorAInput = document.getElementById('color-a');
                    const colorBInput = document.getElementById('color-b');
                    const saved = localStorage.getItem(settingsKey);
                    if (saved) {
                        const settings = JSON.parse(saved);
                        colorAInput.value = settings.colorA || '#0fd8e6';
                        colorBInput.value = settings.colorB || '#00b4e0';
                    } else {
                        colorAInput.value = '#0fd8e6';
                        colorBInput.value = '#00b4e0';
                    }

                    colorAInput.oninput = (e) => applyColors(e.target.value, colorBInput.value);
                    colorBInput.oninput = (e) => applyColors(colorAInput.value, e.target.value);
                    populateThemes();

                    document.getElementById('theme-select').onchange = (e) => {
                        if (e.target.value) {
                            const theme = JSON.parse(e.target.value);
                            applyColors(theme.colorA, theme.colorB);
                            colorAInput.value = theme.colorA;
                            colorBInput.value = theme.colorB;
                        }
                    };

                    document.getElementById('save-theme-btn').onclick = (e) => {
                        playClickSound();
                        saveTheme();
                    };

                    document.getElementById('reset-btn').onclick = (e) => {
                        playClickSound();
                        resetColors();
                    };

                    document.getElementById('music-toggle').onchange = (e) => {
                        musicEnabled = e.target.checked;
                        toggleMusic();
                    };

                    document.getElementById('sound-toggle').onchange = (e) => {
                        soundEnabled = e.target.checked;
                    };

                    document.getElementById('dark-toggle').onchange = async (e) => {
                         is_dark = e.target.checked;

                        if (is_dark) {
                             document.body.classList.add('dark-mode');
                            const character = document.getElementById('character');
                            if (character) character.classList.add('dark-mode');
                            for (const key in sections) {
                                if (!sections[key].background.endsWith('_dark.jpg')) {
                                  sections[key].background = sections[key].background.replace('.jpg', '_dark.jpg');
                                }
                            }
                        } else {
                            document.body.classList.remove('dark-mode');
                            const character = document.getElementById('character');
                            if (character) character.classList.remove('dark-mode');

                            for (const key in sections) {
                                if (sections[key].background) {
                                  sections[key].background = sections[key].background.replace('_dark.jpg', '.jpg');
                                }
                            }

                        }

                        document.body.style.backgroundImage = `url("${sections['intro'].background}")`;
                            

                    }

                    document.getElementById('menhera-toggle').onchange = async (e) => {
                        menheraChanEnabled = e.target.checked;

                        const characterName = document.getElementById('name');

                        if (!menheraChanEnabled) {
                            characterName.textContent = "Menhera-kun";
                        } else {
                            characterName.textContent = "Menhera-chan";
                        }

                        happy_expressions = await loadHappyExpressions();
                        idle_expressions = await loadIdleExpressions();
                        const charImg = getCharacterImage(sections[currentSection].characterKey || 'default');
                        document.querySelector('#character img').src = charImg;
                    };

                    const skipBtn = document.getElementById('skip-btn');
                    skipBtn.textContent = 'Save';
                    skipBtn.onclick = (e) => {
                        playClickSound();
                        saveSettings();
                    };

                    skipBtn.style.display = 'block';
                }
            }


            if (isPlayMode) {
                const isLast = currentPlayIndex >= playOrder.length - 1;
                const delay = isLast ? 5000 : 8000;
                if (autoplayEnabled && !isPaused) {
                    playTimeout = setTimeout(() => {
                        if (autoplayEnabled && !isPaused) {
                            if (isLast) {
                                endPlayMode();
                            } else {
                                currentPlayIndex++;
                                playClickSound();
                                updateScene(playOrder[currentPlayIndex]);
                            }
                        }
                    }, delay);
                }
            }


            if (key === 'intro' && idleEnabled) {
                interactionOccurred = false;
                idleTimer = setTimeout(() => {
                    if (!interactionOccurred && currentSection === 'intro') {
                        enterIdleMode();
                    }
                }, idleTimeout * 1000);
            }
        });
    }, 200);
}



function enterIdleMode() {
    if (isInIdleMode || !idleEnabled || currentSection !== 'intro') return;
    isInIdleMode = true;
    const characterDiv = document.getElementById('character');
    characterDiv.style.opacity = 0;
    setTimeout(() => {
        let randomImg = randomPick(idle_expressions.length > 0 ? idle_expressions : characterImages.happy.map(modifyPath));
        lastPick = randomImg;
        document.querySelector('#character img').src = randomImg;
        characterDiv.style.opacity = 1;
    }, 500);


    idleChangeTimer = setTimeout(() => {
        if (isInIdleMode && !interactionOccurred && currentSection === 'intro') {
            changeIdleCharacter();
        }
    }, 5000);
}


function changeIdleCharacter() {
    if (!isInIdleMode) return;
    const characterDiv = document.getElementById('character');
    characterDiv.style.opacity = 0;
    setTimeout(() => {
        let randomImg = randomPick(idle_expressions.length > 0 ? idle_expressions : characterImages.happy.map(modifyPath));
        if (lastPick === randomImg) {
            randomImg = randomPick(idle_expressions.length > 0 ? idle_expressions : characterImages.happy.map(modifyPath));
        }
        lastPick = randomImg;
        document.querySelector('#character img').src = randomImg;
        characterDiv.style.opacity = 1;
    }, 500);


    idleChangeTimer = setTimeout(() => {
        if (isInIdleMode && !interactionOccurred && currentSection === 'intro') {
            changeIdleCharacter();
        }
    }, 5000);
}

function handleChoice(choice) {
    handleInteraction();

    if (choice === 'Play All') {
        startPlayMode();
    } else if (choice === 'Toggle Idle Animation') {
        idleEnabled = !idleEnabled;
        updateScene('intro');
    } else if (choice === 'Toggle Dark Mode') {
        darkMode = !darkMode;
        document.body.classList.toggle('dark-mode', darkMode);
        updateScene(currentSection);
    } else if (['Activity 1', 'Activity 2', 'Activity 3', 'Activity 4', 'Activity 5'].includes(choice)) {
        const projectName = choice;
        const projectDir = choice.toLowerCase().replace(" ","_");
        const url = `./projects/${projectDir}/index.html`;
        const projectKey = `project_${projectDir}`;
        if (!sections[projectKey]) {
            sections[projectKey] = {
                text: `Viewing ${projectName}. Interact with the embedded project in the side panel. Use the back button to return.`,
                choices: [],
                background: sections.web_projects.background,
                characterKey: sections.web_projects.characterKey,
                largeContent: `<h3>${choice}</h3><iframe src="${url}" style="width:100%; height:100%; border:none; border-radius:10px;"></iframe>`
            };
        }
        updateScene(projectKey);
    } else {
        updateScene(choice);
    }
}

function startPlayMode() {
    isPlayMode = true;
    isPaused = false;
    autoplayEnabled = true;
    currentPlayIndex = 0;
    updateScene(playOrder[0]);
}


function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false,  // 24-hour format
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        clockElement.style.fontFamily = "Monospace";
        clockElement.textContent = timeString;
    }
}

function endPlayMode() {
    clearTimeout(playTimeout);
    isPlayMode = false;
    isPaused = false;
    const skipBtn = document.getElementById('skip-btn');
    if (skipBtn) skipBtn.style.display = 'none';
    const backBtn = document.getElementById('back-btn');
    if (backBtn) backBtn.style.display = 'none';
    updateScene('intro');
}


document.getElementById('back-btn').onclick = () => {
    playClickSound();
    handleInteraction();

    if (isPlayMode) {
        endPlayMode();
    } else {
        if (currentSection.startsWith('project_')) {
            updateScene('web_projects');
        } else {
            updateScene('intro');
        }
    }
};


document.addEventListener('mousemove', handleInteraction);
document.addEventListener('click', handleInteraction);
document.addEventListener('touchstart', handleInteraction, { passive: true });

// just for this func

function showIntroPopup() {
    let sceneUpdated = false;

    const section = sections['intro'];
    document.body.style.backgroundImage = `url('${section.background}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    const modal = document.getElementById('intro-modal');
    const modalImg = document.getElementById('modal-img');
    const enterBtn = document.getElementById('modal-enter');

    modalImg.src = './img/Menhera/popup1.gif'

    const autoTimer = setTimeout(() => {
      if (!sceneUpdated) updateScene('intro');
    }, 3500);

    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);

    enterBtn.onclick = () => {
        playClickSound();
        clearTimeout(autoDisappearTimer);
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            sceneUpdated = true;
            console.log(sceneUpdated);
            clearTimeout(autoTimer);
            updateScene('intro');
        }, 500);
    };

    const autoDisappearTimer = setTimeout(() => {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 500);
    }, 3000);
    modal.style.display = 'flex';
    console.log(sceneUpdated);

    
}

(async () => {
    const response = await fetch('data.json');
    const data = await response.json();
    characterImages = data.characterImages;
    playOrder = data.playOrder;
    predefinedThemes = data.predefinedThemes;
    sections = data.sections;

    await loadSettings();
    happy_expressions = await loadHappyExpressions();
    idle_expressions = await loadIdleExpressions();
    setInterval(updateClock, 1000);
    updateClock();

    showIntroPopup();

})();
