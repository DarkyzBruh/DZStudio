document.addEventListener("DOMContentLoaded", () => {

    // --- 1. Loader Logic ---
    const loader = document.getElementById('loader-wrapper');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 600);
        }, 800);
    });

    // --- 2. Scroll Reveal Animations ---
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => revealOnScroll.observe(reveal));

    // --- 3. Parallax Effect ---
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBg = document.querySelector('.hero-bg');
        const heroContent = document.querySelector('.hero-content');

        if (heroBg && heroContent) {
            heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / 700);
        }
    });

    // --- 4. Minecraft Server Status (mcstatus.io) ---
    const serverIP = 'mc.dzstudio.space';
    const apiUrl = `https://api.mcstatus.io/v2/status/java/${serverIP}`;

    const pulse = document.getElementById('status-pulse');
    const statusText = document.getElementById('status-badge-text');
    const playerCount = document.getElementById('player-count');
    const versionText = document.getElementById('version-text');
    const motdText = document.getElementById('motd-text');
    const refreshBtn = document.getElementById('refresh-btn');

    async function fetchServerStatus() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.online) {
                pulse.className = 'status-pulse online';
                statusText.textContent = 'EN LÍNEA';
                playerCount.textContent = `${data.players.online} / ${data.players.max}`;
                versionText.textContent = data.version.name_clean || '1.20+';
                motdText.textContent = data.motd.clean || '¡Bienvenido a DZ Studio!';
            } else {
                setOfflineState();
            }
        } catch (error) {
            console.error('Status Fetch Error:', error);
            setOfflineState();
        }
    }

    function setOfflineState() {
        pulse.className = 'status-pulse offline';
        statusText.textContent = 'DESCONECTADO';
        playerCount.textContent = '0 / 0';
        versionText.textContent = 'N/A';
        motdText.textContent = 'El servidor no está disponible en este momento o está bajo mantenimiento.';
    }

    // Initial Fetch
    fetchServerStatus();

    // Refresh Logic
    refreshBtn.addEventListener('click', () => {
        const icon = refreshBtn.querySelector('i');
        icon.classList.add('fa-spin');
        fetchServerStatus().then(() => {
            setTimeout(() => icon.classList.remove('fa-spin'), 600);
        });
    });

    // Auto-update every 2 minutes
    setInterval(fetchServerStatus, 120000);

    // --- 5. Global Helpers ---
    window.copyIP = () => {
        const ip = 'mc.dzstudio.space';
        navigator.clipboard.writeText(ip).then(() => {
            const btn = document.querySelector('.copy-btn');
            const originalIcon = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check" style="color: #00ff88"></i>';
            setTimeout(() => {
                btn.innerHTML = originalIcon;
            }, 2000);
        });
    };
});
