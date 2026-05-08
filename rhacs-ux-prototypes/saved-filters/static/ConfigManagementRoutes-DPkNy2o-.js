import{d2 as C,q as D,f5 as j,t as e,fp as xn,a8 as U,aY as gs,ah as Xe,fq as xs,f8 as B,fr as yn,b0 as Re,fj as cs,f4 as Nn,e$ as bn,fs as jn,aa as Sn,ck as En,A as be,ft as pt,af as Tn,fd as Rn,fu as yt,fv as Nt,fw as vn,fx as Pn,eW as te,fl as bt,cp as jt,aj as An,ak as $n,f6 as St,fy as In,d7 as ee,fe as Et,fz as Tt,cx as wn,fA as Rt,fB as On,fC as Ln,dD as Un,ej as qn,fD as Dn,dc as We,fE as ys,fi as kn,fF as vt,fG as Pt,fk as Ns,ex as Mn,c8 as Fn,c9 as _}from"./index-CWMzBAx8.js";import{r as I,R as us,g as q,u as At}from"./apollo-BxVF6eGb.js";import{s as G,w as De}from"./URLSearchInputWithAutocomplete-C3rkVCE9.js";import{E as $t,D as It,e as ne,m as ds,T as _n,B as Yn,a as Vn,L as ms,c as ps,P as Qe,d as Te,i as Ve,n as He,b as me,p as pe,r as Ge,s as Le,f as Ue,g as Be,h as Hn,j as Gn,k as wt,C as V,M as je,l as Bn,o as Ct,q as Ot,t as Qn,u as Wn,v as Cs,w as Lt,S as Ut,G as Kn}from"./GroupedTabs-BXSO2bMh.js";import{E as bs,d as z,u as zn,a as Jn,S as Xn,C as Zn,B as js,f as ea,e as sa}from"./ControlDetails-DoONFeql.js";import{u as k,U as b,g as H,W as Y,S as qt,b as ta,G as na,a as aa,X as ra,c as oa,M as la,L as ia,Y as ca,e as Ke,i as ae,o as Dt,f as Ss,T as O,p as he,q as fe,r as ge,s as xe,P as kt,t as ua}from"./URLSearchInput-DIvUMuib.js";import{q as w,T as Ze,d as x,a as $,n as M,D as da,b as ma,I as pa,c as Ca,P as ha,K as fa,S as ga,e as xa,f as ya}from"./queryService-qiOEr9e5.js";import{s as Pe,a as ht,p as Na}from"./policy.proto-UGifO4do.js";import{g as ba}from"./mathUtils-DiJFKe7q.js";import{s as Ce}from"./standards-YCR5CiAc.js";import{N as Z,P as Es,b as Ts,c as Mt,d as Rs,e as vs,f as Ft,h as _t,C as ja,g as Sa}from"./search-DdRoLztp.js";import{s as Yt}from"./startCase-BmKLVvlc.js";import{r as es}from"./object-resolve-path-esx_DSkd.js";import{s as hs,a as Ea,b as Vt,c as Ta}from"./sorters-DROgS-i8.js";import{P as Ra}from"./PolicyDisabledIconText-CPn2g_ei.js";import{P as ss,f as Ps}from"./policies.utils-z8K8-9tw.js";import{C as va}from"./CloseButton-Bim0_59Z.js";import{c as Pa}from"./controls-CFAE8uc8.js";import{A as Aa}from"./_baseGt-BXjOiyok.js";import"./react-pF2EnNv3.js";import"./lodash-JMWJiBov.js";import"./searchOptionsToQuery-Q3UHmnOv.js";import"./react-onclickoutside.es-BACqhh1p.js";import"./react-popper-BVwGFJ5c.js";import"./popper-U5NbITwx.js";import"./index-X9M4JFpN.js";import"./Progress-DsFjF_di.js";import"./times-circle-icon-CbqRSoLY.js";import"./d3-D72bN1z7.js";import"./check-circle-BiPh7iC3.js";import"./_createCompounder-ByF_0BsA.js";import"./omit-DESQLnav.js";import"./_flatRest-DBOPrESc.js";import"./TableCellValue-DVVUiYyw.js";import"./set-5d5QwYr_.js";import"./_baseSet-C2DSniPF.js";function fs(){return fs=Object.assign||function(s){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var o in a)Object.prototype.hasOwnProperty.call(a,o)&&(s[o]=a[o])}return s},fs.apply(this,arguments)}function $a(s,t){if(s==null)return{};var a=Ia(s,t),o,n;if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(s);for(n=0;n<r.length;n++)o=r[n],!(t.indexOf(o)>=0)&&Object.prototype.propertyIsEnumerable.call(s,o)&&(a[o]=s[o])}return a}function Ia(s,t){if(s==null)return{};var a={},o=Object.keys(s),n,r;for(r=0;r<o.length;r++)n=o[r],!(t.indexOf(n)>=0)&&(a[n]=s[n]);return a}var As=I.forwardRef(function(s,t){var a=s.color,o=a===void 0?"currentColor":a,n=s.size,r=n===void 0?24:n,l=$a(s,["color","size"]);return us.createElement("svg",fs({ref:t,xmlns:"http://www.w3.org/2000/svg",width:r,height:r,viewBox:"0 0 24 24",fill:"none",stroke:o,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},l),us.createElement("line",{x1:"5",y1:"12",x2:"19",y2:"12"}),us.createElement("polyline",{points:"12 5 19 12 12 19"}))});As.propTypes={color:C.string,size:C.oneOfType([C.string,C.number])};As.displayName="ArrowRight";const wa=q`
    query numPolicies($query: String) {
        policyCount(query: $query)
    }
`,Oa=()=>{const s=k(),t=D(),a=b.getURL(s,t).base(j.POLICY).url();return e.jsx(H,{query:wa,variables:{query:w.objectToWhereClause({"Lifecycle Stage":"DEPLOY"})},children:({loading:o,data:n})=>{const r=(n==null?void 0:n.policyCount)||0;return e.jsx($t,{count:r,entityType:j.POLICY,url:a,loading:o,position:"first",short:!0})}})},La=q`
    query numCISControls {
        executedControlCount(query: "Standard: CIS")
    }
`,Ua=()=>{const{loading:s,error:t,data:a}=At(La);t&&xn(t);const o=k(),n=D(),r=b.getURL(o,n).base(j.CONTROL).url(),l=(a==null?void 0:a.executedControlCount)||0;return e.jsx($t,{count:l,entityType:j.CONTROL,url:r,loading:s,position:"middle",short:!0})},qa=s=>U(ne[s]),Da=(s,t)=>t.map(a=>({label:qa(a),link:s.base(a).url()})),ka=()=>{const s=[j.CLUSTER,j.NAMESPACE,j.NODE,j.DEPLOYMENT,j.IMAGE,j.SECRET],t=k(),a=D(),o=b.getURL(t,a),n=Da(o,s);return e.jsx(It,{text:"Application & Infrastructure",options:n})},Ma=s=>U(ne[s]),Fa=(s,t)=>t.map(a=>({label:Ma(a),link:s.base(a).url()})),_a=()=>{const s=[j.SUBJECT,j.SERVICE_ACCOUNT,j.ROLE],t=k(),a=D(),o=b.getURL(t,a),n=Fa(o,s);return e.jsx(It,{text:"Role-Based Access Control",options:n})},Ht=({isExporting:s,setIsExporting:t})=>{const{hasReadAccess:a}=gs(),o=a("WorkflowAdministration"),n=a("Compliance");return e.jsxs("div",{className:"flex flex-1 justify-end",children:[e.jsxs("div",{className:"border-base-400 border-r-2 mr-1 flex ",children:[o&&e.jsx(Oa,{}),n&&e.jsx(Ua,{}),e.jsx("div",{className:"flex w-32 mr-2",children:e.jsx(ka,{})}),e.jsx("div",{className:"flex w-32 mr-3 ",children:e.jsx(_a,{})})]}),e.jsx("div",{className:"flex items-center self-center",children:e.jsx(bs,{fileName:"Config Management Dashboard Report",type:null,page:Xe.CONFIG_MANAGEMENT,pdfId:"capture-dashboard",isExporting:s,setIsExporting:t})})]})};Ht.propTypes={isExporting:C.bool.isRequired,setIsExporting:C.func.isRequired};const $s={READY:7},Ya=Na.map(s=>({title:yn[s],color:xs[s]})),Gt="var(--base-400)",Oe={PASS:"Pass",FAIL:"Fail"},Va=q`
    query policyViolationsBySeverity($query: String) {
        policies(query: $query) {
            id
            name
            categories
            severity
            disabled
            description
            lifecycleStages
            policyStatus
        }
    }
`;function Ha(s,t){const a=ds(t[s].filter(n=>!n.passing).map(n=>ht[n.severity])),o=Object.entries(ht).find(n=>n[1]===a);return o?xs[o[0]]:Gt}const Ga=()=>{const s=k(),t=D(),a=I.useContext(G),o=i=>!i||!i.policies||!i.policies.length?[]:i.policies;function n(i){const u=i.reduce((c,d)=>{const{categories:m,severity:p,name:h}=d,f=d.policyStatus.toLowerCase()===Oe.PASS.toLowerCase(),g={...c};return m.forEach((y,N)=>{g[y]||(g[y]=[]);const S=f?Gt:xs[p],P=f?null:{[a]:{[z.POLICY_STATUS.CATEGORY]:Oe.FAIL}},R=b.getURL(s,t).base(j.POLICY,d.id).push(j.DEPLOYMENT).query(P).url(),A=N>0?`${N}. ${h}`:h;g[y].push({severity:p,passing:f,color:S,value:0,labelColor:S,name:`${f?"":"View deployments violating"} "${A}"`,link:R})}),g},{});return Object.entries(u).map(c=>{const d=c[0],m=c[1],p=m.filter(y=>y.passing).length,h=`${m.length-p}/${m.length} policies violated`,f=ba(p,m.length),g=Ha(d,u);return{name:d,children:m,value:f,labelValue:h,color:g}})}function r(i){return i.filter(c=>c.policyStatus.toLowerCase()==="fail").length}function l(i){const u=i.filter(N=>N.policyStatus==="fail");function c(N){return u.filter(S=>S.severity===N).length}const d=c(Pe.CRITICAL_SEVERITY),m=c(Pe.HIGH_SEVERITY),p=c(Pe.MEDIUM_SEVERITY),h=c(Pe.LOW_SEVERITY),f=i.filter(N=>!N.disabled).length-u.length,g=[],y=b.getURL(s,t).base(j.POLICY);return d&&g.push({text:`${d} rated as critical`,link:y.query({[a]:{Severity:Pe.CRITICAL_SEVERITY,[z.POLICY_STATUS.CATEGORY]:Oe.FAIL}}).url()}),y.query(null),m&&g.push({text:`${m} rated as high`,link:y.query({[a]:{Severity:Pe.HIGH_SEVERITY,Disabled:"False",[z.POLICY_STATUS.CATEGORY]:Oe.FAIL}}).url()}),y.query(null),p&&g.push({text:`${p} rated as medium`,link:y.query({[a]:{Severity:Pe.MEDIUM_SEVERITY,Disabled:"False",[z.POLICY_STATUS.CATEGORY]:Oe.FAIL}}).url()}),y.query(null),h&&g.push({text:`${h} rated as low`,link:y.query({[a]:{Severity:Pe.LOW_SEVERITY,Disabled:"False",[z.POLICY_STATUS.CATEGORY]:Oe.FAIL}}).url()}),y.query(null),f&&g.push({text:`${f} policies without violations`,link:y.query({[a]:{Disabled:"False",[z.POLICY_STATUS.CATEGORY]:Oe.PASS}}).url()}),g}return e.jsx(H,{query:Va,fetchPolicy:"network-only",variables:{query:"LifeCycle Stage:DEPLOY"},children:({loading:i,data:u,networkStatus:c})=>{let d=e.jsx(B,{}),m=null;if(!i&&u&&c===$s.READY){const p=o(u),h=n(p),f=r(p),g=l(p),y=b.getURL(s,t).base(j.POLICY).url();m=e.jsx(Re,{to:y,className:"no-underline btn-sm btn-base",children:"View all"}),h.length?d=e.jsx(qt,{data:h,rootData:g,legendData:Ya,totalValue:f,units:"value"}):d=e.jsx("div",{className:"flex flex-1 items-center justify-center p-4 leading-loose",children:"No data available."})}return e.jsx(Y,{className:"s-2 pdf-page",header:"Policy violations by severity",headerComponents:m,children:d})}})},J={PASS:"Pass",FAIL:"Fail","N/A":"N/A"},Bt=bn,Qt=jn,Wt="var(--base-400)",Ba=[{title:"Passing",color:Bt},{title:"Failing",color:Qt},{title:"N/A",color:Wt}],Kt=q`
    query complianceByControls(
        $groupBy: [ComplianceAggregation_Scope!]
        $unit: ComplianceAggregation_Scope!
        $where: String
    ) {
        aggregatedResults(groupBy: $groupBy, unit: $unit, where: $where) {
            results {
                aggregationKeys {
                    id
                    scope
                }
                numFailing
                numPassing
                numSkipped
                keys {
                    ... on ComplianceControlGroup {
                        id
                        name
                        description
                    }
                    ... on ComplianceControl {
                        id
                        name
                        description
                    }
                }
            }
        }
    }
`,ze=(s,t)=>s===0&&t===0?0:Math.floor(s/(s+t)*100),Qa=s=>s.aggregatedResults.results.reduce((a,o)=>{const{numPassing:n,numFailing:r}=o,[l,i]=o.keys;return a[l.id]?a[l.id].controls=[...a[l.id].controls,{control:i,numPassing:n,numFailing:r}]:a[l.id]={category:l,controls:[{control:i,numPassing:n,numFailing:r}]},a},{}),ft=(s,t)=>!s&&!t?Wt:t?Qt:Bt,Wa=(s,t,a,o)=>Object.keys(s).map(l=>{const{category:i,controls:u}=s[l],{totalPassing:c,totalFailing:d}=u.reduce((p,h)=>(p.totalPassing+=h.numPassing,p.totalFailing+=h.numFailing,p),{totalPassing:0,totalFailing:0}),m=ze(c,d);return{name:`${i.name}. ${i.description}`,color:ft(c,d),value:m,children:u.map(({control:p,numPassing:h,numFailing:f})=>{const g=ze(h,f),y=t.base(j.CONTROL).push(p.id).query({[a]:{standard:Ce[o],"Compliance State":void 0}}).url();return{name:`${p.name} - ${p.description}`,color:ft(h,f),value:g,link:y}})}}),Ka=s=>s.aggregatedResults.results.reduce((a,o)=>{const{numPassing:n,numFailing:r}=o;return ze(n,r)===100?a.controlsPassing+=1:!n&&!r?a.controlsNA+=1:a.controlsFailing+=1,a},{controlsPassing:0,controlsFailing:0,controlsNA:0}),za=(s,t,a,o,n,r)=>{const l=o.base(j.CONTROL).query({[r]:{standard:Ce[n],"Compliance State":J.PASS}}).url(),i=o.base(j.CONTROL).query({[r]:{standard:Ce[n],"Compliance State":J.FAIL}}).url(),u=o.base(j.CONTROL).query({[r]:{standard:Ce[n],"Compliance State":J["N/A"]}}).url();return[{text:`${s} Controls Passing`,link:l},{text:`${t} Controls Failing`,link:i},{text:`${a} Controls N/A`,link:u}]},Ja=(s,t,a,o)=>{const n=Qa(s),{controlsPassing:r,controlsFailing:l,controlsNA:i}=Ka(s),u=za(r,l,i,t,a,o);return{sunburstData:Wa(n,t,o,a),sunburstRootData:u,totalPassing:ze(r,l)}},Xa=({standardType:s,searchParam:t,urlBuilder:a})=>{const o=a.base(j.CONTROL).query({[t]:{standard:Ce[s],groupBy:j.CATEGORY}}).url();return e.jsx(Re,{to:o,className:"no-underline btn-sm btn-base",children:"View standard"})},Za=[Kt],Is=({className:s,standardOptions:t})=>{const{hasReadWriteAccess:a}=gs(),o=a("Compliance"),{runs:n,error:r,restartPolling:l,inProgressScanDetected:i,isCurrentScanIncomplete:u}=zn(Za),c=I.useContext(G),d=t.map(N=>({label:Ce[N],jsonpath:Ce[N],value:Ce[N],standard:N})),[m,p]=I.useState(d[0]),h=D(),f=k();function g(N){const S=d.find(P=>P.value===N);p(S)}const y={groupBy:[cs.CATEGORY,cs.CONTROL],unit:cs.CONTROL,where:w.objectToWhereClause({Standard:m.value})};return e.jsx(Jn,{query:Kt,variables:y,children:({data:N,networkStatus:S})=>{const P=e.jsx(_n,{value:m.value,onChange:g,options:d}),R=e.jsxs("div",{className:"flex",children:[o&&e.jsx(Xn,{className:"btn-sm btn-base mr-2",text:"Scan",textClass:"hidden lg:block",textCondensed:`Scan ${Nn[m.standard]}`,clusterId:"*",standardId:m.standard,loaderSize:10,onScanTriggered:l,scanInProgress:u},m.standard),e.jsx(Xa,{urlBuilder:b.getURL(f,h),standardType:m.standard,searchParam:c})]});let A=e.jsx(B,{});if(N&&S===$s.READY)if(N.aggregatedResults.results.length){const{sunburstData:T,sunburstRootData:E,totalPassing:v}=Ja(N,b.getURL(f,h),m.standard,c);A=e.jsx(qt,{data:T,rootData:E,legendData:Ba,totalValue:v},m.value)}else A=e.jsx(Z,{message:"No data available. Please run a scan."});return u&&(A=e.jsxs("div",{className:"flex-1",children:[r&&e.jsx(Sn,{variant:"danger",title:"There was an error fetching compliance scan status, data below may be out of date",component:"p",children:En(r)}),i&&!r&&e.jsx(Zn,{runs:n,isFullHeight:!0})]})),e.jsx(Y,{className:`s-2 ${s}`,id:"compliance-by-controls",titleComponents:P,headerComponents:R,children:A})}})};Is.propTypes={className:C.string,standardOptions:C.arrayOf(C.shape).isRequired};Is.defaultProps={className:""};const zt=({data:s})=>{const t=be();function a(){const c=s.length<5?1:5,d=s.map(h=>h.x),m=Math.round(ds(d)/c)*c,p=[];for(let h=0;h<=m+c;h+=c)p.push(h);return p}const o=a();function n(c){return Math.round(c)}function r(){return s.map((c,d)=>({link:c.link,x:null,y:c.y,yOffset:-25,xOffset:10,label:` ${d+1}. ${c.y}`}))}function l(c){c.link&&t(c.link)}const i=r(),u=[...s];return e.jsx("div",{className:"relative chart-container w-full horizontal-bar-responsive",children:e.jsxs(ta,{height:350,yType:"category",yRange:s.map((c,d)=>(d+1)*41).concat([0]),margin:{top:33.3,left:7},stackBy:"x",xDomain:[0,ds(o)],children:[e.jsx(na,{children:e.jsx(Yn,{})}),e.jsx(aa,{tickValues:o}),e.jsx(ra,{orientation:"top",tickSize:0,tickValues:o,tickFormat:n}),e.jsx(oa,{data:s,style:{height:3,rx:"2px",cursor:"pointer"},color:"url(#horizontalGradient)",onValueClick:l,stack:!0}),e.jsx(la,{data:u,marginTop:"17",color:"#BDF3FF",onValueClick:l}),e.jsx(ia,{data:i,labelAnchorX:"start-alignment",labelAnchorY:"baseline",onValueClick:l,style:{fill:"var(--pf-t--global--text--color--link--default)",cursor:"pointer",transform:"translate(15px,35px)"}}),e.jsx(ca,{tickSize:0,top:26,className:"text-xs"})]})})};zt.propTypes={data:C.arrayOf(C.shape({})).isRequired};const er=q`
    query usersWithClusterAdminRoles($query: String) {
        clusters {
            id
            subjects(query: $query) {
                id
                name
                clusterAdmin
            }
        }
    }
`,sr=()=>{const s=k(),t=D();function a(o){if(!o||!o.clusters)return[];const n=o.clusters.reduce((r,l)=>{if(!l.subjects)return r;const i={...r};return l.subjects.filter(u=>u.clusterAdmin).forEach(u=>{const{name:c,id:d}=u;r[c]||(i[c]={id:d,count:0}),i[c]={...i[c],count:i[c].count+=1}}),i},{});return Object.entries(n).map(r=>{var i;const l=b.getURL(s,t).base(j.SUBJECT).push((i=r[1])==null?void 0:i.id).url();return{y:r[0],x:r[1].count,hint:{title:r[0],body:r[1].count},link:l}}).sort((r,l)=>l.x-r.x).slice(0,6)}return e.jsx(H,{query:er,variables:{query:"Cluster Role:true"},children:({loading:o,data:n,networkStatus:r})=>{let l=e.jsx(B,{}),i;if(!o&&n&&r===$s.READY){const u=a(n),c=b.getURL(s,t).base(j.SUBJECT).url();i=e.jsx(Re,{to:c,className:"no-underline btn-sm btn-base",children:"View all"}),l=e.jsx(zt,{data:u})}return e.jsx(Y,{className:"s-2 overflow-hidden pdf-page",header:"Users with most cluster admin roles",headerComponents:i,children:l})}})},tr=q`
    query secrets {
        secrets {
            id
            name
            clusterName
            namespace
            files {
                name
                type
                metadata {
                    __typename
                    ... on Cert {
                        endDate
                        startDate
                    }
                    ... on ImagePullSecret {
                        registries {
                            name
                            username
                        }
                    }
                }
            }
            deploymentCount
        }
    }
`,nr=s=>{let t="no";return s.forEach(a=>{if(a.metadata){const{startDate:o,endDate:n}=a.metadata;if(!o&&!n)return;const r=new Date().toISOString(),l=pt.isAfter(o,r),i=pt.isAfter(r,n);l?t="upcoming":i?t="expired":t="valid"}}),`has ${t} certs`},ar=()=>{const s=k(),t=D();function a(o){return!o||!o.secrets?[]:o.secrets.filter(n=>n.deploymentCount).sort((n,r)=>r.deploymentCount-n.deploymentCount).slice(0,10)}return e.jsx(H,{query:tr,children:({loading:o,data:n})=>{let r=e.jsx(B,{});const l=b.getURL(s,t).base(j.SECRET).url(),i=e.jsx(Re,{to:l,className:"no-underline btn-sm btn-base",children:"View all"});if(!o&&n){const u=a(n);r=e.jsx("ul",{className:"w-full columns-2 columns-gap-0",style:{columnRule:"1px solid var(--base-300)"},children:u.map((c,d)=>{const m=b.getURL(s,t).base(j.SECRET).push(c.id).url();return e.jsxs("li",{className:`inline-block flex flex-row border-base-300 w-full ${d!==4||d!==9?"border-b":""}`,children:[e.jsx("div",{className:"self-center text-2xl pl-4 pr-4",children:d+1}),e.jsxs("div",{className:"flex flex-col truncate pr-4 pb-4 pt-4",children:[e.jsxs("span",{className:"text-sm",children:[c.clusterName,"/",c.namespace]}),e.jsx(Re,{to:m,children:c.name}),c.deploymentCount>0&&e.jsxs("span",{className:"truncate text-sm",children:[`${c.deploymentCount} ${U("deployment",c.deploymentCount)}, `,nr(c.files)]})]})]},c.id)})})}return e.jsx(Y,{className:"s-2 overflow-hidden pdf-page",header:"Secrets most used across deployments",headerComponents:i,children:r})}})},rr=()=>{const[s,t]=I.useState(!1),{hasReadAccess:a}=gs(),o=a("Alert")&&a("WorkflowAdministration"),n=a("Compliance"),r=a("Cluster")&&a("K8sRoleBinding")&&a("K8sSubject"),l=a("Deployment")&&a("Secret");return e.jsxs(e.Fragment,{children:[e.jsxs(Vn,{headerText:Tn[Xe.CONFIG_MANAGEMENT],headerComponents:e.jsx(Ht,{isExporting:s,setIsExporting:t}),children:[o&&e.jsx(Ga,{}),n&&e.jsx(Is,{className:"pdf-page",standardOptions:[Rn.CIS_Kubernetes_v1_5]}),r&&e.jsx(sr,{}),l&&e.jsx(ar,{})]}),s&&e.jsx(js,{})]})},_e=I.createContext(),Jt={sortParam:Nt.page,pageParam:yt.page},Xt={sortParam:Nt.sidePanel,pageParam:yt.sidePanel},Zt=(s,t,a)=>{const o=I.useCallback(n=>{const{target:r}=n;s.current&&r instanceof HTMLElement&&!s.current.contains(r)&&t()},[t,s]);I.useEffect(()=>(a&&document.addEventListener("mousedown",o),()=>{a&&document.removeEventListener("mousedown",o)}),[a,o])};function ye(s,t){return`${vn}/${Pn[s]}/${t}`}const or=!0,Ne=({headerText:s,query:t,variables:a,entityType:o,tableColumns:n,createTableRows:r,selectedRowId:l,idAttribute:i,defaultSorted:u,defaultSearchOptions:c,data:d,totalResults:m,autoFocusSearchInput:p,noDataText:h})=>{const f=k(),g=D(),y=be(),N=I.useContext(De),S=I.useContext(_e),P=N.paging[S.pageParam],A=N.sort[S.sortParam]||u,[T,E]=I.useState({});function v(K){const W=es(K,i),X=b.getURL(f,g).push(W).url();y(X)}const L=[bt[o]],Q=`Filter ${U(ne[o])}`;function Se(K,W,X){const Ee=`${X} ${U(s||ne[o],X)}`;return e.jsxs(Es,{testid:"panel",children:[e.jsxs(Ts,{children:[e.jsx(Mt,{testid:"panel-header",text:Ee}),e.jsx(Rs,{children:K})]}),e.jsx(vs,{children:e.jsx(Ze,{rows:W,columns:n,onRowClick:v,idAttribute:i,id:"capture-list",selectedRowId:l,noDataText:h,page:P,sorted:A,onSortedChange:le,manual:or,disableSortRemove:!0})})]})}function ve(K){y(N.setPage(K).toUrl())}function le(K,W){const X=K.map(Ye=>{const mt=T[Ye.id]||W.sortField;E({[Ye.id]:mt,...T});const{desc:gn}=Ye;return{id:mt,desc:gn}}),Ee=N.setSort(X).toUrl();y(Ee)}function Me(K){return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"flex flex-1 justify-start",children:e.jsx(H,{query:Ft,action:"list",variables:{categories:L},children:({data:W})=>{const X=W&&W.searchOptions?[...W.searchOptions,...c]:[];return e.jsx(Dt,{placeholder:Q,className:"w-full",categoryOptions:X,categories:L,autoFocus:p})}})}),e.jsx(Ss,{page:P,dataLength:K,setPage:ve,pageSize:ms})]})}if(d){const K=Me(m);return d.length&&Ke(d,o,t,"capture-list",n),Se(K,d,m)}const Fe={...a,pagination:w.getPagination(A,P,ms)};return e.jsx("section",{className:"h-full w-full",id:"capture-list",children:e.jsx(H,{query:t,variables:Fe,children:({loading:K,data:W})=>{if(ae(K,d))return e.jsx(B,{});if(!W)return e.jsx(te,{resourceType:o,useCase:Xe.CONFIG_MANAGEMENT});const X=r(W)??[],Ee=(W==null?void 0:W.count)||0,Ye=Me(Ee);return X.length&&Ke(X,o,t,"capture-list",n),Se(Ye,X,Ee)}})})};Ne.propTypes={query:C.shape().isRequired,variables:C.shape(),entityType:C.string.isRequired,tableColumns:C.arrayOf(C.shape({})).isRequired,createTableRows:C.func.isRequired,selectedRowId:C.string,idAttribute:C.string.isRequired,headerText:C.string,defaultSorted:C.arrayOf(C.shape({})),defaultSearchOptions:C.arrayOf(C.string),data:C.arrayOf(C.shape({})),totalResults:C.number,autoFocusSearchInput:C.bool,noDataText:C.string};Ne.defaultProps={variables:{},headerText:"",selectedRowId:null,defaultSorted:[],defaultSearchOptions:[],data:null,totalResults:null,autoFocusSearchInput:!0,noDataText:"No results found. Please refine your search."};function qe({text:s,isTextOnly:t}){const a=e.jsx(An,{children:e.jsx($n,{color:"var(--pf-t--global--icon--color--status--warning--default)"})});return e.jsx(jt,{icon:a,text:s,isTextOnly:t})}const Ae=(s,t)=>{if(!t||!s)return s;const a=St(t);return s.filter(o=>{let n=!1;if(o.policyStatus&&o.policyStatus.failingPolicies){const{length:r}=o.policyStatus.failingPolicies;r||(n=!0)}else o.policyStatus==="pass"&&(n=!0);return a===z.POLICY_STATUS.VALUES.PASS?n:a===z.POLICY_STATUS.VALUES.FAIL?!n:!0})},lr=q`
    query clusters($query: String, $pagination: Pagination) {
        results: clusters(query: $query, pagination: $pagination) {
            id
            name
            serviceAccountCount
            k8sRoleCount
            subjectCount
            status {
                orchestratorMetadata {
                    version
                }
            }
            complianceControlCount(query: "Standard:CIS") {
                passingCount
                failingCount
                unknownCount
            }
            policyStatus {
                status
                failingPolicies {
                    id
                    name
                }
            }
        }
        count: clusterCount(query: $query)
    }
`,en=[{id:ps.CLUSTER,desc:!1}],ir=(s,t)=>[{Header:"Id",headerClassName:"hidden",className:"hidden",accessor:"id"},{Header:"Cluster",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,Cell:({original:o,pdf:n})=>{const r=ye("CLUSTER",o.id);return e.jsx(O,{pdf:n,url:r,children:o.name})},accessor:"name",id:ps.CLUSTER,sortField:ps.CLUSTER},{Header:"K8S Version",headerClassName:`w-1/8 ${M}`,className:`w-1/8 ${x}`,accessor:"status.orchestratorMetadata.version",sortable:!1},{Header:"Policy Status",headerClassName:`w-1/8 ${M}`,className:`w-1/8 ${x}`,Cell:({original:o,pdf:n})=>{const{policyStatus:{status:r}}=o;return e.jsx(Qe,{isPass:r==="pass",isTextOnly:n})},id:"status",accessor:o=>o.policyStatus.status,sortable:!1},{Header:"CIS Controls",headerClassName:`w-1/8 ${M}`,className:`w-1/8 ${x}`,accessor:"complianceControlCount",Cell:({original:o,pdf:n})=>{const{complianceControlCount:r}=o,{passingCount:l,failingCount:i,unknownCount:u}=r,c=l+i+u;if(!c)return e.jsx(qe,{text:"No Controls",isTextOnly:n});const d=b.getURL(s,t).push(o.id).push("CONTROL").url(),m=`${c} ${U("Controls",c)}`;return e.jsx(O,{pdf:n,url:d,children:m})},sortable:!1},{Header:"Users & Groups",headerClassName:`w-1/8 ${M}`,className:`w-1/8 ${x}`,Cell:({original:o,pdf:n})=>{const{subjectCount:r}=o;if(!r)return e.jsx(qe,{text:"No Users & Groups",isTextOnly:n});const l=b.getURL(s,t).push(o.id).push("SUBJECT").url(),i=`${r} ${U("Users & Groups",r)}`;return e.jsx(O,{pdf:n,url:l,children:i})},id:"subjectCount",accessor:o=>o.subjectCount,sortable:!1},{Header:"Service Accounts",headerClassName:`w-1/8 ${M}`,className:`w-1/8 ${x}`,Cell:({original:o,pdf:n})=>{const{serviceAccountCount:r}=o;if(!r)return e.jsx(qe,{text:"No Service Accounts",isTextOnly:n});const l=b.getURL(s,t).push(o.id).push("SERVICE_ACCOUNT").url(),i=`${r} ${U("Service Accounts",r)}`;return e.jsx(O,{pdf:n,url:l,children:i})},id:"serviceAccountCount",accessor:o=>o.serviceAccountCount,sortable:!1},{Header:"Roles",headerClassName:`w-1/8 ${M}`,className:`w-1/8 ${x}`,Cell:({original:o,pdf:n})=>{const{k8sRoleCount:r}=o;if(!r)return e.jsx(qe,{text:"No Roles",isTextOnly:n});const l=b.getURL(s,t).push(o.id).push("ROLE").url(),i=`${r} ${U("Roles",r)}`;return e.jsx(O,{pdf:n,url:l,children:i})},id:"k8sRoleCount",accessor:o=>o.k8sRoleCount,sortable:!1}],cr=s=>s.results,ws=({className:s,selectedRowId:t,onRowClick:a,query:o,data:n})=>{const r=D(),l=k(),i=!t,u=ir(l,r),{[z.POLICY_STATUS.CATEGORY]:c,...d}=o??{},m={...d},p=w.objectToWhereClause(m),h=p?{query:p}:null;function f(g){const y=cr(g);return Ae(y,c)}return e.jsx(Ne,{className:s,query:lr,variables:h,entityType:"CLUSTER",tableColumns:u,createTableRows:f,onRowClick:a,selectedRowId:t,idAttribute:"id",defaultSorted:en,defaultSearchOptions:[z.POLICY_STATUS.CATEGORY],data:Ae(n,c),autoFocusSearchInput:i})};ws.propTypes=he;ws.defaultProps=fe;function ur({isTextOnly:s}){const t=e.jsx(In,{});return e.jsx(jt,{icon:t,text:"N/A",isTextOnly:s})}const ts=({headerText:s,query:t,variables:a,entityType:o,tableColumns:n,createTableRows:r,selectedRowId:l,idAttribute:i,defaultSorted:u,defaultSearchOptions:c,data:d,autoFocusSearchInput:m,noDataText:p})=>{const h=k(),f=D(),g=be(),[y,N]=I.useState(0);function S(E){const v=es(E,i),L=b.getURL(h,f).push(v).url();g(L)}const P=[bt[o]],R=`Filter ${U(ne[o])}`;function A(E,v){const L=`${v.length} ${U(s||ne[o],v.length)}`;return e.jsxs(Es,{testid:"panel",children:[e.jsxs(Ts,{children:[e.jsx(Mt,{testid:"panel-header",text:L}),e.jsx(Rs,{children:E})]}),e.jsx(vs,{children:e.jsx(Ze,{rows:v,columns:n,onRowClick:S,idAttribute:i,id:"capture-list",selectedRowId:l,noDataText:p,page:y,defaultSorted:u})})]})}function T(E){return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"flex flex-1 justify-start",children:e.jsx(H,{query:Ft,action:"list",variables:{categories:P},children:({data:v})=>{const L=v&&v.searchOptions?[...v.searchOptions,...c]:[];return e.jsx(Dt,{placeholder:R,className:"w-full",categoryOptions:L,categories:P,autoFocus:m})}})}),e.jsx(Ss,{page:y,dataLength:E,setPage:N,pageSize:da})]})}if(d){const E=T(d.length);return d.length&&Ke(d,o,t,"capture-list",n),A(E,d)}return e.jsx("section",{className:"h-full w-full",id:"capture-list",children:e.jsx(H,{query:t,variables:a,children:({loading:E,data:v})=>{if(ae(E,d))return e.jsx(B,{});if(!v)return e.jsx(te,{resourceType:o,useCase:Xe.CONFIG_MANAGEMENT});const L=r(v)??[],Q=T(L.length);return L.length&&Ke(L,o,t,"capture-list",n),A(Q,L)}})})};ts.propTypes={query:C.shape().isRequired,variables:C.shape(),entityType:C.string.isRequired,tableColumns:C.arrayOf(C.shape({})).isRequired,createTableRows:C.func.isRequired,selectedRowId:C.string,idAttribute:C.string.isRequired,headerText:C.string,defaultSorted:C.arrayOf(C.shape({})),defaultSearchOptions:C.arrayOf(C.string),data:C.arrayOf(C.shape({})),autoFocusSearchInput:C.bool,noDataText:C.string};ts.defaultProps={variables:{},headerText:"",selectedRowId:null,defaultSorted:[],defaultSearchOptions:[],data:null,autoFocusSearchInput:!0,noDataText:"No results found. Please refine your search."};const dr=[{Header:"Id",headerClassName:"hidden",className:"hidden",accessor:"id"},{Header:"Standard",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,accessor:"standard"},{Header:"Control",headerClassName:`w-1/2 ${$}`,className:`w-1/2 ${x}`,Cell:({original:s,pdf:t})=>{const a=ye("CONTROL",s.id);return e.jsx(O,{pdf:t,url:a,children:s.control})},accessor:"control",sortMethod:hs},{Header:"Control Status",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x} capitalize`,Cell:({original:s,pdf:t})=>s.status===J["N/A"]?e.jsx(ur,{isTextOnly:t}):e.jsx(Qe,{isPass:s.status==="Pass",isTextOnly:t}),accessor:"status",sortMethod:Ea}],gt=(s,t)=>{if(!t||!s)return s;const a=St(t);return s.filter(n=>a===J.PASS?n.status===J.PASS:a===J.FAIL?n.status===J.FAIL:n.status===J["N/A"])},mr=s=>{if(!s||!s.results||!s.results.results.length)return[];let t=0,a=0;s.results.results[0].aggregationKeys.forEach(({scope:n},r)=>{n==="STANDARD"&&(t=r),n==="CONTROL"&&(a=r)});const o={};return s.results.results.forEach(({keys:n,numFailing:r,numPassing:l})=>{if(!n[a])return;const i=n[a].id;if(o[i]){const{status:u}=o[i];(u===J.FAIL||r)&&(o[i].status=J.FAIL)}else{let u="";l||(u=J.FAIL),r||(u=J.PASS),!l&&!r&&(u=J["N/A"]),o[i]={id:i,standard:Ce[n[t].id],control:`${n[a].name} - ${n[a].description}`,status:u}}}),Object.values(o)},Os=({className:s,selectedRowId:t,onRowClick:a,query:o,data:n})=>{const r=I.useContext(G),l=!t,{[z.COMPLIANCE.STATE]:i,...u}=w.getQueryBasedOnSearchContext(o,r),c={...u};c.Standard||(c.Standard="CIS");const m={where:w.objectToWhereClause(c),groupBy:["STANDARD","CONTROL"]};function p(h){const f=mr(h);return gt(f,i)}return e.jsx(ts,{className:s,query:ea,variables:m,headerText:"CIS Controls",noDataText:"No control results available. Please run a scan.",entityType:"CONTROL",tableColumns:dr,createTableRows:p,onRowClick:a,selectedRowId:t,idAttribute:"id",defaultSorted:[{id:"status",desc:!1},{id:"standard",desc:!1},{id:"control",desc:!1}],defaultSearchOptions:[z.COMPLIANCE.STATE],data:gt(n,i),autoFocusSearchInput:l})};Os.propTypes=he;Os.defaultProps=fe;const sn=[{id:Te.DEPLOYMENT,desc:!1}],pr=(s,t,a)=>[{Header:"Id",headerClassName:"hidden",className:"hidden",accessor:"id"},{Header:"Deployment",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,Cell:({original:n,pdf:r})=>{const l=ye("DEPLOYMENT",n.id);return e.jsx(O,{pdf:r,url:l,children:n.name})},accessor:"name",id:Te.DEPLOYMENT,sortField:Te.DEPLOYMENT},a&&a.CLUSTER?null:{Header:"Cluster",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,accessor:"clusterName",Cell:({original:n,pdf:r})=>{const{clusterName:l,clusterId:i,id:u}=n,c=b.getURL(s,t).push(u).push("CLUSTER",i).url();return e.jsx(O,{pdf:r,url:c,children:l})},id:Te.CLUSTER,sortField:Te.CLUSTER},a&&a.NAMESPACE?null:{Header:"Namespace",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,accessor:"namespace",Cell:({original:n,pdf:r})=>{const{namespace:l,namespaceId:i,id:u}=n,c=b.getURL(s,t).push(u).push("NAMESPACE",i).url();return e.jsx(O,{pdf:r,url:c,children:l})},id:Te.NAMESPACE,sortField:Te.NAMESPACE},{Header:"Policy Status",headerClassName:`w-1/8 ${M}`,className:`w-1/8 ${x}`,Cell:({original:n,pdf:r})=>{const{policyStatus:l}=n;return e.jsx(Qe,{isPass:l==="pass",isTextOnly:r})},id:"policyStatus",accessor:"policyStatus",sortable:!1},{Header:"Images",headerClassName:`w-1/8 ${M}`,className:`w-1/8 ${x}`,Cell:({original:n,pdf:r})=>{const{imageCount:l,id:i}=n;if(l===0)return"No images";const u=b.getURL(s,t).push(i).push("IMAGE").url(),c=`${l} ${U("image",l)}`;return e.jsx(O,{pdf:r,url:u,children:c})},accessor:"imageCount",sortable:!1},{Header:"Secrets",headerClassName:`w-1/8 ${M}`,className:`w-1/8 ${x}`,Cell:({original:n,pdf:r})=>{const{secretCount:l,id:i}=n;if(l===0)return"No secrets";const u=b.getURL(s,t).push(i).push("SECRET").url(),c=`${l} ${U("secret",l)}`;return e.jsx(O,{pdf:r,url:u,children:c})},accessor:"secretCount",sortable:!1},a&&a.SERVICE_ACCOUNT?null:{Header:"Service Account",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,accessor:"serviceAccount",Cell:({original:n,pdf:r})=>{const{serviceAccount:l,serviceAccountID:i,id:u}=n,c=b.getURL(s,t).push(u).push("SERVICE_ACCOUNT",i).url();return e.jsx(O,{pdf:r,url:c,children:l})},id:Te.SERVICE_ACCOUNT,sortField:Te.SERVICE_ACCOUNT}].filter(n=>n),Cr=s=>s.results,Ls=({className:s,selectedRowId:t,onRowClick:a,query:o,data:n,totalResults:r,entityContext:l})=>{const i=D(),u=k(),c=I.useContext(G),d=!t,m=pr(u,i,l),{[z.POLICY_STATUS.CATEGORY]:p,...h}=w.getQueryBasedOnSearchContext(o,c),f=w.objectToWhereClause({...h}),g=f?{query:f}:null;function y(N){const S=Cr(N);return Ae(S,p)}return e.jsx(Ne,{className:s,query:ma,variables:g,entityType:"DEPLOYMENT",tableColumns:m,createTableRows:y,onRowClick:a,selectedRowId:t,idAttribute:"id",defaultSorted:sn,defaultSearchOptions:[z.POLICY_STATUS.CATEGORY],data:Ae(n,p),totalResults:r,autoFocusSearchInput:d})};Ls.propTypes=he;Ls.defaultProps=fe;const tn=[{id:Ve.NAME,desc:!1}],hr=(s,t,a)=>[{Header:"Id",headerClassName:"hidden",className:"hidden",accessor:"id"},{Header:"Image",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,Cell:({original:n,pdf:r})=>{const l=ye("IMAGE",n.id);return e.jsx(O,{pdf:r,url:l,children:n.name.fullName})},accessor:"name.fullName",id:Ve.NAME,sortField:Ve.NAME},{Header:"Created",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,Cell:({original:n})=>{const{metadata:r}=n;return r?ee(r.v1.created):"-"},id:Ve.CREATED_TIME,sortField:Ve.CREATED_TIME},a&&a.DEPLOYMENT?null:{Header:"Deployments",headerClassName:`w-1/8 ${M}`,className:`w-1/8 ${x}`,Cell:({original:n,pdf:r})=>{const{deployments:l,id:i}=n,u=l.length,c=`${u} ${U("deployment",u)}`;if(u===0)return c;const d=b.getURL(s,t).push(i).push("DEPLOYMENT").url();return e.jsx(O,{pdf:r,url:d,children:c})},accessor:"deployments",sortable:!1}].filter(n=>n),fr=s=>s.images,Us=({className:s,selectedRowId:t,onRowClick:a,query:o,data:n,totalResults:r,entityContext:l})=>{const i=D(),u=k(),c=!t,d=w.objectToWhereClause(o),m=d?{query:d}:null,p=hr(u,i,l);return e.jsx(Ne,{className:s,query:pa,variables:m,entityType:"IMAGE",tableColumns:p,createTableRows:fr,onRowClick:a,selectedRowId:t,idAttribute:"id",defaultSorted:tn,data:n,totalResults:r,autoFocusSearchInput:c})};Us.propTypes=he;Us.defaultProps=fe;const nn=[{id:He.NAMESPACE,desc:!1}],gr=(s,t,a)=>[{Header:"Id",headerClassName:"hidden",className:"hidden",accessor:"metadata.id"},{Header:"Namespace",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,Cell:({original:n,pdf:r})=>{const l=ye("NAMESPACE",n.metadata.id);return e.jsx(O,{pdf:r,url:l,children:n.metadata.name})},accessor:"metadata.name",id:He.NAMESPACE,sortField:He.NAMESPACE},a&&a.CLUSTER?null:{Header:"Cluster",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,accessor:"metadata.clusterName",Cell:({original:n,pdf:r})=>{const{metadata:l}=n;if(!l)return"-";const{clusterName:i,clusterId:u,id:c}=l,d=b.getURL(s,t).push(c).push("CLUSTER",u).url();return e.jsx(O,{pdf:r,url:d,children:i})},id:He.CLUSTER,sortField:He.CLUSTER},{Header:"Policy Status",headerClassName:`w-1/8 ${M}`,className:`w-1/8 ${x}`,Cell:({original:n,pdf:r})=>{const{policyStatus:{status:l}}=n;return e.jsx(Qe,{isPass:l==="pass",isTextOnly:r})},id:"status",accessor:n=>n.policyStatus.status,sortable:!1},{Header:"Secrets",headerClassName:`w-1/8 ${M}`,className:`w-1/8 ${x}`,Cell:({original:n,pdf:r})=>{const{numSecrets:l,metadata:i}=n;if(!i||l===0)return"No Secrets";const{id:u}=i,c=b.getURL(s,t).push(u).push("SECRET").url(),d=`${l} ${U("Secrets",l)}`;return e.jsx(O,{pdf:r,url:c,children:d})},id:"numSecrets",accessor:n=>n.numSecrets,sortable:!1},{Header:"Users & Groups",headerClassName:`w-1/8 ${M}`,className:`w-1/8 ${x}`,Cell:({original:n,pdf:r})=>{const{subjectsCount:l,metadata:i}=n;if(!l||l===0)return"No Users & Groups";const{id:u}=i,c=b.getURL(s,t).push(u).push("SUBJECT").url(),d=`${l} ${U("Users & Groups",l)}`;return e.jsx(O,{pdf:r,url:c,children:d})},accessor:"subjectCount",sortable:!1},{Header:"Service Accounts",headerClassName:`w-1/8 ${M}`,className:`w-1/8 ${x}`,Cell:({original:n,pdf:r})=>{const{serviceAccountCount:l,metadata:i}=n;if(!l||l===0)return"No Service Accounts";const{id:u}=i,c=b.getURL(s,t).push(u).push("SERVICE_ACCOUNT").url(),d=`${l} ${U("Service Accounts",l)}`;return e.jsx(O,{pdf:r,url:c,children:d})},accessor:"serviceAccountCount",sortable:!1},{Header:"Roles",headerClassName:`w-1/8 ${M}`,className:`w-1/8 ${x}`,Cell:({original:n,pdf:r})=>{const{k8sRoleCount:l,metadata:i}=n;if(!l||l===0)return"No Roles";const{id:u}=i,c=b.getURL(s,t).push(u).push("ROLE").url(),d=`${l} ${U("Roles",l)}`;return e.jsx(O,{pdf:r,url:c,children:d})},accessor:"k8sRoleCount",sortable:!1}].filter(n=>n),xr=s=>s.results,qs=({className:s,selectedRowId:t,onRowClick:a,query:o,data:n,totalResults:r,entityContext:l})=>{const i=D(),u=k(),c=I.useContext(G),d=!t,m=gr(u,i,l),{[z.POLICY_STATUS.CATEGORY]:p,...h}=w.getQueryBasedOnSearchContext(o,c),f=w.objectToWhereClause({...h}),g=f?{query:f}:null;function y(N){const S=xr(N);return Ae(S,p)}return e.jsx(Ne,{className:s,query:Ca,variables:g,entityType:"NAMESPACE",tableColumns:m,createTableRows:y,onRowClick:a,selectedRowId:t,idAttribute:"metadata.id",defaultSorted:nn,defaultSearchOptions:[z.POLICY_STATUS.CATEGORY],data:Ae(n,p),totalResults:r,autoFocusSearchInput:d})};qs.propTypes=he;qs.defaultProps=fe;const yr=q`
    query nodes($query: String, $pagination: Pagination) {
        results: nodes(query: $query, pagination: $pagination) {
            id
            name
            clusterName
            clusterId
            osImage
            containerRuntimeVersion
            joinedAt
            nodeComplianceControlCount(query: "Standard:CIS") {
                failingCount
                passingCount
                unknownCount
            }
        }
        count: nodeCount(query: $query)
    }
`,an=[{id:me.NODE,desc:!1}],Nr=(s,t,a)=>[{Header:"Id",headerClassName:"hidden",className:"hidden",accessor:"id"},{Header:"Node",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,Cell:({original:n,pdf:r})=>{const l=ye("NODE",n.id);return e.jsx(O,{pdf:r,url:l,children:n.name})},accessor:"name",id:me.NODE,sortField:me.NODE},{Header:"Operating System",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,accessor:"osImage",id:me.OPERATING_SYSTEM,sortField:me.OPERATING_SYSTEM},{Header:"Container Runtime",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,accessor:"containerRuntimeVersion",id:me.CONTAINER_RUNTIME,sortField:me.CONTAINER_RUNTIME},{Header:"Node Join Time",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,Cell:({original:n})=>{const{joinedAt:r}=n;return r?ee(r):null},accessor:"joinedAt",id:me.NODE_JOIN_TIME,sortField:me.NODE_JOIN_TIME},a&&a.CLUSTER?null:{Header:"Cluster",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,accessor:"clusterName",Cell:({original:n,pdf:r})=>{const{clusterName:l,clusterId:i,id:u}=n,c=b.getURL(s,t).push(u).push("CLUSTER",i).url();return e.jsx(O,{pdf:r,url:c,children:l})},id:me.CLUSTER,sortField:me.CLUSTER},a&&a.CONTROL?null:{Header:"CIS Controls",headerClassName:`w-1/8 ${M}`,className:`w-1/8 ${x}`,accessor:"nodeComplianceControlCount",Cell:({original:n,pdf:r})=>{const{nodeComplianceControlCount:l}=n,{passingCount:i,failingCount:u,unknownCount:c}=l,d=i+u+c;if(!d)return e.jsx(qe,{text:"No Controls",isTextOnly:r});const m=b.getURL(s,t).push(n.id).push("CONTROL").url(),p=`${d} ${U("Controls",d)}`;return e.jsx(O,{pdf:r,url:m,children:p})},sortable:!1}].filter(n=>n),br=s=>s.results,ns=({className:s,selectedRowId:t,onRowClick:a,query:o,data:n,totalResults:r,entityContext:l})=>{const i=k(),u=D(),c=!t,d=Nr(i,u,l),m=w.objectToWhereClause(o),p=m?{query:m}:null;return e.jsx(Ne,{className:s,query:yr,variables:p,entityType:"NODE",tableColumns:d,createTableRows:br,onRowClick:a,selectedRowId:t,idAttribute:"id",defaultSorted:an,data:n,totalResults:r,autoFocusSearchInput:c})};ns.propTypes=he;ns.defaultProps=fe;const jr=[{id:pe.POLICY,desc:!1}],Sr=[{Header:"Id",headerClassName:"hidden",className:"hidden",accessor:"id"},{Header:"Policy",headerClassName:`w-1/4 ${$}`,className:`w-1/4 ${x}`,Cell:({original:s,pdf:t})=>{const a=ye("POLICY",s.id);return e.jsx(O,{pdf:t,url:a,children:s.name})},accessor:"name",id:pe.POLICY,sortField:pe.POLICY},{Header:"Enforced",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,Cell:({original:s})=>{const{enforcementActions:t}=s;return t.length===0||t.includes("UNSET_ENFORCEMENT")?"No":"Yes"},accessor:"enforcementActions",id:pe.ENFORCEMENT,sortField:pe.ENFORCEMENT},{Header:"Policy Status",headerClassName:`w-1/8 ${M}`,className:`w-1/8 ${x}`,Cell:({original:s,pdf:t})=>{const{disabled:a,policyStatus:o}=s;return a?e.jsx(Ra,{isDisabled:a,isTextOnly:t}):e.jsx(Qe,{isPass:o==="pass",isTextOnly:t})},accessor:"policyStatus",sortable:!1},{Header:"Severity",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,Cell:({original:s})=>{const{severity:t,pdf:a}=s;return e.jsx(ss,{severity:t,isTextOnly:a})},accessor:"severity",sortMethod:Vt,id:pe.SEVERITY,sortField:pe.SEVERITY},{Header:"Categories",headerClassName:`w-1/4 ${$}`,className:`w-1/4 ${x}`,Cell:({original:s})=>{const{categories:t}=s;return t.join(", ")},accessor:"categories",id:pe.CATEGORY,sortField:pe.CATEGORY},{Header:"Lifecycle Stage",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,Cell:({original:s})=>{const{lifecycleStages:t}=s;return Ps(t)},accessor:"lifecycleStages",id:pe.LIFECYCLE_STAGE,sortField:pe.LIFECYCLE_STAGE}],Er=s=>s.policies,Ds=({className:s,onRowClick:t,query:a,selectedRowId:o,data:n})=>{const r=!o,{[z.POLICY_STATUS.CATEGORY]:l,...i}=a??{},u=w.objectToWhereClause({"Lifecycle Stage":"DEPLOY",...i}),c=u?{query:u}:null;function d(m){const p=Er(m);return Ae(p,l)}return e.jsx(ts,{className:s,query:ha,variables:c,entityType:"POLICY",tableColumns:Sr,createTableRows:d,selectedRowId:o,onRowClick:t,idAttribute:"id",defaultSorted:[{id:"policyStatus",desc:!1},{id:"severity",desc:!1}],defaultSearchOptions:[z.POLICY_STATUS.CATEGORY],data:Ae(n,l),autoFocusSearchInput:r})};Ds.propTypes=he;Ds.defaultProps=fe;const rn=[{id:Ge.ROLE,desc:!1}],Tr=(s,t,a)=>[{Header:"Id",headerClassName:"hidden",className:"hidden",accessor:"id"},{Header:"Role",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,Cell:({original:n,pdf:r})=>{const l=ye("ROLE",n.id);return e.jsx(O,{pdf:r,url:l,children:n.name})},accessor:"name",id:Ge.ROLE,sortField:Ge.ROLE},{Header:"Type",headerClassName:`w-1/8 ${M}`,className:`w-1/8 ${x}`,accessor:"type",sortable:!1},{Header:"Permissions",headerClassName:`w-1/8 ${M}`,className:`w-1/8 ${x}`,Cell:({original:n})=>{const{verbs:r}=n;return r.length?e.jsx("div",{className:"capitalize",children:r.join(", ")}):"No Permissions"},accessor:"verbs",sortable:!1},{Header:"Created",headerClassName:`w-1/8 ${M}`,className:`w-1/8 ${x}`,Cell:({original:n})=>{const{createdAt:r}=n;return ee(r)},accessor:"createdAt",sortable:!1},a&&a.CLUSTER?null:{Header:"Cluster",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,accessor:"clusterName",Cell:({original:n,pdf:r})=>{const{clusterName:l,clusterId:i,id:u}=n,c=b.getURL(s,t).push(u).push("CLUSTER",i).url();return e.jsx(O,{pdf:r,url:c,children:l})},id:Ge.CLUSTER,sortField:Ge.CLUSTER},{Header:"Namespace Scope",headerClassName:`w-1/8 ${M}`,className:`w-1/8 ${x}`,Cell:({original:n,pdf:r})=>{const{roleNamespace:l,id:i}=n;if(!l)return"Cluster-wide";const{metadata:{name:u,id:c}}=l,d=b.getURL(s,t).push(i).push("NAMESPACE",c).url();return e.jsx(O,{pdf:r,url:d,children:u})},accessor:"roleNamespace.metadata.name",sortable:!1},{Header:"Users & Groups",headerClassName:`w-1/8 ${M}`,className:`w-1/8 ${x}`,Cell:({original:n,pdf:r})=>{const{serviceAccounts:l,subjects:i}=n,{length:u}=l,{length:c}=i;if(!c)return!u||u===1&&l[0].message?e.jsx(qe,{text:"No Users & Groups",isTextOnly:r}):"No Users & Groups";const d=b.getURL(s,t).push(n.id).push("SUBJECT").url(),m=`${c} ${U("Users & Groups",c)}`;if(c>1)return e.jsx(O,{pdf:r,url:d,children:m});const p=i[0];return e.jsx(O,{pdf:r,url:d,children:p.name})},id:"subjects",accessor:n=>n.subjects,sortable:!1},{Header:"Service Accounts",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,Cell:({original:n,pdf:r})=>{const{serviceAccounts:l,subjects:i,id:u}=n,{length:c}=l,{length:d}=i;if((!c||c===1&&l[0].message)&&!d)return e.jsx(qe,{text:"No Service Accounts",isTextOnly:r});if(!c)return"No Service Accounts";const m=b.getURL(s,t).push(u).push("SERVICE_ACCOUNT").url(),p=`${c} ${U("Service Accounts",c)}`;if(c>1)return e.jsx(O,{pdf:r,url:m,children:p});const h=l[0];return e.jsx(O,{pdf:r,url:m,children:h.name})},accessor:"serviceAccounts",sortable:!1}].filter(n=>n),Rr=s=>s.results,ks=({className:s,selectedRowId:t,onRowClick:a,query:o,data:n,totalResults:r,entityContext:l})=>{const i=D(),u=k(),c=!t,d=Tr(u,i,l),m=w.objectToWhereClause(o),p=m?{query:m}:null;return e.jsx(Ne,{className:s,query:fa,variables:p,entityType:"ROLE",tableColumns:d,createTableRows:Rr,onRowClick:a,selectedRowId:t,idAttribute:"id",defaultSorted:rn,data:n,totalResults:r,autoFocusSearchInput:c})};ks.propTypes=he;ks.defaultProps=fe;const vr={UNDETERMINED:"Undetermined",PUBLIC_CERTIFICATE:"Public Certificate",CERTIFICATE_REQUEST:"Certificate Request",PRIVACY_ENHANCED_MESSAGE:"Privacy Enhanced Message",OPENSSH_PRIVATE_KEY:"OpenSSH Private Key",PGP_PRIVATE_KEY:"PGP Private Key",EC_PRIVATE_KEY:"EC Private Key",RSA_PRIVATE_KEY:"RSA Private Key",DSA_PRIVATE_KEY:"DSA Private Key",CERT_PRIVATE_KEY:"Certificate Private Key",ENCRYPTED_PRIVATE_KEY:"Encrypted Private Key",IMAGE_PULL_SECRET:"Image Pull Secret"},on=[{id:Le.SECRET,desc:!1}],Pr=(s,t,a)=>[{Header:"Id",headerClassName:"hidden",className:"hidden",accessor:"id"},{Header:"Secret",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,Cell:({original:n,pdf:r})=>{const l=ye("SECRET",n.id);return e.jsx(O,{pdf:r,url:l,children:n.name})},accessor:"name",id:Le.SECRET,sortField:Le.SECRET},{Header:"Created",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,Cell:({original:n})=>{const{createdAt:r}=n;return ee(r)},accessor:"createdAt",id:Le.CREATED,sortField:Le.CREATED},{Header:"Types",headerClassName:`w-1/8 ${M}`,className:`w-1/8 ${x}`,accessor:"files",Cell:({original:n})=>{const{files:r}=n;return r.length?e.jsx("span",{children:Et(r.map(l=>vr[l.type])).join(", ")}):"No Types"},sortable:!1},a&&a.CLUSTER?null:{Header:"Cluster",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,accessor:"clusterName",Cell:({original:n,pdf:r})=>{const{clusterName:l,clusterId:i,id:u}=n,c=b.getURL(s,t).push(u).push("CLUSTER",i).url();return e.jsx(O,{pdf:r,url:c,children:l})},id:Le.CLUSTER,sortField:Le.CLUSTER},{Header:"Deployments",headerClassName:`w-1/8 ${M}`,className:`w-1/8 ${x}`,accessor:"deployments",Cell:({original:n,pdf:r})=>{const{deploymentCount:l,id:i}=n;if(!l)return"No Deployments";const u=b.getURL(s,t).push(i).push("DEPLOYMENT").url(),c=`${l} ${U("Deployment",l)}`;return e.jsx(O,{pdf:r,url:u,children:c})},sortable:!1}].filter(n=>n),Ar=s=>s.secrets,Ms=({className:s,selectedRowId:t,onRowClick:a,query:o,data:n,totalResults:r,entityContext:l})=>{const i=D(),u=k(),c=!t,d=Pr(u,i,l),m=w.objectToWhereClause(o),p=m?{query:m}:null;return e.jsx(Ne,{className:s,query:ga,variables:p,entityType:"SECRET",tableColumns:d,createTableRows:Ar,onRowClick:a,selectedRowId:t,idAttribute:"id",defaultSorted:on,data:n,totalResults:r,autoFocusSearchInput:c})};Ms.propTypes=he;Ms.defaultProps=fe;const ln=[{id:Ue.SERVCE_ACCOUNT,desc:!1}],$r=(s,t,a)=>[{Header:"Id",headerClassName:"hidden",className:"hidden",accessor:"id"},{Header:"Service Accounts",headerClassName:`w-1/10 ${$}`,className:`w-1/10 ${x}`,Cell:({original:n,pdf:r})=>{const l=ye("SERVICE_ACCOUNT",n.id);return e.jsx(O,{pdf:r,url:l,children:n.name})},accessor:"name",id:Ue.SERVCE_ACCOUNT,sortField:Ue.SERVCE_ACCOUNT},{Header:"Cluster Admin Role",headerClassName:`w-1/10 ${M}`,className:`w-1/10 ${x}`,Cell:({original:n})=>{const{clusterAdmin:r}=n;return r?"Enabled":"Disabled"},accessor:"clusterAdmin",sortable:!1},a&&a.CLUSTER?null:{Header:"Cluster",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,accessor:"clusterName",Cell:({original:n,pdf:r})=>{const{clusterName:l,clusterId:i,id:u}=n,c=b.getURL(s,t).push(u).push("CLUSTER",i).url();return e.jsx(O,{pdf:r,url:c,children:l})},id:Ue.CLUSTER,sortField:Ue.CLUSTER},a&&a.NAMESPACE?null:{Header:"Namespace",headerClassName:`w-1/10 ${$}`,className:`w-1/10 ${x}`,accessor:"namespace",Cell:({original:n,pdf:r})=>{const{id:l,saNamespace:{metadata:i}}=n;if(!i)return"No Matches";const{name:u,id:c}=i,d=b.getURL(s,t).push(l).push("NAMESPACE",c).url();return e.jsx(O,{pdf:r,url:d,children:u})},id:Ue.NAMESPACE,sortField:Ue.NAMESPACE},{Header:"Roles",headerClassName:`w-1/8 ${M}`,className:`w-1/8 ${x}`,Cell:({original:n,pdf:r})=>{const{id:l,k8sRoles:i}=n,{length:u}=i;if(!u)return"No Roles";const c=b.getURL(s,t).push(l).push("ROLE").url();if(u>1){const d=`${u} ${U("Roles",u)}`;return e.jsx(O,{pdf:r,url:c,children:d})}return n.k8sRoles[0].name},accessor:"k8sRoles",sortMethod:Ta,sortable:!1},{Header:"Deployments",headerClassName:`w-1/8 ${M}`,className:`w-1/8 ${x}`,Cell:({original:n,pdf:r})=>{const{id:l,deploymentCount:i}=n;if(!i)return"No Deployments";const u=b.getURL(s,t).push(l).push("DEPLOYMENT").url(),c=`${i} ${U("Deployment",i)}`;return e.jsx(O,{pdf:r,url:u,children:c})},accessor:"deploymentCount",sortable:!1}].filter(n=>n),Ir=s=>s.results,Fs=({className:s,selectedRowId:t,onRowClick:a,query:o,data:n,totalResults:r,entityContext:l})=>{const i=D(),u=k(),c=!t,d=$r(u,i,l),m=w.objectToWhereClause(o),p=m?{query:m}:null;return e.jsx(Ne,{className:s,query:xa,variables:p,entityType:"SERVICE_ACCOUNT",tableColumns:d,createTableRows:Ir,onRowClick:a,selectedRowId:t,idAttribute:"id",defaultSorted:ln,data:n,totalResults:r,autoFocusSearchInput:c})};Fs.propTypes=he;Fs.defaultProps=fe;const cn=[{id:Be.SUBJECT,desc:!1}],wr=(s,t)=>[{Header:"Id",headerClassName:"hidden",className:"hidden",accessor:"id"},{Header:"Users & Groups",headerClassName:`w-1/10 ${$}`,className:`w-1/10 ${x}`,Cell:({original:o,pdf:n})=>{const r=ye("SUBJECT",o.id);return e.jsx(O,{pdf:n,url:r,children:o.name})},accessor:"name",id:Be.SUBJECT,sortField:Be.SUBJECT},{Header:"Cluster",headerClassName:`w-1/10 ${$}`,className:`w-1/10 ${x}`,accessor:"clusterName"},{Header:"Type",headerClassName:`w-1/10 ${$}`,className:`w-1/10 ${x}`,accessor:"type",id:Be.SUBJECT_KIND,sortField:Be.SUBJECT_KIND},{Header:"Cluster Admin Role",headerClassName:`w-1/10 ${M}`,className:`w-1/10 ${x}`,Cell:({original:o})=>{const{clusterAdmin:n}=o;return n?"Enabled":"Disabled"},accessor:"clusterAdmin",sortable:!1},{Header:"Roles",headerClassName:`w-1/10 ${M}`,className:`w-1/10 ${x}`,Cell:({original:o,pdf:n})=>{const{id:r,k8sRoles:l}=o,{length:i}=l;if(!i)return"No Roles";const u=b.getURL(s,t).push(r).push("ROLE").url(),c=i===1?l[0].name:`${i} ${U("Role",i)}`;return e.jsx(O,{pdf:n,url:u,children:c})},accessor:"k8sRoles",sortable:!1}],Or=s=>(s==null?void 0:s.results)??[],_s=({selectedRowId:s,onRowClick:t,query:a,className:o,data:n,totalResults:r})=>{const l=D(),i=k(),u=!s,c=wr(i,l),d=w.objectToWhereClause(a),m=d?{query:d}:null;return e.jsx(Ne,{className:o,query:ya,variables:m,entityType:"SUBJECT",tableColumns:c,createTableRows:Or,selectedRowId:s,onRowClick:t,idAttribute:"id",defaultSorted:cn,data:n,totalResults:r,autoFocusSearchInput:u})};_s.propTypes=he;_s.defaultProps=fe;const Lr={CLUSTER:ws,CONTROL:Os,DEPLOYMENT:Ls,IMAGE:Us,NAMESPACE:qs,NODE:ns,POLICY:Ds,ROLE:ks,SECRET:Ms,SERVICE_ACCOUNT:Fs,SUBJECT:_s},re=({entityListType:s,entityId:t,...a})=>{const o=Lr[s];return o?e.jsx(o,{selectedRowId:t,...a}):e.jsx(te,{resourceType:s,useCase:"configmanagement"})};re.propTypes={entityListType:C.string.isRequired,entityId:C.string};re.defaultProps={entityId:null};const Ur={CLUSTER:en,CONTROL:[],DEPLOYMENT:sn,IMAGE:tn,NAMESPACE:nn,NODE:an,POLICY:jr,ROLE:rn,SECRET:on,SERVICE_ACCOUNT:ln,SUBJECT:cn};function qr(s){return Ur[s]??[]}function $e(s){const t=Hn[s];return!t||s==="CONTROL"||s==="POLICY"?"":`count: ${t}(query: $query)`}const F=({name:s,value:t,entityType:a,...o})=>{const n=be(),r=D(),l=k(),i=I.useContext(De);function u(){let p;Tt.includes(i==null?void 0:i.useCase)?p=i.pushList(a).toUrl():p=b.getURL(l,r).push(a).url(),n(p)}const c=e.jsx("div",{className:"text-6xl",children:t}),d=e.jsx("button",{type:"button",disabled:t===0,className:"h-full w-full",onClick:u,"data-testid":"related-entity-list-count-value",children:c}),m=e.jsx("div",{"data-testid":"related-entity-list-count-title",children:s});return e.jsx(Y,{id:"related-entity-list-count",bodyClassName:"flex items-center justify-center",titleComponents:m,...o,children:d})};F.propTypes={name:C.string.isRequired,value:C.number,entityType:C.string.isRequired};F.defaultProps={value:0};const xt=s=>{let t=null;return s==="COMPLIANCE_STATE_FAILURE"?t=J.FAIL:s==="COMPLIANCE_STATE_SUCCESS"?t=J.PASS:t=J["N/A"],t};function un(s){const t={};return s.forEach(({control:a,value:o})=>{if(t[a.id]&&t[a.id].status!==J.FAIL)t[a.id].status=xt(o.overallState);else if(!t[a.id]){const n={...a};n.standard=Ce[a.standardId],n.control=`${a.name} - ${a.description}`,n.status=xt(o.overallState),t[a.id]=n}}),Object.values(t)}const Ie=({header:s,entityType:t,...a})=>{const[o,n]=I.useState(0),{columns:r,rows:l,selectedRowId:i,idAttribute:u,noDataText:c,setTableRef:d,trClassName:m,showThead:p,SubComponent:h,hasNestedTable:f,defaultSorted:g,...y}={...a},N=be(),S=D(),P=k(),R=e.jsx(Ss,{page:o,dataLength:l.length,setPage:n});function A(T){const E=es(T,u),v=b.getURL(P,S).push(t,E).url();N(v)}return e.jsx(Y,{header:s,headerComponents:R,...y,className:"w-full",children:e.jsx(Ze,{columns:r,rows:l,onRowClick:h||f?null:A,selectedRowId:i,idAttribute:u,noDataText:c,setTableRef:d,trClassName:m,showThead:p,SubComponent:h,page:o,defaultSorted:g})})};Ie.propTypes={header:C.oneOfType([C.element,C.string]).isRequired,entityType:C.string};Ie.defaultProps={entityType:""};const Dr=q`
    query nodesWithFailingControls($query: String) {
        executedControls(query: $query) {
            complianceControl {
                id
                name
                complianceControlFailingNodes {
                    id
                    name
                    clusterName
                }
                complianceControlPassingNodes {
                    id
                    name
                    clusterName
                }
            }
            controlStatus
        }
    }
`,kr=s=>{const t=Object.keys(s).reduce((a,o)=>{const n=s[o];return a[`${o} Id`]=n,a},{});return w.objectToWhereClause(t)},Mr=s=>{const t=s.reduce((a,o)=>[...a,...o.complianceControl.complianceControlFailingNodes],[]);return Rt(t,"id").map(a=>({...a,passing:!1}))},Fr=s=>{const t=s.reduce((a,o)=>[...a,...o.complianceControl.complianceControlPassingNodes],[]);return Rt(t,"id").map(a=>({...a,passing:!0}))},Ys=s=>{const{entityType:t,entityContext:a}=s,{loading:o,error:n,data:r}=At(Dr,{variables:{query:kr(a)},fetchPolicy:"no-cache"});if(o)return e.jsx("div",{className:"flex flex-1 items-center justify-center p-6",children:e.jsx(B,{})});if(n&&wn.captureException(n),!r)return null;const{executedControls:l=[]}=r;if(l.length===0)return e.jsx(Z,{message:`No nodes failing ${t===j.CONTROL?"this control":"any controls"}`,className:"p-6",icon:"info"});const i=Mr(l),u=Fr(l),c=i.length,d=u.length;if(d&&!c)return e.jsx(Z,{message:`No nodes failing ${t===j.CONTROL?"this control":"any controls"}`,className:"p-3 shadow",icon:"info"});if(!d&&!c)return e.jsx(Z,{message:`Findings ${a[j.CONTROL]?"for this control":"across controls"} could not be assessed`,className:"p-3 shadow",icon:"warn"});const m=`${c} ${c===1?"node is":"nodes are"} ${t===j.CONTROL?"failing this control":"failing controls"}`;return e.jsx(Ie,{entityType:j.NODE,header:m,rows:i,noDataText:"No Nodes",className:"bg-base-100 w-full",columns:Gn[j.NODE],idAttribute:"id",defaultSorted:[{id:"name",desc:!1}]})};Ys.propTypes={entityType:C.string.isRequired,entityContext:C.shape({}).isRequired};const _r=q`
    query violations($query: String) {
        violations(query: $query) {
            time
            deployment {
                id
                name
                clusterName
                namespace
            }
            policy {
                id
                name
                severity
                categories
            }
        }
    }
`,ke=({header:s,isCollapsible:t,children:a,isCollapsibleOpen:o,hasTitleBorder:n})=>{const[r,l]=I.useState(o);function i(){t&&l(c=>!c)}const u={opened:e.jsx(ja,{className:`bg-base-200 border border-base-400 mr-4 rounded-full ${t?"":"invisible"}`,size:"14"}),closed:e.jsx(_t,{className:`bg-base-200 border border-base-400 mr-4 rounded-full ${t?"":"invisible"}`,size:"14"})};return e.jsxs("div",{className:`${n?"border-b":""} border-base-300 w-full`,children:[e.jsx("button",{type:"button",className:`flex flex-1 w-full ${t?"cursor-pointer hover:bg-primary-100":"cursor-auto"}`,onClick:i,children:e.jsxs("div",{className:`flex w-full p-3 ${r?"border-b border-base-300":""}`,children:[u[r?"opened":"closed"],s]})}),e.jsx(On,{isOpen:r,children:a})]})};ke.propTypes={header:C.node.isRequired,isCollapsible:C.bool,children:C.node.isRequired,isCollapsibleOpen:C.bool,hasTitleBorder:C.bool};ke.defaultProps={isCollapsible:!0,isCollapsibleOpen:!0,hasTitleBorder:!0};const Yr=s=>{const{violations:t}=s;if(!t||!t.length)return[];const a=t.reduce((o,n)=>{const{deployment:r,time:l,policy:i}=n,u=o[i.id]?o[i.id].deployments:[];return o[i.id]={...i,deployments:[...u,{time:l,...r}]},o},{});return Object.values(a)},Vs=({original:s,entityContext:t})=>{const{deployments:a}=s,o=wt[j.DEPLOYMENT](t),n=be(),r=D(),l=k();function i(u){const c=es(u,"id"),d=b.getURL(l,r).push(j.DEPLOYMENT,c).url();n(d)}return e.jsx(Ze,{rows:a,columns:o,onRowClick:i,idAttribute:"id",noDataText:"No results found. Please refine your search."})};Vs.propTypes={original:C.shape({deployments:C.arrayOf(C.shape({}))}).isRequired,entityContext:C.shape({})};Vs.defaultProps={entityContext:{}};const as=({query:s,message:t,entityContext:a})=>e.jsx(H,{query:_r,variables:{query:s},children:({loading:o,data:n})=>{if(o)return e.jsx(B,{});if(!n)return null;const r=Yr(n),l=Et(n.violations.map(c=>c.deployment)).length;if(l===0)return e.jsx(Z,{message:t,className:"p-3 shadow",icon:"info"});const i=`${l} deployments failed across ${r.length} policies`,u=[{Header:"Policy",headerClassName:$,className:x,accessor:"name",Cell:({original:c,pdf:d})=>{const{severity:m,categories:p,name:h}=c,f=e.jsxs("div",{className:"flex flex-1",children:[e.jsx("div",{className:"flex flex-1",children:h}),e.jsxs("div",{children:[e.jsxs("span",{children:["Severity:"," ",e.jsx(ss,{severity:m,isTextOnly:d})]}),e.jsx("span",{className:"pl-2 pr-2",children:"|"}),e.jsxs("span",{children:["Categories: ",p.join(",")]})]})]});return e.jsx(ke,{header:f,isCollapsibleOpen:!1,className:"z-20",hasTitleBorder:!1,children:e.jsx(Vs,{original:c,entityContext:a})},h)}}];return e.jsx(Ie,{header:i,rows:r,noDataText:"No deployments failing across policies",className:"w-full",columns:u,idAttribute:"id",id:"deployments-with-failed-policies",hasNestedTable:!0})}});as.propTypes={query:C.string,message:C.string,entityContext:C.shape({})};as.defaultProps={query:"",message:"",entityContext:{}};function Vr(s){return s===j.SERVICE_ACCOUNT?"serviceAccounts":s===j.ROLE?"k8sRoles":U(s.toLowerCase())}function we(s,t){if(!s||!t)return[];const a=Vr(t);return s[a]??[]}const Hs=({id:s,entityListType:t,entityId1:a,query:o,entityContext:n,pagination:r})=>{const l=I.useContext(G),i={...o[l]};t==="POLICY"&&(i["Lifecycle Stage"]="DEPLOY"),!i.Standard&&t==="CONTROL"&&(i.Standard="CIS");const u={id:s,query:w.objectToWhereClause(i),pagination:r},c=q`
        query getCluster($id: ID!) {
            cluster(id: $id) {
                id
                name
                admissionController
                centralApiEndpoint
                imageCount
                nodeCount
                deploymentCount
                namespaceCount
                subjectCount
                k8sRoleCount
                secretCount
                policyCount(query: "Lifecycle Stage:DEPLOY")
                serviceAccountCount
                complianceControlCount(query: "Standard:CIS") {
                    passingCount
                    failingCount
                    unknownCount
                }
                status {
                    orchestratorMetadata {
                        version
                        buildDate
                    }
                }
            }
        }
    `;function d(){if(!t)return c;const{listFieldName:m,fragmentName:p,fragment:h}=w.getFragmentInfo("CLUSTER",t,"configmanagement"),f=$e(t);return q`
            query getCluster_${t}(${t==="CONTROL"?"$id: ID!, $query: String":"$id: ID!, $query: String, $pagination: Pagination"}) {
                cluster(id: $id) {
                    id
                    ${m}(${t==="CONTROL"?"query: $query":"query: $query, pagination: $pagination"}) { ...${p} }
                    ${f}
                }
            }
            ${h}
        `}return e.jsx(H,{query:d(),variables:u,fetchPolicy:"network-only",children:({loading:m,data:p})=>{var K;if(ae(m,p))return e.jsx(B,{});const{cluster:h}=p;if(!h)return e.jsx(te,{resourceType:"CLUSTER",useCase:"configmanagement"});const{complianceResults:f=[]}=h;if(t){let W=we(h,t);return t==="CONTROL"?W=un(f):t==="SUBJECT"&&(W=W.map(X=>{var Ee;return{...X,subjectWithClusterID:((Ee=X==null?void 0:X.subject)==null?void 0:Ee.subjectWithClusterID)??[]}})),e.jsx(re,{entityListType:t,entityId:a,data:W,totalResults:(K=p==null?void 0:p.cluster)==null?void 0:K.count,entityContext:{...n,CLUSTER:s},query:o})}if(!h.status)return null;const{name:g,nodeCount:y,deploymentCount:N,namespaceCount:S,subjectCount:P,serviceAccountCount:R,k8sRoleCount:A,secretCount:T,imageCount:E,complianceControlCount:v,status:{orchestratorMetadata:L=null}}=h,{version:Q="N/A"}=L,Se=[{key:"K8s version",value:Q}],{passingCount:ve,failingCount:le,unknownCount:Me}=v,Fe=ve+le+Me;return e.jsxs("div",{className:"w-full",id:"capture-dashboard-stretch",children:[e.jsx(V,{title:"Cluster Summary",children:e.jsxs("div",{className:"flex flex-wrap pdf-page",children:[e.jsx(je,{className:"mx-4 min-w-48 bg-base-100 min-h-48 mb-4",keyValuePairs:Se}),e.jsx(F,{className:"mx-4 min-w-48 min-h-48 mb-4",name:"Nodes",value:y,entityType:"NODE"}),e.jsx(F,{className:"mx-4 min-w-48 min-h-48 mb-4",name:"Namespaces",value:S,entityType:"NAMESPACE"}),e.jsx(F,{className:"mx-4 min-w-48 min-h-48 mb-4",name:"Deployments",value:N,entityType:"DEPLOYMENT"}),e.jsx(F,{className:"mx-4 min-w-48 min-h-48 mb-4",name:"Secrets",value:T,entityType:"SECRET"}),e.jsx(F,{className:"mx-4 min-w-48 min-h-48 mb-4",name:"Images",value:E,entityType:"IMAGE"}),e.jsx(F,{className:"mx-4 min-w-48 min-h-48 mb-4",name:"Users & Groups",value:P,entityType:"SUBJECT"}),e.jsx(F,{className:"mx-4 min-w-48 min-h-48 mb-4",name:"Service Accounts",value:R,entityType:"SERVICE_ACCOUNT"}),e.jsx(F,{className:"mx-4 min-w-48 min-h-48 mb-4",name:"Roles",value:A,entityType:"ROLE"}),e.jsx(F,{className:"mx-4 min-w-48 min-h-48 mb-4",name:"CIS Controls",value:Fe,entityType:"CONTROL"})]})}),e.jsx(V,{title:"Cluster Findings",children:e.jsx("div",{className:"flex pdf-page pdf-stretch relative rounded mb-4 ml-4 mr-4",children:e.jsxs(Bn,{children:[e.jsx(Ct,{title:"Policies",children:e.jsx(as,{query:w.objectToWhereClause({Cluster:g}),message:"No deployments violating policies in this cluster",entityContext:{...n,CLUSTER:s}})}),e.jsx(Ct,{title:"CIS Controls",children:e.jsx(Ys,{entityType:"CLUSTER",entityContext:{...n,CLUSTER:s}})})]})})})]})}})};Hs.propTypes=ge;Hs.defaultProps=xe;const Hr=q`
    query getControl($id: ID!, $where: String) {
        results: complianceControl(id: $id) {
            interpretationText
            description
            id
            name
            standardId
            complianceControlNodes {
                name
                clusterName
                id
                clusterId
                osImage
                containerRuntimeVersion
                joinedAt
                nodeComplianceControlCount(query: $where) {
                    failingCount
                    passingCount
                    unknownCount
                }
            }
        }
    }
`,Gs=({id:s,entityListType:t,query:a,entityContext:o})=>{const n=D(),r=k(),l=I.useContext(G),i={id:s,where:w.objectToWhereClause({...a[l],"Control Id":s})};return e.jsx(H,{query:Hr,variables:i,fetchPolicy:"network-only",children:({loading:u,data:c})=>{if(ae(u,c))return e.jsx(B,{});if(!c||!c.results)return e.jsx(te,{resourceType:"CONTROL",useCase:"configmanagement"});const{results:d}=c,{complianceControlNodes:m}=d;if(t)return e.jsx(ns,{match:r,location:n,data:m,totalResults:m==null?void 0:m.length,entityContext:{...o,CONTROL:s}});const{standardId:p="",name:h="",description:f="",interpretationText:g=""}=d;return e.jsxs("div",{className:"w-full",id:"capture-dashboard-stretch",children:[e.jsx(V,{title:"Control Summary",children:e.jsxs("div",{className:"flex flex-wrap pdf-page",children:[e.jsx(sa,{standardId:p,control:h,description:f,className:"mx-4 min-w-48 min-h-48 mb-4"}),!!g.length&&e.jsx(Y,{className:"mx-4 min-w-48 min-h-48 mb-4 w-1/3 overflow-auto",header:"Control guidance",children:e.jsx("div",{className:"p-4 leading-loose whitespace-pre-wrap overflow-auto",children:g})}),e.jsx(F,{className:"mx-4 min-w-48 min-h-48 mb-4",name:"Nodes",value:m.length,entityType:"NODE"})]})}),!(o&&o.NODE)&&e.jsx(V,{title:"Control Findings",children:e.jsx("div",{className:"flex pdf-page pdf-stretch shadow relative rounded bg-base-100 mb-4 ml-4 mr-4",children:e.jsx(Ys,{entityType:"CONTROL",entityContext:{...o,CONTROL:s}})})})]})}})};Gs.propTypes=ge;Gs.defaultProps=xe;const Gr="data:image/svg+xml,%3csvg%20width='74'%20height='66'%20viewBox='0%200%2074%2066'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M1.76174%2035.8473L16.9172%2062.1449C17.9352%2063.9114%2019.819%2065%2021.8578%2065H52.1508C54.1897%2065%2056.0734%2063.9114%2057.0914%2062.1449L72.2469%2035.8473C73.2625%2034.085%2073.2625%2031.915%2072.2469%2030.1527L57.0914%203.85508C56.0734%202.08856%2054.1897%201%2052.1508%201L21.8578%201C19.819%201%2017.9352%202.08856%2016.9172%203.85508L1.76174%2030.1527C0.746086%2031.915%200.746086%2034.085%201.76174%2035.8473Z'%20fill='url(%23paint0_linear)'%20stroke='white'%20stroke-width='0.7128'/%3e%3cdefs%3e%3clinearGradient%20id='paint0_linear'%20x1='3.62773'%20y1='11.8951'%20x2='67.9634'%20y2='58.7076'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='%23E9F0FF'/%3e%3cstop%20offset='1'%20stop-color='%23C9DAFF'/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e",oe=({name:s,entityType:t,entityId:a,value:o,...n})=>{const r=be(),l=D(),i=k(),u=I.useContext(De);function c(){if(!a)return;let h;Tt.includes(u==null?void 0:u.useCase)?h=u.pushRelatedEntity(t,a).toUrl():h=b.getURL(i,l).push(t,a).url(),r(h)}const d=e.jsxs("div",{className:"h-full flex flex-col items-center justify-center",children:[e.jsxs("div",{className:"relative flex items-center justify-center mb-4",children:[e.jsx("img",{src:Gr,alt:"hexagonal"}),e.jsx(Ot,{className:"z-1 absolute",entityType:t})]}),e.jsx("div",{children:o})]}),m=c?e.jsx("button",{"data-testid":"related-entity-value",type:"button",className:"h-full w-full",onClick:c,children:d}):d,p=e.jsx("div",{"data-testid":"related-entity-title",children:s});return e.jsx(Y,{id:"related-entity",bodyClassName:"flex items-center justify-center",titleComponents:p,...n,children:m})};oe.propTypes={name:C.string,entityType:C.string.isRequired,entityId:C.string,value:C.string,link:C.string};oe.defaultProps={link:null,value:"",entityId:null,name:null};const Br=s=>!s.violations||!s.violations.length?null:s.violations[0],dn=({data:s,message:t})=>{const a=Br(s);let o=null;return a?o=e.jsxs("div",{className:"mx-4 grid-dense grid-auto-fit grid grid-gap-4 xl:grid-gap-6 mb-4 xxxl:grid-gap-8 grid-columns-1 md:grid-columns-2 lg:grid-columns-3 w-full",children:[e.jsx(Y,{header:"Time of Violation",className:"s-1",bodyClassName:"flex flex-col p-4 leading-normal",children:ee(a.time)}),e.jsx(Y,{header:"Enforcement",className:"s-1",bodyClassName:"flex flex-col p-4 leading-normal",children:a.policy.enforcementActions.join(", ")||"No Enforcement"}),e.jsx(Y,{header:"Category",className:"s-full lg:s-1",bodyClassName:"flex flex-col p-4 leading-normal",children:a.policy.categories.join(", ")}),e.jsx(Y,{header:"Violation",className:"s-full flex-1",bodyClassName:"flex flex-col p-4 leading-normal",children:e.jsx("ul",{className:"leading-loose",children:a.violations.map(n=>e.jsx("li",{className:"border-b border-base-300 py-2",children:n.message},n.message))})})]}):o=e.jsx(Z,{message:t,className:"p-3 shadow mb-4 mx-4 bg-base-100 rounded",icon:"info"}),e.jsx("div",{className:"flex w-full bg-transparent",children:o})};dn.propTypes={data:C.shape({}).isRequired,message:C.string.isRequired};const Qr=q`
    query violationsInDeployment($query: String) {
        violations(query: $query) {
            id
            time
            policy {
                id
                enforcementActions
                categories
            }
            violations {
                message
            }
        }
    }
`,Bs=({deploymentID:s,policyID:t,message:a})=>{const o={query:w.objectToWhereClause({"Deployment ID":s,"Policy ID":t})};return e.jsx(H,{query:Qr,variables:o,children:({loading:n,data:r})=>n?e.jsx(B,{}):r?e.jsx(dn,{data:r,message:a}):null})};Bs.propTypes={deploymentID:C.string.isRequired,policyID:C.string,message:C.string.isRequired};const Wr=q`
    query failedPolicies($query: String) {
        violations(query: $query) {
            id
            policy {
                id
                name
                severity
                enforcementActions
                categories
                lifecycleStages
            }
            time
        }
    }
`,Kr=s=>{const t=[];return s.violations.reduce((o,n)=>{const r={time:n.time,...n.policy};return[...o,r]},t)};function zr({deploymentID:s}){return s?e.jsx(H,{query:Wr,variables:{query:w.objectToWhereClause({"Deployment ID":s,"Lifecycle Stage":"DEPLOY"})},children:({loading:t,data:a})=>{if(t)return e.jsx(B,{});if(!a)return null;const o=Kr(a);if(o.length===0)return e.jsx(Z,{message:"No policies failed across this deployment",className:"p-3 shadow",icon:"info"});const n=`${o.length} policies failed across this deployment`,r=[{Header:"Id",headerClassName:"hidden",className:"hidden",accessor:"id"},{Header:"Policy",headerClassName:`w-1/5 ${$}`,className:`w-1/5 ${x}`,accessor:"name"},{Header:"Enforcing",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,Cell:({original:l})=>{const{enforcementActions:i}=l;return(i??[]).length>0?"Yes":"No"},accessor:"enforcementActions"},{Header:"Severity",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,Cell:({original:l,pdf:i})=>{const{severity:u}=l;return e.jsx(ss,{severity:u,isTextOnly:i})},accessor:"severity",sortMethod:Vt},{Header:"Categories",headerClassName:`w-1/5 ${$}`,className:`w-1/5 ${x}`,Cell:({original:l})=>{const{categories:i}=l;return i.join(", ")},accessor:"categories"},{Header:"Lifecycle Stage",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,Cell:({original:l})=>{const{lifecycleStages:i}=l;return Ps(i)},accessor:"lifecycleStages"},{Header:"Violation Time",headerClassName:`w-1/8 ${$}`,className:`w-1/8 ${x}`,Cell:({original:l})=>ee(l.time),accessor:"time"}];return e.jsx(Ie,{entityType:j.POLICY,header:n,rows:o,columns:r,className:"bg-base-100 w-full",idAttribute:"id",noDataText:"No failed policies."})}}):e.jsx(Ln,{error:new Error("Unable to show failed policies for this deployment."),message:"A required ID for this deployment was not provided!"})}function Jr({entityContext:s={},deploymentID:t}){return s[j.POLICY]?e.jsx(Bs,{deploymentID:t,policyID:s[j.POLICY],message:"No policies failed across this deployment"}):e.jsx("div",{className:"mx-4 w-full",children:e.jsx(zr,{deploymentID:t})})}const Qs=({id:s,entityContext:t,entityListType:a,query:o,pagination:n})=>{const r=I.useContext(G),l={id:s,query:w.objectToWhereClause(o[r]),pagination:n},i=q`
        query getDeployment($id: ID!, $query: String) {
            deployment(id: $id) {
                id
                annotations {
                    key
                    value
                }
                ${t.CLUSTER?"":"cluster { id name}"}
                hostNetwork: id
                imagePullSecrets
                inactive
                labels {
                    key
                    value
                }
                name
                ${t.NAMESPACE?"":"namespace namespaceId"}
                ports {
                    containerPort
                    exposedPort
                    exposure
                    exposureInfos {
                        externalHostnames
                        externalIps
                        level
                        nodePort
                        serviceClusterIp
                        serviceId
                        serviceName
                        servicePort
                    }
                    name
                    protocol
                }
                priority
                replicas
                ${t.SERVICE_ACCOUNT?"":"serviceAccount serviceAccountID"}
                failingPolicyCount(query: $query)

                tolerations {
                    key
                    operator
                    taintEffect
                    value
                }
                type
                created
                secretCount
                imageCount
            }
        }
    `;function u(){if(!a)return i;const{listFieldName:c,fragmentName:d,fragment:m}=w.getFragmentInfo("DEPLOYMENT",a,"configmanagement"),p=$e(a);return q`
            query getDeployment_${a}($id: ID!, $query: String, $pagination: Pagination) {
                deployment(id: $id) {
                    id
                    ${c}(query: $query, pagination: $pagination) { ...${d} }
                    ${p}
                }
            }
            ${m}
        `}return e.jsx(H,{query:u(),variables:l,fetchPolicy:"network-only",children:({loading:c,data:d})=>{var L;if(ae(c,d))return e.jsx(B,{});if(!d||!d.deployment)return e.jsx(te,{resourceType:"DEPLOYMENT",useCase:"configmanagement"});const{deployment:m}=d;if(a){const Q=a==="POLICY"?m.failingPolicies:we(m,a);return e.jsx(re,{entityListType:a,data:Q,totalResults:(L=d==null?void 0:d.deployment)==null?void 0:L.count,query:o,entityContext:{...t,DEPLOYMENT:s}})}const{cluster:p,created:h,type:f,replicas:g,labels:y=[],annotations:N=[],namespace:S,namespaceId:P,serviceAccount:R,serviceAccountID:A,imageCount:T,secretCount:E}=m,v=[{key:"Created",value:h?ee(h):"N/A"},{key:"Deployment Type",value:f},{key:"Replicas",value:g}];return e.jsxs("div",{className:"w-full",id:"capture-dashboard-stretch",children:[e.jsx(V,{title:"Deployment Summary",children:e.jsxs("div",{className:"flex mb-4 flex-wrap pdf-page",children:[e.jsx(je,{className:"mx-4 bg-base-100 min-h-48 mb-4",keyValuePairs:v,labels:y,annotations:N}),p&&e.jsx(oe,{className:"mx-4 min-w-48 min-h-48 mb-4",entityType:"CLUSTER",entityId:p.id,name:"Cluster",value:p.name}),S&&e.jsx(oe,{className:"mx-4 min-w-48 min-h-48 mb-4",entityType:"NAMESPACE",entityId:P,name:"Namespace",value:S}),R&&e.jsx(oe,{className:"mx-4 min-w-48 min-h-48 mb-4",entityType:"SERVICE_ACCOUNT",name:"Service Account",value:R,entityId:A}),e.jsx(F,{className:"mx-4 min-w-48 min-h-48 mb-4",name:"Images",value:T,entityType:"IMAGE"}),e.jsx(F,{className:"mx-4 min-w-48 min-h-48 mb-4",name:"Secrets",value:E,entityType:"SECRET"})]})}),e.jsx(V,{title:"Deployment Findings",children:e.jsx("div",{className:"flex mb-4 pdf-page pdf-stretch",children:e.jsx(Jr,{entityContext:t,deploymentID:s})})})]})}})};Qs.propTypes=ge;Qs.defaultProps=xe;const Ws=({id:s,entityListType:t,entityId1:a,query:o,entityContext:n,pagination:r})=>{const l=I.useContext(G),u={id:decodeURIComponent(s),query:w.objectToWhereClause({...o[l],"Lifecycle Stage":"DEPLOY"}),pagination:r},c=q`
        query getImage($id: ID!${t?", $query: String":""}) {
            image(id: $id) {
                id
                lastUpdated
                ${n.DEPLOYMENT?"":"deploymentCount"}
                metadata {
                    layerShas
                    v1 {
                        created
                        layers {
                            instruction
                            created
                            value
                        }
                    }
                    v2 {
                        digest
                    }
                }
                name {
                    fullName
                    registry
                    remote
                    tag
                }
                scan {
                    imageComponents {
                        name
                        layerIndex
                        version
                        imageVulnerabilities {
                            cve
                            cvss
                            link
                            summary
                        }
                    }
                }
            }
        }
    `;function d(){if(!t)return c;const{listFieldName:m,fragmentName:p,fragment:h}=w.getFragmentInfo("IMAGE",t,"configmanagement"),f=$e(t);return q`
            query getImage_${t}($id: ID!, $query: String, $pagination: Pagination) {
                image(id: $id) {
                    id
                    ${m}(query: $query, pagination: $pagination) { ...${p} }
                    ${f}
                }
            }
            ${h}
        `}return e.jsx(H,{query:d(),variables:u,fetchPolicy:"network-only",children:({loading:m,data:p})=>{var A;if(ae(m,p))return e.jsx(B,{});const{image:h}=p;if(!h)return e.jsx(te,{resourceType:"IMAGE",useCase:"configmanagement"});if(t)return e.jsx(re,{entityListType:t,entityId:a,data:we(h,t),totalResults:(A=p==null?void 0:p.image)==null?void 0:A.count,entityContext:{...n,IMAGE:s},query:o});const{lastUpdated:f,metadata:g,scan:y,deploymentCount:N}=h,S=[{key:"Last Scanned",value:f?ee(f):"N/A"}];function P(T){const E=T.original;return!E.components||E.components.length===0?null:e.jsx(Wn,{scan:E,containsFixableCVEs:!1,className:"cve-table my-3 ml-4 px-2 border-0 border-l-4 border-base-300"})}const R=g?Un(g.v1.layers):[];return y&&(R.forEach((T,E)=>{R[E].components=[]}),y.imageComponents.forEach(T=>{if(T.layerIndex!==void 0&&R[T.layerIndex]){const E={...T,vulns:T.imageVulnerabilities??[]};R[T.layerIndex].components.push(E)}}),R.forEach((T,E)=>{R[E].cvesCount=T.components.reduce((v,L)=>v+L.vulns.length,0)})),e.jsxs("div",{className:"w-full",id:"capture-dashboard-stretch",children:[e.jsx(V,{title:"Image Summary",children:e.jsxs("div",{className:"flex mb-4 flex-wrap pdf-page",children:[e.jsx(je,{className:"mx-4 bg-base-100 min-h-48 mb-4",keyValuePairs:S}),N&&e.jsx(F,{className:"mx-4 min-w-48 min-h-48 mb-4",name:"Deployments",value:N,entityType:"DEPLOYMENT"})]})}),e.jsx(V,{title:"Dockerfile",children:e.jsxs("div",{className:"flex pdf-page pdf-stretch shadow relative rounded bg-base-100 mb-4 ml-4 mr-4",children:[R.length===0&&e.jsx(Z,{message:"No layers available in this image",className:"p-6"}),R.length>0&&e.jsx(Ie,{header:`${R.length} layers across this image`,rows:R,noDataText:"No Layers",className:"bg-base-100",columns:Qn.IMAGE,SubComponent:P,idAttribute:"id"})]})})]})}})};Ws.propTypes=ge;Ws.defaultProps=xe;const Ks=({id:s,entityListType:t,entityId1:a,query:o,entityContext:n,pagination:r})=>{const l=I.useContext(G),i={id:s,query:w.objectToWhereClause({...o[l],"Lifecycle Stage":"DEPLOY"}),pagination:r},u=q`
        query getNamespace($id: ID!, $query: String) {
            namespace(id: $id) {
                metadata {
                    name
                    id
                    labels {
                        key
                        value
                    }
                    creationTime
                }
                cluster {
                    id
                    name
                }
                imageCount
                deploymentCount
                subjectCount
                k8sRoleCount
                serviceAccountCount
                secretCount
                policyCount(query: $query)
            }
        }
    `;function c(){if(!t)return u;const{listFieldName:d,fragmentName:m,fragment:p}=w.getFragmentInfo("NAMESPACE",t,"configmanagement"),h=$e(t);return q`
            query getNamespace_${t}($id: ID!, $query: String, $pagination: Pagination) {
                namespace(id: $id) {
                    metadata {
                        id
                    }
                    ${d}(query: $query, pagination: $pagination) { ...${m} }
                    ${h}
                }
            }
            ${p}
        `}return e.jsx(H,{query:c(),variables:i,fetchPolicy:"network-only",children:({loading:d,data:m})=>{var v;if(ae(d,m))return e.jsx(B,{});const{namespace:p}=m;if(!p)return e.jsx(te,{resourceType:"NAMESPACE",useCase:"configmanagement"});if(t)return e.jsx(re,{entityListType:t,entityId:a,data:we(p,t),totalResults:(v=m==null?void 0:m.namespace)==null?void 0:v.count,entityContext:{...n,NAMESPACE:s}});const{metadata:h={},cluster:f={},deploymentCount:g,secretCount:y,imageCount:N,serviceAccountCount:S,k8sRoleCount:P}=p,{name:R,creationTime:A,labels:T=[]}=h,E=[{key:"Created",value:A?ee(A):"N/A"}];return e.jsxs("div",{className:"w-full",id:"capture-dashboard-stretch",children:[e.jsx(V,{title:"Namespace Summary",children:e.jsxs("div",{className:"flex flex-wrap pdf-page",children:[e.jsx(je,{className:"mx-4 bg-base-100 min-h-48 mb-4",keyValuePairs:E,labels:T}),f&&e.jsx(oe,{className:"mx-4 min-w-48 min-h-48 mb-4",entityType:"CLUSTER",name:"Cluster",value:f.name,entityId:f.id}),e.jsx(F,{className:"mx-4 min-w-48 min-h-48 mb-4",name:"Deployments",value:g,entityType:"DEPLOYMENT"}),e.jsx(F,{className:"mx-4 min-w-48 min-h-48 mb-4",name:"Secrets",value:y,entityType:"SECRET"}),e.jsx(F,{className:"mx-4 min-w-48 min-h-48 mb-4",name:"Images",value:N,entityType:"IMAGE"}),e.jsx(F,{className:"mx-4 min-w-48 min-h-48 mb-4",name:"Service Accounts",value:S,entityType:"SERVICE_ACCOUNT"}),e.jsx(F,{className:"mx-4 min-w-48 min-h-48 mb-4",name:"Roles",value:P,entityType:"ROLE"})]})}),e.jsx(V,{title:"Namespace Findings",children:e.jsx("div",{className:"flex pdf-page pdf-stretch relative rounded mb-4 ml-4 mr-4",children:e.jsx(as,{query:w.objectToWhereClause({Cluster:f.name,Namespace:R}),message:"No deployments violating policies in this namespace",entityContext:{...n,NAMESPACE:s}})})})]})}})};Ks.propTypes=ge;Ks.defaultProps=xe;const zs=({id:s,entityListType:t,entityId1:a,query:o,entityContext:n,pagination:r})=>{const l=I.useContext(G),i={...o[l]};i.Standard||(i.Standard="CIS");const u={id:s,query:w.getEntityWhereClause(i),pagination:r},c=q`
        query getNode($id: ID!, $query: String) {
            node(id: $id) {
                id
                name
                clusterId
                clusterName
                containerRuntimeVersion
                externalIpAddresses
                internalIpAddresses
                joinedAt
                kernelVersion
                kubeletVersion
                osImage
                labels {
                    key
                    value
                }
                annotations {
                    key
                    value
                }
                complianceResults(query: $query) {
                    ...controlFields
                }
            }
        }
        ${Pa}
    `;return e.jsx(H,{query:c,variables:u,fetchPolicy:"network-only",children:({loading:d,data:m})=>{if(ae(d,m))return e.jsx(B,{});if(!m||!m.node)return e.jsx(te,{resourceType:"NODE",useCase:"configmanagement"});const{node:p}=m,{kernelVersion:h,kubeletVersion:f,osImage:g,labels:y=[],containerRuntimeVersion:N,joinedAt:S,clusterName:P,clusterId:R,annotations:A,complianceResults:T=[]}=p,E=[{key:"Kubelet Version",value:f},{key:"Kernel Version",value:h},{key:"Node OS",value:g},{key:"Runtime",value:N},{key:"Join time",value:S?ee(S):"N/A"}];if(t)return e.jsx(re,{entityListType:t,entityId:a,data:un(T),query:o,entityContext:{...n,NODE:s}});const v=T.filter(Q=>Q.value.overallState==="COMPLIANCE_STATE_FAILURE").map(Q=>({...Q,standard:Ce[Q.control.standardId],controlName:`${Q.control.name} - ${Q.control.description}`})),L=[{accessor:"id",Header:"id",headerClassName:"hidden",className:"hidden"},{accessor:"standard",sortMethod:hs,Header:"Standard",headerClassName:`w-1/5 ${$}`,className:`w-1/5 ${x}`},{accessor:"controlName",sortMethod:hs,Header:"Control",headerClassName:`w-1/2 ${$}`,className:`w-1/2 ${x}`}];return e.jsxs("div",{className:"w-full",id:"capture-dashboard-stretch",children:[e.jsx(V,{title:"Node Summary",children:e.jsxs("div",{className:"flex mb-4 flex-wrap pdf-page",children:[e.jsx(je,{className:"mx-4 bg-base-100 min-h-48 mb-4",keyValuePairs:E,labels:y,annotations:A}),!n.CLUSTER&&e.jsx(oe,{className:"mx-4 min-w-48 min-h-48 mb-4",name:"Cluster",entityType:"CLUSTER",value:P,entityId:R}),e.jsx(F,{className:"mx-4 min-w-48 min-h-48 mb-4",name:"CIS Controls",value:T.length,entityType:"CONTROL"})]})}),!(n&&n.CONTROL)&&e.jsx(V,{title:"Node Findings",children:e.jsxs("div",{className:"flex pdf-page pdf-stretch shadow relative rounded bg-base-100 mb-4 ml-4 mr-4",children:[v.length===0&&e.jsx(Z,{message:"No nodes failing controls on this node",className:"p-3 shadow",icon:"info"}),v.length>0&&e.jsx(Ie,{entityType:"CONTROL",header:`${v.length} controls failed across this node`,rows:v,noDataText:"No Controls",className:"bg-base-100",columns:L,idAttribute:"control.id",defaultSorted:[{id:"standard",desc:!1},{id:"controlName",desc:!1}]})]})})]})}})};zs.propTypes=ge;zs.defaultProps=xe;const Js=({className:s,alerts:t,entityContext:a})=>{if(!t||!t.length)return e.jsx(Z,{message:"No deployments violating this policy",className:"p-3 shadow",icon:"info"});const o=t,n=wt[j.DEPLOYMENT](a);return e.jsx(Ie,{header:`${o.length} ${U("Deployment",o.length)} with Violation(s)`,entityType:j.DEPLOYMENT,columns:n,rows:o,idAttribute:"id",noDataText:"No Deployments with Violation(s)",className:s,defaultSorted:[{id:"name",desc:!1}]})};Js.propTypes={className:C.string,alerts:C.arrayOf(C.shape({})),entityContext:C.shape({})};Js.defaultProps={className:"",alerts:[],entityContext:{}};const Xs=({entityContext:s={},policyId:t,alerts:a})=>s[j.DEPLOYMENT]?e.jsx(Bs,{deploymentID:s[j.DEPLOYMENT],policyID:t,message:"No deployments have failed across this policy"}):e.jsx("div",{className:"mx-4 w-full",children:e.jsx(Js,{className:"bg-base-100",alerts:a,entityContext:s})});Xs.propTypes={entityContext:C.shape({}),policyId:C.string.isRequired,alerts:C.arrayOf(C.shape({})).isRequired};Xs.defaultProps={entityContext:{}};const Zs=({id:s,entityListType:t,entityId1:a,query:o,entityContext:n,pagination:r})=>{const i=qn()("policy-management"),u=I.useContext(G),c={id:s,query:w.objectToWhereClause({...o[u],"Policy Id":s,"Lifecycle Stage":"DEPLOY"}),pagination:r},d=q`
        query getPolicy($id: ID!) {
            policy(id: $id) {
                id
                description
                lifecycleStages
                categories
                disabled
                enforcementActions
                rationale
                remediation
                severity
                exclusions {
                    name
                }
                deploymentCount
                alerts {
                    id
                    deployment {
                        id
                        name
                        clusterName
                        namespace
                    }
                    enforcement {
                        action
                        message
                    }
                    policy {
                        id
                        severity
                    }
                    time
                }
            }
        }
    `;function m(){if(!t)return d;const{listFieldName:p,fragmentName:h,fragment:f}=w.getFragmentInfo("POLICY",t,"configmanagement"),g=$e(t);return q`
            query getPolicy_${t}($id: ID!, $query: String, $pagination: Pagination) {
                policy(id: $id) {
                    id
                    ${p}(query: $query, pagination: $pagination){ ...${h} }
                    ${g}
                }
            }
            ${f}
        `}return e.jsx(H,{query:m(),variables:c,fetchPolicy:"network-only",children:({loading:p,data:h})=>{var le;if(ae(p,h))return e.jsx(B,{});const{policy:f}=h;if(!f)return e.jsx(te,{resourceType:"POLICY",useCase:"configmanagement"});if(t)return e.jsx(re,{entityListType:t,entityId:a,data:we(f,t),totalResults:(le=h==null?void 0:h.policy)==null?void 0:le.count,query:o,entityContext:{...n,POLICY:s}});const{lifecycleStages:g=[],categories:y=[],severity:N="",description:S="",rationale:P,remediation:R,disabled:A,enforcementActions:T,exclusions:E=[],alerts:v=[],deploymentCount:L}=f,Q=[{key:"Lifecycle Stage",value:Ps(g)},{key:"Severity",value:e.jsx(ss,{severity:N,isTextOnly:!1})},{key:"Enforced",value:T?"Yes":"No"},{key:"Enabled",value:A?"No":"Yes"}],Se=v.reduce((Me,Fe)=>{const K={time:Fe.time,...Fe.deployment};return[...Me,K]},[]),ve=i?e.jsx(Re,{className:"no-underline text-base-600 mx-4 btn btn-base",to:`${Dn}/${s}`,children:"View policy"}):null;return e.jsxs("div",{className:"w-full",id:"capture-dashboard-stretch",children:[e.jsx(V,{title:"Policy Summary",headerComponents:ve,children:e.jsxs("div",{className:"grid grid-gap-6 grid-columns-4 mx-4 grid-dense mb-4 pdf-page",children:[e.jsx(je,{className:"sx-2 bg-base-100 min-h-48 h-full",keyValuePairs:Q,exclusions:E}),e.jsx(F,{className:"mx-4 min-w-48 min-h-48 h-full mb-4",name:"Deployments",value:L,entityType:"DEPLOYMENT"}),e.jsx(Y,{className:"sx-1 min-h-48 h-full",bodyClassName:"leading-normal p-4",header:"Categories",children:y.join(", ")}),e.jsx(Y,{className:"sx-1 min-h-48 h-full",bodyClassName:"leading-normal p-4",header:"Description",children:S}),e.jsxs(Y,{className:"sx-2 min-h-48 h-full",bodyClassName:"leading-normal",header:"Remediation",children:[e.jsx("div",{className:"p-4 border-r border-base-300",children:R}),e.jsxs("div",{className:"p-4",children:[e.jsx("span",{className:"font-700",children:"Rationale: "}),e.jsx("span",{children:P})]})]})]})}),e.jsx(V,{title:"Policy Findings",dataTestId:"policy-findings-section",children:e.jsx("div",{className:"flex mb-4 pdf-page pdf-stretch",children:e.jsx(Xs,{entityContext:n,policyId:s,alerts:Se})})})]})}})};Zs.propTypes=ge;Zs.defaultProps=xe;const et=({permissions:s})=>s.map(t=>e.jsxs("div",{className:"flex border-b border-base-300",children:[e.jsxs("div",{className:"w-43 border-r border-base-300 px-2 py-3 text-sm flex",children:[t.key==="*"?"* (All verbs)":e.jsx("span",{className:"capitalize",children:t.key}),":"]}),e.jsx("div",{className:"w-full px-2 py-3 text-sm leading-normal",children:t.values.includes("*")?"* (All resources)":t.values.join(", ")})]},t.key)),st=({rules:s,...t})=>{let a=e.jsx(Z,{message:"No Permissions",className:"p-6"}),o="Permissions across this cluster";if(s&&s.length){const n=s.reduce((l,i)=>(i.verbs.forEach(u=>{l[u]=[...l[u]??[],...i.resources,...i.nonResourceUrls]}),l),{}),r=Object.keys(n).map(l=>{const i=n[l];return{key:l,values:i}});r.length>0&&(o=`${r.length} Permissions across this cluster`,a=e.jsx(et,{permissions:r}))}return e.jsx(Y,{header:o,...t,children:e.jsx("div",{className:"w-full",children:a})})};st.propTypes={rules:C.arrayOf(C.shape({}))};st.defaultProps={rules:null};const tt=({rules:s,...t})=>{let a=e.jsx(Z,{message:"No rules",className:"p-6"}),o="0 Rules";if(s&&s.length>0){o=`${s.length>0?s.length:""} Rules`;const n=s.map((l,i)=>e.jsxs("li",{className:"flex items-center",children:[e.jsx("div",{className:"min-w-48 text-sm bg-base-200 border border-base-400 my-3 p-3 rounded w-full leading-normal",children:l.verbs.includes("*")?"* (All verbs)":l.verbs.join(", ")}),e.jsx(As,{className:"h-4 w-4 text-base-500 mx-4"})]},i)),r=s.map((l,i)=>{const{nonResourceUrls:u,resources:c}=l,d=[...c,...u];return e.jsx("li",{className:"flex items-center",children:e.jsx("div",{className:"text-sm bg-base-200 border border-base-400 my-3 p-3 rounded leading-normal",children:d.includes("*")?"* (All resources)":d.join(", ")})},i)});a=e.jsxs("div",{className:"flex",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"font-700 border-b border-base-300 text-sm justify-left flex p-2 px-3",children:"Verbs"}),e.jsx("ul",{className:"p-3",children:n})]}),e.jsxs("div",{children:[e.jsx("h1",{className:"font-700 border-b border-base-300 text-sm justify-left flex p-2 px-3",children:"Resources and Non-resource URLs"}),e.jsx("ul",{className:"p-3",children:r})]})]})}return e.jsx(Y,{header:o,...t,children:a})};tt.propTypes={rules:C.arrayOf(C.shape({}))};tt.defaultProps={rules:null};const nt=({id:s,entityListType:t,entityId1:a,query:o,entityContext:n,pagination:r})=>{const l=I.useContext(G),i={id:s,query:w.objectToWhereClause(o[l]),pagination:r},u=q`
        query getRole($id: ID!${t?", $query: String":""}) {
            k8sRole(id: $id) {
                id
                name
                type
                verbs
                createdAt
                ${n.NAMESPACE?"":`roleNamespace {
                    metadata {
                        id
                        name
                    }
                }`}
                serviceAccountCount
                subjectCount
                rules {
                    apiGroups
                    nonResourceUrls
                    resourceNames
                    resources
                    verbs
                }
                ${n.CLUSTER?"":"clusterId clusterName"}
            }
        }
    `;function c(){if(!t)return u;const{listFieldName:d,fragmentName:m,fragment:p}=w.getFragmentInfo("ROLE",t,"configmanagement"),h=$e(t);return q`
            query getRole_${t}($id: ID!, $query: String, $pagination: Pagination) {
                    k8sRole(id: $id) {
                        id
                        ${d}(query: $query, pagination: $pagination) { ...${m} }
                        ${h}
                    }

            }
            ${p}
        `}return e.jsx(H,{query:c(),variables:i,fetchPolicy:"network-only",children:({loading:d,data:m})=>{if(ae(d,m))return e.jsx(B,{});const{k8sRole:p}=m;if(t)return e.jsx(re,{entityListType:t,entityId:a,data:we(p,t),totalResults:p.count,entityContext:{...n,ROLE:s},query:o});const{type:h,createdAt:f,roleNamespace:g,serviceAccountCount:y,subjectCount:N,labels:S=[],annotations:P=[],rules:R,clusterName:A,clusterId:T}=p;let E,v;g&&(E=g.metadata.name,v=g.metadata.id);const L=[{key:"Role Type",value:h},{key:"Created",value:f?ee(f):"N/A"}];return e.jsxs("div",{className:"w-full",children:[e.jsx(V,{title:"Role Summary",children:e.jsxs("div",{className:"flex mb-4 flex-wrap",children:[e.jsx(je,{className:"mx-4 bg-base-100 min-h-48 mb-4",keyValuePairs:L,labels:S,annotations:P}),A&&e.jsx(oe,{className:"mx-4 min-w-48 min-h-48 mb-4",entityType:"CLUSTER",name:"Cluster",value:A,entityId:T}),g&&e.jsx(oe,{className:"mx-4 min-w-48 min-h-48 mb-4",entityType:"NAMESPACE",name:"Namespace Scope",value:E,entityId:v}),e.jsx(F,{className:"mx-4 min-w-48 min-h-48 mb-4",name:"Users & Groups",value:N,entityType:"SUBJECT"}),e.jsx(F,{className:"mx-4 min-w-48 min-h-48 mb-4",name:"Service Accounts",value:y,entityType:"SERVICE_ACCOUNT"})]})}),e.jsx(V,{title:"Role Permissions And Rules",children:e.jsxs("div",{className:"flex mb-4",children:[e.jsx(st,{rules:R,className:"mx-4 bg-base-100"}),e.jsx(tt,{rules:R,className:"mx-4 bg-base-100"})]})})]})}})};nt.propTypes=ge;nt.defaultProps=xe;const at=({metadata:s})=>{if(!s)return null;const{startDate:t,endDate:a,issuer:o,sans:n,subject:r}=s,{commonName:l="N/A",names:i,organizationUnit:u="N/A"}=o??{},{commonName:c="N/A",names:d}=r??{};return e.jsxs("div",{className:"flex flex-row",children:[e.jsxs(Y,{header:"Timeframe",className:"m-4",bodyClassName:"flex flex-col p-4 leading-normal",children:[e.jsxs("div",{children:[e.jsx("span",{className:"font-700 mr-4",children:"Start Date:"}),e.jsx("span",{children:t?ee(t):"N/A"})]}),e.jsxs("div",{children:[e.jsx("span",{className:"font-700 mr-4",children:"End Date:"}),e.jsx("span",{children:a?ee(a):"N/A"})]})]}),e.jsxs(Y,{header:"Issuer",className:"m-4",bodyClassName:"flex flex-col p-4 leading-normal",children:[e.jsxs("div",{children:[e.jsx("span",{className:"font-700 mr-4",children:"Common Name:"}),e.jsx("span",{children:l})]}),e.jsxs("div",{children:[e.jsx("span",{className:"font-700 mr-4",children:"Name(s):"}),e.jsx("span",{children:Array.isArray(i)&&i.length!==0?i.join(", "):"None"})]}),e.jsxs("div",{children:[e.jsx("span",{className:"font-700 mr-4",children:"Organization Unit:"}),e.jsx("span",{children:u})]})]}),e.jsxs(Y,{header:"Subject",className:"m-4",bodyClassName:"flex flex-col p-4 leading-normal",children:[e.jsxs("div",{children:[e.jsx("span",{className:"font-700 mr-4",children:"Common Name:"}),e.jsx("span",{children:c})]}),e.jsxs("div",{children:[e.jsx("span",{className:"font-700 mr-4",children:"Name(s):"}),e.jsx("span",{children:Array.isArray(d)&&d.length!==0?d.join(", "):"None"})]})]}),Array.isArray(n)&&n.length!==0&&e.jsx(Y,{header:"SANS",className:"m-4",bodyClassName:"flex flex-col p-4 leading-normal",children:e.jsxs("div",{children:[e.jsx("span",{className:"font-700 mr-4",children:"SANS:"}),e.jsx("span",{children:n.join(", ")})]})})]})};at.propTypes={metadata:C.shape()};at.defaultProps={metadata:null};const mn=({files:s})=>{const t=s.filter(r=>!r.metadata||r.metadata&&r.metadata.__typename!=="ImagePullSecret"),a=t.length,o=`${a} ${U("value",a)}`,n=t.map(r=>{const{name:l,type:i,metadata:u}=r,{algorithm:c}=u??{},d=e.jsxs("div",{className:"flex flex-1 w-full",children:[e.jsx("div",{className:"flex flex-1",children:l}),i&&e.jsx("div",{className:"border-l border-base-400 px-2 capitalize",children:i.replace(/_/g," ").toLowerCase()}),c&&e.jsx("div",{className:"border-l border-base-400 px-2",children:c})]});return e.jsx(ke,{header:d,isCollapsible:!!u,children:e.jsx(at,{metadata:u})},l)});return e.jsx(Y,{header:o,bodyClassName:"flex flex-col",children:n})};mn.propTypes={files:C.arrayOf(C.shape).isRequired};const rt=({id:s,entityListType:t,entityId1:a,query:o,entityContext:n,pagination:r})=>{const l=I.useContext(G),i={id:s,query:w.objectToWhereClause({...o[l]}),pagination:r},u=q`
        query getSecret($id: ID!) {
            secret(id: $id) {
                id
                name
                createdAt
                files {
                    name
                    type
                    metadata {
                        __typename
                        ... on Cert {
                            endDate
                            startDate
                            algorithm
                            issuer {
                                commonName
                                names
                            }
                            subject {
                                commonName
                                names
                            }
                            sans
                        }
                        ... on ImagePullSecret {
                            registries {
                                name
                                username
                            }
                        }
                    }
                }
                namespace
                deploymentCount
                labels {
                    key
                    value
                }
                annotations {
                    key
                    value
                }
                ${n.CLUSTER?"":"clusterId clusterName"}
            }
        }
    `;function c(){if(!t)return u;const{listFieldName:d,fragmentName:m,fragment:p}=w.getFragmentInfo("SECRET",t,"configmanagement"),h=$e(t);return q`
            query getSecret_${t}($id: ID!, $query: String, $pagination: Pagination) {
                secret(id: $id) {
                    id
                    ${d}(query: $query, pagination: $pagination) { ...${m} }
                    ${h}
                }
            }
            ${p}
        `}return e.jsx(H,{query:c(),variables:i,fetchPolicy:"network-only",children:({loading:d,data:m})=>{var A;if(ae(d,m))return e.jsx(B,{});if(!m||!m.secret)return e.jsx(te,{resourceType:"SECRET",useCase:"configmanagement"});const{secret:p}=m;if(t)return e.jsx(re,{entityListType:t,entityId:a,data:we(p,t),totalResults:(A=m==null?void 0:m.secret)==null?void 0:A.count,query:o});const{createdAt:h,labels:f=[],annotations:g=[],deploymentCount:y,clusterName:N,clusterId:S,files:P=[]}=p,R=[{key:"Created",value:h?ee(h):"N/A"}];return e.jsxs("div",{className:"w-full",id:"capture-dashboard-stretch",children:[e.jsx(V,{title:"Secret Summary",children:e.jsxs("div",{className:"flex mb-4 flex-wrap pdf-page",children:[e.jsx(je,{className:"mx-4 bg-base-100 min-h-48 mb-4",keyValuePairs:R,labels:f,annotations:g}),N&&e.jsx(oe,{className:"mx-4 min-w-48 min-h-48 mb-4",entityType:"CLUSTER",name:"Cluster",value:N,entityId:S}),e.jsx(F,{className:"mx-4 min-w-48 min-h-48 mb-4",name:"Deployments",value:y,entityType:"DEPLOYMENT"})]})}),e.jsx(V,{title:"Secret Values",children:e.jsx("div",{className:"flex pdf-page pdf-stretch mb-4 ml-4 mr-4",children:e.jsx(mn,{files:P})})})]})}})};rt.propTypes=ge;rt.defaultProps=xe;const pn=s=>{const t=s.filter(n=>n.scope==="Cluster");let a=null;const o=t.reduce((n,r)=>[...n,...r.permissions],[]);return a=e.jsx(et,{permissions:o}),o.length===0&&(a=e.jsx(Z,{message:"No permissions available",className:"p-3 shadow"})),a},Xr=s=>s.map(({clusterId:t,clusterName:a,scopedPermissions:o})=>{const n=a,r=pn(o);return e.jsx(ke,{header:n,children:r},t)}),rs=({scopedPermissionsByCluster:s,...t})=>{let a=null;if(!s||!s.length)a=e.jsx(Z,{message:"No permissions available",className:"p-3 shadow"});else if(s.length>1)a=Xr(s);else{const{scopedPermissions:n}=s[0];a=pn(n)}const o=s.length>1?"Cluster Permissions across all clusters":`Cluster Permissions in "${s[0]&&s[0].clusterName}" cluster`;return e.jsx(Y,{header:o,...t,children:e.jsx("div",{className:"w-full",children:a})})};rs.propTypes={scopedPermissionsByCluster:C.arrayOf(C.shape({clusterId:C.string.isRequired,clusterName:C.string.isRequired,scopedPermissions:C.arrayOf(C.shape({}))}))};rs.defaultProps={scopedPermissionsByCluster:[]};const Cn=({permissions:s})=>{const t=s.reduce((o,n)=>(o[n.key]=(o[n.key]||0)+n.values.length,o),{}),a=Object.keys(t).map(o=>{const n=t[o];return e.jsxs("li",{className:"flex mr-2",children:[o," (",n,")"]},o)});return e.jsx("ul",{className:"flex text-sm capitalize",children:a})};Cn.propTypes={permissions:C.arrayOf(C.shape({key:C.string,values:C.arrayOf(C.string)})).isRequired};const hn=s=>s.scope!=="Cluster",fn=s=>{const a=s.filter(hn).map(({scope:n,permissions:r})=>{const l=e.jsxs("div",{className:"flex flex-1",children:[e.jsx("div",{className:"flex flex-1",children:n}),e.jsx("div",{children:e.jsx(Cn,{permissions:r})})]});return e.jsx(ke,{header:l,children:e.jsx(et,{permissions:r})},n)});return a.length?a:null},Zr=s=>s.filter(({scopedPermissions:t})=>t.filter(hn).length).map(({clusterId:t,clusterName:a,scopedPermissions:o})=>{const n=a,r=fn(o);return r?e.jsx(ke,{header:n,children:e.jsx("div",{className:"pl-4",children:r})},t):null}),os=({scopedPermissionsByCluster:s,...t})=>{let a=null;if(!s||!s.length)a=e.jsx(Z,{message:"No permissions available",className:"p-3 shadow"});else if(s.length>1)a=Zr(s);else{const{scopedPermissions:n}=s[0];a=fn(n)}(!a||!a.length)&&(a=e.jsx(Z,{message:"No permissions available",className:"p-3 shadow"}));const o=s.length>1?"Namespace Permissions across all clusters":`Namespace Permissions in "${s[0]&&s[0].clusterName}" cluster`;return e.jsx(Y,{header:o,...t,children:e.jsx("div",{className:"w-full",children:a})})};os.propTypes={scopedPermissionsByCluster:C.arrayOf(C.shape({clusterId:C.string.isRequired,clusterName:C.string.isRequired,scopedPermissions:C.arrayOf(C.shape({}))}))};os.defaultProps={scopedPermissionsByCluster:[]};const ot=({id:s,entityListType:t,entityId1:a,query:o,entityContext:n,pagination:r})=>{const l=I.useContext(G),i={id:s,query:w.objectToWhereClause({...o[l],"Lifecycle Stage":"DEPLOY"}),pagination:r},u=q`
        query getServiceAccount($id: ID!) {
            serviceAccount(id: $id) {
                id
                name
                saNamespace {
                    metadata {
                        id
                        name
                    }
                }
                clusterId
                clusterName
                deploymentCount
                k8sRoleCount
                automountToken
                createdAt
                labels {
                    key
                    value
                }
                annotations {
                    key
                    value
                }
                secrets: imagePullSecretObjects {
                    id
                    name
                }
                scopedPermissions {
                    scope
                    permissions {
                        key
                        values
                    }
                }
            }
        }
    `;function c(){if(!t)return u;const{listFieldName:d,fragmentName:m,fragment:p}=w.getFragmentInfo("SERVICE_ACCOUNT",t,"configmanagement"),h=$e(t);return q`
            query getServiceAccount_${t}($id: ID!, $query: String, $pagination: Pagination) {
                serviceAccount(id: $id) {
                    id
                    ${d}(query: $query, pagination: $pagination) { ...${m} }
                    ${h}
                }
            }
            ${p}
        `}return e.jsx(H,{query:c(),variables:i,fetchPolicy:"network-only",children:({loading:d,data:m})=>{var ve;if(ae(d,m))return e.jsx(B,{});const{serviceAccount:p}=m;if(!p)return e.jsx(te,{resourceType:"SERVICE_ACCOUNT",useCase:"configmanagement"});if(t){const le=t==="ROLE"?p.k8sRoles:we(p,t);return e.jsx(re,{entityListType:t,entityId:a,entityContext:{...n,SERVICE_ACCOUNT:s},data:le,totalResults:(ve=m==null?void 0:m.serviceAccount)==null?void 0:ve.count,query:o})}const{automountToken:h=!1,createdAt:f,labels:g=[],secrets:y=[],deploymentCount:N,k8sRoleCount:S,saNamespace:P,scopedPermissions:R=[],annotations:A,clusterName:T="",clusterId:E=""}=p;let v="",L;if(P){const{metadata:le}=P;v=le.name,L=le.id}const Q=[{key:"Automounted",value:h.toString()},{key:"Created",value:f?ee(f):"N/A"}],Se=[{clusterId:E,clusterName:T,scopedPermissions:R}];return e.jsxs("div",{className:"w-full",id:"capture-dashboard-stretch",children:[e.jsx(V,{title:"Service Account Summary",children:e.jsxs("div",{className:"flex mb-4 flex-wrap pdf-page",children:[e.jsx(je,{className:"mx-4 bg-base-100 min-h-48 mb-4",keyValuePairs:Q,labels:g,annotations:A,secrets:y}),!(n&&n.CLUSTER)&&e.jsx(oe,{className:"mx-4 min-w-48 min-h-48 mb-4",entityType:"CLUSTER",name:"Cluster",value:T,entityId:E}),!(n&&n.NAMESPACE)&&e.jsx(oe,{className:"mx-4 min-w-48 min-h-48 mb-4",entityType:"NAMESPACE",name:"Namespace",value:v,entityId:L}),e.jsx(F,{className:"mx-4 min-w-48 min-h-48 mb-4",name:"Deployments",value:N,entityType:"DEPLOYMENT"}),e.jsx(F,{className:"mx-4 min-w-48 min-h-48 mb-4",name:"Roles",value:S,entityType:"ROLE"})]})}),e.jsx(V,{title:"Service Account Permissions",children:e.jsxs("div",{className:"flex mb-4 pdf-page pdf-stretch",children:[e.jsx(rs,{scopedPermissionsByCluster:Se,className:"mx-4 bg-base-100 w-full"}),e.jsx(os,{scopedPermissionsByCluster:Se,className:"flex-grow mx-4 bg-base-100 w-full"})]})})]})}})};ot.propTypes=ge;ot.defaultProps=xe;const lt=({id:s,entityListType:t,entityId1:a,query:o,entityContext:n,pagination:r})=>{const l=I.useContext(G),i={id:decodeURIComponent(s),query:w.objectToWhereClause(o[l]),pagination:r},u=q`
        query getSubject($id: ID) {
            subject(id: $id) {
                id
                name
                kind
                namespace
                type
                scopedPermissions {
                    scope
                    permissions {
                        key
                        values
                    }
                }
                clusterName
                clusterId
                clusterAdmin
                k8sRoleCount
            }
        }
    `;function c(){if(!t)return u;const{fragment:d}=w.getFragmentInfo("SUBJECT",t,"configmanagement");return q`
            query getSubject_${t}($id: ID, $query: String, $pagination: Pagination) {
                subject(id: $id) {
                    id
                    name
                    kind
                    namespace
                    type
                    scopedPermissions {
                        scope
                        permissions {
                            key
                            values
                        }
                    }
                    k8sRoles(query: $query, pagination: $pagination) {
                       ...k8RoleFields
                    }
                    clusterAdmin
                    k8sRoleCount
                }
            }
            ${d}
        `}return e.jsx(H,{query:c(),variables:i,fetchPolicy:"network-only",children:({loading:d,data:m})=>{if(ae(d,m))return e.jsx(B,{});const p=m.subject,{clusterId:h,clusterName:f,scopedPermissions:g,type:y,clusterAdmin:N,k8sRoles:S,k8sRoleCount:P}=p;if(t){let T,E;switch(t){case"ROLE":T=S,E=P;break;default:T=[],E=0}return e.jsx(re,{entityListType:t,entityId:a,data:T,totalResults:E,query:o,entityContext:{...n,SUBJECT:s}})}const R=[{clusterId:h,clusterName:f,scopedPermissions:g}],A=[{key:"Role type",value:y},{key:"Cluster Admin Role",value:N?"Enabled":"Disabled"}];return e.jsxs("div",{className:"w-full",id:"capture-dashboard-stretch",children:[e.jsx(V,{title:"Subject Summary",children:e.jsxs("div",{className:"flex mb-4 flex-wrap pdf-page",children:[e.jsx(je,{className:"mx-4 bg-base-100 min-h-48 mb-4",keyValuePairs:A}),e.jsx(F,{className:"mx-4 min-w-48 min-h-48 mb-4",name:"Roles",value:P,entityType:"ROLE"})]})}),e.jsx(V,{title:"Subject Permissions",children:e.jsxs("div",{className:"flex mb-4 pdf-page pdf-stretch",children:[e.jsx(rs,{scopedPermissionsByCluster:R,className:"mx-4 bg-base-100"}),e.jsx(os,{scopedPermissionsByCluster:R,className:"flex-grow mx-4 bg-base-100"})]})})]})}})};lt.propTypes=ge;lt.defaultProps=xe;const eo={CLUSTER:Hs,CONTROL:Gs,DEPLOYMENT:Qs,IMAGE:Ws,NAMESPACE:Ks,NODE:zs,POLICY:Zs,ROLE:nt,SECRET:rt,SERVICE_ACCOUNT:ot,SUBJECT:lt},ls=({entityType:s,entityId:t,entityListType:a,...o})=>{const n=I.useContext(De),r=I.useContext(_e),l=n.paging[r.pageParam],i=n.sort[r.sortParam],u=qr(a),c=i||u,d=w.getPagination(c,l,ms),m=eo[s];return m?e.jsx("div",{className:`flex w-full h-full ${a?"bg-base-100":"bg-base-200"}`,children:e.jsx(m,{id:t,entityListType:a,pagination:d,...o})}):e.jsx(te,{resourceType:s,useCase:"configmanagement"})};ls.propTypes={entityType:C.string.isRequired,entityListType:C.string,entityId:C.string.isRequired,query:C.shape({})};ls.defaultProps={query:null,entityListType:void 0};const it=({entityType1:s,entityListType2:t,entityId2:a})=>{const o=D(),n=k();if(t||a){const r=b.getURL(n,o).pop().url();return e.jsx(Re,{className:"flex items-center justify-center text-base-600 border-r border-base-300 px-4 mr-4 h-full hover:bg-primary-200 w-16",to:r,"aria-label":"Go to preceding breadcrumb",children:e.jsx(Aa,{className:"h-6 w-6 text-600"})})}return e.jsx(Ot,{className:"flex items-center justify-center border-r border-base-300 px-4 mr-4 h-full w-16",entityType:s})};it.propTypes={entityType1:C.string,entityListType2:C.string,entityId2:C.string};it.defaultProps={entityType1:null,entityListType2:null,entityId2:null};const so=e.jsx(_t,{className:"bg-base-200 border border-base-400 mx-4 rounded-full",size:"14"}),to=({entityName:s,relatedEntityName:t,entityType1:a,entityId1:o,entityListType2:n,entityId2:r,entityType2:l})=>{const i=[];return a&&o&&i.push({name:s,type:ne[a]}),n&&i.push({name:U(ne[n]),type:"entity list"}),r&&i.push({name:t,type:ne[l]||ne[n]}),i},no=(s,t,a,o)=>{const n=o-1-a;if(!n||n<0)return null;const r=b.getURL(s,t);for(let l=0;l<n;l+=1)r.pop();return r.url()},ao=s=>{switch(s){case 1:return"max-w-full";case 2:return"max-w-1/2";case 3:return"max-w-1/3";case 4:return"max-w-1/4";case 5:return"max-w-1/5";case 6:return"max-w-1/6";case 7:return"max-w-1/7";case 8:return"max-w-1/8";case 9:return"max-w-1/9";case 10:return"max-w-1/10";default:return""}},Je=s=>{const t=D(),a=k(),{className:o,...n}=s,{entityType1:r,entityId1:l,entityListType2:i,entityId2:u}=n;if(!l)return null;const c=to(n),d=ao(c.length),m=c.map((p,h,{length:f})=>{const g=h!==f-1?so:null,y=no(a,t,h,f),N=p.type==="entity list"?We(p.name):p.name,S=y?e.jsx(Re,{className:"text-primary-700 underline truncate font-700",title:p.name,to:y,children:N}):e.jsx("span",{className:"w-full truncate",title:p.name,children:e.jsx("span",{className:"truncate font-700",children:N})});if(!p)return null;const P=We(p.type);return e.jsxs("div",{className:`flex ${d} truncate`,children:[e.jsxs("span",{className:"flex flex-col max-w-full","data-testid":"breadcrumb-link-text",children:[S,e.jsx("span",{children:P})]}),e.jsx("span",{className:"flex items-center",children:g})]},`${p.name}--${p.type}`)});return e.jsxs("span",{style:{flex:"10 1"},className:`flex items-center ${o}`,children:[e.jsx(it,{entityType1:r,entityListType2:i,entityId2:u}),m]})};Je.propTypes={className:C.string};Je.defaultProps={className:""};const ct=s=>{const{className:t,...a}=s,{entityType1:o,entityId1:n,entityType2:r,entityListType2:l,entityId2:i}=a,u=l||r,{loading:c,entityName:d}=Cs(o,n),{loading:m,entityName:p}=Cs(u,i);return!c&&!d?null:i?!m&&!p?null:e.jsx(Je,{...s,entityName:d,relatedEntityName:p}):e.jsx(Je,{...s,entityName:d})};ct.propTypes={className:C.string,entityType1:C.string,entityId1:C.string,entityType2:C.string,entityListType2:C.string,entityId2:C.string};ct.defaultProps={className:"",entityType1:null,entityId1:null,entityType2:null,entityListType2:null,entityId2:null};const is=({contextEntityType:s,contextEntityId:t,entityListType1:a,entityType1:o,entityId1:n,entityType2:r,entityListType2:l,entityId2:i,query:u})=>{const c=k(),d=D(),m=be(),p=ys(d),h=I.useContext(G),f=!n||l&&!i;function g(){return i||n}function y(){return r||i&&l||o||a||s}function N(){return f?l:null}function S(){return u[h]}function P(){m(b.getURL(c,d).clearSidePanelParams().url())}const R=g(),A=y(),T=N(),E=b.getURL(c,d).base(A,R).push(T).query().query(S()).url(),v=e.jsx("div",{className:"flex items-center h-full",children:e.jsx(Re,{to:E,"aria-label":"link",className:"border-base-400 border-l h-full p-4",children:e.jsx(kn,{})})}),L={};return s&&(L[s]=t),i&&(L[o||a]=n),e.jsx(De.Provider,{value:p,children:e.jsxs(Es,{testid:"side-panel",children:[e.jsxs(Ts,{children:[e.jsx(ct,{className:"leading-normal text-base-600 truncate",entityType1:o||a,entityId1:n,entityType2:r,entityListType2:l,entityId2:i}),e.jsxs(Rs,{children:[v,e.jsx(va,{onClose:P,className:"border-base-400 border-l"})]})]}),e.jsx(vs,{children:e.jsx(ls,{entityContext:L,entityType:A,entityId:R,entityListType:T,query:u})})]})})};is.propTypes={contextEntityType:C.string,contextEntityId:C.string,entityType1:C.string,entityListType1:C.string,entityId1:C.string,entityType2:C.string,entityListType2:C.string,entityId2:C.string,query:C.shape().isRequired};is.defaultProps={contextEntityType:null,contextEntityId:null,entityType1:null,entityListType1:null,entityId1:null,entityType2:null,entityListType2:null,entityId2:null};const ie=()=>{const s=I.useRef(null),t=D(),a=be(),o=k(),[n,r]=I.useState(!1),l=ys(t),{useCase:i,search:u,sort:c,paging:d}=l,m=new vt(i,l.getPageStack(),u,c,d),p=b.getParams(o,t),{pageEntityListType:h,entityId1:f,entityType2:g,entityListType2:y,entityId2:N,query:S}=p,P=I.useContext(G),R=I.useCallback(()=>{a(b.getURL(o,t).clearSidePanelParams().url())},[a,o,t]);Zt(s,R,!!f);function A(v){const L=b.getURL(o,t).push(v);a(L.url())}const T=We(U(ne[h])),E=`${U(Yt(T))} Report`;return e.jsxs(De.Provider,{value:m,children:[e.jsx(kt,{header:T,subHeader:"Entity list",classes:"pr-0 ignore-react-onclickoutside",children:e.jsxs("div",{className:"flex flex-1 justify-end h-full",children:[e.jsx("div",{className:"flex items-center",children:e.jsx(bs,{fileName:E,type:h,page:"configManagement",pdfId:"capture-list",isExporting:n,setIsExporting:r})}),e.jsx("div",{className:"flex items-center pl-2",children:e.jsx(Lt,{text:"All Entities",options:Pt()})})]})}),e.jsxs(Sa,{children:[e.jsx(_e.Provider,{value:Jt,children:e.jsx(re,{entityListType:h,entityId:f,onRowClick:A,query:S[P]})}),e.jsx(G.Provider,{value:Ns.sidePanel,children:e.jsx(_e.Provider,{value:Xt,children:e.jsx(Ut,{isOpen:!!f,children:e.jsx("div",{ref:s,children:e.jsx(is,{entityType1:h,entityId1:f,entityType2:g,entityListType2:y,entityId2:N,query:S})})})})})]}),n&&e.jsx(js,{})]})},ut=({entityType:s,entityId:t,urlParams:a,isExporting:o,setIsExporting:n})=>{const r=decodeURIComponent(t),{entityName:l}=Cs(s,r),i=l||"-",u=We(ne[s]),c=`${Yt(u)} Report: "${i}"`;let d="capture-dashboard-stretch";return a&&a.entityListType1&&(d="capture-list"),e.jsx(kt,{header:i,subHeader:u,classes:"z-1 pr-0 ignore-react-onclickoutside",children:e.jsxs("div",{className:"flex flex-1 justify-end h-full",children:[e.jsx("div",{className:"flex items-center",children:e.jsx(bs,{fileName:c,type:s,page:"configManagement",pdfId:d,isExporting:o,setIsExporting:n})}),e.jsx("div",{className:"flex items-center pl-2",children:e.jsx(Lt,{text:"All Entities",options:Pt()})})]})})};ut.propTypes={entityType:C.string.isRequired,entityId:C.string.isRequired,urlParams:C.shape({entityListType1:C.string}),isExporting:C.bool.isRequired,setIsExporting:C.func.isRequired};ut.defaultProps={urlParams:null};const se={OVERVIEW:"Overview",POLICIES:"Policies & CIS Controls",VIOLATIONS_AND_FINDINGS:"Violations & Findings",APPLICATION_RESOURCES:"Application & Infrastructure Resources",RBAC_CONFIG:"Role-Based Access Control"},ro={[j.ROLE]:se.RBAC_CONFIG,[j.SUBJECT]:se.RBAC_CONFIG,[j.SERVICE_ACCOUNT]:se.RBAC_CONFIG,[j.DEPLOYMENT]:se.APPLICATION_RESOURCES,[j.SECRET]:se.APPLICATION_RESOURCES,[j.NODE]:se.APPLICATION_RESOURCES,[j.CLUSTER]:se.APPLICATION_RESOURCES,[j.NAMESPACE]:se.APPLICATION_RESOURCES,[j.IMAGE]:se.APPLICATION_RESOURCES,[j.COMPONENT]:se.APPLICATION_RESOURCES,[j.POLICY]:se.POLICIES,[j.CONTROL]:se.POLICIES},dt=({entityType:s,entityListType:t,pageEntityId:a})=>{const o=k(),n=D();function r(m){const p=s===j.DEPLOYMENT&&m===j.POLICY?"failing ":"";return{group:ro[m],value:m,text:`${p}${U(ne[m])}`,to:b.getURL(o,n).base(s,a).push(m).url()}}const l=ua[s];if(!l)return null;const i=l.map(m=>r(m)),u=Object.values(se),c=b.getURL(o,n).base(s,a).url(),d=[{group:se.OVERVIEW,value:"",text:"Overview",to:c},...i];return e.jsx(Kn,{groups:u,tabs:d,activeTab:t||""})};dt.propTypes={entityType:C.string.isRequired,entityListType:C.string,pageEntityId:C.string.isRequired};dt.defaultProps={entityListType:null};const ce=()=>{const s=I.useRef(null),[t,a]=I.useState(!1),o=D(),n=be(),r=k(),l=ys(o),{useCase:i,search:u,sort:c,paging:d}=l,m=new vt(i,l.getPageStack(),u,c,d),p=b.getParams(r,o),{urlParams:h}=b.getURL(r,o),{pageEntityType:f,pageEntityId:g,entityListType1:y,entityType1:N,entityId1:S,entityType2:P,entityListType2:R,entityId2:A,query:T}=p,[E,v]=I.useState(!1);I.useEffect(()=>v(!1),[g]);const L=I.useCallback(()=>{n(b.getURL(r,o).clearSidePanelParams().url())},[n,r,o]);Zt(s,L,!!S),E||setTimeout(()=>v(!0),50);const Q=E?{opacity:1,transition:".15s opacity ease-in",transitionDelay:".25s"}:{opacity:0};return e.jsxs(De.Provider,{value:m,children:[e.jsxs("div",{className:"flex flex-1 flex-col",style:Q,children:[e.jsx(ut,{entityType:f,entityId:g,urlParams:h,isExporting:t,setIsExporting:a}),e.jsx(dt,{pageEntityId:g,entityType:f,entityListType:y,disabled:!!S}),e.jsxs("div",{className:"flex flex-1 w-full h-full relative z-0 overflow-hidden",children:[e.jsx(_e.Provider,{value:Jt,children:e.jsx("div",{className:"h-full w-full overflow-auto",id:"capture-list",children:e.jsx(ls,{entityType:f,entityId:g,entityListType:y,entityId1:S,query:T})})}),e.jsx(G.Provider,{value:Ns.sidePanel,children:e.jsx(_e.Provider,{value:Xt,children:e.jsx(Ut,{isOpen:!!S,children:e.jsx("div",{ref:s,children:e.jsx(is,{contextEntityId:g,contextEntityType:f,entityListType1:y,entityType1:N,entityId1:S,entityType2:P,entityListType2:R,entityId2:A,query:T})})})})})]})]}),t&&e.jsx(js,{})]})},ue=":entityId1?/:entityType2?/:entityId2?",de=":pageEntityId?/:entityType1?/:entityId1?/:entityType2?/:entityId2?",oo=()=>e.jsx(G.Provider,{value:Ns.page,children:e.jsxs(Fn,{children:[e.jsx(_,{index:!0,element:e.jsx(rr,{})}),e.jsx(_,{path:`namespace/${de}`,element:e.jsx(ce,{})}),e.jsx(_,{path:`cluster/${de}`,element:e.jsx(ce,{})}),e.jsx(_,{path:`node/${de}`,element:e.jsx(ce,{})}),e.jsx(_,{path:`deployment/${de}`,element:e.jsx(ce,{})}),e.jsx(_,{path:`image/${de}`,element:e.jsx(ce,{})}),e.jsx(_,{path:`secret/${de}`,element:e.jsx(ce,{})}),e.jsx(_,{path:`policy/${de}`,element:e.jsx(ce,{})}),e.jsx(_,{path:`control/${de}`,element:e.jsx(ce,{})}),e.jsx(_,{path:`serviceaccount/${de}`,element:e.jsx(ce,{})}),e.jsx(_,{path:`subject/${de}`,element:e.jsx(ce,{})}),e.jsx(_,{path:`role/${de}`,element:e.jsx(ce,{})}),e.jsx(_,{path:`namespaces/${ue}`,element:e.jsx(ie,{})}),e.jsx(_,{path:`clusters/${ue}`,element:e.jsx(ie,{})}),e.jsx(_,{path:`nodes/${ue}`,element:e.jsx(ie,{})}),e.jsx(_,{path:`deployments/${ue}`,element:e.jsx(ie,{})}),e.jsx(_,{path:`images/${ue}`,element:e.jsx(ie,{})}),e.jsx(_,{path:`secrets/${ue}`,element:e.jsx(ie,{})}),e.jsx(_,{path:`policies/${ue}`,element:e.jsx(ie,{})}),e.jsx(_,{path:`controls/${ue}`,element:e.jsx(ie,{})}),e.jsx(_,{path:`serviceaccounts/${ue}`,element:e.jsx(ie,{})}),e.jsx(_,{path:`subjects/${ue}`,element:e.jsx(ie,{})}),e.jsx(_,{path:`roles/${ue}`,element:e.jsx(ie,{})}),e.jsx(_,{path:"*",element:e.jsx(te,{useCase:"configmanagement"})})]})}),Ho=I.memo(oo,Mn);export{Ho as default};
