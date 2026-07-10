// Minimalized copy of reference anime.js player integration
// This file initializes playback for the kv-player and provides activateServer/watch handling.
(function(){
  window.KV_REF = window.KV_REF || {};
  function $(sel){ return document.querySelector(sel); }
  function $all(sel){ return Array.from(document.querySelectorAll(sel)); }

  let hls = null;
  function attachHls(videoEl, url){
    if(window.Hls && window.Hls.isSupported() && /\.m3u8(\?|$)/i.test(url)){
      if(hls) try{ hls.destroy(); }catch{};
      hls = new window.Hls({ capLevelToPlayerSize: true, autoStartLoad: true });
      hls.loadSource(url);
      hls.attachMedia(videoEl);
      return true;
    }
    videoEl.src = url;
    videoEl.load();
    return true;
  }

  window.KV_REF.playStream = function(streamUrl){
    const video = $('#hls-video') || $('#watch-video');
    if(!video) return;
    if(!streamUrl) { console.warn('no stream'); return; }
    attachHls(video, streamUrl);
    video.play().catch(()=>{});
  };

  window.KV_REF.renderIntroOutro = function(intro,outro){
    // render segments on kv-segments
    const container = document.getElementById('kv-segments');
    if(!container) return;
    const dur = (document.querySelector('#hls-video')||{}).duration || 0;
    if(!dur) { container.innerHTML = ''; return; }
    let parts = '';
    const mk = (cls,s,e)=>{ if(e<=s) return ''; const left=(s/dur)*100; const w=((e-s)/dur)*100; return `<span class="kv-segment ${cls}" style="left:${left}%;width:${w}%"></span>` };
    if(intro) parts += mk('kv-segment-intro', intro.start||0, intro.end||0);
    if(outro) parts += mk('kv-segment-outro', outro.start||0, outro.end||0);
    container.innerHTML = parts;
  };

  // Expose small API
  window.Kurovexa = window.Kurovexa || {};
  window.Kurovexa.play = async function(url, cb){
    window.KV_REF.playStream(url);
    if(cb) cb();
  };
})();
