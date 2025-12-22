#!/bin/bash

###############################################################################
# Batch Update fhEVM Version Script
# 
# Purpose: Update @zama.ai/fhevm and related dependencies across all example
#          repositories to maintain consistency and security.
#
# Usage: ./batch-update-fhevm-version.sh [new-version] [--dry-run]
#
# Example:
#   ./batch-update-fhevm-version.sh 0.10.0
#   ./batch-update-fhevm-version.sh 0.10.0 --dry-run
#
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NEW_VERSION="${1:-}"
DRY_RUN="${2:-}"
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXAMPLES_DIR="$(dirname "$CURRENT_DIR")/examples"

# Functions
print_header() {
  echo -e "${BLUE}========================================${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}========================================${NC}"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

validate_version() {
  if [[ ! $NEW_VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    print_error "Invalid version format: $NEW_VERSION"
    echo "Expected format: X.Y.Z (e.g., 0.10.0)"
    exit 1
  fi
  print_success "Version format valid: $NEW_VERSION"
}

find_examples() {
  if [ ! -d "$EXAMPLES_DIR" ]; then
    print_warning "Examples directory not found: $EXAMPLES_DIR"
    echo "Creating examples directory..."
    mkdir -p "$EXAMPLES_DIR"
    return
  fi

  local count=0
  local examples=()
  
  for dir in "$EXAMPLES_DIR"/*; do
    if [ -d "$dir" ] && [ -f "$dir/package.json" ]; then
      examples+=("$dir")
      ((count++))
    fi
  done

  if [ $count -eq 0 ]; then
    print_warning "No example repositories found in $EXAMPLES_DIR"
    return
  fi

  print_success "Found $count example repositories"
  echo ""
}

update_package_json() {
  local pkg_file="$1"
  local example_name="$(basename "$(dirname "$pkg_file")")"

  echo "  Processing: $example_name"

  if ! grep -q "@zama.ai/fhevm" "$pkg_file"; then
    print_warning "    @zama.ai/fhevm not found in dependencies"
    return
  fi

  if [ "$DRY_RUN" = "--dry-run" ]; then
    echo "    [DRY RUN] Would update @zama.ai/fhevm to $NEW_VERSION"
    echo "    Current version:"
    grep "@zama.ai/fhevm" "$pkg_file" | head -1
  else
    # Update using sed (cross-platform compatible)
    if [[ "$OSTYPE" == "darwin"* ]]; then
      # macOS
      sed -i '' "s/\"@zama.ai\/fhevm\": \"[^\"]*\"/\"@zama.ai\/fhevm\": \"^$NEW_VERSION\"/g" "$pkg_file"
    else
      # Linux
      sed -i "s/\"@zama.ai\/fhevm\": \"[^\"]*\"/\"@zama.ai\/fhevm\": \"^$NEW_VERSION\"/g" "$pkg_file"
    fi
    print_success "    Updated @zama.ai/fhevm to ^$NEW_VERSION"
  fi
}

main() {
  print_header "fhEVM Batch Update Script"
  echo ""

  if [ -z "$NEW_VERSION" ]; then
    print_error "Version not provided"
    echo "Usage: $0 [new-version] [--dry-run]"
    echo "Example: $0 0.10.0"
    exit 1
  fi

  validate_version
  echo ""

  if [ "$DRY_RUN" = "--dry-run" ]; then
    print_warning "Running in DRY RUN mode - no files will be modified"
    echo ""
  fi

  print_header "Finding Examples"
  find_examples
  echo ""

  print_header "Updating Dependencies"
  local updated_count=0

  for dir in "$EXAMPLES_DIR"/*; do
    if [ -d "$dir" ] && [ -f "$dir/package.json" ]; then
      update_package_json "$dir/package.json"
      ((updated_count++))
    fi
  done

  echo ""
  print_header "Summary"
  echo "Total examples processed: $updated_count"

  if [ "$DRY_RUN" = "--dry-run" ]; then
    print_warning "DRY RUN completed - no changes made"
    echo "Run without --dry-run to apply changes"
  else
    print_success "Update completed!"
    echo ""
    echo "Next steps:"
    echo "  1. Review changes: git diff package.json"
    echo "  2. Run: npm install"
    echo "  3. Test: npm test"
    echo "  4. Commit: git commit -am 'chore: update fhEVM to $NEW_VERSION'"
  fi

  echo ""
}

# Run main function
main "$@"
