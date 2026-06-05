import { VideoIdea, ScriptItem, HashtagSet, Platform, ContentStyle } from '../types';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 11);

// Helper to get random number
const getRandomScore = (style: ContentStyle) => {
  const base = style === 'motivational' || style === 'storytime' ? 88 : 83;
  return Math.min(100, Math.floor(base + Math.random() * 15));
};

// Intelligently generate ideas based on inputs
export function generateVideoIdeas(
  niche: string,
  platform: Platform,
  style: ContentStyle,
  language: string = 'English'
): VideoIdea[] {
  const cleanNiche = niche.trim() || 'Tech & Productivity';
  
  // Custom templates based on the content style
  const templatesByStyle: Record<ContentStyle, Array<{
    title: string;
    hook: string;
    description: string;
    structure: { hook: string; body: string; cta: string };
    cta: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
  }>> = {
    educational: [
      {
        title: `The 3-Step Formula to Streamlining ${cleanNiche}`,
        hook: `Stop doing ${cleanNiche} the old way. Use this 3-step formula instead.`,
        description: `A highly educational breakdown showing standard mistakes in ${cleanNiche} and how to fix them effortlessly.`,
        structure: {
          hook: `Point out a massive error everyone has been making in ${cleanNiche}`,
          body: `Briefly show step 1, 2, and 3 with clean visual overlay. Explain the 'why' behind the solution.`,
          cta: `Remind them to save this video for future reference.`
        },
        cta: `Follow for daily micro-lessons on ${cleanNiche}!`,
        difficulty: 'Easy'
      },
      {
        title: `I tested 5 tools for ${cleanNiche} (So you don't have to)`,
        hook: `These are the absolute best tools for ${cleanNiche} that feel illegal to know.`,
        description: `Comparison style review with fast pacing and high sensory detail showing how to choose.`,
        structure: {
          hook: `Show an active screen with exciting dashboards, saying 'I tested these so you save your time'.`,
          body: `List the candidates quickly. Accentuate one primary winner. Show side-by-side results.`,
          cta: `Leave a comment on what you think of the winner.`
        },
        cta: `Which of these tools is your favorite? Comment below!`,
        difficulty: 'Medium'
      },
      {
        title: `The Dark Reality of ${cleanNiche} in 2026`,
        hook: `If you are still using 2024 methods for ${cleanNiche}, you are falling behind.`,
        description: `Insightful, hard-hitting truth about changing algorithms, trends, and processes in ${cleanNiche}.`,
        structure: {
          hook: `Start with a bold, controversial hook. Display alarming statistical facts.`,
          body: `List the paradigm shifts. Show how top creators pivot their strategies completely.`,
          cta: `Get my free modern resources from the profile bio.`
        },
        cta: `Click the link in my bio to read the full modern playbook.`,
        difficulty: 'Hard'
      },
      {
        title: `How to learn ${cleanNiche} in 15 seconds a day`,
        hook: `This is the cheat-sheet of ${cleanNiche} they don't want you to find out.`,
        description: `Super fast-paced tutorial that visualizes one highly dense concept onto a simple grid.`,
        structure: {
          hook: `State a huge benefit: 'Learn this trick that usually takes weeks, in just 15 seconds.'`,
          body: `Bullet points explaining the hidden core hack of ${cleanNiche} that works instantly.`,
          cta: `Bookmark this so you don't lose the guide.`
        },
        cta: `Save this post and try it tonight!`,
        difficulty: 'Easy'
      },
      {
        title: `The ultimate checklist for beginners in ${cleanNiche}`,
        hook: `I wish I had this simple checklist when I started ${cleanNiche}.`,
        description: `Perfect onboarding style item that appeals to beginners who want an immediate action plan.`,
        structure: {
          hook: `Empathetic introduction addressing beginner pain points.`,
          body: `Quick checklist items zoom onto the screen one by one with a physical checklist sound.`,
          cta: `Follow for absolute beginner tutorials.`
        },
        cta: `Tap that follow button for more beginner tips!`,
        difficulty: 'Easy'
      }
    ],
    funny: [
      {
        title: `When you try ${cleanNiche} for the first time vs. 6 months in`,
        hook: `Nobody warned me that ${cleanNiche} would turn out exactly like this.`,
        description: `Relatable expectation vs reality transition with humorous green-screen or expression overlays.`,
        structure: {
          hook: `Act out a hopeful, naive beginner setting up their ${cleanNiche} toolkit.`,
          body: `Transition to a disheveled version of yourself surviving the challenges, with a trending comedic audio.`,
          cta: `Tell me if this has happened to you.`
        },
        cta: `Tag a friend who is currently struggling with ${cleanNiche}!`,
        difficulty: 'Easy'
      },
      {
        title: `Me pretending to understand ${cleanNiche} in front of professionals`,
        hook: `Just smile and wave, boys. Smile and wave.`,
        description: `A hilarious POV format pointing out impostor syndrome in the ${cleanNiche} vertical.`,
        structure: {
          hook: `POV caption: 'Me in a boardroom / discord call hearing terms about ${cleanNiche}'`,
          body: `Use a classic green-screen reaction meme (e.g., confused dog or office character looking lost).`,
          cta: `Follow for authentic creator struggles.`
        },
        cta: `Am I the only one who does this? Let me know!`,
        difficulty: 'Easy'
      },
      {
        title: `The 5 Stages of Grief in ${cleanNiche}`,
        hook: `If you do ${cleanNiche}, you have definitely been through these painful stages.`,
        description: `A systematic countdown of the emotional rollercoaster experienced by creators in this niche.`,
        structure: {
          hook: `Hook: 'Denial, Anger, Bargaining, Depression, and Acceptance... in ${cleanNiche}'`,
          body: `Speed-run through each phase with funny skits, memes, or facial structures representing defeat.`,
          cta: `Share this with someone going through stage 4.`
        },
        cta: `Share this with a fellow creator who understands the pain!`,
        difficulty: 'Medium'
      },
      {
        title: `Corporate vs Indie ways of doing ${cleanNiche}`,
        hook: `Corporate ${cleanNiche} makes my soul hurt. Here is why.`,
        description: `Satirical comparison of overly-bureaucratic work practices versus lean, scrappy setups.`,
        structure: {
          hook: `Sarcastic greeting wearing a formal blazer, versus a laid-back hoodie creator.`,
          body: `Juxtapose absurdly detailed processes like '3 meetings for a small task' vs 'just getting it done in 10 minutes'.`,
          cta: `Comment which team you belong to.`
        },
        cta: `Are you Corporate or Indie? Comment below!`,
        difficulty: 'Medium'
      },
      {
        title: `Unpopular opinions about ${cleanNiche} that will get me cancelled`,
        hook: `Someone has to say it, so it might as well be me.`,
        description: `Humorous, edgy callouts of sacred cows in your content category designed to drive high commentary.`,
        structure: {
          hook: `Direct look to camera, quiet whisper: 'I'm about to trigger half the ${cleanNiche} community.'`,
          body: `Deliver 3 funny, hot takes that are controversial but widely secretly agreed with.`,
          cta: `Get ready to attack me in the comments.`
        },
        cta: `See you in the comments section! Stay civil.`,
        difficulty: 'Easy'
      }
    ],
    luxury: [
      {
        title: `Inside a $10,000/day ${cleanNiche} Strategy`,
        hook: `This is what ultra-high-end ${cleanNiche} actually looks like behind closed doors.`,
        description: `Highly aesthetic, slow-pacing cinematic showing of premium setups, expensive assets, and high-status results.`,
        structure: {
          hook: `Stunning B-roll of premium hardware or elegant setting. Whispered voiceover.`,
          body: `Explain the elite frameworks, exclusive networks, and bespoke craftsmanship that elevate ${cleanNiche}.`,
          cta: `Apply for our private circle in bio.`
        },
        cta: `Discover our exclusive methods through the link.`,
        difficulty: 'Hard'
      },
      {
        title: `How the Top 1% Automate ${cleanNiche}`,
        hook: `The rich don't work harder at ${cleanNiche}. They build machines.`,
        description: `Elegant tutorial focusing on clean custom-made software architecture, delegating, and elite tools.`,
        structure: {
          hook: `Aesthetic layout of a high-end physical workspace. Quiet voiceover introduces automation concept.`,
          body: `Breakdown of systems, luxury pipelines, and flawless handoffs without manual friction.`,
          cta: `Follow for elite productivity keys.`
        },
        cta: `Follow for private creator insights.`,
        difficulty: 'Medium'
      },
      {
        title: `Why cheap options in ${cleanNiche} are costing you millions`,
        hook: `Buy nice or buy twice. Especially when it comes to ${cleanNiche}.`,
        description: `High-conviction value pitch showing why cheaping out on software, gear, or advice yields atrocious results.`,
        structure: {
          hook: `Calm, authoritative visual addressing the camera with confidence.`,
          body: `Analysis of hidden costs: missed opportunities, slow speeds, bad aesthetics. Compare standard vs prestige workflows.`,
          cta: `Invest in your craft today.`
        },
        cta: `Read the luxury guide in our digital shop.`,
        difficulty: 'Medium'
      },
      {
        title: `The Aesthetic of Perfect ${cleanNiche}`,
        hook: `A visual masterclass of ${cleanNiche}. No words, just aesthetics.`,
        description: `No-talking ASMR style video featuring stunning B-Roll, lighting, pristine keyboard sounds, and absolute cleanliness.`,
        structure: {
          hook: `Satisfying sound cue of turning on a light or opening a premium leather binder.`,
          body: `Stunning, high-framerate sequence of high-end actions in ${cleanNiche} with pleasant clicking sounds.`,
          cta: `Subscribe for more therapeutic aesthetics.`
        },
        cta: `Save for daily workspace inspiration.`,
        difficulty: 'Medium'
      },
      {
        title: `The Billion-Dollar Shift in ${cleanNiche}`,
        hook: `A subtle transition is happening in ${cleanNiche} that only the 1% have noticed.`,
        description: `High-level elite trend analysis detailing secret industrial maneuvers.`,
        structure: {
          hook: `Deep, crisp voiceover explaining macro shifts. Low-saturation cinematic filter.`,
          body: `Connect global trends to ${cleanNiche}, proving those who move now will dominate the decade.`,
          cta: `Join our executive newsletter.`
        },
        cta: `Join 15,000+ top executives at the link.`,
        difficulty: 'Hard'
      }
    ],
    scary: [
      {
        title: `The terrifying truth about ${cleanNiche} they cover up`,
        hook: `This is the scariest part of ${cleanNiche} that keep pros up at night.`,
        description: `Horror/suspense background soundtrack. Focus on security, major data losses, or systemic failures.`,
        structure: {
          hook: `Dimly lit room. Fast zoom on a laptop screen showing simulation of a warning red light.`,
          body: `Describe a terrifying risk factor (e.g., cyber theft, shadow-banning, identity loss, deepfakes) that affects all ${cleanNiche} creators.`,
          cta: `Check if your account is secure.`
        },
        cta: `Comment 'secure' to verify your workflow safety!`,
        difficulty: 'Medium'
      },
      {
        title: `Do NOT starting ${cleanNiche} until you hear this warning`,
        hook: `If you are planning to get into ${cleanNiche}, watch this or regret it forever.`,
        description: `Cautionary warning style explaining dark, hidden traps, exploitation, or burn-out.`,
        structure: {
          hook: `Aggressive pointing gesture. Visual text overlay: 'DO NOT START!'`,
          body: `Details on major hidden traps, contracts, or severe burnouts that destroy 95% of new accounts.`,
          cta: `Pass this warning to someone else.`
        },
        cta: `Tag a creator who needs to hear this warning!`,
        difficulty: 'Easy'
      },
      {
        title: `The Day ${cleanNiche} Broke Forever`,
        hook: `We thought we were safe. Then this happened and changed ${cleanNiche} forever.`,
        description: `Historical, documentary-creepy presentation of a major industry crash or algorithm wipeout.`,
        structure: {
          hook: `Vintage grain lens filter. Text: 'The Black Swan Event'. Creepy synth base pad.`,
          body: `Explain a real major system failure or shift that instantly wiped out millions of accounts or businesses overnight.`,
          cta: `Follow to protect your content.`
        },
        cta: `Subscribe to stay ahead of the algorithm shifts.`,
        difficulty: 'Hard'
      },
      {
        title: `I found a creepy back-door in ${cleanNiche}`,
        hook: `I feel like I'm being watched whenever I do this in ${cleanNiche}.`,
        description: `Suspense-filled search for unexplainable mechanics, weird bugs, or eerie Easter eggs.`,
        structure: {
          hook: `Gasping audio start. Screen recordings showing unusual behaviors or algorithmic trends that make no sense.`,
          body: `Deconstruct the eerie coincidence. Add ominous pauses and quick horror jumps.`,
          cta: `Have you ever noticed this before?`
        },
        cta: `Let me know if your app does this too.`,
        difficulty: 'Medium'
      },
      {
        title: `The Uncanny Valley of ${cleanNiche} AI`,
        hook: `These ${cleanNiche} videos aren't made by humans... and it's getting weird.`,
        description: `Suspenseful exploration of ultra-realistic automated channels that look too human but are fully simulated.`,
        structure: {
          hook: `Show close-up of a face, asking 'Is this real?'`,
          body: `Compare human traits to robotic scripts. Show how artificial intelligence is secretly capturing millions of views.`,
          cta: `Drop an emoji if you are human.`
        },
        cta: `Comment a '🤖' if you think AI is taking over!`,
        difficulty: 'Easy'
      }
    ],
    motivational: [
      {
        title: `How ${cleanNiche} saved my life when I had $0`,
        hook: `Two years ago, I had exactly $3 in my account. I built ${cleanNiche} to escape.`,
        description: `Stunning motivational storytelling with a progressive cinematic score. Emotional hooks and high inspiration.`,
        structure: {
          hook: `Show old photos of a humble desk or tired face. Low voice tone.`,
          body: `Show the persistence. Staying up till 3 AM. Learning the hard way. The first win. The compounding breakout.`,
          cta: `If I did it, you can too. Start today.`
        },
        cta: `Click the heart if you believe in your dream!`,
        difficulty: 'Medium'
      },
      {
        title: `A quick note to anyone wanted to quit ${cleanNiche}`,
        hook: `If you are about to delete your ${cleanNiche} project, please wait 30 seconds.`,
        description: `Raw, direct, emotional support talking directly to camera. Recharges creative drive with high authority.`,
        structure: {
          hook: `No background music. Direct eye-contact. Genuine, authentic expression.`,
          body: `Explain that the plateau of latent potential is real. Most people quit just 5 minutes before the miracle happens.`,
          cta: `Don't stop. I'm rooting for you.`
        },
        cta: `Share this with a creator who is working hard tonight!`,
        difficulty: 'Easy'
      },
      {
        title: `The 10,000-Hour Rule in ${cleanNiche}`,
        hook: `They call it luck. Here is the daily discipline of ${cleanNiche} they never show.`,
        description: `Dynamic edit showcasing routine, consistency, systems over passion, and beautiful work habits.`,
        structure: {
          hook: `Text: 'Luck is designed.' Fast split screen showing repetitive daily efforts.`,
          body: `Explain that top-tier execution is just repeating boring basics 1,000 times. Reveal your personal routine.`,
          cta: `Follow if you choose consistency over luck.`
        },
        cta: `Follow for daily motivational frameworks!`,
        difficulty: 'Hard'
      },
      {
        title: `What no one tells you about successful ${cleanNiche}`,
        hook: `Success in ${cleanNiche} isn't complicated. It just requires this one mental shift.`,
        description: `A very inspiring talk that simplifies a complex mental block down to self-belief and smart habits.`,
        structure: {
          hook: `Bold hook about changing your mindset in 5 seconds.`,
          body: `Deconstruct the difference between winners (process-focused) vs losers (result-focused). Give direct actionable steps.`,
          cta: `Declare your goal in the comments.`
        },
        cta: `Write your primary goal for this month below!`,
        difficulty: 'Easy'
      },
      {
        title: `The Silent Grind of ${cleanNiche}`,
        hook: `The best work is done when no one is watching you.`,
        description: `Calming lo-fi beats with aesthetic nightly clips. Promotes healthy long-term work ethics.`,
        structure: {
          hook: `Calm typing sounds. Rain outside the window. Peaceful vibe.`,
          body: `Narrate the beauty of silent improvements, small daily victories, and building things you are proud of.`,
          cta: `Rest well, then build tomorrow.`
        },
        cta: `Save this for your late-night work sessions.`,
        difficulty: 'Easy'
      }
    ],
    storytime: [
      {
        title: `The insane client who tried to steal my ${cleanNiche}`,
        hook: `This client tried to sue me for $50k over a ${cleanNiche} project. Here's what happened.`,
        description: `Highly gossipy, engaging narrative style. Fast hooks, high emotional stakes, and legal twists.`,
        structure: {
          hook: `Dramatic wave of face. Overlay text: 'The Audacity!' High energy story hook.`,
          body: `Unravel the story: client demands ridiculous terms, sends fake legal letters, how I countered with perfect email records.`,
          cta: `Follow for part 2 or the email screenshots!`
        },
        cta: `Part 2 is live. Click to watch how it resolved!`,
        difficulty: 'Medium'
      },
      {
        title: `How I accidentally disrupted ${cleanNiche} with a meme`,
        hook: `I posted a silly joke about ${cleanNiche} and it completely changed my industry.`,
        description: `Charming case-study told as a casual coffee chat. Humorous, humble, and highly informative.`,
        structure: {
          hook: `Relaxed body language, drinking coffee: 'So I posted a meme at 2 am...'`,
          body: `Show the meme screenshot. Explain how it went viral, attracted CEO calls, and led to a brand new SaaS product launch.`,
          cta: `Never underestimate your random ideas.`
        },
        cta: `Follow to see what silly project I launch next!`,
        difficulty: 'Easy'
      },
      {
        title: `The Day I lost all my ${cleanNiche} files`,
        hook: `I was 1 hour away from the biggest launch of my life when my hard drive did this.`,
        description: `Sweaty-palms tension story about data disaster, panic, and an unexpected last-minute rescue.`,
        structure: {
          hook: `Hands holding head. Sound of screaming digital error or beep. Immediate crisis.`,
          body: `Describe the absolute dread, the support chats, trying commands in terminal, and the key friend who saved everything.`,
          cta: `Always have 3 backups. Trust me.`
        },
        cta: `Do you backup your work? Let this be your warning.`,
        difficulty: 'Easy'
      },
      {
        title: `My journey from hating ${cleanNiche} to obsessed`,
        hook: `I used to think ${cleanNiche} was a total scam. Boy was I wrong.`,
        description: `Personal evolution curve story that overcomes skepticism and addresses real conversion.`,
        structure: {
          hook: `Candid confession admitting absolute dislike of the niche initially.`,
          body: `Explain the eureka moment. The specific project that succeeded effortlessly and opened up a whole new world.`,
          cta: `What are you skeptical about?`
        },
        cta: `Have you changed your mind on something recently? Comment!`,
        difficulty: 'Easy'
      },
      {
        title: `A secret meeting that changed my perspective on ${cleanNiche}`,
        hook: `I met an anonymous creator with 10M followers who told me this secret.`,
        description: `Mysterious, highly engaging story detailing exclusive advice from an industry titan.`,
        structure: {
          hook: `Whisper audio: 'I promised not to say their name, but I can share the advice.'`,
          body: `List the three profound gold-nuggets of content advice they shared, focusing on simplicity and timing.`,
          cta: `Share this with an upcoming creator.`
        },
        cta: `Share this video with someone who needs elite advice!`,
        difficulty: 'Medium'
      }
    ]
  };

  const selectedList = templatesByStyle[style] || templatesByStyle.educational;
  
  // Return polished, customized items
  return selectedList.map((item, idx) => {
    // Inject custom variations based on platform & index
    const platformAdditions = {
      'TikTok': '👀 Quick Cut transitions. Speed up to 1.25x for maximum watch time.',
      'YouTube Shorts': '🔥 Clean looping frame. Keep title on screen throughout.',
      'Instagram Reels': '💎 Aesthetic cover frame. Focus heavily on smooth, elegant visual grading.'
    };

    return {
      id: `${generateId()}-${idx}`,
      title: item.title,
      hook: item.hook,
      description: item.description,
      structure: {
        hook: item.structure.hook,
        body: item.structure.body + ` (${platformAdditions[platform]})`,
        cta: item.structure.cta
      },
      cta: item.cta,
      difficulty: item.difficulty,
      score: getRandomScore(style),
      platform,
      style,
      niche: cleanNiche
    };
  });
}

