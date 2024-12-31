document.addEventListener('DOMContentLoaded', () => {
    const links = [
        { rel: "stylesheet", href: "style.css" },
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" },
        { rel: "stylesheet", href: "https://site-assets.fontawesome.com/releases/v6.5.1/css/all.css" },
        //{ rel: "text/javascript", src: "main.js"},
    ];

    links.forEach(({ rel, href, src }) => {
        const link = document.createElement(rel === "text/javascript" ? "script" : "link");
        if (rel === "text/javascript") { link.src = src; link.type = "text/javascript"; document.body.appendChild(link); } 
        else { link.rel = rel; link.href = href; document.head.appendChild(link); }
    });

    const fastTag = (tag, parent, className, id, text) => {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (id) el.id = id;
        if (text) el.textContent = text;
        if (parent) parent.appendChild(el);
        return el;
    };

    const Root = fastTag('div', document.body, 'Root');
    const footer = fastTag('div', Root, 'footer');
    const container = fastTag('div', Root, 'container');

    const web = [
        { pages: 'Home', id: 'home', icon: 'home', colors: 'red' },
        { pages: 'Videos', id: 'videos', icon: 'subscriptions', colors: 'green' },
        { pages: 'Add', id: 'add', icon: 'add_circle', colors: 'yellow' },
        { pages: 'Music', id: 'music', icon: 'music_note', colors: 'gray' },
        { pages: 'Profile', id: 'profile', icon: 'account_circle', colors: 'blue' }
    ];

    web.forEach(({ pages, icon, id }) => {
        const aside = fastTag('div', footer, 'footer-item', id);
        fastTag('span', aside, 'material-symbols-outlined', null, icon);
        fastTag('h2', aside, null, null, pages);
    });

    let currentPlayingIframe = null;
    let currentPlayingAudio = null;

    const stopAllMedia = () => {
        if (currentPlayingIframe) {
            currentPlayingIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            currentPlayingIframe = null;
        }

        if (currentPlayingAudio) {
            currentPlayingAudio.pause();
            currentPlayingAudio = null;
        }
    };

    web.forEach(({ pages, colors }) => {
        const page = fastTag('div', container, 'page');
        // fastTag('h1', page, null, null, pages);
        const content = fastTag('div', page, 'content');
        page.style.backgroundColor = colors;

        if (pages === 'Videos') {
            const iframe = fastTag('iframe', content, '', 'main-iframe', '');
            iframe.src = "https://www.youtube.com/embed/-a1QP9rsm6g?controls=1";
            iframe.width = "560";
            iframe.height = "315";
            iframe.frameBorder = "0";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            
            // Hide the iframe by default
            iframe.style.display = 'none';

            const iframes = [
                {  TitleName: 'V3 Nazi Gun', Type: 'weapoen', SrcLink: '-a1QP9rsm6g', Img: '01.jpg' },
                {  TitleName: 'One piece', Type: 'bgm', SrcLink: 'LxeaTSOeyzk', Img: '02.jpg' },
                {  TitleName: 'Shanti People', Type: 'song', SrcLink: 'Qz4LC9Pmo7Y', Img: '03.jpg' },
                {  TitleName: 'Kanmani Anbodu', Type: 'song', SrcLink: 'bAL8ZmtlDTs', Img: '04.jpg' }
            ];

            const list = fastTag('div', content, 'list', '', '');
            
            iframes.forEach(({ SrcLink, TitleName, Type, Img }) => {
                const ytLink = fastTag('a', list, '', '', '');
                ytLink.href = '#';
                ytLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    stopAllMedia();  // Stop other media first
                    const mainIframe = document.getElementById('main-iframe');
                    mainIframe.src = `https://www.youtube.com/embed/${SrcLink}?autoplay=1&controls=1&enablejsapi=1`;
                    mainIframe.src = `${SrcLink}`;
                    mainIframe.style.display = 'block';  // Show the iframe
                    currentPlayingIframe = mainIframe;
                });
                fastTag('img', ytLink, '', '', '').src = `../.././../../Media/images/${Img}`;
                const Titles =    fastTag('div', ytLink, 'Titles', '');
                fastTag('span', Titles, '', '', TitleName);
                fastTag('span', Titles, '', '', Type);
            });
        }

        if (pages === 'Music') {
            const audio = fastTag('audio', content, '', 'main-audio', '');
            audio.src = "Audio/DAKU.mp3";
            audio.addEventListener('play', () => { if (currentPlayingAudio !== audio) { stopAllMedia(); currentPlayingAudio = audio; }});
            // audio.controls = true;

            const Audios = [
                { TitleName: 'DAKU', SrcLink: 'DAKU', type: 'mp3', Img: '06', formate: '.jpg'},
                { TitleName: 'Deo Deo', SrcLink: 'Deo-Deo', type: 'mp3', Img: '05', formate: '.jpg'},
                { TitleName: 'Da-Da-Dad', SrcLink: 'Da-Da-Dad', type: 'mp3', Img: '05', formate: '.jpg'},
                { TitleName: 'Old Town Road x No Love', SrcLink: 'Old-Town-Road-x-No-Love', type: 'mp3', Img: '05', formate: '.jpg'},
            ];

            Audios.forEach(({ SrcLink, TitleName, type, Img, formate }) => {
                const musicLink = fastTag('a', content, '', '', '');
                musicLink.href = '#';
                musicLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    stopAllMedia();  // Stop other media first
                    const mainAudio = document.getElementById('main-audio');
                    mainAudio.src = `Audio/${SrcLink}.${type}`;
                    mainAudio.play();
                    currentPlayingAudio = mainAudio;
                });
                // fastTag('img', musicLink, '', '', '').src = Img;
                fastTag('img', musicLink, '', '', '').src = `../.././../../Media/images/${Img}${formate}`;
                fastTag('span', musicLink, '', '', TitleName);
            });
        }
    });

    let counter = 4;
    const pageElems = document.querySelectorAll('.page');
    const footerElems = document.querySelectorAll('.footer-item');

    const updateSlide = (n) => {
        if (n > pageElems.length) counter = 1;
        if (n < 1) counter = pageElems.length;
        pageElems.forEach(p => p.style.display = 'none');
        footerElems.forEach(f => f.classList.remove('active'));
        pageElems[counter - 1].style.display = 'block';
        footerElems[counter - 1].classList.add('active');
    };

    footerElems.forEach((f, i) => f.addEventListener('click', () => updateSlide(counter = i + 1)));
    updateSlide(counter);
});
