#!/bin/bash

# Script to replace hardcoded API URLs with environment variable

echo "Replacing hardcoded API URLs in frontend files..."

# List of files to update
files=(
  "src/pages/TopicsPage.jsx"
  "src/pages/CustomTopicPage.jsx"
  "src/pages/admin/AdminUsers.jsx"
  "src/pages/admin/AdminDashboard.jsx"
  "src/pages/admin/AdminCategories.jsx"
  "src/pages/admin/AdminAttempts.jsx"
  "src/pages/admin/AdminContacts.jsx"
  "src/pages/admin/AdminTopics.jsx"
  "src/pages/AdminPage.jsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    
    # Add import if not exists
    if ! grep -q "import API_URL from" "$file"; then
      # Find the line with axios import and add API_URL import after it
      sed -i.bak "/import axios from 'axios';/a\\
import API_URL from '../config/api';" "$file" 2>/dev/null || \
      sed -i.bak "/import axios from 'axios';/a\\
import API_URL from '../../config/api';" "$file"
    fi
    
    # Replace all instances of http://localhost:8000
    sed -i.bak "s|'http://localhost:8000|'\${API_URL}|g" "$file"
    sed -i.bak "s|\`http://localhost:8000|\`\${API_URL}|g" "$file"
    
    # Remove backup file
    rm -f "$file.bak"
    
    echo "✓ Updated $file"
  else
    echo "✗ File not found: $file"
  fi
done

echo "Done! All files have been updated."
