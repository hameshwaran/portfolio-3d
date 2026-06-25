// js/main.js
let scene, camera, renderer;
let particles = [];
let projectCards = [];

const projects = [
    {
        id: 1,
        title: "Reinforcement Learning Trading",
        desc: "Advanced ML trading environment using DQN and PPO algorithms",
        tech: ["Python", "TensorFlow", "Gym"],
        link: "https://github.com/hameshwaran/Reinforcement-Learning-Trading-Environment"
    },
    {
        id: 2,
        title: "Jarvis AI Assistant",
        desc: "Personal AI assistant with NLP and voice recognition",
        tech: ["Python", "PyTorch", "Flask"],
        link: "https://github.com/hameshwaran/Jarvis-your-personal-assistance-"
    },
    {
        id: 3,
        title: "ThreatLensAI",
        desc: "Cybersecurity threat detection system using deep learning",
        tech: ["Python", "TensorFlow", "Scikit-learn"],
        link: "https://github.com/hameshwaran/ThreatLensAI-"
    },
    {
        id: 4,
        title: "AMU Platform",
        desc: "Full-stack educational platform with real-time features",
        tech: ["React", "Node.js", "MongoDB"],
        link: "https://github.com/hameshwaran/AMU-Platform"
    },
    {
        id: 5,
        title: "Transport Management AI",
        desc: "Intelligent transport optimization system",
        tech: ["Python", "Flask", "Machine Learning"],
        link: "https://github.com/hameshwaran/Transport-management-using-AI"
    }
];

class Particle {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.z = Math.random() * 1000;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.vz = (Math.random() - 0.5) * 2;
        this.size = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;

        if (this.x < 0) this.x = window.innerWidth;
        if (this.x > window.innerWidth) this.x = 0;
        if (this.y < 0) this.y = window.innerHeight;
        if (this.y > window.innerHeight) this.y = 0;
        if (this.z < 0) this.z = 1000;
        if (this.z > 1000) this.z = 0;
    }
}

function init3D() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.z = 500;

    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('canvas'),
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0f0c29, 0.1);

    // Create particles
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }

    // Create geometry for particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particles.length * 3);
    
    particles.forEach((p, i) => {
        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z;
    });

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0x00ff88,
        size: 2,
        sizeAttenuation: true
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    createProjectCards();
    animate();
}

function createProjectCards() {
    projects.forEach((project, index) => {
        const angle = (index / projects.length) * Math.PI * 2;
        const radius = 300;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        const card = document.createElement('div');
        card.className = 'project-card';
        card.style.position = 'fixed';
        card.style.left = (window.innerWidth / 2 + x) + 'px';
        card.style.top = (window.innerHeight / 2 + y) + 'px';
        card.style.transform = 'translate(-50%, -50%)';
        
        card.innerHTML = `
            <div class="project-title">${project.title}</div>
            <div class="project-desc">${project.desc}</div>
        `;

        card.onclick = () => openModal(project);
        document.body.appendChild(card);
        
        projectCards.push({
            element: card,
            angle: angle,
            project: project,
            x: x,
            y: y
        });
    });
}

function animate() {
    requestAnimationFrame(animate);

    // Update particles
    particles.forEach(p => p.update());

    // Rotate project cards
    projectCards.forEach((card, index) => {
        const time = Date.now() * 0.0001;
        const angle = card.angle + time;
        const radius = 300;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        card.element.style.left = (window.innerWidth / 2 + x) + 'px';
        card.element.style.top = (window.innerHeight / 2 + y) + 'px';

        // Add glow effect
        const distance = Math.sqrt(x * x + y * y);
        const glow = 1 - (distance / 400);
        card.element.style.opacity = Math.max(0.3, glow);
    });

    renderer.render(scene, camera);
}

function openModal(project) {
    const modal = document.getElementById('projectModal');
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalDescription').textContent = project.desc;
    
    const techDiv = document.getElementById('modalTech');
    techDiv.innerHTML = '<strong>Technologies:</strong><br>';
    project.tech.forEach(tech => {
        techDiv.innerHTML += `<span class="skill-tag">${tech}</span>`;
    });

    const linksDiv = document.getElementById('modalLinks');
    linksDiv.innerHTML = `<a href="${project.link}" target="_blank" class="project-link">View on GitHub →</a>`;

    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('projectModal').classList.remove('active');
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('click', (e) => {
    if (e.target.id === 'projectModal') {
        closeModal();
    }
});

init3D();
