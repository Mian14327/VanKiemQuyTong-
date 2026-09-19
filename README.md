# 🗡️ AI_26_VanKiemQuyTong - Vạn Kiếm Quy Tông 3D

> **Smart Things Group**  
> Dự án mô phỏng trận kiếm 3D tương tác thời gian thực qua cử chỉ bàn tay với Trí Tuệ Nhân Tạo (**MediaPipe AI Hand Tracking**) & Đồ họa 3D (**Three.js / React Three Fiber**).

---

## 🌟 Giới Thiệu Dự Án

**Vạn Kiếm Quy Tông** (*Sword Array Simulation*) là một ứng dụng Web 3D lấy cảm hứng từ tuyệt kỹ kiếm đạo huyền thoại trong tiên hiệp và kiếm hiệp. Người dùng có thể trực tiếp đứng trước webcam máy tính hoặc điện thoại, dùng các cử chỉ bàn tay (kiếm chỉ, nắm đấm, xòe tay, kết ấn) để điều khiển hàng ngàn thanh phi kiếm bay lượn, phòng thủ và biến hóa thành các đại trận pháp kỳ ảo.

Hệ thống xử lý **AI Computer Vision** hoàn toàn trực tiếp trên trình duyệt máy khách (On-device WebAssembly + WebGL GPU), đảm bảo tốc độ phản hồi tức thì (< 20ms) và bảo mật tuyệt đối cho hình ảnh người dùng.

---

## ✨ Tính Năng Nổi Bật

### 1. ⚔️ Hơn 2.000 Phi Kiếm 3D Thời Gian Thực (GPU Instancing)
- Sử dụng công nghệ **`InstancedMesh`** của Three.js kết hợp thuật toán ghép khối hình học (`BufferGeometryUtils`), cho phép kết xuất đồng thời 2.000 thanh kiếm trên PC (300 kiếm trên Mobile) với tốc độ khung hình ổn định **60 FPS**.
- Mỗi thanh kiếm đều có độ vát lưỡi, chuôi kiếm, vầng kiếm quang (Aura) phát sáng và quỹ đạo bay tự nhiên dựa trên trường nhiễu không gian (Simplex Noise).

### 2. 🖐️ Điều Khiển Bằng Cử Chỉ Tay AI (MediaPipe Vision)
- Nhận diện 21 điểm mốc xương bàn tay (Hand Landmarks) qua mô hình học sâu của Google MediaPipe.
- Tự động phân tích góc uốn của từng ngón tay để nhận diện chính xác 4 dạng thế trận trong tích tắc.

### 3. 🌀 4 Đại Kiếm Trận Huyền Thoại

| Trận Pháp | Cử Chỉ Tay | Ý Nghĩa & Hiệu Ứng |
| :--- | :--- | :--- |
| 🐉 **Du Long Phi Hành** | 👈 **Kiếm Chỉ** *(Ngón trỏ hoặc Ngón cái + Ngón trỏ)* | Hàng ngàn thanh kiếm tập hợp thành thân rồng uốn lượn bay lướt tốc độ cao theo đầu ngón tay chỉ. |
| 🌸 **Trận Hoa Sen** | 🖐️ **Xòe Bàn Tay** *(Cả 5 ngón mở rộng)* | Các phi kiếm tản đều tạo thành một đóa sen kiếm nghìn cánh khổng lồ xoay tròn hộ mệnh. |
| 🛡️ **Hãm Phong Kiếm Trận** | ✊ **Nắm Đấm** *(Nắm chặt bàn tay)* | Vạn kiếm cấp tốc thu hồi, bao bọc quanh chủ thể thành một quả cầu kiếm trận kiên cố, bất khả xâm phạm. |
| 🤘 **Đại Canh Kiếm Trận** | 🤘 **Kết Ấn Huyền Môn** *(Dựng ngón trỏ & ngón út)* | Bố trí trận địa kiếm hình trụ khổng lồ thấu trời, kích hoạt lôi kiếp sấm sét chấn động hư không. |

### 4. 🔮 Hiệu Ứng Thị Giác Đỉnh Cao
- **Hào Quang Thần Tiên (Unreal Bloom Effect):** Ánh sáng kiếm khí vàng - lục rực rỡ tỏa sáng trong không gian tối.
- **Lôi Kiếp Sấm Sét (`DivineLightning`):** Những tia sét chớp nháy giáng xuống chân thực khi khởi động đại trận.
- **Pháp Trận Cổ Đại (`MagicCircle`):** Vòng xoay ma trận bát quái đa tầng phát sáng huyền bí dưới chân kiếm trận.
- **Trường Sao & Linh Khí (`StarField` & `SpiritParticles`):** Không gian vũ trụ huyền ảo với hàng ngàn vì sao và hạt linh khí trôi lơ lửng.
- **Hỗ trợ Đa Thiết Bị:** Tự động phát hiện hướng xoay màn hình điện thoại với thông báo chuyển ngang chuẩn xác (`OrientationGuard`).

---

## 🛠️ Công Nghệ Sử Dụng

