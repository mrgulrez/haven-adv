export type ChatMessage = {
    id: string;
    sender: "api" | "user";
    text: string;
    time: string;
};

export const SESSION_ID = `session_${Date.now()}`;

export const CHAT_SUGGESTIONS = [
    "Help me sort out what I am feeling right now.",
    "Plan a calmer morning routine with me.",
    "Remember that I am preparing for an important interview.",
    "Ask me three questions to reflect on today.",
] as const;

/** A synthesized ringback tone with an explicit lifecycle. */
export class RingingSession {
    private ctx: AudioContext | null = null;
    private osc1: OscillatorNode | null = null;
    private osc2: OscillatorNode | null = null;
    private gain: GainNode | null = null;

    start() {
        try {
            this.ctx = new window.AudioContext();
            this.gain = this.ctx.createGain();
            this.osc1 = this.ctx.createOscillator();
            this.osc2 = this.ctx.createOscillator();
            this.osc1.frequency.setValueAtTime(440, this.ctx.currentTime);
            this.osc2.frequency.setValueAtTime(480, this.ctx.currentTime);
            this.osc1.connect(this.gain);
            this.osc2.connect(this.gain);
            this.gain.connect(this.ctx.destination);

            const now = this.ctx.currentTime;
            this.gain.gain.setValueAtTime(0, now);
            for (let offset = 0; offset < 60; offset += 6) {
                this.gain.gain.linearRampToValueAtTime(0.15, now + offset + 0.1);
                this.gain.gain.linearRampToValueAtTime(0.15, now + offset + 2);
                this.gain.gain.linearRampToValueAtTime(0, now + offset + 2.1);
            }
            this.osc1.start();
            this.osc2.start();
        } catch (error) {
            console.error("Failed to start ringing synthesis:", error);
        }
    }

    stop() {
        if (!this.ctx) return;
        this.osc1?.stop();
        this.osc2?.stop();
        void this.ctx.close();
        this.ctx = null;
    }
}
