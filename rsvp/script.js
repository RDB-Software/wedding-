// ========== CONFIGURATION ==========
const API_URL = 'https://script.google.com/macros/s/AKfycbxC6wZpEFPfPV_MqOf9cfnCO973UGtoKLsT_3w7InfvVgBRe1qg_otlvqTcG0BObIcULg/exec';

// ========== TRANSLATIONS ==========
const translations = {
    en: {
        yourName: 'Your Name',
        email: 'Email Address',
        attending: 'Are you coming?',
        yes: '✅ Yes, I\'ll be there!',
        no: '❌ No, I cannot attend',
        dietary: 'Your Dietary Preferences',
        standard: '🍖 Standard Meal',
        vegetarian: '🥬 Vegetarian',
        vegan: '🌱 Vegan',
        plusOne: 'Will you be bringing a plus one?',
        plusOneName: 'Plus one name',
        plusOneMeal: 'Plus one meal preference',
        children: 'Are you bringing any children?',
        childName: 'Child name',
        childAge: 'Age',
        childMeal: 'Meal preference',
        addChild: '+ Add Child',
        staying: 'Will you be staying in Lloret?',
        stayingYes: '🏨 Yes',
        stayingNo: '🏠 No',
        stayingNotSure: '🤔 Not Sure Yet',
        song: 'Song Request',
        submit: '✨ Submit RSVP ✨',
        next: 'Next →',
        thankYou: 'Thank You!',
        thankYouMsg: 'Your RSVP has been submitted successfully.',
        celebrate: 'We can\'t wait to celebrate with you! 🎊',
        sorry: 'We are so sorry you can\'t make it!',
        sorrySmall: 'We will miss you and hope to celebrate with you soon.',
        step: 'Step',
        of: 'of'
    },
    es: {
        yourName: 'Tu Nombre',
        email: 'Correo Electrónico',
        attending: '¿Vas a venir?',
        yes: '✅ ¡Sí, estaré allí!',
        no: '❌ No, no puedo venir',
        dietary: 'Tus Preferencias',
        standard: '🍖 Estándar',
        vegetarian: '🥬 Vegetariano',
        vegan: '🌱 Vegano',
        plusOne: '¿Acompañante?',
        plusOneName: 'Nombre',
        plusOneMeal: 'Preferencia',
        children: '¿Niños?',
        childName: 'Nombre',
        childAge: 'Edad',
        childMeal: 'Comida',
        addChild: '+ Agregar Niño',
        staying: '¿Te quedas en Lloret?',
        stayingYes: '🏨 Sí',
        stayingNo: '🏠 No',
        stayingNotSure: '🤔 No sé',
        song: 'Canción',
        submit: '✨ Enviar ✨',
        next: 'Siguiente →',
        thankYou: '¡Gracias!',
        thankYouMsg: 'Confirmación enviada.',
        celebrate: '¡Celebramos juntos! 🎊',
        sorry: '¡Qué pena!',
        sorrySmall: 'Te extrañaremos.',
        step: 'Paso',
        of: 'de'
    }
};

// ========== APP STATE ==========
let state = {
    lang: 'en',
    step: 1,
    formData: {
        name: '',
        email: '',
        attending: null,
        mainGuestMeal: 'Standard',
        hasPlusOne: false,
        plusOneName: '',
        plusOneMeal: 'Standard',
        children: [],
        staying: '',
        song: ''
    },
    childName: '',
    childAge: '',
    childMeal: 'Child Meal',
    submitted: false,
    loading: false
};

// ========== HELPER FUNCTIONS ==========
function t(key) {
    return translations[state.lang][key] || key;
}

function updateUI() {
    const app = document.getElementById('app');
    if (state.submitted) {
        renderThankYouPage(app);
    } else {
        renderStep(app);
    }
}

// ========== SUBMIT TO GOOGLE SHEETS ==========
async function submitToSheet(data) {
    const oldFormat = {
        groupName: data.name,
        primaryContact: data.name,
        email: data.email,
        attending: data.attending,
        guests: [],
        stayingInLloret: data.staying,
        songRequest: data.song
    };
    
    // Main guest
    oldFormat.guests.push({
        name: data.name,
        type: 'Adult',
        childAge: '',
        mealPreference: data.mainGuestMeal,
        dietaryRequirements: 'None',
        allergyDetails: ''
    });
    
    // Plus one
    if (data.hasPlusOne && data.plusOneName) {
        oldFormat.guests.push({
            name: data.plusOneName,
            type: 'Adult',
            childAge: '',
            mealPreference: data.plusOneMeal,
            dietaryRequirements: 'None',
            allergyDetails: ''
        });
    }
    
    // Children
    for (let child of data.children) {
        oldFormat.guests.push({
            name: child.name,
            type: 'Child',
            childAge: child.age,
            mealPreference: child.meal,
            dietaryRequirements: 'None',
            allergyDetails: ''
        });
    }
    
    const formDataEncoded = new URLSearchParams();
    formDataEncoded.append('data', JSON.stringify(oldFormat));
    
    await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formDataEncoded
    });
}

