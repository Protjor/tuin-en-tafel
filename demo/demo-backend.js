/* Tuin & Tafel — DEMO: alle gegevens blijven in deze browser (localStorage). Geen server, geen login. */
(function(){
  const KEY='tt-demo-v1', PKEY='tt-demo-photos-v1';
  const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
  const store=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
  let items=load(KEY,null), photos=load(PKEY,{});
  const persist=()=>{if(!store(KEY,items))throw new Error('Het geheugen van deze browser is vol. Verwijder een paar foto\'s of klik op Demo herstellen.')};
  const uuid=()=>(crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2));
  async function seed(){
    const d=await (await fetch('starter/starter.json')).json();const now=new Date().toISOString();
    items=[...(d.recepten||[]).map(r=>({id:uuid(),kind:'recipes',updated:now,data:{...r,fotos:(r.fotos||[]).map(p=>({id:p.starter,url:'starter/photos/'+p.starter}))}})),
           ...(d.zaden||[]).map(s=>({id:uuid(),kind:'seeds',updated:now,data:s}))];
    photos={};store(PKEY,photos);persist();
  }
  window.ttDemoReset=async()=>{try{localStorage.removeItem(KEY);localStorage.removeItem(PKEY)}catch(e){}await seed();location.reload()};
  const ready=items?Promise.resolve():seed().catch(()=>{items=[]});
  function q(){let op='select',payload=null,id=null,single=false;const b={
    select(){return b},order(){return b},limit(){return b},single(){single=true;return b},
    insert(p){op='insert';payload=p;return b},update(p){op='update';payload=p;return b},delete(){op='delete';return b},eq(k,v){id=v;return b},
    then(ok,no){return ready.then(()=>{try{
      if(op==='select')return {data:JSON.parse(JSON.stringify(items)).sort((a,b)=>b.updated.localeCompare(a.updated)),error:null};
      if(op==='insert'){const arr=(Array.isArray(payload)?payload:[payload]).map(r=>({id:uuid(),kind:r.kind,data:r.data,updated:r.updated||new Date().toISOString()}));items.push(...arr);persist();return {data:single?arr[0]:arr,error:null}}
      if(op==='update'){const r=items.find(x=>x.id===id);if(!r)return {data:null,error:{message:'Dit item bestaat niet meer.'}};Object.assign(r,{data:payload.data,updated:payload.updated});persist();return {data:r,error:null}}
      if(op==='delete'){items=items.filter(x=>x.id!==id);persist();return {error:null}}
    }catch(e){return {data:null,error:{message:e.message}}}}).then(ok,no)}};return b}
  const blobToUrl=b=>new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(r.result);r.onerror=no;r.readAsDataURL(b)});
  async function shrink(blob){ // demo: kleinere foto's zodat ze in de browser passen
    const img=await new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=URL.createObjectURL(blob)});
    const k=Math.min(1,900/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);
    c.getContext('2d').drawImage(img,0,0,c.width,c.height);return c.toDataURL('image/jpeg',.75);
  }
  const demoUser={id:'demo',email:'demo@tuin-en-tafel'};
  window.supabase={createClient(){return {
    auth:{onAuthStateChange(cb){ready.then(()=>cb('INITIAL_SESSION',{user:demoUser}))},
      async signInWithPassword(){return {error:null}},async signOut(){},async updateUser(){return {error:null}},async resetPasswordForEmail(){return {error:null}}},
    from:q,
    storage:{from(){return {
      async upload(path,blob){try{photos[path]=await shrink(blob);if(!store(PKEY,photos)){delete photos[path];return {error:{message:'Het geheugen van deze browser is vol.'}}}return {error:null}}catch(e){return {error:{message:'Deze foto kon niet gelezen worden.'}}}},
      getPublicUrl(path){return {data:{publicUrl:photos[path]||''}}}}}},
    channel(){const c={on(){return c},subscribe(cb){setTimeout(()=>cb('SUBSCRIBED'),0);return c}};return c},removeChannel(){}
  }}};
  window.TT_CONFIG={supabaseUrl:'https://demo.local',supabaseKey:'demo'};
})();
