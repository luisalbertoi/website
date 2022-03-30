const devices = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];
const isMobile = devices.some(x => navigator.userAgent.match(x));

// container elements
const pointer = document.getElementById('pointer');
const motion = document.getElementById('motion');
const nombre = document.getElementById('name');
const form = document.getElementById('form');

// animate elements
const simplify = (arry, next, value) => arry.map((elem, i) => next(elem, value ? value : i));
const animate = ({ style }, value) => style.transform = value;
const await = (next, time) => setTimeout(() => next(), time);

// pointer funcion
const handler = ({ x, y, target }) => {
  const { children } = pointer;
  const exclude = [1, 2].map(x => children[x]);
  const complete = [0, 1, 2].map(x => children[x]);

  const translate = `translate(${x}px, ${y}px)`;

  const { cursor } = window.getComputedStyle(target, null);

  simplify(complete, animate, translate);

  if (cursor === 'pointer') {
    simplify(exclude, (elem, i) => animate(elem, `${translate} scale(${i > 0 ? 0 : 1})`));
  } else {
    simplify(exclude, (elem, i) => animate(elem, `${translate} scale(${i > 0 ? 1 : 0})`));
  }
}

// motion elements
function startMotion() {
  const { body } = document;
  const { children } = motion;
  const { children: { length } } = motion;
  const amount = new Array(length).fill('');
  const elements = amount.map((x, i) => children[i]);

  const random = value => Math.round(Math.random() * value);

  const translate = (x, y, r) => `translate(${x + 50}px, ${y}px) rotate(${r}deg)`;

  setInterval(() => {
    const { clientWidth, clientHeight } = body;
    simplify(elements, elem => animate(elem, translate(random(clientWidth), random(clientHeight), random(180))));
  }, 2000);
}

// animate name
function createName() {
  const { children } = nombre;

  const print = (elem, arry) => {
    for (let i = 0; i < arry.length; i++) {
      setTimeout(() => {
        elem.innerHTML += `<div class="letter">${arry[i]}</div>`;
      }, 60 * i);
    }
  }

  const letter = [
    { num: 0, value: ['L', 'u', 'i', 's'], time: 0 },
    { num: 1, value: ['A', 'l', 'b', 'e', 'r', 't', 'o'], time: 260 },
    { num: 2, value: ['I', 'b', 'a', 'ñ', 'e', 'z'], time: 760 },
  ]

  simplify(letter, ({ num, value, time }) => await(() => print(children[num], value), time));
}

// send email
form.addEventListener('submit', env => {
  env.preventDefault();

  const formData = new FormData(form);

  const data = {
    email: 'alberdj987@gmail.com',
    subject: formData.get('subject'),
    message: formData.get('message')
  };

  document.location = `mailto:${data.email}?subject=${data.subject}&body=${data.message}`;

}, false);

// start
createName();
startMotion();
if (!isMobile) {
  pointer.style.display = 'initial';
  document.addEventListener('mousemove', handler, true);
}