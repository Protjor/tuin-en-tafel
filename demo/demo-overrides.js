/* Demo: instellingen zonder account, met herstelknop */
settingsSheet=function(){
  sheet(`<div class="sh-h"><div><span class="label">Instellingen</span><h2>Demo</h2></div><button class="btn ghost" data-act="close" aria-label="Sluiten">✕</button></div>
  <div class="sh-b">
    <div class="note">Dit is een demo. Alles wat je toevoegt of wijzigt, blijft alleen in deze browser op dit toestel. In de volledige versie meld je aan en synchroniseren recepten, zaden en foto's live tussen al je toestellen.</div>
    <div style="display:grid;gap:8px"><span class="label">Zaaiherinneringen</span>
      <p class="muted" style="margin:0">Download het agendabestand en open het op je telefoon of in Outlook/Google Agenda. Elke zaaimaand krijg je op de 1e om 9 uur een melding.</p>
      <button class="btn" style="justify-self:start" data-act="ics">Agendabestand downloaden</button></div>
    <div style="display:grid;gap:8px"><span class="label">Gegevens</span>
      <div class="row"><button class="btn" data-act="export">Back-up downloaden</button>
      <label class="btn" style="cursor:pointer">Back-up importeren<input id="imp_file" type="file" accept="application/json,.json" hidden></label></div></div>
    <div class="row" style="justify-content:flex-end"><button class="btn danger" data-act="demoreset">Demo herstellen</button></div>
  </div>`);
};
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="demoreset"]');if(!b)return;
  if(b.dataset.confirm!=='1'){b.dataset.confirm='1';b.textContent='Alles wissen en opnieuw beginnen?';return}
  window.ttDemoReset();
},true);
