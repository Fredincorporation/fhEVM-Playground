#!/usr/bin/env bash
set -euo pipefail
SRC="styles.css"
OUTDIR="styles"
README="README.css-sections.md"
mkdir -p "$OUTDIR"
rm -f "$README"

section_count=0
in_divider=0
in_section=0
title=""
outfile=""

while IFS= read -r line || [ -n "$line" ]; do
  if [[ $line =~ ^/\*[[:space:]]+=+ ]]; then
    # start of divider block
    in_divider=1
    div_lines=()
    continue
  fi
  if [ $in_divider -eq 1 ]; then
    if [[ $line =~ \*/ ]]; then
      in_divider=0
      # find first non-empty middle line as title
      title_line=""
      for l in "${div_lines[@]:0}"; do
        ltrim=$(echo "$l" | sed 's/^\s*//;s/\s*$//')
        if [ -n "$ltrim" ] && [[ ! $ltrim =~ ^=+$ ]]; then
          title_line="$ltrim"
          break
        fi
      done
      if [ -z "$title_line" ]; then
        title_line="section-$(printf "%02d" $((section_count+1)))"
      fi
      name="$title_line"
      fname=$(echo "$name" | sed 's/[^A-Za-z0-9 ]//g' | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
      section_count=$((section_count+1))
      outfile="$OUTDIR/$(printf "%02d" $section_count)-${fname}.css"
      printf "/* %s */\n" "$name" > "$outfile"
      echo "## $name" >> "$README"
      echo '```css' >> "$README"
      in_section=1
      div_lines=()
      #!/usr/bin/env bash
      set -euo pipefail

      # This script splits a monolithic styles.css into section files.
      # If styles.css is absent (we now use split files), exit gracefully.

      SRC="styles.css"
      OUTDIR="styles"
      README="README.css-sections.md"

      if [ ! -f "$SRC" ]; then
        echo "styles.css not found — repository uses split files under '$OUTDIR/'."
        echo "If you need to regenerate the split files from a monolith, place styles.css at the repo root and re-run this script."
        exit 0
      fi

      mkdir -p "$OUTDIR"
      rm -f "$README"

      section_count=0
      in_divider=0
      in_section=0
      outfile=""

      while IFS= read -r line || [ -n "$line" ]; do
        if [[ $line =~ ^/\*[[:space:]]+=+ ]]; then
          in_divider=1
          div_lines=()
          continue
        fi

        if [ $in_divider -eq 1 ]; then
          if [[ $line =~ \*/ ]]; then
            in_divider=0
            title_line=""
            for l in "${div_lines[@]:0}"; do
              ltrim=$(echo "$l" | sed 's/^\s*//;s/\s*$//')
              if [ -n "$ltrim" ] && [[ ! $ltrim =~ ^=+$ ]]; then
                title_line="$ltrim"
                break
              fi
            done
            if [ -z "$title_line" ]; then
              title_line="section-$(printf "%02d" $((section_count+1)))"
            fi
            name="$title_line"
            fname=$(echo "$name" | sed 's/[^A-Za-z0-9 ]//g' | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
            section_count=$((section_count+1))
            outfile="$OUTDIR/$(printf "%02d" $section_count)-${fname}.css"
            printf "/* %s */\n" "$name" > "$outfile"
            echo "## $name" >> "$README"
            echo '```css' >> "$README"
            in_section=1
            div_lines=()
            continue
          else
            div_lines+=("$line")
            continue
          fi
        fi

        if [ $in_section -eq 1 ]; then
          if [[ $line =~ ^/\*[[:space:]]+=+ ]]; then
            echo '```' >> "$README"
            in_divider=1
            div_lines=()
            in_section=0
            continue
          fi
          printf "%s\n" "$line" >> "$outfile"
          printf "%s\n" "$line" >> "$README"
        fi

      done < "$SRC"

      if [ $in_section -eq 1 ]; then
        echo '```' >> "$README"
      fi

      echo "Wrote $section_count sections to $OUTDIR/ and generated $README"