- **Core Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
- **3D Graphics Rendering:**
  - [Three.js](https://threejs.org/) - Thư viện đồ họa 3D WebGL mạnh mẽ.
  - [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) - React renderer cho Three.js.
  - [@react-three/drei](https://github.com/pmndrs/drei) - Tiện ích hỗ trợ không gian 3D.
  - [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing) - Xử lý hậu kỳ ánh sáng phát quang (Bloom).
- **AI & Computer Vision:**
  - [@mediapipe/tasks-vision](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker) - Nhận diện bàn tay trên nền WebAssembly & WebGL.
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) - Quản lý trạng thái chuyển động và chế độ cử chỉ mượt mà, không giật lag.

---

## 📁 Cấu Trúc Thư Mục

```text
AI_26_VanKiemQuyTong/
├── public/
│   ├── models/
│   │   ├── hand_landmarker.task      # Model AI nhận diện bàn tay MediaPipe
│   │   └── wasm/                      # Thư viện WebAssembly biên dịch chạy trên trình duyệt
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── CameraController.tsx      # Quản lý góc quay và di chuyển camera mượt mà
│   │   ├── DivineLightning.tsx       # Hiệu ứng tia sét lôi kiếp trong trận pháp
│   │   ├── HandController.tsx        # Cầu nối giữa AI MediaPipe và thế giới 3D
│   │   ├── MagicCircle.tsx           # Pháp trận phù văn cổ đại xoay đa tầng
│   │   ├── OrientationGuard.tsx      # Cảnh báo xoay ngang màn hình trên thiết bị di động
│   │   ├── Scene.tsx                 # Không gian vũ trụ, ánh sáng và hiệu ứng Bloom
│   │   ├── ShieldOrb.tsx             # Quả cầu kiếm trận khi kích hoạt chế độ phòng thủ
│   │   └── SwordSwarm.tsx            # Trọng tâm mô phỏng khí động học 2000 thanh kiếm
│   ├── services/
│   │   └── HandTrackingService.ts    # Khởi tạo camera, trích xuất 21 điểm xương & nhận diện cử chỉ
│   ├── App.tsx                       # Component chính tích hợp Canvas 3D và giao diện UI
│   ├── index.css                     # Phong cách hiển thị toàn màn hình Dark Mode
│   ├── main.tsx                      # Điểm khởi chạy ứng dụng React
│   └── store.ts                      # Cấu hình tham số vật lý (vận tốc, bán kính, số lượng kiếm)
├── index.html                        # Trang HTML chuẩn bị sẵn Canvas và viewport
├── package.json                      # Danh sách các gói phụ thuộc dự án
├── tsconfig.json                     # Cấu hình TypeScript tối ưu
└── vite.config.ts                    # Cấu hình Vite build siêu nhanh
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ

### 1. Yêu cầu hệ thống
- Máy tính hoặc điện thoại có **Webcam / Camera trước**.
- Đã cài đặt **[Node.js](https://nodejs.org/)** (khuyến nghị phiên bản 18 LTS trở lên).
- Trình duyệt hỗ trợ WebGL và WebAssembly (Chrome, Edge, Brave, Safari, Firefox).

### 2. Tải mã nguồn & Cài đặt thư viện
```bash
# Clone repository về máy
git clone https://github.com/Smart-Things-Group/AI_26_VanKiemQuyTong.git

# Di chuyển vào thư mục dự án
cd AI_26_VanKiemQuyTong

# Cài đặt các gói phụ thuộc
npm install
```

### 3. Chạy môi trường phát triển (Dev Server)
```bash
npm run dev
```
Sau khi chạy lệnh, mở trình duyệt truy cập vào đường dẫn:
```text
http://localhost:5173
```
> 💡 **Lưu ý:** Khi trình duyệt hiển thị hộp thoại xin cấp quyền sử dụng Máy ảnh (Camera), bạn hãy chọn **"Cho phép" (Allow)** để hệ thống AI bắt đầu nhận diện cử chỉ bàn tay.

### 4. Đóng gói cho môi trường Production
```bash
npm run build
```
Mã nguồn sau khi build sẽ nằm trong thư mục `dist/`, sẵn sàng đưa lên Vercel, Netlify hoặc GitHub Pages.

---

## ⚙️ Tùy Biến Tham Số Kiếm Trận

Bạn có thể dễ dàng thay đổi các thông số vật lý và số lượng phi kiếm tại tệp [src/store.ts](file:///c:/Users/kxkxk/Downloads/VanKiemQuyTong/src/store.ts):

```typescript
export const CONFIG = {
  swordCount: isMobile ? 300 : 2000,   // Số lượng phi kiếm hiển thị
  pathHistoryLength: 300,              // Độ dài vệt bay theo ngón tay
  maxSpeed: 75,                        // Tốc độ bay tiêu chuẩn
  sprintSpeed: 125,                    // Tốc độ bay cực đại khi ngón tay di chuyển nhanh
  shieldRadius: 18,                    // Bán kính quả cầu phòng thủ
  lotusRadius: 24,                     // Độ xòe rộng của hoa sen kiếm trận
  dagengRadius: 30,                    // Bán kính vòng ngoài Đại Canh Kiếm Trận
};
```

---

## 👥 Về Chúng Tôi

Dự án được xây dựng và phát triển bởi thành viên **Smart Things Group**.  
Mọi đóng góp, báo lỗi (Issue) hoặc đề xuất tính năng mới (Pull Request) đều rất được hoan nghênh!
