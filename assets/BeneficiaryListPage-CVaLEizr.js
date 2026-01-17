var Ce=s=>{throw TypeError(s)};var oe=(s,t,a)=>t.has(s)||Ce("Cannot "+a);var i=(s,t,a)=>(oe(s,t,"read from private field"),a?a.call(s):t.get(s)),T=(s,t,a)=>t.has(s)?Ce("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(s):t.set(s,a),v=(s,t,a,n)=>(oe(s,t,"write to private field"),n?n.call(s,a):t.set(s,a),a),N=(s,t,a)=>(oe(s,t,"access private method"),a);import{bk as ze,bl as Te,bm as $,bn as he,bo as q,bp as ue,bq as me,br as Re,bs as Qe,bt as re,bu as Be,bv as He,bw as Ee,bx as Oe,r as y,by as Pe,bz as Ve,k as Ae,j as e,l as We,o as Ye,a_ as Ke,b as Ge,d as Xe,A as le,a as Je,J as Ze,bA as qe,aK as et,X as tt,D as W,ar as st,p as at,U as ce,aN as it,bB as rt,bC as nt,P as lt,bD as ot,G as ct,bE as dt,E as ht,a9 as ut}from"./index-BOMQ6ZnB.js";var E,p,ee,R,U,Y,O,A,te,K,G,z,Q,M,X,f,Z,ge,pe,xe,fe,be,ye,ve,Me,Fe,mt=(Fe=class extends ze{constructor(t,a){super();T(this,f);T(this,E);T(this,p);T(this,ee);T(this,R);T(this,U);T(this,Y);T(this,O);T(this,A);T(this,te);T(this,K);T(this,G);T(this,z);T(this,Q);T(this,M);T(this,X,new Set);this.options=a,v(this,E,t),v(this,A,null),v(this,O,Te()),this.bindMethods(),this.setOptions(a)}bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){this.listeners.size===1&&(i(this,p).addObserver(this),ke(i(this,p),this.options)?N(this,f,Z).call(this):this.updateResult(),N(this,f,fe).call(this))}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return we(i(this,p),this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return we(i(this,p),this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,N(this,f,be).call(this),N(this,f,ye).call(this),i(this,p).removeObserver(this)}setOptions(t){const a=this.options,n=i(this,p);if(this.options=i(this,E).defaultQueryOptions(t),this.options.enabled!==void 0&&typeof this.options.enabled!="boolean"&&typeof this.options.enabled!="function"&&typeof $(this.options.enabled,i(this,p))!="boolean")throw new Error("Expected enabled to be a boolean or a callback that returns a boolean");N(this,f,ve).call(this),i(this,p).setOptions(this.options),a._defaulted&&!he(this.options,a)&&i(this,E).getQueryCache().notify({type:"observerOptionsUpdated",query:i(this,p),observer:this});const c=this.hasListeners();c&&De(i(this,p),n,this.options,a)&&N(this,f,Z).call(this),this.updateResult(),c&&(i(this,p)!==n||$(this.options.enabled,i(this,p))!==$(a.enabled,i(this,p))||q(this.options.staleTime,i(this,p))!==q(a.staleTime,i(this,p)))&&N(this,f,ge).call(this);const l=N(this,f,pe).call(this);c&&(i(this,p)!==n||$(this.options.enabled,i(this,p))!==$(a.enabled,i(this,p))||l!==i(this,M))&&N(this,f,xe).call(this,l)}getOptimisticResult(t){const a=i(this,E).getQueryCache().build(i(this,E),t),n=this.createResult(a,t);return pt(this,n)&&(v(this,R,n),v(this,Y,this.options),v(this,U,i(this,p).state)),n}getCurrentResult(){return i(this,R)}trackResult(t,a){return new Proxy(t,{get:(n,c)=>(this.trackProp(c),a==null||a(c),c==="promise"&&(this.trackProp("data"),!this.options.experimental_prefetchInRender&&i(this,O).status==="pending"&&i(this,O).reject(new Error("experimental_prefetchInRender feature flag is not enabled"))),Reflect.get(n,c))})}trackProp(t){i(this,X).add(t)}getCurrentQuery(){return i(this,p)}refetch({...t}={}){return this.fetch({...t})}fetchOptimistic(t){const a=i(this,E).defaultQueryOptions(t),n=i(this,E).getQueryCache().build(i(this,E),a);return n.fetch().then(()=>this.createResult(n,a))}fetch(t){return N(this,f,Z).call(this,{...t,cancelRefetch:t.cancelRefetch??!0}).then(()=>(this.updateResult(),i(this,R)))}createResult(t,a){var ae;const n=i(this,p),c=this.options,l=i(this,R),r=i(this,U),d=i(this,Y),h=t!==n?t.state:i(this,ee),{state:u}=t;let m={...u},g=!1,b;if(a._optimisticResults){const j=this.hasListeners(),L=!j&&ke(t,a),H=j&&De(t,n,a,c);(L||H)&&(m={...m,...He(u.data,t.options)}),a._optimisticResults==="isRestoring"&&(m.fetchStatus="idle")}let{error:k,errorUpdatedAt:I,status:S}=m;b=m.data;let B=!1;if(a.placeholderData!==void 0&&b===void 0&&S==="pending"){let j;l!=null&&l.isPlaceholderData&&a.placeholderData===(d==null?void 0:d.placeholderData)?(j=l.data,B=!0):j=typeof a.placeholderData=="function"?a.placeholderData((ae=i(this,G))==null?void 0:ae.state.data,i(this,G)):a.placeholderData,j!==void 0&&(S="success",b=Ee(l==null?void 0:l.data,j,a),g=!0)}if(a.select&&b!==void 0&&!B)if(l&&b===(r==null?void 0:r.data)&&a.select===i(this,te))b=i(this,K);else try{v(this,te,a.select),b=a.select(b),b=Ee(l==null?void 0:l.data,b,a),v(this,K,b),v(this,A,null)}catch(j){v(this,A,j)}i(this,A)&&(k=i(this,A),b=i(this,K),I=Date.now(),S="error");const J=m.fetchStatus==="fetching",D=S==="pending",P=S==="error",se=D&&J,_=b!==void 0,F={status:S,fetchStatus:m.fetchStatus,isPending:D,isSuccess:S==="success",isError:P,isInitialLoading:se,isLoading:se,data:b,dataUpdatedAt:m.dataUpdatedAt,error:k,errorUpdatedAt:I,failureCount:m.fetchFailureCount,failureReason:m.fetchFailureReason,errorUpdateCount:m.errorUpdateCount,isFetched:m.dataUpdateCount>0||m.errorUpdateCount>0,isFetchedAfterMount:m.dataUpdateCount>h.dataUpdateCount||m.errorUpdateCount>h.errorUpdateCount,isFetching:J,isRefetching:J&&!D,isLoadingError:P&&!_,isPaused:m.fetchStatus==="paused",isPlaceholderData:g,isRefetchError:P&&_,isStale:je(t,a),refetch:this.refetch,promise:i(this,O),isEnabled:$(a.enabled,t)!==!1};if(this.options.experimental_prefetchInRender){const j=F.data!==void 0,L=F.status==="error"&&!j,H=o=>{L?o.reject(F.error):j&&o.resolve(F.data)},ie=()=>{const o=v(this,O,F.promise=Te());H(o)},V=i(this,O);switch(V.status){case"pending":t.queryHash===n.queryHash&&H(V);break;case"fulfilled":(L||F.data!==V.value)&&ie();break;case"rejected":(!L||F.error!==V.reason)&&ie();break}}return F}updateResult(){const t=i(this,R),a=this.createResult(i(this,p),this.options);if(v(this,U,i(this,p).state),v(this,Y,this.options),i(this,U).data!==void 0&&v(this,G,i(this,p)),he(a,t))return;v(this,R,a);const n=()=>{if(!t)return!0;const{notifyOnChangeProps:c}=this.options,l=typeof c=="function"?c():c;if(l==="all"||!l&&!i(this,X).size)return!0;const r=new Set(l??i(this,X));return this.options.throwOnError&&r.add("error"),Object.keys(i(this,R)).some(d=>{const x=d;return i(this,R)[x]!==t[x]&&r.has(x)})};N(this,f,Me).call(this,{listeners:n()})}onQueryUpdate(){this.updateResult(),this.hasListeners()&&N(this,f,fe).call(this)}},E=new WeakMap,p=new WeakMap,ee=new WeakMap,R=new WeakMap,U=new WeakMap,Y=new WeakMap,O=new WeakMap,A=new WeakMap,te=new WeakMap,K=new WeakMap,G=new WeakMap,z=new WeakMap,Q=new WeakMap,M=new WeakMap,X=new WeakMap,f=new WeakSet,Z=function(t){N(this,f,ve).call(this);let a=i(this,p).fetch(this.options,t);return t!=null&&t.throwOnError||(a=a.catch(ue)),a},ge=function(){N(this,f,be).call(this);const t=q(this.options.staleTime,i(this,p));if(me||i(this,R).isStale||!Re(t))return;const n=Qe(i(this,R).dataUpdatedAt,t)+1;v(this,z,re.setTimeout(()=>{i(this,R).isStale||this.updateResult()},n))},pe=function(){return(typeof this.options.refetchInterval=="function"?this.options.refetchInterval(i(this,p)):this.options.refetchInterval)??!1},xe=function(t){N(this,f,ye).call(this),v(this,M,t),!(me||$(this.options.enabled,i(this,p))===!1||!Re(i(this,M))||i(this,M)===0)&&v(this,Q,re.setInterval(()=>{(this.options.refetchIntervalInBackground||Be.isFocused())&&N(this,f,Z).call(this)},i(this,M)))},fe=function(){N(this,f,ge).call(this),N(this,f,xe).call(this,N(this,f,pe).call(this))},be=function(){i(this,z)&&(re.clearTimeout(i(this,z)),v(this,z,void 0))},ye=function(){i(this,Q)&&(re.clearInterval(i(this,Q)),v(this,Q,void 0))},ve=function(){const t=i(this,E).getQueryCache().build(i(this,E),this.options);if(t===i(this,p))return;const a=i(this,p);v(this,p,t),v(this,ee,t.state),this.hasListeners()&&(a==null||a.removeObserver(this),t.addObserver(this))},Me=function(t){Oe.batch(()=>{t.listeners&&this.listeners.forEach(a=>{a(i(this,R))}),i(this,E).getQueryCache().notify({query:i(this,p),type:"observerResultsUpdated"})})},Fe);function gt(s,t){return $(t.enabled,s)!==!1&&s.state.data===void 0&&!(s.state.status==="error"&&t.retryOnMount===!1)}function ke(s,t){return gt(s,t)||s.state.data!==void 0&&we(s,t,t.refetchOnMount)}function we(s,t,a){if($(t.enabled,s)!==!1&&q(t.staleTime,s)!=="static"){const n=typeof a=="function"?a(s):a;return n==="always"||n!==!1&&je(s,t)}return!1}function De(s,t,a,n){return(s!==t||$(n.enabled,s)===!1)&&(!a.suspense||s.state.status!=="error")&&je(s,a)}function je(s,t){return $(t.enabled,s)!==!1&&s.isStaleByTime(q(t.staleTime,s))}function pt(s,t){return!he(s.getCurrentResult(),t)}var Le=y.createContext(!1),xt=()=>y.useContext(Le);Le.Provider;function ft(){let s=!1;return{clearReset:()=>{s=!1},reset:()=>{s=!0},isReset:()=>s}}var bt=y.createContext(ft()),yt=()=>y.useContext(bt),vt=(s,t,a)=>{const n=a!=null&&a.state.error&&typeof s.throwOnError=="function"?Pe(s.throwOnError,[a.state.error,a]):s.throwOnError;(s.suspense||s.experimental_prefetchInRender||n)&&(t.isReset()||(s.retryOnMount=!1))},wt=s=>{y.useEffect(()=>{s.clearReset()},[s])},jt=({result:s,errorResetBoundary:t,throwOnError:a,query:n,suspense:c})=>s.isError&&!t.isReset()&&!s.isFetching&&n&&(c&&s.data===void 0||Pe(a,[s.error,n])),Nt=s=>{if(s.suspense){const a=c=>c==="static"?c:Math.max(c??1e3,1e3),n=s.staleTime;s.staleTime=typeof n=="function"?(...c)=>a(n(...c)):a(n),typeof s.gcTime=="number"&&(s.gcTime=Math.max(s.gcTime,1e3))}},St=(s,t)=>s.isLoading&&s.isFetching&&!t,_t=(s,t)=>(s==null?void 0:s.suspense)&&t.isPending,$e=(s,t,a)=>t.fetchOptimistic(s).catch(()=>{a.clearReset()});function Ct(s,t,a){var g,b,k,I;const n=xt(),c=yt(),l=Ve(),r=l.defaultQueryOptions(s);(b=(g=l.getDefaultOptions().queries)==null?void 0:g._experimental_beforeQuery)==null||b.call(g,r);const d=l.getQueryCache().get(r.queryHash);r._optimisticResults=n?"isRestoring":"optimistic",Nt(r),vt(r,c,d),wt(c);const x=!l.getQueryCache().get(r.queryHash),[h]=y.useState(()=>new t(l,r)),u=h.getOptimisticResult(r),m=!n&&s.subscribed!==!1;if(y.useSyncExternalStore(y.useCallback(S=>{const B=m?h.subscribe(Oe.batchCalls(S)):ue;return h.updateResult(),B},[h,m]),()=>h.getCurrentResult(),()=>h.getCurrentResult()),y.useEffect(()=>{h.setOptions(r)},[r,h]),_t(r,u))throw $e(r,h,c);if(jt({result:u,errorResetBoundary:c,throwOnError:r.throwOnError,query:d,suspense:r.suspense}))throw u.error;if((I=(k=l.getDefaultOptions().queries)==null?void 0:k._experimental_afterQuery)==null||I.call(k,r,u),r.experimental_prefetchInRender&&!me&&St(u,n)){const S=x?$e(r,h,c):d==null?void 0:d.promise;S==null||S.catch(ue).finally(()=>{h.updateResult()})}return r.notifyOnChangeProps?u:h.trackResult(u)}function Tt(s,t){return Ct(s,mt)}const Rt=({id:s,name:t,age:a,room:n,wing:c,admission_date:l,status:r,ipc_status:d,latest_goal:x,avatar_url:h})=>{const u=Ae(),m={safe:"border-hrsd-green",monitor:"border-hrsd-gold",alert:"border-red-500"},g=b=>new Date(b).toLocaleDateString("ar-SA",{year:"numeric",month:"short",day:"numeric"});return e.jsxs("div",{onClick:()=>u(`/beneficiaries/${s}`),className:`hrsd-card cursor-pointer border-r-4 ${m[d]} hover-lift transition-all`,dir:"rtl",children:[e.jsxs("div",{className:"flex items-start justify-between mb-4",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"icon-container-lg bg-gradient-to-br from-hrsd-teal to-hrsd-teal-dark",children:h?e.jsx("img",{src:h,alt:t,className:"w-full h-full rounded-xl object-cover"}):e.jsx(We,{className:"w-6 h-6 text-white"})}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-hierarchy-card-title text-gray-900",children:t}),e.jsxs("p",{className:"text-hierarchy-small text-gray-500",children:[a," سنة"]})]})]}),e.jsx(Ye,{className:"w-5 h-5 text-gray-400"})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-3 mb-4",children:[e.jsxs("div",{className:"flex items-center gap-2 text-hierarchy-small text-gray-600",children:[e.jsx(Ke,{className:"w-4 h-4 text-hrsd-teal"}),e.jsxs("span",{children:[c," - غرفة ",n]})]}),e.jsxs("div",{className:"flex items-center gap-2 text-hierarchy-small text-gray-600",children:[e.jsx(Ge,{className:"w-4 h-4 text-hrsd-gold"}),e.jsx("span",{children:g(l)})]})]}),e.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[e.jsxs("span",{className:`badge-${r==="stable"?"success":r==="needs_attention"?"warning":"danger"}`,children:[e.jsx(Xe,{className:"w-3 h-3 ml-1"}),r==="stable"?"مستقر":r==="needs_attention"?"يحتاج متابعة":"حرج"]}),e.jsxs("span",{className:"badge-info",children:[e.jsx(le,{className:"w-3 h-3 ml-1"}),"IPC: ",d==="safe"?"آمن":d==="monitor"?"مراقبة":"تنبيه"]})]}),x&&e.jsxs("div",{className:"bg-hrsd-teal/5 rounded-lg p-2 flex items-start gap-2",children:[e.jsx(Je,{className:"w-4 h-4 text-hrsd-teal flex-shrink-0 mt-0.5"}),e.jsx("p",{className:"text-hierarchy-small text-gray-700 line-clamp-2",children:x})]})]})},Et=({onSearch:s,onFilterChange:t})=>{const[a,n]=y.useState(""),[c,l]=y.useState(!1),[r,d]=y.useState({wing:"all",health_status:"all",ipc_status:"all",empowerment_status:"all"}),x=g=>{const b=g.target.value;n(b),s(b)},h=(g,b)=>{const k={...r,[g]:b};d(k),t(k)},u=()=>{const g={wing:"all",health_status:"all",ipc_status:"all",empowerment_status:"all"};d(g),t(g)},m=Object.values(r).filter(g=>g!=="all").length;return e.jsxs("div",{className:"space-y-4",dir:"rtl",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsxs("div",{className:"flex-1 relative",children:[e.jsx(Ze,{className:"absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"}),e.jsx("input",{type:"text",value:a,onChange:x,placeholder:"ابحث عن مستفيد بالاسم...",className:"w-full pr-10 pl-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-hrsd-teal/50 focus:border-hrsd-teal text-hierarchy-body"})]}),e.jsxs("button",{onClick:()=>l(!c),className:`px-4 py-3 rounded-xl flex items-center gap-2 transition-colors ${c||m>0?"bg-hrsd-teal text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`,children:[e.jsx(qe,{className:"w-5 h-5"}),e.jsxs("span",{className:"text-hierarchy-small font-medium",children:["فلترة ",m>0&&`(${m})`]})]})]}),c&&e.jsxs("div",{className:"hrsd-card animate-slide-down",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsxs("h3",{className:"text-hierarchy-subheading text-gray-800 flex items-center gap-2",children:[e.jsx(et,{className:"w-5 h-5 text-hrsd-teal"}),"خيارات الفلترة"]}),m>0&&e.jsxs("button",{onClick:u,className:"text-hierarchy-small text-hrsd-orange hover:underline flex items-center gap-1",children:[e.jsx(tt,{className:"w-4 h-4"}),"مسح الفلاتر"]})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-hierarchy-label text-gray-600 block mb-2",children:"الجناح"}),e.jsxs("select",{value:r.wing,onChange:g=>h("wing",g.target.value),className:"w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-hrsd-teal/50 text-hierarchy-small",children:[e.jsx("option",{value:"all",children:"الكل"}),e.jsx("option",{value:"east",children:"الجناح الشرقي"}),e.jsx("option",{value:"west",children:"الجناح الغربي"}),e.jsx("option",{value:"north",children:"الجناح الشمالي"}),e.jsx("option",{value:"south",children:"الجناح الجنوبي"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-hierarchy-label text-gray-600 block mb-2",children:"الحالة الصحية"}),e.jsxs("select",{value:r.health_status,onChange:g=>h("health_status",g.target.value),className:"w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-hrsd-teal/50 text-hierarchy-small",children:[e.jsx("option",{value:"all",children:"الكل"}),e.jsx("option",{value:"stable",children:"مستقر"}),e.jsx("option",{value:"needs_attention",children:"يحتاج متابعة"}),e.jsx("option",{value:"critical",children:"حرج"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-hierarchy-label text-gray-600 block mb-2",children:"حالة IPC"}),e.jsxs("select",{value:r.ipc_status,onChange:g=>h("ipc_status",g.target.value),className:"w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-hrsd-teal/50 text-hierarchy-small",children:[e.jsx("option",{value:"all",children:"الكل"}),e.jsx("option",{value:"safe",children:"آمن"}),e.jsx("option",{value:"monitor",children:"مراقبة"}),e.jsx("option",{value:"alert",children:"تنبيه"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-hierarchy-label text-gray-600 block mb-2",children:"حالة التمكين"}),e.jsxs("select",{value:r.empowerment_status,onChange:g=>h("empowerment_status",g.target.value),className:"w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-hrsd-teal/50 text-hierarchy-small",children:[e.jsx("option",{value:"all",children:"الكل"}),e.jsx("option",{value:"active",children:"نشط"}),e.jsx("option",{value:"inactive",children:"غير نشط"})]})]})]})]})]})};function ne({className:s="",variant:t="rectangular",width:a,height:n,animate:c=!0}){const l="bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 bg-[length:200%_100%]",r={text:"h-4 rounded",circular:"rounded-full",rectangular:"rounded-lg",card:"rounded-xl"},d={width:a||(t==="text"?"100%":void 0),height:n||(t==="circular"?a:void 0)};return e.jsx(W.div,{className:`${l} ${r[t]} ${s}`,style:d,animate:c?{backgroundPosition:["200% 0","-200% 0"]}:void 0,transition:{duration:1.5,repeat:1/0,ease:"linear"}})}function kt({className:s=""}){return e.jsxs("div",{className:`bg-slate-800/50 rounded-xl p-4 border border-white/10 ${s}`,children:[e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx(ne,{variant:"circular",width:40,height:40}),e.jsxs("div",{className:"flex-1 space-y-2",children:[e.jsx(ne,{variant:"text",width:"60%"}),e.jsx(ne,{variant:"text",width:"40%"})]})]}),e.jsx("div",{className:"mt-4",children:e.jsx(ne,{variant:"rectangular",height:60})})]})}function Dt(){const[s,t]=y.useState(!1),a=y.useCallback((c={})=>{t(!0),setTimeout(()=>{window.print(),t(!1)},100)},[]),n=y.useCallback((c,l,r={})=>{t(!0);const{title:d="تقرير",subtitle:x,orientation:h="portrait"}=r,u=`
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>${d}</title>
    <style>
        @page { size: A4 ${h}; margin: 2cm; }
        * { box-sizing: border-box; }
        body {
            font-family: 'Cairo', 'Tajawal', 'Arial', sans-serif;
            direction: rtl;
            text-align: right;
            color: #1a1a1a;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 3px solid #148287;
            padding-bottom: 15px;
        }
        .logo-section {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin-bottom: 10px;
        }
        .title { font-size: 24px; font-weight: bold; color: #14415a; margin: 0; }
        .subtitle { font-size: 14px; color: #666; margin-top: 5px; }
        .timestamp { font-size: 12px; color: #888; margin-top: 5px; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th {
            background: linear-gradient(135deg, #148287 0%, #0d6567 100%);
            color: white;
            padding: 12px 15px;
            border: 1px solid #0d6567;
            font-weight: 600;
            font-size: 14px;
        }
        td {
            padding: 10px 15px;
            border: 1px solid #e0e0e0;
            font-size: 13px;
        }
        tr:nth-child(even) { background: #f8fafc; }
        tr:hover { background: #e8f4f8; }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 11px;
            color: #888;
            border-top: 1px solid #e0e0e0;
            padding-top: 15px;
        }
        .stats-row {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin: 15px 0;
            font-size: 13px;
        }
        .stat-item { color: #148287; font-weight: 600; }
        @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo-section">
            <h1 class="title">${d}</h1>
        </div>
        ${x?`<div class="subtitle">${x}</div>`:""}
        <div class="timestamp">تاريخ الطباعة: ${new Date().toLocaleDateString("ar-SA")} - ${new Date().toLocaleTimeString("ar-SA")}</div>
    </div>
    
    <div class="stats-row">
        <span class="stat-item">إجمالي السجلات: ${c.length}</span>
    </div>

    <table>
        <thead>
            <tr>
                ${l.map(g=>`<th>${g.header}</th>`).join("")}
            </tr>
        </thead>
        <tbody>
            ${c.map(g=>`
                <tr>
                    ${l.map(b=>`<td>${g[b.key]??"-"}</td>`).join("")}
                </tr>
            `).join("")}
        </tbody>
    </table>

    <div class="footer">
        نظام بصيرة - مركز التأهيل الشامل بمنطقة الباحة<br/>
        وزارة الموارد البشرية والتنمية الاجتماعية
    </div>

    <script>
        window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
        };
    <\/script>
</body>
</html>`,m=window.open("","_blank");m&&(m.document.write(u),m.document.close()),setTimeout(()=>t(!1),500)},[]);return{print:a,printTable:n,isPrinting:s}}function $t(s){const{filename:t,columns:a,data:n,title:c,includeTimestamp:l=!0}=s;let r="\uFEFF";c&&(r+=`"${c}"
`,l&&(r+=`"تاريخ التصدير: ${new Date().toLocaleDateString("ar-SA")}"
`),r+=`
`),r+=a.map(d=>`"${d.header}"`).join(",")+`
`,n.forEach(d=>{const x=a.map(h=>{let u=d[h.key];return h.format?u=h.format(u):h.type==="date"&&u?u=new Date(u).toLocaleDateString("ar-SA"):h.type==="boolean"&&(u=u?"نعم":"لا"),`"${String(u??"").replace(/"/g,'""')}"`});r+=x.join(",")+`
`}),Ue(r,`${t}.csv`,"text/csv;charset=utf-8")}function It(s){const{filename:t,columns:a,data:n,title:c,includeTimestamp:l=!0}=s;let r=`<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Styles>
    <Style ss:ID="Header">
        <Font ss:Bold="1" ss:Size="12"/>
        <Interior ss:Color="#148287" ss:Pattern="Solid"/>
        <Font ss:Color="#FFFFFF"/>
        <Alignment ss:Horizontal="Center" ss:ReadingOrder="RightToLeft"/>
    </Style>
    <Style ss:ID="Title">
        <Font ss:Bold="1" ss:Size="16"/>
        <Alignment ss:Horizontal="Center" ss:ReadingOrder="RightToLeft"/>
    </Style>
    <Style ss:ID="Data">
        <Alignment ss:Horizontal="Right" ss:ReadingOrder="RightToLeft"/>
    </Style>
</Styles>
<Worksheet ss:Name="البيانات">
<Table>`;const d=c?3:1;c&&(r+=`
<Row ss:Index="1">
    <Cell ss:MergeAcross="${a.length-1}" ss:StyleID="Title">
        <Data ss:Type="String">${de(c)}</Data>
    </Cell>
</Row>`,l&&(r+=`
<Row>
    <Cell ss:MergeAcross="${a.length-1}">
        <Data ss:Type="String">تاريخ التصدير: ${new Date().toLocaleDateString("ar-SA")}</Data>
    </Cell>
</Row>`)),r+=`
<Row ss:Index="${d}">`,a.forEach(x=>{r+=`
    <Cell ss:StyleID="Header">
        <Data ss:Type="String">${de(x.header)}</Data>
    </Cell>`}),r+=`
</Row>`,n.forEach((x,h)=>{r+=`
<Row ss:Index="${d+h+1}">`,a.forEach(u=>{let m=x[u.key],g="String";u.format?m=u.format(m):u.type==="date"&&m?m=new Date(m).toLocaleDateString("ar-SA"):u.type==="boolean"?m=m?"نعم":"لا":u.type==="number"&&typeof m=="number"&&(g="Number"),r+=`
    <Cell ss:StyleID="Data">
        <Data ss:Type="${g}">${de(String(m??""))}</Data>
    </Cell>`}),r+=`
</Row>`}),r+=`
</Table>
</Worksheet>
</Workbook>`,Ue(r,`${t}.xls`,"application/vnd.ms-excel")}function Ft(s){const{columns:t,data:a,title:n,includeTimestamp:c=!0,orientation:l="portrait"}=s,r=`
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>${n||"تقرير"}</title>
    <style>
        @page { size: A4 ${l}; margin: 2cm; }
        body {
            font-family: 'Cairo', 'Tajawal', 'Arial', sans-serif;
            direction: rtl;
            text-align: right;
            color: #1a1a1a;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #148287;
            padding-bottom: 15px;
        }
        .title { font-size: 24px; font-weight: bold; color: #14415a; }
        .timestamp { font-size: 12px; color: #666; margin-top: 5px; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        th {
            background: #148287;
            color: white;
            padding: 10px;
            border: 1px solid #0d6567;
            font-weight: bold;
        }
        td {
            padding: 8px 10px;
            border: 1px solid #ddd;
        }
        tr:nth-child(even) { background: #f8fafc; }
        tr:hover { background: #e8f4f8; }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 10px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="header">
        ${n?`<div class="title">${n}</div>`:""}
        ${c?`<div class="timestamp">تاريخ التصدير: ${new Date().toLocaleDateString("ar-SA")} ${new Date().toLocaleTimeString("ar-SA")}</div>`:""}
    </div>
    <table>
        <thead>
            <tr>
                ${t.map(x=>`<th>${x.header}</th>`).join("")}
            </tr>
        </thead>
        <tbody>
            ${a.map(x=>`
                <tr>
                    ${t.map(h=>{let u=x[h.key];return h.format?u=h.format(u):h.type==="date"&&u?u=new Date(u).toLocaleDateString("ar-SA"):h.type==="boolean"&&(u=u?"نعم":"لا"),`<td>${u??""}</td>`}).join("")}
                </tr>
            `).join("")}
        </tbody>
    </table>
    <div class="footer">
        نظام بصيرة - مركز التأهيل الشامل بالباحة
    </div>
    <script>window.print();<\/script>
</body>
</html>`,d=window.open("","_blank");d&&(d.document.write(r),d.document.close())}function de(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}function Ue(s,t,a){const n=new Blob([s],{type:a}),c=URL.createObjectURL(n),l=document.createElement("a");l.href=c,l.download=t,document.body.appendChild(l),l.click(),document.body.removeChild(l),URL.revokeObjectURL(c)}function Ot(){const[s,t]=y.useState(!1),a=y.useCallback((l,r,d={})=>{t(!0);try{const x={filename:d.filename||"export",title:d.title,subtitle:d.subtitle,columns:r,data:l,includeTimestamp:d.includeTimestamp??!0,orientation:d.orientation||"portrait"};It(x)}finally{setTimeout(()=>t(!1),500)}},[]),n=y.useCallback((l,r,d={})=>{t(!0);try{const x={filename:d.filename||"export",title:d.title,subtitle:d.subtitle,columns:r,data:l,includeTimestamp:d.includeTimestamp??!0,orientation:d.orientation||"portrait"};$t(x)}finally{setTimeout(()=>t(!1),500)}},[]),c=y.useCallback((l,r,d={})=>{t(!0);try{const x={filename:d.filename||"export",title:d.title,subtitle:d.subtitle,columns:r,data:l,includeTimestamp:d.includeTimestamp??!0,orientation:d.orientation||"portrait"};Ft(x)}finally{setTimeout(()=>t(!1),500)}},[]);return{exportToExcel:a,exportToCsv:n,exportToPdf:c,isExporting:s}}const Ie=[{key:"name",header:"الاسم"},{key:"age",header:"العمر",type:"number"},{key:"room",header:"رقم الغرفة"},{key:"wing",header:"الجناح"},{key:"status",header:"الحالة الصحية",format:s=>{switch(s){case"stable":return"مستقر";case"needs_attention":return"يحتاج متابعة";case"critical":return"حرج";default:return s||"-"}}},{key:"ipc_status",header:"حالة IPC",format:s=>{switch(s){case"safe":return"آمن";case"monitor":return"تحت المراقبة";case"alert":return"تنبيه";default:return s||"-"}}},{key:"admission_date",header:"تاريخ القبول",type:"date"}],Mt=()=>{const s=Ae(),[t,a]=y.useState("grid"),[n,c]=y.useState(""),[l,r]=y.useState({}),[d,x]=y.useState(!1),[h,u]=y.useState(new Set),{printTable:m,isPrinting:g}=Dt(),{exportToExcel:b,exportToCsv:k,isExporting:I}=Ot(),{showToast:S}=st(),B=[{id:"1",name:"عبدالله محمد المالكي",age:34,room:"101",wing:"east",admission_date:"2024-01-15",status:"stable",ipc_status:"safe",latest_goal:"تعلم الوضوء بشكل مستقل"},{id:"2",name:"فاطمة أحمد الغامدي",age:28,room:"102",wing:"east",admission_date:"2024-02-20",status:"needs_attention",ipc_status:"monitor",latest_goal:"المشاركة في الأنشطة الجماعية"},{id:"3",name:"محمد علي الزهراني",age:45,room:"105",wing:"west",admission_date:"2023-06-10",status:"stable",ipc_status:"safe",latest_goal:"تحسين مهارات التواصل"},{id:"4",name:"نورة سعيد العمري",age:31,room:"201",wing:"north",admission_date:"2024-03-05",status:"critical",ipc_status:"alert",latest_goal:"متابعة الحالة الصحية"},{id:"5",name:"سعيد خالد القحطاني",age:52,room:"202",wing:"north",admission_date:"2023-09-12",status:"stable",ipc_status:"safe",latest_goal:"الاعتماد على النفس في الأكل"},{id:"6",name:"خالد عبدالله الشهري",age:29,room:"301",wing:"south",admission_date:"2024-01-28",status:"needs_attention",ipc_status:"monitor",latest_goal:"تقليل السلوكيات العدوانية"},{id:"7",name:"مريم ناصر البيشي",age:35,room:"302",wing:"south",admission_date:"2023-11-03",status:"stable",ipc_status:"safe",latest_goal:"تحسين النوم الليلي"},{id:"8",name:"أحمد يوسف الحارثي",age:41,room:"103",wing:"east",admission_date:"2024-04-10",status:"stable",ipc_status:"safe",latest_goal:"المشي بدون مساعدة"},{id:"9",name:"سارة محمد العتيبي",age:26,room:"203",wing:"north",admission_date:"2024-02-14",status:"stable",ipc_status:"safe",latest_goal:"تعلم القراءة الأساسية"},{id:"10",name:"علي حسن الدوسري",age:38,room:"104",wing:"east",admission_date:"2023-08-22",status:"needs_attention",ipc_status:"monitor",latest_goal:"إدارة نوبات القلق"},{id:"11",name:"هند عبدالرحمن السلمي",age:33,room:"303",wing:"south",admission_date:"2024-03-18",status:"stable",ipc_status:"safe",latest_goal:"تحسين التفاعل الاجتماعي"},{id:"12",name:"عمر فهد المطيري",age:47,room:"106",wing:"west",admission_date:"2023-05-07",status:"stable",ipc_status:"safe",latest_goal:"الحفاظ على الوزن المثالي"}],J=o=>{if(!o)return 0;const w=new Date,C=new Date(o);let Se=w.getFullYear()-C.getFullYear();const _e=w.getMonth()-C.getMonth();return(_e<0||_e===0&&w.getDate()<C.getDate())&&Se--,Se},{data:D=[],isLoading:P,refetch:se}=Tt({queryKey:["beneficiaries","list"],queryFn:async()=>{const{data:o,error:w}=await ut.from("beneficiaries").select("*").order("full_name",{ascending:!0});return w||!o||o.length===0?B:o.map(C=>({id:C.id,name:C.full_name||C.name||"غير معروف",age:C.age||J(C.date_of_birth),room:C.room_number||"N/A",wing:C.wing||"east",admission_date:C.admission_date||C.created_at,status:C.health_status||"stable",ipc_status:C.ipc_status||"safe",latest_goal:C.latest_goal,avatar_url:C.avatar_url}))},staleTime:300*1e3}),_=y.useMemo(()=>{let o=[...D];return n&&(o=o.filter(w=>w.name.toLowerCase().includes(n.toLowerCase()))),l.wing&&l.wing!=="all"&&(o=o.filter(w=>w.wing===l.wing)),l.health_status&&l.health_status!=="all"&&(o=o.filter(w=>w.status===l.health_status)),l.ipc_status&&l.ipc_status!=="all"&&(o=o.filter(w=>w.ipc_status===l.ipc_status)),o},[D,n,l]),Ne=o=>{c(o)},F=o=>{r(o)},ae=o=>({east:"الشرقي",west:"الغربي",north:"الشمالي",south:"الجنوبي"})[o]||o,j={total:D.length,stable:D.filter(o=>o.status==="stable").length,needsAttention:D.filter(o=>o.status==="needs_attention").length,critical:D.filter(o=>o.status==="critical").length},L=()=>{const o=h.size>0?_.filter(w=>h.has(w.id)):_;m(o,[{key:"name",header:"الاسم"},{key:"age",header:"العمر"},{key:"room",header:"الغرفة"},{key:"wing",header:"الجناح"},{key:"status",header:"الحالة"}],{title:"قائمة المستفيدين",subtitle:`مركز التأهيل الشامل بالباحة - ${new Date().toLocaleDateString("ar-SA")}`}),S("جاري فتح نافذة الطباعة...","info")},H=()=>{const o=h.size>0?_.filter(w=>h.has(w.id)):_;b(o,Ie,{filename:"قائمة_المستفيدين",title:"قائمة المستفيدين - مركز التأهيل الشامل بالباحة"}),S(`تم تصدير ${o.length} سجل إلى Excel`,"success")},ie=()=>{const o=h.size>0?_.filter(w=>h.has(w.id)):_;k(o,Ie,{filename:"قائمة_المستفيدين",title:"قائمة المستفيدين"}),S(`تم تصدير ${o.length} سجل إلى CSV`,"success")},V=()=>{h.size===_.length?(u(new Set),S("تم إلغاء تحديد الكل","info")):(u(new Set(_.map(o=>o.id))),S(`تم تحديد ${_.length} مستفيد`,"info"))};return e.jsxs("div",{className:"min-h-screen bg-gray-50 p-6",dir:"rtl",children:[e.jsxs("div",{className:"mb-6",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("button",{onClick:()=>s(-1),className:"p-2 hover:bg-gray-100 rounded-lg",children:e.jsx(at,{className:"w-5 h-5"})}),e.jsx("div",{className:"p-3 bg-gradient-to-br from-hrsd-teal to-hrsd-navy rounded-xl",children:e.jsx(ce,{className:"w-8 h-8 text-white"})}),e.jsxs("div",{children:[e.jsx("h1",{className:"text-hierarchy-title text-gray-900",children:"قائمة المستفيدين"}),e.jsxs("p",{className:"text-hierarchy-small text-gray-500",children:["إجمالي ",j.total," مستفيد • ",j.stable," مستقر • ",j.needsAttention," يحتاج متابعة • ",j.critical," حرج"]})]})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:()=>se(),className:"p-2 hover:bg-gray-100 rounded-lg text-gray-600",title:"تحديث",children:e.jsx(it,{className:`w-5 h-5 ${P?"animate-spin":""}`})}),e.jsxs("div",{className:"flex bg-gray-100 rounded-lg p-1",children:[e.jsx("button",{onClick:()=>a("grid"),className:`p-2 rounded ${t==="grid"?"bg-white shadow-sm":""}`,children:e.jsx(rt,{className:"w-5 h-5"})}),e.jsx("button",{onClick:()=>a("list"),className:`p-2 rounded ${t==="list"?"bg-white shadow-sm":""}`,children:e.jsx(nt,{className:"w-5 h-5"})})]}),e.jsxs("button",{onClick:()=>s("/beneficiaries/new"),className:"px-4 py-2 bg-hrsd-teal text-white rounded-lg flex items-center gap-2 hover:bg-hrsd-teal-dark transition-colors",children:[e.jsx(lt,{className:"w-5 h-5"}),e.jsx("span",{className:"hidden md:inline",children:"إضافة مستفيد"})]})]})]}),e.jsxs("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-3 mb-6",children:[e.jsx("div",{className:"hrsd-card-stat border-l-hrsd-teal",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(ce,{className:"w-6 h-6 text-hrsd-teal"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-2xl font-bold text-gray-900",children:j.total}),e.jsx("p",{className:"text-hierarchy-label text-gray-500",children:"إجمالي"})]})]})}),e.jsx("div",{className:"hrsd-card-stat border-l-hrsd-green",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(le,{className:"w-6 h-6 text-hrsd-green"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-2xl font-bold text-hrsd-green",children:j.stable}),e.jsx("p",{className:"text-hierarchy-label text-gray-500",children:"مستقر"})]})]})}),e.jsx("div",{className:"hrsd-card-stat border-l-hrsd-gold",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(le,{className:"w-6 h-6 text-hrsd-gold"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-2xl font-bold text-hrsd-gold",children:j.needsAttention}),e.jsx("p",{className:"text-hierarchy-label text-gray-500",children:"متابعة"})]})]})}),e.jsx("div",{className:"hrsd-card-stat border-l-red-500",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(le,{className:"w-6 h-6 text-red-600"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-2xl font-bold text-red-600",children:j.critical}),e.jsx("p",{className:"text-hierarchy-label text-gray-500",children:"حرج"})]})]})})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-3 mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100",children:[h.size>0&&e.jsxs(W.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},className:"px-3 py-1.5 bg-hrsd-teal/10 text-hrsd-teal rounded-lg text-sm font-medium",children:[h.size," محدد"]}),e.jsxs(W.button,{whileHover:{scale:1.02},whileTap:{scale:.98},onClick:V,className:"flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors","aria-label":"تحديد الكل",children:[e.jsx(ot,{className:"w-4 h-4"}),e.jsx("span",{className:"hidden sm:inline",children:h.size===_.length?"إلغاء التحديد":"تحديد الكل"})]}),e.jsx("div",{className:"h-6 w-px bg-gray-200 hidden sm:block"}),e.jsxs(W.button,{whileHover:{scale:1.02},whileTap:{scale:.98},onClick:L,disabled:g,className:"flex items-center gap-2 px-4 py-2 bg-hrsd-teal hover:bg-hrsd-teal-dark text-white rounded-lg transition-colors disabled:opacity-50","aria-label":"طباعة قائمة المستفيدين",children:[e.jsx(ct,{className:`w-4 h-4 ${g?"animate-pulse":""}`}),e.jsx("span",{className:"hidden sm:inline",children:"طباعة"})]}),e.jsxs(W.button,{whileHover:{scale:1.02},whileTap:{scale:.98},onClick:H,disabled:I,className:"flex items-center gap-2 px-4 py-2 bg-hrsd-green hover:bg-hrsd-green-dark text-white rounded-lg transition-colors disabled:opacity-50","aria-label":"تصدير إلى Excel",children:[e.jsx(dt,{className:`w-4 h-4 ${I?"animate-pulse":""}`}),e.jsx("span",{className:"hidden sm:inline",children:"Excel"})]}),e.jsxs(W.button,{whileHover:{scale:1.02},whileTap:{scale:.98},onClick:ie,disabled:I,className:"flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50","aria-label":"تصدير إلى CSV",children:[e.jsx(ht,{className:`w-4 h-4 ${I?"animate-pulse":""}`}),e.jsx("span",{className:"hidden sm:inline",children:"CSV"})]}),e.jsx("div",{className:"flex-1 text-left",children:e.jsxs("p",{className:"text-hierarchy-small text-gray-500",children:["عرض ",_.length," من أصل ",D.length]})})]}),e.jsx(Et,{onSearch:Ne,onFilterChange:F})]}),P&&e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",children:Array.from({length:6}).map((o,w)=>e.jsx("div",{children:e.jsx(kt,{})},w))}),!P&&_.length===0&&e.jsxs("div",{className:"text-center py-12",children:[e.jsx(ce,{className:"w-16 h-16 text-gray-300 mx-auto mb-4"}),e.jsx("h3",{className:"text-hierarchy-heading text-gray-500 mb-2",children:"لا توجد نتائج"}),e.jsx("p",{className:"text-hierarchy-small text-gray-400",children:"جرب تعديل معايير البحث أو الفلترة"})]}),!P&&_.length>0&&e.jsx("div",{className:t==="grid"?"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4":"space-y-3",children:_.map(o=>e.jsx(Rt,{id:o.id,name:o.name,age:o.age,room:o.room,wing:ae(o.wing),admission_date:o.admission_date,status:o.status,ipc_status:o.ipc_status,latest_goal:o.latest_goal,avatar_url:o.avatar_url},o.id))})]})};export{Mt as BeneficiaryListPage,Mt as default};
