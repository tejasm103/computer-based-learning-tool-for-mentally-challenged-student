/**
 * AccessibleVerse — Interactive Educational Stories Engine
 * Branching Decision Stories with Consequences, Questions, and Narration
 */

const STORIES_DATA = [
  {
    id: 'story_traffic',
    title: 'The Busy Crossroads',
    category: 'Road Safety',
    icon: '🚦',
    summary: 'Ravi is walking home from school and needs to cross a bustling 4-lane city junction during evening rush hour.',
    nodes: {
      start: {
        step: 1,
        icon: '🚸',
        text: 'Ravi approaches the busy city crossroads. The pedestrian signal is glowing solid RED, and cars are rushing past. Ravi is running 5 minutes late for dinner. On his right, 20 meters away, is a pedestrian footbridge with a clear zebra crossing.',
        choices: [
          {
            text: '🏃 Dart quickly between the moving cars to save time.',
            next: 'bad_cross',
            isGood: false
          },
          {
            text: '🚶 Walk over to the zebra crossing and wait for the green walking signal.',
            next: 'safe_cross',
            isGood: true
          }
        ]
      },
      bad_cross: {
        step: 2,
        icon: '⚠️',
        text: 'A scooter suddenly swerves around a bus and screeches to an emergency halt just inches away from Ravi! The driver honks angrily. Ravi\'s heart is pounding with terror. He realizes he could have been severely injured.',
        explanation: 'Lesson: Never jaywalk or sprint across traffic! Vehicles travel much faster than human sprinting speed, and drivers cannot see pedestrians darting between larger buses.',
        choices: [
          {
            text: 'Return safely to the sidewalk and use the zebra crossing.',
            next: 'safe_cross',
            isGood: true
          }
        ]
      },
      safe_cross: {
        step: 2,
        icon: '🚶‍♂️',
        text: 'Ravi walks calmly to the zebra crossing. He presses the pedestrian signal button. The light switches to GREEN. Before stepping onto the road, what should Ravi do?',
        choices: [
          {
            text: '👀 Look Right, Look Left, and Look Right again before stepping onto the stripes.',
            next: 'victory',
            isGood: true
          },
          {
            text: '🎧 Put on headphones and walk across without looking at the road.',
            next: 'distracted_walk',
            isGood: false
          }
        ]
      },
      distracted_walk: {
        step: 3,
        icon: '🚑',
        text: 'An emergency ambulance with blaring sirens was approaching fast! Because Ravi had headphones on, he didn\'t hear the siren until a pedestrian grabbed his backpack to stop him.',
        explanation: 'Lesson: Always stay alert and remove headphones when crossing roads, even on a green light, to hear emergency vehicles.',
        choices: [
          {
            text: 'Remove headphones, look both ways, and cross with awareness.',
            next: 'victory',
            isGood: true
          }
        ]
      },
      victory: {
        step: 3,
        icon: '🏆',
        text: 'Ravi crosses the street safely, respecting all traffic signals! He reaches home safely with peace of mind. His parents praise him for prioritizing personal safety over haste.',
        explanation: 'Golden Safety Rule: Always use zebra crossings, look both ways, and wait for green signals. Better to arrive 2 minutes later than not at all!',
        isEnd: true
      }
    }
  },
  {
    id: 'story_cyber',
    title: 'The Free Game Token Mystery',
    category: 'Digital Citizenship',
    icon: '💻',
    summary: 'A classmate sends Ananya an exciting link promising 5,000 free gaming diamonds in exchange for her phone number.',
    nodes: {
      start: {
        step: 1,
        icon: '📩',
        text: 'Ananya receives a chat message from a friend\'s profile saying: "Click here quick! Free 5,000 game diamonds! Just enter your mobile number and the 6-digit OTP code sent to your phone!"',
        choices: [
          {
            text: 'Click the link and enter the OTP code to get diamonds.',
            next: 'compromised',
            isGood: false
          },
          {
            text: 'Pause and verify: Ask her friend at school or call them before clicking unknown links.',
            next: 'investigate',
            isGood: true
          }
        ]
      },
      compromised: {
        step: 2,
        icon: '🚨',
        text: 'Uh oh! The OTP allowed the hacker to hijack the account and charge an unauthorized subscription! Her friend\'s account had already been compromised.',
        explanation: 'Never share OTP codes or passwords with ANY website or person, even if they pretend to be your best friend!',
        choices: [
          {
            text: 'Immediately report the scam to a trusted teacher or guardian.',
            next: 'investigate',
            isGood: true
          }
        ]
      },
      investigate: {
        step: 2,
        icon: '🛡️',
        text: 'Ananya calls her friend, who confirms: "My account got hacked this morning! I didn\'t send that message!" What is Ananya\'s best next action?',
        choices: [
          {
            text: 'Warn other classmates in the class group and report the fraudulent link.',
            next: 'victory',
            isGood: true
          },
          {
            text: 'Forward the link to someone else to test if it really gives diamonds.',
            next: 'compromised',
            isGood: false
          }
        ]
      },
      victory: {
        step: 3,
        icon: '🌟',
        text: 'Ananya\'s quick thinking protected her entire class from an aggressive phishing scam! Her teacher awards her the Cyber Safety Helper star.',
        explanation: 'Digital Rule: Scammers use high excitement ("Free Coins!") to trick you into sharing OTPs. When in doubt, verify in person!',
        isEnd: true
      }
    }
  },
  {
    id: 'story_environment',
    title: 'Saving Whispering Stream',
    category: 'Environmental Protection',
    icon: '🌿',
    summary: 'A local village stream is choked with single-use plastic bottles, threatening aquatic frogs and drinking water.',
    nodes: {
      start: {
        step: 1,
        icon: '🏞️',
        text: 'During a weekend hike, Karthik notices the local freshwater stream filled with discarded plastic cups and snack wrappers. A mother duck is struggling to swim through the debris.',
        choices: [
          {
            text: 'Ignore it: "It is not my trash, someone else will clean it."',
            next: 'polluted_future',
            isGood: false
          },
          {
            text: 'Put on gloves and organize a school weekend cleanup drive.',
            next: 'cleanup_drive',
            isGood: true
          }
        ]
      },
      polluted_future: {
        step: 2,
        icon: '🥀',
        text: 'A week later, the plastic breaks down into toxic microplastics, causing fish to float lifelessly and spreading a foul stench through the village.',
        explanation: 'Every piece of litter harms wildlife. Active environmental citizenship protects our drinking water and nature!',
        choices: [
          {
            text: 'Take action now and rally community volunteers.',
            next: 'cleanup_drive',
            isGood: true
          }
        ]
      },
      cleanup_drive: {
        step: 2,
        icon: '🧤',
        text: 'Karthik and 8 classmates collect 12 large sacks of plastic waste from the stream banks. How should they dispose of the collected waste?',
        choices: [
          {
            text: 'Separate clean recyclables and deliver them to a certified recycling center.',
            next: 'victory',
            isGood: true
          },
          {
            text: 'Burn the plastic sacks in an open fire near the park.',
            next: 'burn_toxic',
            isGood: false
          }
        ]
      },
      burn_toxic: {
        step: 3,
        icon: '💨',
        text: 'Burning plastic releases dangerous dioxins and toxic fumes into the air, triggering asthma attacks in nearby neighborhood children.',
        explanation: 'Burning plastic is extremely hazardous to human lungs! Always recycle or dispose of plastics through authorized municipal centers.',
        choices: [
          {
            text: 'Extinguish safely and deliver to the recycling plant.',
            next: 'victory',
            isGood: true
          }
        ]
      },
      victory: {
        step: 3,
        icon: '🦆',
        text: 'The stream flows crystal clear once more! Water birds return to nest peacefully, and the village panchayat installs recycling bins along the hiking trail.',
        explanation: 'Conservation Lesson: The 3 R\'s (Reduce, Reuse, Recycle) protect Earth\'s precious water bodies for generations to come.',
        isEnd: true
      }
    }
  }
];

