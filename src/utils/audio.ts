// 游戏音效管理器：基于 Web Audio API 合成 8-bit 风格音效，无外部音频文件依赖。
// 预生成 AudioBuffer 消除播放延迟；心跳保活防止移动端音频硬件休眠。
//
// 已知问题：移动端 WebView 存在约 3~4 秒音频延迟，
// 源于系统音频硬件休眠唤醒与 AudioContext 虚拟时钟的漂移冲突。
class AudioManager {
  private ctx: AudioContext | null = null;
  public isMuted: boolean;
  private heartbeatNode: OscillatorNode | null = null;
  private heartbeatGain: GainNode | null = null;

  private eatBuffer: AudioBuffer | null = null;
  private dieBuffer: AudioBuffer | null = null;
  private warpBuffer: AudioBuffer | null = null;

  constructor() {
    this.isMuted = localStorage.getItem('snake_muted') === 'true';
    // 页面从后台恢复时重新激活音频上下文
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.ctx) {
        this.ctx.resume();
      }
    });
  }

  public init(): void {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.eatBuffer = this.generateBuffer(400, 1200, 0.12, 'square', 0.15);
      this.dieBuffer = this.generateBuffer(300, 50, 0.4, 'sawtooth', 0.1);
      this.warpBuffer = this.generateWarpBuffer();
    }

    if (this.ctx.state === 'suspended') this.ctx.resume();

    // 20000Hz 超声波心跳保活，保持音频通道活跃防止移动端休眠
    if (!this.heartbeatNode && this.ctx) {
      this.heartbeatNode = this.ctx.createOscillator();
      this.heartbeatGain = this.ctx.createGain();
      this.heartbeatNode.type = 'sine';
      this.heartbeatNode.frequency.value = 20000;
      this.heartbeatGain.gain.value = 0.0001;
      this.heartbeatNode.connect(this.heartbeatGain);
      this.heartbeatGain.connect(this.ctx.destination);
      this.heartbeatNode.start();
    }
  }

  private generateBuffer(
    freqStart: number,
    freqEnd: number,
    duration: number,
    type: OscillatorType,
    vol: number
  ): AudioBuffer {
    const sampleRate = this.ctx!.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = this.ctx!.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    let phase = 0;

    for (let i = 0; i < bufferSize; i++) {
      const t = i / sampleRate;
      const progress = t / duration;
      const currentFreq = freqStart + (freqEnd - freqStart) * progress;
      phase += (2 * Math.PI * currentFreq) / sampleRate;

      let sample = 0;
      if (type === 'square') sample = Math.sin(phase) > 0 ? 1 : -1;
      else if (type === 'sawtooth')
        sample = 2 * (phase / (2 * Math.PI) - Math.floor(phase / (2 * Math.PI) + 0.5));
      else if (type === 'triangle')
        sample =
          2 * Math.abs(2 * (phase / (2 * Math.PI) - Math.floor(phase / (2 * Math.PI) + 0.5))) - 1;
      else sample = Math.sin(phase);

      // 尾部 20% 做淡出包络，避免截断爆音
      let envelope = 1;
      if (progress > 0.8) envelope = Math.max(0, 1 - (progress - 0.8) / 0.2);
      data[i] = sample * vol * envelope;
    }
    return buffer;
  }

  // 穿墙专属"吸溜"音效：下坠式气哨 + 瞬态起音
  private generateWarpBuffer(): AudioBuffer {
    const sampleRate = this.ctx!.sampleRate;
    const duration = 0.2;
    const bufferSize = sampleRate * duration;
    const buffer = this.ctx!.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    let phase = 0;

    for (let i = 0; i < bufferSize; i++) {
      const t = i / sampleRate;
      const progress = t / duration;
      const currentFreq = 1500 - 1400 * Math.pow(progress, 0.4);
      phase += (2 * Math.PI * currentFreq) / sampleRate;

      let sample = Math.sin(phase);
      let envelope = progress < 0.05 ? progress / 0.05 : Math.pow(1 - (progress - 0.05) / 0.95, 2);
      data[i] = sample * envelope * 0.6;
    }
    return buffer;
  }

  public playEat(): void {
    if (this.isMuted || !this.ctx || !this.eatBuffer) return;
    const source = this.ctx.createBufferSource();
    source.buffer = this.eatBuffer;
    source.connect(this.ctx.destination);
    source.start(0);
  }

  public playDie(): void {
    if (this.isMuted || !this.ctx || !this.dieBuffer) return;
    const source = this.ctx.createBufferSource();
    source.buffer = this.dieBuffer;
    source.connect(this.ctx.destination);
    source.start(0);
  }

  public playWarp(): void {
    if (this.isMuted || !this.ctx || !this.warpBuffer) return;
    const source = this.ctx.createBufferSource();
    source.buffer = this.warpBuffer;
    source.connect(this.ctx.destination);
    source.start(0);
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('snake_muted', this.isMuted.toString());
    return this.isMuted;
  }
}

export const audioManager = new AudioManager();
