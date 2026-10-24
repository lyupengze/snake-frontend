/**
 * 游戏音效管理器 (基于 Web Audio API - AudioBuffer 极速版)
 *
 * [针对移动端优化]
 * 1. 使用 AudioBufferSourceNode 替代 OscillatorNode，消除部分安卓/鸿蒙 WebView 的节点创建延迟。
 * 2. 引入“心跳保活”机制，初始化时启动一个极微弱的超声波，强行阻止底层音频驱动休眠。
 *
 * TODO: 移动端（Android / HarmonyOS WebView）存在 3~4 秒的音频延迟。
 * 原因是手机系统的音频硬件休眠唤醒机制与 AudioContext 虚拟时钟存在漂移冲突。
 * 后续优化方向：可尝试改用 HTML5 <audio> 标签播放动态生成的 WAV 文件流，绕过 Web Audio 的虚拟时钟限制。
 */
class AudioManager {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem('snake_muted') === 'true';
    this.heartbeatNode = null;
    this.heartbeatGain = null;

    // 预生成的音频缓存
    this.eatBuffer = null;
    this.dieBuffer = null;

    // 监听页面可见性变化（解决手机切后台后的音频挂起）
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.ctx) {
        this.ctx.resume();
      }
    });
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      // [核心优化 1] 预先生成音效 Buffer，避免播放时主线程卡顿
      this.eatBuffer = this.generateBuffer(400, 1200, 0.12, 'square', 0.15);
      this.dieBuffer = this.generateBuffer(300, 50, 0.4, 'sawtooth', 0.1);
      this.warpBuffer = this.generateWarpBuffer();
    }

    // [强行唤醒]
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // [移动端延迟修复] 启动心跳保活 (20000Hz 超声波，人耳听不到)
    if (!this.heartbeatNode) {
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
   * 内部方法：计算并生成音频 Buffer
   */
  generateBuffer(freqStart, freqEnd, duration, type, vol) {
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
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
      if (progress > 0.8) {
        envelope = Math.max(0, 1 - (progress - 0.8) / 0.2);
      }

      data[i] = sample * vol * envelope;
    }
    return buffer;
  }

  /**
   * [专属定制] 生成穿墙的"吸溜"音效（下坠式气哨 + 瞬态起音）
   */
  generateWarpBuffer() {
    const sampleRate = this.ctx.sampleRate;
    const duration = 0.2; // 0.2秒的吸入感
    const bufferSize = sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    let phase = 0;

    for (let i = 0; i < bufferSize; i++) {
      const t = i / sampleRate;
      const progress = t / duration;

      // 核心变化：频率从 1500Hz 快速下坠到 100Hz，模拟被吸进管道的空间感
      // 使用了 Math.pow(progress, 0.4) 让下降曲线更急促
      const currentFreq = 1500 - 1400 * Math.pow(progress, 0.4);
      phase += (2 * Math.PI * currentFreq) / sampleRate;

      // 正弦波最像纯净的气哨声
      let sample = Math.sin(phase);

      // 包络：极短的起音（瞬间爆发吸力），然后快速衰减
      let envelope = 0;
      if (progress < 0.05) {
        envelope = progress / 0.05;
      } else {
        envelope = Math.pow(1 - (progress - 0.05) / 0.95, 2);
      }

      data[i] = sample * envelope * 0.6;
    }
    return buffer;
  }

  playEat() {
    if (this.isMuted || !this.ctx || !this.eatBuffer) return;

    // [核心优化 2] 直接使用预生成的 Buffer 播放，零延迟
    const source = this.ctx.createBufferSource();
    source.buffer = this.eatBuffer;
    source.connect(this.ctx.destination);
    source.start(0);
  }

  playDie() {
    if (this.isMuted || !this.ctx || !this.dieBuffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = this.dieBuffer;
    source.connect(this.ctx.destination);
    source.start(0);
  }

  playWarp() {
    if (this.isMuted || !this.ctx || !this.warpBuffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = this.warpBuffer;
    source.connect(this.ctx.destination);
    source.start(0);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('snake_muted', this.isMuted);
    return this.isMuted;
  }
}

export const audioManager = new AudioManager();