let activeStory = STORIES_DATA[0];
let currentNodeKey = 'start';
let isNarrating = false;

document.addEventListener('DOMContentLoaded', () => {
  renderStoryShelf();
  loadStory(STORIES_DATA[0].id);
  if (window.lucide) lucide.createIcons();
});

function renderStoryShelf() {
  const shelf = document.getElementById('stories-shelf');
  if (!shelf) return;
  shelf.innerHTML = STORIES_DATA.map(s => `
    <div class="story-book-card ${s.id === activeStory.id ? 'active' : ''}" id="story-card-${s.id}" onclick="loadStory('${s.id}')">
      <div>
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">${s.icon}</div>
        <span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #38bdf8;">${s.category}</span>
        <h3 style="font-size: 1.2rem; margin: 0.35rem 0 0.5rem; color: #f8fafc;">${s.title}</h3>
        <p style="font-size: 0.85rem; color: #94a3b8; line-height: 1.5; margin: 0;">${s.summary}</p>
      </div>
      <div style="margin-top: 1rem; font-size: 0.85rem; color: #818cf8; font-weight: 700;">
        Open Story <i data-lucide="chevron-right" style="width: 14px; height: 14px; display: inline;"></i>
      </div>
    </div>
  `).join('');
}

window.loadStory = function(storyId) {
  const s = STORIES_DATA.find(x => x.id === storyId);
  if (!s) return;
  activeStory = s;
  currentNodeKey = 'start';

  document.querySelectorAll('.story-book-card').forEach(c => c.classList.remove('active'));
  const card = document.getElementById(`story-card-${storyId}`);
  if (card) card.classList.add('active');

  renderCurrentScene();
  if (window.lucide) lucide.createIcons();
};

