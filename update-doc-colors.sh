#!/bin/bash

# This script updates the color scheme in all documentation subpages

echo "Updating color scheme in documentation subpages..."

# Directories to process
DIRS=(
  "src/app/docs/api-gateway-one-sheeter"
  "src/app/docs/integration-brave-leo"
  "src/app/docs/how-to-use-api-gateway"
  "src/app/docs/integration-eliza"
  "src/app/docs/integration-open-web-ui"
  "src/app/docs/cursor-integration"
  "src/app/docs/viewing-models"
  "src/app/docs/creating-api-key"
  "src/app/docs/using-swagger-ui"
  "src/app/docs/what-is-api-gateway"
)

# Color replacements
replacements=(
  # Text colors
  's/text-white/text-[var(--platinum)]/g'
  's/text-gray-[0-9]*/text-[var(--platinum)]/g'
  's/text-blue-[0-9]*/text-[var(--platinum)]/g'
  's/text-green-[0-9]*/text-[var(--platinum)]/g'
  
  # Heading colors
  's/font-bold text-white/font-bold text-[var(--neon-mint)]/g'
  's/font-semibold text-white/font-semibold text-[var(--neon-mint)]/g'
  's/font-medium text-white/font-medium text-[var(--neon-mint)]/g'
  's/font-bold text-gray-[0-9]*/font-bold text-[var(--neon-mint)]/g'
  's/font-semibold text-gray-[0-9]*/font-semibold text-[var(--neon-mint)]/g'
  's/font-medium text-gray-[0-9]*/font-medium text-[var(--neon-mint)]/g'
  
  # Background colors
  's/bg-\[#[0-9a-f]*\]/bg-[var(--eclipse)]/g'
  's/bg-white/bg-[var(--matrix-green)]/g'
  's/bg-gray-[0-9]*/bg-[var(--eclipse)]/g'
  's/bg-blue-[0-9]*/bg-[var(--eclipse)]/g'
  's/bg-green-[0-9]*/bg-[var(--eclipse)]/g'
  
  # Border colors
  's/border-\[#[0-9a-f]*\]/border-[var(--emerald)]\/30/g'
  's/border-gray-[0-9]*/border-[var(--emerald)]\/30/g'
  's/border-blue-[0-9]*/border-[var(--emerald)]\/30/g'
  's/border-green-[0-9]*/border-[var(--emerald)]\/30/g'
  
  # Link colors
  's/text-\[#[0-9a-f]*\] hover:underline/text-[var(--neon-mint)] hover:text-[var(--emerald)]/g'
  's/text-indigo-[0-9]* hover:text-indigo-[0-9]*/text-[var(--neon-mint)] hover:text-[var(--emerald)]/g'
  's/text-blue-[0-9]* hover:text-blue-[0-9]*/text-[var(--neon-mint)] hover:text-[var(--emerald)]/g'
  
  # Button colors
  's/bg-\[#[0-9a-f]*\] hover:bg-\[#[0-9a-f]*\]/bg-[var(--eclipse)] hover:bg-[var(--emerald)]\/30/g'
  
  # Code blocks
  's/bg-\[#[0-9a-f]*\] px-2 py-1 rounded/bg-[var(--midnight)] px-2 py-1 rounded/g'
  's/bg-gray-800 text-gray-100/bg-[var(--midnight)] text-[var(--platinum)]/g'
  
  # Info boxes
  's/bg-\[#[0-9a-f]*\] border-l-4 border-\[#[0-9a-f]*\]/bg-[var(--matrix-green)] border-l-4 border-[var(--neon-mint)]/g'
)

# Process each directory
for dir in "${DIRS[@]}"; do
  if [ -d "$dir" ]; then
    echo "Processing $dir..."
    
    # Find all .tsx files in the directory
    files=$(find "$dir" -name "*.tsx")
    
    # Process each file
    for file in $files; do
      echo "  Updating $file"
      
      # Apply all replacements
      for replacement in "${replacements[@]}"; do
        sed -i '' "$replacement" "$file"
      done
    done
  else
    echo "Directory $dir not found, skipping."
  fi
done

echo "Color scheme update complete!" 