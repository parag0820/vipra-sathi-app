import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RichHtmlContentProps {
  html: string;
  baseFontSize?: number;
  isDark?: boolean;
}

type BlockType = 'h1' | 'h2' | 'h3' | 'p' | 'li' | 'blockquote' | 'hr' | 'spacer';

interface ParsedBlock {
  type: BlockType;
  html: string;
  ordered?: boolean;
  listIndex?: number;
}

interface InlineSpan {
  text: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

const ENTITY_MAP: Record<string, string> = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&ndash;': '–',
  '&mdash;': '—',
  '&hellip;': '...',
  '&rsquo;': '’',
  '&lsquo;': '‘',
  '&rdquo;': '”',
  '&ldquo;': '“',
};

const decodeEntities = (str: string): string => {
  return str
    .replace(/&(?:nbsp|amp|lt|gt|quot|#39|apos|ndash|mdash|hellip|rsquo|lsquo|rdquo|ldquo);/gi, (m) => {
      return ENTITY_MAP[m.toLowerCase()] ?? m;
    })
    .replace(/&#(\d+);/g, (_, num) => {
      const code = parseInt(num, 10);
      return Number.isNaN(code) ? '' : String.fromCharCode(code);
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => {
      const code = parseInt(hex, 16);
      return Number.isNaN(code) ? '' : String.fromCharCode(code);
    });
};

const stripTags = (str: string): string => {
  return decodeEntities(str.replace(/<[^>]*>/g, '')).replace(/\u00A0/g, ' ');
};

/**
 * Parses arbitrary WYSIWYG / rich-text HTML (div, p, h1-h4, ul/ol/li, br, strong/b, em/i, u)
 * into structured blocks suitable for native React Native typography rendering.
 */
const parseHtmlToBlocks = (rawInput: string): ParsedBlock[] => {
  if (!rawInput || !rawInput.trim()) return [];

  // Remove script/style contents safely
  const sanitized = rawInput
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .trim();

  // If plain text with no HTML tags, split by newlines cleanly
  if (!/<[a-zA-Z][\s\S]*?>/.test(sanitized)) {
    return sanitized.split(/\r?\n/).map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return { type: 'spacer', html: '' };
      return { type: 'p', html: trimmed };
    });
  }

  const blocks: ParsedBlock[] = [];
  let currentBuffer = '';
  let currentBlockType: BlockType = 'p';
  let listType: 'ul' | 'ol' | null = null;
  let inListItem = false;
  let olCounter = 0;

  const flushBuffer = () => {
    const cleaned = currentBuffer.trim();
    const textOnly = stripTags(cleaned).trim();

    if (!cleaned && currentBlockType !== 'spacer') {
      currentBuffer = '';
      return;
    }

    // Check if block only contains <br> or empty tags -> treat as spacer
    if (!textOnly) {
      if (/<br\s*\/?>/i.test(cleaned)) {
        blocks.push({ type: 'spacer', html: '' });
      }
      currentBuffer = '';
      return;
    }

    blocks.push({
      type: currentBlockType,
      html: cleaned,
      ordered: listType === 'ol',
      listIndex: currentBlockType === 'li' && listType === 'ol' ? olCounter : undefined,
    });
    currentBuffer = '';
  };

  // Tokenize by HTML tags
  const tokenRegex = /(<\/?[a-zA-Z0-9]+(?:\s[^>]*)?\/?>)/g;
  const parts = sanitized.split(tokenRegex);

  for (const part of parts) {
    if (!part) continue;

    if (part.startsWith('<') && part.endsWith('>')) {
      const tagMatch = part.match(/^<(\/?)([a-zA-Z0-9]+)/);
      if (!tagMatch) {
        currentBuffer += part;
        continue;
      }

      const isClosing = tagMatch[1] === '/';
      const tag = tagMatch[2].toLowerCase();

      if (tag === 'hr') {
        flushBuffer();
        blocks.push({ type: 'hr', html: '' });
        currentBlockType = 'p';
        continue;
      }

      if (tag === 'ul' || tag === 'ol') {
        flushBuffer();
        if (isClosing) {
          listType = null;
          inListItem = false;
          olCounter = 0;
        } else {
          listType = tag;
          olCounter = 0;
        }
        currentBlockType = 'p';
        continue;
      }

      if (tag === 'li') {
        flushBuffer();
        if (!isClosing) {
          if (listType === 'ol') olCounter += 1;
          inListItem = true;
          currentBlockType = 'li';
        } else {
          inListItem = false;
          currentBlockType = 'p';
        }
        continue;
      }

      if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4') {
        flushBuffer();
        currentBlockType = isClosing ? (inListItem ? 'li' : 'p') : tag === 'h4' ? 'h3' : (tag as BlockType);
        continue;
      }

      if (tag === 'blockquote') {
        flushBuffer();
        currentBlockType = isClosing ? (inListItem ? 'li' : 'p') : 'blockquote';
        continue;
      }

      if (tag === 'p' || tag === 'div') {
        flushBuffer();
        currentBlockType = inListItem ? 'li' : 'p';
        continue;
      }

      // Preserve inline tags (<br>, <strong>, <b>, <em>, <i>, <u>, <span>, <a>)
      currentBuffer += part;
    } else {
      currentBuffer += part;
    }
  }

  flushBuffer();
  return blocks;
};

