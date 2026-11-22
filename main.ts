import{existsSync,mkdirSync,readdirSync,readFileSync,statSync,writeFileSync}from'node:fs';
import{join}from'node:path';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
for(const id of readdirSync(I).sort()){
 if(!statSync(join(I,id)).isDirectory())continue;
 const P=readFileSync(join(I,id,'program.bin')),N=existsSync(join(I,id,'input.bin'))?readFileSync(join(I,id,'input.bin')):Buffer.alloc(0),n=P.length;
 const D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),U=new Uint8Array(65536);
 let sp=0,cp=0,ip=0,pc=0,st=0,ol=0,ex=0;
 L:for(;;){
  if(st===1e6){ex=10;break L}
  if(pc<0||pc>=n){ex=9;break L}
  const o=P[pc];
  if(!(o<8||o>=16&&o<35||o>=48&&o<53||o===64||o===65||o>=80&&o<84)){ex=5;break L}
  const m=o===1?1:o===2?4:o>=48&&o<52?2:0;
  if(pc+m>=n){ex=9;break L}
  st++;
  const x=pc+1+m;
  let p,u;
  if(o<8){p=[0,0,0,1,1,2,2,3][o];u=[0,1,1,0,2,2,3,3][o]}
  else if(o<35){p=o===23||o===27?1:2;u=1}
  else if(o<53){p=o===49||o===50?1:0;u=0}
  else if(o===64){p=1;u=1}
  else if(o===65){p=2;u=0}
  else if(o<82){p=1;u=0}
  else if(o===82){p=0;u=1}
  else{p=1;u=0}
  if(sp<p){ex=2;break L}
  if(sp-p+u>256){ex=3;break L}
  pc=x;
  switch(o){
   case 0:ex=0;break L;
   case 1:D[sp++]=(P[x-1]<<24)>>24;break;
   case 2:D[sp++]=P[x-4]|P[x-3]<<8|P[x-2]<<16|P[x-1]<<24;break;
   case 3:sp--;break;
   case 4:D[sp]=D[sp-1];sp++;break;
   case 5:{const t=D[sp-1];D[sp-1]=D[sp-2];D[sp-2]=t;break}
   case 6:D[sp]=D[sp-2];sp++;break;
   case 7:{const a=D[sp-3];D[sp-3]=D[sp-2];D[sp-2]=D[sp-1];D[sp-1]=a;break}
   case 23:D[sp-1]=-D[sp-1]|0;break;
   case 27:D[sp-1]=~D[sp-1];break;
   case 16:case 17:case 18:case 19:case 20:case 21:case 22:case 24:case 25:case 26:case 28:case 29:case 30:case 32:case 33:case 34:{
    const b=D[sp-1],a=D[sp-2];let r=0;
    if(o===16)r=(a+b)|0;
    else if(o===17)r=(a-b)|0;
    else if(o===18)r=Math.imul(a,b);
    else if(o===19){if(!b){ex=4;break L}r=a===-2147483648&&b===-1?a:(a/b)|0}
    else if(o===20){if(!b){ex=4;break L}r=b===-1?0:(a%b)|0}
    else if(o===21){if(!b){ex=4;break L}r=Math.floor((a>>>0)/(b>>>0))|0}
    else if(o===22){if(!b){ex=4;break L}r=((a>>>0)%(b>>>0))|0}
    else if(o===24)r=a&b;
    else if(o===25)r=a|b;
    else if(o===26)r=a^b;
    else if(o===28)r=a<<(b&31);
    else if(o===29)r=a>>(b&31);
    else if(o===30)r=(a>>>(b&31))|0;
    else if(o===32)r=a===b?1:0;
    else if(o===33)r=a<b?1:0;
    else r=(a>>>0)<(b>>>0)?1:0;
    sp-=2;D[sp++]=r;break}
   case 48:pc=x+(((P[x-2]|P[x-1]<<8)<<16)>>16);break;
   case 49:case 50:{const v=D[--sp];if(o===49?v===0:v!==0)pc=x+(((P[x-2]|P[x-1]<<8)<<16)>>16);break}
   case 51:{if(cp===64){ex=7;break L}C[cp++]=x;pc=P[x-2]|P[x-1]<<8;break}
   case 52:{if(!cp){ex=8;break L}pc=C[--cp];break}
   case 64:{const a=D[sp-1];if(a<0||a>255){ex=6;break L}D[sp-1]=M[a];break}
   case 65:{const a=D[sp-1],v=D[sp-2];if(a<0||a>255){ex=6;break L}sp-=2;M[a]=v;break}
   case 80:{const s=String(D[sp-1]);if(ol+s.length>65536){ex=11;break L}sp--;for(let i=0;i<s.length;i++)U[ol++]=s.charCodeAt(i);break}
   case 81:{if(ol>=65536){ex=11;break L}U[ol++]=D[--sp]&255;break}
   case 82:D[sp++]=ip<N.length?N[ip++]:-1;break;
   case 83:ex=D[--sp]&255;break L;
  }
 }
 mkdirSync(join(O,id),{recursive:true});
 writeFileSync(join(O,id,'stdout.bin'),U.subarray(0,ol));
 writeFileSync(join(O,id,'exit.txt'),ex+'\n');
}
