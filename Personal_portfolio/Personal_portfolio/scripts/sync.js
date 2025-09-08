(function(){
  // BroadcastChannel for modern browsers
  var channel = null;
  try { channel = new BroadcastChannel('portfolio-updates'); } catch(e) { channel = null; }

  // Notify other tabs/pages that data has changed
  function notifyDataChanged(section){
    var payload = { type: 'data-changed', section: section || 'all', ts: Date.now() };
    try { if (channel) channel.postMessage(payload); } catch(e) {}
    try { localStorage.setItem('portfolio:lastUpdate', String(payload.ts)); } catch(e) {}
  }

  // On index.aspx, call this to auto-refresh when admin updates
  function setupIndexLiveRefresh(){
    function onUpdate(){
      // Simple: full reload to fetch fresh data from server
      try { window.location.reload(); } catch(e) {}
    }
    try { if (channel) channel.onmessage = function(ev){ if (ev && ev.data && ev.data.type === 'data-changed') onUpdate(); }; } catch(e) {}
    try { window.addEventListener('storage', function(ev){ if (ev.key === 'portfolio:lastUpdate') onUpdate(); }); } catch(e) {}
  }

  // Expose globally
  window.notifyDataChanged = notifyDataChanged;
  window.setupIndexLiveRefresh = setupIndexLiveRefresh;
})();
