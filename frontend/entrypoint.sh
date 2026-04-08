#!/bin/sh
# Iterate over all compiled JS files in the Nginx HTML directory
for file in /usr/share/nginx/html/*.js;
do
  # Replace the placeholder with the actual API_URL environment variable
  if [ ! -z "$API_URL" ]; then
    sed -i "s|API_URL_PLACEHOLDER|$API_URL|g" $file
  fi
done

# Start Nginx in the foreground
exec nginx -g 'daemon off;'
