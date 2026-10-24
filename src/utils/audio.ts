/**
 * 游戏音效管理器 (基于 Web Audio API)
 *
 * [深度优化]
 * 1. 预生成 AudioBuffer，消除播放时的计算卡顿。
 * 2. 采用“心跳保活”机制防止移动端音频硬件休眠。
 *
 * TODO: 移动端（Android/HarmonyOS WebView）存在 3~4 秒的音频延迟。
 * 原因是手机系统的音频硬件休眠唤醒机制与 AudioContext 虚拟时钟存在漂移冲突。
 * 后续优化方向：可尝试改用 HTML5 <audio> 标签播放动态生成的 WAV 文件流。
 */
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
    // 监听页面可见性，切后台回来强制恢复音频通道
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

      // 初始化时预生成音效
      this.eatBuffer = this.generateBuffer(400, 1200, 0.12, 'square', 0.15);
      this.dieBuffer = this.generateBuffer(300, 50, 0.4, 'sawtooth', 0.1);
      this.warpBuffer = this.generateWarpBuffer();
    }

    if (this.ctx.state === 'suspended') this.ctx.resume();

    // [移动端延迟修复] 启动心跳保活 (20000Hz 超声波，人耳听不到)
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

  /**
   * 生成基础波形 Buffer
   */
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

      let envelope = 1;
      if (progress > 0.8) envelope = Math.max(0, 1 - (progress - 0.8) / 0.2);
      data[i] = sample * vol * envelope;
    }
    return buffer;
  }

  /**
   * 生成穿墙专属“吸溜”音效（下坠式气哨 + 瞬态起音）
   */
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
