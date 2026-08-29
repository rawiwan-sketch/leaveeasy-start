// ─────────────────────────────────────────────────────────────
// js/firebase.js — จุดเชื่อมต่อ Firebase ที่เดียวของทั้งระบบ
// สัปดาห์ที่ 6: เปิดการเชื่อมต่อ Firestore แล้วส่งออกให้หน้าอื่นเรียกใช้
//
// 📌 โหลด SDK จาก CDN โดยตรง ไม่มีขั้นตอน build ตาม spec ข้อ 0.2
// 📌 apiKey ไม่ใช่รหัสลับ — สิ่งที่ป้องกันฐานข้อมูลจริงคือ Security Rules
//    ซึ่งเป็นงานของสัปดาห์ที่ 8
// ─────────────────────────────────────────────────────────────

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCxaIe783UwNrB4pEkZq67d0XyQxtJ9Z-A",
  authDomain: "leaveeasy-rawiwan.firebaseapp.com",
  projectId: "leaveeasy-rawiwan",
  storageBucket: "leaveeasy-rawiwan.firebasestorage.app",
  messagingSenderId: "703210501505",
  appId: "1:703210501505:web:6600b96969174f586da480"
};

const app = initializeApp(firebaseConfig);

// คลังข้อมูล — หน้าอื่นเรียกใช้ด้วย  import { db } from "./firebase.js";
export const db = getFirestore(app);
