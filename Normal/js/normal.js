// normal.js — Redesigned Version (Fixed navigation + enhanced theme switching)
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.querySelector(".theme-toggle");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const backToTop = document.getElementById("back-to-top");

  // ======== THEME HANDLING ========
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    body.classList.add("light");
    body.classList.remove("dark");
  } else {
    body.classList.add("dark");
    body.classList.remove("light");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      // Add fade transition
      body.classList.add("fade-theme");
      
      // Toggle theme classes
      body.classList.toggle("light");
      body.classList.toggle("dark");
      
      // Save theme preference
      const currentTheme = body.classList.contains("light") ? "light" : "dark";
      localStorage.setItem("theme", currentTheme);
      
      // Remove fade class after transition
      setTimeout(() => {
        body.classList.remove("fade-theme");
      }, 500);
    });
  }

  // Add smooth fading effect style
  const style = document.createElement("style");
  style.innerHTML = `
    body.fade-theme {
      transition: background 0.5s ease, color 0.5s ease, filter 0.5s ease;
      filter: brightness(1.05);
    }
  `;
  document.head.appendChild(style);

  // ======== NAVBAR TOGGLE (Mobile Fix) ========
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("open");
      navLinks.classList.toggle("active");
      
      // Prevent body scroll when menu is open
      if (navLinks.classList.contains("active")) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    });
    
    // Close menu when clicking on a link
    const navLinksItems = navLinks.querySelectorAll("a");
    navLinksItems.forEach(link => {
      link.addEventListener("click", () => {
        navToggle.classList.remove("open");
        navLinks.classList.remove("active");
        document.body.style.overflow = "";
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navToggle.classList.remove("open");
        navLinks.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  // ======== BACK TO TOP BUTTON ========
  if (backToTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ======== SCROLL ANIMATIONS ========
  const sections = document.querySelectorAll(".section");
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Add staggered animation delay
        const index = Array.from(sections).indexOf(entry.target);
        entry.target.style.animationDelay = `${index * 0.1}s`;
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));

  // ======== GITHUB REPOS ========
  const username = "7wp81x";
  const container = document.getElementById("repos-container");
  if (container) {
    container.innerHTML = "<p>Loading repos...</p>";
    
    fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch repos");
        return res.json();
      })
      .then((repos) => {
        // Sort by stars and get top 5
        repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
        const topRepos = repos.slice(0, 5);
        
        // Clear loading message
        container.innerHTML = "";
        
        // Create repo cards
        topRepos.forEach((repo) => {
          const card = document.createElement("div");
          card.className = "repo-card";
          card.innerHTML = `
            <h4>${repo.name}</h4>
            <p>${repo.description || "No description available"}</p>
            <p><strong>Language:</strong> ${repo.language || "N/A"} | ⭐ ${repo.stargazers_count}</p>
            <a href="${repo.html_url}" target="_blank" class="repo-link">View Repository</a>
          `;
          container.appendChild(card);
        });
      })
      .catch((error) => {
        console.error("Error loading GitHub repos:", error);
        container.innerHTML = "<p>Unable to load repositories at this time.</p>";
      });
  }
  
  // ======== ADDITIONAL ENHANCEMENTS ========
  
  // Add loading animation for better UX
  const loadingStyle = document.createElement("style");
  loadingStyle.innerHTML = `
    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 1; }
      100% { opacity: 0.6; }
    }
    
    #repos-container p {
      animation: pulse 2s infinite;
      text-align: center;
      padding: 20px;
    }
    
    .repo-link {
      display: inline-block;
      margin-top: 10px;
      color: var(--turquoise-light);
      text-decoration: none;
      font-weight: 600;
      transition: var(--transition);
    }
    
    .repo-link:hover {
      color: var(--turquoise-glow);
      text-decoration: underline;
    }
    
    body.light .repo-link {
      color: var(--turquoise-dark);
    }
  `;
  document.head.appendChild(loadingStyle);
  setupProjectIframes();

});

// ======== DYNAMIC IFRAME URLS FOR WEB PROJECTS ========
function setupProjectIframes() {
  const projectIframes = document.querySelectorAll('.project-card iframe');
  
  if (projectIframes.length > 0) {
    projectIframes.forEach((iframe, index) => {
      // Generate the correct URL based on hosting environment
      let hostUrl;
      const projectSlug = `activity_${index + 1}`; // or get from data attribute
      
      if (window.location.host.includes('github')) {
        hostUrl = `https://${window.location.host}/Portfolio/Interactive/projects/${projectSlug}`;
      } else {
        hostUrl = `http://${window.location.host}/Interactive/projects/${projectSlug}/index.html`;
      }
      
      // Set the iframe source
      iframe.src = hostUrl;
      
      // Add error handling
      iframe.onerror = function() {
        this.src = `about:blank`;
        this.parentElement.innerHTML += `
          <p style="color: var(--turquoise-light); margin-top: 10px;">
            <i class="fas fa-exclamation-triangle"></i> 
            Project not available at: ${hostUrl}
          </p>
        `;
      };
      
      // Add loading state
      iframe.onload = function() {
        this.style.opacity = '1';
      };
      
      iframe.style.opacity = '0';
      iframe.style.transition = 'opacity 0.5s ease';
    });
  }
}

// Call the function when DOM is loaded