// Generate viral hooks
export function generateHooks(topic: string): { id: string; topic: string; category: string; hook: string }[] {
  const cleanTopic = topic.trim() || 'No-code tools';
  
  const categories = [
    {
      name: 'Curiosity Gap',
      hooks: [
        `This is the secret of ${cleanTopic} that nobody is talking about...`,
        `99% of people have no idea this ${cleanTopic} hack exists.`,
        `I’ve been gatekeeping this ${cleanTopic} secret for months. Not anymore.`,
        `The real reason you are failing at ${cleanTopic} (and how to fix it).`
      ]
    },
    {
      name: 'Negative Framework / Danger',
      hooks: [
        `Stop doing this with ${cleanTopic} immediately, it's costing you.`,
        `If you are still doing ${cleanTopic} like this, please stop.`,
        `The biggest trap in ${cleanTopic} that everyone falls into.`,
        `This stupid mistake is holding your ${cleanTopic} back.`
      ]
    },
    {
      name: 'Authority / Elite',
      hooks: [
        `I tested every single ${cleanTopic} trick. Here is the winner.`,
        `What top 1% creators know about ${cleanTopic} that you don't.`,
        `This 10-second change completely transformed my ${cleanTopic}.`,
        `The elite workflow for ${cleanTopic} you need to adopt now.`
      ]
    },
    {
      name: 'Immediate Return / Speed',
      hooks: [
        `How to get ahead in ${cleanTopic} in just 24 hours.`,
        `Learn the gold standard of ${cleanTopic} in under 15 seconds.`,
        `This one simple tool does 90% of your ${cleanTopic} work for you.`,
        `My hack to automate all of my ${cleanTopic} tasks instantly.`
      ]
    },
    {
      name: 'Relatable / Emotional Truth',
      hooks: [
        `Let’s be honest, we all hate this part of ${cleanTopic}.`,
        `I was today years old when I realized this about ${cleanTopic}.`,
        `The harsh reality of building ${cleanTopic} that they never show you.`,
        `How I went from completely confused to a master in ${cleanTopic}.`
      ]
    }
  ];

  let list: { id: string; topic: string; category: string; hook: string }[] = [];
  categories.forEach((cat) => {
    cat.hooks.forEach((hk, index) => {
      list.push({
        id: `${generateId()}-${cat.name.replace(/\s+/g, '')}-${index}`,
        topic: cleanTopic,
        category: cat.name,
        hook: hk
      });
    });
  });

  return list; // Returns exactly 20 hooks
}

