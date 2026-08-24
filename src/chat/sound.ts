let audioCtx: AudioContext | null = null;

/** Toca um "beep" curto de duas notas, sintetizado na hora (sem depender
 * de nenhum arquivo de áudio externo). Precisa ser chamado a partir de uma
 * interação do usuário pelo menos uma vez, por causa das políticas de
 * autoplay dos navegadores — mas mensagens chegando após qualquer clique
 * na página já funcionam normalmente. */
export function playNotifySound() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    if (!audioCtx) audioCtx = new Ctx();
    if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});

    const now = audioCtx.currentTime;
    const notes = [880, 1108.73]; // A5 -> C#6, um "ding" de duas notas
    notes.forEach((freq, i) => {
      const osc = audioCtx!.createOscillator();
      const gain = audioCtx!.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = now + i * 0.09;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.15, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16);
      osc.connect(gain);
      gain.connect(audioCtx!.destination);
      osc.start(start);
      osc.stop(start + 0.18);
    });
  } catch {
    /* som é um extra — nunca deve quebrar o app */
  }
}
