cd ~ubuntu
cd DINO
git pull
cd client
npm run build
cd..
pm2 reload all