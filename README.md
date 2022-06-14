# Node Web Application boilerplate

A boilerplate for **Node.js** web applications. 

### Quick start

1. Clone dengan `git clone https://github.com/ferry.krist/node-express-mysql-boilerplate.git <your_project_folder_name>`
2. Masuk ke folder project: `cd <your_project_folder_name>`
3. Install node-module `npm install`
4. Buat database di MySQL server
5. Update file `.env` , isikan mysql host, username dan password
6. Jalankan dengan `npm start` (MySQL service harus sudah berjalan).
7. Jalankan proses migrations jika ada (lihat Note dibawah)
7. Buka `http://localhost:3000`

### Note
1. sequalize kita buat tidak otomatis menjalankan sync(), tapi setiap model sync() secara terpisah. Diatur dalam file `db/init.js`
2. Kenapa tidak langsung saja sync() secara global di file index.js? Kalau kita perlu menggunakan view dalam model, proses sync() akan membuat table yang tidak ada. 
3. Untuk view, tetap kita buatkan Model, tapi tidak kita lakukan sync(), yang dijalankan proses sync() hanya model yang berupa raw table.
3. Untuk menjalankan migration: `npx sequelize-cli db:migrate`
4. Untuk undo migration: `npx sequelize-cli db:migrate:undo`
5. File SQL migration ada di folder `db\migrations`. Ada 2 file: `up.sql` dan `down.sql`


### HOW TO GENERATE SELF SIGN CERTIFICATE
```
openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
```

### APACHE VHOST
```
<VirtualHost *:80>
    ServerName dev.ergonagile.id
    # with optional timeout settings  
#    ProxyPass / http://localhost:3000/ connectiontimeout=5 timeout=30
#        ServerAdmin administrator@n-network.de
        RewriteEngine On
        RewriteCond %{HTTPS} off
        RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
        RewriteRule ^ https://dev.ergonagile.id/%{REQUEST_URI} [P]
</VirtualHost>

<VirtualHost *:443>
    SSLProxyEngine on
    SSLProxyVerify none
    SSLProxyCheckPeerCN off
    SSLProxyCheckPeerName off
    SSLProxyCheckPeerExpire off

    ServerName dev.ergonagile.id
    # with optional timeout settings  
    ProxyPreserveHost On
    ProxyPass / https://localhost:3001/ connectiontimeout=5 timeout=30
    ProxyPassReverse / https://localhost:3001/
</VirtualHost>
```

### Folder Structure
```
.
├── app/
│   ├── controllers/           # Controllers
│   ├── middlewares/           # Middlewares
│   ├── models/                # Express database models
├── config/
│   ├── config.json            # sequalize-cli migration env config
│   ├── database.json          # sequalize database config 
├── db
│   ├── migrations/            # migrations SQL script 
│   ├── seeders/               # migrations seeders
│   ├── init.js                # sequalize init  
├── public/                    
│   ├── css/                   # Stylesheets
│   ├── js/                     
│	├── fonts/                 
│   ├── images/
├── .env                       # API keys, passwords, and other sensitive information
├── routes/                    # Route definitions
├── views/                     # All view files
├── index.js                   # Express application
├── .sequalizerc               # Sequalize migrations config
└── package.json               # NPM Dependencies and scripts
```


### FORK OF
https://github.com/mangya/node-express-mysql-boilerplate.git 