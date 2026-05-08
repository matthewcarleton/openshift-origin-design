import * as React from 'react';

const PROMQL_KEYWORDS = new Set([
  'sum',
  'avg',
  'min',
  'max',
  'count',
  'rate',
  'irate',
  'increase',
  'delta',
  'histogram_quantile',
  'by',
  'without',
  'on',
  'ignoring',
  'group_left',
  'group_right',
  'offset',
  'bool',
  'and',
  'or',
  'unless',
  'absent',
  'abs',
  'ceil',
  'floor',
  'round',
  'sqrt',
  'time',
  'vector',
  'scalar',
  'topk',
  'bottomk',
  'count_values',
  'quantile',
]);

const KW_COLOR = '#0066cc';
const STR_COLOR = '#3e8635';
const NUM_COLOR = '#c9190b';
const OP_COLOR = 'var(--pf-t--global--text--color--regular)';
const DEF_COLOR = 'var(--pf-t--global--text--color--regular)';

function highlightPromqlToNodes(source: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  const push = (text: string, color?: string, className?: string) => {
    if (!text) return;
    nodes.push(
      <span key={key++} style={color ? { color } : undefined} className={className}>
        {text}
      </span>
    );
  };

  while (i < source.length) {
    const ch = source[i];
    if (ch === '\n' || ch === '\r' || ch === ' ' || ch === '\t') {
      let j = i;
      while (j < source.length && /[\s\r\n]/.test(source[j])) j++;
      push(source.slice(i, j), undefined, 'pql-ws');
      i = j;
      continue;
    }
    if (ch === '"' || ch === "'") {
      const quote = ch;
      let j = i + 1;
      while (j < source.length && source[j] !== quote) {
        if (source[j] === '\\') j++;
        j++;
      }
      if (j < source.length) j++;
      push(source.slice(i, j), STR_COLOR);
      i = j;
      continue;
    }
    if (ch === '`') {
      let j = i + 1;
      while (j < source.length && source[j] !== '`') j++;
      if (j < source.length) j++;
      push(source.slice(i, j), STR_COLOR);
      i = j;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      let j = i;
      while (j < source.length && /[0-9.eE+\-]/.test(source[j])) j++;
      push(source.slice(i, j), NUM_COLOR);
      i = j;
      continue;
    }
    if (/[a-zA-Z_]/.test(ch)) {
      let j = i;
      while (j < source.length && /[a-zA-Z0-9_]/.test(source[j])) j++;
      const word = source.slice(i, j);
      const lower = word.toLowerCase();
      if (PROMQL_KEYWORDS.has(lower)) {
        push(word, KW_COLOR);
      } else {
        push(word, DEF_COLOR);
      }
      i = j;
      continue;
    }
    push(ch, OP_COLOR);
    i++;
  }
  return nodes;
}

export interface PromqlExpressionFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  validated?: 'default' | 'success' | 'warning' | 'error';
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-describedby'?: string;
}

const TA_STYLE: React.CSSProperties = {
  gridArea: '1 / 1',
  zIndex: 1,
  width: '100%',
  margin: 0,
  padding: '8px 12px',
  fontFamily: 'var(--pf-t--global--FontFamily--monospace, monospace)',
  fontSize: '1rem',
  lineHeight: 1.45,
  color: 'transparent',
  caretColor: 'var(--pf-t--global--text--color--regular)',
  background: 'transparent',
  border: '1px solid var(--pf-t--global--border--color--default)',
  borderRadius: 'var(--pf-t--global--BorderRadius--300, 6px)',
  resize: 'vertical',
  boxSizing: 'border-box',
};

const BACKDROP_STYLE: React.CSSProperties = {
  gridArea: '1 / 1',
  zIndex: 0,
  margin: 0,
  padding: '8px 12px',
  fontFamily: 'var(--pf-t--global--FontFamily--monospace, monospace)',
  fontSize: '1rem',
  lineHeight: 1.45,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  pointerEvents: 'none',
  overflow: 'hidden',
  alignSelf: 'stretch',
  borderRadius: 'var(--pf-t--global--BorderRadius--300, 6px)',
  boxSizing: 'border-box',
};

/**
 * PromQL editor with basic syntax coloring: overlay <pre> + transparent textarea (scroll-synced).
 */
export const PromqlExpressionField: React.FC<PromqlExpressionFieldProps> = ({
  id,
  value,
  onChange,
  placeholder,
  rows = 4,
  validated = 'default',
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}) => {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const backdropRef = React.useRef<HTMLPreElement>(null);
  const taRef = React.useRef<HTMLTextAreaElement>(null);

  const borderColor =
    validated === 'error'
      ? 'var(--pf-t--global--danger-color--100)'
      : validated === 'success'
        ? 'var(--pf-t--global--success-color--100)'
        : 'var(--pf-t--global--border--color--default)';

  const onScroll = () => {
    if (backdropRef.current && taRef.current) {
      backdropRef.current.scrollTop = taRef.current.scrollTop;
      backdropRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  };

  return (
    <div
      ref={wrapRef}
      style={{
        display: 'grid',
        width: '100%',
        gridTemplateColumns: '1fr',
        /* Avoid 1fr here: without a definite grid height it can collapse to 0 in flex layouts */
        gridTemplateRows: 'minmax(min-content, auto)',
      }}
    >
      <pre
        ref={backdropRef}
        aria-hidden="true"
        style={{
          ...BACKDROP_STYLE,
          border: `1px solid ${borderColor}`,
          backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
        }}
      >
        {value ? highlightPromqlToNodes(value) : <span style={{ color: 'var(--pf-t--global--text--color--placeholder)' }}>{placeholder}</span>}
      </pre>
      <textarea
        ref={taRef}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={onScroll}
        rows={rows}
        spellCheck={false}
        autoComplete="off"
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        style={{
          ...TA_STYLE,
          border: `1px solid ${borderColor}`,
        }}
      />
    </div>
  );
};
