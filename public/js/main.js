document.addEventListener('DOMContentLoaded', () => {
  setupWizard();
  setupRepeaters();
  setupPreviewActions();
});

const SPONSOR_VIDEO_SECONDS = 30;
const SPONSOR_VIDEO_COUNT = 2;

function setupWizard() {
  const form = document.querySelector('[data-cv-form]');
  if (!form) return;

  const steps = Array.from(form.querySelectorAll('.wizard-step'));
  const dots = Array.from(document.querySelectorAll('[data-step-dot]'));
  let currentStep = 0;

  const showStep = (index) => {
    steps.forEach((step, stepIndex) => step.classList.toggle('active', stepIndex === index));
    dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
    currentStep = index;
  };

  form.querySelectorAll('[data-next-step]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!validateStep(steps[currentStep])) return;
      showStep(Math.min(currentStep + 1, steps.length - 1));
    });
  });

  form.querySelectorAll('[data-prev-step]').forEach((button) => {
    button.addEventListener('click', () => showStep(Math.max(currentStep - 1, 0)));
  });

  form.addEventListener('submit', (event) => {
    if (!validateStep(steps[currentStep])) {
      event.preventDefault();
      return;
    }

    if (form.dataset.sponsorComplete !== 'true') {
      event.preventDefault();
      showSponsorVideos(() => {
        form.dataset.sponsorComplete = 'true';
        document.querySelector('.loader-overlay')?.classList.add('active');
        form.requestSubmit();
      });
      return;
    }

    document.querySelector('.loader-overlay')?.classList.add('active');
  });

  showStep(0);
}

function showSponsorVideos(onComplete) {
  const overlay = document.getElementById('sponsorVideoOverlay');
  const countdown = document.getElementById('sponsorCountdown');
  const progress = document.getElementById('sponsorProgress');
  const slotLabel = document.getElementById('sponsorSlotLabel');
  const video = document.getElementById('sponsorVideo');

  if (!overlay || !countdown || !progress || !slotLabel) {
    onComplete();
    return;
  }

  let currentSlot = 1;
  let remaining = SPONSOR_VIDEO_SECONDS;

  const startSlot = () => {
    remaining = SPONSOR_VIDEO_SECONDS;
    slotLabel.textContent = `Sponsor video ${currentSlot} of ${SPONSOR_VIDEO_COUNT}`;
    countdown.textContent = String(remaining);
    progress.style.width = '0%';

    if (video) {
      const source = video.querySelector('source');
      if (source) {
        source.src = `/videos/sponsor-${currentSlot}.mp4`;
        video.load();
      }
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  };

  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');
  startSlot();

  const timer = window.setInterval(() => {
    remaining -= 1;
    countdown.textContent = String(Math.max(remaining, 0));
    progress.style.width = `${((SPONSOR_VIDEO_SECONDS - remaining) / SPONSOR_VIDEO_SECONDS) * 100}%`;

    if (remaining > 0) {
      return;
    }

    if (currentSlot < SPONSOR_VIDEO_COUNT) {
      currentSlot += 1;
      startSlot();
      return;
    }

    window.clearInterval(timer);
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    if (video) {
      video.pause();
    }
    onComplete();
  }, 1000);
}

function validateStep(step) {
  const invalid = Array.from(step.querySelectorAll('[required]')).find((field) => !field.value.trim());
  if (!invalid) return true;

  Swal.fire({
    icon: 'warning',
    title: 'Missing information',
    text: 'Please complete the required fields before continuing.'
  });
  invalid.focus();
  return false;
}

function setupRepeaters() {
  document.querySelectorAll('[data-add-repeat]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.querySelector(button.dataset.addRepeat);
      const template = document.querySelector(button.dataset.template);
      if (!target || !template) return;

      const index = target.children.length;
      const html = template.innerHTML.replaceAll('__INDEX__', index);
      target.insertAdjacentHTML('beforeend', html);
    });
  });

  document.addEventListener('click', (event) => {
    const removeButton = event.target.closest('[data-remove-repeat]');
    if (removeButton) {
      removeButton.closest('[data-repeat-item]')?.remove();
    }
  });
}

