# Hướng dẫn nộp bài DevOps (60 phút)

## Đã có sẵn trong repo
- Website chạy được (`index.html` + `npm run build`)
- `README.md`
- `Jenkinsfile` (Checkout → Install → Build → Deploy → Telegram)
- Deploy bằng Docker nginx (port **8081**)

---

## Bước 1 — Push code (GitHub) ✅

```bash
git add .
git commit -m "Add CI/CD pipeline: Jenkins + Deploy + Telegram"
git push origin main
```

Repo: https://github.com/ThuanDVL/devops-test-thuan

---

## Bước 2 — Bật GitHub Pages (URL website)

1. Vào repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / folder: `/ (root)`
4. Save → đợi 1–2 phút
5. URL: https://thuandvl.github.io/devops-test-thuan/

---

## Bước 3 — Tạo Telegram Bot (bắt buộc làm tay)

1. Mở Telegram → chat với **@BotFather**
2. Gõ `/newbot` → đặt tên → nhận **BOT TOKEN** (ví dụ `7123:AAH...`)
3. Chat với bot của bạn (ấn Start)
4. Lấy Chat ID:
   - Chat với **@userinfobot** → lấy Id
   - Hoặc mở: `https://api.telegram.org/bot<TOKEN>/getUpdates` sau khi nhắn bot

Gửi thử:
```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/sendMessage" -d "chat_id=<CHAT_ID>" -d "text=test"
```

---

## Bước 4 — Jenkins Credentials

Mở http://localhost:8080

**Manage Jenkins** → **Credentials** → **System** → **Global** → **Add Credentials**

Thêm 2 credential kiểu **Secret text**:
| Kind | Secret | ID |
|------|--------|-----|
| Secret text | `<BOT_TOKEN>` | `TELEGRAM_BOT_TOKEN` |
| Secret text | `<CHAT_ID>` | `TELEGRAM_CHAT_ID` |

---

## Bước 5 — Tạo Pipeline Job

1. **New Item** → tên: `devops-test-thuan` → **Pipeline** → OK
2. **Build Triggers** ✓ **GitHub hook trigger for GITScm polling**
   (hoặc **Poll SCM**: `H/2 * * * *` nếu không dùng webhook)
3. Pipeline → Definition: **Pipeline script from SCM**
4. SCM: **Git**
5. Repository URL: `https://github.com/ThuanDVL/devops-test-thuan.git`
6. Branch: `*/main`
7. Script Path: `Jenkinsfile`
8. Save → **Build Now**

Kiểm tra: http://localhost:8081 và Telegram.

---

## Bước 6 — Webhook GitHub (CI tự chạy khi push)

1. Repo → **Settings** → **Webhooks** → **Add webhook**
2. Payload URL: `http://<IP-public>:8080/github-webhook/`
   - Nếu máy không có IP public: dùng **Poll SCM** (`H/2 * * * *`) hoặc **ngrok**
3. Content type: `application/json`
4. Event: Just the push event
5. Add webhook

Ngrok (nếu cần):
```bash
ngrok http 8080
# dùng URL ngrok + /github-webhook/
```

---

## Bước 7 — Debug (2 điểm)

### 7.1 Tạo lỗi build
Sửa `build.js` — đổi dòng `console.log("Build completed...")` thành:
```js
throw new Error("Intentional build failure for debug");
```
Push → Jenkins **Failed** → Telegram ❌ → chụp log.

### 7.2 Sửa lỗi
Xóa dòng `throw`, push lại → Jenkins **Success** → Telegram ✅ → chụp.

---

## Bước 8 — Screenshot cần nộp

1. GitHub repo
2. Website mở được (Pages hoặc localhost:8081)
3. Jenkins Pipeline xanh (Success) + lần Failed (debug)
4. Telegram: Started / Success / Failed

---

## Nội dung trình bày (1 điểm)

> Quy trình: Developer push code lên GitHub (branch main) → GitHub Webhook/Poll kích hoạt Jenkins → Jenkins checkout source → cài dependencies (`npm install`) → build project (`npm run build`) → deploy website bằng Docker nginx → Telegram bot gửi thông báo Started/Success/Failed kèm URL.

---

## Link nộp bài

| Hạng mục | Link |
|----------|------|
| GitHub | https://github.com/ThuanDVL/devops-test-thuan |
| Website | https://thuandvl.github.io/devops-test-thuan/ |
| Jenkins | http://localhost:8080 |
| Local deploy | http://localhost:8081 |
