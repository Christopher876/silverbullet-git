var mod=(()=>{var l=Object.defineProperty;var C=Object.getOwnPropertyDescriptor;var A=Object.getOwnPropertyNames;var k=Object.prototype.hasOwnProperty;var p=(e,t)=>{for(var o in t)l(e,o,{get:t[o],enumerable:!0})},M=(e,t,o,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of A(t))!k.call(e,i)&&i!==o&&l(e,i,{get:()=>t[i],enumerable:!(n=C(t,i))||n.enumerable});return e};var F=e=>M(l({},"__esModule",{value:!0}),e);var he={};p(he,{functionMapping:()=>w});function f(e){let t=atob(e),o=t.length,n=new Uint8Array(o);for(let i=0;i<o;i++)n[i]=t.charCodeAt(i);return n}function S(e,t){return syscall("sandboxFetch.fetch",e,t)}function y(){globalThis.nativeFetch=globalThis.fetch,globalThis.fetch=async function(e,t){let o=await S(e,t&&{method:t.method,headers:t.headers,body:t.body});return new Response(o.base64Body?f(o.base64Body):null,{status:o.status,headers:o.headers})}}typeof Deno>"u"&&(self.Deno={args:[],build:{arch:"x86_64"},env:{get(){}}});var g=new Map,d=0;function u(e){self.postMessage(e)}self.syscall=async(e,...t)=>await new Promise((o,n)=>{d++,g.set(d,{resolve:o,reject:n}),u({type:"sys",id:d,name:e,args:t})});function x(e,t){self.addEventListener("message",o=>{(async()=>{let n=o.data;switch(n.type){case"inv":{let i=e[n.name];if(!i)throw new Error(`Function not loaded: ${n.name}`);try{let c=await Promise.resolve(i(...n.args||[]));u({type:"invr",id:n.id,result:c})}catch(c){console.error(c),u({type:"invr",id:n.id,error:c.message})}}break;case"sysr":{let i=n.id,c=g.get(i);if(!c)throw Error("Invalid request id");g.delete(i),n.error?c.reject(new Error(n.error)):c.resolve(n.result)}break}})().catch(console.error)}),u({type:"manifest",manifest:t})}y();var m=self.syscall;var s={};p(s,{run:()=>R});function R(e,t){return m("shell.run",e,t)}var a={};p(a,{confirm:()=>te,dispatch:()=>Z,downloadFile:()=>K,filterBox:()=>Q,flashNotification:()=>V,fold:()=>se,foldAll:()=>me,getCurrentPage:()=>T,getCursor:()=>I,getSelection:()=>O,getText:()=>G,getUiOption:()=>re,hidePanel:()=>W,insertAtCursor:()=>X,insertAtPos:()=>z,moveCursor:()=>J,navigate:()=>$,openUrl:()=>B,prompt:()=>ee,reloadPage:()=>j,replaceRange:()=>H,save:()=>_,setPage:()=>N,setSelection:()=>L,setUiOption:()=>oe,showPanel:()=>Y,syncSpace:()=>ie,toggleFold:()=>ce,unfold:()=>ae,unfoldAll:()=>ue,vimEx:()=>ne});typeof self>"u"&&(self={syscall:()=>{throw new Error("Not implemented here")}});var r=self.syscall;function T(){return r("editor.getCurrentPage")}function N(e){return r("editor.setPage",e)}function G(){return r("editor.getText")}function I(){return r("editor.getCursor")}function O(){return r("editor.getSelection")}function L(e,t){return r("editor.setSelection",e,t)}function _(){return r("editor.save")}function $(e,t,o=!1,n=!1){return r("editor.navigate",e,t,o,n)}function j(){return r("editor.reloadPage")}function B(e,t=!1){return r("editor.openUrl",e,t)}function K(e,t){return r("editor.downloadFile",e,t)}function V(e,t="info"){return r("editor.flashNotification",e,t)}function Q(e,t,o="",n=""){return r("editor.filterBox",e,t,o,n)}function Y(e,t,o,n=""){return r("editor.showPanel",e,t,o,n)}function W(e){return r("editor.hidePanel",e)}function z(e,t){return r("editor.insertAtPos",e,t)}function H(e,t,o){return r("editor.replaceRange",e,t,o)}function J(e,t=!1){return r("editor.moveCursor",e,t)}function X(e){return r("editor.insertAtCursor",e)}function Z(e){return r("editor.dispatch",e)}function ee(e,t=""){return r("editor.prompt",e,t)}function te(e){return r("editor.confirm",e)}function re(e){return r("editor.getUiOption",e)}function oe(e,t){return r("editor.setUiOption",e,t)}function ne(e){return r("editor.vimEx",e)}function ie(){return r("editor.syncSpace")}function se(){return r("editor.fold")}function ae(){return r("editor.unfold")}function ce(){return r("editor.toggleFold")}function me(){return r("editor.foldAll")}function ue(){return r("editor.unfoldAll")}async function P(e){e||(e="Snapshot"),console.log("Snapshotting the current space to git with commit message",e);let{code:t}=await s.run("git",["add","./*"]);console.log("Git add code",t);try{await s.run("git",["commit","-a","-m",e])}catch{}console.log("Done!")}async function h(){let e=await a.prompt("Revision name:");e||(e="Snapshot"),console.log("Revision name",e),await P(e),await a.flashNotification("Done!")}async function b(){await a.flashNotification("Syncing with git"),console.log("Going to sync with git"),await P(),console.log("Then pulling from remote"),await s.run("git",["pull"]),console.log("And then pushing to remote"),await s.run("git",["push"]),console.log("Done!"),await a.flashNotification("Git sync complete!")}async function v(){let e=await a.prompt("Github project URL:");if(!e)return;let t=await a.prompt("Github token:");if(!t)return;let o=await a.prompt("Your name:");if(!o)return;let n=await a.prompt("Your email:");if(!n)return;let i=e.split("/");i[2]=`${t}@${i[2]}`,e=i.join("/")+".git",await a.flashNotification("Now going to clone the project, this may take some time."),await s.run("mkdir",["-p","_checkout"]),await s.run("git",["clone",e,"_checkout"]),await s.run("sh",["-c","mv _checkout/{.,}* . 2> /dev/null; true"]),await s.run("rm",["-rf","_checkout"]),await s.run("git",["config","user.name",o]),await s.run("git",["config","user.email",n]),await a.flashNotification("Done. Now just wait for sync to kick in to get all the content.")}var w={githubCloneCommand:v,snapshotCommand:h,syncCommand:b},Pe={name:"git",requiredPermissions:["shell"],functions:{githubCloneCommand:{path:"./git.ts:githubCloneCommand",command:{name:"Github: Clone"}},snapshotCommand:{path:"./git.ts:snapshotCommand",command:{name:"Git: Snapshot"}},syncCommand:{path:"./git.ts:syncCommand",command:{name:"Git: Sync"}}},assets:{}};x(w,Pe);return F(he);})();
