# Alt Exam Deployment Guide (Node.js + Nginx on AWS EC2)

**Public IP:** `http://54.87.21.248`

**Deployed Site:** [Purityebere.osinachi.site](http://Purityebere.osinachi.site)

---

## 📁 Project Structure

Here's what the project folder should look like when everything is set up:

```
alt-exam/
├── static-website/
│   └── index.html
├── express-app/
│   └── index.js
└── .gitignore
```

---

##  Step 1: Set Up the Server on AWS

1. Go to the [AWS EC2 Console](https://console.aws.amazon.com/ec2).
2. Click **Launch Instance**.
3. Choose an Ubuntu-based server (e.g., Ubuntu 22.04).
4. Give your instance a name (e.g., "alt-exam-server").
5. Select **t2.micro** if you're using the free tier.
6. Under **Key Pair (login)**, create a new key pair and download the `.pem` file — this is your private key for SSH access. Keep it safe!
7. Configure **Security Group** to allow these ports:

   * `22` – for SSH access
   * `80` – for regular website traffic (HTTP)
   * `443` – for secure traffic (HTTPS)
8. Leave the default storage settings.
9. Click **Launch Instance**.

Once the instance is running, note the **public IPv4 address**: `54.87.21.248`

---

##  Step 2: Connect to Your EC2 Server

Use your terminal or command prompt to connect:

```bash
ssh -i my_file_name.pem ubuntu@54.87.21.248
```

When inside, update packages:

```bash
sudo apt update && sudo apt upgrade -y
```

---

##  Step 3: Install Node.js, Nginx, and PM2

Run these one at a time:

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo apt install -y nginx
sudo npm install -g pm2
```

Check everything installed:

```bash
node -v
npm -v
```

---

##  Step 4: Clone Your Project from GitHub

```bash
git clone https://github.com/EberePurity/alt-exam.git
cd alt-exam
```

---

##  Step 5: Ignore `node_modules` in Git

To prevent uploading unnecessary files:

```bash
echo "node_modules/" > .gitignore
```

---

##  Step 6: Create Your Landing Page

Go to the folder for static content:

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

Press `CTRL+X`, then `Y`, then `Enter` to save.

---

##  Step 7: Build the Express App

Now go to the backend app folder:

```bash
cd ../express-app
nano index.js
```

Paste:

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

Save and close with `CTRL+X`, `Y`, `Enter`.

---

##  Step 8: Start Your App with PM2

```bash
pm2 start express-app/index.js
pm2 save
```

This keeps your app running in the background — even if you close the terminal.

---

##  Step 9: Set Up Nginx as a Reverse Proxy

Let’s route all incoming web traffic to your Node.js app running on port 5000.

```bash
cd /etc/nginx/conf.d
sudo touch altexam.conf
sudo nano altexam.conf
```

Paste this config:

```nginx
server {
    listen 80;

    location / {
        proxy_pass http://127.0.0.1:5000;
    }
}
```

Save with `CTRL+X`, `Y`, then `Enter`.

Now restart Nginx:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

##  Step 10: View Your Site

Open your browser and go to:

```
http://54.87.21.248
```

You should see your landing page! 🎉

---

## Step 11 (Optional): Add HTTPS for Security

If you have a domain or subdomain pointing to your EC2 IP:

1. Install Certbot:

   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   ```

2. Run Certbot:

   ```bash
   sudo certbot --nginx -d Purityebere.osinachi.site
   ```

3. Certbot handles the certificate and reloads Nginx for you.

---

##  Step 12 (Optional): Connect a Domain

If you want a custom domain:

* Buy a domain (e.g., from GoDaddy or Namecheap)
* Or use a free one:

  * [DuckDNS](https://www.duckdns.org)
  * [FreeDNS](https://freedns.afraid.org)

Set an **A record** in your domain DNS settings pointing to your EC2 public IP.

💡 *If you already have a domain, you can also create a subdomain like `exam.yourdomain.com`.*

---

##  PM2 command:

```bash
pm2 list
pm2 logs
pm2 restart all
pm2 stop all
```

--

**That’s it!**
