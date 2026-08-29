// ─────────────────────────────────────────────────────────────
// scripts/seed.mjs — ใส่ข้อมูลตัวอย่างลง Firestore (สัปดาห์ที่ 6)
//
// วิธีรัน:  node scripts/seed.mjs
//
// 📌 ใช้ fetch ที่มากับ Node ไม่ต้องติดตั้งอะไรเพิ่ม
// 📌 ใช้คำสั่งเขียนทับ (PATCH) จึงรันซ้ำได้ ไม่เกิดไฟล์ซ้ำ
// 📌 ค่าทุกช่องเก็บเป็นข้อความ (string) ตาม spec ข้อ 7
// ─────────────────────────────────────────────────────────────

const PROJECT_ID = "leaveeasy-rawiwan";
const API_KEY = "AIzaSyCxaIe783UwNrB4pEkZq67d0XyQxtJ9Z-A";
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// ── ข้อมูลตัวอย่าง ตาม spec ข้อ 7 ──

const users = {
  u001: { name: "สมชาย ใจดี",   email: "somchai@example.com", role: "employee" },
  u002: { name: "สมหญิง รักงาน", email: "somying@example.com", role: "manager" },
  u003: { name: "สมศรี ตั้งใจ",  email: "somsri@example.com",  role: "hr" }
};

const leaveTypes = {
  lt001: { name: "ลาพักร้อน" },
  lt002: { name: "ลาป่วย" },
  lt003: { name: "ลากิจ" }
};

const leaveRequests = {
  lr001: {
    title: "ลาพักร้อนไปเที่ยวกับครอบครัว",
    reason: "วางแผนเดินทางไปต่างจังหวัดกับครอบครัว จองที่พักไว้ล่วงหน้าแล้ว",
    status: "รอพิจารณา",
    requesterId: "u001", requesterName: "สมชาย ใจดี",
    approverId: "u002",  approverName: "สมหญิง รักงาน",
    leaveTypeId: "lt001", leaveTypeName: "ลาพักร้อน",
    startDate: "2026-09-07", endDate: "2026-09-09",
    createdAt: "2026-09-01 09:15"
  },
  lr002: {
    title: "ลาป่วยไข้หวัดใหญ่",
    reason: "มีไข้สูงและไอมาก แพทย์แนะนำให้พักอยู่บ้าน 2 วัน",
    status: "อนุมัติ",
    requesterId: "u001", requesterName: "สมชาย ใจดี",
    approverId: "u002",  approverName: "สมหญิง รักงาน",
    leaveTypeId: "lt002", leaveTypeName: "ลาป่วย",
    startDate: "2026-08-24", endDate: "2026-08-25",
    createdAt: "2026-08-24 08:05"
  },
  lr003: {
    title: "ลากิจไปทำบัตรประชาชน",
    reason: "บัตรประชาชนหมดอายุ ต้องไปทำที่สำนักงานเขตในวันทำการ",
    status: "รอพิจารณา",
    requesterId: "u003", requesterName: "สมศรี ตั้งใจ",
    approverId: "",      approverName: "",          // ยังไม่มีใครรับพิจารณา
    leaveTypeId: "lt003", leaveTypeName: "ลากิจ",
    startDate: "2026-09-15", endDate: "2026-09-15",
    createdAt: "2026-09-10 16:30"
  },
  lr004: {
    title: "ลาพักร้อนช่วงวันหยุดยาว",
    reason: "อยากต่อวันหยุดยาวไปพักผ่อนกับครอบครัวอีก 3 วัน",
    status: "ไม่อนุมัติ",
    requesterId: "u003", requesterName: "สมศรี ตั้งใจ",
    approverId: "u002",  approverName: "สมหญิง รักงาน",
    leaveTypeId: "lt001", leaveTypeName: "ลาพักร้อน",
    startDate: "2026-10-12", endDate: "2026-10-16",
    createdAt: "2026-09-20 11:00"
  },
  lr005: {
    title: "ลาป่วยไปพบแพทย์ตามนัด",
    reason: "มีนัดตรวจติดตามอาการกับแพทย์ในช่วงเช้า",
    status: "รอพิจารณา",
    requesterId: "u001", requesterName: "สมชาย ใจดี",
    approverId: "u002",  approverName: "สมหญิง รักงาน",
    leaveTypeId: "lt002", leaveTypeName: "ลาป่วย",
    startDate: "2026-09-22", endDate: "2026-09-22",
    createdAt: "2026-09-18 14:45"
  }
};

