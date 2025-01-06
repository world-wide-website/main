document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    window.fastTag = (tag, parent, className, id, text) => {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (id) element.id = id;
        if (text) element.textContent = text;
        if (parent) parent.appendChild(element);
        return element;
    };

    const resources = [
        { type: "link", rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" },
        { type: "link", rel: "stylesheet", href: "https://site-assets.fontawesome.com/releases/v6.5.1/css/all.css" },
        { type: "link", rel: "stylesheet", href: "style.css" },
        { type: "script", src: "videos.js", defer: true },
        { type: "script", src: "audios.js", defer: true },
    ];
    resources.forEach(({ type, rel, href, src, defer }) => {
        let element;
        if (type === "link") { element = document.createElement("link"); element.rel = rel; element.href = href; }
        else if (type === "script") { element = document.createElement("script"); element.src = src; if (defer) element.defer = true; }
        document.head.appendChild(element);
    });

    const path = '../';
    const loadMediaItems = (items, content, stopAllMedia, fastTag, mediaType) => {
        const mainContainer = fastTag('div', content, 'main', '');
        const mainMedia = fastTag(mediaType, mainContainer, 'main-media', `main-${mediaType}`, '');
        const mainControl = fastTag('div', mainContainer, 'mainControl', '');
        const titleTime = fastTag('div', mainControl, 'titleTime', '');
        const Maintitle = fastTag('span', titleTime, 'Maintitle', '', ''); // Placeholder for main title
        const currentTimeSpan = fastTag('span', titleTime, 'time-span', 'currentTime', '00:00:00');
        const totalTimeSpan = fastTag('span', titleTime, 'time-span', 'totalTime', '00:00:00');
        const list = fastTag('div', content, 'list', '', '');
        mainContainer.style.display = 'none';
        mainMedia.controls = true;
        let currentlyPlayingItem = null;
        const Time = (n) => n.toString().padStart(2, '0');
        const formatDuration = (duration) => {
            let durationText = '';
            if (duration < 60) {
                durationText = `00:${Time(Math.floor(duration))}`;
            } else if (duration < 3600) {
                const minutes = Time(Math.floor(duration / 60));
                const seconds = Time(Math.floor(duration % 60));
                durationText = `${minutes}:${seconds}`;
            } else if (duration < 86400) {
                const hours = Time(Math.floor(duration / 3600));
                const minutes = Time(Math.floor((duration % 3600) / 60));
                const seconds = Time(Math.floor(duration % 60));
                durationText = `${hours}:${minutes}:${seconds}`;
            } else {
                const days = Math.floor(duration / 86400);
                const hours = Time(Math.floor((duration % 86400) / 3600));
                const minutes = Time(Math.floor((duration % 3600) / 60));
                const seconds = Time(Math.floor(duration % 60));
                durationText = `${days}d ${hours}:${minutes}:${seconds}`;
            }
            return durationText;
        };

        items.forEach(({ Type, Title, subTitle, Src, Img, imgType, Tags }) => {
            const mediaList = fastTag('div', list, 'list-item', '', '');
            mediaList.addEventListener('click', (e) => {
                e.preventDefault();
                if (mediaList.classList.contains('playing')) {
                    const playStatus = mediaList.querySelector('span.play').textContent;
                    if (playStatus === 'Paused') {
                        if (mediaType === 'audio' && currentPlayingVideo) { currentPlayingVideo.pause(); }
                        if (mediaType === 'video' && currentPlayingAudio) { currentPlayingAudio.pause(); }
                        mainMedia.play();
                        const playingIcon = mediaList.querySelector('span.play');
                        playingIcon.textContent = 'Playing';
                    }
                } else {
                    stopAllMedia();
                    mainMedia.src = mediaType === 'audio' ? `${path}Audio/${Src}.${Type}` : `${path}Video/${Src}.${Type}`;
                    mainMedia.style.display = 'block';
                    mainContainer.style.display = 'block';
                    mainMedia.play();
                    if (mediaType === 'video') { currentPlayingVideo = mainMedia; } 
                    else { currentPlayingAudio = mainMedia; }
                    if (currentlyPlayingItem) {
                        const prevIcon = currentlyPlayingItem.querySelector('span.play');
                        currentlyPlayingItem.classList.remove('playing');
                        if (prevIcon) currentlyPlayingItem.removeChild(prevIcon);
                    }
                    mediaList.classList.add('playing');
                    const playingIcon = fastTag('span', mediaList, 'play', '', 'Playing');
                    const durationElement = mediaList.querySelector('span.sourceTime');
                    currentlyPlayingItem = mediaList;
                    if (durationElement) { totalTimeSpan.textContent = durationElement.textContent; }
                    Maintitle.textContent = Title;
                    mainMedia.addEventListener('play', () => { playingIcon.textContent = 'Playing'; });
                    mainMedia.addEventListener('pause', () => { playingIcon.textContent = 'Paused'; });
                    mainMedia.addEventListener('ended', () => { playingIcon.textContent = 'Paused'; });
                }
            });

            const sourceDiv = fastTag('div', mediaList, 'source', '', '');
            const imgElement = fastTag('img', sourceDiv, '', '', '');
            const tempMedia = document.createElement(mediaType);
            imgElement.src = `${path}Images/${Img}.${imgType}`;
            tempMedia.src = mediaType === 'audio' ? `${path}Audio/${Src}.${Type}` : `${path}Video/${Src}.${Type}`;
            tempMedia.addEventListener('loadedmetadata', () => {
                const duration = tempMedia.duration;
                const durationText = formatDuration(duration);
                fastTag('span', sourceDiv, 'sourceTime', '', durationText);
            });

            const Titles = fastTag('div', mediaList, 'Titles', '');
            const listTitle = fastTag('h3', Titles, 'listTitle', '', Title);
            const listsubTitle = fastTag('p', Titles, 'listsubTitle', '', subTitle);

            // Adding hashtag logic
            const hashTagsSpan = fastTag('span', Titles, 'hashTagsSpan', '');
            Tags.forEach((cat, index) => {
                if (index < 2) {
                    fastTag('a', hashTagsSpan, 'hashTag', '', `#${cat}`).setAttribute('href', `#${cat}`);
                } else if (index === 2) {
                    const moreTag = fastTag('i', hashTagsSpan, 'more', '', 'more...');
                    moreTag.style.cursor = 'pointer';
                    moreTag.addEventListener('click', () => {
                        if (moreTag.textContent === 'more...') {
                            for (let j = 2; j < Tags.length; j++) {
                                fastTag('a', hashTagsSpan, 'hashTag', '', `#${Tags[j]}`).setAttribute('href', `#${Tags[j]}`);
                            }
                            moreTag.textContent = 'less...';
                        } else {
                            const allHashTags = hashTagsSpan.querySelectorAll('a.hashTag');
                            allHashTags.forEach((hashTag, idx) => {
                                if (idx >= 2) {
                                    hashTagsSpan.removeChild(hashTag);
                                }
                            });
                            moreTag.textContent = 'more...';
                        }
                    });
                }
            });

        });

        mainMedia.addEventListener('timeupdate', () => {
            const currentTime = mainMedia.currentTime;
            const currentTimeText = formatDuration(currentTime);
            currentTimeSpan.textContent = currentTimeText;
        });
    };

    let currentPlayingVideo = null;
    let currentPlayingAudio = null;
    const stopAllMedia = () => {
        if (currentPlayingVideo) { currentPlayingVideo.pause(); currentPlayingVideo = null; }
        if (currentPlayingAudio) { currentPlayingAudio.pause(); currentPlayingAudio = null; }
    };

    setTimeout(() => {
        console.log('Videos:', Videos);
        console.log('Audios:', Audios);
        const Root = fastTag('div', document.body, 'Root');
        const asider = fastTag('div', Root, 'asider');
        const container = fastTag('div', Root, 'container');
        const web = [
            { pages: 'Home', icon: 'home', colors: 'red' },
            { pages: 'Videos', icon: 'subscriptions', colors: 'green' },
            { pages: 'Add', icon: 'add_circle', colors: 'yellow' },
            { pages: 'Music', icon: 'music_note', colors: 'gray' },
            { pages: 'Profile', icon: 'account_circle', colors: 'blue' }
        ];
        web.forEach(({ pages, colors, icon }) => {
            const aside = fastTag('div', asider, 'asider-item');
            fastTag('span', aside, 'material-symbols-outlined', null, icon);
            fastTag('h2', aside, null, null, pages);
                const page = fastTag('div', container, 'page');
                const content = fastTag('div', page, 'content');
                page.style.backgroundColor = colors;
                if (pages === 'Videos') { loadMediaItems(Videos, content, stopAllMedia, fastTag, 'video'); }
                if (pages === 'Music') { loadMediaItems(Audios, content, stopAllMedia, fastTag, 'audio'); }
            });
            let counter = 2;
            const pageElems = document.querySelectorAll('.page');
            const asiderElems = document.querySelectorAll('.asider-item');
            const updateSlide = (n) => {
                if (n > pageElems.length) counter = 1;
                if (n < 1) counter = pageElems.length;
                pageElems.forEach(p => p.style.display = 'none');
                asiderElems.forEach(f => f.classList.remove('active'));
                pageElems[counter - 1].style.display = 'block';
                asiderElems[counter - 1].classList.add('active');
            };
            asiderElems.forEach((f, i) => f.addEventListener('click', () => updateSlide(counter = i + 1)));
            updateSlide(counter);
        }, 1000);
        });
        