// Generate a script
export function generateScript(topic: string, duration: '30s' | '60s'): ScriptItem {
  const cleanTopic = topic.trim() || 'Remote work productivity';
  const isShort = duration === '30s';
  
  const generatedIdVal = generateId();

  // Create scenes depending on duration
  const scenes = isShort 
    ? [
        {
          time: '0:00 - 0:05',
          visual: 'Fast scroll of custom charts on screen. Close up of eyes wide open. Bold text: "STOP DOING THIS!"',
          audio: '[VOICEOVER] Most people are completely blind when it comes to managing ' + cleanTopic + '. But here is the exact secret to doing it like an elite 1% creator.'
        },
        {
          time: '0:05 - 0:15',
          visual: 'Pristine B-roll of premium hardware or a clean terminal/notebook. Green checkmarks check off key elements.',
          audio: '[VOICEOVER] Step one is all about systems over effort. Set up a simple recurring timer of 25 minutes. Step two: declutter your canvas and mute notifications. Focus on a single high-impact item.'
        },
        {
          time: '0:15 - 0:25',
          visual: 'Show immediate comparison of bad results vs a visually stunning graph zooming up.',
          audio: '[VOICEOVER] The magic lies in step three. Leverage custom ready-made automated tools to double your speed without burning out. See how output stacks up instantly.'
        },
        {
          time: '0:25 - 0:30',
          visual: 'Point directly to screen, transitioning to bio page with clean pulsing accent borders.',
          audio: '[VOICEOVER] That is literally it. Tap that bookmark icon so you do not lose this guide, and follow for daily micro-playbooks on ' + cleanTopic + '!'
        }
      ]
    : [
        {
          time: '0:00 - 0:05',
          visual: 'Frustrated sigh looking at computer. Text overlay: "They lied to you about ' + cleanTopic + '". Dramatic zoom.',
          audio: '[VOICEOVER] They lied to you about ' + cleanTopic + '. They told you to work 12 hours a day and grind. That is a fast track to absolute failure. Here is the true story.'
        },
        {
          time: '0:05 - 0:20',
          visual: 'Transition to side-by-side video: frantic typing vs drinking coffee while automated script works. Clean layout graphs.',
          audio: '[VOICEOVER] Two years ago, I fell into that same exhausting loop. I worked late and got zero traction. The pivot happened when I realized that successful creators do not work more—they design frameworks.'
        },
        {
          time: '0:20 - 0:35',
          visual: 'Clean typography screens overlay. Step 1, Step 2, and Step 3 pop up in harmony with nice sound effects.',
          audio: '[VOICEOVER] First, establish what I call "Deep Work Gates". That is 90 minutes of zero distractions early in the morning. Second, use modern template libraries to bypass design fatigue. Keep it modular and lightweight.'
        },
        {
          time: '0:35 - 0:50',
          visual: 'Show extreme close-up of keyboard, typing commands, transitioning to a gorgeous dashboard showing exponential growth curves.',
          audio: '[VOICEOVER] Third, run a daily retrospective. Spend just 2 minutes tracking what succeeded and what failed. This builds momentum. Over 6 months, this simple loop builds a compound competitive edge.'
        },
        {
          time: '0:50 - 1:00',
          visual: 'Warm direct look, friendly smile. Clean CTA graphic zooms in smoothly.',
          audio: '[VOICEOVER] If you are ready to stop exhausting yourself and start getting compound results, tap that follow button. Check the bio link to get my free modern developer toolkit!'
        }
      ];

  const captionNiches = cleanTopic.toLowerCase();
  
  return {
    id: generatedIdVal,
    topic: cleanTopic,
    duration,
    hook: isShort 
      ? `Most people are completely blind when it comes to managing ${cleanTopic}...`
      : `They lied to you about ${cleanTopic}. They told you to work 12 hours.`,
    scenes,
    caption: `Stop exhausting yourself doing ${cleanTopic} the old way. 🛑\n\nHere's the raw truth: top-tier results don't come from working longer. They come from designing repeatable, elegant workflows. 💡\n\nSave this checklist:\n1️⃣ Systems over effort\n2️⃣ Establish Focus Gates\n3️⃣ Leverage modern software tools\n\nHow do you handle ${captionNiches}? Let me know below! 👇\n\n#${cleanTopic.replace(/\s+/g, '')} #creatorsofinstagram #tiktokcreators #shortscreator #branding #productivitytips`,
    cta: `Click follow for daily professional insights on ${cleanTopic}!`
  };
}

