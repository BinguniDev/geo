document.addEventListener('DOMContentLoaded', () => {
    // 1. Hamburger-Menü für mobile Navigation
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');

    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            navToggle.classList.toggle('open'); // Für Hamburger-Animation
        });

        // Menü schließen, wenn ein Link geklickt wird (auf mobilen Geräten)
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) { // Nur auf kleineren Bildschirmen
                    navList.classList.remove('active');
                    navToggle.classList.remove('open');
                }
            });
        });
    }

    // 2. Formularvalidierung und -handhabung
    const requestForm = document.getElementById('requestForm');
    if (requestForm) {
        requestForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Standard-Formularsendung verhindern

            let isValid = true;
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const dateNeededInput = document.getElementById('date-needed');
            const successMessage = document.getElementById('form-success-message');

            // Funktion zum Anzeigen von Fehlermeldungen
            const showError = (element, message) => {
                const formGroup = element.closest('.form-group');
                const errorDiv = formGroup.querySelector('.error-message');
                errorDiv.textContent = message;
                errorDiv.style.display = 'block';
                element.classList.add('input-error'); // Optional: Roter Rahmen
                isValid = false;
            };

            // Funktion zum Ausblenden von Fehlermeldungen
            const hideError = (element) => {
                const formGroup = element.closest('.form-group');
                const errorDiv = formGroup.querySelector('.error-message');
                errorDiv.textContent = '';
                errorDiv.style.display = 'none';
                element.classList.remove('input-error');
            };

            // Alle Fehler vor neuer Validierung zurücksetzen
            document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
            successMessage.style.display = 'none'; // Erfolgsmeldung verstecken

            // Validierung für "Dein Name"
            if (nameInput.value.trim() === '') {
                showError(nameInput, 'Bitte gib deinen Namen ein.');
            } else {
                hideError(nameInput);
            }

            // Validierung für "Benötigt am"
            if (dateNeededInput.value === '') {
                showError(dateNeededInput, 'Bitte wähle ein Datum aus.');
            } else {
                const selectedDate = new Date(dateNeededInput.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Uhrzeit für Vergleich ignorieren

                if (selectedDate < today) {
                    showError(dateNeededInput, 'Das Datum muss in der Zukunft liegen.');
                } else {
                    hideError(dateNeededInput);
                }
            }

            // Optional: E-Mail-Validierung (rudimentär)
            if (emailInput.value.trim() !== '' && !emailInput.value.includes('@')) {
                showError(emailInput, 'Bitte gib eine gültige E-Mail-Adresse ein.');
            } else {
                hideError(emailInput);
            }

            // Wenn alle Validierungen erfolgreich waren
            if (isValid) {
                // Hier würden die Formulardaten normalerweise an einen Server gesendet werden.
                // Für diese statische Homepage simulieren wir einfach den Erfolg.
                console.log('Formulardaten erfolgreich gesendet:', {
                    name: nameInput.value,
                    email: emailInput.value,
                    triangleType: document.getElementById('triangle-type').value,
                    dateNeeded: dateNeededInput.value,
                    timeNeeded: document.getElementById('time-needed').value,
                    message: document.getElementById('message').value
                });

                requestForm.reset(); // Formularfelder leeren
                successMessage.style.display = 'block'; // Erfolgsmeldung anzeigen

                // Erfolgsmeldung nach 5 Sekunden ausblenden
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
            }
        });
    }

    // 3. FAQ-Akkordeon-Funktionalität
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq-item');
            faqItem.classList.toggle('active');

            const faqAnswer = faqItem.querySelector('.faq-answer');
            if (faqItem.classList.contains('active')) {
                // Wenn aktiv, die Höhe auf die scrollHeight setzen, um die Animation zu ermöglichen
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
            } else {
                faqAnswer.style.maxHeight = '0';
            }
        });
    });

    // 4. Aktiven Navigationslink hervorheben (optional, für bessere Benutzererfahrung)
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.main-nav .nav-list li a');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.7 // Wenn 70% der Sektion sichtbar sind
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Initialen aktiven Link beim Laden setzen
    const initialActiveSection = document.querySelector('section.hero-section'); // Oder eine andere Startsektion
    if (initialActiveSection) {
        navLinks.forEach(link => {
            if (link.getAttribute('href').substring(1) === initialActiveSection.id) {
                link.classList.add('active');
            }
        });
    }
});