function setupPreviewActions() {
  const cvContent = document.getElementById('cvContent');
  if (!cvContent) return;

  const editButton = document.getElementById('toggleEditMode');
  const saveButton = document.getElementById('saveEditsButton');
  const exportForm = document.getElementById('exportForm');
  const saveUrl = cvContent.dataset.saveUrl;

  editButton?.addEventListener('click', () => {
    cvContent.classList.toggle('editable-enabled');
    const enabled = cvContent.classList.contains('editable-enabled');
    cvContent.querySelectorAll('[data-editable]').forEach((element) => {
      element.setAttribute('contenteditable', String(enabled));
    });
    editButton.textContent = enabled ? 'Lock Manual Edits' : 'Manual Edit Mode';
  });

  saveButton?.addEventListener('click', async () => {
    const finalContent = collectCvContent();
    const response = await fetch(saveUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ finalContent })
    });

    if (!response.ok) {
      Swal.fire({ icon: 'error', title: 'Save failed', text: 'Your edits could not be saved.' });
      return;
    }

    Swal.fire({ icon: 'success', title: 'Saved', text: 'Manual edits saved successfully.' });
  });

  exportForm?.addEventListener('submit', () => {
    exportForm.querySelector('input[name="finalContent"]').value = JSON.stringify(collectCvContent());
  });
}

function collectCvContent() {
  const personal = {};
  document.querySelectorAll('[data-personal]').forEach((element) => {
    personal[element.dataset.personal] = element.textContent.trim();
  });

  return {
    personal,
    targetJobTitle: getText('[data-target-title]'),
    summary: getText('[data-summary]'),
    contributionStatement: getText('[data-contribution]'),
    coreCompetencies: getTexts('[data-competency]'),
    employmentProfile: {
      personalAttributes: splitDisplayList(getText('[data-attribute-list]')),
      softSkills: splitDisplayList(getText('[data-soft-skill-list]')),
      pressureHandling: getText('[data-pressure]'),
      teamworkStyle: getText('[data-teamwork]'),
      supervisionPreference: getText('[data-supervision]'),
      learningAgility: getText('[data-learning]'),
      fieldStrengths: getText('[data-field-strengths]'),
      realWorldContribution: getText('[data-contribution]')
    },
    achievements: Array.from(document.querySelectorAll('[data-achievement-item]')).map((item) => ({
      title: getText('[data-ach-title]', item),
      context: getText('[data-ach-context]', item),
      result: getText('[data-ach-result]', item),
      relevance: getText('[data-ach-relevance]', item)
    })),
    projects: Array.from(document.querySelectorAll('[data-project-item]')).map((item) => ({
      title: getText('[data-project-title]', item),
      context: getText('[data-project-context]', item),
      role: getText('[data-project-role]', item),
      contribution: getText('[data-project-contribution]', item),
      outcome: getText('[data-project-outcome]', item)
    })),
    experience: Array.from(document.querySelectorAll('[data-experience-item]')).map((item) => ({
      role: getText('[data-exp-role]', item),
      company: getText('[data-exp-company]', item),
      location: getText('[data-exp-location]', item),
      startDate: getText('[data-exp-start]', item),
      endDate: getText('[data-exp-end]', item),
      achievements: getTexts('[data-exp-achievement]', item)
    })),
    education: Array.from(document.querySelectorAll('[data-education-item]')).map((item) => ({
      level: getText('[data-edu-level]', item),
      qualification: getText('[data-edu-qualification]', item),
      institution: getText('[data-edu-institution]', item),
      location: getText('[data-edu-location]', item),
      startDate: getText('[data-edu-start]', item),
      endDate: getText('[data-edu-end]', item),
      details: getText('[data-edu-details]', item)
    })),
    languages: getTexts('[data-language]'),
    hobbies: getTexts('[data-hobby]'),
    referees: Array.from(document.querySelectorAll('[data-referee-item]')).map((item) => ({
      fullName: getText('[data-ref-name]', item),
      designation: getText('[data-ref-designation]', item),
      company: getText('[data-ref-company]', item),
      phone: getText('[data-ref-phone]', item),
      email: getText('[data-ref-email]', item)
    }))
  };
}

function getText(selector, root = document) {
  return root.querySelector(selector)?.textContent.trim() || '';
}

function getTexts(selector, root = document) {
  return Array.from(root.querySelectorAll(selector))
    .map((element) => element.textContent.trim())
    .filter(Boolean);
}

function splitDisplayList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}
