#!/bin/bash
git pull
npm install
sequelize db:migrate
pm2 reload 0