// โฟลเดอร์ย่อย — ความเห็นการอนุมัติ ผูกกับใบลาแต่ละใบ
const approvals = {
  lr001: {
    ap001: { authorId: "u002", authorName: "สมหญิง รักงาน",
             message: "รับเรื่องแล้ว ขอดูตารางงานของทีมช่วงนั้นก่อนนะครับ",
             createdAt: "2026-09-01 13:40" },
    ap002: { authorId: "u003", authorName: "สมศรี ตั้งใจ",
             message: "ตรวจแล้ว วันลาพักร้อนคงเหลือครอบคลุมช่วงที่ขอ ไม่ติดขัดฝั่งฝ่ายบุคคล",
             createdAt: "2026-09-02 10:05" }
  },
  lr002: {
    ap003: { authorId: "u002", authorName: "สมหญิง รักงาน",
             message: "อนุมัติแล้ว พักผ่อนให้เต็มที่ งานที่ค้างไว้เดี๋ยวทีมช่วยดูให้",
             createdAt: "2026-08-24 09:20" }
  },
  lr004: {
    ap004: { authorId: "u002", authorName: "สมหญิง รักงาน",
             message: "ช่วงนั้นทีมมีงานส่งมอบพอดี ขอเลื่อนเป็นสัปดาห์ถัดไปได้ไหมครับ",
             createdAt: "2026-09-20 15:10" }
  }
};

// ── ตัวช่วย ──

// แปลงเป็นรูปแบบที่ Firestore REST เข้าใจ — ทุกช่องเป็นข้อความ
function toFields(obj) {
  const fields = {};
  for (const [key, value] of Object.entries(obj)) {
    fields[key] = { stringValue: value };
  }
  return { fields };
}

// เขียนทับไฟล์เดิม ถ้ายังไม่มีก็สร้างใหม่
async function writeDoc(path, data) {
  const res = await fetch(`${BASE}/${path}?key=${API_KEY}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toFields(data))
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`เขียน ${path} ไม่สำเร็จ (${res.status})\n${detail}`);
  }
}

async function countDocs(path) {
  const res = await fetch(`${BASE}/${path}?key=${API_KEY}&pageSize=100`);
  if (!res.ok) return -1;
  const body = await res.json();
  return (body.documents || []).length;
}

// ── ลงมือ ──

async function main() {
  console.log("กำลังใส่ข้อมูลตัวอย่างลง Firestore ...\n");

  for (const [id, data] of Object.entries(users)) {
    await writeDoc(`users/${id}`, data);
    console.log(`  ✔ users/${id}          ${data.name}`);
  }

  for (const [id, data] of Object.entries(leaveTypes)) {
    await writeDoc(`leaveTypes/${id}`, data);
    console.log(`  ✔ leaveTypes/${id}     ${data.name}`);
  }

  for (const [id, data] of Object.entries(leaveRequests)) {
    await writeDoc(`leaveRequests/${id}`, data);
    console.log(`  ✔ leaveRequests/${id}  ${data.status.padEnd(12)} ${data.title}`);
  }

  for (const [ใบลา, รายการ] of Object.entries(approvals)) {
    for (const [id, data] of Object.entries(รายการ)) {
      await writeDoc(`leaveRequests/${ใบลา}/approvals/${id}`, data);
      console.log(`  ✔ ${ใบลา}/approvals/${id}   โดย ${data.authorName}`);
    }
  }

  // ── อ่านกลับมานับ เพื่อยืนยันว่าลงจริง ──
  console.log("\nตรวจผลจากฐานข้อมูลจริง\n");

  const นับ = {
    users: await countDocs("users"),
    leaveTypes: await countDocs("leaveTypes"),
    leaveRequests: await countDocs("leaveRequests")
  };

  let นับความเห็น = 0;
  for (const ใบลา of Object.keys(approvals)) {
    นับความเห็น += await countDocs(`leaveRequests/${ใบลา}/approvals`);
  }

  const ok = (จริง, ควรได้) => (จริง === ควรได้ ? "✅" : "❌");

  console.log(`  ${ok(นับ.users, 3)} users          ${นับ.users}/3`);
  console.log(`  ${ok(นับ.leaveTypes, 3)} leaveTypes     ${นับ.leaveTypes}/3`);
  console.log(`  ${ok(นับ.leaveRequests, 5)} leaveRequests  ${นับ.leaveRequests}/5   (รอพิจารณา 3 · อนุมัติ 1 · ไม่อนุมัติ 1)`);
  console.log(`  ${ok(นับความเห็น, 4)} approvals      ${นับความเห็น}/4`);

  const ครบ = นับ.users === 3 && นับ.leaveTypes === 3 && นับ.leaveRequests === 5 && นับความเห็น === 4;
  console.log(ครบ ? "\n🎉 ใส่ข้อมูลสำเร็จครบทุกไฟล์" : "\n⚠️ ข้อมูลไม่ครบ ดูตัวเลขข้างบนว่าโฟลเดอร์ไหนขาด");
}

main().catch((err) => {
  console.error("\n❌ มีปัญหา:", err.message);
  process.exit(1);
});
