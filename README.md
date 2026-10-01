# devops-test-thuan

Website giới thiệu cá nhân + quy trình CI/CD: **GitHub → Jenkins → Build → Deploy → Telegram**.

## Website

- Local (sau deploy): http://localhost:8081
- GitHub Pages: https://thuandvl.github.io/devops-test-thuan/

## Chạy local

```bash
npm install
npm run build
npm start
```

## Pipeline Jenkins

| Stage | Mô tả |
|-------|--------|
| Checkout | Lấy source từ GitHub |
| Install dependencies | `npm install` |
| Build project | `npm run build` → thư mục `dist/` |
| Deploy | Chạy container nginx phục vụ `dist/` |
| Telegram | Gửi thông báo Started / Success / Failed |

## Quy trình CI/CD

1. Developer `git push` lên branch `main`
2. GitHub Webhook kích hoạt Jenkins
3. Jenkins checkout → install → build → deploy
4. Telegram bot gửi thông báo kết quả
5. Truy cập website qua URL

## Cấu trúc

```
├── index.html
├── style.css
├── gioithieu.html
├── build.js
├── package.json
├── Jenkinsfile
└── README.md
```

## Tác giả

Mai Văn Thuận
