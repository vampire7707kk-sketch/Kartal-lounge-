import {initializeApp} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {getAuth,signInWithEmailAndPassword,onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {getFirestore,doc,getDoc,collection,addDoc,onSnapshot,query,orderBy,serverTimestamp} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import {firebaseConfig} from "./app-config.js";
const $=id=>document.getElementById(id);
if(firebaseConfig.apiKey==="PASTE_API_KEY"){$("msg").textContent="ابتدا app-config.js را با تنظیمات Firebase پر کنید.";}
else{
const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);let profile,user;
$("login").onclick=async()=>{try{await signInWithEmailAndPassword(auth,$("email").value.trim(),$("password").value);$("msg").textContent="";}catch(e){$("msg").textContent="ورود ناموفق: "+e.message;}};
onAuthStateChanged(auth,async u=>{if(!u){$("panel").hidden=true;return;}user=u;let s=await getDoc(doc(db,"users",u.uid));if(!s.exists()){await signOut(auth);$("msg").textContent="پروفایل این کاربر در users/{UID} ساخته نشده.";return;}profile=s.data();$("panel").hidden=false;$("hello").textContent="سلام "+(profile.name||u.email);$("manager").hidden=profile.role!=="manager";onSnapshot(query(collection(db,"tasks"),orderBy("createdAt","desc")),snap=>{$("tasks").innerHTML="";snap.forEach(d=>{let t=d.data(),el=document.createElement("p");el.textContent=t.title+" — "+t.area+" — "+(t.assignee||"همه");$("tasks").append(el);});});});
$("add").onclick=async()=>{if(profile?.role!=="manager")return;let title=$("title").value.trim();if(!title)return;try{await addDoc(collection(db,"tasks"),{title,area:$("area").value,assignee:$("assignee").value,createdBy:user.uid,createdAt:serverTimestamp()});$("title").value="";}catch(e){alert("ثبت نشد: "+e.message);}};
}