// ========== RENDER FUNCTIONS ==========
function renderThankYouPage(container) {
    const isNotAttending = state.formData.attending === 'No';
    container.innerHTML = `
        <div class="container">
            <div class="card">
                <div class="language-toggle">
                    <button class="lang-btn ${state.lang === 'en' ? 'active' : ''}" onclick="setLang('en')">EN</button>
                    <button class="lang-btn ${state.lang === 'es' ? 'active' : ''}" onclick="setLang('es')">ES</button>
                </div>
                <div class="wedding-header">
                    <h1>Robert <span>&</span> Nataliya</h1>
                </div>
                ${isNotAttending ? `
                    <p class="sorry-message-line">${t('sorry')}</p>
                    <p class="sorry-message-small-line">${t('sorrySmall')}</p>
                ` : `
                    <h2 class="thankyou-title">${t('thankYou')}</h2>
                    <p class="thankyou-message-line">${t('thankYouMsg')}</p>
                    <p class="thankyou-celebrate-line">${t('celebrate')}</p>
                    <div class="wedding-date-line">24 OCTOBER 2026 • HOTEL SANT PERE DEL BOSC</div>
                `}
            </div>
        </div>
    `;
}

function renderStep(container) {
    switch(state.step) {
        case 1: renderStep1(container); break;
        case 2: renderStep2(container); break;
        case 3: renderStep3(container); break;
        case 4: renderStep4(container); break;
        case 5: renderStep5(container); break;
        case 6: renderStep6(container); break;
        default: renderStep1(container);
    }
}

function renderStep1(container) {
    container.innerHTML = `
        <div class="container">
            <div class="card">
                <div class="language-toggle">
                    <button class="lang-btn ${state.lang === 'en' ? 'active' : ''}" onclick="setLang('en')">EN</button>
                    <button class="lang-btn ${state.lang === 'es' ? 'active' : ''}" onclick="setLang('es')">ES</button>
                </div>
                <div class="wedding-header">
                    <h1>Robert <span>&</span> Nataliya</h1>
                </div>
                <div class="step-indicator">${t('step')} 1 ${t('of')} 6</div>
                <input type="text" id="nameInput" placeholder="${t('yourName')}" value="${escapeHtml(state.formData.name)}">
                <input type="email" id="emailInput" placeholder="${t('email')}" value="${escapeHtml(state.formData.email)}">
                <button class="next-btn" id="nextBtn" ${!state.formData.name || !state.formData.email ? 'disabled' : ''}>${t('next')}</button>
            </div>
        </div>
    `;
    
    document.getElementById('nameInput')?.addEventListener('input', (e) => {
        state.formData.name = e.target.value;
        const btn = document.getElementById('nextBtn');
        if (btn) btn.disabled = !state.formData.name || !state.formData.email;
    });
    document.getElementById('emailInput')?.addEventListener('input', (e) => {
        state.formData.email = e.target.value;
        const btn = document.getElementById('nextBtn');
        if (btn) btn.disabled = !state.formData.name || !state.formData.email;
    });
    document.getElementById('nextBtn')?.addEventListener('click', () => {
        if (state.formData.name && state.formData.email) {
            state.step = 2;
            updateUI();
        }
    });
}

