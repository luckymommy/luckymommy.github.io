// ------------------ Vlogs Data ------------------
const vlogs = [
  {title:"Triple Bonus!!!", desc:"Triple Bonus!!!", thumb:"images/thumbnail1.jpg", link:"https://www.youtube.com/watch?v=N_C93F3fwm0"},
  {title:"Buccaneers vs Dollar Bommer bonus…", desc:"Buccaneers vs Dollar Bommer bonus… which one is worse?! 🤔", thumb:"images/thumbnail2.jpg", link:"https://www.youtube.com/watch?v=XdD_x34WY54"},
  {title:"Triple Pop Bonus Bao Zhu Zhao Fu!", desc:"Triple Pop Bonus Bao Zhu Zhao Fu!", thumb:"images/thumbnail3.jpg", link:"https://www.youtube.com/watch?v=N-Z8QlAtPbQ"},
  {title:"Chica Bonita give me a big score…", desc:"Thank You!", thumb:"images/thumbnail4.jpg", link:"https://www.youtube.com/watch?v=jV3LxDzX85w"},
  {title:"Let’s try this new game…😎", desc:"Let’s try this new game…😎", thumb:"images/thumbnail5.jpg", link:"https://www.youtube.com/watch?v=1vH8J2qxKkE"},
  {title:"Monday Free Play…", desc:"Triple pop, watch till the end for the total profit $$$", thumb:"images/thumbnail6.jpg", link:"https://www.youtube.com/watch?v=cTe2WUe12fU"},
  {title:"Dollar Storm Buccaneers", desc:"Dollar Storm Buccaneers", thumb:"images/thumbnail7.jpg", link:"https://www.youtube.com/watch?v=OF9CZXez7Hs"},
  {title:"I got spooked so I decided to play dollar storm…and it didn’t disappoint me😎", desc:"none", thumb:"images/thumbnail8.jpg", link:"https://www.youtube.com/watch?v=rgKfbr2x-RI"},
  {title:"Friday Free Play", desc:"@ Dollar Storm…Watch how much profit I get at the end..😎", thumb:"images/thumbnail9.jpg", link:"https://www.youtube.com/watch?v=GQlJqbWIe4A"},
  {title:"Bonus on all 3!!! IS THIS MACHINE BROKEN??!?!", desc:"#subscribe", thumb:"images/thumbnail10.jpg", link:"https://www.youtube.com/watch?v=bZL3cCIXaG4"}
];

// ------------------ Cylinder / Pillar Carousel ------------------
const cylinderWrap = document.getElementById('cylinderWrap');
const items = [];

// Create cylinder items
vlogs.forEach(v => {
  const el = document.createElement('a');
  el.href = v.link;
  el.target = "_blank";
  el.rel = "noopener noreferrer";
  el.className = "cyl-item";
  el.innerHTML = `<img src="${v.thumb}" alt="${v.title}" loading="lazy">`;
  cylinderWrap.appendChild(el);
  items.push(el);
});

// ------------------ Vlog Cards ------------------
const vlogContainer = document.getElementById('vlogContainer');
const yearSpan = document.getElementById('year');
yearSpan.textContent = new Date().getFullYear();

vlogs.forEach(v => {
  const card = document.createElement('a');
  card.href = v.link;
  card.target = "_blank";
  card.rel = "noopener noreferrer";
  card.className = "vlog-card inline-block bg-white text-gray-900 rounded-xl shadow-md overflow-hidden w-72 focus-visible:ring-2 focus-visible:ring-yellow-300";
  card.innerHTML = `
    <img src="${v.thumb}" alt="${v.title}" loading="lazy" class="w-full h-44 object-cover">
    <div class="p-4">
      <h3 class="font-semibold text-lg text-red-800">${v.title}</h3>
      <p class="scrolling-text text-gray-600 text-sm mt-1">${v.desc}</p>
    </div>`;
  vlogContainer.appendChild(card);
});

// ------------------ Scroll Animations ------------------
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      if(entry.target.tagName === "HEADER") {
        entry.target.querySelectorAll('.anim-hidden').forEach((el,i) => {
          setTimeout(() => { el.classList.add('anim-fadeUp'); el.style.opacity = 1; }, i*200);
        });
      } else if(entry.target.id === "about") {
        const img = entry.target.querySelector('img');
        const txt = entry.target.querySelector('#aboutText');
        img.classList.add('anim-fadeLeft'); img.style.opacity = 1;
        txt.classList.add('anim-fadeRight'); txt.style.opacity = 1;
      } else if(entry.target.id === "vlogs") {
        entry.target.querySelectorAll('h2,p').forEach(el => {
          el.classList.add('anim-fadeUp'); el.style.opacity = 1;
        });
      } else {
        entry.target.classList.add('anim-fadeUp'); entry.target.style.opacity = 1;
      }
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('header,#about,#vlogs,footer').forEach(el => observer.observe(el));

// ------------------ GSAP Pillar Carousel (Outward-Facing) ------------------
if(window.gsap && window.ScrollTrigger && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  gsap.registerPlugin(ScrollTrigger);
  const total = items.length;
  const radius = Math.min(window.innerWidth,1200)*0.25;
  const driver = { pos: 0 };
  const visibleCount = 3;

  function visibleIndices(centerIndex){
    const half = Math.floor(visibleCount/2);
    const indices = [];
    for(let i=-half;i<=half;i++){
      indices.push((centerIndex+i+total)%total);
    }
    return indices;
  }

  items.forEach(it => gsap.set(it, { autoAlpha:0, scale:0.9, rotationY:0 }));

  const tl = gsap.timeline({
    scrollTrigger:{
      trigger:'#showcase',
      start:'top top',
      end:'+=900',
      scrub:0.6,
      pin:true,
      anticipatePin:1
    }
  });

  tl.to(driver, {
    pos: total-1,
    duration: 2,
    ease: 'none',
    onUpdate: () => {
      const t = driver.pos;
      const center = Math.floor(t) % total;
      const indices = visibleIndices(center);
      const angleStep = (Math.PI*2)/total;

      items.forEach(it => { gsap.set(it,{autoAlpha:0,visibility:'hidden'}); it.classList.remove('front'); });

      indices.forEach(idx => {
        const offset = idx*angleStep-(t*angleStep);
        const x = Math.cos(offset)*radius;
        const z = Math.sin(offset)*radius*0.9;
        const y = Math.sin(offset*0.5)*(radius*0.04);
        const rotationY = (offset*180/Math.PI)+90;
        const closeness = Math.max(0,Math.cos(offset));

        gsap.set(items[idx],{
          x:x,
          y:y,
          z:z,
          rotationY:rotationY,
          scale:0.95+(closeness*0.25),
          transformPerspective:1400,
          force3D:true,
          autoAlpha:1
        });

        items[idx].style.opacity = 0.35+(closeness*0.9);
        if(closeness>0.9) items[idx].classList.add('front');
      });
    }
  });
  
  ScrollTrigger.create({
    trigger:'#showcase',
    start:'top top',
    onEnterBack: () => {
      gsap.to('#showcase',{autoAlpha:1,duration:0.18});
      gsap.to('#vlogs',{autoAlpha:0,duration:0.18});
    }
  });
} else {
  // Fallback for reduced motion
  document.getElementById('vlogs').style.opacity=1;
  items.forEach(it => { it.style.opacity=1; it.style.visibility='visible'; });
}
