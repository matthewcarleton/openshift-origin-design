import{m6 as R,mL as Re,mM as H,mN as Z,cb as X,lU as Y,dr as J,t as e,ax as ee,ay as te,X as D,az as y,m1 as Be,dd as se,aA as re,ao as d,b0 as ae,mO as ne,b1 as A,mP as fe,lV as ie,mQ as le,mo as B,ez as Ne,l_ as Me,l$ as jt,m0 as gt,m2 as bt,ml as je,mR as we,lL as ke,b3 as vt,cq as Ue,ae as _,m4 as ze,bF as ge,d0 as Ke,mS as Et,cu as be,ct as ve,ly as Ee,cv as Se,ma as Te,ds as Ve,mb as St,mc as Tt,ag as oe,a3 as T,at as q,a4 as w,au as Ce,md as Vt,aO as Ft,bK as Lt,I as Pt,mT as It,mf as $t,lA as Fe,mg as Qe,mU as Ge,lr as Le,mV as Pe,mq as Dt,dH as qt,aI as ce,aK as ue,aL as de,bC as pe,bg as M,ba as We,b6 as He,b7 as Ze,mu as Xe,b8 as Ye,d_ as Ie,dZ as Je,aR as he,d7 as $e,bL as Ot,mA as et,b9 as k,mw as tt,mx as G,dS as st,fP as W,mz as rt,cs as at,bc as ye,bP as nt,ck as it,cd as lt,bd as _t,cg as At,ch as U,ci as z,cj as K,mW as ot,dY as Rt,fy as Bt,dX as Nt,mC as Mt,mE as me,a5 as wt,a6 as qe,aY as kt,mF as Ut,c8 as zt,c9 as Q,eW as Kt}from"./index-CWMzBAx8.js";import{u as $,g as f,f as Qt,r as Gt}from"./apollo-BxVF6eGb.js";import{u as Wt,a as Ht,b as Zt,S as Xt,c as Yt,E as Jt}from"./ExpandableLabelSection-ChGKEHbe.js";import"./react-pF2EnNv3.js";import"./lodash-JMWJiBov.js";import"./timeWindows-jJwZwJb_.js";import"./VulnerabilitiesService-h_fxqLtO.js";const es=f`
    query getPlatformClusters($query: String, $pagination: Pagination) {
        clusters(query: $query, pagination: $pagination) {
            id
            name
            clusterVulnerabilityCount(query: $query)
            type
            status {
                orchestratorMetadata {
                    version
                }
            }
        }
    }
`,ts=[R,Re,H,Z],Oe={field:R,direction:"asc"};function ss({querySearchFilter:s,isFiltered:t,pagination:a,sortOption:n,getSortParams:r,onClearFilters:i}){const{page:l,perPage:o}=a,{data:c,previousData:x,error:u,loading:g}=$(es,{variables:{query:Y(s),pagination:X({page:l,perPage:o,sortOption:n})}}),j=c??x,V=J({isLoading:g,data:j==null?void 0:j.clusters,error:u,searchFilter:s});return e.jsxs(ee,{borders:V.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":g?"true":"false",children:[e.jsx(te,{noWrap:!0,children:e.jsxs(D,{children:[e.jsx(y,{sort:r(R),children:"Cluster"}),e.jsxs(y,{sort:r(Re),children:["CVEs",t&&e.jsx(Be,{})]}),e.jsx(y,{sort:r(H),children:"Platform type"}),e.jsx(y,{sort:r(Z),children:"Kubernetes version"})]})}),e.jsx(se,{tableState:V,colSpan:4,emptyProps:{message:"No secured clusters have been detected"},filteredEmptyProps:{onClearFilters:i},renderer:({data:F})=>F.map(({id:P,name:b,clusterVulnerabilityCount:L,type:C,status:h})=>{var v;return e.jsx(re,{children:e.jsxs(D,{children:[e.jsx(d,{dataLabel:"Cluster",modifier:"nowrap",children:e.jsx(ae,{to:ne("Cluster",P),children:b})}),e.jsx(d,{dataLabel:"CVEs",children:A(L,"CVE")}),e.jsx(d,{dataLabel:"Platform type",children:fe(C)}),e.jsx(d,{dataLabel:"Kubernetes version",children:((v=h==null?void 0:h.orchestratorMetadata)==null?void 0:v.version)??"Unavailable"})]})},P)})})]})}const rs=f`
    query getPlatformCves($query: String, $pagination: Pagination) {
        platformCVEs(query: $query, pagination: $pagination) {
            id
            cve
            isFixable
            cveType
            cvss
            clusterVulnerability {
                scoreVersion
                summary
            }
            clusterCountByType {
                generic
                kubernetes
                openshift
                openshift4
            }
        }
    }
`;function as({querySearchFilter:s,...t}){return $(rs,{variables:{query:Y(s),pagination:X(t)}})}const ns=f`
    query getTotalClusterCount {
        clusterCount
    }
`,is=[ie,le,B],_e={field:B,direction:"desc"};function ls({querySearchFilter:s,isFiltered:t,pagination:a,selectedCves:n,canSelectRows:r,createRowActions:i,sortOption:l,getSortParams:o,onClearFilters:c}){var v;const{page:x,perPage:u}=a,{data:g,previousData:j,error:V,loading:m}=as({querySearchFilter:s,page:x,perPage:u,sortOption:l}),P=((v=$(ns).data)==null?void 0:v.clusterCount)??0,b=g??j,L=J({isLoading:m,data:b==null?void 0:b.platformCVEs,error:V,searchFilter:s}),C=Ne(),h=r?8:6;return e.jsxs(ee,{borders:L.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":m?"true":"false",children:[e.jsx(te,{noWrap:!0,children:e.jsxs(D,{children:[e.jsx(Me,{}),r&&e.jsx(jt,{selectedCves:n}),e.jsx(y,{sort:o(ie),children:"CVE"}),e.jsx(y,{children:"CVE status"}),e.jsx(y,{sort:o(le),children:"CVE type"}),e.jsx(y,{sort:o(B),children:"CVSS"}),e.jsxs(gt,{tooltip:"Ratio of the number of clusters affected by this CVE to the total number of secured clusters",sort:void 0,children:["Affected clusters",t&&e.jsx(Be,{})]}),r&&e.jsx(y,{screenReaderText:"Row actions"})]})}),e.jsx(se,{tableState:L,colSpan:h,emptyProps:{message:"No CVEs have been detected for your secured clusters"},filteredEmptyProps:{onClearFilters:c},renderer:({data:O})=>O.map((E,p)=>{const{id:S,cve:I,isFixable:N,cveType:ut,cvss:dt,clusterVulnerability:{summary:De,scoreVersion:xt},clusterCountByType:mt}=E,xe=C.has(I),{generic:Ct,kubernetes:pt,openshift:ht,openshift4:yt}=mt,ft=Ct+pt+ht+yt;return e.jsxs(re,{isExpanded:xe,children:[e.jsxs(D,{children:[e.jsx(d,{expand:{rowIndex:p,isExpanded:xe,onToggle:()=>C.toggle(I)}}),r&&e.jsx(bt,{selectedCves:n,rowIndex:p,item:{cve:I}}),e.jsx(d,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(ae,{to:ne("CVE",S),children:I})}),e.jsx(d,{dataLabel:"CVE status",children:e.jsx(je,{isFixable:N})}),e.jsx(d,{dataLabel:"CVE type",children:we(ut)}),e.jsx(d,{dataLabel:"CVSS",children:e.jsx(ke,{cvss:dt,scoreVersion:xt})}),e.jsxs(d,{dataLabel:"Affected clusters",children:[ft," / ",P," affected clusters"]}),r&&e.jsx(d,{isActionCell:!0,children:e.jsx(vt,{items:i({cve:I})})})]}),e.jsxs(D,{isExpanded:xe,children:[e.jsx(d,{}),e.jsx(d,{colSpan:h-1,children:e.jsx(Ue,{children:De?e.jsx(_,{component:"p",children:De}):e.jsx(ze,{})})})]})]},S)})})]})}const os=f`
    query getPlatformCVEEntityCounts($query: String) {
        platformCVECount(query: $query)
        clusterCount(query: $query)
    }
`;function cs(s){return $(os,{variables:{query:Y(s)}})}const us=[Qe,Ge];function ds(){var S;const s=Qt(),{analyticsTrack:t}=ge(),a=Le(t),[n]=Ke("entityTab",Et),{searchFilter:r,setSearchFilter:i}=be(),l=ve(Ee),{sortOption:o,getSortParams:c,setSortOption:x}=Se({sortFields:n==="CVE"?is:ts,defaultSortOption:n==="CVE"?_e:Oe,onSort:()=>l.setPage(1)}),u=Te(r),g=Ve(u),j=((S=u["CVE Snoozed"])==null?void 0:S[0])==="true",V=Wt(),m=St(),{snoozeModalOptions:F,setSnoozeModalOptions:P,snoozeActionCreator:b}=Ht(),L=Zt("Platform");function C(I){l.setPage(1),x(I==="CVE"?_e:Oe),t({event:It,properties:{type:I,page:"Overview"}})}Gt.useEffect(()=>{C(n)},[]);const{data:h}=cs(u),v={CVE:(h==null?void 0:h.platformCVECount)??0,Cluster:(h==null?void 0:h.clusterCount)??0};function O(){i({}),l.setPage(1)}const E=e.jsx(Fe,{searchFilter:r,searchFilterConfig:us,defaultSearchFilterEntity:"CVE",cveStatusFilterField:"CLUSTER CVE FIXABLE",onFilterChange:(I,N)=>{i(I),a(Pe,N)},includeCveSeverityFilters:!1}),p=e.jsx($t,{entityTabs:["CVE","Cluster"],entityCounts:v,onChange:C});return e.jsxs(e.Fragment,{children:[F&&e.jsx(Xt,{...F,onSuccess:(I,N)=>{I==="SNOOZE"&&t({event:Tt,properties:{type:"PLATFORM",duration:N}}),s.cache.evict({fieldName:"platformCVEs"}),s.cache.evict({fieldName:"platformCVECount"}),s.cache.gc(),m.clear()},onClose:()=>P(null)}),e.jsx(oe,{title:"Kubernetes Components Overview"}),e.jsx(T,{children:e.jsxs(q,{alignItems:{default:"alignItemsCenter"},grow:{default:"grow"},children:[e.jsxs(q,{direction:{default:"column"},grow:{default:"grow"},children:[e.jsx(w,{headingLevel:"h1",children:"Kubernetes components"}),e.jsx(Ce,{children:"Prioritize and manage scanned CVEs across clusters"})]}),e.jsx(Ce,{children:e.jsx(Yt,{searchFilter:r,setSearchFilter:i,snoozedCveCount:L})})]})}),e.jsxs(T,{isFilled:!0,children:[e.jsx(Vt,{filterToolbar:E,entityToggleGroup:p,pagination:l,tableRowCount:n==="CVE"?v.CVE:v.Cluster,isFiltered:g,children:V&&e.jsx(Ft,{align:{default:"alignEnd"},children:e.jsx(Lt,{toggleText:"Bulk actions",isDisabled:m.size===0,children:e.jsx(Pt,{onClick:()=>P({action:j?"UNSNOOZE":"SNOOZE",cveType:"CLUSTER_CVE",cves:Array.from(m.values())}),children:j?"Unsnooze CVEs":"Snooze CVEs"},"bulk-snooze-cve")})})}),n==="CVE"&&e.jsx(ls,{querySearchFilter:u,isFiltered:g,pagination:l,selectedCves:m,canSelectRows:V,createRowActions:b("CLUSTER_CVE",j?"UNSNOOZE":"SNOOZE"),sortOption:o,getSortParams:c,onClearFilters:O}),n==="Cluster"&&e.jsx(ss,{querySearchFilter:u,isFiltered:g,pagination:l,sortOption:o,getSortParams:c,onClearFilters:O})]})]})}const xs=[R,H,Z],ms={field:R,direction:"asc"},Cs=f`
    fragment AffectedClusterFragment on Cluster {
        id
        name
        type
        clusterVulnerabilities(query: $query) {
            fixedByVersion
        }
        status {
            orchestratorMetadata {
                version
            }
        }
    }
`;function ps({tableState:s,getSortParams:t,onClearFilters:a}){return e.jsxs(ee,{borders:s.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":s.type==="LOADING"?"true":"false",children:[e.jsx(te,{noWrap:!0,children:e.jsxs(D,{children:[e.jsx(y,{sort:t(R),children:"Cluster"}),e.jsx(y,{sort:t(H),children:"Cluster type"}),e.jsx(y,{children:"CVE status"}),e.jsx(y,{sort:t(Z),children:"Kubernetes version"})]})}),e.jsx(se,{tableState:s,colSpan:3,emptyProps:{message:"No clusters have been reported for this CVE"},filteredEmptyProps:{onClearFilters:a},renderer:({data:n})=>e.jsx(re,{children:n.map(({id:r,name:i,type:l,clusterVulnerabilities:o,status:c})=>{var u;const x=Dt(o);return e.jsxs(D,{children:[e.jsx(d,{dataLabel:"Cluster",children:e.jsx(ae,{to:ne("Cluster",r),children:e.jsx(qt,{position:"middle",content:i})})}),e.jsx(d,{dataLabel:"Cluster type",modifier:"nowrap",children:fe(l)}),e.jsx(d,{dataLabel:"CVE status",children:e.jsx(je,{isFixable:x})}),e.jsx(d,{dataLabel:"Kubernetes version",modifier:"nowrap",children:((u=c==null?void 0:c.orchestratorMetadata)==null?void 0:u.version)??"Unavailable"})]},r)})})})]})}const hs=f`
    ${Cs}
    query getAffectedClusters($query: String, $pagination: Pagination) {
        clusterCount(query: $query)
        clusters(query: $query, pagination: $pagination) {
            ...AffectedClusterFragment
        }
    }
`;function ys({query:s,...t}){var n,r,i;const a=$(hs,{variables:{query:s,pagination:X(t)}});return{affectedClustersRequest:a,clusterCount:((n=a.data)==null?void 0:n.clusterCount)??0,clusterData:((r=a.data)==null?void 0:r.clusters)??((i=a.previousData)==null?void 0:i.clusters)}}const ct=f`
    fragment ClustersByType on PlatformCVECore {
        clusterCountByType {
            generic
            kubernetes
            openshift
            openshift4
        }
    }
`;function fs({clusterCounts:s}){const{generic:t=0,kubernetes:a=0,openshift:n=0,openshift4:r=0}=s??{},i=t+a+n+r;return e.jsxs(ce,{isCompact:!0,isFullHeight:!0,children:[e.jsx(ue,{children:"Clusters by type"}),e.jsx(de,{children:i>0?e.jsxs(pe,{children:[t>0&&e.jsxs(M,{span:12,className:"pf-v6-u-pt-xs",children:[t," Generic"]}),a>0&&e.jsxs(M,{span:12,className:"pf-v6-u-pt-xs",children:[a," Kubernetes"]}),n+r>0&&e.jsxs(M,{span:12,className:"pf-v6-u-pt-xs",children:[n+r," OpenShift"]})]}):e.jsx(pe,{children:e.jsx(M,{span:12,className:"pf-v6-u-pt-xs",children:"No affected clusters found"})})})]})}const js=f`
    ${ct}
    query getPlatformCVEMetadata($cveID: String!) {
        platformCVE(cveID: $cveID) {
            cve
            clusterVulnerability {
                link
                summary
            }
            firstDiscoveredTime
            ...ClustersByType
        }
    }
`;function gs(s){return $(js,{variables:{cveID:s}})}function bs({affectedClusterCount:s,totalClusterCount:t}){return e.jsxs(ce,{isCompact:!0,isFullHeight:!0,children:[e.jsx(ue,{children:"Affected clusters"}),e.jsx(de,{children:e.jsx(pe,{children:e.jsxs(M,{span:12,className:"pf-v6-u-pt-sm",children:[s," / ",t," affected clusters"]})})})]})}const vs=f`
    ${ct}
    query getPlatformCVEMetadata($cveID: String!, $query: String!) {
        totalClusterCount: clusterCount
        clusterCount(query: $query)
        platformCVE(cveID: $cveID, subfieldScopeQuery: $query) {
            ...ClustersByType
        }
    }
`;function Es({cveId:s,query:t}){return $(vs,{variables:{cveID:s,query:t}})}const Ss=Xe("Platform",{entityTab:"CVE"}),Ts=[Qe];function Vs(){var E;const{analyticsTrack:s}=ge(),t=Le(s),{searchFilter:a,setSearchFilter:n}=be(),r=Te(a),i=We(),l=decodeURIComponent(i.cveId),o=Y({...r,"CVE ID":[l]}),{page:c,perPage:x,setPage:u,setPerPage:g}=ve(Ee),{sortOption:j,getSortParams:V}=Se({sortFields:xs,defaultSortOption:ms,onSort:()=>u(1)}),{affectedClustersRequest:m,clusterData:F,clusterCount:P}=ys({query:o,page:c,perPage:x,sortOption:j}),b=gs(l),L=Es({cveId:l,query:o}),C=(E=b.data)==null?void 0:E.platformCVE,h=C==null?void 0:C.cve,v=Ve(r),O=J({isLoading:m.loading,error:m.error,data:F,searchFilter:r});return e.jsxs(e.Fragment,{children:[e.jsx(oe,{title:`Kubernetes components - Vulnerability ${h}`}),e.jsx(T,{type:"breadcrumb",children:e.jsxs(He,{children:[e.jsx(Ze,{to:Ss,children:"Kubernetes components"}),e.jsx(Ye,{isActive:!0,children:h??e.jsx(Ie,{screenreaderText:"Loading CVE name",width:"200px"})})]})}),e.jsx(T,{children:C?e.jsxs(q,{direction:{default:"column"},alignItems:{default:"alignItemsFlexStart"},spaceItems:{default:"spaceItemsSm"},children:[e.jsx(w,{headingLevel:"h1",children:C.cve}),C.firstDiscoveredTime&&e.jsx(Je,{numLabels:1,children:e.jsxs(he,{children:["First discovered in system:"," ",$e(C.firstDiscoveredTime)]})}),e.jsx(_,{component:"p",children:C.clusterVulnerability.summary}),e.jsx(Ot,{children:e.jsx("a",{href:C.clusterVulnerability.link,target:"_blank",rel:"noopener noreferrer",children:C.clusterVulnerability.link})})]}):e.jsx(et,{nameScreenreaderText:"Loading CVE name",metadataScreenreaderText:"Loading CVE metadata"})}),e.jsx(k,{component:"div"}),e.jsxs(T,{hasBodyWrapper:!1,isFilled:!0,children:[e.jsx(Fe,{searchFilter:a,searchFilterConfig:Ts,cveStatusFilterField:"CLUSTER CVE FIXABLE",onFilterChange:(p,S)=>{n(p),t(Pe,S)},includeCveSeverityFilters:!1}),e.jsxs(tt,{error:L.error,isLoading:L.loading,children:[e.jsx(G,{data:L.data,loadingText:"Loading affected nodes summary",renderer:({data:p})=>e.jsx(bs,{affectedClusterCount:p.clusterCount,totalClusterCount:p.totalClusterCount})}),e.jsx(G,{data:L.data,loadingText:"Loading affected nodes by CVE severity summary",renderer:({data:p})=>{var S;return e.jsx(fs,{clusterCounts:(S=p.platformCVE)==null?void 0:S.clusterCountByType})}})]}),e.jsx(k,{component:"div"}),e.jsxs(st,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(W,{isFilled:!0,children:e.jsxs(q,{alignItems:{default:"alignItemsCenter"},children:[e.jsxs(w,{headingLevel:"h2",children:[A(P,"cluster")," affected"]}),v&&e.jsx(rt,{})]})}),e.jsx(W,{children:e.jsx(at,{itemCount:P,perPage:x,page:c,onSetPage:(p,S)=>u(S),onPerPageSelect:(p,S)=>{g(S)}})})]}),e.jsx(ps,{tableState:O,getSortParams:V,onClearFilters:()=>{n({}),u(1)}})]})]})}const Fs=f`
    fragment ClusterMetadata on Cluster {
        id
        name
        status {
            orchestratorMetadata {
                buildDate
                version
            }
        }
    }
`;function Ls({data:s}){var r,i,l,o;if(!s)return e.jsx(et,{nameScreenreaderText:"Loading Cluster name",metadataScreenreaderText:"Loading Cluster metadata"});const t=(i=(r=s.status)==null?void 0:r.orchestratorMetadata)==null?void 0:i.buildDate,a=(o=(l=s.status)==null?void 0:l.orchestratorMetadata)==null?void 0:o.version,n=0+(t?1:0)+(a?1:0);return e.jsxs(q,{direction:{default:"column"},alignItems:{default:"alignItemsFlexStart"},children:[e.jsx(w,{headingLevel:"h1",className:"pf-v6-u-mb-sm",children:s.name}),n>0&&e.jsxs(Je,{numLabels:n,children:[a&&e.jsxs(he,{children:["K8s version: ",a]}),t&&e.jsxs(he,{children:["Build date: ",$e(t)]})]})]})}const Ps=f`
    query getClusterExtendedDetails($id: ID!) {
        cluster(id: $id) {
            id
            status {
                providerMetadata {
                    aws {
                        __typename
                    }
                    azure {
                        __typename
                    }
                    google {
                        __typename
                    }
                    region
                }
                orchestratorMetadata {
                    version
                    buildDate
                }
            }
            type
            labels {
                key
                value
            }
        }
    }
`;function Is(s){return $(Ps,{variables:{id:s}})}function Ae(s){if(!s)return null;const{region:t}=s;return s.aws?`AWS ${t}`:s.azure?`Azure ${t}`:s.google?`GCP ${t}`:null}function $s({clusterId:s}){var r,i,l,o,c,x;const{data:t,loading:a,error:n}=Is(s);return e.jsxs(e.Fragment,{children:[e.jsx(T,{component:"div",children:e.jsx(_,{component:"p",children:"View details about this cluster"})}),e.jsx(k,{component:"div"}),e.jsx(T,{isFilled:!0,children:n?e.jsx(ye,{children:e.jsx(nt,{title:"There was an error loading the cluster details",headingLevel:"h2",icon:lt,status:"danger",children:it(n)})}):a?e.jsx(ye,{children:e.jsx(_t,{size:"xl"})}):t&&e.jsxs(q,{direction:{default:"column"},spaceItems:{default:"spaceItemsXl"},children:[e.jsxs(At,{columnModifier:{default:"1Col"},children:[e.jsxs(U,{children:[e.jsx(z,{children:"Cluster type"}),e.jsx(K,{children:fe(t.cluster.type)})]}),Ae((r=t.cluster.status)==null?void 0:r.providerMetadata)&&e.jsxs(U,{children:[e.jsx(z,{children:"Cloud provider"}),e.jsx(K,{children:Ae((i=t.cluster.status)==null?void 0:i.providerMetadata)})]}),((o=(l=t.cluster.status)==null?void 0:l.orchestratorMetadata)==null?void 0:o.buildDate)&&e.jsxs(U,{children:[e.jsx(z,{children:"Build date"}),e.jsx(K,{children:$e(t.cluster.status.orchestratorMetadata.buildDate)})]}),((x=(c=t.cluster.status)==null?void 0:c.orchestratorMetadata)==null?void 0:x.version)&&e.jsxs(U,{children:[e.jsx(z,{children:"K8s version"}),e.jsx(K,{children:t.cluster.status.orchestratorMetadata.version})]})]}),e.jsx(Jt,{toggleText:"Labels",labels:t.cluster.labels})]})})]})}const Ds=[ie,ot,le,B],qs={field:B,direction:"desc"},Os=f`
    fragment ClusterVulnerabilityFragment on ClusterVulnerability {
        id
        cve
        isFixable
        cvss
        scoreVersion
        vulnerabilityType
        summary
    }
`;function _s({tableState:s,getSortParams:t,onClearFilters:a}){const r=Ne();return e.jsxs(ee,{borders:s.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":s.type==="LOADING"?"true":"false",children:[e.jsx(te,{noWrap:!0,children:e.jsxs(D,{children:[e.jsx(Me,{}),e.jsx(y,{sort:t(ie),children:"CVE"}),e.jsx(y,{sort:t(ot),children:"CVE status"}),e.jsx(y,{sort:t(le),children:"CVE type"}),e.jsx(y,{sort:t(B),children:"CVSS"})]})}),e.jsx(se,{tableState:s,colSpan:5,emptyProps:{message:"No CVEs were detected for this cluster"},filteredEmptyProps:{onClearFilters:a},renderer:({data:i})=>i.map((l,o)=>{const{id:c,cve:x,isFixable:u,vulnerabilityType:g,cvss:j,scoreVersion:V,summary:m}=l,F=r.has(x);return e.jsxs(re,{isExpanded:F,children:[e.jsxs(D,{children:[e.jsx(d,{expand:{rowIndex:o,isExpanded:F,onToggle:()=>r.toggle(x)}}),e.jsx(d,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(ae,{to:ne("CVE",c),children:x})}),e.jsx(d,{dataLabel:"CVE status",children:e.jsx(je,{isFixable:u})}),e.jsx(d,{dataLabel:"CVE type",children:we(g)}),e.jsx(d,{dataLabel:"CVSS",children:e.jsx(ke,{cvss:j,scoreVersion:V})})]}),e.jsxs(D,{isExpanded:F,children:[e.jsx(d,{}),e.jsx(d,{colSpan:4,children:e.jsx(Ue,{children:m?e.jsx(_,{component:"p",children:m}):e.jsx(ze,{})})})]})]},x)})})]})}const As=f`
    ${Os}
    query getClusterVulnerabilities($id: ID!, $query: String!, $pagination: Pagination) {
        cluster(id: $id) {
            id
            clusterVulnerabilityCount(query: $query)
            clusterVulnerabilities(query: $query, pagination: $pagination) {
                ...ClusterVulnerabilityFragment
            }
        }
    }
`;function Rs({clusterId:s,query:t,...a}){return $(As,{variables:{id:s,query:t,pagination:X(a)}})}const Bs="var(--pf-t--global--text--color--disabled)",Ns=[{status:"Fixable",Icon:Rt,text:({fixable:s})=>`${A(s,"vulnerability","vulnerabilities")} with available fixes`},{status:"Not fixable",Icon:Bt,text:({total:s,fixable:t})=>`${A(s-t,"vulnerability","vulnerabilities")} without fixes`}],Ms={Fixable:"Fixable hidden","Not fixable":"Not fixable hidden"},ws=f`
    fragment PlatformCveCountByStatusFragment on PlatformCVECountByFixability {
        total
        fixable
    }
`;function ks({data:s,hiddenStatuses:t}){return e.jsxs(ce,{isCompact:!0,isFullHeight:!0,children:[e.jsx(ue,{children:"CVEs by status"}),e.jsx(de,{children:e.jsx(q,{direction:{default:"column"},children:Ns.map(({status:a,Icon:n,text:r})=>{const i=t.has(a);return e.jsxs(q,{spaceItems:{default:"spaceItemsSm"},alignItems:{default:"alignItemsCenter"},children:[e.jsx(n,{}),e.jsx(_,{component:"p",style:{color:i?Bs:"inherit"},children:i?Ms[a]:r(s)})]},a)})})})]})}const Us=[{type:"OpenShift CVE",field:"openshift"},{type:"Kubernetes CVE",field:"kubernetes"},{type:"Istio CVE",field:"istio"}],zs=f`
    fragment PlatformCveCountByTypeFragment on PlatformCVECountByType {
        kubernetes
        openshift
        istio
    }
`;function Ks({data:s}){return e.jsxs(ce,{isCompact:!0,isFullHeight:!0,children:[e.jsx(ue,{children:"CVEs by type"}),e.jsx(de,{children:e.jsx(q,{direction:{default:"column"},children:Us.map(({type:t,field:a})=>e.jsx(Ce,{span:12,children:e.jsx(_,{component:"p",children:A(s[a],t)})},t))})})]})}const Qs=f`
    ${ws}
    ${zs}
    query getClusterVulnSummary($id: ID!, $query: String) {
        cluster(id: $id) {
            id
            platformCVECountByFixability(query: $query) {
                ...PlatformCveCountByStatusFragment
            }
            platformCVECountByType(query: $query) {
                ...PlatformCveCountByTypeFragment
            }
        }
    }
`;function Gs(s,t){return $(Qs,{variables:{id:s,query:t}})}const Ws=[Ge];function Hs({clusterId:s}){var v,O;const{analyticsTrack:t}=ge(),a=Le(t),{searchFilter:n,setSearchFilter:r}=be(),i=Te(n),l=Nt(i),o=Ve(i),{page:c,perPage:x,setPage:u,setPerPage:g}=ve(Ee),{sortOption:j,getSortParams:V}=Se({sortFields:Ds,defaultSortOption:qs,onSort:()=>u(1)}),{data:m,loading:F,error:P}=Rs({clusterId:s,query:l,page:c,perPage:x,sortOption:j}),b=Gs(s,l),L=Mt(i),C=((v=m==null?void 0:m.cluster)==null?void 0:v.clusterVulnerabilityCount)??0,h=J({isLoading:F,error:P,data:(O=m==null?void 0:m.cluster)==null?void 0:O.clusterVulnerabilities,searchFilter:i});return e.jsxs(e.Fragment,{children:[e.jsx(T,{component:"div",children:e.jsx(_,{component:"p",children:"Review and triage vulnerability data scanned on this cluster"})}),e.jsx(k,{component:"div"}),e.jsxs(T,{hasBodyWrapper:!1,isFilled:!0,children:[e.jsx(Fe,{className:"pf-v6-u-pb-0 pf-v6-u-px-sm",searchFilter:n,searchFilterConfig:Ws,cveStatusFilterField:"CLUSTER CVE FIXABLE",onFilterChange:(E,p)=>{r(E),a(Pe,p)},includeCveSeverityFilters:!1}),e.jsxs(tt,{isLoading:b.loading,error:b.error,children:[e.jsx(G,{loadingText:"Loading platform CVEs by status summary",data:b.data,renderer:({data:E})=>e.jsx(ks,{data:E.cluster.platformCVECountByFixability,hiddenStatuses:L})}),e.jsx(G,{loadingText:"Loading platform CVEs by type summary",data:b.data,renderer:({data:E})=>e.jsx(Ks,{data:E.cluster.platformCVECountByType})})]}),e.jsx(k,{component:"div"}),e.jsxs(st,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(W,{isFilled:!0,children:e.jsxs(q,{alignItems:{default:"alignItemsCenter"},children:[e.jsx(w,{headingLevel:"h2",className:"pf-v6-u-w-50",children:m?`${A(C,"result")} found`:e.jsx(Ie,{screenreaderText:"Loading cluster vulnerability count"})}),o&&e.jsx(rt,{})]})}),e.jsx(W,{children:e.jsx(at,{itemCount:C,perPage:x,page:c,onSetPage:(E,p)=>u(p),onPerPageSelect:(E,p)=>{g(p)}})})]}),e.jsx(_s,{tableState:h,getSortParams:V,onClearFilters:()=>{r({}),u(1)}})]})]})}const Zs="ClusterPageDetails",Xs="ClusterPageVulnerabilities",Ys=Xe("Platform",{entityTab:"Cluster"}),Js=f`
    ${Fs}
    query getClusterMetadata($id: ID!) {
        cluster(id: $id) {
            ...ClusterMetadata
        }
    }
`;function er(){var c;const{clusterId:s}=We(),{data:t,error:a}=$(Js,{variables:{id:s}}),[n,r]=Ke("detailsTab",me),i=me[0],l=me[1],o=((c=t==null?void 0:t.cluster)==null?void 0:c.name)??"";return e.jsxs(e.Fragment,{children:[e.jsx(oe,{title:`Platform CVEs - Cluster ${o}`}),e.jsx(T,{type:"breadcrumb",children:e.jsxs(He,{children:[e.jsx(Ze,{to:Ys,children:"Clusters"}),e.jsx(Ye,{isActive:!0,children:o??e.jsx(Ie,{screenreaderText:"Loading cluster name",width:"200px"})})]})}),a?e.jsx(T,{hasBodyWrapper:!1,children:e.jsx(ye,{children:e.jsx(nt,{title:it(a),headingLevel:"h2",icon:lt,status:"danger"})})}):e.jsxs(e.Fragment,{children:[e.jsx(T,{hasBodyWrapper:!1,children:e.jsx(Ls,{data:t==null?void 0:t.cluster})}),e.jsx(T,{type:"tabs",children:e.jsxs(wt,{activeKey:n,onSelect:(x,u)=>{r(u)},usePageInsets:!0,mountOnEnter:!0,unmountOnExit:!0,children:[e.jsx(qe,{eventKey:i,tabContentId:Xs,title:i,children:e.jsx(Hs,{clusterId:s})}),e.jsx(qe,{eventKey:l,tabContentId:Zs,title:l,children:e.jsx($s,{clusterId:s})})]})})]})]})}function or(){const{hasReadAccess:s}=kt(),t=s("Integration");return e.jsxs(e.Fragment,{children:[t&&e.jsx(Ut,{}),e.jsxs(zt,{children:[e.jsx(Q,{index:!0,element:e.jsx(ds,{})}),e.jsx(Q,{path:"cves/:cveId",element:e.jsx(Vs,{})}),e.jsx(Q,{path:"clusters/:clusterId",element:e.jsx(er,{})}),e.jsx(Q,{path:"*",element:e.jsxs(T,{hasBodyWrapper:!1,children:[e.jsx(oe,{title:"Platform CVEs - Not Found"}),e.jsx(Kt,{})]})})]})]})}export{or as default};
