#!/usr/bin/env python3
import os, json, re

def parse_html_sections(html):
    sections = {}
    patterns = {
        'preview_desktop': r'<div class="preview-desktop">([\s\S]*?)</div>\s*(?=<div class="preview-mobile"|<div class="full-desktop"|$)',
        'preview_mobile' : r'<div class="preview-mobile">([\s\S]*?)</div>\s*(?=<div class="full-desktop"|<div class="full-mobile"|$)',
        'full_desktop'   : r'<div class="full-desktop">([\s\S]*?)</div>\s*(?=<div class="full-mobile"|$)',
        'full_mobile'    : r'<div class="full-mobile">([\s\S]*?)</div>\s*$'
    }
    for key, pat in patterns.items():
        m = re.search(pat, html)
        if m:
            sections[key] = m.group(1).strip()
    return sections

def convert_html_to_json(cards_dir='cards', output_file='cardContent.json'):
    card_files = [
        'research_experience.html',
        'photo.html',
        'education.html',
        'professional_experience.html',
        'publications.html',
        'hobbies.html',
        'teaching_and_mentoring_experience.html',
        'coursework.html',
        'achievements.html'
    ]
    card_content = {}
    for fname in card_files:
        path = os.path.join(cards_dir, fname)
        if not os.path.exists(path):
            print(f"⚠️  Missing file: {path}")
            continue
        html = open(path, encoding='utf-8').read()
        card_id = os.path.splitext(fname)[0]
        card_content[card_id] = parse_html_sections(html)

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(card_content, f, indent=2, ensure_ascii=False)
    print(f"✅  Wrote {output_file}")

if __name__ == '__main__':
    convert_html_to_json()
