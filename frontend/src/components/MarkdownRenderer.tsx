import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Renders markdown content with dark-theme styling.
 * Supports GFM: tables, strikethrough, task lists, autolinks.
 */
export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className={`prose-dark ${className}`}
      children={content}
      components={{
        h1: ({ children }) => <h1 className="text-2xl font-bold text-theme-text mb-4 mt-6 first:mt-0">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-bold text-theme-text mb-3 mt-6 first:mt-0">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-bold text-theme-text mb-2 mt-4">{children}</h3>,
        h4: ({ children }) => <h4 className="text-base font-bold text-theme-text mb-2 mt-3">{children}</h4>,
        p: ({ children }) => <p className="text-theme-text-secondary leading-relaxed mb-4 last:mb-0">{children}</p>,
        strong: ({ children }) => <strong className="font-bold text-theme-text">{children}</strong>,
        em: ({ children }) => <em className="italic text-theme-text">{children}</em>,
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            {children}
          </a>
        ),
        ul: ({ children }) => <ul className="list-disc list-inside space-y-1.5 mb-4 text-theme-text-secondary">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1.5 mb-4 text-theme-text-secondary">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary/40 pl-4 my-4 text-theme-text-secondary italic">{children}</blockquote>
        ),
        code: ({ children, className }) => {
          const isBlock = className?.includes('language-');
          if (isBlock) {
            return (
              <pre className="bg-dark-bg border border-dark-border rounded-lg p-4 overflow-x-auto my-4">
                <code className="text-sm text-theme-text font-mono">{children}</code>
              </pre>
            );
          }
          return <code className="bg-dark-surface2 text-primary px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>;
        },
        pre: ({ children }) => <>{children}</>,
        hr: () => <hr className="border-dark-border my-6" />,
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="w-full text-sm text-left border-collapse border border-dark-border">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-dark-surface2">{children}</thead>,
        th: ({ children }) => <th className="px-4 py-2 font-bold text-theme-text-secondary border border-dark-border">{children}</th>,
        td: ({ children }) => <td className="px-4 py-2 text-theme-text-secondary border border-dark-border">{children}</td>,
        img: ({ src, alt }) => (
          <img src={src} alt={alt || ''} className="rounded-lg max-w-full my-4" />
        ),
      }}
    />
  );
}
