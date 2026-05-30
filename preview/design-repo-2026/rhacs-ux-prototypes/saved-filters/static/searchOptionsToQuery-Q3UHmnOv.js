function a(t){return t.map((e,r,{length:u})=>{const n=String(e.value);return e.type?`${r!==0?"+":""}${n}`:`${n}${r!==u-1?",":""}`}).join("").replace(/,\+/g,"+")}export{a as s};
