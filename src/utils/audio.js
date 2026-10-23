/**
 * 游戏音效管理器 (基于 Web Audio API)
 */
class AudioManager {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem('snake_muted') === 'true';
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freqStart, freqEnd, duration, type = 'sine', vol = 0.3) {
    if (this.isMuted || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, this.ctx.currentTime);
    if (freqEnd) {
      osc.frequency.exponentialRampToValueAtTime(freqEnd, this.ctx.currentTime + duration);
    }

    // 音量包络：保持设定音量一段时间，然后快速衰减，听起来更干脆
    gainNode.gain.setValueAtTime(vol, this.ctx.currentTime);
    gainNode.gain.setValueAtTime(vol, this.ctx.currentTime + duration * 0.2); // 前20%时间保持最大音量
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);

    // [核心修复] 声音播放完毕后，立刻销毁节点，释放资源，防止后续音效失效
    osc.onended = () => {
      osc.disconnect();
      gainNode.disconnect();
    };
  }

  /**
   * 播放吃食物音效（高频、干脆、穿透力强）
   */
  playEat() {
    // 频率跨度大（400->1200），方波，时长 0.15s，音量拉满到 0.8
    this.playTone(400, 1200, 0.15, 'square', 0.8);
  }

  /**
   * 播放游戏结束音效（沉闷、下降）
   */
  playDie() {
    // 降低初始音量到 0.3，避免震耳欲聋
    this.playTone(300, 50, 0.5, 'sawtooth', 0.3);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('snake_muted', this.isMuted);
    return this.isMuted;
  }
}

export const audioManager = new AudioManager();
