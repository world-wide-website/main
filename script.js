document.addEventListener('DOMContentLoaded', () => {
const links = [
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" },
        { rel: "stylesheet", href: "https://site-assets.fontawesome.com/releases/v6.5.1/css/all.css" },
        { rel: "stylesheet", href: "style.css" },
        { rel: "text/javascript", src: "main.js"},
        { rel: "text/javascript", src: "audios.js"},
        { rel: "text/javascript", src: "music.js"}
    ];

links.forEach(({ rel, href, src }) => {
    const link = document.createElement(rel === "text/javascript" ? "script" : "link");
        if (rel === "text/javascript") {link.src = src;link.type = "text/javascript";document.body.appendChild(link);}
        else {link.rel = rel;link.href = href;document.head.appendChild(link);}
    });
      
    const fastTag = (tag, parent, className, id, text) => {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (id) el.id = id;
        if (text) el.textContent = text;
        if (parent) parent.appendChild(el);
        return el;
    };
});