const parseInlineSpans = (html: string): InlineSpan[] => {
  // Replace <br> variants inside inline block with newline
  const withNewlines = html.replace(/<br\s*\/?>/gi, '\n');
  const tokenRegex = /(<\/?[a-zA-Z0-9]+(?:\s[^>]*)?\/?>)/g;
  const parts = withNewlines.split(tokenRegex);

  const spans: InlineSpan[] = [];
  let boldDepth = 0;
  let italicDepth = 0;
  let underlineDepth = 0;

  for (const part of parts) {
    if (!part) continue;

    if (part.startsWith('<') && part.endsWith('>')) {
      const tagMatch = part.match(/^<(\/?)([a-zA-Z0-9]+)/);
      if (!tagMatch) continue;
      const isClosing = tagMatch[1] === '/';
      const tag = tagMatch[2].toLowerCase();

      if (tag === 'strong' || tag === 'b') {
        boldDepth = isClosing ? Math.max(0, boldDepth - 1) : boldDepth + 1;
      } else if (tag === 'em' || tag === 'i') {
        italicDepth = isClosing ? Math.max(0, italicDepth - 1) : italicDepth + 1;
      } else if (tag === 'u') {
        underlineDepth = isClosing ? Math.max(0, underlineDepth - 1) : underlineDepth + 1;
      }
      continue;
    }

    const decoded = decodeEntities(part);
    if (decoded.length > 0) {
      spans.push({
        text: decoded,
        bold: boldDepth > 0,
        italic: italicDepth > 0,
        underline: underlineDepth > 0,
      });
    }
  }

  return spans;
};

const isLikelyStepHeading = (plainText: string): boolean => {
  const trimmed = plainText.trim();
  if (trimmed.length === 0 || trimmed.length > 65) return false;
  return /^\d+[\.\)]\s+\S/.test(trimmed);
};

const RichHtmlContent: React.FC<RichHtmlContentProps> = ({
  html,
  baseFontSize = 13.5,
  isDark = false,
}) => {
  const blocks = useMemo(() => parseHtmlToBlocks(html), [html]);

  const textColor = isDark ? '#E5E7EB' : '#374151';
  const headingColor = isDark ? '#FCA5A5' : '#991B1B';
  const dividerColor = isDark ? '#2D2D2D' : '#F3F4F6';
  const lineHeight = baseFontSize * 1.58;

  const renderInline = (inlineHtml: string, keyPrefix: string) => {
    const spans = parseInlineSpans(inlineHtml);
    return spans.map((span, idx) => (
      <Text
        key={`${keyPrefix}_span_${idx}`}
        style={[
          span.bold && styles.boldText,
          span.italic && styles.italicText,
          span.underline && styles.underlineText,
        ]}
      >
        {span.text}
      </Text>
    ));
  };

  if (blocks.length === 0) return null;

  return (
    <View style={styles.container}>
      {blocks.map((block, index) => {
        if (block.type === 'spacer') {
          return <View key={`blk_${index}`} style={styles.spacer} />;
        }

        if (block.type === 'hr') {
          return (
            <View
              key={`blk_${index}`}
              style={[styles.hr, { backgroundColor: dividerColor }]}
            />
          );
        }

        if (block.type === 'h1' || block.type === 'h2' || block.type === 'h3') {
          const bump = block.type === 'h1' ? 4 : block.type === 'h2' ? 2.5 : 1.5;
          return (
            <Text
              key={`blk_${index}`}
              style={[
                styles.headingText,
                {
                  fontSize: baseFontSize + bump,
                  lineHeight: (baseFontSize + bump) * 1.4,
                  color: headingColor,
                },
              ]}
            >
              {renderInline(block.html, `blk_${index}`)}
            </Text>
          );
        }

        if (block.type === 'li') {
          const marker =
            block.ordered && block.listIndex ? `${block.listIndex}.` : '•';
          return (
            <View key={`blk_${index}`} style={styles.listRow}>
              <Text
                style={[
                  styles.listMarker,
                  {
                    fontSize: baseFontSize,
                    lineHeight,
                    color: headingColor,
                  },
                ]}
              >
                {marker}
              </Text>
              <Text
                style={[
                  styles.listContent,
                  {
                    fontSize: baseFontSize,
                    lineHeight,
                    color: textColor,
                  },
                ]}
              >
                {renderInline(block.html, `blk_${index}`)}
              </Text>
            </View>
          );
        }

        if (block.type === 'blockquote') {
          return (
            <View
              key={`blk_${index}`}
              style={[
                styles.blockquote,
                {
                  borderLeftColor: headingColor,
                  backgroundColor: isDark ? '#1E1E1E' : '#FFF8F6',
                },
              ]}
            >
              <Text
                style={{
                  fontSize: baseFontSize,
                  lineHeight,
                  color: textColor,
                  fontStyle: 'italic',
                }}
              >
                {renderInline(block.html, `blk_${index}`)}
              </Text>
            </View>
          );
        }

        const plain = stripTags(block.html).trim();
        const stepHeading = isLikelyStepHeading(plain);

        return (
          <Text
            key={`blk_${index}`}
            style={[
              stepHeading ? styles.stepHeadingText : styles.paragraphText,
              {
                fontSize: stepHeading ? baseFontSize + 1 : baseFontSize,
                lineHeight: stepHeading ? (baseFontSize + 1) * 1.45 : lineHeight,
                color: stepHeading ? headingColor : textColor,
              },
            ]}
          >
            {renderInline(block.html, `blk_${index}`)}
          </Text>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  spacer: {
    height: 8,
  },
  hr: {
    height: 1,
    marginVertical: 10,
  },
  headingText: {
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 4,
  },
  stepHeadingText: {
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 3,
  },
  paragraphText: {
    marginBottom: 5,
    fontWeight: '400',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    paddingLeft: 2,
  },
  listMarker: {
    marginRight: 8,
    fontWeight: '700',
  },
  listContent: {
    flex: 1,
    fontWeight: '400',
  },
  blockquote: {
    borderLeftWidth: 3,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    marginVertical: 6,
  },
  boldText: {
    fontWeight: '700',
  },
  italicText: {
    fontStyle: 'italic',
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
});

export default RichHtmlContent;