function renderStep2(container) {
    container.innerHTML = `
        <div class="container">
            <div class="card">
                <div class="language-toggle">
                    <button class="lang-btn ${state.lang === 'en' ? 'active' : ''}" onclick="setLang('en')">EN</button>
                    <button class="lang-btn ${state.lang === 'es' ? 'active' : ''}" onclick="setLang('es')">ES</button>
                </div>
                <div class="wedding-header">
                    <h1>Robert <span>&</span> Nataliya</h1>
                </div>
                <div class="step-indicator">${t('step')} 2 ${t('of')} 6</div>
                <h2>${t('attending')}</h2>
                <div class="attendance-buttons">
                    <button class="yes-btn" id="yesBtn">${t('yes')}</button>
                    <button class="no-btn" id="noBtn">${t('no')}</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('yesBtn')?.addEventListener('click', () => {
        state.formData.attending = 'Yes';
        state.step = 3;
        updateUI();
    });
    document.getElementById('noBtn')?.addEventListener('click', async () => {
        state.formData.attending = 'No';
        state.loading = true;
        await submitToSheet(state.formData);
        state.submitted = true;
        updateUI();
    });
}

function renderStep3(container) {
    container.innerHTML = `
        <div class="container">
            <div class="card">
                <div class="language-toggle">
                    <button class="lang-btn ${state.lang === 'en' ? 'active' : ''}" onclick="setLang('en')">EN</button>
                    <button class="lang-btn ${state.lang === 'es' ? 'active' : ''}" onclick="setLang('es')">ES</button>
                </div>
                <div class="wedding-header">
                    <h1>Robert <span>&</span> Nataliya</h1>
                </div>
                <div class="step-indicator">${t('step')} 3 ${t('of')} 6</div>
                <h2>${t('dietary')}</h2>
                <select id="mealSelect">
                    <option value="Standard" ${state.formData.mainGuestMeal === 'Standard' ? 'selected' : ''}>${t('standard')}</option>
                    <option value="Vegetarian" ${state.formData.mainGuestMeal === 'Vegetarian' ? 'selected' : ''}>${t('vegetarian')}</option>
                    <option value="Vegan" ${state.formData.mainGuestMeal === 'Vegan' ? 'selected' : ''}>${t('vegan')}</option>
                </select>
                <button class="next-btn" id="nextBtn">${t('next')}</button>
            </div>
        </div>
    `;
    
    document.getElementById('mealSelect')?.addEventListener('change', (e) => {
        state.formData.mainGuestMeal = e.target.value;
    });
    document.getElementById('nextBtn')?.addEventListener('click', () => {
        state.step = 4;
        updateUI();
    });
}

function renderStep4(container) {
    container.innerHTML = `
        <div class="container">
            <div class="card">
                <div class="language-toggle">
                    <button class="lang-btn ${state.lang === 'en' ? 'active' : ''}" onclick="setLang('en')">EN</button>
                    <button class="lang-btn ${state.lang === 'es' ? 'active' : ''}" onclick="setLang('es')">ES</button>
                </div>
                <div class="wedding-header">
                    <h1>Robert <span>&</span> Nataliya</h1>
                </div>
                <div class="step-indicator">${t('step')} 4 ${t('of')} 6</div>
                <h2>${t('plusOne')}</h2>
                <div class="attendance-buttons">
                    <button class="yes-btn" id="yesBtn">✅ Yes</button>
                    <button class="no-btn" id="noBtn">❌ No</button>
                </div>
                <div id="plusOneFields" style="display: ${state.formData.hasPlusOne ? 'block' : 'none'}; margin-top: 20px;">
                    <input type="text" id="plusOneName" placeholder="${t('plusOneName')}" value="${escapeHtml(state.formData.plusOneName)}">
                    <select id="plusOneMeal">
                        <option value="Standard" ${state.formData.plusOneMeal === 'Standard' ? 'selected' : ''}>${t('standard')}</option>
                        <option value="Vegetarian" ${state.formData.plusOneMeal === 'Vegetarian' ? 'selected' : ''}>${t('vegetarian')}</option>
                        <option value="Vegan" ${state.formData.plusOneMeal === 'Vegan' ? 'selected' : ''}>${t('vegan')}</option>
                    </select>
                </div>
                <button class="next-btn" id="nextBtn">${t('next')}</button>
            </div>
        </div>
    `;
    
    document.getElementById('yesBtn')?.addEventListener('click', () => {
        state.formData.hasPlusOne = true;
        const div = document.getElementById('plusOneFields');
        if (div) div.style.display = 'block';
    });
    document.getElementById('noBtn')?.addEventListener('click', () => {
        state.formData.hasPlusOne = false;
        state.formData.plusOneName = '';
        state.formData.plusOneMeal = 'Standard';
        state.step = 5;
        updateUI();
    });
    document.getElementById('plusOneName')?.addEventListener('input', (e) => {
        state.formData.plusOneName = e.target.value;
    });
    document.getElementById('plusOneMeal')?.addEventListener('change', (e) => {
        state.formData.plusOneMeal = e.target.value;
    });
    document.getElementById('nextBtn')?.addEventListener('click', () => {
        if (state.formData.hasPlusOne && !state.formData.plusOneName) {
            alert('Please enter plus one name');
            return;
        }
        state.step = 5;
        updateUI();
    });
}

function renderStep5(container) {
    const childrenHtml = state.formData.children.map((child, idx) => `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
            <span>${escapeHtml(child.name)} (Age: ${child.age}) - ${child.meal}</span>
            <button onclick="removeChild(${idx})" style="background: #A66A54; color: white; border: none; border-radius: 20px; padding: 2px 12px; cursor: pointer;">✕</button>
        </div>
    `).join('');
    
    container.innerHTML = `
        <div class="container">
            <div class="card">
                <div class="language-toggle">
                    <button class="lang-btn ${state.lang === 'en' ? 'active' : ''}" onclick="setLang('en')">EN</button>
                    <button class="lang-btn ${state.lang === 'es' ? 'active' : ''}" onclick="setLang('es')">ES</button>
                </div>
                <div class="wedding-header">
                    <h1>Robert <span>&</span> Nataliya</h1>
                </div>
                <div class="step-indicator">${t('step')} 5 ${t('of')} 6</div>
                <h2>${t('children')}</h2>
                ${state.formData.children.length > 0 ? `
                    <div style="background: #E8DDD1; padding: 12px; border-radius: 12px; margin-bottom: 15px;">
                        <strong>✅ Added Children:</strong>
                        ${childrenHtml}
                    </div>
                ` : ''}
                <div class="guest-count">👧 ${state.formData.children.length}/3 children added</div>
                ${state.formData.children.length < 3 ? `
                    <div class="guest-form">
                        <input type="text" id="childName" placeholder="${t('childName')}" value="${escapeHtml(state.childName)}">
                        <input type="number" id="childAge" placeholder="${t('childAge')}" style="margin-top: 10px;" value="${state.childAge}">
                        <select id="childMeal" style="margin-top: 10px;">
                            <option value="Child Meal" ${state.childMeal === 'Child Meal' ? 'selected' : ''}>🧒 Child Meal</option>
                            <option value="Standard" ${state.childMeal === 'Standard' ? 'selected' : ''}>${t('standard')}</option>
                            <option value="Vegetarian" ${state.childMeal === 'Vegetarian' ? 'selected' : ''}>${t('vegetarian')}</option>
                        </select>
                        <button class="add-guest-btn" id="addChildBtn">${t('addChild')}</button>
                    </div>
                ` : ''}
                <button class="next-btn" id="nextBtn">${t('next')}</button>
            </div>
        </div>
    `;
    
    document.getElementById('childName')?.addEventListener('input', (e) => { state.childName = e.target.value; });
    document.getElementById('childAge')?.addEventListener('input', (e) => { state.childAge = e.target.value; });
    document.getElementById('childMeal')?.addEventListener('change', (e) => { state.childMeal = e.target.value; });
    document.getElementById('addChildBtn')?.addEventListener('click', () => {
        if (state.childName && state.childAge) {
            state.formData.children.push({
                name: state.childName,
                age: state.childAge,
                meal: state.childMeal
            });
            state.childName = '';
            state.childAge = '';
            state.childMeal = 'Child Meal';
            updateUI();
        } else {
            alert('Please enter child name and age');
        }
    });
    document.getElementById('nextBtn')?.addEventListener('click', () => {
        state.step = 6;
        updateUI();
    });
}

function renderStep6(container) {
    container.innerHTML = `
        <div class="container">
            <div class="card">
                <div class="language-toggle">
                    <button class="lang-btn ${state.lang === 'en' ? 'active' : ''}" onclick="setLang('en')">EN</button>
                    <button class="lang-btn ${state.lang === 'es' ? 'active' : ''}" onclick="setLang('es')">ES</button>
                </div>
                <div class="wedding-header">
                    <h1>Robert <span>&</span> Nataliya</h1>
                </div>
                <div class="step-indicator">${t('step')} 6 ${t('of')} 6</div>
                <h2>${t('staying')}</h2>
                <div class="accommodation-buttons">
                    <button class="accommodation-yes" id="stayYes">${t('stayingYes')}</button>
                    <button class="accommodation-no" id="stayNo">${t('stayingNo')}</button>
                    <button class="accommodation-maybe" id="stayMaybe">${t('stayingNotSure')}</button>
                </div>
                <h2 style="margin-top: 25px;">${t('song')}</h2>
                <textarea id="songInput" rows="3" placeholder="Any song request?">${escapeHtml(state.formData.song)}</textarea>
                <button class="submit-btn" id="submitBtn">${t('submit')}</button>
            </div>
        </div>
    `;
    
    document.getElementById('stayYes')?.addEventListener('click', () => { state.formData.staying = 'Yes'; });
    document.getElementById('stayNo')?.addEventListener('click', () => { state.formData.staying = 'No'; });
    document.getElementById('stayMaybe')?.addEventListener('click', () => { state.formData.staying = 'Not Sure Yet'; });
    document.getElementById('songInput')?.addEventListener('input', (e) => { state.formData.song = e.target.value; });
    document.getElementById('submitBtn')?.addEventListener('click', async () => {
        state.loading = true;
        await submitToSheet(state.formData);
        state.submitted = true;
        updateUI();
    });
}

// ========== UTILITY FUNCTIONS ==========
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function setLang(lang) {
    state.lang = lang;
    updateUI();
}

// Make functions global for onclick handlers
window.setLang = setLang;
window.removeChild = (index) => {
    state.formData.children.splice(index, 1);
    updateUI();
};

// ========== INITIALIZE APP ==========
updateUI();