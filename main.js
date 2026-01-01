// ------------------ Vlogs Data ------------------
const vlogs = [
  { title: "Triple Bonus!!!", desc: "Triple Bonus!!!", thumb: "images/thumbnail1.jpg", link: "https://www.youtube.com/watch?v=N_C93F3fwm0" },
  { title: "Buccaneers vs Dollar Bommer bonus…", desc: "Which one is worse?! 🤔", thumb: "images/thumbnail2.jpg", link: "https://www.youtube.com/watch?v=XdD_x34WY54" },
  { title: "Triple Pop Bonus Bao Zhu Zhao Fu!", desc: "Triple Pop Bonus!", thumb: "images/thumbnail3.jpg", link: "https://www.youtube.com/watch?v=N-Z8QlAtPbQ" },
  { title: "Chica Bonita big score", desc: "Thank You!", thumb: "images/thumbnail4.jpg", link: "https://www.youtube.com/watch?v=jV3LxDzX85w" },
  { title: "Trying a new game 😎", desc: "Let’s try this!", thumb: "images/thumbnail5.jpg", link: "https://www.youtube.com/watch?v=1vH8J2qxKkE" },
  { title: "Monday Free Play", desc: "Watch till the end $$$", thumb: "images/thumbnail6.jpg", link: "https://www.youtube.com/watch?v=cTe2WUe12fU" },
  { title: "Dollar Storm Buccaneers", desc: "Dollar Storm", thumb: "images/thumbnail7.jpg", link: "https://www.youtube.com/watch?v=OF9CZXez7Hs" },
  { title: "Spooked play 😎", desc: "Didn’t disappoint!", thumb: "images/thumbnail8.jpg", link: "https://www.youtube.com/watch?v=rgKfbr2x-RI" },
  { title: "Friday Free Play", desc: "Total profit at the end 😎", thumb: "images/thumbnail9.jpg", link: "https://www.youtube.com/watch?v=GQlJqbWIe4A" },
  { title: "Bonus on all 3!!!", desc: "#subscribe", thumb: "images/thumbnail10.jpg", link: "https://www.youtube.com/watch?v=bZL3cCIXaG4" }
];

// ------------------ DOM REFERENCES ------------------
const cylinderWrap = document.getElementById("cylinderWrap");
const vlogContainer = document.getElementById("vlogContainer");
const yearSpan = document.getElementById("year");

yearSpan.textContent = new Date().getFullYear();

const items = [];

// ------------------ BUILD CYLINDER ITEMS ------------------
vlogs.forEach(v => {
  const el = document.createElement("a");
  el.href = v.link;
  el.target = "_blank";
  el.rel = "noopener noreferrer";
  el.className = "cyl-item";
  el.innerHTML = `<img src="${v.thumb}" alt="${v.title}" loading="lazy">`;
  cylinderWrap.appendChild(el);
  items.push(el);
});

// ------------------ BUILD VLOG CARDS ------------------
vlogs.forEach(v => {
  const card = document.createElement("a");
  card.href = v.link;
  card.target = "_blank";
  card.rel = "noopener noreferrer";
  card.className =
    "vlog-card inline-block bg-white text-gray-900 rounded-xl shadow-md overflow-hidden w-72";

  card.innerHTML = `
    <img src="${v.thumb}" alt="${v.title}" loading="lazy" class="w-full h-44 object-cover">
    <div class="p-4">
      <h3 class="font-semibold text-lg text-red-800">${v.title}</h3>
      <p class="scrolling-text text-gray-600 text-sm mt-1">${v.desc}</p>
    </div>
  `;
  vlogContainer.appendChild(card);
});

// ------------------ INTERSECTION ANIMATIONS ------------------
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    if (entry.target.tagName === "HEADER") {
      entry.target.querySelectorAll(".anim-hidden").forEach((el, i) => {
        setTimeout(() => {
          el.classList.add("anim-fadeUp");
          el.style.opacity = 1;
        }, i * 150);
      });
    } else {
      entry.target.classList.add("anim-fadeUp");
      entry.target.style.opacity = 1;
    }

    observer.unobserve(entry.target);
  });
}, { threshold: 0.25 });

document.querySelectorAll("header, #about, #vlogs, footer").forEach(el =>
  observer.observe(el)
);

// ------------------ TRUE 3D PILLAR CAROUSEL ------------------
if (
  window.gsap &&
  window.ScrollTrigger &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  gsap.registerPlugin(ScrollTrigger);

  const total = items.length;
  const radius = Math.min(window.innerWidth, 1200) * 0.32;
  const angleStep = 360 / total;

  // Position panels around pillar (facing outward)
  items.forEach((item, i) => {
    gsap.set(item, {
      rotateY: i * angleStep,
      z: radius,
      transformOrigin: `50% 50% -${radius}px`,
      backfaceVisibility: "hidden",
      transformPerspective: 1400,
      force3D: true,
      autoAlpha: 1
    });
  });

  // Rotate the pillar as one object
  gsap.to(cylinderWrap, {
    rotateY: "+=720",
    ease: "none",
    scrollTrigger: {
      trigger: "#showcase",
      start: "top top",
      end: "+=1200",
      scrub: true,
      pin: true,
      anticipatePin: 1
    }
  });

} else {
  // Reduced-motion fallback
  items.forEach(item => {
    item.style.opacity = 1;
    item.style.transform = "none";
  });
}
