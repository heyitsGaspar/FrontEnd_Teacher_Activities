let audioContext: AudioContext | null = null;

/**
 * Tono corto para confirmar o rechazar un escaneo.
 * Agudo = correcto, grave = error o repetido.
 */
export function playTone(kind: "success" | "error") {
    try {
        audioContext ??= new AudioContext();

        const context = audioContext;

        void context.resume();

        const oscillator = context.createOscillator();
        const gain = context.createGain();

        const duration = kind === "success" ? 0.12 : 0.3;

        oscillator.type = "sine";
        oscillator.frequency.value = kind === "success" ? 880 : 220;

        gain.gain.setValueAtTime(0.15, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            context.currentTime + duration
        );

        oscillator.connect(gain).connect(context.destination);

        oscillator.start();
        oscillator.stop(context.currentTime + duration);
    } catch {
        /* Sin audio disponible: la pantalla ya da la confirmación. */
    }
}