function renderCurrentScene() {
  const node = activeStory.nodes[currentNodeKey];
  if (!node) return;

  document.getElementById('story-title-display').textContent = activeStory.title;
  document.getElementById('story-scene-step').textContent = `Scene ${node.step} (${activeStory.category})`;
  document.getElementById('scene-icon').textContent = node.icon || '📖';
  document.getElementById('scene-text').textContent = node.text;

  const choicesContainer = document.getElementById('choices-container');
  const feedbackBox = document.getElementById('consequence-feedback-box');
  feedbackBox.style.display = 'none';

  if (node.isEnd) {
    choicesContainer.innerHTML = `
      <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; padding: 1.5rem; border-radius: 12px; color: #10b981; text-align: center;">
        <h4 style="margin: 0 0 0.5rem; font-size: 1.3rem;">🎉 Story Chapter Completed!</h4>
        <p style="color: #e2e8f0; margin-bottom: 1rem;">${node.explanation || 'Great job making thoughtful ethical choices!'}</p>
        <button class="btn btn-primary" onclick="restartStory()"><i data-lucide="rotate-ccw"></i> Replay Story</button>
      </div>
    `;

    // Award +30 XP
    try {
      const user = JSON.parse(localStorage.getItem('accessibleverse_user') || '{}');
      user.xp = (user.xp || 0) + 30;
      localStorage.setItem('accessibleverse_user', JSON.stringify(user));
      window.dispatchEvent(new CustomEvent('xpUpdated', { detail: { xp: user.xp, added: 30 } }));
      if (window.showToast) window.showToast('📖 Story Completed! +30 XP Awarded!', 'success');
      if (window.ApiClient && window.ApiClient.learningPath) {
        window.ApiClient.learningPath.syncProgress({ addedXp: 30, completedStory: activeStory.id }).catch(() => {});
      }
    } catch {}

    return;
  }

  choicesContainer.innerHTML = node.choices.map((c, idx) => `
    <button class="choice-card-btn" onclick="makeStoryChoice(${idx})">
      <span style="font-size: 1.25rem;">👉</span>
      <span>${c.text}</span>
    </button>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

window.makeStoryChoice = function(choiceIndex) {
  const node = activeStory.nodes[currentNodeKey];
  const choice = node.choices[choiceIndex];
  if (!choice) return;

  currentNodeKey = choice.next;
  renderCurrentScene();

  if (choice.isGood === false && activeStory.nodes[currentNodeKey]?.explanation) {
    const fb = document.getElementById('consequence-feedback-box');
    fb.style.display = 'block';
    fb.innerHTML = `
      <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; padding: 1rem; border-radius: 8px; color: #f87171;">
        <strong>Consequence & Explanation:</strong> ${activeStory.nodes[currentNodeKey].explanation}
      </div>
    `;
  }
};

window.restartStory = function() {
  currentNodeKey = 'start';
  renderCurrentScene();
};

window.toggleNarration = function() {
  if (!('speechSynthesis' in window)) {
    if (window.showToast) window.showToast('Speech narration is not supported in this browser.', 'warning');
    return;
  }

  if (isNarrating) {
    window.speechSynthesis.cancel();
    isNarrating = false;
    document.getElementById('narration-btn').innerHTML = '<i data-lucide="volume-2"></i> Narrate Scene';
    if (window.lucide) lucide.createIcons();
    return;
  }

  const node = activeStory.nodes[currentNodeKey];
  const text = `${node.text}. What should you do?`;

  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const lang = localStorage.getItem('accessibleverse_lang') || 'en';
  u.lang = lang === 'kn' ? 'kn-IN' : lang === 'hi' ? 'hi-IN' : 'en-US';

  u.onend = () => {
    isNarrating = false;
    document.getElementById('narration-btn').innerHTML = '<i data-lucide="volume-2"></i> Narrate Scene';
    if (window.lucide) lucide.createIcons();
  };

  isNarrating = true;
  document.getElementById('narration-btn').innerHTML = '<i data-lucide="volume-x"></i> Stop Narration';
  if (window.lucide) lucide.createIcons();
  window.speechSynthesis.speak(u);
};
