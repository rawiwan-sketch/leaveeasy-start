// ─────────────────────────────────────────────────────────────
// js/leave-requests.js — หน้าที่ 1 รายการใบลา
// สัปดาห์ที่ 6: อ่านจาก Firestore ของจริง (ไม่ใช้ js/data.js แล้ว)
//
// 📌 ไฟล์นี้เป็นโมดูล จึงต้องเปิดผ่าน http://localhost:3000
//    เปิดด้วยการดับเบิลคลิกไฟล์ (file://) จะไม่ทำงาน
// ─────────────────────────────────────────────────────────────

import { db } from "./firebase.js";
import {
  collection, getDocs, query, orderBy, limit
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

var กล่อง = document.getElementById("ผลลัพธ์");

// จำนวนใบลาสูงสุดที่ดึงมาแสดง — spec ห้ามทำแบ่งหน้า ให้จำกัดจำนวนแทน
var จำนวนสูงสุด = 50;

โหลดรายการ();

async function โหลดรายการ() {
  กล่อง.innerHTML = "<p>กำลังโหลดข้อมูลจากฐานข้อมูล…</p>";

  var ใบลาทั้งหมด;
  try {
    // ดึงใบลาจากโฟลเดอร์ leaveRequests เรียงใหม่ก่อนเก่า
    var คำสั่ง = query(
      collection(db, "leaveRequests"),
      orderBy("createdAt", "desc"),
      limit(จำนวนสูงสุด)
    );
    var ผลลัพธ์ = await getDocs(คำสั่ง);

    // ชื่อไฟล์คือ id ของใบลา จึงต้องหยิบมาใส่เองด้วย
    ใบลาทั้งหมด = ผลลัพธ์.docs.map(function (ไฟล์) {
      return Object.assign({ id: ไฟล์.id }, ไฟล์.data());
    });
  } catch (ปัญหา) {
    console.error("อ่านข้อมูลจาก Firestore ไม่สำเร็จ:", ปัญหา);
    กล่อง.innerHTML =
      "<p>ต่อฐานข้อมูลไม่สำเร็จ — เปิดหน้านี้ผ่าน http://localhost:3000 หรือยัง " +
      "และดูข้อความเพิ่มเติมได้ในหน้าต่าง Console ของเบราว์เซอร์</p>";
    return;
  }

  // ใบที่เพิ่งยื่นในหน้าถัดไป ยังเก็บอยู่ในเบราว์เซอร์เท่านั้น
  // (การบันทึกลงฐานข้อมูลจริงเป็นงานของสัปดาห์ที่ 7)
  var ใบลาที่ยื่นใหม่ = JSON.parse(sessionStorage.getItem("ใบลาที่ยื่นใหม่") || "[]");
  ใบลาทั้งหมด = ใบลาที่ยื่นใหม่.concat(ใบลาทั้งหมด);

  // ถ้ามีสถานะติดมาท้าย URL ให้กรองเฉพาะสถานะนั้น
  var สถานะที่กรอง = ค่าจากURL("status");
  if (สถานะที่กรอง) {
    ใบลาทั้งหมด = ใบลาทั้งหมด.filter(function (ใบ) { return ใบ.status === สถานะที่กรอง; });
    document.querySelector(".subtitle").textContent =
      "กำลังแสดงเฉพาะใบลาที่สถานะ " + สถานะที่กรอง + " · กดเมนู รายการใบลา เพื่อดูทั้งหมด";
  }

  แสดงตาราง(ใบลาทั้งหมด);
}

function แสดงตาราง(รายการ) {
  if (รายการ.length === 0) {
    กล่อง.innerHTML = "<p>ยังไม่มีใบขอลาในระบบ</p>";
    return;
  }

  var html =
    "<table><thead><tr>" +
    "<th>หัวข้อ</th>" +
    "<th>ประเภทการลา</th>" +
    "<th>สถานะ</th>" +
    '<th class="hide-mobile">ผู้ขอลา</th>' +
    '<th class="hide-mobile">วันที่ลา</th>' +
    "</tr></thead><tbody>";

  รายการ.forEach(function (ใบ) {
    html +=
      '<tr class="clickable" data-id="' + esc(ใบ.id) + '">' +
      "<td>" + esc(ใบ.title) + "</td>" +
      "<td>" + esc(ใบ.leaveTypeName) + "</td>" +
      "<td>" + ป้ายสถานะ(ใบ.status) + "</td>" +
      '<td class="hide-mobile">' + esc(ใบ.requesterName) + "</td>" +
      '<td class="hide-mobile">' + esc(ใบ.startDate) + " ถึง " + esc(ใบ.endDate) + "</td>" +
      "</tr>";
  });

  html += "</tbody></table>";
  กล่อง.innerHTML = html;

  // กดที่แถวไหน ไปหน้ารายละเอียดของใบนั้น
  กล่อง.querySelectorAll("tr.clickable").forEach(function (แถว) {
    แถว.addEventListener("click", function () {
      location.href = "leave-request-detail.html?id=" + แถว.dataset.id;
    });
  });
}