// Generate hashtags
export function generateHashtags(topic: string, platform: Platform): HashtagSet {
  const cleanTopic = topic.trim() || 'AI SaaS';
  const tagTopic = cleanTopic.replace(/[^a-zA-Z0-9]/g, '');
  const lowerTagTopic = tagTopic.toLowerCase();

  // Create dynamic tags based on the topic
  const broad = [
    `#${tagTopic}`,
    `#${tagTopic}Tips`,
    `#Creator`,
    `#CreatorEconomy`,
    `#ContentCreator`,
    `#SocialMedia`,
    `#VideoMarketing`,
    `#Trending`,
    `#Strategy`,
    `#Workflow`
  ];

  const niche = [
    `#HowTo${tagTopic}`,
    `#${tagTopic}101`,
    `#${tagTopic}Hacks`,
    `#${tagTopic}SaaS`,
    `#Daily${tagTopic}`,
    `#Learn${tagTopic}`,
    `#${tagTopic}ForBeginners`,
    `#GrowYour${tagTopic}`,
    `#${tagTopic}Strategy`,
    `#${tagTopic}Mastery`
  ];

  // Tailor viral style to platform
  const viralPlatTag = platform === 'TikTok' ? '#TikTokGrowth' : platform === 'YouTube Shorts' ? '#ShortsTrend' : '#ReelsViral';
  
  const viral = [
    `#ViralVideo`,
    `#Fyp`,
    `#ForYouPage`,
    `#TrendingNow`,
    viralPlatTag,
    `#AlgorithmHack`,
    `#ViralSecrets`,
    `#WatchTillTheEnd`,
    `#HowIGrew`,
    `#ViralLoop`
  ];

  return {
    id: generateId(),
    topic: cleanTopic,
    platform,
    broad,
    niche,
    viral
  };
}
