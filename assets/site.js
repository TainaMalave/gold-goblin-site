(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Fade sections in as they scroll into view.
  var revealed = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealed.forEach(function (el) { observer.observe(el); });
  } else {
    revealed.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Poke the goblin: it says something and coins fly out.
  var button = document.querySelector('.goblin-btn');
  var wrap = document.querySelector('.goblin-wrap');
  var bubble = document.querySelector('.goblin-wrap .bubble');
  var loot = document.querySelector('.loot');
  if (!button || !wrap || !bubble || !loot) return;

  var lootCount = loot.querySelector('strong');
  var quips = [
    'Psst… wanna know when the token\'s cheap?',
    'Shinies! Gimme!',
    'Me watching the price. Always watching.',
    'Poke me again. I dare you.',
    'Every 5 minutes I check. EVERY. FIVE.',
    'No refunds on gold, friend.',
    'Ooh, that tickles. Here, have a coin.',
    'You poke, I pay. Strange deal, but okay.'
  ];
  var quipIndex = 0;
  var gold = 0;
  var svgNS = 'http://www.w3.org/2000/svg';

  function restart(el, className) {
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  }

  function burst(amount) {
    for (var i = 0; i < 9; i++) {
      var angle = (Math.PI * 2 * i) / 9 + Math.random() * 0.5;
      var distance = 110 + Math.random() * 70;
      var coin = document.createElementNS(svgNS, 'svg');
      coin.setAttribute('viewBox', '-20 -20 40 40');
      coin.setAttribute('aria-hidden', 'true');
      coin.setAttribute('class', 'burst-coin');
      coin.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
      coin.style.setProperty('--dy', Math.sin(angle) * distance - 30 + 'px');
      coin.style.setProperty('--r', (Math.random() * 540 - 270) + 'deg');
      var use = document.createElementNS(svgNS, 'use');
      use.setAttribute('href', '#coin');
      coin.appendChild(use);
      coin.addEventListener('animationend', function () { this.remove(); });
      wrap.appendChild(coin);
    }

    var plus = document.createElement('p');
    plus.className = 'plus-gold';
    plus.setAttribute('aria-hidden', 'true');
    plus.textContent = '+' + amount + 'g';
    plus.addEventListener('animationend', function () { this.remove(); });
    wrap.appendChild(plus);
  }

  button.addEventListener('click', function () {
    quipIndex = (quipIndex + 1) % quips.length;
    bubble.textContent = quips[quipIndex];

    var amount = 25 * (2 + Math.floor(Math.random() * 19));
    gold += amount;
    lootCount.textContent = gold.toLocaleString('en-US');
    loot.hidden = false;

    if (!reduceMotion) {
      restart(bubble, 'pop');
      restart(button, 'poked');
      burst(amount);
    }
  });
})();
