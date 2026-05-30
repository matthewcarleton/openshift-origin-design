import{cb as te,lU as K,lV as ne,lW as Ce,lX as Nt,dr as se,ez as ge,lY as We,lZ as Ze,t as e,ax as Q,ay as U,X as L,l_ as Xe,l$ as Tt,az as x,m0 as Be,m1 as je,lF as Lt,lG as Ft,dd as oe,lI as It,lJ as Ot,aA as H,ao as i,m2 as Dt,b0 as ae,m3 as re,lK as Ye,lL as fe,lM as Je,b3 as Pt,cq as be,ae as ve,m4 as $t,m5 as W,m6 as ie,m7 as de,m8 as et,dH as _,bF as Se,el as qt,d0 as tt,m9 as At,cu as Ee,ct as Ve,ly as Ne,cv as Te,ma as Le,ds as Fe,mb as Rt,bG as _t,mc as wt,ag as le,a3 as E,at as w,a4 as ce,au as Me,aa as kt,bL as Bt,bM as Mt,md as zt,aO as Gt,bK as Kt,I as Qt,me as Ut,mf as Ht,lA as Ie,mg as nt,mh as st,mi as ot,mj as Oe,lr as De,mk as Pe,js as Wt,ml as $e,f7 as Zt,mm as k,mn as ue,mo as xe,mp as at,mq as rt,mr as Xt,ms as it,b1 as Z,aI as Yt,aK as Jt,aL as en,bC as tn,bg as ze,ba as dt,mt as lt,b6 as ct,b7 as ut,mu as xt,b8 as mt,d_ as qe,mv as nn,b9 as G,mw as ht,mx as J,my as jt,dS as pt,fP as ee,mz as yt,cs as Ct,mA as sn,dZ as on,aR as X,d7 as pe,mB as an,mC as rn,mD as dn,bc as ye,bP as gt,ck as ft,cd as bt,bd as ln,cg as cn,ch as q,ci as A,cj as R,mE as he,a5 as un,a6 as Ge,aY as xn,mF as mn,c8 as hn,c9 as Y,eW as jn}from"./index-CWMzBAx8.js";import{u as I,g as V,f as pn,r as yn}from"./apollo-BxVF6eGb.js";import{u as Cn,a as gn,b as fn,S as bn,c as vn,E as Ke}from"./ExpandableLabelSection-ChGKEHbe.js";import"./react-pF2EnNv3.js";import"./lodash-JMWJiBov.js";import"./timeWindows-jJwZwJb_.js";import"./VulnerabilitiesService-h_fxqLtO.js";const Sn=V`
    query getNodeCVEs($query: String, $pagination: Pagination) {
        nodeCVEs(query: $query, pagination: $pagination) {
            cve
            affectedNodeCountBySeverity {
                critical {
                    total
                }
                important {
                    total
                }
                moderate {
                    total
                }
                low {
                    total
                }
                unknown {
                    total
                }
            }
            topCVSS
            affectedNodeCount
            firstDiscoveredInSystem
            distroTuples {
                summary
                operatingSystem
                cvss
                scoreVersion
            }
        }
    }
`;function En({querySearchFilter:n,...t}){return I(Sn,{variables:{query:K(n),pagination:te(t)}})}const Vn=V`
    query getTotalNodeCount {
        nodeCount
    }
`;function Nn(){var t;return((t=I(Vn).data)==null?void 0:t.nodeCount)??0}const Tn=[ne,Ce,Nt],Qe={field:Ce,direction:"desc",aggregateBy:{aggregateFunc:"max",distinct:"false"}};function Ln({querySearchFilter:n,isFiltered:t,pagination:s,selectedCves:r,createRowActions:o,canSelectRows:a,sortOption:j,getSortParams:m,onClearFilters:d}){var D;const{page:y,perPage:u}=s,{data:C,previousData:p,loading:g,error:v}=En({querySearchFilter:n,page:y,perPage:u,sortOption:j}),f=Nn(),l=C??p,b=se({isLoading:g,data:l==null?void 0:l.nodeCVEs,error:v,searchFilter:n}),T=ge(),S=a?8:6,O=(D=n.SEVERITY)==null?void 0:D.map(N=>We[N]).filter(Ze);return e.jsxs(Q,{borders:b.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":g?"true":"false",children:[e.jsx(U,{noWrap:!0,children:e.jsxs(L,{children:[e.jsx(Xe,{}),a&&e.jsx(Tt,{selectedCves:r}),e.jsx(x,{sort:m(ne),children:"CVE"}),e.jsxs(Be,{tooltip:"The number of nodes affected by this CVE, grouped by the severity of the CVE on each node",children:["Nodes by severity",t&&e.jsx(je,{})]}),e.jsx(x,{sort:m(Ce,Lt),children:"Top CVSS"}),e.jsxs(Be,{tooltip:"Ratio of the number of nodes affected by this CVE to the total number of nodes",sort:m("Node ID",Ft),children:["Affected nodes",t&&e.jsx(je,{})]}),e.jsx(x,{children:"First discovered"}),a&&e.jsx(x,{screenReaderText:"Row actions"})]})}),e.jsx(oe,{tableState:b,colSpan:S,emptyProps:{message:"No CVEs have been detected for nodes across your secured clusters"},filteredEmptyProps:{onClearFilters:d},renderer:({data:N})=>N.map((F,c)=>{const{cve:h,affectedNodeCountBySeverity:{critical:B,important:M,moderate:$,low:P,unknown:z},distroTuples:Ae,topCVSS:Re,affectedNodeCount:Et,firstDiscoveredInSystem:Vt}=F,me=T.has(h),_e=It(Ae),we=_e.length>0?_e[0].summary:"",ke=Ot(Re,Ae);return e.jsxs(H,{isExpanded:me,children:[e.jsxs(L,{children:[e.jsx(i,{expand:{rowIndex:c,isExpanded:me,onToggle:()=>T.toggle(h)}}),a&&e.jsx(Dt,{selectedCves:r,rowIndex:c,item:{cve:h}}),e.jsx(i,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(ae,{to:re("CVE",h),children:h})}),e.jsx(i,{dataLabel:"Nodes by severity",children:e.jsx(Ye,{criticalCount:B.total,importantCount:M.total,moderateCount:$.total,lowCount:P.total,unknownCount:z.total,filteredSeverities:O,entity:"node"})}),e.jsx(i,{dataLabel:"Top CVSS",children:e.jsx(fe,{cvss:Re,scoreVersion:ke.length>0?ke.join("/"):void 0})}),e.jsxs(i,{dataLabel:"Affected nodes",children:[Et," / ",f," affected nodes"]}),e.jsx(i,{dataLabel:"First discovered",children:e.jsx(Je,{date:Vt})}),a&&e.jsx(i,{isActionCell:!0,children:e.jsx(Pt,{items:o({cve:h})})})]}),e.jsxs(L,{isExpanded:me,children:[e.jsx(i,{}),e.jsx(i,{colSpan:S-1,children:e.jsx(be,{children:we?e.jsx(ve,{component:"p",children:we}):e.jsx($t,{})})})]})]},h)})})]})}const Fn=V`
    query getNodes($query: String, $pagination: Pagination) {
        nodes(query: $query, pagination: $pagination) {
            id
            name
            nodeCVECountBySeverity {
                critical {
                    total
                }
                important {
                    total
                }
                moderate {
                    total
                }
                low {
                    total
                }
                unknown {
                    total
                }
            }
            cluster {
                name
            }
            osImage
            scanTime
        }
    }
`;function In({querySearchFilter:n,...t}){return I(Fn,{variables:{query:K(n),pagination:te(t)}})}const On=[W,ie,de,et],Ue={field:W,direction:"asc"};function Dn({querySearchFilter:n,isFiltered:t,pagination:s,sortOption:r,getSortParams:o,onClearFilters:a}){var f;const{page:j,perPage:m}=s,{data:d,previousData:y,loading:u,error:C}=In({querySearchFilter:n,page:j,perPage:m,sortOption:r}),p=d??y,g=se({isLoading:u,data:p==null?void 0:p.nodes,error:C,searchFilter:n}),v=(f=n.SEVERITY)==null?void 0:f.map(l=>We[l]).filter(Ze);return e.jsxs(Q,{borders:g.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":u?"true":"false",children:[e.jsx(U,{noWrap:!0,children:e.jsxs(L,{children:[e.jsx(x,{sort:o(W),children:"Node"}),e.jsxs(x,{children:["CVEs by severity",t&&e.jsx(je,{})]}),e.jsx(x,{sort:o(ie),children:"Cluster"}),e.jsx(x,{sort:o(de),children:"Operating system"}),e.jsx(x,{sort:o(et),children:"Scan time"})]})}),e.jsx(oe,{tableState:g,colSpan:5,emptyProps:{message:"No CVEs have been reported for your scanned nodes"},filteredEmptyProps:{onClearFilters:a},renderer:({data:l})=>e.jsx(H,{children:l.map(b=>{const{id:T,name:S,nodeCVECountBySeverity:O,cluster:D,osImage:N,scanTime:F}=b,{critical:c,important:h,moderate:B,low:M,unknown:$}=O;return e.jsxs(L,{children:[e.jsx(i,{dataLabel:"Node",modifier:"nowrap",children:e.jsx(ae,{to:re("Node",T),children:e.jsx(_,{position:"middle",content:S})})}),e.jsx(i,{dataLabel:"CVEs by severity",children:e.jsx(Ye,{criticalCount:c.total,importantCount:h.total,moderateCount:B.total,lowCount:M.total,unknownCount:$.total,filteredSeverities:v,entity:"node"})}),e.jsx(i,{dataLabel:"Cluster",modifier:"nowrap",children:e.jsx(_,{position:"middle",content:D.name})}),e.jsx(i,{dataLabel:"Operating system",modifier:"nowrap",children:e.jsx(_,{position:"middle",content:N})}),e.jsx(i,{dataLabel:"Scan time",children:e.jsx(Je,{date:F})})]},T)})})})]})}const Pn=V`
    query getNodeCVEEntityCounts($query: String) {
        nodeCVECount(query: $query)
        nodeCount(query: $query)
    }
`;function $n(n){return I(Pn,{variables:{query:K(n)}})}const qn=[nt,st,ot,Oe];function An(){var $;const n=pn(),{analyticsTrack:t}=Se(),s=De(t),{isFeatureFlagEnabled:r}=qt(),o=r("ROX_SCANNER_V4")&&r("ROX_NODE_INDEX_ENABLED"),[a]=tt("entityTab",At),{searchFilter:j,setSearchFilter:m}=Ee(),d=Ve(Ne),{sortOption:y,getSortParams:u,setSortOption:C}=Te({sortFields:a==="CVE"?Tn:On,defaultSortOption:a==="CVE"?Qe:Ue,onSort:()=>d.setPage(1)}),p=Le(j),g=Fe(p),v=(($=p["CVE Snoozed"])==null?void 0:$[0])==="true",f=Cn(),l=Rt(),{snoozeModalOptions:b,setSnoozeModalOptions:T,snoozeActionCreator:S}=gn(),O=fn("Node"),{version:D}=_t();function N(P){d.setPage(1),C(P==="CVE"?Qe:Ue),t({event:Ut,properties:{type:P,page:"Overview"}})}yn.useEffect(()=>{N(a)},[]);function F(){m({}),d.setPage(1)}const{data:c}=$n(p),h={CVE:(c==null?void 0:c.nodeCVECount)??0,Node:(c==null?void 0:c.nodeCount)??0},B=e.jsx(Ie,{searchFilter:j,searchFilterConfig:qn,defaultSearchFilterEntity:"Node",onFilterChange:(P,z)=>{m(P),d.setPage(1),s(Pe,z)}}),M=e.jsx(Ht,{entityTabs:["CVE","Node"],entityCounts:h,onChange:N});return e.jsxs(e.Fragment,{children:[b&&e.jsx(bn,{...b,onSuccess:(P,z)=>{P==="SNOOZE"&&t({event:wt,properties:{type:"NODE",duration:z}}),n.cache.evict({fieldName:"nodeCVEs"}),n.cache.evict({fieldName:"nodeCVECount"}),n.cache.gc(),l.clear()},onClose:()=>T(null)}),e.jsx(le,{title:"Node CVEs Overview"}),e.jsx(E,{children:e.jsxs(w,{alignItems:{default:"alignItemsCenter"},grow:{default:"grow"},children:[e.jsxs(w,{direction:{default:"column"},grow:{default:"grow"},children:[e.jsx(ce,{headingLevel:"h1",children:"Node CVEs"}),e.jsx(Me,{children:"Prioritize and manage scanned CVEs across nodes"})]}),e.jsx(Me,{children:e.jsx(vn,{searchFilter:j,setSearchFilter:m,snoozedCveCount:O})})]})}),o&&e.jsx(E,{children:e.jsx(kt,{isInline:!0,variant:"info",title:"Results may include Node CVEs obtained from Scanner V4",component:"p",children:e.jsx(Bt,{children:e.jsx("a",{href:Mt(D,"operating/managing-vulnerabilities#understanding-node-cves-scanner-v4_scan-rhcos-node-host"),target:"_blank",rel:"noopener noreferrer",children:"Read more about the differences between the node scanning results obtained with the StackRox Scanner and Scanner V4."})})})}),e.jsxs(E,{isCenterAligned:!0,children:[e.jsx(zt,{filterToolbar:B,entityToggleGroup:M,pagination:d,tableRowCount:a==="CVE"?h.CVE:h.Node,isFiltered:g,children:f&&e.jsx(Gt,{align:{default:"alignEnd"},children:e.jsx(Kt,{toggleText:"Bulk actions",isDisabled:l.size===0,children:e.jsx(Qt,{onClick:()=>T({action:v?"UNSNOOZE":"SNOOZE",cveType:"NODE_CVE",cves:Array.from(l.values())}),children:v?"Unsnooze CVEs":"Snooze CVEs"},"bulk-snooze-cve")})})}),a==="CVE"&&e.jsx(Ln,{querySearchFilter:p,isFiltered:g,pagination:d,selectedCves:l,canSelectRows:f,createRowActions:S("NODE_CVE",v?"UNSNOOZE":"SNOOZE"),sortOption:y,getSortParams:u,onClearFilters:F}),a==="Node"&&e.jsx(Dn,{querySearchFilter:p,isFiltered:g,pagination:d,sortOption:y,getSortParams:u,onClearFilters:F})]})]})}function Rn(n,t){const s=Zt(n,r=>{var o,a;switch(t.field){case"Component":return(o=r.name)==null?void 0:o.toLowerCase();case"Type":return(a=r.source)==null?void 0:a.toLowerCase();default:return""}});return t.reversed&&s.reverse(),s}const vt=V`
    fragment NodeComponentFragment on NodeComponent {
        name
        source
        version
        nodeVulnerabilities(query: $query) {
            severity
            isFixable
            fixedByVersion
        }
    }
`,_n=["Component","Type"],wn={field:"Component",direction:"asc"};function St({data:n}){const{sortOption:t,getSortParams:s}=Wt({sortFields:_n,defaultSortOption:wn}),r=Rn(n,t);return n.length===0?null:e.jsxs(Q,{children:[e.jsx(U,{noWrap:!0,children:e.jsxs(L,{children:[e.jsx(x,{sort:s("Component"),children:"Component"}),e.jsx(x,{children:"Version"}),e.jsx(x,{children:"CVE fixed in"}),e.jsx(x,{sort:s("Type"),children:"Type"})]})}),e.jsx(H,{children:r.map(({name:o,source:a,version:j,nodeVulnerabilities:m})=>{var y;const d=(y=m==null?void 0:m[0])==null?void 0:y.fixedByVersion;return e.jsxs(L,{children:[e.jsx(i,{dataLabel:"Component",children:o}),e.jsx(i,{dataLabel:"Version",children:j}),e.jsx(i,{dataLabel:"CVE fixed in",children:d||e.jsx($e,{isFixable:!1})}),e.jsx(i,{dataLabel:"Type",children:a})]},o)})})]})}const kn=[W,k,ue,xe,ie,de],Bn={field:k,direction:"desc"},Mn=V`
    ${vt}
    fragment AffectedNode on Node {
        id
        name
        osImage
        cluster {
            name
        }
        nodeComponents(query: $query) {
            ...NodeComponentFragment
            nodeVulnerabilities(query: $query) {
                vulnerabilityId: id
                cve
                severity
                fixedByVersion
                cvss
                scoreVersion
            }
        }
    }
`;function zn({tableState:n,getSortParams:t,onClearFilters:s}){const o=ge();return e.jsxs(Q,{borders:n.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":n.type==="LOADING"?"true":"false",children:[e.jsx(U,{noWrap:!0,children:e.jsxs(L,{children:[e.jsx(x,{screenReaderText:"Row expansion"}),e.jsx(x,{sort:t(W),children:"Node"}),e.jsx(x,{sort:t(k),children:"CVE severity"}),e.jsx(x,{sort:t(ue),children:"CVE status"}),e.jsx(x,{sort:t(xe),children:"CVSS"}),e.jsx(x,{sort:t(ie),children:"Cluster"}),e.jsx(x,{sort:t(de),children:"Operating system"}),e.jsx(x,{children:"Affected components"})]})}),e.jsx(oe,{tableState:n,colSpan:8,emptyProps:{message:"There are no nodes that are affected by this CVE"},filteredEmptyProps:{onClearFilters:s},renderer:({data:a})=>a.map((j,m)=>{const{id:d,name:y,nodeComponents:u}=j,C=o.has(d),p=u.flatMap(b=>b.nodeVulnerabilities),g=at(p),v=rt(p),{cvss:f,scoreVersion:l}=Xt(p);return e.jsxs(H,{isExpanded:C,children:[e.jsxs(L,{children:[e.jsx(i,{expand:{rowIndex:m,isExpanded:C,onToggle:()=>o.toggle(d)}}),e.jsx(i,{dataLabel:"Node",children:e.jsx(ae,{to:re("Node",d),children:e.jsx(_,{position:"middle",content:y})})}),e.jsx(i,{dataLabel:"CVE severity",modifier:"nowrap",children:e.jsx(it,{severity:g})}),e.jsx(i,{dataLabel:"CVE status",modifier:"nowrap",children:e.jsx($e,{isFixable:v})}),e.jsx(i,{dataLabel:"CVSS",modifier:"nowrap",children:e.jsx(fe,{cvss:f,scoreVersion:l})}),e.jsx(i,{dataLabel:"Cluster",children:e.jsx(_,{position:"middle",content:j.cluster.name})}),e.jsx(i,{dataLabel:"Operating system",children:e.jsx(_,{position:"middle",content:j.osImage})}),e.jsx(i,{dataLabel:"Affected components",children:u.length===1?u[0].name:Z(u.length,"component")})]}),e.jsxs(L,{isExpanded:C,children:[e.jsx(i,{}),e.jsx(i,{colSpan:7,children:e.jsx(be,{children:e.jsx(St,{data:u})})})]})]},d)})})]})}function Gn({affectedNodeCount:n,totalNodeCount:t,operatingSystemCount:s}){return e.jsxs(Yt,{isCompact:!0,isFullHeight:!0,children:[e.jsx(Jt,{children:"Affected nodes"}),e.jsx(en,{children:e.jsxs(tn,{children:[e.jsxs(ze,{span:12,className:"pf-v6-u-pt-sm",children:[n," / ",t," affected nodes"]}),e.jsxs(ze,{span:12,className:"pf-v6-u-pt-sm",children:[Z(s,"operating system")," affected"]})]})})]})}const Kn=V`
    ${Mn}
    query getAffectedNodes($query: String, $pagination: Pagination) {
        nodes(query: $query, pagination: $pagination) {
            ...AffectedNode
        }
    }
`;function Qn({query:n,...t}){var r,o;const s=I(Kn,{variables:{query:n,pagination:te(t)}});return{affectedNodesRequest:s,nodeData:((r=s.data)==null?void 0:r.nodes)??((o=s.previousData)==null?void 0:o.nodes)}}const Un=V`
    query getNodeCVEMetadata($cve: String!) {
        nodeCVE(cve: $cve) {
            cve
            distroTuples {
                summary
                link
                operatingSystem
            }
            firstDiscoveredInSystem
        }
    }
`;function Hn(n){const t=I(Un,{variables:{cve:n}}),{data:s,previousData:r}=t,o=(s==null?void 0:s.nodeCVE)??(r==null?void 0:r.nodeCVE);return{metadataRequest:t,cveData:o}}const Wn=V`
    query getNodeCVESummaryData($cve: String!, $query: String!) {
        totalNodeCount: nodeCount
        nodeCount(query: $query)
        nodeCVE(cve: $cve, subfieldScopeQuery: $query) {
            distroTuples {
                operatingSystem
            }
            affectedNodeCountBySeverity {
                critical {
                    total
                }
                important {
                    total
                }
                moderate {
                    total
                }
                low {
                    total
                }
                unknown {
                    total
                }
            }
        }
    }
`;function Zn(n,t){const s=I(Wn,{variables:{cve:n,query:t}}),{data:r,previousData:o}=s,a=(r==null?void 0:r.nodeCount)??(o==null?void 0:o.nodeCount)??0;return{summaryDataRequest:s,nodeCount:a}}const Xn=xt("Node",{entityTab:"CVE"}),Yn=[nt,ot,Oe],He={affectedNodeCountBySeverity:{critical:{total:0},important:{total:0},moderate:{total:0},low:{total:0},unknown:{total:0}},distroTuples:[]};function Jn(){const{analyticsTrack:n}=Se(),t=De(n),{searchFilter:s,setSearchFilter:r}=Ee(),o=Le(s),{cveId:a}=dt(),j=`^${a}$`,m=K({...o,CVE:[j]}),{page:d,perPage:y,setPage:u,setPerPage:C}=Ve(Ne),{sortOption:p,getSortParams:g}=Te({sortFields:kn,defaultSortOption:Bn,onSort:()=>u(1)}),v=Fe(o),f=lt(o),{metadataRequest:l,cveData:b}=Hn(a),{summaryDataRequest:T,nodeCount:S}=Zn(a,m),{affectedNodesRequest:O,nodeData:D}=Qn({query:m,page:d,perPage:y,sortOption:p}),N=b==null?void 0:b.cve,F=se({isLoading:O.loading,error:O.error,data:D,searchFilter:o});return e.jsxs(e.Fragment,{children:[e.jsx(le,{title:`Node CVEs - NodeCVE ${N}`}),e.jsx(E,{type:"breadcrumb",children:e.jsxs(ct,{children:[e.jsx(ut,{to:Xn,children:"Node CVEs"}),e.jsx(mt,{isActive:!0,children:N??e.jsx(qe,{screenreaderText:"Loading CVE name",width:"200px"})})]})}),e.jsx(E,{children:e.jsx(nn,{data:b})}),e.jsx(G,{component:"div"}),e.jsxs(E,{hasBodyWrapper:!1,children:[e.jsx(Ie,{searchFilter:s,searchFilterConfig:Yn,defaultSearchFilterEntity:"Node",onFilterChange:(c,h)=>{r(c),u(1,"replace"),t(Pe,h)}}),e.jsxs(ht,{error:l.error,isLoading:l.loading,children:[e.jsx(J,{data:T.data,loadingText:"Loading affected nodes summary",renderer:({data:c})=>e.jsx(Gn,{affectedNodeCount:S,totalNodeCount:c.totalNodeCount,operatingSystemCount:(c.nodeCVE??He).distroTuples.length})}),e.jsx(J,{data:T.data,loadingText:"Loading affected nodes by CVE severity summary",renderer:({data:c})=>e.jsx(jt,{title:"Nodes by severity",severityCounts:(c.nodeCVE??He).affectedNodeCountBySeverity,hiddenSeverities:f})})]}),e.jsx(G,{component:"div"}),e.jsxs(pt,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(ee,{isFilled:!0,children:e.jsxs(w,{alignItems:{default:"alignItemsCenter"},children:[e.jsxs(ce,{headingLevel:"h2",children:[Z(S,"node")," affected"]}),v&&e.jsx(yt,{})]})}),e.jsx(ee,{children:e.jsx(Ct,{itemCount:S,perPage:y,page:d,onSetPage:(c,h)=>u(h),onPerPageSelect:(c,h)=>{C(h)}})})]}),e.jsx(zn,{tableState:F,getSortParams:g,onClearFilters:()=>{r({}),u(1)}})]})]})}const es=V`
    fragment NodeMetadata on Node {
        id
        name
        osImage
        kubeletVersion
        kernelVersion
        scanTime
    }
`;function ts({data:n}){if(!n)return e.jsx(sn,{nameScreenreaderText:"Loading Node name",metadataScreenreaderText:"Loading Node metadata"});const t=n.scanTime?4:3;return e.jsxs(w,{direction:{default:"column"},alignItems:{default:"alignItemsFlexStart"},children:[e.jsx(ce,{headingLevel:"h1",children:n.name}),e.jsxs(on,{numLabels:t,children:[e.jsxs(X,{children:["OS: ",n.osImage]}),e.jsxs(X,{children:["Kubelet: ",n.kubeletVersion]}),e.jsxs(X,{children:["Kernel version: ",n.kernelVersion]}),n.scanTime&&e.jsxs(X,{children:["Scan time: ",pe(n.scanTime)]})]})]})}const ns=[ne,k,ue,xe],ss={field:k,direction:"desc"},os=V`
    ${vt}
    fragment NodeVulnerabilityFragment on NodeVulnerability {
        cve
        summary
        cvss
        scoreVersion
        nodeComponents(query: $query) {
            ...NodeComponentFragment
        }
    }
`;function as({tableState:n,getSortParams:t,onClearFilters:s}){const o=ge();return e.jsxs(Q,{borders:n.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":n.type==="LOADING"?"true":"false",children:[e.jsx(U,{noWrap:!0,children:e.jsxs(L,{children:[e.jsx(Xe,{}),e.jsx(x,{sort:t(ne),children:"CVE"}),e.jsx(x,{sort:t(k),children:"Top severity"}),e.jsx(x,{sort:t(ue),children:"CVE status"}),e.jsx(x,{sort:t(xe),children:"CVSS"}),e.jsx(x,{children:"Affected components"})]})}),e.jsx(oe,{tableState:n,colSpan:6,emptyProps:{message:"No CVEs were detected for this node"},filteredEmptyProps:{onClearFilters:s},renderer:({data:a})=>a.map((j,m)=>{const{cve:d,cvss:y,scoreVersion:u,nodeComponents:C}=j,p=C.flatMap(l=>l.nodeVulnerabilities),g=at(p),v=rt(p),f=o.has(d);return e.jsxs(H,{isExpanded:f,children:[e.jsxs(L,{children:[e.jsx(i,{expand:{rowIndex:m,isExpanded:f,onToggle:()=>o.toggle(d)}}),e.jsx(i,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(ae,{to:re("CVE",d),children:d})}),e.jsx(i,{dataLabel:"Top severity",children:e.jsx(it,{severity:g})}),e.jsx(i,{dataLabel:"CVE status",children:e.jsx($e,{isFixable:v})}),e.jsx(i,{dataLabel:"CVSS",children:e.jsx(fe,{cvss:y,scoreVersion:u})}),e.jsx(i,{dataLabel:"Affected components",children:C.length===1?C[0].name:Z(C.length,"component")})]}),e.jsxs(L,{isExpanded:f,children:[e.jsx(i,{}),e.jsx(i,{colSpan:5,children:e.jsx(be,{children:e.jsx(St,{data:C})})})]})]},d)})})]})}const rs=V`
    ${os}
    query getNodeVulnerabilities($id: ID!, $query: String!, $pagination: Pagination) {
        node(id: $id) {
            id
            nodeVulnerabilityCount(query: $query)
            nodeVulnerabilities(query: $query, pagination: $pagination) {
                ...NodeVulnerabilityFragment
            }
        }
    }
`;function is({nodeId:n,query:t,...s}){return I(rs,{variables:{id:n,query:t,pagination:te(s)}})}const ds=V`
    ${an}
    query getNodeVulnSummary($id: ID!, $query: String!) {
        node(id: $id) {
            id
            nodeCVECountBySeverity(query: $query) {
                ...ResourceCountsByCVESeverityAndStatus
            }
        }
    }
`;function ls(n,t){return I(ds,{variables:{id:n,query:t}})}const cs=[st,Oe];function us({nodeId:n}){var N,F;const{analyticsTrack:t}=Se(),s=De(t),{searchFilter:r,setSearchFilter:o}=Ee(),a=Le(r),j=K(a),m=Fe(a),{page:d,perPage:y,setPage:u,setPerPage:C}=Ve(Ne),{sortOption:p,getSortParams:g}=Te({sortFields:ns,defaultSortOption:ss,onSort:()=>u(1,"replace")}),v=lt(a),f=rn(a),{data:l,loading:b,error:T}=is({nodeId:n,query:j,page:d,perPage:y,sortOption:p}),S=ls(n,j),O=((N=l==null?void 0:l.node)==null?void 0:N.nodeVulnerabilityCount)??0,D=se({isLoading:b,error:T,data:(F=l==null?void 0:l.node)==null?void 0:F.nodeVulnerabilities,searchFilter:a});return e.jsxs(e.Fragment,{children:[e.jsx(E,{children:e.jsx(ve,{component:"p",children:"Review and triage vulnerability data scanned on this node"})}),e.jsx(G,{component:"div"}),e.jsxs(E,{hasBodyWrapper:!1,isFilled:!0,children:[e.jsx(Ie,{searchFilter:r,searchFilterConfig:cs,defaultSearchFilterEntity:"CVE",onFilterChange:(c,h)=>{o(c),u(1,"replace"),s(Pe,h)}}),e.jsxs(ht,{isLoading:S.loading,error:S.error,children:[e.jsx(J,{loadingText:"Loading node CVEs by severity summary",data:S.data,renderer:({data:c})=>e.jsx(jt,{title:"CVEs by severity",severityCounts:c.node.nodeCVECountBySeverity,hiddenSeverities:v})}),e.jsx(J,{loadingText:"Loading node CVEs by status summary",data:S.data,renderer:({data:c})=>e.jsx(dn,{cveStatusCounts:c.node.nodeCVECountBySeverity,hiddenStatuses:f})})]}),e.jsx(G,{component:"div"}),e.jsxs(pt,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(ee,{isFilled:!0,children:e.jsxs(w,{alignItems:{default:"alignItemsCenter"},children:[e.jsx(ce,{headingLevel:"h2",children:l&&l.node?`${Z(l.node.nodeVulnerabilityCount,"result")} found`:e.jsx(qe,{screenreaderText:"Loading node vulnerability count"})}),m&&e.jsx(yt,{})]})}),e.jsx(ee,{children:e.jsx(Ct,{itemCount:O,perPage:y,page:d,onSetPage:(c,h)=>u(h),onPerPageSelect:(c,h)=>{C(h)}})})]}),e.jsx(as,{tableState:D,getSortParams:g,onClearFilters:()=>{o({}),u(1)}})]})]})}const xs=V`
    query getNodeExtendedDetails($id: ID!) {
        node(id: $id) {
            id
            cluster {
                name
            }
            containerRuntimeVersion
            joinedAt
            scanTime
            kernelVersion
            kubeletVersion
            labels {
                key
                value
            }
            annotations {
                key
                value
            }
        }
    }
`;function ms(n){return I(xs,{variables:{id:n}})}function hs({nodeId:n}){const{data:t,loading:s,error:r}=ms(n);return e.jsxs(e.Fragment,{children:[e.jsx(E,{component:"div",children:e.jsx(ve,{component:"p",children:"View details about this node"})}),e.jsx(G,{component:"div"}),e.jsx(E,{isFilled:!0,children:r?e.jsx(ye,{children:e.jsx(gt,{title:"There was an error loading the node details",headingLevel:"h2",icon:bt,status:"danger",children:ft(r)})}):s?e.jsx(ye,{children:e.jsx(ln,{size:"xl"})}):t&&e.jsxs(w,{direction:{default:"column"},spaceItems:{default:"spaceItemsXl"},children:[e.jsxs(cn,{columnModifier:{default:"1Col",lg:"2Col"},children:[e.jsxs(q,{children:[e.jsx(A,{children:"Cluster"}),e.jsx(R,{children:t.node.cluster.name})]}),t.node.containerRuntimeVersion&&e.jsxs(q,{children:[e.jsx(A,{children:"Container runtime"}),e.jsx(R,{children:t.node.containerRuntimeVersion})]}),t.node.joinedAt&&e.jsxs(q,{children:[e.jsx(A,{children:"Join time"}),e.jsx(R,{children:pe(t.node.joinedAt)})]}),t.node.scanTime&&e.jsxs(q,{children:[e.jsx(A,{children:"Scan time"}),e.jsx(R,{children:pe(t.node.scanTime)})]}),t.node.kernelVersion&&e.jsxs(q,{children:[e.jsx(A,{children:"Kernel version"}),e.jsx(R,{children:t.node.kernelVersion})]}),t.node.kubeletVersion&&e.jsxs(q,{children:[e.jsx(A,{children:"Kubelet"}),e.jsx(R,{children:t.node.kubeletVersion})]})]}),e.jsx(Ke,{toggleText:"Labels",labels:t.node.labels}),e.jsx(Ke,{toggleText:"Annotations",labels:t.node.annotations})]})})]})}const js="NodePageDetails",ps="NodePageVulnerabilities",ys=xt("Node",{entityTab:"Node"}),Cs=V`
    ${es}
    query getNodeMetadata($id: ID!) {
        node(id: $id) {
            ...NodeMetadata
        }
    }
`;function gs(){var d;const{nodeId:n}=dt(),{data:t,error:s}=I(Cs,{variables:{id:n}}),[r,o]=tt("detailsTab",he),a=he[0],j=he[1],m=((d=t==null?void 0:t.node)==null?void 0:d.name)??"-";return e.jsxs(e.Fragment,{children:[e.jsx(le,{title:`Node CVEs - Node ${m}`}),e.jsx(E,{type:"breadcrumb",children:e.jsxs(ct,{children:[e.jsx(ut,{to:ys,children:"Nodes"}),e.jsx(mt,{isActive:!0,children:m??e.jsx(qe,{screenreaderText:"Loading Node name",width:"200px"})})]})}),s?e.jsx(E,{children:e.jsx(ye,{children:e.jsx(gt,{title:ft(s),headingLevel:"h2",icon:bt,status:"danger"})})}):e.jsxs(e.Fragment,{children:[e.jsx(E,{children:e.jsx(ts,{data:t==null?void 0:t.node})}),e.jsx(E,{type:"tabs",children:e.jsxs(un,{activeKey:r,onSelect:(y,u)=>{o(u)},usePageInsets:!0,mountOnEnter:!0,unmountOnExit:!0,children:[e.jsx(Ge,{eventKey:a,tabContentId:ps,title:a,children:e.jsx(us,{nodeId:n})}),e.jsx(Ge,{eventKey:j,tabContentId:js,title:j,children:e.jsx(hs,{nodeId:n})})]})})]})]})}function Ts(){const{hasReadAccess:n}=xn(),t=n("Integration");return e.jsxs(e.Fragment,{children:[t&&e.jsx(mn,{}),e.jsxs(hn,{children:[e.jsx(Y,{index:!0,element:e.jsx(An,{})}),e.jsx(Y,{path:"cves/:cveId",element:e.jsx(Jn,{})}),e.jsx(Y,{path:"nodes/:nodeId",element:e.jsx(gs,{})}),e.jsx(Y,{path:"*",element:e.jsxs(E,{hasBodyWrapper:!1,children:[e.jsx(le,{title:"Node CVEs - Not Found"}),e.jsx(jn,{})]})})]})]})}export{Ts as default};
