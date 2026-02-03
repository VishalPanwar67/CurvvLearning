# 🧑‍💻 Top 50 Linux Commands for SDE-I (Developer Workflow)

This guide organizes the most used Linux commands into a real developer workflow—
from setting up your workspace to debugging code and managing servers.
Ideal for SDE-I roles, interviews, and daily development.

---

## 📂 1. Navigation & Workspace Setup

- **pwd** – Displays the full path of the current directory  
  Example: `pwd`

- **ls** – Lists files and folders  
  Example: `ls -alh`

- **cd** – Changes directory  
  Example: `cd ~/projects/ReactApp`

- **mkdir** – Creates directories  
  Example: `mkdir -p src/components`

- **touch** – Creates empty files  
  Example: `touch server.js`

- **alias** – Creates command shortcuts  
  Example: `alias gs='git status'`

- **clear** – Clears the terminal  
  Example: `clear`

---

## 🛠️ 2. File Manipulation & Management

- **cp** – Copies files  
  Example: `cp main.cpp main_backup.cpp`

- **mv** – Moves or renames files  
  Example: `mv old.js new.js`

- **rm** – Deletes files/folders  
  Example: `rm -rf node_modules`

- **ln** – Creates symbolic links  
  Example: `ln -s /var/www/html site_link`

- **tar** – Archives files  
  Example: `tar -xvf source.tar.gz`

- **zip** – Compresses files  
  Example: `zip -r backup.zip src`

- **unzip** – Extracts zip files  
  Example: `unzip project.zip`

- **chmod** – Changes permissions  
  Example: `chmod 755 run.sh`

- **chown** – Changes ownership  
  Example: `sudo chown user:group file`

---

## 🔍 3. Text Processing & Search

- **cat** – Displays file content  
  Example: `cat .env`

- **less** – Scrolls large files  
  Example: `less app.log`

- **grep** – Searches text  
  Example: `grep -r "ERROR" .`

- **find** – Finds files  
  Example: `find . -name "*.cpp"`

- **head** – Shows first lines  
  Example: `head -n 5 file.js`

- **tail** – Shows last lines/logs  
  Example: `tail -f access.log`

- **diff** – Compares files  
  Example: `diff v1.cpp v2.cpp`

- **sed** – Replace text  
  Example: `sed -i 's/dev/prod/g' config.js`

- **awk** – Extracts columns  
  Example: `awk '{print $1}' file.txt`

- **sort** – Sorts content  
  Example: `sort names.txt`

- **wc** – Counts lines  
  Example: `wc -l main.cpp`

- **echo** – Prints text  
  Example: `echo "Done" >> log.txt`

- **tee** – Output + save  
  Example: `ls | tee files.txt`

---

## ⚡ 4. System Monitoring

- **top** – Live system usage  
  Example: `top`

- **htop** – Enhanced top  
  Example: `htop`

- **ps** – Process list  
  Example: `ps aux | grep node`

- **kill** – Stop process  
  Example: `kill -9 1234`

- **df** – Disk usage  
  Example: `df -h`

- **du** – Directory size  
  Example: `du -sh node_modules`

- **free** – RAM usage  
  Example: `free -h`

- **uptime** – System run time  
  Example: `uptime`

- **history** – Command history  
  Example: `history 20`

---

## 🌐 5. Networking

- **ssh** – Remote login  
  Example: `ssh user@server`

- **scp** – Secure copy  
  Example: `scp file.zip user@server:/var/www`

- **ping** – Connectivity check  
  Example: `ping google.com`

- **curl** – API/web requests  
  Example: `curl -I https://google.com`

- **wget** – File download  
  Example: `wget https://site/file.sh`

- **ip a** – Network interfaces  
  Example: `ip a`

---

## ⚙️ 6. Administration & Utilities

- **sudo** – Admin privileges  
  Example: `sudo apt update`

- **apt / yum** – Install packages  
  Example: `sudo apt install g++`

- **whoami** – Current user  
  Example: `whoami`

- **uname** – System info  
  Example: `uname -a`

- **passwd** – Change password  
  Example: `passwd username`

- **date** – Date & time  
  Example: `date`

- **man** – Command manual  
  Example: `man grep`
