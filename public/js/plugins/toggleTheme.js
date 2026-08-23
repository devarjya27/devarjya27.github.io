function pickWallpaper(links, storageKey = 'quieter:last-wallpaper') {
    if (!Array.isArray(links) || links.length === 0) {
        return '';
    }
    if (links.length === 1) {
        sessionStorage.setItem(storageKey, links[0]);
        return links[0];
    }

    const last = sessionStorage.getItem(storageKey);
    let choice = links[Math.floor(Math.random() * links.length)];

    if (choice === last) {
        const nextIndex = (links.indexOf(choice) + 1) % links.length;
        choice = links[nextIndex];
    }

    sessionStorage.setItem(storageKey, choice);
    return choice;
}

function setTheme() {
    document.documentElement.setAttribute('data-theme', 'dark');

    // Update Home Cover Image
    const headerBg = document.querySelector('.header-background');
    const isHome = document.querySelector('main.home');
    if (headerBg && isHome) {
        const darkImg = '/images/hades/4K_OpeningChamber.jpg';
        headerBg.style.backgroundImage = `url('${pickWallpaper([darkImg], 'quieter:home-wallpaper')}')`;
    }

    // giscus https://blog.jvav.me/posts/change-giscus-theme-at-runtime
    document.querySelectorAll("iframe.giscus-frame")?.forEach(frame => {
        frame.contentWindow.postMessage(
            {
                giscus: {
                    setConfig: {
                        theme: 'dark_high_contrast',
                    },
                },
            },
            "https://giscus.app"
        );
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setTheme();
});

window.addEventListener('pageshow', () => {
    setTheme();
});
