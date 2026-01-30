/* effects.js - Movie Style Version (เส้นคม เล็ก พุ่งเร็ว) */

const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let stars = [];
let starSpeed = 2; 
let targetSpeed = 2;
let isWarping = false;

// ตั้งค่าขนาดจอ
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Class สร้างดาว
class Star {
    constructor() {
        this.reset(true);
    }

    reset(initial = false) {
        this.x = (Math.random() - 0.5) * width * 2;
        this.y = (Math.random() - 0.5) * height * 2;
        this.z = initial ? Math.random() * width : width;
        this.pz = this.z;
        this.size = Math.random(); // ลดขนาดดาวเริ่มต้นลง
    }

    update() {
        this.z -= starSpeed;

        if (this.z < 1) {
            this.reset();
            this.z = width;
            this.pz = this.z;
        }
    }

    draw() {
        let sx = (this.x / this.z) * width + width / 2;
        let sy = (this.y / this.z) * height + height / 2;
        let px = (this.x / this.pz) * width + width / 2;
        let py = (this.y / this.pz) * height + height / 2;

        this.pz = this.z;

        // คำนวณความสว่าง
        let opacity = (1 - this.z / width);
        if(isWarping) opacity = 1; 

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        
        // 🔥 จุดที่แก้ไข: ปรับให้เส้นคม ไม่บวม
        if (isWarping) {
            // โหมด Warp: สีขาวสว่าง เส้นยาว แต่ล็อคความหนาไม่ให้เกิน 2px
            ctx.strokeStyle = `rgba(200, 240, 255, ${opacity})`;
            ctx.lineWidth = Math.min(this.size, 2); // ✅ ล็อคความหนาสูงสุดไว้ที่ 2
        } else {
            // โหมดปกติ: เส้นบางๆ จางๆ
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = this.size * 0.8; 
        }
        
        ctx.stroke();
    }
}

// สร้างดาว 800 ดวง (เพิ่มจำนวนให้ดูแน่นขึ้น)
for (let i = 0; i < 800; i++) {
    stars.push(new Star());
}

function animate() {
    // หางยาวขึ้นนิดหน่อยเพื่อให้ดูพุ่งแรง
    ctx.fillStyle = isWarping ? "rgba(10, 10, 14, 0.2)" : "rgba(10, 10, 14, 0.4)"; 
    ctx.fillRect(0, 0, width, height);

    // Lerp ความเร็ว
    starSpeed += (targetSpeed - starSpeed) * 0.1;

    stars.forEach(star => {
        star.update();
        star.draw();
    });

    requestAnimationFrame(animate);
}
animate();

/* ================= ฟังก์ชันสั่งงาน ================= */

window.startMeteorShower = function() { 
    isWarping = true;
    targetSpeed = 100; // 🚀 เพิ่มความเร็วให้สะใจ
    
    // UI Animation
    const container = document.querySelector('.container');
    const controls = document.querySelectorAll('.admin-controls, .btn-history-toggle');

    if(container) {
        container.style.transition = "opacity 0.5s, transform 0.5s";
        container.style.opacity = "0";
        container.style.transform = "scale(2) perspective(500px) translateZ(200px)"; // พุ่งทะลุจอ
    }
    controls.forEach(el => el.style.opacity = "0");
}

window.stopMeteorShower = function() {
    isWarping = false;
    targetSpeed = 2;
    
    // คืนค่า UI (ถ้าต้องการให้กลับมา)
    // ปกติจะเปลี่ยนหน้าไปแล้ว ไม่ต้องคืนก็ได้ แต่ใส่ไว้เผื่อเทส
    const container = document.querySelector('.container');
    if(container) {
        container.style.opacity = "1";
        container.style.transform = "scale(1)";
    }
}
