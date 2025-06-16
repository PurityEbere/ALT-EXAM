# Alt Exam Deployment Guide (Node.js + Nginx on AWS EC2)

**Public IP:** `http://54.87.21.248`
**Deployed Site:** [Purityebere.osinachi.site](http://Purityebere.osinachi.site)

---

## 📁 Project Structure

```
alt-exam/
├── static-website/
│   └── index.html
├── express-app/
│   └── index.js
└── .gitignore
```

---

##  1. Launch EC2 Server

* Go to [AWS EC2 Console](https://console.aws.amazon.com/ec2)
* Launch new instance → Ubuntu 22.04
* Choose t2.micro
* Create/download a `.pem` key pair
* Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS)
* Launch instance

---

##  2. Connect to EC2 via SSH

```bash
ssh -i my_file_name.pem ubuntu@54.87.21.248
```

Update the server:

```bash
sudo apt update && sudo apt upgrade -y
```

---

##  3. Install Node.js, Nginx, and PM2

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo apt install -y nginx
sudo npm install -g pm2
```

---

##  4. Clone Your Project

```bash
git clone https://github.com/EberePurity/alt-exam.git
cd alt-exam
```

---

##  5. Add .gitignore

```bash
echo "node_modules/" > .gitignore
```

---

##  6. Create HTML Landing Page

```bash
cd static-website
nano index.html
```

Paste this:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>The Future of Something</title>
  </head>
  <body>
    <h1>Welcome to the Future</h1>
    <p>This is a static HTML page served via Node.js and Nginx.</p>
  </body>
</html>
```

Save and exit.

---

##  7. Build Express App

```bash
cd ../express-app
nano index.js
```

Paste this:

```js
const express = require('express');
const path = require('path');

const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, '..', 'static-website', 'index.html');
  res.sendFile(filePath);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
```

---

##  8. Start Node App with PM2

```bash
pm2 start express-app/index.js
pm2 save
```

---

##  9. Set Up Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/default
```

Replace the default block with:

```nginx
server {
    listen 80;
    server_name Purityebere.osinachi.site;

    location / {
        proxy_pass http://localhost:5500;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Comment out default behavior:
    # root /var/www/html;
    # index index.html index.htm index.nginx-debian.html;
    # try_files $uri $uri/ =404;
}
```

Test and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

##  10. Access the Site

Visit your site:

```
http://54.87.21.248
http://Purityebere.osinachi.site
```

---

 That’s the exact process I followed to deploy my app with Node.js and Nginx on AWS EC2.
