import { Marked } from './vendor/marked/marked.mjs';

export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
export const plainText = html => html.replace(/<[^>]*>/g, ' ').replace(/&(amp|lt|gt|quot|#39);/g, (_, name) => ({amp:'&', lt:'<', gt:'>', quot:'"', '#39':"'"}[name])).replace(/\s+/g, ' ').trim();
const pageId = url => String(url).replace(/-/g, '').match(/[a-f0-9]{32}/i)?.[0].toLowerCase();
const safeUrl = value => /^(?:https?:\/\/|mailto:|#\/|\/assets\/)/i.test(value) && !/[\u0000-\u0020]/.test(value);

export function renderMarkdown(markdown, pages = [], options = {}) {
  const labels = options.labels;
  if (!labels?.table || !labels?.mention) throw new Error("Missing content/interface.json article labels.");
  if (/<unknown\b/.test(markdown)) throw new Error('An unsupported Notion block needs review.');
  const lookup = new Map(pages.filter(page=>page.id).map(page => [page.id, page]));
  const toc = [], tables = [];
  const parser = new Marked({gfm:true, renderer:{
    html({text}) { return /^<br\s*\/?\s*>$/i.test(text.trim()) ? '<br>' : escapeHtml(text); },
    link({href, title, tokens}) {
      const local = /https?:\/\/(?:app\.)?notion\.(?:com|so)\//i.test(href) ? lookup.get(pageId(href)) : null;
      const destination = local ? '#/blog/' + encodeURIComponent(local.slug) : (options.resolveLink?.(href) ?? href);
      const label = this.parser.parseInline(tokens);
      if (!safeUrl(destination)) return label;
      const external = /^https?:\/\//i.test(destination);
      return `<a href="${escapeHtml(destination)}"${title ? ` title="${escapeHtml(title)}"` : ''}${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>`;
    },
    image({href, text}) {
      href = options.resolveLink?.(href) ?? href;
      return safeUrl(href) ? `<img src="${escapeHtml(href)}" alt="${escapeHtml(text)}" loading="lazy" decoding="async">` : escapeHtml(text);
    },
    table({header, rows}) {
      const cell = (item, tag) => `<${tag}${tag === 'th' ? ' scope="col"' : ''}>${this.parser.parseInline(item.tokens)}</${tag}>`;
      return `<div class="article-table" role="region" tabindex="0" aria-label="${escapeHtml(labels.table)}"><table><thead><tr>${header.map(c=>cell(c,'th')).join('')}</tr></thead><tbody>${rows.map(row=>'<tr>'+row.map(c=>cell(c,'td')).join('')+'</tr>').join('')}</tbody></table></div>`;
    },
    heading({depth, tokens}) {
      const title = this.parser.parseInline(tokens), id = 'section-' + (toc.length + 1);
      toc.push({id, title:plainText(title), level:depth});
      return `<h${depth} id="${id}" tabindex="-1">${title}</h${depth}>\n`;
    }
  }});
  const stripAttributes = text => text.replace(/\s*\{(?:color|toggle)="[^"]*"(?:\s+(?:color|toggle)="[^"]*")*\}/g, '');
  const mention = (match, url, label) => {
    const page = lookup.get(pageId(url));
    const title = page?.title || label || labels.mention;
    const destination = page ? '#/blog/' + encodeURIComponent(page.slug) : url;
    return `[${title.replace(/[\\[\]]/g, '\\$&')}](${destination})`;
  };
  const transform = text => {
    text = stripAttributes(text)
      .replace(/<mention-page\s+url="([^"]+)"\s*(?:\/>|>([\s\S]*?)<\/mention-page>)/g, mention)
      .replace(/<empty-block\s*\/>/g, '');
    return text.replace(/<table\b([^>]*)>([\s\S]*?)<\/table>/g, (_, attributes, body) => {
      const rows = [...body.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)];
      if (!rows.length) throw new Error('An empty or unsupported Notion table needs review.');
      const header = /header-row="true"/.test(attributes);
      const rendered = rows.map((row, index) => {
        const cells = [...row[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)];
        if (!cells.length) throw new Error('A Notion table row has no cells.');
        const tag = header && index === 0 ? 'th' : 'td';
        return '<tr>' + cells.map(cell => `<${tag}${tag === 'th' ? ' scope="col"' : ''}>${parser.parseInline(cell[1].trim())}</${tag}>`).join('') + '</tr>';
      });
      const html = `<div class="article-table" role="region" tabindex="0" aria-label="${escapeHtml(labels.table)}"><table>${header ? '<thead>' + rendered.shift() + '</thead>' : ''}<tbody>${rendered.join('')}</tbody></table></div>`;
      const token = 'NOTIONTABLEPLACEHOLDER' + tables.length + 'END';
      if (markdown.includes(token)) throw new Error('Reserved table marker in source.');
      tables.push({token, html});
      return '\n\n' + token + '\n\n';
    });
  };
  // Transform native blocks only outside fences; code remains byte-for-byte literal.
  const pieces = markdown.split(/(^```[^\n]*\n[\s\S]*?^```[^\n]*(?:\n|$))/gm);
  const normalized = options.notion ? pieces.map((piece, index) => {
    if (index % 2) return '\n\n' + piece + '\n\n';
    let previousList = false;
    return transform(piece).split('\n').map(line => {
      const list = /^\s*(?:\d+\.|[-*])\s+/.test(line);
      const separator = list && previousList ? '\n' : '\n\n';
      previousList = list;
      return separator + line;
    }).join('');
  }).join('') : markdown;
  let html = parser.parse(normalized);
  for (const {token, html:table} of tables) html = html.replace('<p>' + token + '</p>', table);
  if (/NOTIONTABLEPLACEHOLDER\d+END/.test(html)) throw new Error('A table was not rendered.');
  return {html, toc, searchText:plainText(html)};
}

export function renderNotion(markdown, pages = [], options = {}) {
  return renderMarkdown(markdown, pages, {...options, notion:true});
}
