let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const slideCounter = document.getElementById('slideCounter');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        // Theme Switcher Function
        function setTheme(theme) {
            document.body.setAttribute('data-theme', theme);
        }

        function updateSlide() {
            slides.forEach((slide, index) => {
                slide.classList.remove('active');
                if (index === currentSlide) {
                    slide.classList.add('active');
                }
            });

            slideCounter.textContent = `${currentSlide + 1} / ${slides.length}`;
            
            // Limit navigation buttons
            prevBtn.disabled = currentSlide === 0;
            nextBtn.disabled = currentSlide === slides.length - 1;
        }

        function changeSlide(direction) {
            currentSlide += direction;
            if (currentSlide < 0) currentSlide = 0;
            if (currentSlide >= slides.length) currentSlide = slides.length - 1;
            updateSlide();
        }

        // Arrow Key Keyboard Shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'Space') {
                if (currentSlide < slides.length - 1) changeSlide(1);
            } else if (e.key === 'ArrowLeft') {
                if (currentSlide > 0) changeSlide(-1);
            }
        });

        // Web Audio API Visualizer On-Mic Feature
        let audioCtx, analyser, microphone, stream;
        let isMicActive = false;
        let animId;

        async function toggleMic(canvasId, dbId, btn) {
            if (isMicActive) {
                // Turn off Mic
                if (stream) stream.getTracks().forEach(track => track.stop());
                if (audioCtx) audioCtx.close();
                cancelAnimationFrame(animId);
                isMicActive = false;
                btn.classList.remove('active');
                btn.innerHTML = `<i class="fa-solid fa-microphone"></i> Fitur ON MIC (Uji Suara Live)`;
                document.getElementById(dbId).innerText = `0 dB`;
                return;
            }

            try {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioCtx.createAnalyser();
                microphone = audioCtx.createMediaStreamSource(stream);

                microphone.connect(analyser);
                analyser.fftSize = 128;
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                const canvas = document.getElementById(canvasId);
                const canvasCtx = canvas.getContext('2d');

                isMicActive = true;
                btn.classList.add('active');
                btn.innerHTML = `<i class="fa-solid fa-microphone-slash"></i> Matikan Mic`;

                function draw() {
                    if (!isMicActive) return;
                    animId = requestAnimationFrame(draw);

                    analyser.getByteFrequencyData(dataArray);

                    // Calculate average volume dB estimate
                    let sum = 0;
                    for (let i = 0; i < bufferLength; i++) {
                        sum += dataArray[i];
                    }
                    let average = sum / bufferLength;
                    let estimatedDb = Math.round(Math.min(110, (average / 255) * 100 + 30));
                    document.getElementById(dbId).innerText = `${estimatedDb} dB`;

                    // Draw Waveform Chart
                    canvasCtx.fillStyle = '#0f172a';
                    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

                    const barWidth = (canvas.width / bufferLength) * 2.5;
                    let x = 0;

                    for (let i = 0; i < bufferLength; i++) {
                        let barHeight = (dataArray[i] / 255) * canvas.height;
                        canvasCtx.fillStyle = `hsl(${i * 12 + 160}, 80%, 50%)`;
                        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                        x += barWidth + 2;
                    }
                }

                draw();
            } catch (err) {
                alert('Akses mikrofon ditolak atau tidak didukung di browser ini.');
            }
        }

        // Initialize presentation
        updateSlide();