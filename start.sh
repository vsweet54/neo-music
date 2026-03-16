#!/bin/sh
echo "Running deploy-commands..."
node deploy-commands.js
echo "Starting bot..."
node index.js
