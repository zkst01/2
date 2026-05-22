const cv=document.getElementById('bg'),cx=cv.getContext('2d');
function rsz(){cv.width=innerWidth;cv.height=innerHeight;}rsz();window.addEventListener('resize',rsz);
const rings=[];
setInterval(()=>rings.push({r:5,a:.55,spd:2.2+Math.random()*1.8}),700);
rings.push({r:5,a:.55,spd:2.5});
let t=0;
function draw(){
  cx.fillStyle='rgba(3,10,20,.18)';cx.fillRect(0,0,cv.width,cv.height);
  const X=cv.width/2,Y=cv.height/2;
  if(t%4===0){for(let x=0;x<cv.width;x+=38)for(let y=0;y<cv.height;y+=38){cx.fillStyle='rgba(126,200,227,.05)';cx.beginPath();cx.arc(x,y,.8,0,Math.PI*2);cx.fill();}}
  for(let i=rings.length-1;i>=0;i--){
    const r=rings[i];r.r+=r.spd;r.a-=.007;
    if(r.a<=0){rings.splice(i,1);continue;}
    cx.strokeStyle=`rgba(210,30,50,${r.a})`;cx.lineWidth=1.5;
    cx.beginPath();cx.arc(X,Y,r.r,0,Math.PI*2);cx.stroke();
    cx.strokeStyle=`rgba(210,30,50,${r.a*.25})`;cx.lineWidth=7;
    cx.beginPath();cx.arc(X,Y,r.r,0,Math.PI*2);cx.stroke();
  }
  t++;requestAnimationFrame(draw);
}
draw();

function removeBackground(imgEl,thr){
  const w=imgEl.naturalWidth,h=imgEl.naturalHeight;
  const off=document.createElement('canvas');
  off.width=w;off.height=h;
  const oc=off.getContext('2d');oc.drawImage(imgEl,0,0);
  const id=oc.getImageData(0,0,w,h),d=id.data;
  const vis=new Uint8Array(w*h);
  function isW(i){return d[i]>thr&&d[i+1]>thr&&d[i+2]>thr;}
  const q=[];
  for(let x=0;x<w;x++){q.push(x,0);q.push(x,h-1);}
  for(let y=1;y<h-1;y++){q.push(0,y);q.push(w-1,y);}
  let qi=0;
  while(qi<q.length){
    const x=q[qi++],y=q[qi++];
    if(x<0||x>=w||y<0||y>=h)continue;
    const p=y*w+x;if(vis[p])continue;vis[p]=1;
    const i=p*4;if(!isW(i))continue;
    const wt=(d[i]+d[i+1]+d[i+2])/3;
    d[i+3]=Math.min(d[i+3],Math.round((255-wt)/(255-thr)*255));
    q.push(x+1,y);q.push(x-1,y);q.push(x,y+1);q.push(x,y-1);
  }
  oc.putImageData(id,0,0);return off;
}